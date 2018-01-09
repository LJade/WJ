var hmConfig = require('../hmConfig.js');
var crypto = require('crypto');
var request = require('request');
var qs = require('querystring');
var WJConf = require('../hmConfig');
var formidable = require("formidable");
var fs = require("fs");

var API_HOST = 'http://jtj.yewufeifei.com/web';

var getArrPost = function (req, key) {
    if(typeof req.body[key] === 'string'){
        req.body[key + "[0]"] = req.body[key];
    }else{
        if(typeof req.body[key] === 'object'){
            req.body[key].forEach(function (id,index) {
                req.body[key + "["+ index +"]"] = id
            });
        }
    }
    delete req.body[key];
    return req
};

var modulesIcon = {
    news:"news.png",
    mail:"mail.png",
    conference:"conference.png",
    document:"document.png",
    notice:"notice.png",
    order:"function.png"
};


var getJADE = function () {
    var env = false;
    WJConf.init(env);
    return hmConfig.jade_config;
};


var getError = function (code,message) {
    var errInfo = {
        msg:message,
        code:-1,
        dat:null
    };
    return JSON.stringify(errInfo);
};


var apiRequest = function (method, url, req) {
    var sessionId = req.session.user === undefined ? "" : req.session.user.accessToken;
    if(method === 'get'){
        //这里对分页做统一处理
        if(req.query.page){
            req.query.page = parseInt(req.query.page)-1;
        }
        req.query.pageSize=10;
        var options_get = {
            url: API_HOST + url + "?" +qs.encode(req.query),
            headers:{
                'WJ-AUTH':sessionId
            }
        };
        console.log(options_get);
        return new Promise(
            function(resolve,reject){
                request( options_get,function(error,response,body){
                    console.log(body);
                    if(error){
                        reject('{"msg": '+ error +',"code": 0,"dat": null')
                    }else{
                        resolve(body);
                    }
                });
            }
        );
    }else{
        var options = {
            url:API_HOST + url,
            method:'POST',
            form:req.body,
            headers:{
                'WJ-AUTH':sessionId
            }
        };
        console.log(options);
        return new Promise(
            function(resolve,reject){
                request(options,function(error,response,body){
                    console.log(body);
                    if(error){
                        reject(error);
                    }else{
                        resolve(body);
                    }
                });
            }
        );
    }
};

var apiRequestWithFiles = function (method, url, req) {
    var sessionId = req.session.user === undefined ? "" : req.session.user.accessToken;
    var options = {
        url:API_HOST + url,
        method:'POST',
        headers:{
            'WJ-AUTH':sessionId
        }
    };
    //获取请求上传的文件
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var formData = fields;
        formData.file = files.file;
        options.formDate = formData;

    });
    return new Promise(
        function(resolve,reject){
            console.log(options);
            request(options,function(error,response,body){
                console.log(body);
                if(error){
                    reject(error);
                }else{
                    resolve(body);
                }
            });
        }
    );
};


var validateRequest = function( params,callback ){
    if(!params.sign){
        callback(0,"非法访问");
        return;
    }
    if(!params.timeStr){
        callback(0,"非法访问");
        return;
    }

    //过期检测
    var requestTimeStamp = new Date().getTime();
    if(requestTimeStamp - params.timeStr > 5*60*1000){
        callback(0,"请求过期");
        return;
    }
    var signStr = params.sign;
    //然后将除sign以外的参数升序排列后拼接
    var keys = Object.keys(params).sort();
    var waitSign = '';
    keys.forEach(function(i){
        if(params[i] && i != 'sign'){
            waitSign += _utf_encode(String(params[i]));
        }
    });
    //检查生成参数列
    if(!waitSign){
        callback(-2,"核验字段错误");
        return;
    }
    //生成本地签名
    var localSign = crypto.createHash('md5').update(waitSign).digest('hex');
    //if(localSign != signStr){
    //    callback(3,"签名不通过");
    //}else{
    //    callback(1,"请求成功");
    //}
    callback(1,"请求成功");
};


var createdSign = function (params) {

    var keys = Object.keys(params).sort();
    var waitSign = '';
    keys.forEach(function(i){
        if(params[i] && i != 'sign'){
            waitSign += _utf_encode(String(params[i]));
        }
    });

    if(!waitSign){
        callback(-2,"核验字段错误");
        return;
    }

    return crypto.createHash('md5').update(waitSign).digest('hex');
};

/**
 * utf编码字符串
 * @param string
 * @returns {string}
 * @private
 */
