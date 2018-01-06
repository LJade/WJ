jsPlumbUtil = {
    isArray: function (b) {
        return Object.prototype.toString.call(b) === "[object Array]"
    },
    isString: function (a) {
        return typeof a === "string"
    },
    isBoolean: function (a) {
        return typeof a === "boolean"
    },
    isObject: function (a) {
        return Object.prototype.toString.call(a) === "[object Object]"
    },
    isDate: function (a) {
        return Object.prototype.toString.call(a) === "[object Date]"
    },
    isFunction: function (a) {
        return Object.prototype.toString.call(a) === "[object Function]"
    },
    clone: function (d) {
        if (this.isString(d)) {
            return new String(d)
        } else {
            if (this.isBoolean(d)) {
                return new Boolean(d)
            } else {
                if (this.isDate(d)) {
                    return new Date(d.getTime())
                } else {
                    if (this.isFunction(d)) {
                        return d
                    } else {
                        if (this.isArray(d)) {
                            var c = [];
                            for (var e = 0; e < d.length; e++) {
                                c.push(this.clone(d[e]))
                            }
                            return c
                        } else {
                            if (this.isObject(d)) {
                                var c = {};
                                for (var e in d) {
                                    c[e] = this.clone(d[e])
                                }
                                return c
                            } else {
                                return d
                            }
                        }
                    }
                }
            }
        }
    },
    merge: function (e, d) {
        var k = this.clone(e);
        for (var h in d) {
            if (k[h] == null || this.isString(d[h]) || this.isBoolean(d[h])) {
                k[h] = d[h]
            } else {
                if (this.isArray(d[h]) && this.isArray(k[h])) {
                    var f = [];
                    f.push.apply(f, k[h]);
                    f.push.apply(f, d[h]);
                    k[h] = f
                } else {
                    if (this.isObject(k[h]) && this.isObject(d[h])) {
                        for (var g in d[h]) {
                            k[h][g] = d[h][g]
                        }
                    }
                }
            }
        }
        return k
    },
    convertStyle: function (b, a) {
        if ("transparent" === b) {
            return b
        }
        var g = b, f = function (h) {
            return h.length == 1 ? "0" + h : h
        }, c = function (h) {
            return f(Number(h).toString(16))
        }, d = /(rgb[a]?\()(.*)(\))/;
        if (b.match(d)) {
            var e = b.match(d)[2].split(",");
            g = "#" + c(e[0]) + c(e[1]) + c(e[2]);
            if (!a && e.length == 4) {
                g = g + c(e[3])
            }
        }
        return g
    },
    gradient: function (b, a) {
        b = jsPlumbUtil.isArray(b) ? b : [b.x, b.y];
        a = jsPlumbUtil.isArray(a) ? a : [a.x, a.y];
        return (a[1] - b[1]) / (a[0] - b[0])
    },
    normal: function (b, a) {
        return -1 / jsPlumbUtil.gradient(b, a)
    },
    lineLength: function (b, a) {
        b = jsPlumbUtil.isArray(b) ? b : [b.x, b.y];
        a = jsPlumbUtil.isArray(a) ? a : [a.x, a.y];
        return Math.sqrt(Math.pow(a[1] - b[1], 2) + Math.pow(a[0] - b[0], 2))
    },
    segment: function (b, a) {
        b = jsPlumbUtil.isArray(b) ? b : [b.x, b.y];
        a = jsPlumbUtil.isArray(a) ? a : [a.x, a.y];
        if (a[0] > b[0]) {
            return (a[1] > b[1]) ? 2 : 1
        } else {
            return (a[1] > b[1]) ? 3 : 4
        }
    },
    intersects: function (f, e) {
        var c = f.x, a = f.x + f.w, k = f.y, h = f.y + f.h, d = e.x, b = e.x + e.w, i = e.y, g = e.y + e.h;
        return ((c <= d && d <= a) && (k <= i && i <= h)) || ((c <= b && b <= a) && (k <= i && i <= h)) || ((c <= d && d <= a) && (k <= g && g <= h)) || ((c <= b && d <= a) && (k <= g && g <= h)) || ((d <= c && c <= b) && (i <= k && k <= g)) || ((d <= a && a <= b) && (i <= k && k <= g)) || ((d <= c && c <= b) && (i <= h && h <= g)) || ((d <= a && c <= b) && (i <= h && h <= g))
    },
    segmentMultipliers: [null, [1, -1], [1, 1], [-1, 1], [-1, -1]],
    inverseSegmentMultipliers: [null, [-1, -1], [-1, 1], [1, 1], [1, -1]],
    pointOnLine: function (a, e, b) {
        var d = jsPlumbUtil.gradient(a, e), i = jsPlumbUtil.segment(a, e),
            h = b > 0 ? jsPlumbUtil.segmentMultipliers[i] : jsPlumbUtil.inverseSegmentMultipliers[i], c = Math.atan(d),
            f = Math.abs(b * Math.sin(c)) * h[1], g = Math.abs(b * Math.cos(c)) * h[0];
        return {x: a.x + g, y: a.y + f}
    },
    perpendicularLineTo: function (c, d, e) {
        var b = jsPlumbUtil.gradient(c, d), f = Math.atan(-1 / b), g = e / 2 * Math.sin(f), a = e / 2 * Math.cos(f);
        return [{x: d.x + a, y: d.y + g}, {x: d.x - a, y: d.y - g}]
    },
    findWithFunction: function (b, d) {
        if (b) {
            for (var c = 0; c < b.length; c++) {
                if (d(b[c])) {
                    return c
                }
            }
        }
        return -1
    },
    indexOf: function (a, b) {
        return jsPlumbUtil.findWithFunction(a, function (c) {
            return c == b
        })
    },
    removeWithFunction: function (c, d) {
        var b = jsPlumbUtil.findWithFunction(c, d);
        if (b > -1) {
            c.splice(b, 1)
        }
        return b != -1
    },
    remove: function (b, c) {
        var a = jsPlumbUtil.indexOf(b, c);
        if (a > -1) {
            b.splice(a, 1)
        }
        return a != -1
    },
    addWithFunction: function (c, b, a) {
        if (jsPlumbUtil.findWithFunction(c, a) == -1) {
            c.push(b)
        }
    },
    addToList: function (d, b, c) {
        var a = d[b];
        if (a == null) {
            a = [], d[b] = a
        }
        a.push(c);
        return a
    },
    EventGenerator: function () {
        var c = {}, b = this;
        var a = ["ready"];
        this.bind = function (d, e) {
            jsPlumbUtil.addToList(c, d, e);
            return b
        };
        this.fire = function (g, h, d) {
            if (c[g]) {
                for (var f = 0; f < c[g].length; f++) {
                    if (jsPlumbUtil.findWithFunction(a, function (i) {
                            return i === g
                        }) != -1) {
                        c[g][f](h, d)
                    } else {
                        try {
                            c[g][f](h, d)
                        } catch (k) {
                            jsPlumbUtil.log("jsPlumb: fire failed for event " + g + " : " + k)
                        }
                    }
                }
            }
            return b
        };
        this.unbind = function (d) {
            if (d) {
                delete c[d]
            } else {
                c = {}
            }
            return b
        };
        this.getListener = function (d) {
            return c[d]
        }
    },
    logEnabled: true,
    log: function () {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            try {
                var b = arguments[arguments.length - 1];
                console.log(b)
            } catch (a) {
            }
        }
    },
    group: function (a) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.group(a)
        }
    },
    groupEnd: function (a) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.groupEnd(a)
        }
    },
    time: function (a) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.time(a)
        }
    },
    timeEnd: function (a) {
        if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            console.timeEnd(a)
        }
    }
};
(function () {
    var b = !!document.createElement("canvas").getContext,
        a = !!window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
        d = function () {
            if (d.vml == undefined) {
                var f = document.body.appendChild(document.createElement("div"));
                f.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
                var e = f.firstChild;
                e.style.behavior = "url(#default#VML)";
                d.vml = e ? typeof e.adj == "object" : true;
                f.parentNode.removeChild(f)
            }
            return d.vml
        };
    var c = function (i) {
        var h = {}, g = [], f = {}, e = {};
        this.register = function (n) {
            var m = jsPlumb.CurrentLibrary;
            n = m.getElementObject(n);
            var p = i.getId(n), l = m.getDOMElement(n), k = m.getOffset(n);
            if (!h[p]) {
                h[p] = n;
                g.push(n);
                f[p] = {}
            }
            var o = function (u, q) {
                if (u) {
                    for (var r = 0; r < u.childNodes.length; r++) {
                        if (u.childNodes[r].nodeType != 3) {
                            var t = m.getElementObject(u.childNodes[r]), v = i.getId(t, null, true);
                            if (v && e[v] && e[v] > 0) {
                                var s = m.getOffset(t);
                                f[p][v] = {id: v, offset: {left: s.left - k.left, top: s.top - k.top}}
                            }
                            o(u.childNodes[r])
                        }
                    }
                }
            };
            o(l)
        };
        this.updateOffsets = function (o) {
            var r = jsPlumb.CurrentLibrary, m = r.getElementObject(o), l = i.getId(m), n = f[l], k = r.getOffset(m);
            if (n) {
                for (var q in n) {
                    var s = r.getElementObject(q), p = r.getOffset(s);
                    f[l][q] = {id: q, offset: {left: p.left - k.left, top: p.top - k.top}}
                }
            }
        };
        this.endpointAdded = function (m) {
            var r = jsPlumb.CurrentLibrary, u = document.body, k = i.getId(m), t = r.getDOMElement(m), l = t.parentNode,
                o = l == u;
            e[k] = e[k] ? e[k] + 1 : 1;
            while (l != u) {
                var q = i.getId(l, null, true);
                if (q && h[q]) {
                    var w = -1, s = r.getElementObject(l), n = r.getOffset(s);
                    if (f[q][k] == null) {
                        var v = jsPlumb.CurrentLibrary.getOffset(m);
                        f[q][k] = {id: k, offset: {left: v.left - n.left, top: v.top - n.top}}
                    }
                    break
                }
                l = l.parentNode
            }
        };
        this.endpointDeleted = function (l) {
            if (e[l.elementId]) {
                e[l.elementId]--;
                if (e[l.elementId] <= 0) {
                    for (var k in f) {
                        delete f[k][l.elementId]
                    }
                }
            }
        };
        this.getElementsForDraggable = function (k) {
            return f[k]
        };
        this.reset = function () {
            h = {};
            g = [];
            f = {};
            e = {}
        }
    };
    if (!window.console) {
        window.console = {
            time: function () {
            }, timeEnd: function () {
            }, group: function () {
            }, groupEnd: function () {
            }, log: function () {
            }
        }
    }
    window.jsPlumbAdapter = {
        headless: false, appendToRoot: function (e) {
            document.body.appendChild(e)
        }, getRenderModes: function () {
            return ["canvas", "svg", "vml"]
        }, isRenderModeAvailable: function (e) {
            return {canvas: b, svg: a, vml: d()}[e]
        }, getDragManager: function (e) {
            return new c(e)
        }, setRenderMode: function (i) {
            var h;
            if (i) {
                i = i.toLowerCase();
                var f = this.isRenderModeAvailable("canvas"), e = this.isRenderModeAvailable("svg"),
                    g = this.isRenderModeAvailable("vml");
                if (i === "svg") {
                    if (e) {
                        h = "svg"
                    } else {
                        if (f) {
                            h = "canvas"
                        } else {
                            if (g) {
                                h = "vml"
                            }
                        }
                    }
                } else {
                    if (i === "canvas" && f) {
                        h = "canvas"
                    } else {
                        if (g) {
                            h = "vml"
                        }
                    }
                }
            }
            return h
        }
    }
})();
(function () {
    var g = jsPlumbUtil.findWithFunction, G = jsPlumbUtil.indexOf, A = jsPlumbUtil.removeWithFunction,
        k = jsPlumbUtil.remove, r = jsPlumbUtil.addWithFunction, i = jsPlumbUtil.addToList, l = jsPlumbUtil.isArray,
        z = jsPlumbUtil.isString, u = jsPlumbUtil.isObject;
    var v = null, c = function (H, I) {
            return n.CurrentLibrary.getAttribute(C(H), I)
        }, d = function (I, J, H) {
            n.CurrentLibrary.setAttribute(C(I), J, H)
        }, y = function (I, H) {
            n.CurrentLibrary.addClass(C(I), H)
        }, h = function (I, H) {
            return n.CurrentLibrary.hasClass(C(I), H)
        }, m = function (I, H) {
            n.CurrentLibrary.removeClass(C(I), H)
        }, C = function (H) {
            return n.CurrentLibrary.getElementObject(H)
        }, s = function (I, H) {
            var K = n.CurrentLibrary.getOffset(C(I));
            if (H != null) {
                var J = H.getZoom();
                return {left: K.left / J, top: K.top / J}
            } else {
                return K
            }
        }, a = function (H) {
            return n.CurrentLibrary.getSize(C(H))
        }, o = jsPlumbUtil.log, F = jsPlumbUtil.group, f = jsPlumbUtil.groupEnd, E = jsPlumbUtil.time,
        t = jsPlumbUtil.timeEnd, p = function () {
            return "" + (new Date()).getTime()
        }, B = function (aa) {
            var U = this, ab = arguments, S = false, M = aa.parameters || {}, K = U.idPrefix,
                X = K + (new Date()).getTime(), W = null, ac = null;
            U._jsPlumb = aa._jsPlumb;
            U.getId = function () {
                return X
            };
            U.tooltip = aa.tooltip;
            U.hoverClass = aa.hoverClass || U._jsPlumb.Defaults.HoverClass || n.Defaults.HoverClass;
            jsPlumbUtil.EventGenerator.apply(this);
            this.clone = function () {
                var ad = new Object();
                U.constructor.apply(ad, ab);
                return ad
            };
            this.getParameter = function (ad) {
                return M[ad]
            }, this.getParameters = function () {
                return M
            }, this.setParameter = function (ad, ae) {
                M[ad] = ae
            }, this.setParameters = function (ad) {
                M = ad
            }, this.overlayPlacements = [];
            var L = aa.beforeDetach;
            this.isDetachAllowed = function (ad) {
                var ae = U._jsPlumb.checkCondition("beforeDetach", ad);
                if (L) {
                    try {
                        ae = L(ad)
                    } catch (af) {
                        o("jsPlumb: beforeDetach callback failed", af)
                    }
                }
                return ae
            };
            var O = aa.beforeDrop;
            this.isDropAllowed = function (ai, af, ag, ad, ae) {
                var ah = U._jsPlumb.checkCondition("beforeDrop", {
                    sourceId: ai,
                    targetId: af,
                    scope: ag,
                    connection: ad,
                    dropEndpoint: ae
                });
                if (O) {
                    try {
                        ah = O({sourceId: ai, targetId: af, scope: ag, connection: ad, dropEndpoint: ae})
                    } catch (aj) {
                        o("jsPlumb: beforeDrop callback failed", aj)
                    }
                }
                return ah
            };
            var Y = function () {
                if (W && ac) {
                    var ad = {};
                    n.extend(ad, W);
                    n.extend(ad, ac);
                    delete U.hoverPaintStyle;
                    if (ad.gradient && W.fillStyle) {
                        delete ad.gradient
                    }
                    ac = ad
                }
            };
            this.setPaintStyle = function (ad, ae) {
                W = ad;
                U.paintStyleInUse = W;
                Y();
                if (!ae) {
                    U.repaint()
                }
            };
            this.getPaintStyle = function () {
                return W
            };
            this.setHoverPaintStyle = function (ad, ae) {
                ac = ad;
                Y();
                if (!ae) {
                    U.repaint()
                }
            };
            this.getHoverPaintStyle = function () {
                return ac
            };
            this.setHover = function (ad, af, ae) {
                if (!U._jsPlumb.currentlyDragging && !U._jsPlumb.isHoverSuspended()) {
                    S = ad;
                    if (U.hoverClass != null && U.canvas != null) {
                        if (ad) {
                            J.addClass(U.canvas, U.hoverClass)
                        } else {
                            J.removeClass(U.canvas, U.hoverClass)
                        }
                    }
                    if (ac != null) {
                        U.paintStyleInUse = ad ? ac : W;
                        ae = ae || p();
                        U.repaint({timestamp: ae, recalc: false})
                    }
                    if (U.getAttachedElements && !af) {
                        Z(ad, p(), U)
                    }
                }
            };
            this.isHover = function () {
                return S
            };
            var V = null;
            this.setZIndex = function (ad) {
                V = ad
            };
            this.getZIndex = function () {
                return V
            };
            var J = n.CurrentLibrary,
                I = ["click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu"],
                T = {mouseout: "mouseexit"}, N = function (af, ag, ae) {
                    var ad = T[ae] || ae;
                    J.bind(af, ae, function (ah) {
                        ag.fire(ad, ag, ah)
                    })
                }, R = function (af, ae) {
                    var ad = T[ae] || ae;
                    J.unbind(af, ae)
                };
            this.attachListeners = function (ae, af) {
                for (var ad = 0; ad < I.length; ad++) {
                    N(ae, af, I[ad])
                }
            };
            var Z = function (ah, ag, ad) {
                var af = U.getAttachedElements();
                if (af) {
                    for (var ae = 0; ae < af.length; ae++) {
                        if (!ad || ad != af[ae]) {
                            af[ae].setHover(ah, true, ag)
                        }
                    }
                }
            };
            this.reattachListenersForElement = function (ae) {
                if (arguments.length > 1) {
                    for (var ad = 0; ad < I.length; ad++) {
                        R(ae, I[ad])
                    }
                    for (var ad = 1; ad < arguments.length; ad++) {
                        U.attachListeners(ae, arguments[ad])
                    }
                }
            };
            var H = [], P = function (ad) {
                return ad == null ? null : ad.split(" ")
            }, Q = function (ae) {
                if (U.getDefaultType) {
                    var ag = U.getTypeDescriptor();
                    var af = jsPlumbUtil.merge({}, U.getDefaultType());
                    for (var ad = 0; ad < H.length; ad++) {
                        af = jsPlumbUtil.merge(af, U._jsPlumb.getType(H[ad], ag))
                    }
                    U.applyType(af);
                    if (!ae) {
                        U.repaint()
                    }
                }
            };
            U.setType = function (ad, ae) {
                H = P(ad) || [];
                Q(ae)
            };
            U.getType = function () {
                return H
            };
            U.hasType = function (ad) {
                return jsPlumbUtil.indexOf(H, ad) != -1
            };
            U.addType = function (af, ag) {
                var ae = P(af), ah = false;
                if (ae != null) {
                    for (var ad = 0; ad < ae.length; ad++) {
                        if (!U.hasType(ae[ad])) {
                            H.push(ae[ad]);
                            ah = true
                        }
                    }
                    if (ah) {
                        Q(ag)
                    }
                }
            };
            U.removeType = function (ag, ah) {
                var ae = P(ag), ai = false, af = function (ak) {
                    var aj = jsPlumbUtil.indexOf(H, ak);
                    if (aj != -1) {
                        H.splice(aj, 1);
                        return true
                    }
                    return false
                };
                if (ae != null) {
                    for (var ad = 0; ad < ae.length; ad++) {
                        ai = af(ae[ad]) || ai
                    }
                    if (ai) {
                        Q(ah)
                    }
                }
            };
            U.toggleType = function (ag, ah) {
                var af = P(ag);
                if (af != null) {
                    for (var ae = 0; ae < af.length; ae++) {
                        var ad = jsPlumbUtil.indexOf(H, af[ae]);
                        if (ad != -1) {
                            H.splice(ad, 1)
                        } else {
                            H.push(af[ae])
                        }
                    }
                    Q(ah)
                }
            };
            this.applyType = function (ae) {
                U.setPaintStyle(ae.paintStyle);
                U.setHoverPaintStyle(ae.hoverPaintStyle);
                if (ae.parameters) {
                    for (var ad in ae.parameters) {
                        U.setParameter(ad, ae.parameters[ad])
                    }
                }
            }
        }, x = function (M) {
            B.apply(this, arguments);
            var S = this;
            this.overlays = [];
            var K = function (X) {
                var V = null;
                if (l(X)) {
                    var U = X[0], W = n.extend({component: S, _jsPlumb: S._jsPlumb}, X[1]);
                    if (X.length == 3) {
                        n.extend(W, X[2])
                    }
                    V = new n.Overlays[S._jsPlumb.getRenderMode()][U](W);
                    if (W.events) {
                        for (var T in W.events) {
                            V.bind(T, W.events[T])
                        }
                    }
                } else {
                    if (X.constructor == String) {
                        V = new n.Overlays[S._jsPlumb.getRenderMode()][X]({component: S, _jsPlumb: S._jsPlumb})
                    } else {
                        V = X
                    }
                }
                S.overlays.push(V)
            }, L = function (X) {
                var T = S.defaultOverlayKeys || [], W = X.overlays, U = function (Y) {
                    return S._jsPlumb.Defaults[Y] || n.Defaults[Y] || []
                };
                if (!W) {
                    W = []
                }
                for (var V = 0; V < T.length; V++) {
                    W.unshift.apply(W, U(T[V]))
                }
                return W
            };
            var I = L(M);
            if (I) {
                for (var O = 0; O < I.length; O++) {
                    K(I[O])
                }
            }
            var H = function (V) {
                var T = -1;
                for (var U = 0; U < S.overlays.length; U++) {
                    if (V === S.overlays[U].id) {
                        T = U;
                        break
                    }
                }
                return T
            };
            this.addOverlay = function (T, U) {
                K(T);
                if (!U) {
                    S.repaint()
                }
            };
            this.getOverlay = function (U) {
                var T = H(U);
                return T >= 0 ? S.overlays[T] : null
            };
            this.getOverlays = function () {
                return S.overlays
            };
            this.hideOverlay = function (U) {
                var T = S.getOverlay(U);
                if (T) {
                    T.hide()
                }
            };
            this.hideOverlays = function () {
                for (var T = 0; T < S.overlays.length; T++) {
                    S.overlays[T].hide()
                }
            };
            this.showOverlay = function (U) {
                var T = S.getOverlay(U);
                if (T) {
                    T.show()
                }
            };
            this.showOverlays = function () {
                for (var T = 0; T < S.overlays.length; T++) {
                    S.overlays[T].show()
                }
            };
            this.removeAllOverlays = function () {
                for (var T = 0; T < S.overlays.length; T++) {
                    if (S.overlays[T].cleanup) {
                        S.overlays[T].cleanup()
                    }
                }
                S.overlays.splice(0, S.overlays.length);
                S.repaint()
            };
            this.removeOverlay = function (U) {
                var T = H(U);
                if (T != -1) {
                    var V = S.overlays[T];
                    if (V.cleanup) {
                        V.cleanup()
                    }
                    S.overlays.splice(T, 1)
                }
            };
            this.removeOverlays = function () {
                for (var T = 0; T < arguments.length; T++) {
                    S.removeOverlay(arguments[T])
                }
            };
            var J = "__label", R = function (V) {
                var T = {cssClass: V.cssClass, labelStyle: this.labelStyle, id: J, component: S, _jsPlumb: S._jsPlumb},
                    U = n.extend(T, V);
                return new n.Overlays[S._jsPlumb.getRenderMode()].Label(U)
            };
            if (M.label) {
                var P = M.labelLocation || S.defaultLabelLocation || 0.5,
                    Q = M.labelStyle || S._jsPlumb.Defaults.LabelStyle || n.Defaults.LabelStyle;
                this.overlays.push(R({label: M.label, location: P, labelStyle: Q}))
            }
            this.setLabel = function (T) {
                var U = S.getOverlay(J);
                if (!U) {
                    var V = T.constructor == String || T.constructor == Function ? {label: T} : T;
                    U = R(V);
                    this.overlays.push(U)
                } else {
                    if (T.constructor == String || T.constructor == Function) {
                        U.setLabel(T)
                    } else {
                        if (T.label) {
                            U.setLabel(T.label)
                        }
                        if (T.location) {
                            U.setLocation(T.location)
                        }
                    }
                }
                if (!S._jsPlumb.isSuspendDrawing()) {
                    S.repaint()
                }
            };
            this.getLabel = function () {
                var T = S.getOverlay(J);
                return T != null ? T.getLabel() : null
            };
            this.getLabelOverlay = function () {
                return S.getOverlay(J)
            };
            var N = this.applyType;
            this.applyType = function (U) {
                N(U);
                S.removeAllOverlays();
                if (U.overlays) {
                    for (var T = 0; T < U.overlays.length; T++) {
                        S.addOverlay(U.overlays[T], true)
                    }
                }
            }
        }, D = function (J, H, I) {
            J.bind("click", function (K, L) {
                H.fire("click", H, L)
            });
            J.bind("dblclick", function (K, L) {
                H.fire("dblclick", H, L)
            });
            J.bind("contextmenu", function (K, L) {
                H.fire("contextmenu", H, L)
            });
            J.bind("mouseenter", function (K, L) {
                if (!H.isHover()) {
                    I(true);
                    H.fire("mouseenter", H, L)
                }
            });
            J.bind("mouseexit", function (K, L) {
                if (H.isHover()) {
                    I(false);
                    H.fire("mouseexit", H, L)
                }
            })
        };
    var e = 0, b = function () {
        var H = e + 1;
        e++;
        return H
    };
    var w = function (I) {
        this.Defaults = {
            Anchor: "BottomCenter",
            Anchors: [null, null],
            ConnectionsDetachable: true,
            ConnectionOverlays: [],
            Connector: "Bezier",
            ConnectorZIndex: null,
            Container: null,
            DragOptions: {},
            DropOptions: {},
            Endpoint: "Dot",
            EndpointOverlays: [],
            Endpoints: [null, null],
            EndpointStyle: {fillStyle: "#456"},
            EndpointStyles: [null, null],
            EndpointHoverStyle: null,
            EndpointHoverStyles: [null, null],
            HoverPaintStyle: null,
            LabelStyle: {color: "black"},
            LogEnabled: false,
            Overlays: [],
            MaxConnections: 1,
            PaintStyle: {lineWidth: 8, strokeStyle: "#456"},
            ReattachConnections: false,
            RenderMode: "svg",
            Scope: "jsPlumb_DefaultScope"
        };
        if (I) {
            n.extend(this.Defaults, I)
        }
        this.logEnabled = this.Defaults.LogEnabled;
        var a4 = {}, al = {};
        this.registerConnectionType = function (bA, bz) {
            a4[bA] = n.extend({}, bz)
        };
        this.registerConnectionTypes = function (bA) {
            for (var bz in bA) {
                a4[bz] = n.extend({}, bA[bz])
            }
        };
        this.registerEndpointType = function (bA, bz) {
            al[bA] = n.extend({}, bz)
        };
        this.registerEndpointTypes = function (bA) {
            for (var bz in bA) {
                al[bz] = n.extend({}, bA[bz])
            }
        };
        this.getType = function (bA, bz) {
            return bz === "connection" ? a4[bA] : al[bA]
        };
        jsPlumbUtil.EventGenerator.apply(this);
        var br = this, aO = b(), aR = br.bind, aE = {}, ad = 1;
        this.setZoom = function (bA, bz) {
            ad = bA;
            if (bz) {
                br.repaintEverything()
            }
        };
        this.getZoom = function () {
            return ad
        };
        for (var aD in this.Defaults) {
            aE[aD] = this.Defaults[aD]
        }
        this.bind = function (bA, bz) {
            if ("ready" === bA && K) {
                bz()
            } else {
                aR.apply(br, [bA, bz])
            }
        };
        br.importDefaults = function (bA) {
            for (var bz in bA) {
                br.Defaults[bz] = bA[bz]
            }
        };
        br.restoreDefaults = function () {
            br.Defaults = n.extend({}, aE)
        };
        var O = null, bj = null, K = false, a0 = {}, aV = {}, aW = {}, aj = {}, bu = {}, bk = {}, bq = {}, by = [],
            ag = [], R = this.Defaults.Scope, Y = null, W = function (bC, bA, bB) {
                var bz = bC[bA];
                if (bz == null) {
                    bz = [];
                    bC[bA] = bz
                }
                bz.push(bB);
                return bz
            }, aX = function (bA, bz) {
                if (br.Defaults.Container) {
                    n.CurrentLibrary.appendElement(bA, br.Defaults.Container)
                } else {
                    if (!bz) {
                        jsPlumbAdapter.appendToRoot(bA)
                    } else {
                        n.CurrentLibrary.appendElement(bA, bz)
                    }
                }
            }, aF = 1, an = function () {
                return "" + aF++
            }, aL = function (bz) {
                return bz._nodes ? bz._nodes : bz
            }, be = function (bB, bD, bC) {
                if (!jsPlumbAdapter.headless && !a9) {
                    var bE = c(bB, "id"), bz = br.dragManager.getElementsForDraggable(bE);
                    if (bC == null) {
                        bC = p()
                    }
                    br.anchorManager.redraw(bE, bD, bC);
                    if (bz) {
                        for (var bA in bz) {
                            br.anchorManager.redraw(bz[bA].id, bD, bC, bz[bA].offset)
                        }
                    }
                }
            }, aJ = function (bA, bC) {
                var bD = null;
                if (l(bA)) {
                    bD = [];
                    for (var bz = 0; bz < bA.length; bz++) {
                        var bB = C(bA[bz]), bE = c(bB, "id");
                        bD.push(bC(bB, bE))
                    }
                } else {
                    var bB = C(bA), bE = c(bB, "id");
                    bD = bC(bB, bE)
                }
                return bD
            }, ax = function (bz) {
                return aW[bz]
            }, bg = function (bD, bz, bG) {
                if (!jsPlumbAdapter.headless) {
                    var bI = bz == null ? false : bz, bE = n.CurrentLibrary;
                    if (bI) {
                        if (bE.isDragSupported(bD) && !bE.isAlreadyDraggable(bD)) {
                            var bH = bG || br.Defaults.DragOptions || n.Defaults.DragOptions;
                            bH = n.extend({}, bH);
                            var bF = bE.dragEvents.drag, bA = bE.dragEvents.stop, bC = bE.dragEvents.start;
                            bH[bC] = ap(bH[bC], function () {
                                br.setHoverSuspended(true)
                            });
                            bH[bF] = ap(bH[bF], function () {
                                var bJ = bE.getUIPosition(arguments, br.getZoom());
                                be(bD, bJ);
                                y(bD, "jsPlumb_dragged")
                            });
                            bH[bA] = ap(bH[bA], function () {
                                var bJ = bE.getUIPosition(arguments, br.getZoom());
                                be(bD, bJ);
                                m(bD, "jsPlumb_dragged");
                                br.setHoverSuspended(false)
                            });
                            var bB = H(bD);
                            bq[bB] = true;
                            var bI = bq[bB];
                            bH.disabled = bI == null ? false : !bI;
                            bE.initDraggable(bD, bH, false);
                            br.dragManager.register(bD)
                        }
                    }
                }
            }, aC = function (bF, bA) {
                var bz = n.extend({sourceIsNew: true, targetIsNew: true}, bF);
                if (bA) {
                    n.extend(bz, bA)
                }
                if (bz.source && bz.source.endpoint) {
                    bz.sourceEndpoint = bz.source
                }
                if (bz.source && bz.target.endpoint) {
                    bz.targetEndpoint = bz.target
                }
                if (bF.uuids) {
                    bz.sourceEndpoint = ax(bF.uuids[0]);
                    bz.targetEndpoint = ax(bF.uuids[1])
                }
                if (bz.sourceEndpoint && bz.sourceEndpoint.isFull()) {
                    o(br, "could not add connection; source endpoint is full");
                    return
                }
                if (bz.targetEndpoint && bz.targetEndpoint.isFull()) {
                    o(br, "could not add connection; target endpoint is full");
                    return
                }
                if (bz.sourceEndpoint) {
                    bz.sourceIsNew = false
                }
                if (bz.targetEndpoint) {
                    bz.targetIsNew = false
                }
                if (!bz.type && bz.sourceEndpoint) {
                    bz.type = bz.sourceEndpoint.connectionType
                }
                if (bz.sourceEndpoint && bz.sourceEndpoint.connectorOverlays) {
                    bz.overlays = bz.overlays || [];
                    for (var bD = 0; bD < bz.sourceEndpoint.connectorOverlays.length; bD++) {
                        bz.overlays.push(bz.sourceEndpoint.connectorOverlays[bD])
                    }
                }
                bz.tooltip = bF.tooltip;
                if (!bz.tooltip && bz.sourceEndpoint && bz.sourceEndpoint.connectorTooltip) {
                    bz.tooltip = bz.sourceEndpoint.connectorTooltip
                }
                if (bz.target && !bz.target.endpoint && !bz.targetEndpoint && !bz.newConnection) {
                    var bE = H(bz.target), bG = a1[bE], bB = aK[bE];
                    if (bG) {
                        if (!am[bE]) {
                            return
                        }
                        var bC = bB != null ? bB : br.addEndpoint(bz.target, bG);
                        if (bl[bE]) {
                            aK[bE] = bC
                        }
                        bz.targetEndpoint = bC;
                        bC._makeTargetCreator = true;
                        bz.targetIsNew = true
                    }
                }
                if (bz.source && !bz.source.endpoint && !bz.sourceEndpoint && !bz.newConnection) {
                    var bE = H(bz.source), bG = aB[bE], bB = a6[bE];
                    if (bG) {
                        if (!ae[bE]) {
                            return
                        }
                        var bC = bB != null ? bB : br.addEndpoint(bz.source, bG);
                        if (bc[bE]) {
                            a6[bE] = bC
                        }
                        bz.sourceEndpoint = bC;
                        bz.sourceIsNew = true
                    }
                }
                return bz
            }, af = function (bD) {
                var bC = br.Defaults.ConnectionType || br.getDefaultConnectionType(), bB = br.Defaults.EndpointType || ah,
                    bA = n.CurrentLibrary.getParent;
                if (bD.container) {
                    bD.parent = bD.container
                } else {
                    if (bD.sourceEndpoint) {
                        bD.parent = bD.sourceEndpoint.parent
                    } else {
                        if (bD.source.constructor == bB) {
                            bD.parent = bD.source.parent
                        } else {
                            bD.parent = bA(bD.source)
                        }
                    }
                }
                bD._jsPlumb = br;
                var bz = new bC(bD);
                bz.id = "con_" + an();
                bw("click", "click", bz);
                bw("dblclick", "dblclick", bz);
                bw("contextmenu", "contextmenu", bz);
                return bz
            }, bx = function (bB, bC, bz) {
                bC = bC || {};
                if (!bB.suspendedEndpoint) {
                    W(a0, bB.scope, bB)
                }
                if (!bC.doNotFireConnectionEvent && bC.fireEvent !== false) {
                    var bA = {
                        connection: bB,
                        source: bB.source,
                        target: bB.target,
                        sourceId: bB.sourceId,
                        targetId: bB.targetId,
                        sourceEndpoint: bB.endpoints[0],
                        targetEndpoint: bB.endpoints[1]
                    };
                    br.fire("jsPlumbConnection", bA, bz);
                    br.fire("connection", bA, bz)
                }
                br.anchorManager.newConnection(bB);
                be(bB.source)
            }, bw = function (bz, bA, bB) {
                bB.bind(bz, function (bD, bC) {
                    br.fire(bA, bB, bC)
                })
            }, ay = function (bB) {
                if (bB.container) {
                    return bB.container
                } else {
                    var bz = n.CurrentLibrary.getTagName(bB.source), bA = n.CurrentLibrary.getParent(bB.source);
                    if (bz && bz.toLowerCase() === "td") {
                        return n.CurrentLibrary.getParent(bA)
                    } else {
                        return bA
                    }
                }
            }, aH = function (bB) {
                var bA = br.Defaults.EndpointType || ah;
                bB.parent = ay(bB);
                bB._jsPlumb = br;
                var bz = new bA(bB);
                bz.id = "ep_" + an();
                bw("click", "endpointClick", bz);
                bw("dblclick", "endpointDblClick", bz);
                bw("contextmenu", "contextmenu", bz);
                if (!jsPlumbAdapter.headless) {
                    br.dragManager.endpointAdded(bB.source)
                }
                return bz
            }, V = function (bB, bE, bD) {
                var bz = aV[bB];
                if (bz && bz.length) {
                    for (var bC = 0; bC < bz.length; bC++) {
                        for (var bA = 0; bA < bz[bC].connections.length; bA++) {
                            var bF = bE(bz[bC].connections[bA]);
                            if (bF) {
                                return
                            }
                        }
                        if (bD) {
                            bD(bz[bC])
                        }
                    }
                }
            }, Z = function (bA) {
                for (var bz in aV) {
                    V(bz, bA)
                }
            }, aw = function (bz, bA) {
                if (bz != null && bz.parentNode != null) {
                    bz.parentNode.removeChild(bz)
                }
            }, aZ = function (bB, bA) {
                for (var bz = 0; bz < bB.length; bz++) {
                    aw(bB[bz], bA)
                }
            }, bo = function (bA, bz) {
                return aJ(bA, function (bB, bC) {
                    bq[bC] = bz;
                    if (n.CurrentLibrary.isDragSupported(bB)) {
                        n.CurrentLibrary.setDraggable(bB, bz)
                    }
                })
            }, a7 = function (bB, bC, bz) {
                bC = bC === "block";
                var bA = null;
                if (bz) {
                    if (bC) {
                        bA = function (bE) {
                            bE.setVisible(true, true, true)
                        }
                    } else {
                        bA = function (bE) {
                            bE.setVisible(false, true, true)
                        }
                    }
                }
                var bD = c(bB, "id");
                V(bD, function (bF) {
                    if (bC && bz) {
                        var bE = bF.sourceId === bD ? 1 : 0;
                        if (bF.endpoints[bE].isVisible()) {
                            bF.setVisible(true)
                        }
                    } else {
                        bF.setVisible(bC)
                    }
                }, bA)
            }, bm = function (bz) {
                return aJ(bz, function (bB, bA) {
                    var bC = bq[bA] == null ? false : bq[bA];
                    bC = !bC;
                    bq[bA] = bC;
                    n.CurrentLibrary.setDraggable(bB, bC);
                    return bC
                })
            }, aS = function (bz, bB) {
                var bA = null;
                if (bB) {
                    bA = function (bC) {
                        var bD = bC.isVisible();
                        bC.setVisible(!bD)
                    }
                }
                V(bz, function (bD) {
                    var bC = bD.isVisible();
                    bD.setVisible(!bC)
                }, bA)
            }, X = function (bE) {
                var bC = bE.timestamp, bz = bE.recalc, bD = bE.offset, bA = bE.elId;
                if (a9 && !bC) {
                    bC = bd
                }
                if (!bz) {
                    if (bC && bC === bu[bA]) {
                        return aj[bA]
                    }
                }
                if (bz || !bD) {
                    var bB = C(bA);
                    if (bB != null) {
                        ag[bA] = a(bB);
                        aj[bA] = s(bB, br);
                        bu[bA] = bC
                    }
                } else {
                    aj[bA] = bD;
                    if (ag[bA] == null) {
                        var bB = C(bA);
                        if (bB != null) {
                            ag[bA] = a(bB)
                        }
                    }
                }
                if (aj[bA] && !aj[bA].right) {
                    aj[bA].right = aj[bA].left + ag[bA][0];
                    aj[bA].bottom = aj[bA].top + ag[bA][1];
                    aj[bA].width = ag[bA][0];
                    aj[bA].height = ag[bA][1];
                    aj[bA].centerx = aj[bA].left + (aj[bA].width / 2);
                    aj[bA].centery = aj[bA].top + (aj[bA].height / 2)
                }
                return aj[bA]
            }, aQ = function (bz) {
                var bA = aj[bz];
                if (!bA) {
                    bA = X({elId: bz})
                }
                return {o: bA, s: ag[bz]}
            }, H = function (bz, bA, bC) {
                var bB = C(bz);
                var bD = c(bB, "id");
                if (!bD || bD == "undefined") {
                    if (arguments.length == 2 && arguments[1] != undefined) {
                        bD = bA
                    } else {
                        if (arguments.length == 1 || (arguments.length == 3 && !arguments[2])) {
                            bD = "jsPlumb_" + aO + "_" + an()
                        }
                    }
                    if (!bC) {
                        d(bB, "id", bD)
                    }
                }
                return bD
            }, ap = function (bB, bz, bA) {
                bB = bB || function () {
                };
                bz = bz || function () {
                };
                return function () {
                    var bC = null;
                    try {
                        bC = bz.apply(this, arguments)
                    } catch (bD) {
                        o(br, "jsPlumb function failed : " + bD)
                    }
                    if (bA == null || (bC !== bA)) {
                        try {
                            bB.apply(this, arguments)
                        } catch (bD) {
                            o(br, "wrapped function failed : " + bD)
                        }
                    }
                    return bC
                }
            };
        this.connectorClass = "_jsPlumb_connector";
        this.endpointClass = "_jsPlumb_endpoint";
        this.overlayClass = "_jsPlumb_overlay";
        this.Anchors = {};
        this.Connectors = {canvas: {}, svg: {}, vml: {}};
        this.Endpoints = {canvas: {}, svg: {}, vml: {}};
        this.Overlays = {canvas: {}, svg: {}, vml: {}};
        this.addClass = function (bA, bz) {
            return n.CurrentLibrary.addClass(bA, bz)
        };
        this.removeClass = function (bA, bz) {
            return n.CurrentLibrary.removeClass(bA, bz)
        };
        this.hasClass = function (bA, bz) {
            return n.CurrentLibrary.hasClass(bA, bz)
        };
        this.addEndpoint = function (bC, bD, bM) {
            bM = bM || {};
            var bB = n.extend({}, bM);
            n.extend(bB, bD);
            bB.endpoint = bB.endpoint || br.Defaults.Endpoint || n.Defaults.Endpoint;
            bB.paintStyle = bB.paintStyle || br.Defaults.EndpointStyle || n.Defaults.EndpointStyle;
            bC = aL(bC);
            var bE = [], bH = bC.length && bC.constructor != String ? bC : [bC];
            for (var bF = 0; bF < bH.length; bF++) {
                var bK = C(bH[bF]), bA = H(bK);
                bB.source = bK;
                X({elId: bA, timestamp: bd});
                var bJ = aH(bB);
                if (bB.parentAnchor) {
                    bJ.parentAnchor = bB.parentAnchor
                }
                W(aV, bA, bJ);
                var bI = aj[bA], bG = ag[bA];
                var bL = bJ.anchor.compute({xy: [bI.left, bI.top], wh: bG, element: bJ, timestamp: bd});
                var bz = {anchorLoc: bL, timestamp: bd};
                if (a9) {
                    bz.recalc = false
                }
                bJ.paint(bz);
                bE.push(bJ)
            }
            return bE.length == 1 ? bE[0] : bE
        };
        this.addEndpoints = function (bD, bA, bz) {
            var bC = [];
            for (var bB = 0; bB < bA.length; bB++) {
                var bE = br.addEndpoint(bD, bA[bB], bz);
                if (l(bE)) {
                    Array.prototype.push.apply(bC, bE)
                } else {
                    bC.push(bE)
                }
            }
            return bC
        };
        this.animate = function (bB, bA, bz) {
            var bC = C(bB), bF = c(bB, "id");
            bz = bz || {};
            var bE = n.CurrentLibrary.dragEvents.step;
            var bD = n.CurrentLibrary.dragEvents.complete;
            bz[bE] = ap(bz[bE], function () {
                br.repaint(bF)
            });
            bz[bD] = ap(bz[bD], function () {
                br.repaint(bF)
            });
            n.CurrentLibrary.animate(bC, bA, bz)
        };
        this.checkCondition = function (bB, bD) {
            var bz = br.getListener(bB), bC = true;
            if (bz && bz.length > 0) {
                try {
                    for (var bA = 0; bA < bz.length; bA++) {
                        bC = bC && bz[bA](bD)
                    }
                } catch (bE) {
                    o(br, "cannot check condition [" + bB + "]" + bE)
                }
            }
            return bC
        };
        this.checkASyncCondition = function (bB, bD, bC, bA) {
            var bz = br.getListener(bB);
            if (bz && bz.length > 0) {
                try {
                    bz[0](bD, bC, bA)
                } catch (bE) {
                    o(br, "cannot asynchronously check condition [" + bB + "]" + bE)
                }
            }
        };
        this.connect = function (bC, bA) {
            var bz = aC(bC, bA), bB;
            if (bz) {
                if (bz.deleteEndpointsOnDetach == null) {
                    bz.deleteEndpointsOnDetach = true
                }
                bB = af(bz);
                bx(bB, bz)
            }
            return bB
        };
        this.deleteEndpoint = function (bA) {
            var bF = (typeof bA == "string") ? aW[bA] : bA;
            if (bF) {
                var bC = bF.getUuid();
                if (bC) {
                    aW[bC] = null
                }
                bF.detachAll();
                if (bF.endpoint.cleanup) {
                    bF.endpoint.cleanup()
                }
                aZ(bF.endpoint.getDisplayElements());
                br.anchorManager.deleteEndpoint(bF);
                for (var bE in aV) {
                    var bz = aV[bE];
                    if (bz) {
                        var bD = [];
                        for (var bB = 0; bB < bz.length; bB++) {
                            if (bz[bB] != bF) {
                                bD.push(bz[bB])
                            }
                        }
                        aV[bE] = bD
                    }
                }
                if (!jsPlumbAdapter.headless) {
                    br.dragManager.endpointDeleted(bF)
                }
            }
        };
        this.deleteEveryEndpoint = function () {
            br.setSuspendDrawing(true);
            for (var bB in aV) {
                var bz = aV[bB];
                if (bz && bz.length) {
                    for (var bA = 0; bA < bz.length; bA++) {
                        br.deleteEndpoint(bz[bA])
                    }
                }
            }
            aV = {};
            aW = {};
            br.setSuspendDrawing(false, true)
        };
        var ba = function (bC, bE, bz) {
            var bB = br.Defaults.ConnectionType || br.getDefaultConnectionType(), bA = bC.constructor == bB, bD = bA ? {
                connection: bC,
                source: bC.source,
                target: bC.target,
                sourceId: bC.sourceId,
                targetId: bC.targetId,
                sourceEndpoint: bC.endpoints[0],
                targetEndpoint: bC.endpoints[1]
            } : bC;
            if (bE) {
                br.fire("jsPlumbConnectionDetached", bD, bz);
                br.fire("connectionDetached", bD, bz)
            }
            br.anchorManager.connectionDetached(bD)
        }, a8 = function (bz) {
            br.fire("connectionDrag", bz)
        }, aT = function (bz) {
            br.fire("connectionDragStop", bz)
        };
        this.detach = function () {
            if (arguments.length == 0) {
                return
            }
            var bD = br.Defaults.ConnectionType || br.getDefaultConnectionType(), bE = arguments[0].constructor == bD,
                bC = arguments.length == 2 ? bE ? (arguments[1] || {}) : arguments[0] : arguments[0],
                bH = (bC.fireEvent !== false), bB = bC.forceDetach, bA = bE ? arguments[0] : bC.connection;
            if (bA) {
                if (bB || (bA.isDetachAllowed(bA) && bA.endpoints[0].isDetachAllowed(bA) && bA.endpoints[1].isDetachAllowed(bA))) {
                    if (bB || br.checkCondition("beforeDetach", bA)) {
                        bA.endpoints[0].detach(bA, false, true, bH)
                    }
                }
            } else {
                var bz = n.extend({}, bC);
                if (bz.uuids) {
                    ax(bz.uuids[0]).detachFrom(ax(bz.uuids[1]), bH)
                } else {
                    if (bz.sourceEndpoint && bz.targetEndpoint) {
                        bz.sourceEndpoint.detachFrom(bz.targetEndpoint)
                    } else {
                        var bG = H(bz.source), bF = H(bz.target);
                        V(bG, function (bI) {
                            if ((bI.sourceId == bG && bI.targetId == bF) || (bI.targetId == bG && bI.sourceId == bF)) {
                                if (br.checkCondition("beforeDetach", bI)) {
                                    bI.endpoints[0].detach(bI, false, true, bH)
                                }
                            }
                        })
                    }
                }
            }
        };
        this.detachAllConnections = function (bB, bC) {
            bC = bC || {};
            bB = C(bB);
            var bD = c(bB, "id"), bz = aV[bD];
            if (bz && bz.length) {
                for (var bA = 0; bA < bz.length; bA++) {
                    bz[bA].detachAll(bC.fireEvent)
                }
            }
        };
        this.detachEveryConnection = function (bB) {
            bB = bB || {};
            for (var bC in aV) {
                var bz = aV[bC];
                if (bz && bz.length) {
                    for (var bA = 0; bA < bz.length; bA++) {
                        bz[bA].detachAll(bB.fireEvent)
                    }
                }
            }
            a0 = {}
        };
        this.draggable = function (bB, bz) {
            if (typeof bB == "object" && bB.length) {
                for (var bA = 0; bA < bB.length; bA++) {
                    var bC = C(bB[bA]);
                    if (bC) {
                        bg(bC, true, bz)
                    }
                }
            } else {
                if (bB._nodes) {
                    for (var bA = 0; bA < bB._nodes.length; bA++) {
                        var bC = C(bB._nodes[bA]);
                        if (bC) {
                            bg(bC, true, bz)
                        }
                    }
                } else {
                    var bC = C(bB);
                    if (bC) {
                        bg(bC, true, bz)
                    }
                }
            }
        };
        this.extend = function (bA, bz) {
            return n.CurrentLibrary.extend(bA, bz)
        };
        this.getDefaultEndpointType = function () {
            return ah
        };
        this.getDefaultConnectionType = function () {
            return az
        };
        var bt = function (bD, bC, bA, bz) {
            for (var bB = 0; bB < bD.length; bB++) {
                bD[bB][bC].apply(bD[bB], bA)
            }
            return bz(bD)
        }, T = function (bD, bC, bA) {
            var bz = [];
            for (var bB = 0; bB < bD.length; bB++) {
                bz.push([bD[bB][bC].apply(bD[bB], bA), bD[bB]])
            }
            return bz
        }, aq = function (bB, bA, bz) {
            return function () {
                return bt(bB, bA, arguments, bz)
            }
        }, aA = function (bA, bz) {
            return function () {
                return T(bA, bz, arguments)
            }
        }, bv = function (bz, bC) {
            var bB = [];
            if (bz) {
                if (typeof bz == "string") {
                    if (bz === "*") {
                        return bz
                    }
                    bB.push(bz)
                } else {
                    if (bC) {
                        bB = bz
                    } else {
                        for (var bA = 0; bA < bz.length; bA++) {
                            bB.push(H(C(bz[bA])))
                        }
                    }
                }
            }
            return bB
        }, aI = function (bB, bA, bz) {
            if (bB === "*") {
                return true
            }
            return bB.length > 0 ? G(bB, bA) != -1 : !bz
        };
        this.getConnections = function (bI, bA) {
            if (!bI) {
                bI = {}
            } else {
                if (bI.constructor == String) {
                    bI = {scope: bI}
                }
            }
            var bH = bI.scope || br.getDefaultScope(), bG = bv(bH, true), bz = bv(bI.source), bE = bv(bI.target),
                bD = (!bA && bG.length > 1) ? {} : [], bJ = function (bL, bM) {
                    if (!bA && bG.length > 1) {
                        var bK = bD[bL];
                        if (bK == null) {
                            bK = [];
                            bD[bL] = bK
                        }
                        bK.push(bM)
                    } else {
                        bD.push(bM)
                    }
                };
            for (var bC in a0) {
                if (aI(bG, bC)) {
                    for (var bB = 0; bB < a0[bC].length; bB++) {
                        var bF = a0[bC][bB];
                        if (aI(bz, bF.sourceId) && aI(bE, bF.targetId)) {
                            bJ(bC, bF)
                        }
                    }
                }
            }
            return bD
        };
        var L = function (bz, bA) {
            return function (bC) {
                for (var bB = 0; bB < bz.length; bB++) {
                    bC(bz[bB])
                }
                return bA(bz)
            }
        }, P = function (bz) {
            return function (bA) {
                return bz[bA]
            }
        };
        var Q = function (bz, bA) {
            return {
                setHover: aq(bz, "setHover", bA),
                removeAllOverlays: aq(bz, "removeAllOverlays", bA),
                setLabel: aq(bz, "setLabel", bA),
                addOverlay: aq(bz, "addOverlay", bA),
                removeOverlay: aq(bz, "removeOverlay", bA),
                removeOverlays: aq(bz, "removeOverlays", bA),
                showOverlay: aq(bz, "showOverlay", bA),
                hideOverlay: aq(bz, "hideOverlay", bA),
                showOverlays: aq(bz, "showOverlays", bA),
                hideOverlays: aq(bz, "hideOverlays", bA),
                setPaintStyle: aq(bz, "setPaintStyle", bA),
                setHoverPaintStyle: aq(bz, "setHoverPaintStyle", bA),
                setParameter: aq(bz, "setParameter", bA),
                setParameters: aq(bz, "setParameters", bA),
                setVisible: aq(bz, "setVisible", bA),
                setZIndex: aq(bz, "setZIndex", bA),
                repaint: aq(bz, "repaint", bA),
                addType: aq(bz, "addType", bA),
                toggleType: aq(bz, "toggleType", bA),
                removeType: aq(bz, "removeType", bA),
                getLabel: aA(bz, "getLabel"),
                getOverlay: aA(bz, "getOverlay"),
                isHover: aA(bz, "isHover"),
                getParameter: aA(bz, "getParameter"),
                getParameters: aA(bz, "getParameters"),
                getPaintStyle: aA(bz, "getPaintStyle"),
                getHoverPaintStyle: aA(bz, "getHoverPaintStyle"),
                isVisible: aA(bz, "isVisible"),
                getZIndex: aA(bz, "getZIndex"),
                hasType: aA(bz, "hasType"),
                getType: aA(bz, "getType"),
                length: bz.length,
                each: L(bz, bA),
                get: P(bz)
            }
        };
        var aN = function (bA) {
            var bz = Q(bA, aN);
            return n.CurrentLibrary.extend(bz, {
                setDetachable: aq(bA, "setDetachable", aN),
                setReattach: aq(bA, "setReattach", aN),
                setConnector: aq(bA, "setConnector", aN),
                detach: function () {
                    for (var bB = 0; bB < bA.length; bB++) {
                        br.detach(bA[bB])
                    }
                },
                isDetachable: aA(bA, "isDetachable"),
                isReattach: aA(bA, "isReattach")
            })
        };
        var bf = function (bA) {
            var bz = Q(bA, bf);
            return n.CurrentLibrary.extend(bz, {
                setEnabled: aq(bA, "setEnabled", bf),
                isEnabled: aA(bA, "isEnabled"),
                detachAll: function () {
                    for (var bB = 0; bB < bA.length; bB++) {
                        bA[bB].detachAll()
                    }
                },
                "delete": function () {
                    for (var bB = 0; bB < bA.length; bB++) {
                        br.deleteEndpoint(bA[bB])
                    }
                }
            })
        };
        this.select = function (bz) {
            bz = bz || {};
            bz.scope = bz.scope || "*";
            var bA = br.getConnections(bz, true);
            return aN(bA)
        };
        this.selectEndpoints = function (bH) {
            bH = bH || {};
            bH.scope = bH.scope || "*";
            var bM = !bH.element && !bH.source && !bH.target, bA = bM ? "*" : bv(bH.element),
                bB = bM ? "*" : bv(bH.source), bJ = bM ? "*" : bv(bH.target), bO = bv(bH.scope, true);
            var bP = [];
            for (var bF in aV) {
                var bD = aI(bA, bF, true), bz = aI(bB, bF, true), bE = bB != "*", bK = aI(bJ, bF, true), bC = bJ != "*";
                if (bD || bz || bK) {
                    inner:for (var bI = 0; bI < aV[bF].length; bI++) {
                        var bL = aV[bF][bI];
                        if (aI(bO, bL.scope, true)) {
                            var bN = (bE && bB.length > 0 && !bL.isSource), bG = (bC && bJ.length > 0 && !bL.isTarget);
                            if (bN || bG) {
                                continue inner
                            }
                            bP.push(bL)
                        }
                    }
                }
            }
            return bf(bP)
        };
        this.getAllConnections = function () {
            return a0
        };
        this.getDefaultScope = function () {
            return R
        };
        this.getEndpoint = ax;
        this.getEndpoints = function (bz) {
            return aV[H(bz)]
        };
        this.getId = H;
        this.getOffset = function (bA) {
            var bz = aj[bA];
            return X({elId: bA})
        };
        this.getSelector = function (bz) {
            return n.CurrentLibrary.getSelector(bz)
        };
        this.getSize = function (bA) {
            var bz = ag[bA];
            if (!bz) {
                X({elId: bA})
            }
            return ag[bA]
        };
        this.appendElement = aX;
        var aU = false;
        this.isHoverSuspended = function () {
            return aU
        };
        this.setHoverSuspended = function (bz) {
            aU = bz
        };
        var aY = function (bz) {
            return function () {
                return jsPlumbAdapter.isRenderModeAvailable(bz)
            }
        };
        this.isCanvasAvailable = aY("canvas");
        this.isSVGAvailable = aY("svg");
        this.isVMLAvailable = aY("vml");
        this.hide = function (bz, bA) {
            a7(bz, "none", bA)
        };
        this.idstamp = an;
        this.init = function () {
            if (!K) {
                br.setRenderMode(br.Defaults.RenderMode);
                var bz = function (bA) {
                    n.CurrentLibrary.bind(document, bA, function (bG) {
                        if (!br.currentlyDragging && Y == n.CANVAS) {
                            for (var bF in a0) {
                                var bH = a0[bF];
                                for (var bD = 0; bD < bH.length; bD++) {
                                    var bC = bH[bD].connector[bA](bG);
                                    if (bC) {
                                        return
                                    }
                                }
                            }
                            for (var bE in aV) {
                                var bB = aV[bE];
                                for (var bD = 0; bD < bB.length; bD++) {
                                    if (bB[bD].endpoint[bA](bG)) {
                                        return
                                    }
                                }
                            }
                        }
                    })
                };
                bz("click");
                bz("dblclick");
                bz("mousemove");
                bz("mousedown");
                bz("mouseup");
                bz("contextmenu");
                K = true;
                br.fire("ready")
            }
        };
        this.log = O;
        this.jsPlumbUIComponent = B;
        this.makeAnchor = function () {
            if (arguments.length == 0) {
                return null
            }
            var bE = arguments[0], bB = arguments[1], bA = arguments[2], bC = null;
            if (bE.compute && bE.getOrientation) {
                return bE
            } else {
                if (typeof bE == "string") {
                    bC = n.Anchors[arguments[0]]({elementId: bB, jsPlumbInstance: br})
                } else {
                    if (l(bE)) {
                        if (l(bE[0]) || z(bE[0])) {
                            if (bE.length == 2 && z(bE[0]) && u(bE[1])) {
                                var bz = n.extend({elementId: bB, jsPlumbInstance: br}, bE[1]);
                                bC = n.Anchors[bE[0]](bz)
                            } else {
                                bC = new au(bE, null, bB)
                            }
                        } else {
                            var bD = {
                                x: bE[0],
                                y: bE[1],
                                orientation: (bE.length >= 4) ? [bE[2], bE[3]] : [0, 0],
                                offsets: (bE.length == 6) ? [bE[4], bE[5]] : [0, 0],
                                elementId: bB
                            };
                            bC = new ab(bD);
                            bC.clone = function () {
                                return new ab(bD)
                            }
                        }
                    }
                }
            }
            if (!bC.id) {
                bC.id = "anchor_" + an()
            }
            return bC
        };
        this.makeAnchors = function (bC, bA, bz) {
            var bD = [];
            for (var bB = 0; bB < bC.length; bB++) {
                if (typeof bC[bB] == "string") {
                    bD.push(n.Anchors[bC[bB]]({elementId: bA, jsPlumbInstance: bz}))
                } else {
                    if (l(bC[bB])) {
                        bD.push(br.makeAnchor(bC[bB], bA, bz))
                    }
                }
            }
            return bD
        };
        this.makeDynamicAnchor = function (bz, bA) {
            return new au(bz, bA)
        };
        var a1 = {}, aK = {}, bl = {}, at = {}, ac = function (bz, bA) {
            bz.paintStyle = bz.paintStyle || br.Defaults.EndpointStyles[bA] || br.Defaults.EndpointStyle || n.Defaults.EndpointStyles[bA] || n.Defaults.EndpointStyle;
            bz.hoverPaintStyle = bz.hoverPaintStyle || br.Defaults.EndpointHoverStyles[bA] || br.Defaults.EndpointHoverStyle || n.Defaults.EndpointHoverStyles[bA] || n.Defaults.EndpointHoverStyle;
            bz.anchor = bz.anchor || br.Defaults.Anchors[bA] || br.Defaults.Anchor || n.Defaults.Anchors[bA] || n.Defaults.Anchor;
            bz.endpoint = bz.endpoint || br.Defaults.Endpoints[bA] || br.Defaults.Endpoint || n.Defaults.Endpoints[bA] || n.Defaults.Endpoint
        };
        this.makeTarget = function (bC, bD, bJ) {
            var bA = n.extend({_jsPlumb: br}, bJ);
            n.extend(bA, bD);
            ac(bA, 1);
            var bH = n.CurrentLibrary, bI = bA.scope || br.Defaults.Scope, bE = !(bA.deleteEndpointsOnDetach === false),
                bB = bA.maxConnections || -1, bz = bA.onMaxConnections;
            _doOne = function (bO) {
                var bM = H(bO);
                a1[bM] = bA;
                bl[bM] = bA.uniqueEndpoint, at[bM] = bB, am[bM] = true, proxyComponent = new B(bA);
                var bL = n.extend({}, bA.dropOptions || {}), bK = function () {
                    var bR = n.CurrentLibrary.getDropEvent(arguments), bT = br.select({target: bM}).length;
                    br.currentlyDragging = false;
                    var b3 = C(bH.getDragObject(arguments)), bS = c(b3, "dragId"), b1 = c(b3, "originalScope"),
                        bY = bk[bS], bQ = bY.endpoints[0], bP = bA.endpoint ? n.extend({}, bA.endpoint) : {};
                    if (!am[bM] || at[bM] > 0 && bT >= at[bM]) {
                        if (bz) {
                            bz({element: bO, connection: bY}, bR)
                        }
                        return false
                    }
                    bQ.anchor.locked = false;
                    if (b1) {
                        bH.setDragScope(b3, b1)
                    }
                    var bW = proxyComponent.isDropAllowed(bY.sourceId, H(bO), bY.scope, bY, null);
                    if (bY.endpointsToDeleteOnDetach) {
                        if (bQ === bY.endpointsToDeleteOnDetach[0]) {
                            bY.endpointsToDeleteOnDetach[0] = null
                        } else {
                            if (bQ === bY.endpointsToDeleteOnDetach[1]) {
                                bY.endpointsToDeleteOnDetach[1] = null
                            }
                        }
                    }
                    if (bY.suspendedEndpoint) {
                        bY.targetId = bY.suspendedEndpoint.elementId;
                        bY.target = bH.getElementObject(bY.suspendedEndpoint.elementId);
                        bY.endpoints[1] = bY.suspendedEndpoint
                    }
                    if (bW) {
                        bQ.detach(bY, false, true, false);
                        var b2 = aK[bM] || br.addEndpoint(bO, bA);
                        if (bA.uniqueEndpoint) {
                            aK[bM] = b2
                        }
                        b2._makeTargetCreator = true;
                        if (b2.anchor.positionFinder != null) {
                            var bZ = bH.getUIPosition(arguments, br.getZoom()), bV = s(bO, br), b0 = a(bO),
                                bU = b2.anchor.positionFinder(bZ, bV, b0, b2.anchor.constructorParams);
                            b2.anchor.x = bU[0];
                            b2.anchor.y = bU[1]
                        }
                        var bX = br.connect({
                            source: bQ,
                            target: b2,
                            scope: b1,
                            previousConnection: bY,
                            container: bY.parent,
                            deleteEndpointsOnDetach: bE,
                            doNotFireConnectionEvent: bQ.endpointWillMoveAfterConnection
                        });
                        if (bY.endpoints[1]._makeTargetCreator && bY.endpoints[1].connections.length < 2) {
                            br.deleteEndpoint(bY.endpoints[1])
                        }
                        if (bE) {
                            bX.endpointsToDeleteOnDetach = [bQ, b2]
                        }
                        bX.repaint()
                    } else {
                        if (bY.suspendedEndpoint) {
                            if (bY.isReattach()) {
                                bY.setHover(false);
                                bY.floatingAnchorIndex = null;
                                bY.suspendedEndpoint.addConnection(bY);
                                br.repaint(bQ.elementId)
                            } else {
                                bQ.detach(bY, false, true, true, bR)
                            }
                        }
                    }
                };
                var bN = bH.dragEvents.drop;
                bL.scope = bL.scope || bI;
                bL[bN] = ap(bL[bN], bK);
                bH.initDroppable(bO, bL, true)
            };
            bC = aL(bC);
            var bG = bC.length && bC.constructor != String ? bC : [bC];
            for (var bF = 0; bF < bG.length; bF++) {
                _doOne(C(bG[bF]))
            }
            return br
        };
        this.unmakeTarget = function (bA, bB) {
            bA = n.CurrentLibrary.getElementObject(bA);
            var bz = H(bA);
            if (!bB) {
                delete a1[bz];
                delete bl[bz];
                delete at[bz];
                delete am[bz]
            }
            return br
        };
        this.makeTargets = function (bB, bC, bz) {
            for (var bA = 0; bA < bB.length; bA++) {
                br.makeTarget(bB[bA], bC, bz)
            }
        };
        var aB = {}, a6 = {}, bc = {}, ae = {}, J = {}, N = {}, am = {};
        this.makeSource = function (bD, bE, bI) {
            var bB = n.extend({}, bI);
            n.extend(bB, bE);
            ac(bB, 0);
            var bH = n.CurrentLibrary, bC = bB.maxConnections || -1, bA = bB.onMaxConnections, bz = function (bQ) {
                var bK = H(bQ), bR = bB.parent, bJ = bR != null ? br.getId(bH.getElementObject(bR)) : bK;
                aB[bJ] = bB;
                bc[bJ] = bB.uniqueEndpoint;
                ae[bJ] = true;
                var bL = bH.dragEvents.stop, bP = bH.dragEvents.drag, bS = n.extend({}, bB.dragOptions || {}),
                    bN = bS.drag, bT = bS.stop, bU = null, bO = false;
                N[bJ] = bC;
                bS.scope = bS.scope || bB.scope;
                bS[bP] = ap(bS[bP], function () {
                    if (bN) {
                        bN.apply(this, arguments)
                    }
                    bO = false
                });
                bS[bL] = ap(bS[bL], function () {
                    if (bT) {
                        bT.apply(this, arguments)
                    }
                    br.currentlyDragging = false;
                    if (bU.connections.length == 0) {
                        br.deleteEndpoint(bU)
                    } else {
                        bH.unbind(bU.canvas, "mousedown");
                        var bW = bB.anchor || br.Defaults.Anchor, bX = bU.anchor, bZ = bU.connections[0];
                        bU.anchor = br.makeAnchor(bW, bK, br);
                        if (bB.parent) {
                            var bY = bH.getElementObject(bB.parent);
                            if (bY) {
                                var bV = bU.elementId;
                                var b0 = bB.container || br.Defaults.Container || n.Defaults.Container;
                                bU.setElement(bY, b0);
                                bU.endpointWillMoveAfterConnection = false;
                                br.anchorManager.rehomeEndpoint(bV, bY);
                                bZ.previousConnection = null;
                                A(a0[bZ.scope], function (b1) {
                                    return b1.id === bZ.id
                                });
                                br.anchorManager.connectionDetached({
                                    sourceId: bZ.sourceId,
                                    targetId: bZ.targetId,
                                    connection: bZ
                                });
                                bx(bZ)
                            }
                        }
                        bU.repaint();
                        br.repaint(bU.elementId);
                        br.repaint(bZ.targetId)
                    }
                });
                var bM = function (bZ) {
                    if (!ae[bJ]) {
                        return
                    }
                    var bX = br.select({source: bJ}).length;
                    if (N[bJ] >= 0 && bX >= N[bJ]) {
                        if (bA) {
                            bA({element: bQ, maxConnections: bC}, bZ)
                        }
                        return false
                    }
                    if (bE.filter) {
                        var bV = bE.filter(bH.getOriginalEvent(bZ), bQ);
                        if (bV === false) {
                            return
                        }
                    }
                    var b3 = X({elId: bK});
                    var b2 = ((bZ.pageX || bZ.page.x) - b3.left) / b3.width,
                        b1 = ((bZ.pageY || bZ.page.y) - b3.top) / b3.height, b7 = b2, b6 = b1;
                    if (bB.parent) {
                        var b0 = bH.getElementObject(bB.parent), bY = H(b0);
                        b3 = X({elId: bY});
                        b7 = ((bZ.pageX || bZ.page.x) - b3.left) / b3.width, b6 = ((bZ.pageY || bZ.page.y) - b3.top) / b3.height
                    }
                    var b5 = {};
                    n.extend(b5, bB);
                    b5.isSource = true;
                    b5.anchor = [b2, b1, 0, 0];
                    b5.parentAnchor = [b7, b6, 0, 0];
                    b5.dragOptions = bS;
                    if (bB.parent) {
                        var bW = b5.container || br.Defaults.Container || n.Defaults.Container;
                        if (bW) {
                            b5.container = bW
                        } else {
                            b5.container = n.CurrentLibrary.getParent(bB.parent)
                        }
                    }
                    bU = br.addEndpoint(bK, b5);
                    bO = true;
                    bU.endpointWillMoveAfterConnection = bB.parent != null;
                    bU.endpointWillMoveTo = bB.parent ? bH.getElementObject(bB.parent) : null;
                    var b4 = function () {
                        if (bO) {
                            br.deleteEndpoint(bU)
                        }
                    };
                    br.registerListener(bU.canvas, "mouseup", b4);
                    br.registerListener(bQ, "mouseup", b4);
                    bH.trigger(bU.canvas, "mousedown", bZ)
                };
                br.registerListener(bQ, "mousedown", bM);
                J[bK] = bM
            };
            bD = aL(bD);
            var bG = bD.length && bD.constructor != String ? bD : [bD];
            for (var bF = 0; bF < bG.length; bF++) {
                bz(C(bG[bF]))
            }
            return br
        };
        this.unmakeSource = function (bA, bB) {
            bA = n.CurrentLibrary.getElementObject(bA);
            var bC = H(bA), bz = J[bC];
            if (bz) {
                br.unregisterListener(_el, "mousedown", bz)
            }
            if (!bB) {
                delete aB[bC];
                delete bc[bC];
                delete ae[bC];
                delete J[bC];
                delete N[bC]
            }
            return br
        };
        this.unmakeEverySource = function () {
            for (var bz in ae) {
                br.unmakeSource(bz, true)
            }
            aB = {};
            bc = {};
            ae = {};
            J = {}
        };
        this.unmakeEveryTarget = function () {
            for (var bz in am) {
                br.unmakeTarget(bz, true)
            }
            a1 = {};
            bl = {};
            at = {};
            am = {};
            return br
        };
        this.makeSources = function (bB, bC, bz) {
            for (var bA = 0; bA < bB.length; bA++) {
                br.makeSource(bB[bA], bC, bz)
            }
            return br
        };
        var aP = function (bD, bC, bE, bz) {
            var bA = bD == "source" ? ae : am;
            if (z(bC)) {
                bA[bC] = bz ? !bA[bC] : bE
            } else {
                if (bC.length) {
                    bC = aL(bC);
                    for (var bB = 0; bB < bC.length; bB++) {
                        var bF = _el = n.CurrentLibrary.getElementObject(bC[bB]), bF = H(_el);
                        bA[bF] = bz ? !bA[bF] : bE
                    }
                }
            }
            return br
        };
        this.setSourceEnabled = function (bz, bA) {
            return aP("source", bz, bA)
        };
        this.toggleSourceEnabled = function (bz) {
            aP("source", bz, null, true);
            return br.isSourceEnabled(bz)
        };
        this.isSource = function (bz) {
            bz = n.CurrentLibrary.getElementObject(bz);
            return ae[H(bz)] != null
        };
        this.isSourceEnabled = function (bz) {
            bz = n.CurrentLibrary.getElementObject(bz);
            return ae[H(bz)] === true
        };
        this.setTargetEnabled = function (bz, bA) {
            return aP("target", bz, bA)
        };
        this.toggleTargetEnabled = function (bz) {
            return aP("target", bz, null, true);
            return br.isTargetEnabled(bz)
        };
        this.isTarget = function (bz) {
            bz = n.CurrentLibrary.getElementObject(bz);
            return am[H(bz)] != null
        };
        this.isTargetEnabled = function (bz) {
            bz = n.CurrentLibrary.getElementObject(bz);
            return am[H(bz)] === true
        };
        this.ready = function (bz) {
            br.bind("ready", bz)
        };
        this.repaint = function (bA, bC, bB) {
            if (typeof bA == "object") {
                for (var bz = 0; bz < bA.length; bz++) {
                    be(C(bA[bz]), bC, bB)
                }
            } else {
                be(C(bA), bC, bB)
            }
            return br
        };
        this.repaintEverything = function () {
            for (var bz in aV) {
                be(C(bz))
            }
            return br
        };
        this.removeAllEndpoints = function (bB) {
            var bz = c(bB, "id"), bC = aV[bz];
            if (bC) {
                for (var bA = 0; bA < bC.length; bA++) {
                    br.deleteEndpoint(bC[bA])
                }
            }
            aV[bz] = [];
            return br
        };
        var ai = {}, bi = function () {
            for (var bA in ai) {
                for (var bz = 0; bz < ai[bA].length; bz++) {
                    var bB = ai[bA][bz];
                    n.CurrentLibrary.unbind(bB.el, bB.event, bB.listener)
                }
            }
            ai = {}
        };
        this.registerListener = function (bA, bz, bB) {
            n.CurrentLibrary.bind(bA, bz, bB);
            W(ai, bz, {el: bA, event: bz, listener: bB})
        };
        this.unregisterListener = function (bA, bz, bB) {
            n.CurrentLibrary.unbind(bA, bz, bB);
            A(ai, function (bC) {
                return bC.type == bz && bC.listener == bB
            })
        };
        this.reset = function () {
            br.deleteEveryEndpoint();
            br.unbind();
            a1 = {};
            aK = {};
            bl = {};
            at = {};
            aB = {};
            a6 = {};
            bc = {};
            N = {};
            bi();
            br.anchorManager.reset();
            if (!jsPlumbAdapter.headless) {
                br.dragManager.reset()
            }
        };
        this.setDefaultScope = function (bz) {
            R = bz;
            return br
        };
        this.setDraggable = bo;
        this.setId = function (bD, bz, bF) {
            var bG = bD.constructor == String ? bD : br.getId(bD),
                bC = br.getConnections({source: bG, scope: "*"}, true),
                bB = br.getConnections({target: bG, scope: "*"}, true);
            bz = "" + bz;
            if (!bF) {
                bD = n.CurrentLibrary.getElementObject(bG);
                n.CurrentLibrary.setAttribute(bD, "id", bz)
            }
            bD = n.CurrentLibrary.getElementObject(bz);
            aV[bz] = aV[bG] || [];
            for (var bA = 0; bA < aV[bz].length; bA++) {
                aV[bz][bA].elementId = bz;
                aV[bz][bA].element = bD;
                aV[bz][bA].anchor.elementId = bz
            }
            delete aV[bG];
            br.anchorManager.changeId(bG, bz);
            var bE = function (bK, bH, bJ) {
                for (var bI = 0; bI < bK.length; bI++) {
                    bK[bI].endpoints[bH].elementId = bz;
                    bK[bI].endpoints[bH].element = bD;
                    bK[bI][bJ + "Id"] = bz;
                    bK[bI][bJ] = bD
                }
            };
            bE(bC, 0, "source");
            bE(bB, 1, "target")
        };
        this.setIdChanged = function (bA, bz) {
            br.setId(bA, bz, true)
        };
        this.setDebugLog = function (bz) {
            O = bz
        };
        var a9 = false, bd = null;
        this.setSuspendDrawing = function (bA, bz) {
            a9 = bA;
            if (bA) {
                bd = new Date().getTime()
            } else {
                bd = null
            }
            if (bz) {
                br.repaintEverything()
            }
        };
        this.isSuspendDrawing = function () {
            return a9
        };
        this.CANVAS = "canvas";
        this.SVG = "svg";
        this.VML = "vml";
        this.setRenderMode = function (bz) {
            Y = jsPlumbAdapter.setRenderMode(bz);
            return Y
        };
        this.getRenderMode = function () {
            return Y
        };
        this.show = function (bz, bA) {
            a7(bz, "block", bA);
            return br
        };
        this.sizeCanvas = function (bB, bz, bD, bA, bC) {
            if (bB) {
                bB.style.height = bC + "px";
                bB.height = bC;
                bB.style.width = bA + "px";
                bB.width = bA;
                bB.style.left = bz + "px";
                bB.style.top = bD + "px"
            }
            return br
        };
        this.getTestHarness = function () {
            return {
                endpointsByElement: aV, endpointCount: function (bz) {
                    var bA = aV[bz];
                    return bA ? bA.length : 0
                }, connectionCount: function (bz) {
                    bz = bz || R;
                    var bA = a0[bz];
                    return bA ? bA.length : 0
                }, getId: H, makeAnchor: self.makeAnchor, makeDynamicAnchor: self.makeDynamicAnchor
            }
        };
        this.toggle = aS;
        this.toggleVisible = aS;
        this.toggleDraggable = bm;
        this.wrap = ap;
        this.addListener = this.bind;
        var bs = function (bE, bB) {
            var bC = null, bz = bE;
            if (bB.tagName.toLowerCase() === "svg" && bB.parentNode) {
                bC = bB.parentNode
            } else {
                if (bB.offsetParent) {
                    bC = bB.offsetParent
                }
            }
            if (bC != null) {
                var bA = bC.tagName.toLowerCase() === "body" ? {left: 0, top: 0} : s(bC, br),
                    bD = bC.tagName.toLowerCase() === "body" ? {left: 0, top: 0} : {
                        left: bC.scrollLeft,
                        top: bC.scrollTop
                    };
                bz[0] = bE[0] - bA.left + bD.left;
                bz[1] = bE[1] - bA.top + bD.top
            }
            return bz
        };
        var ab = function (bD) {
            var bB = this;
            this.x = bD.x || 0;
            this.y = bD.y || 0;
            this.elementId = bD.elementId;
            var bA = bD.orientation || [0, 0];
            var bC = null, bz = null;
            this.offsets = bD.offsets || [0, 0];
            bB.timestamp = null;
            this.compute = function (bI) {
                var bH = bI.xy, bE = bI.wh, bF = bI.element, bG = bI.timestamp;
                if (bG && bG === bB.timestamp) {
                    return bz
                }
                bz = [bH[0] + (bB.x * bE[0]) + bB.offsets[0], bH[1] + (bB.y * bE[1]) + bB.offsets[1]];
                bz = bs(bz, bF.canvas);
                bB.timestamp = bG;
                return bz
            };
            this.getOrientation = function (bE) {
                return bA
            };
            this.equals = function (bE) {
                if (!bE) {
                    return false
                }
                var bF = bE.getOrientation();
                var bG = this.getOrientation();
                return this.x == bE.x && this.y == bE.y && this.offsets[0] == bE.offsets[0] && this.offsets[1] == bE.offsets[1] && bG[0] == bF[0] && bG[1] == bF[1]
            };
            this.getCurrentLocation = function () {
                return bz
            }
        };
        var a3 = function (bF) {
            var bD = bF.reference, bE = bF.referenceCanvas, bB = a(C(bE)), bA = 0, bG = 0, bz = null, bC = null;
            this.x = 0;
            this.y = 0;
            this.isFloating = true;
            this.compute = function (bK) {
                var bJ = bK.xy, bI = bK.element, bH = [bJ[0] + (bB[0] / 2), bJ[1] + (bB[1] / 2)];
                bH = bs(bH, bI.canvas);
                bC = bH;
                return bH
            };
            this.getOrientation = function (bI) {
                if (bz) {
                    return bz
                } else {
                    var bH = bD.getOrientation(bI);
                    return [Math.abs(bH[0]) * bA * -1, Math.abs(bH[1]) * bG * -1]
                }
            };
            this.over = function (bH) {
                bz = bH.getOrientation()
            };
            this.out = function () {
                bz = null
            };
            this.getCurrentLocation = function () {
                return bC
            }
        };
        var au = function (bB, bA, bG) {
            this.isSelective = true;
            this.isDynamic = true;
            var bJ = [], bI = this, bH = function (bK) {
                return bK.constructor == ab ? bK : br.makeAnchor(bK, bG, br)
            };
            for (var bF = 0; bF < bB.length; bF++) {
                bJ[bF] = bH(bB[bF])
            }
            this.addAnchor = function (bK) {
                bJ.push(bH(bK))
            };
            this.getAnchors = function () {
                return bJ
            };
            this.locked = false;
            var bC = bJ.length > 0 ? bJ[0] : null, bE = bJ.length > 0 ? 0 : -1, bI = this,
                bD = function (bQ, bN, bM, bR, bL) {
                    var bK = bR[0] + (bQ.x * bL[0]), bS = bR[1] + (bQ.y * bL[1]), bP = bR[0] + (bL[0] / 2),
                        bO = bR[1] + (bL[1] / 2);
                    return (Math.sqrt(Math.pow(bN - bK, 2) + Math.pow(bM - bS, 2)) + Math.sqrt(Math.pow(bP - bK, 2) + Math.pow(bO - bS, 2)))
                }, bz = bA || function (bU, bL, bM, bN, bK) {
                    var bP = bM[0] + (bN[0] / 2), bO = bM[1] + (bN[1] / 2);
                    var bR = -1, bT = Infinity;
                    for (var bQ = 0; bQ < bK.length; bQ++) {
                        var bS = bD(bK[bQ], bP, bO, bU, bL);
                        if (bS < bT) {
                            bR = bQ + 0;
                            bT = bS
                        }
                    }
                    return bK[bR]
                };
            this.compute = function (bO) {
                var bN = bO.xy, bK = bO.wh, bM = bO.timestamp, bL = bO.txy, bP = bO.twh;
                if (bI.locked || bL == null || bP == null) {
                    return bC.compute(bO)
                } else {
                    bO.timestamp = null
                }
                bC = bz(bN, bK, bL, bP, bJ);
                bI.x = bC.x;
                bI.y = bC.y;
                return bC.compute(bO)
            };
            this.getCurrentLocation = function () {
                return bC != null ? bC.getCurrentLocation() : null
            };
            this.getOrientation = function (bK) {
                return bC != null ? bC.getOrientation(bK) : [0, 0]
            };
            this.over = function (bK) {
                if (bC != null) {
                    bC.over(bK)
                }
            };
            this.out = function () {
                if (bC != null) {
                    bC.out()
                }
            }
        };
        var bn = {}, ak = {}, aM = {},
            U = {HORIZONTAL: "horizontal", VERTICAL: "vertical", DIAGONAL: "diagonal", IDENTITY: "identity"},
            bp = function (bI, bJ, bF, bC) {
                if (bI === bJ) {
                    return {orientation: U.IDENTITY, a: ["top", "top"]}
                }
                var bA = Math.atan2((bC.centery - bF.centery), (bC.centerx - bF.centerx)),
                    bD = Math.atan2((bF.centery - bC.centery), (bF.centerx - bC.centerx)),
                    bE = ((bF.left <= bC.left && bF.right >= bC.left) || (bF.left <= bC.right && bF.right >= bC.right) || (bF.left <= bC.left && bF.right >= bC.right) || (bC.left <= bF.left && bC.right >= bF.right)),
                    bK = ((bF.top <= bC.top && bF.bottom >= bC.top) || (bF.top <= bC.bottom && bF.bottom >= bC.bottom) || (bF.top <= bC.top && bF.bottom >= bC.bottom) || (bC.top <= bF.top && bC.bottom >= bF.bottom));
                if (!(bE || bK)) {
                    var bH = null, bB = false, bz = false, bG = null;
                    if (bC.left > bF.left && bC.top > bF.top) {
                        bH = ["right", "top"]
                    } else {
                        if (bC.left > bF.left && bF.top > bC.top) {
                            bH = ["top", "left"]
                        } else {
                            if (bC.left < bF.left && bC.top < bF.top) {
                                bH = ["top", "right"]
                            } else {
                                if (bC.left < bF.left && bC.top > bF.top) {
                                    bH = ["left", "top"]
                                }
                            }
                        }
                    }
                    return {orientation: U.DIAGONAL, a: bH, theta: bA, theta2: bD}
                } else {
                    if (bE) {
                        return {
                            orientation: U.HORIZONTAL,
                            a: bF.top < bC.top ? ["bottom", "top"] : ["top", "bottom"],
                            theta: bA,
                            theta2: bD
                        }
                    } else {
                        return {
                            orientation: U.VERTICAL,
                            a: bF.left < bC.left ? ["right", "left"] : ["left", "right"],
                            theta: bA,
                            theta2: bD
                        }
                    }
                }
            }, a5 = function (bN, bJ, bH, bI, bO, bK, bB) {
                var bP = [], bA = bJ[bO ? 0 : 1] / (bI.length + 1);
                for (var bL = 0; bL < bI.length; bL++) {
                    var bQ = (bL + 1) * bA, bz = bK * bJ[bO ? 1 : 0];
                    if (bB) {
                        bQ = bJ[bO ? 0 : 1] - bQ
                    }
                    var bG = (bO ? bQ : bz), bD = bH[0] + bG, bF = bG / bJ[0], bE = (bO ? bz : bQ), bC = bH[1] + bE,
                        bM = bE / bJ[1];
                    bP.push([bD, bC, bF, bM, bI[bL][1], bI[bL][2]])
                }
                return bP
            }, bb = function (bA, bz) {
                return bA[0] > bz[0] ? 1 : -1
            }, aa = function (bz) {
                return function (bB, bA) {
                    var bC = true;
                    if (bz) {
                        if (bB[0][0] < bA[0][0]) {
                            bC = true
                        } else {
                            bC = bB[0][1] > bA[0][1]
                        }
                    } else {
                        if (bB[0][0] > bA[0][0]) {
                            bC = true
                        } else {
                            bC = bB[0][1] > bA[0][1]
                        }
                    }
                    return bC === false ? -1 : 1
                }
            }, M = function (bA, bz) {
                var bC = bA[0][0] < 0 ? -Math.PI - bA[0][0] : Math.PI - bA[0][0],
                    bB = bz[0][0] < 0 ? -Math.PI - bz[0][0] : Math.PI - bz[0][0];
                if (bC > bB) {
                    return 1
                } else {
                    return bA[0][1] > bz[0][1] ? 1 : -1
                }
            }, a2 = {top: bb, right: aa(true), bottom: aa(true), left: M}, ar = function (bz, bA) {
                return bz.sort(bA)
            }, ao = function (bA, bz) {
                var bC = ag[bA], bD = aj[bA], bB = function (bK, bR, bG, bJ, bP, bO, bF) {
                    if (bJ.length > 0) {
                        var bN = ar(bJ, a2[bK]), bL = bK === "right" || bK === "top", bE = a5(bK, bR, bG, bN, bP, bO, bL);
                        var bS = function (bV, bU) {
                            var bT = bs([bU[0], bU[1]], bV.canvas);
                            ak[bV.id] = [bT[0], bT[1], bU[2], bU[3]];
                            aM[bV.id] = bF
                        };
                        for (var bH = 0; bH < bE.length; bH++) {
                            var bM = bE[bH][4], bQ = bM.endpoints[0].elementId === bA,
                                bI = bM.endpoints[1].elementId === bA;
                            if (bQ) {
                                bS(bM.endpoints[0], bE[bH])
                            } else {
                                if (bI) {
                                    bS(bM.endpoints[1], bE[bH])
                                }
                            }
                        }
                    }
                };
                bB("bottom", bC, [bD.left, bD.top], bz.bottom, true, 1, [0, 1]);
                bB("top", bC, [bD.left, bD.top], bz.top, true, 0, [0, -1]);
                bB("left", bC, [bD.left, bD.top], bz.left, false, 0, [-1, 0]);
                bB("right", bC, [bD.left, bD.top], bz.right, false, 1, [1, 0])
            }, aG = function () {
                var bz = {}, bD = {}, bA = this, bC = {};
                this.reset = function () {
                    bz = {};
                    bD = {};
                    bC = {}
                };
                this.newConnection = function (bH) {
                    var bJ = bH.sourceId, bG = bH.targetId, bE = bH.endpoints, bI = true,
                        bF = function (bK, bL, bN, bM, bO) {
                            if ((bJ == bG) && bN.isContinuous) {
                                n.CurrentLibrary.removeElement(bE[1].canvas);
                                bI = false
                            }
                            W(bD, bM, [bO, bL, bN.constructor == au])
                        };
                    bF(0, bE[0], bE[0].anchor, bG, bH);
                    if (bI) {
                        bF(1, bE[1], bE[1].anchor, bJ, bH)
                    }
                };
                this.connectionDetached = function (bE) {
                    var bF = bE.connection || bE;
                    var bK = bF.sourceId, bL = bF.targetId, bO = bF.endpoints, bJ = function (bP, bQ, bS, bR, bT) {
                        if (bS.constructor == a3) {
                        } else {
                            A(bD[bR], function (bU) {
                                return bU[0].id == bT.id
                            })
                        }
                    };
                    bJ(1, bO[1], bO[1].anchor, bK, bF);
                    bJ(0, bO[0], bO[0].anchor, bL, bF);
                    var bG = bF.sourceId, bH = bF.targetId, bN = bF.endpoints[0].id, bI = bF.endpoints[1].id,
                        bM = function (bR, bP) {
                            if (bR) {
                                var bQ = function (bS) {
                                    return bS[4] == bP
                                };
                                A(bR.top, bQ);
                                A(bR.left, bQ);
                                A(bR.bottom, bQ);
                                A(bR.right, bQ)
                            }
                        };
                    bM(bC[bG], bN);
                    bM(bC[bH], bI);
                    bA.redraw(bG);
                    bA.redraw(bH)
                };
                this.add = function (bF, bE) {
                    W(bz, bE, bF)
                };
                this.changeId = function (bF, bE) {
                    bD[bE] = bD[bF];
                    bz[bE] = bz[bF];
                    delete bD[bF];
                    delete bz[bF]
                };
                this.getConnectionsFor = function (bE) {
                    return bD[bE] || []
                };
                this.getEndpointsFor = function (bE) {
                    return bz[bE] || []
                };
                this.deleteEndpoint = function (bE) {
                    A(bz[bE.elementId], function (bF) {
                        return bF.id == bE.id
                    })
                };
                this.clearFor = function (bE) {
                    delete bz[bE];
                    bz[bE] = []
                };
                var bB = function (bY, bL, bT, bI, bO, bP, bR, bN, b0, bQ, bH, bX) {
                    var bV = -1, bG = -1, bJ = bI.endpoints[bR], bS = bJ.id, bM = [1, 0][bR],
                        bE = [[bL, bT], bI, bO, bP, bS], bF = bY[b0],
                        bZ = bJ._continuousAnchorEdge ? bY[bJ._continuousAnchorEdge] : null;
                    if (bZ) {
                        var bW = g(bZ, function (b1) {
                            return b1[4] == bS
                        });
                        if (bW != -1) {
                            bZ.splice(bW, 1);
                            for (var bU = 0; bU < bZ.length; bU++) {
                                r(bH, bZ[bU][1], function (b1) {
                                    return b1.id == bZ[bU][1].id
                                });
                                r(bX, bZ[bU][1].endpoints[bR], function (b1) {
                                    return b1.id == bZ[bU][1].endpoints[bR].id
                                })
                            }
                        }
                    }
                    for (var bU = 0; bU < bF.length; bU++) {
                        if (bR == 1 && bF[bU][3] === bP && bG == -1) {
                            bG = bU
                        }
                        r(bH, bF[bU][1], function (b1) {
                            return b1.id == bF[bU][1].id
                        });
                        r(bX, bF[bU][1].endpoints[bR], function (b1) {
                            return b1.id == bF[bU][1].endpoints[bR].id
                        })
                    }
                    if (bV != -1) {
                        bF[bV] = bE
                    } else {
                        var bK = bN ? bG != -1 ? bG : 0 : bF.length;
                        bF.splice(bK, 0, bE)
                    }
                    bJ._continuousAnchorEdge = b0
                };
                this.redraw = function (bT, bV, bG, bJ) {
                    if (!a9) {
                        var b4 = bz[bT] || [], b3 = bD[bT] || [], bF = [], b2 = [], bH = [];
                        bG = bG || p();
                        bJ = bJ || {left: 0, top: 0};
                        if (bV) {
                            bV = {left: bV.left + bJ.left, top: bV.top + bJ.top}
                        }
                        X({elId: bT, offset: bV, recalc: false, timestamp: bG});
                        var bO = aj[bT], bK = ag[bT], bQ = {};
                        for (var b0 = 0; b0 < b3.length; b0++) {
                            var bL = b3[b0][0], bN = bL.sourceId, bI = bL.targetId,
                                bM = bL.endpoints[0].anchor.isContinuous, bS = bL.endpoints[1].anchor.isContinuous;
                            if (bM || bS) {
                                var b1 = bN + "_" + bI, bY = bI + "_" + bN, bX = bQ[b1], bR = bL.sourceId == bT ? 1 : 0;
                                if (bM && !bC[bN]) {
                                    bC[bN] = {top: [], right: [], bottom: [], left: []}
                                }
                                if (bS && !bC[bI]) {
                                    bC[bI] = {top: [], right: [], bottom: [], left: []}
                                }
                                if (bT != bI) {
                                    X({elId: bI, timestamp: bG})
                                }
                                if (bT != bN) {
                                    X({elId: bN, timestamp: bG})
                                }
                                var bP = aQ(bI), bE = aQ(bN);
                                if (bI == bN && (bM || bS)) {
                                    bB(bC[bN], -Math.PI / 2, 0, bL, false, bI, 0, false, "top", bN, bF, b2)
                                } else {
                                    if (!bX) {
                                        bX = bp(bN, bI, bE.o, bP.o);
                                        bQ[b1] = bX
                                    }
                                    if (bM) {
                                        bB(bC[bN], bX.theta, 0, bL, false, bI, 0, false, bX.a[0], bN, bF, b2)
                                    }
                                    if (bS) {
                                        bB(bC[bI], bX.theta2, -1, bL, true, bN, 1, true, bX.a[1], bI, bF, b2)
                                    }
                                }
                                if (bM) {
                                    r(bH, bN, function (b5) {
                                        return b5 === bN
                                    })
                                }
                                if (bS) {
                                    r(bH, bI, function (b5) {
                                        return b5 === bI
                                    })
                                }
                                r(bF, bL, function (b5) {
                                    return b5.id == bL.id
                                });
                                if ((bM && bR == 0) || (bS && bR == 1)) {
                                    r(b2, bL.endpoints[bR], function (b5) {
                                        return b5.id == bL.endpoints[bR].id
                                    })
                                }
                            }
                        }
                        for (var b0 = 0; b0 < b4.length; b0++) {
                            if (b4[b0].connections.length == 0 && b4[b0].anchor.isContinuous) {
                                if (!bC[bT]) {
                                    bC[bT] = {top: [], right: [], bottom: [], left: []}
                                }
                                bB(bC[bT], -Math.PI / 2, 0, {
                                    endpoints: [b4[b0], b4[b0]], paint: function () {
                                    }
                                }, false, bT, 0, false, "top", bT, bF, b2);
                                r(bH, bT, function (b5) {
                                    return b5 === bT
                                })
                            }
                        }
                        for (var b0 = 0; b0 < bH.length; b0++) {
                            ao(bH[b0], bC[bH[b0]])
                        }
                        for (var b0 = 0; b0 < b4.length; b0++) {
                            b4[b0].paint({timestamp: bG, offset: bO, dimensions: bK})
                        }
                        for (var b0 = 0; b0 < b2.length; b0++) {
                            b2[b0].paint({timestamp: bG, offset: bO, dimensions: bK})
                        }
                        for (var b0 = 0; b0 < b3.length; b0++) {
                            var bU = b3[b0][1];
                            if (bU.anchor.constructor == au) {
                                bU.paint({elementWithPrecedence: bT});
                                r(bF, b3[b0][0], function (b5) {
                                    return b5.id == b3[b0][0].id
                                });
                                for (var bZ = 0; bZ < bU.connections.length; bZ++) {
                                    if (bU.connections[bZ] !== b3[b0][0]) {
                                        r(bF, bU.connections[bZ], function (b5) {
                                            return b5.id == bU.connections[bZ].id
                                        })
                                    }
                                }
                            } else {
                                if (bU.anchor.constructor == ab) {
                                    r(bF, b3[b0][0], function (b5) {
                                        return b5.id == b3[b0][0].id
                                    })
                                }
                            }
                        }
                        var bW = bk[bT];
                        if (bW) {
                            bW.paint({timestamp: bG, recalc: false, elId: bT})
                        }
                        for (var b0 = 0; b0 < bF.length; b0++) {
                            bF[b0].paint({elId: bT, timestamp: bG, recalc: false})
                        }
                    }
                };
                this.rehomeEndpoint = function (bE, bI) {
                    var bF = bz[bE] || [], bG = br.getId(bI);
                    if (bG !== bE) {
                        for (var bH = 0; bH < bF.length; bH++) {
                            bA.add(bF[bH], bG)
                        }
                        bF.splice(0, bF.length)
                    }
                }
            };
        br.anchorManager = new aG();
        br.continuousAnchorFactory = {
            get: function (bA) {
                var bz = bn[bA.elementId];
                if (!bz) {
                    bz = {
                        type: "Continuous", compute: function (bB) {
                            return ak[bB.element.id] || [0, 0]
                        }, getCurrentLocation: function (bB) {
                            return ak[bB.id] || [0, 0]
                        }, getOrientation: function (bB) {
                            return aM[bB.id] || [0, 0]
                        }, isDynamic: true, isContinuous: true
                    };
                    bn[bA.elementId] = bz
                }
                return bz
            }
        };
        if (!jsPlumbAdapter.headless) {
            br.dragManager = jsPlumbAdapter.getDragManager(br)
        }
        br.recalculateOffsets = br.dragManager.updateOffsets;
        var az = function (bU) {
            var bK = this, bB = true, bP, bQ;
            bK.idPrefix = "_jsplumb_c_";
            bK.defaultLabelLocation = 0.5;
            bK.defaultOverlayKeys = ["Overlays", "ConnectionOverlays"];
            this.parent = bU.parent;
            x.apply(this, arguments);
            this.isVisible = function () {
                return bB
            };
            this.setVisible = function (bW) {
                bB = bW;
                bK[bW ? "showOverlays" : "hideOverlays"]();
                if (bK.connector && bK.connector.canvas) {
                    bK.connector.canvas.style.display = bW ? "block" : "none"
                }
                bK.repaint()
            };
            this.getTypeDescriptor = function () {
                return "connection"
            };
            this.getDefaultType = function () {
                return {
                    parameters: {},
                    scope: null,
                    detachable: bK._jsPlumb.Defaults.ConnectionsDetachable,
                    rettach: bK._jsPlumb.Defaults.ReattachConnections,
                    paintStyle: bK._jsPlumb.Defaults.PaintStyle || n.Defaults.PaintStyle,
                    connector: bK._jsPlumb.Defaults.Connector || n.Defaults.Connector,
                    hoverPaintStyle: bK._jsPlumb.Defaults.HoverPaintStyle || n.Defaults.HoverPaintStyle,
                    overlays: bK._jsPlumb.Defaults.ConnectorOverlays || n.Defaults.ConnectorOverlays
                }
            };
            var bS = this.applyType;
            this.applyType = function (bW) {
                bS(bW);
                if (bW.detachable != null) {
                    bK.setDetachable(bW.detachable)
                }
                if (bW.reattach != null) {
                    bK.setReattach(bW.reattach)
                }
                if (bW.scope) {
                    bK.scope = bW.scope
                }
                bK.setConnector(bW.connector)
            };
            bQ = bK.setHover;
            bK.setHover = function (bX) {
                var bW = br.ConnectorZIndex || n.Defaults.ConnectorZIndex;
                if (bW) {
                    bK.connector.setZIndex(bW + (bX ? 1 : 0))
                }
                bK.connector.setHover.apply(bK.connector, arguments);
                bQ.apply(bK, arguments)
            };
            bP = function (bW) {
                if (v == null) {
                    bK.setHover(bW, false)
                }
            };
            this.setConnector = function (bW, bY) {
                if (bK.connector != null) {
                    aZ(bK.connector.getDisplayElements(), bK.parent)
                }
                var bZ = {
                    _jsPlumb: bK._jsPlumb,
                    parent: bU.parent,
                    cssClass: bU.cssClass,
                    container: bU.container,
                    tooltip: bK.tooltip
                };
                if (z(bW)) {
                    this.connector = new n.Connectors[Y][bW](bZ)
                } else {
                    if (l(bW)) {
                        if (bW.length == 1) {
                            this.connector = new n.Connectors[Y][bW[0]](bZ)
                        } else {
                            this.connector = new n.Connectors[Y][bW[0]](n.extend(bW[1], bZ))
                        }
                    }
                }
                bK.canvas = bK.connector.canvas;
                D(bK.connector, bK, bP);
                var bX = br.ConnectorZIndex || n.Defaults.ConnectorZIndex;
                if (bX) {
                    bK.connector.setZIndex(bX)
                }
                if (!bY) {
                    bK.repaint()
                }
            };
            this.source = C(bU.source);
            this.target = C(bU.target);
            if (bU.sourceEndpoint) {
                this.source = bU.sourceEndpoint.endpointWillMoveTo || bU.sourceEndpoint.getElement()
            }
            if (bU.targetEndpoint) {
                this.target = bU.targetEndpoint.getElement()
            }
            bK.previousConnection = bU.previousConnection;
            this.sourceId = c(this.source, "id");
            this.targetId = c(this.target, "id");
            this.scope = bU.scope;
            this.endpoints = [];
            this.endpointStyles = [];
            var bT = function (bX, bW) {
                return (bX) ? br.makeAnchor(bX, bW, br) : null
            }, bO = function (bW, b2, bX, bZ, b0, bY, b1) {
                var b3;
                if (bW) {
                    bK.endpoints[b2] = bW;
                    bW.addConnection(bK)
                } else {
                    if (!bX.endpoints) {
                        bX.endpoints = [null, null]
                    }
                    var b8 = bX.endpoints[b2] || bX.endpoint || br.Defaults.Endpoints[b2] || n.Defaults.Endpoints[b2] || br.Defaults.Endpoint || n.Defaults.Endpoint;
                    if (!bX.endpointStyles) {
                        bX.endpointStyles = [null, null]
                    }
                    if (!bX.endpointHoverStyles) {
                        bX.endpointHoverStyles = [null, null]
                    }
                    var b6 = bX.endpointStyles[b2] || bX.endpointStyle || br.Defaults.EndpointStyles[b2] || n.Defaults.EndpointStyles[b2] || br.Defaults.EndpointStyle || n.Defaults.EndpointStyle;
                    if (b6.fillStyle == null && bY != null) {
                        b6.fillStyle = bY.strokeStyle
                    }
                    if (b6.outlineColor == null && bY != null) {
                        b6.outlineColor = bY.outlineColor
                    }
                    if (b6.outlineWidth == null && bY != null) {
                        b6.outlineWidth = bY.outlineWidth
                    }
                    var b5 = bX.endpointHoverStyles[b2] || bX.endpointHoverStyle || br.Defaults.EndpointHoverStyles[b2] || n.Defaults.EndpointHoverStyles[b2] || br.Defaults.EndpointHoverStyle || n.Defaults.EndpointHoverStyle;
                    if (b1 != null) {
                        if (b5 == null) {
                            b5 = {}
                        }
                        if (b5.fillStyle == null) {
                            b5.fillStyle = b1.strokeStyle
                        }
                    }
                    var b4 = bX.anchors ? bX.anchors[b2] : bX.anchor ? bX.anchor : bT(br.Defaults.Anchors[b2], b0) || bT(n.Defaults.Anchors[b2], b0) || bT(br.Defaults.Anchor, b0) || bT(n.Defaults.Anchor, b0),
                        b7 = bX.uuids ? bX.uuids[b2] : null;
                    b3 = aH({
                        paintStyle: b6,
                        hoverPaintStyle: b5,
                        endpoint: b8,
                        connections: [bK],
                        uuid: b7,
                        anchor: b4,
                        source: bZ,
                        scope: bX.scope,
                        container: bX.container,
                        reattach: bX.reattach || br.Defaults.ReattachConnections,
                        detachable: bX.detachable || br.Defaults.ConnectionsDetachable
                    });
                    bK.endpoints[b2] = b3;
                    if (bX.drawEndpoints === false) {
                        b3.setVisible(false, true, true)
                    }
                }
                return b3
            };
            var bM = bO(bU.sourceEndpoint, 0, bU, bK.source, bK.sourceId, bU.paintStyle, bU.hoverPaintStyle);
            if (bM) {
                W(aV, this.sourceId, bM)
            }
            var bL = bO(bU.targetEndpoint, 1, bU, bK.target, bK.targetId, bU.paintStyle, bU.hoverPaintStyle);
            if (bL) {
                W(aV, this.targetId, bL)
            }
            if (!this.scope) {
                this.scope = this.endpoints[0].scope
            }
            bK.endpointsToDeleteOnDetach = [null, null];
            if (bU.deleteEndpointsOnDetach) {
                if (bU.sourceIsNew) {
                    bK.endpointsToDeleteOnDetach[0] = bK.endpoints[0]
                }
                if (bU.targetIsNew) {
                    bK.endpointsToDeleteOnDetach[1] = bK.endpoints[1]
                }
            }
            bK.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || bU.connector || br.Defaults.Connector || n.Defaults.Connector, true);
            this.setPaintStyle(this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || bU.paintStyle || br.Defaults.PaintStyle || n.Defaults.PaintStyle, true);
            this.setHoverPaintStyle(this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || bU.hoverPaintStyle || br.Defaults.HoverPaintStyle || n.Defaults.HoverPaintStyle, true);
            this.paintStyleInUse = this.getPaintStyle();
            X({elId: this.sourceId, timestamp: bd});
            X({elId: this.targetId, timestamp: bd});
            var bD = aj[this.sourceId], bC = ag[this.sourceId], bz = aj[this.targetId], bH = ag[this.targetId],
                bI = bd || p(), bN = this.endpoints[0].anchor.compute({
                    xy: [bD.left, bD.top],
                    wh: bC,
                    element: this.endpoints[0],
                    elementId: this.endpoints[0].elementId,
                    txy: [bz.left, bz.top],
                    twh: bH,
                    tElement: this.endpoints[1],
                    timestamp: bI
                });
            this.endpoints[0].paint({anchorLoc: bN, timestamp: bI});
            bN = this.endpoints[1].anchor.compute({
                xy: [bz.left, bz.top],
                wh: bH,
                element: this.endpoints[1],
                elementId: this.endpoints[1].elementId,
                txy: [bD.left, bD.top],
                twh: bC,
                tElement: this.endpoints[0],
                timestamp: bI
            });
            this.endpoints[1].paint({anchorLoc: bN, timestamp: bI});
            var bA = br.Defaults.ConnectionsDetachable;
            if (bU.detachable === false) {
                bA = false
            }
            if (bK.endpoints[0].connectionsDetachable === false) {
                bA = false
            }
            if (bK.endpoints[1].connectionsDetachable === false) {
                bA = false
            }
            this.isDetachable = function () {
                return bA === true
            };
            this.setDetachable = function (bW) {
                bA = bW === true
            };
            var bG = bU.reattach || bK.endpoints[0].reattachConnections || bK.endpoints[1].reattachConnections || br.Defaults.ReattachConnections;
            this.isReattach = function () {
                return bG === true
            };
            this.setReattach = function (bW) {
                bG = bW === true
            };
            var bF = bU.cost || bK.endpoints[0].getConnectionCost();
            bK.getCost = function () {
                return bF
            };
            bK.setCost = function (bW) {
                bF = bW
            };
            var bE = !(bU.bidirectional === false);
            if (bU.bidirectional == null) {
                bE = bK.endpoints[0].areConnectionsBidirectional()
            }
            bK.isBidirectional = function () {
                return bE
            };
            var bV = n.extend({}, this.endpoints[0].getParameters());
            n.extend(bV, this.endpoints[1].getParameters());
            n.extend(bV, bK.getParameters());
            bK.setParameters(bV);
            this.getAttachedElements = function () {
                return bK.endpoints
            };
            this.moveParent = function (bZ) {
                var bY = n.CurrentLibrary, bX = bY.getParent(bK.connector.canvas);
                if (bK.connector.bgCanvas) {
                    bY.removeElement(bK.connector.bgCanvas, bX);
                    bY.appendElement(bK.connector.bgCanvas, bZ)
                }
                bY.removeElement(bK.connector.canvas, bX);
                bY.appendElement(bK.connector.canvas, bZ);
                for (var bW = 0; bW < bK.overlays.length; bW++) {
                    if (bK.overlays[bW].isAppendedAtTopLevel) {
                        bY.removeElement(bK.overlays[bW].canvas, bX);
                        bY.appendElement(bK.overlays[bW].canvas, bZ);
                        if (bK.overlays[bW].reattachListeners) {
                            bK.overlays[bW].reattachListeners(bK.connector)
                        }
                    }
                }
                if (bK.connector.reattachListeners) {
                    bK.connector.reattachListeners()
                }
            };
            var bJ = null;
            this.paint = function (cd) {
                if (bB) {
                    cd = cd || {};
                    var b4 = cd.elId, b5 = cd.ui, b2 = cd.recalc, bX = cd.timestamp, b6 = false,
                        cc = b6 ? this.sourceId : this.targetId, b1 = b6 ? this.targetId : this.sourceId,
                        bY = b6 ? 0 : 1, ce = b6 ? 1 : 0;
                    if (bX == null || bX != bJ) {
                        var cf = X({elId: b4, offset: b5, recalc: b2, timestamp: bX}),
                            b3 = X({elId: cc, timestamp: bX});
                        var b8 = this.endpoints[ce], bW = this.endpoints[bY], b0 = b8.anchor.getCurrentLocation(b8),
                            cb = bW.anchor.getCurrentLocation(bW);
                        var bZ = 0;
                        for (var ca = 0; ca < bK.overlays.length; ca++) {
                            var b7 = bK.overlays[ca];
                            if (b7.isVisible()) {
                                bZ = Math.max(bZ, b7.computeMaxSize())
                            }
                        }
                        var b9 = this.connector.compute(b0, cb, this.endpoints[ce], this.endpoints[bY], this.endpoints[ce].anchor, this.endpoints[bY].anchor, bK.paintStyleInUse.lineWidth, bZ, cf, b3);
                        bK.connector.paint(b9, bK.paintStyleInUse);
                        for (var ca = 0; ca < bK.overlays.length; ca++) {
                            var b7 = bK.overlays[ca];
                            if (b7.isVisible) {
                                bK.overlayPlacements[ca] = b7.draw(bK.connector, bK.paintStyleInUse, b9)
                            }
                        }
                    }
                    bJ = bX
                }
            };
            this.repaint = function (bX) {
                bX = bX || {};
                var bW = !(bX.recalc === false);
                this.paint({elId: this.sourceId, recalc: bW, timestamp: bX.timestamp})
            };
            var bR = bU.type || bK.endpoints[0].connectionType || bK.endpoints[1].connectionType;
            if (bR) {
                bK.addType(bR)
            }
        };
        var bh = function (bA) {
            var bz = false;
            return {
                drag: function () {
                    if (bz) {
                        bz = false;
                        return true
                    }
                    var bB = n.CurrentLibrary.getUIPosition(arguments, br.getZoom()), bC = bA.element;
                    if (bC) {
                        n.CurrentLibrary.setOffset(bC, bB);
                        be(C(bC), bB)
                    }
                }, stopDrag: function () {
                    bz = true
                }
            }
        };
        var av = function (bD, bC, bE, bB, bz) {
            var bA = new a3({reference: bC, referenceCanvas: bB});
            return aH({paintStyle: bD, endpoint: bE, anchor: bA, source: bz, scope: "__floating"})
        };
        var S = function (bB, bz) {
            var bD = document.createElement("div");
            bD.style.position = "absolute";
            var bA = C(bD);
            aX(bD, bz);
            var bC = H(bA);
            X({elId: bC});
            bB.id = bC;
            bB.element = bA
        };
        var ah = function (b5) {
            var bS = this;
            bS.idPrefix = "_jsplumb_e_";
            bS.defaultLabelLocation = [0.5, 0.5];
            bS.defaultOverlayKeys = ["Overlays", "EndpointOverlays"];
            this.parent = b5.parent;
            x.apply(this, arguments);
            b5 = b5 || {};
            this.getTypeDescriptor = function () {
                return "endpoint"
            };
            this.getDefaultType = function () {
                return {
                    parameters: {},
                    scope: null,
                    maxConnections: bS._jsPlumb.Defaults.MaxConnections,
                    paintStyle: bS._jsPlumb.Defaults.EndpointStyle || n.Defaults.EndpointStyle,
                    endpoint: bS._jsPlumb.Defaults.Endpoint || n.Defaults.Endpoint,
                    hoverPaintStyle: bS._jsPlumb.Defaults.EndpointHoverStyle || n.Defaults.EndpointHoverStyle,
                    overlays: bS._jsPlumb.Defaults.EndpointOverlays || n.Defaults.EndpointOverlays,
                    connectorStyle: b5.connectorStyle,
                    connectorHoverStyle: b5.connectorHoverStyle,
                    connectorClass: b5.connectorClass,
                    connectorHoverClass: b5.connectorHoverClass,
                    connectorOverlays: b5.connectorOverlays,
                    connector: b5.connector,
                    connectorTooltip: b5.connectorTooltip
                }
            };
            var b3 = this.applyType;
            this.applyType = function (b7) {
                b3(b7);
                if (b7.maxConnections != null) {
                    bY = b7.maxConnections
                }
                if (b7.scope) {
                    bS.scope = b7.scope
                }
                bS.connectorStyle = b7.connectorStyle;
                bS.connectorHoverStyle = b7.connectorHoverStyle;
                bS.connectorOverlays = b7.connectorOverlays;
                bS.connector = b7.connector;
                bS.connectorTooltip = b7.connectorTooltip;
                bS.connectionType = b7.connectionType;
                bS.connectorClass = b7.connectorClass;
                bS.connectorHoverClass = b7.connectorHoverClass
            };
            var bE = true, bC = !(b5.enabled === false);
            this.isVisible = function () {
                return bE
            };
            this.setVisible = function (b8, cb, b7) {
                bE = b8;
                if (bS.canvas) {
                    bS.canvas.style.display = b8 ? "block" : "none"
                }
                bS[b8 ? "showOverlays" : "hideOverlays"]();
                if (!cb) {
                    for (var ca = 0; ca < bS.connections.length; ca++) {
                        bS.connections[ca].setVisible(b8);
                        if (!b7) {
                            var b9 = bS === bS.connections[ca].endpoints[0] ? 1 : 0;
                            if (bS.connections[ca].endpoints[b9].connections.length == 1) {
                                bS.connections[ca].endpoints[b9].setVisible(b8, true, true)
                            }
                        }
                    }
                }
            };
            this.isEnabled = function () {
                return bC
            };
            this.setEnabled = function (b7) {
                bC = b7
            };
            var bR = b5.source, bL = b5.uuid, b2 = null, bG = null;
            if (bL) {
                aW[bL] = bS
            }
            var bJ = c(bR, "id");
            this.elementId = bJ;
            this.element = bR;
            var bB = b5.connectionCost;
            this.getConnectionCost = function () {
                return bB
            };
            this.setConnectionCost = function (b7) {
                bB = b7
            };
            var b1 = b5.connectionsBidirectional === false ? false : true;
            this.areConnectionsBidirectional = function () {
                return b1
            };
            this.setConnectionsBidirectional = function (b7) {
                b1 = b7
            };
            bS.anchor = b5.anchor ? br.makeAnchor(b5.anchor, bJ, br) : b5.anchors ? br.makeAnchor(b5.anchors, bJ, br) : br.makeAnchor(br.Defaults.Anchor || "TopCenter", bJ, br);
            if (!b5._transient) {
                br.anchorManager.add(bS, bJ)
            }
            var bP = null, bU = null;
            this.setEndpoint = function (b7) {
                var b8 = {
                    _jsPlumb: bS._jsPlumb,
                    parent: b5.parent,
                    container: b5.container,
                    tooltip: b5.tooltip,
                    connectorTooltip: b5.connectorTooltip,
                    endpoint: bS
                };
                if (z(b7)) {
                    bP = new n.Endpoints[Y][b7](b8)
                } else {
                    if (l(b7)) {
                        b8 = n.extend(b7[1], b8);
                        bP = new n.Endpoints[Y][b7[0]](b8)
                    } else {
                        bP = b7.clone()
                    }
                }
                var b9 = n.extend({}, b8);
                bP.clone = function () {
                    var ca = new Object();
                    bP.constructor.apply(ca, [b9]);
                    return ca
                };
                bS.endpoint = bP;
                bS.type = bS.endpoint.type
            };
            this.setEndpoint(b5.endpoint || br.Defaults.Endpoint || n.Defaults.Endpoint || "Dot");
            bU = bP;
            var bQ = bS.setHover;
            bS.setHover = function () {
                bS.endpoint.setHover.apply(bS.endpoint, arguments);
                bQ.apply(bS, arguments)
            };
            var b6 = function (b7) {
                if (bS.connections.length > 0) {
                    bS.connections[0].setHover(b7, false)
                } else {
                    bS.setHover(b7)
                }
            };
            D(bS.endpoint, bS, b6);
            this.setPaintStyle(b5.paintStyle || b5.style || br.Defaults.EndpointStyle || n.Defaults.EndpointStyle, true);
            this.setHoverPaintStyle(b5.hoverPaintStyle || br.Defaults.EndpointHoverStyle || n.Defaults.EndpointHoverStyle, true);
            this.paintStyleInUse = this.getPaintStyle();
            var bN = this.getPaintStyle();
            this.connectorStyle = b5.connectorStyle;
            this.connectorHoverStyle = b5.connectorHoverStyle;
            this.connectorOverlays = b5.connectorOverlays;
            this.connector = b5.connector;
            this.connectorTooltip = b5.connectorTooltip;
            this.connectorClass = b5.connectorClass;
            this.connectorHoverClass = b5.connectorHoverClass;
            this.isSource = b5.isSource || false;
            this.isTarget = b5.isTarget || false;
            var bY = b5.maxConnections || br.Defaults.MaxConnections;
            this.getAttachedElements = function () {
                return bS.connections
            };
            this.canvas = this.endpoint.canvas;
            this.connections = b5.connections || [];
            this.scope = b5.scope || R;
            this.connectionType = b5.connectionType;
            this.timestamp = null;
            bS.reattachConnections = b5.reattach || br.Defaults.ReattachConnections;
            bS.connectionsDetachable = br.Defaults.ConnectionsDetachable;
            if (b5.connectionsDetachable === false || b5.detachable === false) {
                bS.connectionsDetachable = false
            }
            var bM = b5.dragAllowedWhenFull || true;
            if (b5.onMaxConnections) {
                bS.bind("maxConnections", b5.onMaxConnections)
            }
            this.computeAnchor = function (b7) {
                return bS.anchor.compute(b7)
            };
            this.addConnection = function (b7) {
                bS.connections.push(b7)
            };
            this.detach = function (b8, cd, b9, cg, b7) {
                var cf = g(bS.connections, function (ci) {
                    return ci.id == b8.id
                }), ce = false;
                cg = (cg !== false);
                if (cf >= 0) {
                    if (b9 || b8._forceDetach || b8.isDetachable() || b8.isDetachAllowed(b8)) {
                        var ch = b8.endpoints[0] == bS ? b8.endpoints[1] : b8.endpoints[0];
                        if (b9 || b8._forceDetach || (bS.isDetachAllowed(b8))) {
                            bS.connections.splice(cf, 1);
                            if (!cd) {
                                ch.detach(b8, true, b9);
                                if (b8.endpointsToDeleteOnDetach) {
                                    for (var cc = 0; cc < b8.endpointsToDeleteOnDetach.length; cc++) {
                                        var ca = b8.endpointsToDeleteOnDetach[cc];
                                        if (ca && ca.connections.length == 0) {
                                            br.deleteEndpoint(ca)
                                        }
                                    }
                                }
                            }
                            aZ(b8.connector.getDisplayElements(), b8.parent);
                            A(a0[b8.scope], function (ci) {
                                return ci.id == b8.id
                            });
                            ce = true;
                            var cb = (!cd && cg);
                            ba(b8, cb, b7)
                        }
                    }
                }
                return ce
            };
            this.detachAll = function (b8, b7) {
                while (bS.connections.length > 0) {
                    bS.detach(bS.connections[0], false, true, b8, b7)
                }
            };
            this.detachFrom = function (ca, b9, b7) {
                var cb = [];
                for (var b8 = 0; b8 < bS.connections.length; b8++) {
                    if (bS.connections[b8].endpoints[1] == ca || bS.connections[b8].endpoints[0] == ca) {
                        cb.push(bS.connections[b8])
                    }
                }
                for (var b8 = 0; b8 < cb.length; b8++) {
                    if (bS.detach(cb[b8], false, true, b9, b7)) {
                        cb[b8].setHover(false, false)
                    }
                }
            };
            this.detachFromConnection = function (b8) {
                var b7 = g(bS.connections, function (b9) {
                    return b9.id == b8.id
                });
                if (b7 >= 0) {
                    bS.connections.splice(b7, 1)
                }
            };
            this.getElement = function () {
                return bR
            };
            this.setElement = function (ca, b7) {
                var cc = H(ca);
                A(aV[bS.elementId], function (cd) {
                    return cd.id == bS.id
                });
                bR = C(ca);
                bJ = H(bR);
                bS.elementId = bJ;
                var cb = ay({source: cc, container: b7}), b9 = bD.getParent(bS.canvas);
                bD.removeElement(bS.canvas, b9);
                bD.appendElement(bS.canvas, cb);
                for (var b8 = 0; b8 < bS.connections.length; b8++) {
                    bS.connections[b8].moveParent(cb);
                    bS.connections[b8].sourceId = bJ;
                    bS.connections[b8].source = bR
                }
                W(aV, cc, bS)
            };
            this.getUuid = function () {
                return bL
            };
            this.makeInPlaceCopy = function () {
                var b9 = bS.anchor.getCurrentLocation(bS), b8 = bS.anchor.getOrientation(bS), b7 = {
                    compute: function () {
                        return [b9[0], b9[1]]
                    }, getCurrentLocation: function () {
                        return [b9[0], b9[1]]
                    }, getOrientation: function () {
                        return b8
                    }
                };
                return aH({
                    anchor: b7,
                    source: bR,
                    paintStyle: this.getPaintStyle(),
                    endpoint: bP,
                    _transient: true,
                    scope: bS.scope
                })
            };
            this.isConnectedTo = function (b9) {
                var b8 = false;
                if (b9) {
                    for (var b7 = 0; b7 < bS.connections.length; b7++) {
                        if (bS.connections[b7].endpoints[1] == b9) {
                            b8 = true;
                            break
                        }
                    }
                }
                return b8
            };
            this.isFloating = function () {
                return b2 != null
            };
            this.connectorSelector = function () {
                var b7 = bS.connections[0];
                if (bS.isTarget && b7) {
                    return b7
                } else {
                    return (bS.connections.length < bY) || bY == -1 ? null : b7
                }
            };
            this.isFull = function () {
                return !(bS.isFloating() || bY < 1 || bS.connections.length < bY)
            };
            this.setDragAllowedWhenFull = function (b7) {
                bM = b7
            };
            this.setStyle = bS.setPaintStyle;
            this.equals = function (b7) {
                return this.anchor.equals(b7.anchor)
            };
            var bO = function (b8) {
                var b7 = 0;
                if (b8 != null) {
                    for (var b9 = 0; b9 < bS.connections.length; b9++) {
                        if (bS.connections[b9].sourceId == b8 || bS.connections[b9].targetId == b8) {
                            b7 = b9;
                            break
                        }
                    }
                }
                return bS.connections[b7]
            };
            this.paint = function (ca) {
                ca = ca || {};
                var cg = ca.timestamp, cf = !(ca.recalc === false);
                if (!cg || bS.timestamp !== cg) {
                    X({elId: bJ, timestamp: cg, recalc: cf});
                    var cm = ca.offset || aj[bJ];
                    if (cm) {
                        var cd = ca.anchorPoint, cb = ca.connectorPaintStyle;
                        if (cd == null) {
                            var b7 = ca.dimensions || ag[bJ];
                            if (cm == null || b7 == null) {
                                X({elId: bJ, timestamp: cg});
                                cm = aj[bJ];
                                b7 = ag[bJ]
                            }
                            var b9 = {xy: [cm.left, cm.top], wh: b7, element: bS, timestamp: cg};
                            if (cf && bS.anchor.isDynamic && bS.connections.length > 0) {
                                var cj = bO(ca.elementWithPrecedence), cl = cj.endpoints[0] == bS ? 1 : 0,
                                    cc = cl == 0 ? cj.sourceId : cj.targetId, ci = aj[cc], ck = ag[cc];
                                b9.txy = [ci.left, ci.top];
                                b9.twh = ck;
                                b9.tElement = cj.endpoints[cl]
                            }
                            cd = bS.anchor.compute(b9)
                        }
                        var ch = bP.compute(cd, bS.anchor.getOrientation(bS), bS.paintStyleInUse, cb || bS.paintStyleInUse);
                        bP.paint(ch, bS.paintStyleInUse, bS.anchor);
                        bS.timestamp = cg;
                        for (var ce = 0; ce < bS.overlays.length; ce++) {
                            var b8 = bS.overlays[ce];
                            if (b8.isVisible) {
                                bS.overlayPlacements[ce] = b8.draw(bS.endpoint, bS.paintStyleInUse, ch)
                            }
                        }
                    }
                }
            };
            this.repaint = this.paint;
            this.removeConnection = this.detach;
            if (n.CurrentLibrary.isDragSupported(bR)) {
                var bX = {id: null, element: null}, bW = null, bA = false, bF = null, bz = bh(bX);
                var bH = function () {
                    bW = bS.connectorSelector();
                    var b7 = true;
                    if (!bS.isEnabled()) {
                        b7 = false
                    }
                    if (bW == null && !b5.isSource) {
                        b7 = false
                    }
                    if (b5.isSource && bS.isFull() && !bM) {
                        b7 = false
                    }
                    if (bW != null && !bW.isDetachable()) {
                        b7 = false
                    }
                    if (b7 === false) {
                        if (n.CurrentLibrary.stopDrag) {
                            n.CurrentLibrary.stopDrag()
                        }
                        bz.stopDrag();
                        return false
                    }
                    if (bW && !bS.isFull() && b5.isSource) {
                        bW = null
                    }
                    X({elId: bJ});
                    bG = bS.makeInPlaceCopy();
                    bG.referenceEndpoint = bS;
                    bG.paint();
                    S(bX, bS.parent);
                    var cd = C(bG.canvas), cb = s(cd, br), b8 = bs([cb.left, cb.top], bG.canvas);
                    n.CurrentLibrary.setOffset(bX.element, {left: b8[0], top: b8[1]});
                    if (bS.parentAnchor) {
                        bS.anchor = br.makeAnchor(bS.parentAnchor, bS.elementId, br)
                    }
                    d(C(bS.canvas), "dragId", bX.id);
                    d(C(bS.canvas), "elId", bJ);
                    if (b5.proxy) {
                        bS.setPaintStyle(b5.proxy.paintStyle)
                    }
                    b2 = av(bS.getPaintStyle(), bS.anchor, bP, bS.canvas, bX.element);
                    if (bW == null) {
                        bS.anchor.locked = true;
                        bS.setHover(false, false);
                        bW = af({
                            sourceEndpoint: bS,
                            targetEndpoint: b2,
                            source: bS.endpointWillMoveTo || C(bR),
                            target: bX.element,
                            anchors: [bS.anchor, b2.anchor],
                            paintStyle: b5.connectorStyle,
                            hoverPaintStyle: b5.connectorHoverStyle,
                            connector: b5.connector,
                            overlays: b5.connectorOverlays,
                            type: bS.connectionType,
                            cssClass: bS.connectorClass,
                            hoverClass: bS.connectorHoverClass
                        })
                    } else {
                        bA = true;
                        bW.setHover(false);
                        bI(C(bG.canvas), false, true);
                        var ca = bW.endpoints[0].id == bS.id ? 0 : 1;
                        bW.floatingAnchorIndex = ca;
                        bS.detachFromConnection(bW);
                        var ce = C(bS.canvas), cc = n.CurrentLibrary.getDragScope(ce);
                        d(ce, "originalScope", cc);
                        var b9 = n.CurrentLibrary.getDropScope(ce);
                        n.CurrentLibrary.setDragScope(ce, b9);
                        if (ca == 0) {
                            bF = [bW.source, bW.sourceId, b0, cc];
                            bW.source = bX.element;
                            bW.sourceId = bX.id
                        } else {
                            bF = [bW.target, bW.targetId, b0, cc];
                            bW.target = bX.element;
                            bW.targetId = bX.id
                        }
                        bW.endpoints[ca == 0 ? 1 : 0].anchor.locked = true;
                        bW.suspendedEndpoint = bW.endpoints[ca];
                        bW.suspendedEndpoint.setHover(false);
                        b2.referenceEndpoint = bW.suspendedEndpoint;
                        bW.endpoints[ca] = b2;
                        a8(bW)
                    }
                    bk[bX.id] = bW;
                    b2.addConnection(bW);
                    W(aV, bX.id, b2);
                    br.currentlyDragging = true
                };
                var bD = n.CurrentLibrary, bZ = b5.dragOptions || {}, bT = n.extend({}, bD.defaultDragOptions),
                    bV = bD.dragEvents.start, b4 = bD.dragEvents.stop, bK = bD.dragEvents.drag;
                bZ = n.extend(bT, bZ);
                bZ.scope = bZ.scope || bS.scope;
                bZ[bV] = ap(bZ[bV], bH);
                bZ[bK] = ap(bZ[bK], bz.drag);
                bZ[b4] = ap(bZ[b4], function () {
                    var b8 = bD.getDropEvent(arguments);
                    br.currentlyDragging = false;
                    A(aV[bX.id], function (b9) {
                        return b9.id == b2.id
                    });
                    aZ([bX.element[0], b2.canvas], bR);
                    aw(bG.canvas, bR);
                    br.anchorManager.clearFor(bX.id);
                    var b7 = bW.floatingAnchorIndex == null ? 1 : bW.floatingAnchorIndex;
                    bW.endpoints[b7 == 0 ? 1 : 0].anchor.locked = false;
                    bS.setPaintStyle(bN);
                    if (bW.endpoints[b7] == b2) {
                        if (bA && bW.suspendedEndpoint) {
                            if (b7 == 0) {
                                bW.source = bF[0];
                                bW.sourceId = bF[1]
                            } else {
                                bW.target = bF[0];
                                bW.targetId = bF[1]
                            }
                            n.CurrentLibrary.setDragScope(bF[2], bF[3]);
                            bW.endpoints[b7] = bW.suspendedEndpoint;
                            if (bW.isReattach() || bW._forceReattach || bW._forceDetach || !bW.endpoints[b7 == 0 ? 1 : 0].detach(bW, false, false, true, b8)) {
                                bW.setHover(false);
                                bW.floatingAnchorIndex = null;
                                bW.suspendedEndpoint.addConnection(bW);
                                br.repaint(bF[1])
                            }
                            bW._forceDetach = null;
                            bW._forceReattach = null
                        } else {
                            aZ(bW.connector.getDisplayElements(), bS.parent);
                            bS.detachFromConnection(bW)
                        }
                    }
                    bS.anchor.locked = false;
                    bS.paint({recalc: false});
                    aT(bW);
                    bW = null;
                    bG = null;
                    delete aV[b2.elementId];
                    b2.anchor = null;
                    b2 = null;
                    br.currentlyDragging = false
                });
                var b0 = C(bS.canvas);
                n.CurrentLibrary.initDraggable(b0, bZ, true)
            }
            var bI = function (b9, ce, cc, cf) {
                if ((b5.isTarget || ce) && n.CurrentLibrary.isDropSupported(bR)) {
                    var ca = b5.dropOptions || br.Defaults.DropOptions || n.Defaults.DropOptions;
                    ca = n.extend({}, ca);
                    ca.scope = ca.scope || bS.scope;
                    var b8 = n.CurrentLibrary.dragEvents.drop, cd = n.CurrentLibrary.dragEvents.over,
                        b7 = n.CurrentLibrary.dragEvents.out, cb = function () {
                            var cg = n.CurrentLibrary.getDropEvent(arguments),
                                ct = C(n.CurrentLibrary.getDragObject(arguments)), ci = c(ct, "dragId"), ck = c(ct, "elId"),
                                cs = c(ct, "originalScope"), cn = bk[ci];
                            var cl = cn.suspendedEndpoint && (cn.suspendedEndpoint.id == bS.id || bS.referenceEndpoint && cn.suspendedEndpoint.id == bS.referenceEndpoint.id);
                            if (cl) {
                                cn._forceReattach = true;
                                return
                            }
                            if (cn != null) {
                                var cp = cn.floatingAnchorIndex == null ? 1 : cn.floatingAnchorIndex, cq = cp == 0 ? 1 : 0;
                                if (cs) {
                                    n.CurrentLibrary.setDragScope(ct, cs)
                                }
                                var cr = cf != null ? cf.isEnabled() : true;
                                if (bS.isFull()) {
                                    bS.fire("maxConnections", {endpoint: bS, connection: cn, maxConnections: bY}, cg)
                                }
                                if (!bS.isFull() && !(cp == 0 && !bS.isSource) && !(cp == 1 && !bS.isTarget) && cr) {
                                    var cm = true;
                                    if (cn.suspendedEndpoint && cn.suspendedEndpoint.id != bS.id) {
                                        if (cp == 0) {
                                            cn.source = cn.suspendedEndpoint.element;
                                            cn.sourceId = cn.suspendedEndpoint.elementId
                                        } else {
                                            cn.target = cn.suspendedEndpoint.element;
                                            cn.targetId = cn.suspendedEndpoint.elementId
                                        }
                                        if (!cn.isDetachAllowed(cn) || !cn.endpoints[cp].isDetachAllowed(cn) || !cn.suspendedEndpoint.isDetachAllowed(cn) || !br.checkCondition("beforeDetach", cn)) {
                                            cm = false
                                        }
                                    }
                                    if (cp == 0) {
                                        cn.source = bS.element;
                                        cn.sourceId = bS.elementId
                                    } else {
                                        cn.target = bS.element;
                                        cn.targetId = bS.elementId
                                    }
                                    var co = function () {
                                        cn.floatingAnchorIndex = null
                                    };
                                    var ch = function () {
                                        cn.endpoints[cp].detachFromConnection(cn);
                                        if (cn.suspendedEndpoint) {
                                            cn.suspendedEndpoint.detachFromConnection(cn)
                                        }
                                        cn.endpoints[cp] = bS;
                                        bS.addConnection(cn);
                                        var cx = bS.getParameters();
                                        for (var cv in cx) {
                                            cn.setParameter(cv, cx[cv])
                                        }
                                        if (!cn.suspendedEndpoint) {
                                            if (cx.draggable) {
                                                n.CurrentLibrary.initDraggable(bS.element, bZ, true)
                                            }
                                        } else {
                                            var cw = cn.suspendedEndpoint.getElement(), cu = cn.suspendedEndpoint.elementId;
                                            ba({
                                                source: cp == 0 ? cw : cn.source,
                                                target: cp == 1 ? cw : cn.target,
                                                sourceId: cp == 0 ? cu : cn.sourceId,
                                                targetId: cp == 1 ? cu : cn.targetId,
                                                sourceEndpoint: cp == 0 ? cn.suspendedEndpoint : cn.endpoints[0],
                                                targetEndpoint: cp == 1 ? cn.suspendedEndpoint : cn.endpoints[1],
                                                connection: cn
                                            }, true, cg)
                                        }
                                        bx(cn, null, cg);
                                        co()
                                    };
                                    var cj = function () {
                                        if (cn.suspendedEndpoint) {
                                            cn.endpoints[cp] = cn.suspendedEndpoint;
                                            cn.setHover(false);
                                            cn._forceDetach = true;
                                            if (cp == 0) {
                                                cn.source = cn.suspendedEndpoint.element;
                                                cn.sourceId = cn.suspendedEndpoint.elementId
                                            } else {
                                                cn.target = cn.suspendedEndpoint.element;
                                                cn.targetId = cn.suspendedEndpoint.elementId
                                            }
                                            cn.suspendedEndpoint.addConnection(cn);
                                            cn.endpoints[0].repaint();
                                            cn.repaint();
                                            br.repaint(cn.source.elementId);
                                            cn._forceDetach = false
                                        }
                                        co()
                                    };
                                    cm = cm && bS.isDropAllowed(cn.sourceId, cn.targetId, cn.scope, cn, bS);
                                    if (cm) {
                                        ch()
                                    } else {
                                        cj()
                                    }
                                }
                                br.currentlyDragging = false;
                                delete bk[ci];
                                cn.suspendedEndpoint = null
                            }
                        };
                    ca[b8] = ap(ca[b8], cb);
                    ca[cd] = ap(ca[cd], function () {
                        var ch = n.CurrentLibrary.getDragObject(arguments), ck = c(C(ch), "dragId"), cj = bk[ck];
                        if (cj != null) {
                            var cg = cj.floatingAnchorIndex == null ? 1 : cj.floatingAnchorIndex;
                            var ci = (bS.isTarget && cj.floatingAnchorIndex != 0) || (cj.suspendedEndpoint && bS.referenceEndpoint && bS.referenceEndpoint.id == cj.suspendedEndpoint.id);
                            if (ci) {
                                cj.endpoints[cg].anchor.over(bS.anchor)
                            }
                        }
                    });
                    ca[b7] = ap(ca[b7], function () {
                        var ch = n.CurrentLibrary.getDragObject(arguments), ck = c(C(ch), "dragId"), cj = bk[ck];
                        if (cj != null) {
                            var cg = cj.floatingAnchorIndex == null ? 1 : cj.floatingAnchorIndex;
                            var ci = (bS.isTarget && cj.floatingAnchorIndex != 0) || (cj.suspendedEndpoint && bS.referenceEndpoint && bS.referenceEndpoint.id == cj.suspendedEndpoint.id);
                            if (ci) {
                                cj.endpoints[cg].anchor.out()
                            }
                        }
                    });
                    n.CurrentLibrary.initDroppable(b9, ca, true, cc)
                }
            };
            bI(C(bS.canvas), true, !(b5._transient || bS.anchor.isFloating), bS);
            if (b5.type) {
                bS.addType(b5.type)
            }
            return bS
        }
    };
    var n = new w();
    if (typeof window != "undefined") {
        window.jsPlumb = n
    }
    n.getInstance = function (I) {
        var H = new w(I);
        H.init();
        return H
    };
    if (typeof define === "function" && define.amd && define.amd.jsPlumb) {
        define("jsplumb", [], function () {
            return n
        })
    }
    var q = function (H, M, J, I, L, K) {
        return function (O) {
            O = O || {};
            var N = O.jsPlumbInstance.makeAnchor([H, M, J, I, 0, 0], O.elementId, O.jsPlumbInstance);
            N.type = L;
            if (K) {
                K(N, O)
            }
            return N
        }
    };
    n.Anchors.TopCenter = q(0.5, 0, 0, -1, "TopCenter");
    n.Anchors.BottomCenter = q(0.5, 1, 0, 1, "BottomCenter");
    n.Anchors.LeftMiddle = q(0, 0.5, -1, 0, "LeftMiddle");
    n.Anchors.RightMiddle = q(1, 0.5, 1, 0, "RightMiddle");
    n.Anchors.Center = q(0.5, 0.5, 0, 0, "Center");
    n.Anchors.TopRight = q(1, 0, 0, -1, "TopRight");
    n.Anchors.BottomRight = q(1, 1, 0, 1, "BottomRight");
    n.Anchors.TopLeft = q(0, 0, 0, -1, "TopLeft");
    n.Anchors.BottomLeft = q(0, 1, 0, 1, "BottomLeft");
    n.Defaults.DynamicAnchors = function (H) {
        return H.jsPlumbInstance.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], H.elementId, H.jsPlumbInstance)
    };
    n.Anchors.AutoDefault = function (I) {
        var H = I.jsPlumbInstance.makeDynamicAnchor(n.Defaults.DynamicAnchors(I));
        H.type = "AutoDefault";
        return H
    };
    n.Anchors.Assign = q(0, 0, 0, 0, "Assign", function (I, J) {
        var H = J.position || "Fixed";
        I.positionFinder = H.constructor == String ? J.jsPlumbInstance.AnchorPositionFinders[H] : H;
        I.constructorParams = J
    });
    n.Anchors.Continuous = function (H) {
        return H.jsPlumbInstance.continuousAnchorFactory.get(H)
    };
    n.AnchorPositionFinders = {
        Fixed: function (K, H, J, I) {
            return [(K.left - H.left) / J[0], (K.top - H.top) / J[1]]
        }, Grid: function (H, Q, L, I) {
            var P = H.left - Q.left, O = H.top - Q.top, N = L[0] / (I.grid[0]), M = L[1] / (I.grid[1]),
                K = Math.floor(P / N), J = Math.floor(O / M);
            return [((K * N) + (N / 2)) / L[0], ((J * M) + (M / 2)) / L[1]]
        }
    };
    n.Anchors.Perimeter = function (H) {
        H = H || {};
        var I = H.anchorCount || 60, L = H.shape;
        if (!L) {
            throw new Error("no shape supplied to Perimeter Anchor type")
        }
        var J = function () {
            var W = 0.5, V = Math.PI * 2 / I, X = 0, T = [];
            for (var U = 0; U < I; U++) {
                var S = W + (W * Math.sin(X)), Y = W + (W * Math.cos(X));
                T.push([S, Y, 0, 0]);
                X += V
            }
            return T
        }, M = function (U) {
            var W = I / U.length, S = [], T = function (aa, ad, Z, ac, ae) {
                W = I * ae;
                var Y = (Z - aa) / W, X = (ac - ad) / W;
                for (var ab = 0; ab < W; ab++) {
                    S.push([aa + (Y * ab), ad + (X * ab), 0, 0])
                }
            };
            for (var V = 0; V < U.length; V++) {
                T.apply(null, U[V])
            }
            return S
        }, P = function (S) {
            var U = [];
            for (var T = 0; T < S.length; T++) {
                U.push([S[T][0], S[T][1], S[T][2], S[T][3], 1 / S.length])
            }
            return M(U)
        }, N = function () {
            return P([[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]])
        };
        var K = {
            circle: J, ellipse: J, diamond: function () {
                return P([[0.5, 0, 1, 0.5], [1, 0.5, 0.5, 1], [0.5, 1, 0, 0.5], [0, 0.5, 0.5, 0]])
            }, rectangle: N, square: N, triangle: function () {
                return P([[0.5, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0.5, 0]])
            }, path: function (X) {
                var V = X.points;
                var W = [], T = 0;
                for (var U = 0; U < V.length - 1; U++) {
                    var S = Math.sqrt(Math.pow(V[U][2] - V[U][0]) + Math.pow(V[U][3] - V[U][1]));
                    T += S;
                    W.push([V[U][0], V[U][1], V[U + 1][0], V[U + 1][1], S])
                }
                for (var U = 0; U < W.length; U++) {
                    W[U][4] = W[U][4] / T
                }
                return M(W)
            }
        }, Q = function (X, W) {
            var Y = [], V = W / 180 * Math.PI;
            for (var U = 0; U < X.length; U++) {
                var T = X[U][0] - 0.5, S = X[U][1] - 0.5;
                Y.push([0.5 + ((T * Math.cos(V)) - (S * Math.sin(V))), 0.5 + ((T * Math.sin(V)) + (S * Math.cos(V))), X[U][2], X[U][3]])
            }
            return Y
        };
        if (!K[L]) {
            throw new Error("Shape [" + L + "] is unknown by Perimeter Anchor type")
        }
        var R = K[L](H);
        if (H.rotation) {
            R = Q(R, H.rotation)
        }
        var O = H.jsPlumbInstance.makeDynamicAnchor(R);
        O.type = "Perimeter";
        return O
    }
})();
(function () {
    jsPlumb.DOMElementComponent = function (d) {
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        this.mousemove = this.dblclick = this.click = this.mousedown = this.mouseup = function (f) {
        }
    };
    jsPlumb.Connectors.Straight = function () {
        this.type = "Straight";
        var s = this, k = null, f, l, q, o, m, g, r, i, h, e, d, p, n;
        this.compute = function (B, K, t, A, G, u, E, z) {
            var J = Math.abs(B[0] - K[0]), D = Math.abs(B[1] - K[1]), C = 0.45 * J, v = 0.45 * D;
            J *= 1.9;
            D *= 1.9;
            var H = Math.min(B[0], K[0]) - C;
            var F = Math.min(B[1], K[1]) - v;
            var I = Math.max(2 * E, z);
            if (J < I) {
                J = I;
                H = B[0] + ((K[0] - B[0]) / 2) - (I / 2);
                C = (J - Math.abs(B[0] - K[0])) / 2
            }
            if (D < I) {
                D = I;
                F = B[1] + ((K[1] - B[1]) / 2) - (I / 2);
                v = (D - Math.abs(B[1] - K[1])) / 2
            }
            i = B[0] < K[0] ? C : J - C;
            h = B[1] < K[1] ? v : D - v;
            e = B[0] < K[0] ? J - C : C;
            d = B[1] < K[1] ? D - v : v;
            k = [H, F, J, D, i, h, e, d];
            o = e - i, m = d - h;
            f = jsPlumbUtil.gradient({x: i, y: h}, {x: e, y: d}), l = -1 / f;
            q = -1 * ((f * i) - h);
            g = Math.atan(f);
            r = Math.atan(l);
            n = Math.sqrt((o * o) + (m * m));
            return k
        };
        this.pointOnPath = function (u, v) {
            if (u == 0 && !v) {
                return {x: i, y: h}
            } else {
                if (u == 1 && !v) {
                    return {x: e, y: d}
                } else {
                    var t = v ? u > 0 ? u : n + u : u * n;
                    return jsPlumbUtil.pointOnLine({x: i, y: h}, {x: e, y: d}, t)
                }
            }
        };
        this.gradientAtPoint = function (t) {
            return f
        };
        this.pointAlongPathFrom = function (t, x, w) {
            var v = s.pointOnPath(t, w),
                u = t == 1 ? {x: i + ((e - i) * 10), y: h + ((h - d) * 10)} : x <= 0 ? {x: i, y: h} : {x: e, y: d};
            if (x <= 0 && Math.abs(x) > 1) {
                x *= -1
            }
            return jsPlumbUtil.pointOnLine(v, u, x)
        }
    };
    jsPlumb.Connectors.Bezier = function (w) {
        var q = this;
        w = w || {};
        this.majorAnchor = w.curviness || 150;
        this.minorAnchor = 10;
        var u = null;
        this.type = "Bezier";
        this._findControlPoint = function (I, x, D, y, B, G, z) {
            var F = G.getOrientation(y), H = z.getOrientation(B), C = F[0] != H[0] || F[1] == H[1], A = [],
                J = q.majorAnchor, E = q.minorAnchor;
            if (!C) {
                if (F[0] == 0) {
                    A.push(x[0] < D[0] ? I[0] + E : I[0] - E)
                } else {
                    A.push(I[0] - (J * F[0]))
                }
                if (F[1] == 0) {
                    A.push(x[1] < D[1] ? I[1] + E : I[1] - E)
                } else {
                    A.push(I[1] + (J * H[1]))
                }
            } else {
                if (H[0] == 0) {
                    A.push(D[0] < x[0] ? I[0] + E : I[0] - E)
                } else {
                    A.push(I[0] + (J * H[0]))
                }
                if (H[1] == 0) {
                    A.push(D[1] < x[1] ? I[1] + E : I[1] - E)
                } else {
                    A.push(I[1] + (J * F[1]))
                }
            }
            return A
        };
        var r, m, g, p, o, g, f, t, s, v, e, i, h, l, k;
        this.compute = function (T, A, N, B, R, y, x, M) {
            x = Math.max(M, (x || 0));
            v = Math.abs(T[0] - A[0]) + x;
            e = Math.abs(T[1] - A[1]) + x;
            t = Math.min(T[0], A[0]) - (x / 2);
            s = Math.min(T[1], A[1]) - (x / 2);
            g = T[0] < A[0] ? v - (x / 2) : (x / 2);
            f = T[1] < A[1] ? e - (x / 2) : (x / 2);
            p = T[0] < A[0] ? (x / 2) : v - (x / 2);
            o = T[1] < A[1] ? (x / 2) : e - (x / 2);
            r = q._findControlPoint([g, f], T, A, N, B, R, y);
            m = q._findControlPoint([p, o], A, T, B, N, y, R);
            var L = Math.min(g, p), K = Math.min(r[0], m[0]), G = Math.min(L, K), S = Math.max(g, p),
                P = Math.max(r[0], m[0]), D = Math.max(S, P);
            if (D > v) {
                v = D
            }
            if (G < 0) {
                t += G;
                var I = Math.abs(G);
                v += I;
                r[0] += I;
                g += I;
                p += I;
                m[0] += I
            }
            var Q = Math.min(f, o), O = Math.min(r[1], m[1]), C = Math.min(Q, O), H = Math.max(f, o),
                F = Math.max(r[1], m[1]), z = Math.max(H, F);
            if (z > e) {
                e = z
            }
            if (C < 0) {
                s += C;
                var E = Math.abs(C);
                e += E;
                r[1] += E;
                f += E;
                o += E;
                m[1] += E
            }
            if (M && v < M) {
                var J = (M - v) / 2;
                v = M;
                t -= J;
                g = g + J;
                p = p + J;
                r[0] = r[0] + J;
                m[0] = m[0] + J
            }
            if (M && e < M) {
                var J = (M - e) / 2;
                e = M;
                s -= J;
                f = f + J;
                o = o + J;
                r[1] = r[1] + J;
                m[1] = m[1] + J
            }
            u = [t, s, v, e, g, f, p, o, r[0], r[1], m[0], m[1]];
            return u
        };
        var d = function () {
            return [{x: g, y: f}, {x: r[0], y: r[1]}, {x: m[0], y: m[1]}, {x: p, y: o}]
        };
        var n = function (y, x, z) {
            if (z) {
                x = jsBezier.locationAlongCurveFrom(y, x > 0 ? 0 : 1, x)
            }
            return x
        };
        this.pointOnPath = function (x, z) {
            var y = d();
            x = n(y, x, z);
            return jsBezier.pointOnCurve(y, x)
        };
        this.gradientAtPoint = function (x, z) {
            var y = d();
            x = n(y, x, z);
            return jsBezier.gradientAtPoint(y, x)
        };
        this.pointAlongPathFrom = function (x, A, z) {
            var y = d();
            x = n(y, x, z);
            return jsBezier.pointAlongCurveFrom(y, x, A)
        }
    };
    jsPlumb.Connectors.Flowchart = function (A) {
        this.type = "Flowchart";
        A = A || {};
        var s = this, e = A.stub || A.minStubLength || 30, k = jsPlumbUtil.isArray(e) ? e[0] : e,
            p = jsPlumbUtil.isArray(e) ? e[1] : e, u = A.gap || 0, f = A.midpoint || 0.5, v = [], n = 0, h = [], r = [],
            w = [], t, q, z = -Infinity, x = -Infinity, B = Infinity, y = Infinity, d = A.grid, g = function (H, D) {
                var G = H % D, E = Math.floor(H / D), F = G > (D / 2) ? 1 : 0;
                return (E + F) * D
            }, o = function (D, G, F, E) {
                return [F || d == null ? D : g(D, d[0]), E || d == null ? G : g(G, d[1])]
            }, C = function (E, D, I, H) {
                var G = 0;
                for (var F = 0; F < v.length; F++) {
                    r[F] = v[F][5] / n;
                    h[F] = [G, (G += (v[F][5] / n))]
                }
            }, m = function () {
                w.push(v.length);
                for (var D = 0; D < v.length; D++) {
                    w.push(v[D][0]);
                    w.push(v[D][1])
                }
            }, l = function (M, J, L, K, I, H) {
                var E = v.length == 0 ? L : v[v.length - 1][0], D = v.length == 0 ? K : v[v.length - 1][1],
                    F = M == E ? Infinity : 0;
                var G = Math.abs(M == E ? J - D : M - E);
                v.push([M, J, E, D, F, G]);
                n += G;
                z = Math.max(z, M);
                x = Math.max(x, J);
                B = Math.min(B, M);
                y = Math.min(y, J)
            }, i = function (F, H) {
                if (H) {
                    F = F > 0 ? F / n : (n + F) / n
                }
                var D = h.length - 1, E = 1;
                for (var G = 0; G < h.length; G++) {
                    if (h[G][1] >= F) {
                        D = G;
                        E = (F - h[G][0]) / r[G];
                        break
                    }
                }
                return {segment: v[D], proportion: E, index: D}
            };
        this.compute = function (aa, ao, D, U, az, O, Y, T, au, aq) {
            v = [];
            h = [];
            n = 0;
            r = [];
            z = x = -Infinity;
            B = y = Infinity;
            s.lineWidth = Y;
            t = ao[0] < aa[0];
            q = ao[1] < aa[1];
            var ae = Y || 1, I = (ae / 2) + (k + p), F = (ae / 2) + (p + k), H = (ae / 2) + (k + p),
                E = (ae / 2) + (p + k), R = az.orientation || az.getOrientation(D),
                aA = O.orientation || O.getOrientation(U), an = t ? ao[0] : aa[0], am = q ? ao[1] : aa[1],
                ap = Math.abs(ao[0] - aa[0]) + I + F, ay = Math.abs(ao[1] - aa[1]) + H + E;
            if (R[0] == 0 && R[1] == 0 || aA[0] == 0 && aA[1] == 0) {
                var ag = ap > ay ? 0 : 1, ai = [1, 0][ag];
                R = [];
                aA = [];
                R[ag] = aa[ag] > ao[ag] ? -1 : 1;
                aA[ag] = aa[ag] > ao[ag] ? 1 : -1;
                R[ai] = 0;
                aA[ai] = 0
            }
            var M = t ? (ap - F) + (u * R[0]) : I + (u * R[0]), L = q ? (ay - E) + (u * R[1]) : H + (u * R[1]),
                aw = t ? I + (u * aA[0]) : (ap - F) + (u * aA[0]), av = q ? H + (u * aA[1]) : (ay - E) + (u * aA[1]),
                ad = M + (R[0] * k), ac = L + (R[1] * k), P = aw + (aA[0] * p), N = av + (aA[1] * p),
                Z = Math.abs(M - aw) > (k + p), ab = Math.abs(L - av) > (k + p), al = ad + ((P - ad) * f),
                aj = ac + ((N - ac) * f), S = ((R[0] * aA[0]) + (R[1] * aA[1])), af = S == -1, ah = S == 0, G = S == 1;
            an -= I;
            am -= H;
            w = [an, am, ap, ay, M, L, aw, av];
            var at = [];
            var W = R[0] == 0 ? "y" : "x", Q = af ? "opposite" : G ? "orthogonal" : "perpendicular",
                J = jsPlumbUtil.segment([M, L], [aw, av]), ak = R[W == "x" ? 0 : 1] == -1,
                V = {x: [null, 4, 3, 2, 1], y: [null, 2, 1, 4, 3]};
            if (ak) {
                J = V[W][J]
            }
            l(ad, ac, M, L, aw, av);
            var X = function (aE, aD, aB, aC) {
                return aE + (aD * ((1 - aB) * aC) + Math.max(k, p))
            }, K = {
                oppositex: function () {
                    if (D.elementId == U.elementId) {
                        var aB = ac + ((1 - az.y) * au.height) + Math.max(k, p);
                        return [[ad, aB], [P, aB]]
                    } else {
                        if (Z && (J == 1 || J == 2)) {
                            return [[al, L], [al, av]]
                        } else {
                            return [[ad, aj], [P, aj]]
                        }
                    }
                }, orthogonalx: function () {
                    if (J == 1 || J == 2) {
                        return [[P, ac]]
                    } else {
                        return [[ad, N]]
                    }
                }, perpendicularx: function () {
                    var aB = (av + L) / 2;
                    if ((J == 1 && aA[1] == 1) || (J == 2 && aA[1] == -1)) {
                        if (Math.abs(aw - M) > Math.max(k, p)) {
                            return [[P, ac]]
                        } else {
                            return [[ad, ac], [ad, aB], [P, aB]]
                        }
                    } else {
                        if ((J == 3 && aA[1] == -1) || (J == 4 && aA[1] == 1)) {
                            return [[ad, aB], [P, aB]]
                        } else {
                            if ((J == 3 && aA[1] == 1) || (J == 4 && aA[1] == -1)) {
                                return [[ad, N]]
                            } else {
                                if ((J == 1 && aA[1] == -1) || (J == 2 && aA[1] == 1)) {
                                    if (Math.abs(aw - M) > Math.max(k, p)) {
                                        return [[al, ac], [al, N]]
                                    } else {
                                        return [[ad, N]]
                                    }
                                }
                            }
                        }
                    }
                }, oppositey: function () {
                    if (D.elementId == U.elementId) {
                        var aB = ad + ((1 - az.x) * au.width) + Math.max(k, p);
                        return [[aB, ac], [aB, N]]
                    } else {
                        if (ab && (J == 2 || J == 3)) {
                            return [[M, aj], [aw, aj]]
                        } else {
                            return [[al, ac], [al, N]]
                        }
                    }
                }, orthogonaly: function () {
                    if (J == 2 || J == 3) {
                        return [[ad, N]]
                    } else {
                        return [[P, ac]]
                    }
                }, perpendiculary: function () {
                    var aB = (aw + M) / 2;
                    if ((J == 2 && aA[0] == -1) || (J == 3 && aA[0] == 1)) {
                        if (Math.abs(aw - M) > Math.max(k, p)) {
                            return [[ad, N]]
                        } else {
                            return [[ad, aj], [P, aj]]
                        }
                    } else {
                        if ((J == 1 && aA[0] == -1) || (J == 4 && aA[0] == 1)) {
                            var aB = (aw + M) / 2;
                            return [[aB, ac], [aB, N]]
                        } else {
                            if ((J == 1 && aA[0] == 1) || (J == 4 && aA[0] == -1)) {
                                return [[P, ac]]
                            } else {
                                if ((J == 2 && aA[0] == 1) || (J == 3 && aA[0] == -1)) {
                                    if (Math.abs(av - L) > Math.max(k, p)) {
                                        return [[ad, aj], [P, aj]]
                                    } else {
                                        return [[P, ac]]
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var ar = K[Q + W]();
            if (ar) {
                for (var ax = 0; ax < ar.length; ax++) {
                    l(ar[ax][0], ar[ax][1], M, L, aw, av)
                }
            }
            l(P, N, M, L, aw, av);
            l(aw, av, M, L, aw, av);
            m();
            C(M, L, aw, av);
            if (x > w[3]) {
                w[3] = x + (Y * 2)
            }
            if (z > w[2]) {
                w[2] = z + (Y * 2)
            }
            return w
        };
        this.pointOnPath = function (D, E) {
            return s.pointAlongPathFrom(D, 0, E)
        };
        this.gradientAtPoint = function (D, E) {
            return v[i(D, E)["index"]][4]
        };
        this.pointAlongPathFrom = function (K, D, J) {
            var L = i(K, J), H = L.segment, E = L.proportion, G = v[L.index][5], F = v[L.index][4];
            var I = {
                x: F == Infinity ? H[2] : H[2] > H[0] ? H[0] + ((1 - E) * G) - D : H[2] + (E * G) + D,
                y: F == 0 ? H[3] : H[3] > H[1] ? H[1] + ((1 - E) * G) - D : H[3] + (E * G) + D,
                segmentInfo: L
            };
            return I
        }
    };
    jsPlumb.Endpoints.Dot = function (e) {
        this.type = "Dot";
        var d = this;
        e = e || {};
        this.radius = e.radius || 10;
        this.defaultOffset = 0.5 * this.radius;
        this.defaultInnerRadius = this.radius / 3;
        this.compute = function (k, g, m, i) {
            var h = m.radius || d.radius, f = k[0] - h, l = k[1] - h;
            return [f, l, h * 2, h * 2, h]
        }
    };
    jsPlumb.Endpoints.Rectangle = function (e) {
        this.type = "Rectangle";
        var d = this;
        e = e || {};
        this.width = e.width || 20;
        this.height = e.height || 20;
        this.compute = function (l, h, n, k) {
            var i = n.width || d.width, g = n.height || d.height, f = l[0] - (i / 2), m = l[1] - (g / 2);
            return [f, m, i, g]
        }
    };
    var b = function (f) {
        jsPlumb.DOMElementComponent.apply(this, arguments);
        var d = this;
        var e = [];
        this.getDisplayElements = function () {
            return e
        };
        this.appendDisplayElement = function (g) {
            e.push(g)
        }
    };
    jsPlumb.Endpoints.Image = function (i) {
        this.type = "Image";
        b.apply(this, arguments);
        var n = this, h = false, g = false, f = i.width, e = i.height, l = null, d = i.endpoint;
        this.img = new Image();
        n.ready = false;
        this.img.onload = function () {
            n.ready = true;
            f = f || n.img.width;
            e = e || n.img.height;
            if (l) {
                l(n)
            }
        };
        d.setImage = function (o, q) {
            var p = o.constructor == String ? o : o.src;
            l = q;
            n.img.src = o;
            if (n.canvas != null) {
                n.canvas.setAttribute("src", o)
            }
        };
        d.setImage(i.src || i.url, i.onload);
        this.compute = function (q, o, r, p) {
            n.anchorPoint = q;
            if (n.ready) {
                return [q[0] - f / 2, q[1] - e / 2, f, e]
            } else {
                return [0, 0, 0, 0]
            }
        };
        n.canvas = document.createElement("img"), h = false;
        n.canvas.style.margin = 0;
        n.canvas.style.padding = 0;
        n.canvas.style.outline = 0;
        n.canvas.style.position = "absolute";
        var k = i.cssClass ? " " + i.cssClass : "";
        n.canvas.className = jsPlumb.endpointClass + k;
        if (f) {
            n.canvas.setAttribute("width", f)
        }
        if (e) {
            n.canvas.setAttribute("height", e)
        }
        jsPlumb.appendElement(n.canvas, i.parent);
        n.attachListeners(n.canvas, n);
        n.cleanup = function () {
            g = true
        };
        var m = function (r, q, p) {
            if (!g) {
                if (!h) {
                    n.canvas.setAttribute("src", n.img.src);
                    n.appendDisplayElement(n.canvas);
                    h = true
                }
                var o = n.anchorPoint[0] - (f / 2), s = n.anchorPoint[1] - (e / 2);
                jsPlumb.sizeCanvas(n.canvas, o, s, f, e)
            }
        };
        this.paint = function (q, p, o) {
            if (n.ready) {
                m(q, p, o)
            } else {
                window.setTimeout(function () {
                    n.paint(q, p, o)
                }, 200)
            }
        }
    };
    jsPlumb.Endpoints.Blank = function (e) {
        var d = this;
        this.type = "Blank";
        b.apply(this, arguments);
        this.compute = function (h, f, i, g) {
            return [h[0], h[1], 10, 0]
        };
        d.canvas = document.createElement("div");
        d.canvas.style.display = "block";
        d.canvas.style.width = "1px";
        d.canvas.style.height = "1px";
        d.canvas.style.background = "transparent";
        d.canvas.style.position = "absolute";
        d.canvas.className = d._jsPlumb.endpointClass;
        jsPlumb.appendElement(d.canvas, e.parent);
        this.paint = function (h, g, f) {
            jsPlumb.sizeCanvas(d.canvas, h[0], h[1], h[2], h[3])
        }
    };
    jsPlumb.Endpoints.Triangle = function (d) {
        this.type = "Triangle";
        d = d || {};
        d.width = d.width || 55;
        d.height = d.height || 55;
        this.width = d.width;
        this.height = d.height;
        this.compute = function (k, g, m, i) {
            var h = m.width || self.width, f = m.height || self.height, e = k[0] - (h / 2), l = k[1] - (f / 2);
            return [e, l, h, f]
        }
    };
    var c = function (f) {
        var e = true, d = this;
        this.isAppendedAtTopLevel = true;
        this.component = f.component;
        this.loc = f.location == null ? 0.5 : f.location;
        this.endpointLoc = f.endpointLocation == null ? [0.5, 0.5] : f.endpointLocation;
        this.setVisible = function (g) {
            e = g;
            d.component.repaint()
        };
        this.isVisible = function () {
            return e
        };
        this.hide = function () {
            d.setVisible(false)
        };
        this.show = function () {
            d.setVisible(true)
        };
        this.incrementLocation = function (g) {
            d.loc += g;
            d.component.repaint()
        };
        this.setLocation = function (g) {
            d.loc = g;
            d.component.repaint()
        };
        this.getLocation = function () {
            return d.loc
        }
    };
    jsPlumb.Overlays.Arrow = function (h) {
        this.type = "Arrow";
        c.apply(this, arguments);
        this.isAppendedAtTopLevel = false;
        h = h || {};
        var e = this;
        this.length = h.length || 20;
        this.width = h.width || 20;
        this.id = h.id;
        var g = (h.direction || 1) < 0 ? -1 : 1, f = h.paintStyle || {lineWidth: 1}, d = h.foldback || 0.623;
        this.computeMaxSize = function () {
            return e.width * 1.5
        };
        this.cleanup = function () {
        };
        this.draw = function (m, s, w) {
            var y, A, u, t, k;
            if (m.pointAlongPathFrom) {
                if (jsPlumbUtil.isString(e.loc) || e.loc > 1 || e.loc < 0) {
                    var v = parseInt(e.loc);
                    y = m.pointAlongPathFrom(v, g * e.length / 2, true), A = m.pointOnPath(v, true), u = jsPlumbUtil.pointOnLine(y, A, e.length)
                } else {
                    if (e.loc == 1) {
                        y = m.pointOnPath(e.loc);
                        A = m.pointAlongPathFrom(e.loc, -1);
                        u = jsPlumbUtil.pointOnLine(y, A, e.length);
                        if (g == -1) {
                            var B = u;
                            u = y;
                            y = B
                        }
                    } else {
                        if (e.loc == 0) {
                            u = m.pointOnPath(e.loc);
                            A = m.pointAlongPathFrom(e.loc, 1);
                            y = jsPlumbUtil.pointOnLine(u, A, e.length);
                            if (g == -1) {
                                var B = u;
                                u = y;
                                y = B
                            }
                        } else {
                            y = m.pointAlongPathFrom(e.loc, g * e.length / 2), A = m.pointOnPath(e.loc), u = jsPlumbUtil.pointOnLine(y, A, e.length)
                        }
                    }
                }
                t = jsPlumbUtil.perpendicularLineTo(y, u, e.width);
                k = jsPlumbUtil.pointOnLine(y, u, d * e.length);
                var q = Math.min(y.x, t[0].x, t[1].x), p = Math.max(y.x, t[0].x, t[1].x),
                    o = Math.min(y.y, t[0].y, t[1].y), n = Math.max(y.y, t[0].y, t[1].y);
                var z = {hxy: y, tail: t, cxy: k}, x = f.strokeStyle || s.strokeStyle, r = f.fillStyle || s.strokeStyle,
                    i = f.lineWidth || s.lineWidth;
                e.paint(m, z, i, x, r, w);
                return [q, p, o, n]
            } else {
                return [0, 0, 0, 0]
            }
        }
    };
    jsPlumb.Overlays.PlainArrow = function (e) {
        e = e || {};
        var d = jsPlumb.extend(e, {foldback: 1});
        jsPlumb.Overlays.Arrow.call(this, d);
        this.type = "PlainArrow"
    };
    jsPlumb.Overlays.Diamond = function (f) {
        f = f || {};
        var d = f.length || 40, e = jsPlumb.extend(f, {length: d / 2, foldback: 2});
        jsPlumb.Overlays.Arrow.call(this, e);
        this.type = "Diamond"
    };
    var a = function (i) {
        jsPlumb.DOMElementComponent.apply(this, arguments);
        c.apply(this, arguments);
        var d = this, e = false;
        i = i || {};
        this.id = i.id;
        var l;
        var h = function () {
            l = i.create(i.component);
            l = jsPlumb.CurrentLibrary.getDOMElement(l);
            l.style.position = "absolute";
            var m = i._jsPlumb.overlayClass + " " + (d.cssClass ? d.cssClass : i.cssClass ? i.cssClass : "");
            l.className = m;
            jsPlumb.appendElement(l, i.component.parent);
            i._jsPlumb.getId(l);
            d.attachListeners(l, d);
            d.canvas = l
        };
        this.getElement = function () {
            if (l == null) {
                h()
            }
            return l
        };
        this.getDimensions = function () {
            return jsPlumb.CurrentLibrary.getSize(jsPlumb.CurrentLibrary.getElementObject(d.getElement()))
        };
        var f = null, k = function (m) {
            if (f == null) {
                f = d.getDimensions()
            }
            return f
        };
        this.clearCachedDimensions = function () {
            f = null
        };
        this.computeMaxSize = function () {
            var m = k();
            return Math.max(m[0], m[1])
        };
        var g = d.setVisible;
        d.setVisible = function (m) {
            g(m);
            l.style.display = m ? "block" : "none"
        };
        this.cleanup = function () {
            if (l != null) {
                jsPlumb.CurrentLibrary.removeElement(l)
            }
        };
        this.paint = function (m, o, n) {
            if (!e) {
                d.getElement();
                m.appendDisplayElement(l);
                d.attachListeners(l, m);
                e = true
            }
            l.style.left = (n[0] + o.minx) + "px";
            l.style.top = (n[1] + o.miny) + "px"
        };
        this.draw = function (n, o, p) {
            var t = k();
            if (t != null && t.length == 2) {
                var q = {x: 0, y: 0};
                if (n.pointOnPath) {
                    var r = d.loc, s = false;
                    if (jsPlumbUtil.isString(d.loc) || d.loc < 0 || d.loc > 1) {
                        r = parseInt(d.loc);
                        s = true
                    }
                    q = n.pointOnPath(r, s)
                } else {
                    var m = d.loc.constructor == Array ? d.loc : d.endpointLoc;
                    q = {x: m[0] * p[2], y: m[1] * p[3]}
                }
                minx = q.x - (t[0] / 2), miny = q.y - (t[1] / 2);
                d.paint(n, {minx: minx, miny: miny, td: t, cxy: q}, p);
                return [minx, minx + t[0], miny, miny + t[1]]
            } else {
                return [0, 0, 0, 0]
            }
        };
        this.reattachListeners = function (m) {
            if (l) {
                d.reattachListenersForElement(l, d, m)
            }
        }
    };
    jsPlumb.Overlays.Custom = function (d) {
        this.type = "Custom";
        a.apply(this, arguments)
    };
    jsPlumb.Overlays.Label = function (h) {
        var d = this;
        this.labelStyle = h.labelStyle || jsPlumb.Defaults.LabelStyle;
        this.cssClass = this.labelStyle != null ? this.labelStyle.cssClass : null;
        h.create = function () {
            return document.createElement("div")
        };
        jsPlumb.Overlays.Custom.apply(this, arguments);
        this.type = "Label";
        var f = h.label || "", d = this, g = null;
        this.setLabel = function (k) {
            f = k;
            g = null;
            d.clearCachedDimensions();
            e();
            d.component.repaint()
        };
        var e = function () {
            if (typeof f == "function") {
                var k = f(d);
                d.getElement().innerHTML = k.replace(/\r\n/g, "<br/>")
            } else {
                if (g == null) {
                    g = f;
                    d.getElement().innerHTML = g.replace(/\r\n/g, "<br/>")
                }
            }
        };
        this.getLabel = function () {
            return f
        };
        var i = this.getDimensions;
        this.getDimensions = function () {
            e();
            return i()
        }
    }
})();
(function () {
    var c = function (e, g, d, f) {
        this.m = (f - g) / (d - e);
        this.b = -1 * ((this.m * e) - g);
        this.rectIntersect = function (q, p, s, o) {
            var n = [];
            var k = (p - this.b) / this.m;
            if (k >= q && k <= (q + s)) {
                n.push([k, (this.m * k) + this.b])
            }
            var t = (this.m * (q + s)) + this.b;
            if (t >= p && t <= (p + o)) {
                n.push([(t - this.b) / this.m, t])
            }
            var k = ((p + o) - this.b) / this.m;
            if (k >= q && k <= (q + s)) {
                n.push([k, (this.m * k) + this.b])
            }
            var t = (this.m * q) + this.b;
            if (t >= p && t <= (p + o)) {
                n.push([(t - this.b) / this.m, t])
            }
            if (n.length == 2) {
                var m = (n[0][0] + n[1][0]) / 2, l = (n[0][1] + n[1][1]) / 2;
                n.push([m, l]);
                var i = m <= q + (s / 2) ? -1 : 1, r = l <= p + (o / 2) ? -1 : 1;
                n.push([i, r]);
                return n
            }
            return null
        }
    }, a = function (e, g, d, f) {
        if (e <= d && f <= g) {
            return 1
        } else {
            if (e <= d && g <= f) {
                return 2
            } else {
                if (d <= e && f >= g) {
                    return 3
                }
            }
        }
        return 4
    }, b = function (g, f, i, e, h, m, l, d, k) {
        if (d <= k) {
            return [g, f]
        }
        if (i == 1) {
            if (e[3] <= 0 && h[3] >= 1) {
                return [g + (e[2] < 0.5 ? -1 * m : m), f]
            } else {
                if (e[2] >= 1 && h[2] <= 0) {
                    return [g, f + (e[3] < 0.5 ? -1 * l : l)]
                } else {
                    return [g + (-1 * m), f + (-1 * l)]
                }
            }
        } else {
            if (i == 2) {
                if (e[3] >= 1 && h[3] <= 0) {
                    return [g + (e[2] < 0.5 ? -1 * m : m), f]
                } else {
                    if (e[2] >= 1 && h[2] <= 0) {
                        return [g, f + (e[3] < 0.5 ? -1 * l : l)]
                    } else {
                        return [g + (1 * m), f + (-1 * l)]
                    }
                }
            } else {
                if (i == 3) {
                    if (e[3] >= 1 && h[3] <= 0) {
                        return [g + (e[2] < 0.5 ? -1 * m : m), f]
                    } else {
                        if (e[2] <= 0 && h[2] >= 1) {
                            return [g, f + (e[3] < 0.5 ? -1 * l : l)]
                        } else {
                            return [g + (-1 * m), f + (-1 * l)]
                        }
                    }
                } else {
                    if (i == 4) {
                        if (e[3] <= 0 && h[3] >= 1) {
                            return [g + (e[2] < 0.5 ? -1 * m : m), f]
                        } else {
                            if (e[2] <= 0 && h[2] >= 1) {
                                return [g, f + (e[3] < 0.5 ? -1 * l : l)]
                            } else {
                                return [g + (1 * m), f + (-1 * l)]
                            }
                        }
                    }
                }
            }
        }
    };
    jsPlumb.Connectors.StateMachine = function (l) {
        var u = this, n = null, o, m, g, e, p = [], d = l.curviness || 10, k = l.margin || 5,
            q = l.proximityLimit || 80, f = l.orientation && l.orientation == "clockwise", i = l.loopbackRadius || 25,
            h = false, t = l.showLoopback !== false;
        this.type = "StateMachine";
        l = l || {};
        this.compute = function (ad, H, W, I, ac, z, v, U) {
            var Q = Math.abs(ad[0] - H[0]), Y = Math.abs(ad[1] - H[1]), S = 0.45 * Q, ab = 0.45 * Y;
            Q *= 1.9;
            Y *= 1.9;
            v = v || 1;
            var O = Math.min(ad[0], H[0]) - S, M = Math.min(ad[1], H[1]) - ab;
            if (!t || (W.elementId != I.elementId)) {
                h = false;
                o = ad[0] < H[0] ? S : Q - S;
                m = ad[1] < H[1] ? ab : Y - ab;
                g = ad[0] < H[0] ? Q - S : S;
                e = ad[1] < H[1] ? Y - ab : ab;
                if (ad[2] == 0) {
                    o -= k
                }
                if (ad[2] == 1) {
                    o += k
                }
                if (ad[3] == 0) {
                    m -= k
                }
                if (ad[3] == 1) {
                    m += k
                }
                if (H[2] == 0) {
                    g -= k
                }
                if (H[2] == 1) {
                    g += k
                }
                if (H[3] == 0) {
                    e -= k
                }
                if (H[3] == 1) {
                    e += k
                }
                var N = (o + g) / 2, L = (m + e) / 2, A = (-1 * N) / L, V = Math.atan(A),
                    P = (A == Infinity || A == -Infinity) ? 0 : Math.abs(d / 2 * Math.sin(V)),
                    R = (A == Infinity || A == -Infinity) ? 0 : Math.abs(d / 2 * Math.cos(V)), B = a(o, m, g, e),
                    J = Math.sqrt(Math.pow(g - o, 2) + Math.pow(e - m, 2));
                p = b(N, L, B, ad, H, d, d, J, q);
                var G = Math.max(Math.abs(p[0] - o) * 3, Math.abs(p[0] - g) * 3, Math.abs(g - o), 2 * v, U),
                    K = Math.max(Math.abs(p[1] - m) * 3, Math.abs(p[1] - e) * 3, Math.abs(e - m), 2 * v, U);
                if (Q < G) {
                    var T = G - Q;
                    O -= (T / 2);
                    o += (T / 2);
                    g += (T / 2);
                    Q = G;
                    p[0] += (T / 2)
                }
                if (Y < K) {
                    var aa = K - Y;
                    M -= (aa / 2);
                    m += (aa / 2);
                    e += (aa / 2);
                    Y = K;
                    p[1] += (aa / 2)
                }
                n = [O, M, Q, Y, o, m, g, e, p[0], p[1]]
            } else {
                h = true;
                var Z = ad[0], X = ad[0], F = ad[1] - k, D = ad[1] - k, E = Z, C = F - i;
                Q = ((2 * v) + (4 * i)), Y = ((2 * v) + (4 * i));
                O = E - i - v - i, M = C - i - v - i;
                n = [O, M, Q, Y, E - O, C - M, i, f, Z - O, F - M, X - O, D - M]
            }
            return n
        };
        var r = function () {
            return [{x: g, y: e}, {x: p[0], y: p[1]}, {x: p[0] + 1, y: p[1] + 1}, {x: o, y: m}]
        };
        var s = function (w, v, x) {
            if (x) {
                v = jsBezier.locationAlongCurveFrom(w, v > 0 ? 0 : 1, v)
            }
            return v
        };
        this.pointOnPath = function (x, B) {
            if (h) {
                if (B) {
                    var y = Math.PI * 2 * i;
                    x = x / y
                }
                if (x > 0 && x < 1) {
                    x = 1 - x
                }
                var z = (x * 2 * Math.PI) + (Math.PI / 2), w = n[4] + (n[6] * Math.cos(z)),
                    v = n[5] + (n[6] * Math.sin(z));
                return {x: w, y: v}
            } else {
                var A = r();
                x = s(A, x, B);
                return jsBezier.pointOnCurve(A, x)
            }
        };
        this.gradientAtPoint = function (v, y) {
            if (h) {
                if (y) {
                    var w = Math.PI * 2 * i;
                    v = v / w
                }
                return Math.atan(v * 2 * Math.PI)
            } else {
                var x = r();
                v = s(x, v, y);
                return jsBezier.gradientAtPoint(x, v)
            }
        };
        this.pointAlongPathFrom = function (D, v, C) {
            if (h) {
                if (C) {
                    var B = Math.PI * 2 * i;
                    D = D / B
                }
                if (D > 0 && D < 1) {
                    D = 1 - D
                }
                var B = 2 * Math.PI * n[6], w = v / B * 2 * Math.PI, z = (D * 2 * Math.PI) - w + (Math.PI / 2),
                    y = n[4] + (n[6] * Math.cos(z)), x = n[5] + (n[6] * Math.sin(z));
                return {x: y, y: x}
            } else {
                var A = r();
                D = s(A, D, C);
                return jsBezier.pointAlongCurveFrom(A, D, v)
            }
        }
    };
    jsPlumb.Connectors.canvas.StateMachine = function (f) {
        f = f || {};
        var d = this, g = f.drawGuideline || true, e = f.avoidSelector;
        jsPlumb.Connectors.StateMachine.apply(this, arguments);
        jsPlumb.CanvasConnector.apply(this, arguments);
        this._paint = function (l) {
            if (l.length == 10) {
                d.ctx.beginPath();
                d.ctx.moveTo(l[4], l[5]);
                d.ctx.bezierCurveTo(l[8], l[9], l[8], l[9], l[6], l[7]);
                d.ctx.stroke()
            } else {
                d.ctx.save();
                d.ctx.beginPath();
                var k = 0, i = 2 * Math.PI, h = l[7];
                d.ctx.arc(l[4], l[5], l[6], 0, i, h);
                d.ctx.stroke();
                d.ctx.closePath();
                d.ctx.restore()
            }
        };
        this.createGradient = function (i, h) {
            return h.createLinearGradient(i[4], i[5], i[6], i[7])
        }
    };
    jsPlumb.Connectors.svg.StateMachine = function () {
        var d = this;
        jsPlumb.Connectors.StateMachine.apply(this, arguments);
        jsPlumb.SvgConnector.apply(this, arguments);
        this.getPath = function (e) {
            if (e.length == 10) {
                return "M " + e[4] + " " + e[5] + " C " + e[8] + " " + e[9] + " " + e[8] + " " + e[9] + " " + e[6] + " " + e[7]
            } else {
                return "M" + (e[8] + 4) + " " + e[9] + " A " + e[6] + " " + e[6] + " 0 1,0 " + (e[8] - 4) + " " + e[9]
            }
        }
    };
    jsPlumb.Connectors.vml.StateMachine = function () {
        jsPlumb.Connectors.StateMachine.apply(this, arguments);
        jsPlumb.VmlConnector.apply(this, arguments);
        var d = jsPlumb.vml.convertValue;
        this.getPath = function (k) {
            if (k.length == 10) {
                return "m" + d(k[4]) + "," + d(k[5]) + " c" + d(k[8]) + "," + d(k[9]) + "," + d(k[8]) + "," + d(k[9]) + "," + d(k[6]) + "," + d(k[7]) + " e"
            } else {
                var h = d(k[8] - k[6]), g = d(k[9] - (2 * k[6])), f = h + d(2 * k[6]), e = g + d(2 * k[6]),
                    l = h + "," + g + "," + f + "," + e;
                var i = "ar " + l + "," + d(k[8]) + "," + d(k[9]) + "," + d(k[8]) + "," + d(k[9]) + " e";
                return i
            }
        }
    }
})();
(function () {
    var h = {"stroke-linejoin": "joinstyle", joinstyle: "joinstyle", endcap: "endcap", miterlimit: "miterlimit"},
        c = null;
    if (document.createStyleSheet && document.namespaces) {
        var m = [".jsplumb_vml", "jsplumb\\:textbox", "jsplumb\\:oval", "jsplumb\\:rect", "jsplumb\\:stroke", "jsplumb\\:shape", "jsplumb\\:group"],
            g = "behavior:url(#default#VML);position:absolute;";
        c = document.createStyleSheet();
        for (var r = 0; r < m.length; r++) {
            c.addRule(m[r], g)
        }
        document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml")
    }
    jsPlumb.vml = {};
    var t = 1000, s = {}, a = function (u, i) {
        var w = jsPlumb.getId(u), v = s[w];
        if (!v) {
            v = f("group", [0, 0, t, t], {"class": i});
            v.style.backgroundColor = "red";
            s[w] = v;
            jsPlumb.appendElement(v, u)
        }
        return v
    }, e = function (v, w) {
        for (var u in w) {
            v[u] = w[u]
        }
    }, f = function (u, y, z, w, i, v) {
        z = z || {};
        var x = document.createElement("jsplumb:" + u);
        if (v) {
            i.appendElement(x, w)
        } else {
            jsPlumb.CurrentLibrary.appendElement(x, w)
        }
        x.className = (z["class"] ? z["class"] + " " : "") + "jsplumb_vml";
        k(x, y);
        e(x, z);
        return x
    }, k = function (u, i, v) {
        u.style.left = i[0] + "px";
        u.style.top = i[1] + "px";
        u.style.width = i[2] + "px";
        u.style.height = i[3] + "px";
        u.style.position = "absolute";
        if (v) {
            u.style.zIndex = v
        }
    }, p = jsPlumb.vml.convertValue = function (i) {
        return Math.floor(i * t)
    }, b = function (w, u, v, i) {
        if ("transparent" === u) {
            i.setOpacity(v, "0.0")
        } else {
            i.setOpacity(v, "1.0")
        }
    }, q = function (y, u, B, C) {
        var x = {};
        if (u.strokeStyle) {
            x.stroked = "true";
            var D = jsPlumbUtil.convertStyle(u.strokeStyle, true);
            x.strokecolor = D;
            b(x, D, "stroke", B);
            x.strokeweight = u.lineWidth + "px"
        } else {
            x.stroked = "false"
        }
        if (u.fillStyle) {
            x.filled = "true";
            var v = jsPlumbUtil.convertStyle(u.fillStyle, true);
            x.fillcolor = v;
            b(x, v, "fill", B)
        } else {
            x.filled = "false"
        }
        if (u.dashstyle) {
            if (B.strokeNode == null) {
                B.strokeNode = f("stroke", [0, 0, 0, 0], {dashstyle: u.dashstyle}, y, C)
            } else {
                B.strokeNode.dashstyle = u.dashstyle
            }
        } else {
            if (u["stroke-dasharray"] && u.lineWidth) {
                var E = u["stroke-dasharray"].indexOf(",") == -1 ? " " : ",", z = u["stroke-dasharray"].split(E),
                    w = "";
                for (var A = 0; A < z.length; A++) {
                    w += (Math.floor(z[A] / u.lineWidth) + E)
                }
                if (B.strokeNode == null) {
                    B.strokeNode = f("stroke", [0, 0, 0, 0], {dashstyle: w}, y, C)
                } else {
                    B.strokeNode.dashstyle = w
                }
            }
        }
        e(y, x)
    }, n = function () {
        var i = this;
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        this.opacityNodes = {stroke: null, fill: null};
        this.initOpacityNodes = function (v) {
            i.opacityNodes.stroke = f("stroke", [0, 0, 1, 1], {opacity: "0.0"}, v, i._jsPlumb);
            i.opacityNodes.fill = f("fill", [0, 0, 1, 1], {opacity: "0.0"}, v, i._jsPlumb)
        };
        this.setOpacity = function (v, x) {
            var w = i.opacityNodes[v];
            if (w) {
                w.opacity = "" + x
            }
        };
        var u = [];
        this.getDisplayElements = function () {
            return u
        };
        this.appendDisplayElement = function (w, v) {
            if (!v) {
                i.canvas.parentNode.appendChild(w)
            }
            u.push(w)
        }
    }, d = jsPlumb.VmlConnector = function (v) {
        var i = this;
        i.strokeNode = null;
        i.canvas = null;
        n.apply(this, arguments);
        var u = i._jsPlumb.connectorClass + (v.cssClass ? (" " + v.cssClass) : "");
        this.paint = function (A, x, z) {
            if (x != null) {
                var E = i.getPath(A), y = {path: E};
                if (x.outlineColor) {
                    var C = x.outlineWidth || 1, D = x.lineWidth + (2 * C),
                        B = {strokeStyle: jsPlumbUtil.convertStyle(x.outlineColor), lineWidth: D};
                    for (var w in h) {
                        B[w] = x[w]
                    }
                    if (i.bgCanvas == null) {
                        y["class"] = u;
                        y.coordsize = (A[2] * t) + "," + (A[3] * t);
                        i.bgCanvas = f("shape", A, y, v.parent, i._jsPlumb, true);
                        k(i.bgCanvas, A, i.getZIndex());
                        i.appendDisplayElement(i.bgCanvas, true);
                        i.attachListeners(i.bgCanvas, i);
                        i.initOpacityNodes(i.bgCanvas, ["stroke"])
                    } else {
                        y.coordsize = (A[2] * t) + "," + (A[3] * t);
                        k(i.bgCanvas, A, i.getZIndex());
                        e(i.bgCanvas, y)
                    }
                    q(i.bgCanvas, B, i)
                }
                if (i.canvas == null) {
                    y["class"] = u;
                    y.coordsize = (A[2] * t) + "," + (A[3] * t);
                    if (i.tooltip) {
                        y.label = i.tooltip
                    }
                    i.canvas = f("shape", A, y, v.parent, i._jsPlumb, true);
                    i.appendDisplayElement(i.canvas, true);
                    i.attachListeners(i.canvas, i);
                    i.initOpacityNodes(i.canvas, ["stroke"])
                } else {
                    y.coordsize = (A[2] * t) + "," + (A[3] * t);
                    k(i.canvas, A, i.getZIndex());
                    e(i.canvas, y)
                }
                q(i.canvas, x, i, i._jsPlumb)
            }
        };
        this.reattachListeners = function () {
            if (i.canvas) {
                i.reattachListenersForElement(i.canvas, i)
            }
        }
    }, l = window.VmlEndpoint = function (y) {
        n.apply(this, arguments);
        var i = null, v = this, u = null, x = null;
        v.canvas = document.createElement("div");
        v.canvas.style.position = "absolute";
        var w = v._jsPlumb.endpointClass + (y.cssClass ? (" " + y.cssClass) : "");
        y._jsPlumb.appendElement(v.canvas, y.parent);
        if (v.tooltip) {
            v.canvas.setAttribute("label", v.tooltip)
        }
        this.paint = function (C, A, z) {
            var B = {};
            jsPlumb.sizeCanvas(v.canvas, C[0], C[1], C[2], C[3]);
            if (i == null) {
                B["class"] = w;
                i = v.getVml([0, 0, C[2], C[3]], B, z, v.canvas, v._jsPlumb);
                v.attachListeners(i, v);
                v.appendDisplayElement(i, true);
                v.appendDisplayElement(v.canvas, true);
                v.initOpacityNodes(i, ["fill"])
            } else {
                k(i, [0, 0, C[2], C[3]]);
                e(i, B)
            }
            q(i, A, v)
        };
        this.reattachListeners = function () {
            if (i) {
                v.reattachListenersForElement(i, v)
            }
        }
    };
    jsPlumb.Connectors.vml.Bezier = function () {
        jsPlumb.Connectors.Bezier.apply(this, arguments);
        d.apply(this, arguments);
        this.getPath = function (i) {
            return "m" + p(i[4]) + "," + p(i[5]) + " c" + p(i[8]) + "," + p(i[9]) + "," + p(i[10]) + "," + p(i[11]) + "," + p(i[6]) + "," + p(i[7]) + " e"
        }
    };
    jsPlumb.Connectors.vml.Straight = function () {
        jsPlumb.Connectors.Straight.apply(this, arguments);
        d.apply(this, arguments);
        this.getPath = function (i) {
            return "m" + p(i[4]) + "," + p(i[5]) + " l" + p(i[6]) + "," + p(i[7]) + " e"
        }
    };
    jsPlumb.Connectors.vml.Flowchart = function () {
        jsPlumb.Connectors.Flowchart.apply(this, arguments);
        d.apply(this, arguments);
        this.getPath = function (v) {
            var w = "m " + p(v[4]) + "," + p(v[5]) + " l";
            for (var u = 0; u < v[8]; u++) {
                w = w + " " + p(v[9 + (u * 2)]) + "," + p(v[10 + (u * 2)])
            }
            w = w + " " + p(v[6]) + "," + p(v[7]) + " e";
            return w
        }
    };
    jsPlumb.Endpoints.vml.Dot = function () {
        jsPlumb.Endpoints.Dot.apply(this, arguments);
        l.apply(this, arguments);
        this.getVml = function (w, x, u, v, i) {
            return f("oval", w, x, v, i)
        }
    };
    jsPlumb.Endpoints.vml.Rectangle = function () {
        jsPlumb.Endpoints.Rectangle.apply(this, arguments);
        l.apply(this, arguments);
        this.getVml = function (w, x, u, v, i) {
            return f("rect", w, x, v, i)
        }
    };
    jsPlumb.Endpoints.vml.Image = jsPlumb.Endpoints.Image;
    jsPlumb.Endpoints.vml.Blank = jsPlumb.Endpoints.Blank;
    jsPlumb.Overlays.vml.Label = jsPlumb.Overlays.Label;
    jsPlumb.Overlays.vml.Custom = jsPlumb.Overlays.Custom;
    var o = function (x, v) {
        x.apply(this, v);
        n.apply(this, v);
        var u = this, w = null;
        u.canvas = null;
        u.isAppendedAtTopLevel = true;
        var i = function (z, y) {
            return "m " + p(z.hxy.x) + "," + p(z.hxy.y) + " l " + p(z.tail[0].x) + "," + p(z.tail[0].y) + " " + p(z.cxy.x) + "," + p(z.cxy.y) + " " + p(z.tail[1].x) + "," + p(z.tail[1].y) + " x e"
        };
        this.paint = function (B, G, F, H, L, K) {
            var z = {};
            if (H) {
                z.stroked = "true";
                z.strokecolor = jsPlumbUtil.convertStyle(H, true)
            }
            if (F) {
                z.strokeweight = F + "px"
            }
            if (L) {
                z.filled = "true";
                z.fillcolor = L
            }
            var y = Math.min(G.hxy.x, G.tail[0].x, G.tail[1].x, G.cxy.x),
                J = Math.min(G.hxy.y, G.tail[0].y, G.tail[1].y, G.cxy.y),
                C = Math.max(G.hxy.x, G.tail[0].x, G.tail[1].x, G.cxy.x),
                A = Math.max(G.hxy.y, G.tail[0].y, G.tail[1].y, G.cxy.y), I = Math.abs(C - y), E = Math.abs(A - J),
                D = [y, J, I, E];
            z.path = i(G, K);
            z.coordsize = (K[2] * t) + "," + (K[3] * t);
            D[0] = K[0];
            D[1] = K[1];
            D[2] = K[2];
            D[3] = K[3];
            if (u.canvas == null) {
                u.canvas = f("shape", D, z, B.canvas.parentNode, B._jsPlumb, true);
                B.appendDisplayElement(u.canvas, true);
                u.attachListeners(u.canvas, B);
                u.attachListeners(u.canvas, u)
            } else {
                k(u.canvas, D);
                e(u.canvas, z)
            }
        };
        this.reattachListeners = function () {
            if (u.canvas) {
                u.reattachListenersForElement(u.canvas, u)
            }
        };
        this.cleanup = function () {
            if (u.canvas != null) {
                jsPlumb.CurrentLibrary.removeElement(u.canvas)
            }
        }
    };
    jsPlumb.Overlays.vml.Arrow = function () {
        o.apply(this, [jsPlumb.Overlays.Arrow, arguments])
    };
    jsPlumb.Overlays.vml.PlainArrow = function () {
        o.apply(this, [jsPlumb.Overlays.PlainArrow, arguments])
    };
    jsPlumb.Overlays.vml.Diamond = function () {
        o.apply(this, [jsPlumb.Overlays.Diamond, arguments])
    }
})();
(function () {
    var l = {
            joinstyle: "stroke-linejoin",
            "stroke-linejoin": "stroke-linejoin",
            "stroke-dashoffset": "stroke-dashoffset",
            "stroke-linecap": "stroke-linecap"
        }, w = "stroke-dasharray", A = "dashstyle", e = "linearGradient", b = "radialGradient", c = "fill", a = "stop",
        z = "stroke", q = "stroke-width", h = "style", m = "none", t = "jsplumb_gradient_", o = "lineWidth",
        C = {svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml"}, g = function (F, D) {
            for (var E in D) {
                F.setAttribute(E, "" + D[E])
            }
        }, f = function (E, D) {
            var F = document.createElementNS(C.svg, E);
            D = D || {};
            D.version = "1.1";
            D.xmlns = C.xhtml;
            g(F, D);
            return F
        }, n = function (D) {
            return "position:absolute;left:" + D[0] + "px;top:" + D[1] + "px"
        }, i = function (E) {
            for (var D = 0; D < E.childNodes.length; D++) {
                if (E.childNodes[D].tagName == e || E.childNodes[D].tagName == b) {
                    E.removeChild(E.childNodes[D])
                }
            }
        }, v = function (N, I, F, D, J) {
            var G = t + J._jsPlumb.idstamp();
            i(N);
            if (!F.gradient.offset) {
                var L = f(e, {id: G, gradientUnits: "userSpaceOnUse"});
                N.appendChild(L)
            } else {
                var L = f(b, {id: G});
                N.appendChild(L)
            }
            for (var K = 0; K < F.gradient.stops.length; K++) {
                var H = K;
                if (D.length == 8) {
                    H = D[4] < D[6] ? K : F.gradient.stops.length - 1 - K
                } else {
                    H = D[4] < D[6] ? F.gradient.stops.length - 1 - K : K
                }
                var M = jsPlumbUtil.convertStyle(F.gradient.stops[H][1], true);
                var O = f(a, {offset: Math.floor(F.gradient.stops[K][0] * 100) + "%", "stop-color": M});
                L.appendChild(O)
            }
            var E = F.strokeStyle ? z : c;
            I.setAttribute(h, E + ":url(#" + G + ")")
        }, x = function (K, G, E, D, H) {
            if (E.gradient) {
                v(K, G, E, D, H)
            } else {
                i(K);
                G.setAttribute(h, "")
            }
            G.setAttribute(c, E.fillStyle ? jsPlumbUtil.convertStyle(E.fillStyle, true) : m);
            G.setAttribute(z, E.strokeStyle ? jsPlumbUtil.convertStyle(E.strokeStyle, true) : m);
            if (E.lineWidth) {
                G.setAttribute(q, E.lineWidth)
            }
            if (E[A] && E[o] && !E[w]) {
                var L = E[A].indexOf(",") == -1 ? " " : ",", I = E[A].split(L), F = "";
                I.forEach(function (M) {
                    F += (Math.floor(M * E.lineWidth) + L)
                });
                G.setAttribute(w, F)
            } else {
                if (E[w]) {
                    G.setAttribute(w, E[w])
                }
            }
            for (var J in l) {
                if (E[J]) {
                    G.setAttribute(l[J], E[J])
                }
            }
        }, B = function (F) {
            var D = /([0-9].)(p[xt])\s(.*)/;
            var E = F.match(D);
            return {size: E[1] + E[2], font: E[3]}
        }, r = function (I, J, E) {
            var K = E.split(" "), H = I.className, G = H.baseVal.split(" ");
            for (var F = 0; F < K.length; F++) {
                if (J) {
                    if (G.indexOf(K[F]) == -1) {
                        G.push(K[F])
                    }
                } else {
                    var D = G.indexOf(K[F]);
                    if (D != -1) {
                        G.splice(D, 1)
                    }
                }
            }
            I.className.baseVal = G.join(" ")
        }, u = function (E, D) {
            r(E, true, D)
        }, k = function (E, D) {
            r(E, false, D)
        };
    jsPlumbUtil.svg = {addClass: u, removeClass: k, node: f, attr: g, pos: n};
    var s = function (H) {
        var D = this, G = H.pointerEventsSpec || "all";
        jsPlumb.jsPlumbUIComponent.apply(this, H.originalArgs);
        D.canvas = null, D.path = null, D.svg = null;
        var F = H.cssClass + " " + (H.originalArgs[0].cssClass || ""),
            I = {style: "", width: 0, height: 0, "pointer-events": G, position: "absolute"};
        if (D.tooltip) {
            I.title = D.tooltip
        }
        D.svg = f("svg", I);
        if (H.useDivWrapper) {
            D.canvas = document.createElement("div");
            D.canvas.style.position = "absolute";
            jsPlumb.sizeCanvas(D.canvas, 0, 0, 1, 1);
            D.canvas.className = F;
            if (D.tooltip) {
                D.canvas.setAttribute("title", D.tooltip)
            }
        } else {
            g(D.svg, {"class": F});
            D.canvas = D.svg
        }
        H._jsPlumb.appendElement(D.canvas, H.originalArgs[0]["parent"]);
        if (H.useDivWrapper) {
            D.canvas.appendChild(D.svg)
        }
        var E = [D.canvas];
        this.getDisplayElements = function () {
            return E
        };
        this.appendDisplayElement = function (J) {
            E.push(J)
        };
        this.paint = function (N, L, K) {
            if (L != null) {
                var J = N[0], O = N[1];
                if (H.useDivWrapper) {
                    jsPlumb.sizeCanvas(D.canvas, N[0], N[1], N[2], N[3]);
                    J = 0, O = 0
                }
                var M = n([J, O, N[2], N[3]]);
                if (D.getZIndex()) {
                    M += ";z-index:" + D.getZIndex() + ";"
                }
                g(D.svg, {style: M, width: N[2], height: N[3]});
                D._paint.apply(this, arguments)
            }
        }
    };
    var d = jsPlumb.SvgConnector = function (E) {
        var D = this;
        s.apply(this, [{
            cssClass: E._jsPlumb.connectorClass,
            originalArgs: arguments,
            pointerEventsSpec: "none",
            tooltip: E.tooltip,
            _jsPlumb: E._jsPlumb
        }]);
        this._paint = function (L, H) {
            var K = D.getPath(L), F = {d: K}, J = null;
            F["pointer-events"] = "all";
            if (H.outlineColor) {
                var I = H.outlineWidth || 1, G = H.lineWidth + (2 * I), J = jsPlumb.CurrentLibrary.extend({}, H);
                J.strokeStyle = jsPlumbUtil.convertStyle(H.outlineColor);
                J.lineWidth = G;
                if (D.bgPath == null) {
                    D.bgPath = f("path", F);
                    D.svg.appendChild(D.bgPath);
                    D.attachListeners(D.bgPath, D)
                } else {
                    g(D.bgPath, F)
                }
                x(D.svg, D.bgPath, J, L, D)
            }
            if (D.path == null) {
                D.path = f("path", F);
                D.svg.appendChild(D.path);
                D.attachListeners(D.path, D)
            } else {
                g(D.path, F)
            }
            x(D.svg, D.path, H, L, D)
        };
        this.reattachListeners = function () {
            if (D.bgPath) {
                D.reattachListenersForElement(D.bgPath, D)
            }
            if (D.path) {
                D.reattachListenersForElement(D.path, D)
            }
        }
    };
    jsPlumb.Connectors.svg.Bezier = function (D) {
        jsPlumb.Connectors.Bezier.apply(this, arguments);
        d.apply(this, arguments);
        this.getPath = function (F) {
            var E = "M " + F[4] + " " + F[5];
            E += (" C " + F[8] + " " + F[9] + " " + F[10] + " " + F[11] + " " + F[6] + " " + F[7]);
            return E
        }
    };
    jsPlumb.Connectors.svg.Straight = function (D) {
        jsPlumb.Connectors.Straight.apply(this, arguments);
        d.apply(this, arguments);
        this.getPath = function (E) {
            return "M " + E[4] + " " + E[5] + " L " + E[6] + " " + E[7]
        }
    };
    jsPlumb.Connectors.svg.Flowchart = function () {
        var D = this;
        jsPlumb.Connectors.Flowchart.apply(this, arguments);
        d.apply(this, arguments);
        this.getPath = function (E) {
            var G = "M " + E[4] + "," + E[5], J = E[4], I = E[5];
            for (var M = 0; M < E[8]; M++) {
                var H = E[9 + (M * 2)], Q = E[10 + (M * 2)], F = E[9 + ((M + 1) * 2)], P = E[10 + ((M + 1) * 2)],
                    R = (H != J) && (Q == I), N = (H == J) && (Q != I), L = R ? H > F ? 1 : -1 : 0,
                    K = N ? Q > P ? 1 : -1 : 0, O = D.lineWidth / 2;
                G = G + " L " + H + " " + Q;
                G = G + " L " + (H + (L * O)) + " " + (Q + (K * O));
                J = H;
                I = Q;
                G = G + " M " + H + " " + Q
            }
            G = G + " L " + E[6] + "," + E[7];
            return G
        }
    };
    var y = window.SvgEndpoint = function (E) {
        var D = this;
        s.apply(this, [{
            cssClass: E._jsPlumb.endpointClass,
            originalArgs: arguments,
            pointerEventsSpec: "all",
            useDivWrapper: true,
            _jsPlumb: E._jsPlumb
        }]);
        this._paint = function (H, G) {
            var F = jsPlumb.extend({}, G);
            if (F.outlineColor) {
                F.strokeWidth = F.outlineWidth;
                F.strokeStyle = jsPlumbUtil.convertStyle(F.outlineColor, true)
            }
            if (D.node == null) {
                D.node = D.makeNode(H, F);
                D.svg.appendChild(D.node);
                D.attachListeners(D.node, D)
            }
            x(D.svg, D.node, F, H, D);
            n(D.node, H)
        };
        this.reattachListeners = function () {
            if (D.node) {
                D.reattachListenersForElement(D.node, D)
            }
        }
    };
    jsPlumb.Endpoints.svg.Dot = function () {
        jsPlumb.Endpoints.Dot.apply(this, arguments);
        y.apply(this, arguments);
        this.makeNode = function (E, D) {
            return f("circle", {cx: E[2] / 2, cy: E[3] / 2, r: E[2] / 2})
        }
    };
    jsPlumb.Endpoints.svg.Rectangle = function () {
        jsPlumb.Endpoints.Rectangle.apply(this, arguments);
        y.apply(this, arguments);
        this.makeNode = function (E, D) {
            return f("rect", {width: E[2], height: E[3]})
        }
    };
    jsPlumb.Endpoints.svg.Image = jsPlumb.Endpoints.Image;
    jsPlumb.Endpoints.svg.Blank = jsPlumb.Endpoints.Blank;
    jsPlumb.Overlays.svg.Label = jsPlumb.Overlays.Label;
    jsPlumb.Overlays.svg.Custom = jsPlumb.Overlays.Custom;
    var p = function (H, F) {
        H.apply(this, F);
        jsPlumb.jsPlumbUIComponent.apply(this, F);
        this.isAppendedAtTopLevel = false;
        var D = this, G = null;
        this.paint = function (J, M, I, N, K) {
            if (G == null) {
                G = f("path", {"pointer-events": "all"});
                J.svg.appendChild(G);
                D.attachListeners(G, J);
                D.attachListeners(G, D)
            }
            var L = F && (F.length == 1) ? (F[0].cssClass || "") : "";
            g(G, {d: E(M), "class": L, stroke: N ? N : null, fill: K ? K : null})
        };
        var E = function (I) {
            return "M" + I.hxy.x + "," + I.hxy.y + " L" + I.tail[0].x + "," + I.tail[0].y + " L" + I.cxy.x + "," + I.cxy.y + " L" + I.tail[1].x + "," + I.tail[1].y + " L" + I.hxy.x + "," + I.hxy.y
        };
        this.reattachListeners = function () {
            if (G) {
                D.reattachListenersForElement(G, D)
            }
        };
        this.cleanup = function () {
            if (G != null) {
                jsPlumb.CurrentLibrary.removeElement(G)
            }
        }
    };
    jsPlumb.Overlays.svg.Arrow = function () {
        p.apply(this, [jsPlumb.Overlays.Arrow, arguments])
    };
    jsPlumb.Overlays.svg.PlainArrow = function () {
        p.apply(this, [jsPlumb.Overlays.PlainArrow, arguments])
    };
    jsPlumb.Overlays.svg.Diamond = function () {
        p.apply(this, [jsPlumb.Overlays.Diamond, arguments])
    };
    jsPlumb.Overlays.svg.GuideLines = function () {
        var I = null, D = this, H = null, G, F;
        jsPlumb.Overlays.GuideLines.apply(this, arguments);
        this.paint = function (K, M, J, N, L) {
            if (I == null) {
                I = f("path");
                K.svg.appendChild(I);
                D.attachListeners(I, K);
                D.attachListeners(I, D);
                G = f("path");
                K.svg.appendChild(G);
                D.attachListeners(G, K);
                D.attachListeners(G, D);
                F = f("path");
                K.svg.appendChild(F);
                D.attachListeners(F, K);
                D.attachListeners(F, D)
            }
            g(I, {d: E(M[0], M[1]), stroke: "red", fill: null});
            g(G, {d: E(M[2][0], M[2][1]), stroke: "blue", fill: null});
            g(F, {d: E(M[3][0], M[3][1]), stroke: "green", fill: null})
        };
        var E = function (K, J) {
            return "M " + K.x + "," + K.y + " L" + J.x + "," + J.y
        }
    }
})();
(function () {
    var d = null, i = function (p, o) {
        return jsPlumb.CurrentLibrary.hasClass(a(p), o)
    }, a = function (o) {
        return jsPlumb.CurrentLibrary.getElementObject(o)
    }, m = function (o) {
        return jsPlumb.CurrentLibrary.getOffset(a(o))
    }, n = function (o) {
        return jsPlumb.CurrentLibrary.getPageXY(o)
    }, f = function (o) {
        return jsPlumb.CurrentLibrary.getClientXY(o)
    };
    var k = function () {
        var q = this;
        q.overlayPlacements = [];
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        jsPlumbUtil.EventGenerator.apply(this, arguments);
        this._over = function (z) {
            var B = m(a(q.canvas)), D = n(z), u = D[0] - B.left, C = D[1] - B.top;
            if (u > 0 && C > 0 && u < q.canvas.width && C < q.canvas.height) {
                for (var v = 0; v < q.overlayPlacements.length; v++) {
                    var w = q.overlayPlacements[v];
                    if (w && (w[0] <= u && w[1] >= u && w[2] <= C && w[3] >= C)) {
                        return true
                    }
                }
                var A = q.canvas.getContext("2d").getImageData(parseInt(u), parseInt(C), 1, 1);
                return A.data[0] != 0 || A.data[1] != 0 || A.data[2] != 0 || A.data[3] != 0
            }
            return false
        };
        var p = false, o = false, t = null, s = false, r = function (v, u) {
            return v != null && i(v, u)
        };
        this.mousemove = function (x) {
            var z = n(x), w = f(x), v = document.elementFromPoint(w[0], w[1]), y = r(v, "_jsPlumb_overlay");
            var u = d == null && (r(v, "_jsPlumb_endpoint") || r(v, "_jsPlumb_connector"));
            if (!p && u && q._over(x)) {
                p = true;
                q.fire("mouseenter", q, x);
                return true
            } else {
                if (p && (!q._over(x) || !u) && !y) {
                    p = false;
                    q.fire("mouseexit", q, x)
                }
            }
            q.fire("mousemove", q, x)
        };
        this.click = function (u) {
            if (p && q._over(u) && !s) {
                q.fire("click", q, u)
            }
            s = false
        };
        this.dblclick = function (u) {
            if (p && q._over(u) && !s) {
                q.fire("dblclick", q, u)
            }
            s = false
        };
        this.mousedown = function (u) {
            if (q._over(u) && !o) {
                o = true;
                t = m(a(q.canvas));
                q.fire("mousedown", q, u)
            }
        };
        this.mouseup = function (u) {
            o = false;
            q.fire("mouseup", q, u)
        };
        this.contextmenu = function (u) {
            if (p && q._over(u) && !s) {
                q.fire("contextmenu", q, u)
            }
            s = false
        }
    };
    var c = function (p) {
        var o = document.createElement("canvas");
        p._jsPlumb.appendElement(o, p.parent);
        o.style.position = "absolute";
        if (p["class"]) {
            o.className = p["class"]
        }
        p._jsPlumb.getId(o, p.uuid);
        if (p.tooltip) {
            o.setAttribute("title", p.tooltip)
        }
        return o
    };
    var l = function (p) {
        k.apply(this, arguments);
        var o = [];
        this.getDisplayElements = function () {
            return o
        };
        this.appendDisplayElement = function (q) {
            o.push(q)
        }
    };
    var h = jsPlumb.CanvasConnector = function (r) {
        l.apply(this, arguments);
        var o = function (v, t) {
            p.ctx.save();
            jsPlumb.extend(p.ctx, t);
            if (t.gradient) {
                var u = p.createGradient(v, p.ctx);
                for (var s = 0; s < t.gradient.stops.length; s++) {
                    u.addColorStop(t.gradient.stops[s][0], t.gradient.stops[s][1])
                }
                p.ctx.strokeStyle = u
            }
            p._paint(v, t);
            p.ctx.restore()
        };
        var p = this, q = p._jsPlumb.connectorClass + " " + (r.cssClass || "");
        p.canvas = c({"class": q, _jsPlumb: p._jsPlumb, parent: r.parent, tooltip: r.tooltip});
        p.ctx = p.canvas.getContext("2d");
        p.appendDisplayElement(p.canvas);
        p.paint = function (w, t) {
            if (t != null) {
                jsPlumb.sizeCanvas(p.canvas, w[0], w[1], w[2], w[3]);
                if (p.getZIndex()) {
                    p.canvas.style.zIndex = p.getZIndex()
                }
                if (t.outlineColor != null) {
                    var v = t.outlineWidth || 1, s = t.lineWidth + (2 * v),
                        u = {strokeStyle: t.outlineColor, lineWidth: s};
                    o(w, u)
                }
                o(w, t)
            }
        }
    };
    var b = function (r) {
        var p = this;
        l.apply(this, arguments);
        var q = p._jsPlumb.endpointClass + " " + (r.cssClass || ""),
            o = {"class": q, _jsPlumb: p._jsPlumb, parent: r.parent, tooltip: p.tooltip};
        p.canvas = c(o);
        p.ctx = p.canvas.getContext("2d");
        p.appendDisplayElement(p.canvas);
        this.paint = function (x, u, s) {
            jsPlumb.sizeCanvas(p.canvas, x[0], x[1], x[2], x[3]);
            if (u.outlineColor != null) {
                var w = u.outlineWidth || 1, t = u.lineWidth + (2 * w);
                var v = {strokeStyle: u.outlineColor, lineWidth: t}
            }
            p._paint.apply(this, arguments)
        }
    };
    jsPlumb.Endpoints.canvas.Dot = function (r) {
        jsPlumb.Endpoints.Dot.apply(this, arguments);
        b.apply(this, arguments);
        var q = this, p = function (s) {
            try {
                return parseInt(s)
            } catch (t) {
                if (s.substring(s.length - 1) == "%") {
                    return parseInt(s.substring(0, s - 1))
                }
            }
        }, o = function (u) {
            var s = q.defaultOffset, t = q.defaultInnerRadius;
            u.offset && (s = p(u.offset));
            u.innerRadius && (t = p(u.innerRadius));
            return [s, t]
        };
        this._paint = function (A, t, x) {
            if (t != null) {
                var B = q.canvas.getContext("2d"), u = x.getOrientation(q);
                jsPlumb.extend(B, t);
                if (t.gradient) {
                    var v = o(t.gradient), y = u[1] == 1 ? v[0] * -1 : v[0], s = u[0] == 1 ? v[0] * -1 : v[0],
                        z = B.createRadialGradient(A[4], A[4], A[4], A[4] + s, A[4] + y, v[1]);
                    for (var w = 0; w < t.gradient.stops.length; w++) {
                        z.addColorStop(t.gradient.stops[w][0], t.gradient.stops[w][1])
                    }
                    B.fillStyle = z
                }
                B.beginPath();
                B.arc(A[4], A[4], A[4], 0, Math.PI * 2, true);
                B.closePath();
                if (t.fillStyle || t.gradient) {
                    B.fill()
                }
                if (t.strokeStyle) {
                    B.stroke()
                }
            }
        }
    };
    jsPlumb.Endpoints.canvas.Rectangle = function (p) {
        var o = this;
        jsPlumb.Endpoints.Rectangle.apply(this, arguments);
        b.apply(this, arguments);
        this._paint = function (x, r, v) {
            var A = o.canvas.getContext("2d"), t = v.getOrientation(o);
            jsPlumb.extend(A, r);
            if (r.gradient) {
                var z = t[1] == 1 ? x[3] : t[1] == 0 ? x[3] / 2 : 0;
                var y = t[1] == -1 ? x[3] : t[1] == 0 ? x[3] / 2 : 0;
                var s = t[0] == 1 ? x[2] : t[0] == 0 ? x[2] / 2 : 0;
                var q = t[0] == -1 ? x[2] : t[0] == 0 ? x[2] / 2 : 0;
                var w = A.createLinearGradient(s, z, q, y);
                for (var u = 0; u < r.gradient.stops.length; u++) {
                    w.addColorStop(r.gradient.stops[u][0], r.gradient.stops[u][1])
                }
                A.fillStyle = w
            }
            A.beginPath();
            A.rect(0, 0, x[2], x[3]);
            A.closePath();
            if (r.fillStyle || r.gradient) {
                A.fill()
            }
            if (r.strokeStyle) {
                A.stroke()
            }
        }
    };
    jsPlumb.Endpoints.canvas.Triangle = function (p) {
        var o = this;
        jsPlumb.Endpoints.Triangle.apply(this, arguments);
        b.apply(this, arguments);
        this._paint = function (z, q, v) {
            var s = z[2], C = z[3], B = z[0], A = z[1], D = o.canvas.getContext("2d"), w = 0, u = 0, t = 0,
                r = v.getOrientation(o);
            if (r[0] == 1) {
                w = s;
                u = C;
                t = 180
            }
            if (r[1] == -1) {
                w = s;
                t = 90
            }
            if (r[1] == 1) {
                u = C;
                t = -90
            }
            D.fillStyle = q.fillStyle;
            D.translate(w, u);
            D.rotate(t * Math.PI / 180);
            D.beginPath();
            D.moveTo(0, 0);
            D.lineTo(s / 2, C / 2);
            D.lineTo(0, C);
            D.closePath();
            if (q.fillStyle || q.gradient) {
                D.fill()
            }
            if (q.strokeStyle) {
                D.stroke()
            }
        }
    };
    jsPlumb.Endpoints.canvas.Image = jsPlumb.Endpoints.Image;
    jsPlumb.Endpoints.canvas.Blank = jsPlumb.Endpoints.Blank;
    jsPlumb.Connectors.canvas.Bezier = function () {
        var o = this;
        jsPlumb.Connectors.Bezier.apply(this, arguments);
        h.apply(this, arguments);
        this._paint = function (q, p) {
            o.ctx.beginPath();
            o.ctx.moveTo(q[4], q[5]);
            o.ctx.bezierCurveTo(q[8], q[9], q[10], q[11], q[6], q[7]);
            o.ctx.stroke()
        };
        this.createGradient = function (r, p, q) {
            return o.ctx.createLinearGradient(r[6], r[7], r[4], r[5])
        }
    };
    jsPlumb.Connectors.canvas.Straight = function () {
        var p = this, o = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
        jsPlumb.Connectors.Straight.apply(this, arguments);
        h.apply(this, arguments);
        this._paint = function (r, t) {
            p.ctx.beginPath();
            if (t.dashstyle && t.dashstyle.split(" ").length == 2) {
                var v = t.dashstyle.split(" ");
                if (v.length != 2) {
                    v = [2, 2]
                }
                var C = [v[0] * t.lineWidth, v[1] * t.lineWidth], y = (r[6] - r[4]) / (r[7] - r[5]),
                    G = jsPlumbUtil.segment([r[4], r[5]], [r[6], r[7]]), x = o[G], u = Math.atan(y),
                    z = Math.sqrt(Math.pow(r[6] - r[4], 2) + Math.pow(r[7] - r[5], 2)),
                    B = Math.floor(z / (C[0] + C[1])), w = [r[4], r[5]];
                for (var A = 0; A < B; A++) {
                    p.ctx.moveTo(w[0], w[1]);
                    var q = w[0] + (Math.abs(Math.sin(u) * C[0]) * x[0]),
                        F = w[1] + (Math.abs(Math.cos(u) * C[0]) * x[1]),
                        E = w[0] + (Math.abs(Math.sin(u) * (C[0] + C[1])) * x[0]),
                        D = w[1] + (Math.abs(Math.cos(u) * (C[0] + C[1])) * x[1]);
                    p.ctx.lineTo(q, F);
                    w = [E, D]
                }
                p.ctx.moveTo(w[0], w[1]);
                p.ctx.lineTo(r[6], r[7])
            } else {
                p.ctx.moveTo(r[4], r[5]);
                p.ctx.lineTo(r[6], r[7])
            }
            p.ctx.stroke()
        };
        this.createGradient = function (r, q) {
            return q.createLinearGradient(r[4], r[5], r[6], r[7])
        }
    };
    jsPlumb.Connectors.canvas.Flowchart = function () {
        var o = this;
        jsPlumb.Connectors.Flowchart.apply(this, arguments);
        h.apply(this, arguments);
        this._paint = function (r, q) {
            o.ctx.beginPath();
            o.ctx.moveTo(r[4], r[5]);
            for (var p = 0; p < r[8]; p++) {
                o.ctx.lineTo(r[9 + (p * 2)], r[10 + (p * 2)])
            }
            o.ctx.lineTo(r[6], r[7]);
            o.ctx.stroke()
        };
        this.createGradient = function (q, p) {
            return p.createLinearGradient(q[4], q[5], q[6], q[7])
        }
    };
    jsPlumb.Overlays.canvas.Label = jsPlumb.Overlays.Label;
    jsPlumb.Overlays.canvas.Custom = jsPlumb.Overlays.Custom;
    var g = function () {
        jsPlumb.jsPlumbUIComponent.apply(this, arguments)
    };
    var e = function (p, o) {
        p.apply(this, o);
        g.apply(this, o);
        this.paint = function (s, u, q, v, t) {
            var r = s.ctx;
            r.lineWidth = q;
            r.beginPath();
            r.moveTo(u.hxy.x, u.hxy.y);
            r.lineTo(u.tail[0].x, u.tail[0].y);
            r.lineTo(u.cxy.x, u.cxy.y);
            r.lineTo(u.tail[1].x, u.tail[1].y);
            r.lineTo(u.hxy.x, u.hxy.y);
            r.closePath();
            if (v) {
                r.strokeStyle = v;
                r.stroke()
            }
            if (t) {
                r.fillStyle = t;
                r.fill()
            }
        }
    };
    jsPlumb.Overlays.canvas.Arrow = function () {
        e.apply(this, [jsPlumb.Overlays.Arrow, arguments])
    };
    jsPlumb.Overlays.canvas.PlainArrow = function () {
        e.apply(this, [jsPlumb.Overlays.PlainArrow, arguments])
    };
    jsPlumb.Overlays.canvas.Diamond = function () {
        e.apply(this, [jsPlumb.Overlays.Diamond, arguments])
    }
})();
(function (a) {
    jsPlumb.CurrentLibrary = {
        addClass: function (c, b) {
            c = jsPlumb.CurrentLibrary.getElementObject(c);
            try {
                if (c[0].className.constructor == SVGAnimatedString) {
                    jsPlumbUtil.svg.addClass(c[0], b)
                }
            } catch (d) {
            }
            c.addClass(b)
        },
        animate: function (d, c, b) {
            d.animate(c, b)
        },
        appendElement: function (c, b) {
            jsPlumb.CurrentLibrary.getElementObject(b).append(c)
        },
        ajax: function (b) {
            b = b || {};
            b.type = b.type || "get";
            a.ajax(b)
        },
        bind: function (b, c, d) {
            b = jsPlumb.CurrentLibrary.getElementObject(b);
            b.bind(c, d)
        },
        dragEvents: {
            start: "start",
            stop: "stop",
            drag: "drag",
            step: "step",
            over: "over",
            out: "out",
            drop: "drop",
            complete: "complete"
        },
        extend: function (c, b) {
            return a.extend(c, b)
        },
        getAttribute: function (b, c) {
            return b.attr(c)
        },
        getClientXY: function (b) {
            return [b.clientX, b.clientY]
        },
        getDragObject: function (b) {
            return b[1].draggable
        },
        getDragScope: function (b) {
            return b.draggable("option", "scope")
        },
        getDropEvent: function (b) {
            return b[0]
        },
        getDropScope: function (b) {
            return b.droppable("option", "scope")
        },
        getDOMElement: function (b) {
            if (typeof(b) == "string") {
                return document.getElementById(b)
            } else {
                if (b.context || b.length != null) {
                    return b[0]
                } else {
                    return b
                }
            }
        },
        getElementObject: function (b) {
            return typeof(b) == "string" ? a("#" + b) : a(b)
        },
        getOffset: function (b) {
            return b.offset()
        },
        getOriginalEvent: function (b) {
            return b.originalEvent
        },
        getPageXY: function (b) {
            return [b.pageX, b.pageY]
        },
        getParent: function (b) {
            return jsPlumb.CurrentLibrary.getElementObject(b).parent()
        },
        getScrollLeft: function (b) {
            return b.scrollLeft()
        },
        getScrollTop: function (b) {
            return b.scrollTop()
        },
        getSelector: function (b) {
            return a(b)
        },
        getSize: function (b) {
            return [b.outerWidth(), b.outerHeight()]
        },
        getTagName: function (b) {
            var c = jsPlumb.CurrentLibrary.getElementObject(b);
            return c.length > 0 ? c[0].tagName : null
        },
        getUIPosition: function (c, d) {
            d = d || 1;
            if (c.length == 1) {
                ret = {left: c[0].pageX, top: c[0].pageY}
            } else {
                var e = c[1], b = e.offset;
                ret = b || e.absolutePosition;
                e.position.left /= d;
                e.position.top /= d
            }
            return {left: ret.left / d, top: ret.top / d}
        },
        hasClass: function (c, b) {
            return c.hasClass(b)
        },
        initDraggable: function (c, b, d) {
            b = b || {};
            b.helper = null;
            if (d) {
                b.scope = b.scope || jsPlumb.Defaults.Scope
            }
            c.draggable(b)
        },
        initDroppable: function (c, b) {
            b.scope = b.scope || jsPlumb.Defaults.Scope;
            c.droppable(b)
        },
        isAlreadyDraggable: function (b) {
            b = jsPlumb.CurrentLibrary.getElementObject(b);
            return b.hasClass("ui-draggable")
        },
        isDragSupported: function (c, b) {
            return c.draggable
        },
        isDropSupported: function (c, b) {
            return c.droppable
        },
        removeClass: function (c, b) {
            c = jsPlumb.CurrentLibrary.getElementObject(c);
            try {
                if (c[0].className.constructor == SVGAnimatedString) {
                    jsPlumbUtil.svg.removeClass(c[0], b)
                }
            } catch (d) {
            }
            c.removeClass(b)
        },
        removeElement: function (b, c) {
            jsPlumb.CurrentLibrary.getElementObject(b).remove()
        },
        setAttribute: function (c, d, b) {
            c.attr(d, b)
        },
        setDraggable: function (c, b) {
            c.draggable("option", "disabled", !b)
        },
        setDragScope: function (c, b) {
            c.draggable("option", "scope", b)
        },
        setOffset: function (b, c) {
            jsPlumb.CurrentLibrary.getElementObject(b).offset(c)
        },
        trigger: function (d, e, b) {
            var c = jQuery._data(jsPlumb.CurrentLibrary.getElementObject(d)[0], "handle");
            c(b)
        },
        unbind: function (b, c, d) {
            b = jsPlumb.CurrentLibrary.getElementObject(b);
            b.unbind(c, d)
        }
    };
    a(document).ready(jsPlumb.init)
})(jQuery);
(function () {
    "undefined" == typeof Math.sgn && (Math.sgn = function (l) {
        return 0 == l ? 0 : 0 < l ? 1 : -1
    });
    var d = {
        subtract: function (m, l) {
            return {x: m.x - l.x, y: m.y - l.y}
        }, dotProduct: function (m, l) {
            return m.x * l.x + m.y * l.y
        }, square: function (l) {
            return Math.sqrt(l.x * l.x + l.y * l.y)
        }, scale: function (m, l) {
            return {x: m.x * l, y: m.y * l}
        }
    }, f = Math.pow(2, -65), h = function (y, x) {
        for (var t = [], v = x.length - 1, r = 2 * v - 1, s = [], w = [], p = [], q = [], o = [[1, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1]], u = 0; u <= v; u++) {
            s[u] = d.subtract(x[u], y)
        }
        for (u = 0; u <= v - 1; u++) {
            w[u] = d.subtract(x[u + 1], x[u]);
            w[u] = d.scale(w[u], 3)
        }
        for (u = 0; u <= v - 1; u++) {
            for (var m = 0; m <= v; m++) {
                p[u] || (p[u] = []);
                p[u][m] = d.dotProduct(w[u], s[m])
            }
        }
        for (u = 0; u <= r; u++) {
            q[u] || (q[u] = []);
            q[u].y = 0;
            q[u].x = parseFloat(u) / r
        }
        r = v - 1;
        for (s = 0; s <= v + r; s++) {
            u = Math.max(0, s - r);
            for (w = Math.min(s, v); u <= w; u++) {
                j = s - u;
                q[u + j].y = q[u + j].y + p[j][u] * o[j][u]
            }
        }
        v = x.length - 1;
        q = a(q, 2 * v - 1, t, 0);
        r = d.subtract(y, x[0]);
        p = d.square(r);
        for (u = o = 0; u < q; u++) {
            r = d.subtract(y, k(x, v, t[u], null, null));
            r = d.square(r);
            if (r < p) {
                p = r;
                o = t[u]
            }
        }
        r = d.subtract(y, x[v]);
        r = d.square(r);
        if (r < p) {
            p = r;
            o = 1
        }
        return {location: o, distance: p}
    }, a = function (C, B, x, z) {
        var v = [], w = [], A = [], t = [], u = 0, s, y;
        y = Math.sgn(C[0].y);
        for (var q = 1; q <= B; q++) {
            s = Math.sgn(C[q].y);
            s != y && u++;
            y = s
        }
        switch (u) {
            case 0:
                return 0;
            case 1:
                if (z >= 64) {
                    x[0] = (C[0].x + C[B].x) / 2;
                    return 1
                }
                var p, u = C[0].y - C[B].y;
                y = C[B].x - C[0].x;
                q = C[0].x * C[B].y - C[B].x * C[0].y;
                s = max_distance_below = 0;
                for (p = 1; p < B; p++) {
                    var r = u * C[p].x + y * C[p].y + q;
                    r > s ? s = r : r < max_distance_below && (max_distance_below = r)
                }
                p = y;
                s = (1 * (q - s) - p * 0) * (1 / (0 * p - u * 1));
                p = y;
                y = q - max_distance_below;
                u = (1 * y - p * 0) * (1 / (0 * p - u * 1));
                y = Math.min(s, u);
                if (Math.max(s, u) - y < f) {
                    A = C[B].x - C[0].x;
                    t = C[B].y - C[0].y;
                    x[0] = 0 + 1 * (A * (C[0].y - 0) - t * (C[0].x - 0)) * (1 / (A * 0 - t * 1));
                    return 1
                }
        }
        k(C, B, 0.5, v, w);
        C = a(v, B, A, z + 1);
        B = a(w, B, t, z + 1);
        for (z = 0; z < C; z++) {
            x[z] = A[z]
        }
        for (z = 0; z < B; z++) {
            x[z + C] = t[z]
        }
        return C + B
    }, k = function (m, l, p, q, n) {
        for (var o = [[]], r = 0; r <= l; r++) {
            o[0][r] = m[r]
        }
        for (m = 1; m <= l; m++) {
            for (r = 0; r <= l - m; r++) {
                o[m] || (o[m] = []);
                o[m][r] || (o[m][r] = {});
                o[m][r].x = (1 - p) * o[m - 1][r].x + p * o[m - 1][r + 1].x;
                o[m][r].y = (1 - p) * o[m - 1][r].y + p * o[m - 1][r + 1].y
            }
        }
        if (q != null) {
            for (r = 0; r <= l; r++) {
                q[r] = o[r][0]
            }
        }
        if (n != null) {
            for (r = 0; r <= l; r++) {
                n[r] = o[l - r][r]
            }
        }
        return o[l][0]
    }, g = {}, e = function (t) {
        var s = g[t];
        if (!s) {
            var s = [], p = function (u) {
                return function () {
                    return u
                }
            }, q = function () {
                return function (u) {
                    return u
                }
            }, n = function () {
                return function (u) {
                    return 1 - u
                }
            }, o = function (u) {
                return function (v) {
                    for (var x = 1, w = 0; w < u.length; w++) {
                        x = x * u[w](v)
                    }
                    return x
                }
            };
            s.push(new function () {
                return function (u) {
                    return Math.pow(u, t)
                }
            });
            for (var r = 1; r < t; r++) {
                for (var l = [new p(t)], m = 0; m < t - r; m++) {
                    l.push(new q)
                }
                for (m = 0; m < r; m++) {
                    l.push(new n)
                }
                s.push(new o(l))
            }
            s.push(new function () {
                return function (u) {
                    return Math.pow(1 - u, t)
                }
            });
            g[t] = s
        }
        return s
    }, c = function (m, l) {
        for (var p = e(m.length - 1), q = 0, n = 0, o = 0; o < m.length; o++) {
            q = q + m[o].x * p[o](l);
            n = n + m[o].y * p[o](l)
        }
        return {x: q, y: n}
    }, b = function (m, l, p) {
        for (var q = c(m, l), n = 0, o = p > 0 ? 1 : -1, r = null; n < Math.abs(p);) {
            l = l + 0.005 * o;
            r = c(m, l);
            n = n + Math.sqrt(Math.pow(r.x - q.x, 2) + Math.pow(r.y - q.y, 2));
            q = r
        }
        return {point: r, location: l}
    }, i = function (m, l) {
        var o = c(m, l), p = c(m.slice(0, m.length - 1), l), n = p.y - o.y, o = p.x - o.x;
        return n == 0 ? Infinity : Math.atan(n / o)
    };
    window.jsBezier = {
        distanceFromCurve: h, gradientAtPoint: i, gradientAtPointAlongCurveFrom: function (m, l, n) {
            l = b(m, l, n);
            if (l.location > 1) {
                l.location = 1
            }
            if (l.location < 0) {
                l.location = 0
            }
            return i(m, l.location)
        }, nearestPointOnCurve: function (m, l) {
            var n = h(m, l);
            return {point: k(l, l.length - 1, n.location, null, null), location: n.location}
        }, pointOnCurve: c, pointAlongCurveFrom: function (m, l, n) {
            return b(m, l, n).point
        }, perpendicularToCurveAt: function (m, l, n, o) {
            l = b(m, l, o == null ? 0 : o);
            m = i(m, l.location);
            o = Math.atan(-1 / m);
            m = n / 2 * Math.sin(o);
            n = n / 2 * Math.cos(o);
            return [{x: l.point.x + n, y: l.point.y + m}, {x: l.point.x - n, y: l.point.y - m}]
        }, locationAlongCurveFrom: function (m, l, n) {
            return b(m, l, n).location
        }
    }
})();