function _utf_encode(string){
    string = string.replace(/rn/g,"n");
    var utftext ="";
    for (var n = 0; n < string.length; n++){
        var c = string.charCodeAt(n);
        if (c < 128){
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)){
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else{
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}

var getNowFormatDate = function () {

    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    Year= day.getFullYear();//ie火狐下都可以
    Month= day.getMonth()+1;
    Day = day.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10 )
    {
        CurrentDate += Month + "-";
    }
    else
    {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10 )
    {
        CurrentDate += Day ;
    }
    else
    {
        CurrentDate += "0" + Day ;
    }
    return CurrentDate;
};

var dateFormat = function () {
    var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var	_ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

var getPressureFaceLevel = function(resultsLatest){
    var high = resultsLatest.pressureHigh;
    var low = resultsLatest.pressureLow;
    var face = 2;
    var highface = 2;
    var lowface = 2;

    /*比较高压得出高压应该对应的face*/
    if( high<90){
        highface= 1;
    }
    else if( high>=130 &&  high<140){
        highface=3
    }
    else if( high>=140 && high<160  ){
        highface = 4
    }
    else if(high>=160 && high<180  ){
        highface=5
    }
    else if( highface>=180 ){
        highface=6
    }
    /*比较低压得出低压应该对应的face*/
    if( low<60){
        lowface= 1;
    }
    else if(low>=85 &&  low<90 ){
        lowface=3
    }
    else if( low>=90&& low<100 ){
        lowface = 4
    }
    else if(low>=100  && low<110 ){
        lowface=5
    }
    else if( low>=110){
        lowface=6
    }
    /*确定到底是在哪个范围,如果有一个不正常，就选不正常的那个，都不正常，看低压，低压正常，高压高于140，属于第七种情况*/
    if((low>=60 && low<85)&&(high>140)){
        face=7;
    }else if(lowface==2 && highface!==2){
        face = highface;
    }else if(lowface!==2 && highface==2){
        face= lowface;
    }else if(lowface==highface){
        face = lowface;
    }else{
        face=lowface;
    }

    return face;
};

var getSugarFaceLevel = function (resultsLatest) {
    var sugar = resultsLatest.sugarValue;
    var timePoint = resultsLatest.timePoint;
    var face = 2;
    switch (timePoint){
        case "空腹":
            if(sugar<3.9){
                face = 1;
            }else if(sugar>6.1){
                face =3;
            }
            break;
        case "餐后2小时":
            if(sugar>=7.8){
                face = 3;
            }
            break;
        case "其他时间":
            if(sugar>=7.8) {
                face = 3;
            }else if(sugar<2.8){
                face = 1;
            }
            break;
        case "餐后1小时":
            if(sugar>=11.1){
                face = 3;
            }
            break;
    }
    return face;
};

var getBMIFaceLevel = function (resultsLatest) {
    var bmi = resultsLatest.bmiValue;
    var face = 2;
    if(bmi<18.5){
        face=1
    }
    else if( bmi>24.99 && bmi<28 ){
        face=3
    }
    else if(bmi>=28){
        face=4
    }
    return face;
};

function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    };

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    };

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

// private method for UTF-8 decoding
function _utf8_encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }
    return utftext;
}

var coverParams = function (req,type,paramKey,defaultValue) {

    var data = type == 'query' ? req.query : req.body;
    paramKey.forEach(function (key,index) {
        data[key] = data[key] ? data[key] : defaultValue[index]
    });
    req[type] =data;
    return req;
};

var makeZTreeData = function (depInfo,resultsData) {
    var resultsData = resultsData;
    depInfo.forEach(function (data1) {
        var temp = {};
        temp.id = 'dep_' + data1.id;
        temp.label = data1.name;
        temp.parentId = 'dep_' + data1.parentId;
        temp.nocheck = true;
        resultsData.push(temp);
        //加载本层的用户
        data1.users.forEach(function (user1) {
            var userTemp = {};
            userTemp.id = 'user_' + user1.id;
            userTemp.label = user1.name;
            userTemp.parentId = 'dep_' + data1.id;
            resultsData.push(userTemp);
        });
        if(data1.children.length > 0){
            makeZTreeData(data1.children,resultsData);
        }
    });
    return JSON.stringify(resultsData);
};

function formatNum(str){
    var newStr = "";
    var count = 0;

    if(str.indexOf(".")==-1){
        for(var i=str.length-1;i>=0;i--){
            if(count % 3 == 0 && count != 0){
                newStr = str.charAt(i) + "," + newStr;
            }else{
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        return newStr; //自动补小数点后两位
    }
    else
    {
        for(var i = str.indexOf(".")-1;i>=0;i--){
            if(count % 3 == 0 && count != 0){
                newStr = str.charAt(i) + "," + newStr;
            }else{
                newStr = str.charAt(i) + newStr; //逐个字符相接起来
            }
            count++;
        }
        str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
        return str
    }
}

module.exports = {

    _utf_encode:_utf_encode,
    validateRequest:validateRequest,
    createdSign:createdSign,
    getNowFormatDate:getNowFormatDate,
    getPressureFaceLevel:getPressureFaceLevel,
    getSugarFaceLevel:getSugarFaceLevel,
    getBMIFaceLevel:getBMIFaceLevel,
    apiRequest:apiRequest,
    base64Assert:Base64,
    getJADE:getJADE,
    getError:getError,
    coverParams:coverParams,
    getArrPost:getArrPost,
    makeZTreeData:makeZTreeData,
    apiRequestWithFiles:apiRequestWithFiles,
    API_HOST:API_HOST,
    formatNum:formatNum
};
