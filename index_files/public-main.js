/*
 hey, [be]Lazy.js - v1.8.2 - 2016.10.25
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
(function (a, b) { "function" === typeof define && define.amd ? define(b) : "object" === typeof exports ? module.exports = b() : a.Blazy = b() })(this, function () {
  function a(a) { var g = a._util; g.elements = n(a.options); g.count = g.elements.length; g.destroyed && (g.destroyed = !1, a.options.container && m(a.options.container, function (a) { r(a, "scroll", g.validateT) }), r(window, "resize", g.saveViewportOffsetT), r(window, "resize", g.validateT), r(window, "scroll", g.validateT)); b(a) } function b(a) {
    for (var g = a._util, c = 0; c < g.count; c++) {
      var b = g.elements[c];
      var q = b; var e = a.options; var f = q.getBoundingClientRect(); e.container && z && (q = q.closest(e.containerClass)) ? (q = q.getBoundingClientRect(), e = d(q, k) ? d(f, { top: q.top - e.offset, right: q.right + e.offset, bottom: q.bottom + e.offset, left: q.left - e.offset }) : !1) : e = d(f, k); if (e || u(b, a.options.successClass)) a.load(b), g.elements.splice(c, 1), g.count--, c--
    } 0 === g.count && a.destroy()
  } function d(a, b) { return a.right >= b.left && a.bottom >= b.top && a.left <= b.right && a.top <= b.bottom } function e(a, b, c) {
    if (!u(a, c.successClass) && (b || c.loadInvisible ||
      0 < a.offsetWidth && 0 < a.offsetHeight)) if (b = a.getAttribute(w) || a.getAttribute(c.src)) {
        b = b.split(c.separator); var g = b[A && 1 < b.length ? 1 : 0], d = a.getAttribute(c.srcset), e = "img" === a.nodeName.toLowerCase(), y = (b = a.parentNode) && "picture" === b.nodeName.toLowerCase(); if (e || void 0 === a.src) {
          var k = new Image, n = function () { c.error && c.error(a, "invalid"); v(a, c.errorClass); l(k, "error", n); l(k, "load", p) }, p = function () { e ? y || h(a, g, d) : a.style.backgroundImage = 'url("' + g + '")'; f(a, c); l(k, "load", p); l(k, "error", n) }; y && (k = a, m(b.getElementsByTagName("source"),
            function (a) { var b = c.srcset, g = a.getAttribute(b); g && (a.setAttribute("srcset", g), a.removeAttribute(b)) })); r(k, "error", n); r(k, "load", p); h(k, g, d)
        } else a.src = g, f(a, c)
      } else "video" === a.nodeName.toLowerCase() ? (m(a.getElementsByTagName("source"), function (a) { var b = c.src, g = a.getAttribute(b); g && (a.setAttribute("src", g), a.removeAttribute(b)) }), a.load(), f(a, c)) : (c.error && c.error(a, "missing"), v(a, c.errorClass))
  } function f(a, b) {
    v(a, b.successClass); b.success && b.success(a); a.removeAttribute(b.src); a.removeAttribute(b.srcset);
    m(b.breakpoints, function (b) { a.removeAttribute(b.src) })
  } function h(a, b, c) { c && a.setAttribute("srcset", c); a.src = b } function u(a, b) { return -1 !== (" " + a.className + " ").indexOf(" " + b + " ") } function v(a, b) { u(a, b) || (a.className += " " + b) } function n(a) { var b = []; a = a.root.querySelectorAll(a.selector); for (var c = a.length; c--; b.unshift(a[c])); return b } function p(a) { k.bottom = (window.innerHeight || document.documentElement.clientHeight) + a; k.right = (window.innerWidth || document.documentElement.clientWidth) + a } function r(a, b,
    c) { a.attachEvent ? a.attachEvent && a.attachEvent("on" + b, c) : a.addEventListener(b, c, { capture: !1, passive: !0 }) } function l(a, b, c) { a.detachEvent ? a.detachEvent && a.detachEvent("on" + b, c) : a.removeEventListener(b, c, { capture: !1, passive: !0 }) } function m(a, b) { if (a && b) for (var c = a.length, d = 0; d < c && !1 !== b(a[d], d); d++); } function t(a, b, c) { var d = 0; return function () { var e = +new Date; e - d < b || (d = e, a.apply(c, arguments)) } } var w, k, A, z; return function (d) {
      if (!document.querySelectorAll) {
        var f = document.createStyleSheet(); document.querySelectorAll =
          function (a, b, c, d, e) { e = document.all; b = []; a = a.replace(/\[for\b/gi, "[htmlFor").split(","); for (c = a.length; c--;) { f.addRule(a[c], "k:v"); for (d = e.length; d--;)e[d].currentStyle.k && b.push(e[d]); f.removeRule(0) } return b }
      } var c = this, g = c._util = {}; g.elements = []; g.destroyed = !0; c.options = d || {}; c.options.error = c.options.error || !1; c.options.offset = c.options.offset || 100; c.options.root = c.options.root || document; c.options.success = c.options.success || !1; c.options.selector = c.options.selector || ".b-lazy"; c.options.separator =
        c.options.separator || "|"; c.options.containerClass = c.options.container; c.options.container = c.options.containerClass ? document.querySelectorAll(c.options.containerClass) : !1; c.options.errorClass = c.options.errorClass || "b-error"; c.options.breakpoints = c.options.breakpoints || !1; c.options.loadInvisible = c.options.loadInvisible || !1; c.options.successClass = c.options.successClass || "b-loaded"; c.options.validateDelay = c.options.validateDelay || 25; c.options.saveViewportOffsetDelay = c.options.saveViewportOffsetDelay ||
          50; c.options.srcset = c.options.srcset || "data-srcset"; c.options.src = w = c.options.src || "data-src"; z = Element.prototype.closest; A = 1 < window.devicePixelRatio; k = {}; k.top = 0 - c.options.offset; k.left = 0 - c.options.offset; c.revalidate = function () { a(c) }; c.load = function (a, b) { var c = this.options; void 0 === a.length ? e(a, b, c) : m(a, function (a) { e(a, b, c) }) }; c.destroy = function () {
            var a = this._util; this.options.container && m(this.options.container, function (b) { l(b, "scroll", a.validateT) }); l(window, "scroll", a.validateT); l(window, "resize",
              a.validateT); l(window, "resize", a.saveViewportOffsetT); a.count = 0; a.elements.length = 0; a.destroyed = !0
          }; g.validateT = t(function () { b(c) }, c.options.validateDelay, c); g.saveViewportOffsetT = t(function () { p(c.options.offset) }, c.options.saveViewportOffsetDelay, c); p(c.options.offset); m(c.options.breakpoints, function (a) { if (a.width >= window.screen.width) return w = a.src, !1 }); setTimeout(function () { a(c) })
    }
});
var WPacTime = WPacTime || {
  getTime: function (a, b, d) { return "chat" == d ? this.getChatTime(a, b || "en") : d ? this.getFormatTime(a, d, b || "en") : this.getDefaultTime(a, b || "en") }, getChatTime: function (a, b) { var d = ((new Date).getTime() - a) / 1E3 / 60 / 60, e = d / 24; return 24 > d ? this.getFormatTime(a, "HH:mm", b) : 365 > e ? this.getFormatTime(a, "dd.MM HH:mm", b) : this.getFormatTime(a, "yyyy.MM.dd HH:mm", b) }, getDefaultTime: function (a, b) { return this.getTimeAgo(a, b) }, getTimeAgo: function (a, b) {
    a = ((new Date).getTime() - a) / 1E3; var d = a / 60, e = d / 60, f = e / 24,
      h = f / 365; b = WPacTime.Messages[b] ? b : "en"; return 45 > a ? WPacTime.Messages[b].second : 90 > a ? WPacTime.Messages[b].minute : 45 > d ? WPacTime.Messages[b].minutes(d) : 90 > d ? WPacTime.Messages[b].hour : 24 > e ? WPacTime.Messages[b].hours(e) : 48 > e ? WPacTime.Messages[b].day : 30 > f ? WPacTime.Messages[b].days(f) : 60 > f ? WPacTime.Messages[b].month : 365 > f ? WPacTime.Messages[b].months(f) : 2 > h ? WPacTime.Messages[b].year : WPacTime.Messages[b].years(h)
  }, getTime12: function (a, b) {
    a = new Date(a); return (a.getHours() % 12 ? a.getHours() % 12 : 12) + ":" + a.getMinutes() +
      (12 <= a.getHours() ? " PM" : " AM")
  }, getFormatTime: function (a, b, d) { var e = new Date(a), f = { SS: e.getMilliseconds(), ss: e.getSeconds(), mm: e.getMinutes(), HH: e.getHours(), hh: (e.getHours() % 12 ? e.getHours() % 12 : 12) + (12 <= e.getHours() ? "PM" : "AM"), dd: e.getDate(), MM: e.getMonth() + 1, yyyy: e.getFullYear(), yy: String(e.getFullYear()).toString().substr(2, 2), ago: this.getTimeAgo(a, d), 12: this.getTime12(a, d) }; return b.replace(/(SS|ss|mm|HH|hh|DD|dd|MM|yyyy|yy|ago|12)/g, function (a, b) { a = f[b]; return 10 > a ? "0" + a : a }) }, declineNum: function (a,
    b, d, e) { return a + " " + this.declineMsg(a, b, d, e) }, declineMsg: function (a, b, d, e, f) { var h = a % 10; return 1 == h && (1 == a || 20 < a) ? b : 1 < h && 5 > h && (20 < a || 10 > a) ? d : a ? e : f }
};
WPacTime.Messages = {
  ru: {
    second: "\u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0442\u043e", minute: "\u043c\u0438\u043d\u0443\u0442\u0443 \u043d\u0430\u0437\u0430\u0434", minutes: function (a) { return WPacTime.declineNum(Math.round(a), "\u043c\u0438\u043d\u0443\u0442\u0430 \u043d\u0430\u0437\u0430\u0434", "\u043c\u0438\u043d\u0443\u0442\u044b \u043d\u0430\u0437\u0430\u0434", "\u043c\u0438\u043d\u0443\u0442 \u043d\u0430\u0437\u0430\u0434") }, hour: "\u0447\u0430\u0441 \u043d\u0430\u0437\u0430\u0434", hours: function (a) {
      return WPacTime.declineNum(Math.round(a),
        "\u0447\u0430\u0441 \u043d\u0430\u0437\u0430\u0434", "\u0447\u0430\u0441\u0430 \u043d\u0430\u0437\u0430\u0434", "\u0447\u0430\u0441\u043e\u0432 \u043d\u0430\u0437\u0430\u0434")
    }, day: "\u0434\u0435\u043d\u044c \u043d\u0430\u0437\u0430\u0434", days: function (a) { return WPacTime.declineNum(Math.round(a), "\u0434\u0435\u043d\u044c \u043d\u0430\u0437\u0430\u0434", "\u0434\u043d\u044f \u043d\u0430\u0437\u0430\u0434", "\u0434\u043d\u0435\u0439 \u043d\u0430\u0437\u0430\u0434") }, month: "\u043c\u0435\u0441\u044f\u0446 \u043d\u0430\u0437\u0430\u0434",
    months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "\u043c\u0435\u0441\u044f\u0446 \u043d\u0430\u0437\u0430\u0434", "\u043c\u0435\u0441\u044f\u0446\u0430 \u043d\u0430\u0437\u0430\u0434", "\u043c\u0435\u0441\u044f\u0446\u0435\u0432 \u043d\u0430\u0437\u0430\u0434") }, year: "\u0433\u043e\u0434 \u043d\u0430\u0437\u0430\u0434", years: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u0433\u043e\u0434 \u043d\u0430\u0437\u0430\u0434", "\u0433\u043e\u0434\u0430 \u043d\u0430\u0437\u0430\u0434",
        "\u043b\u0435\u0442 \u043d\u0430\u0437\u0430\u0434")
    }
  }, en: { second: "just now", minute: "1m ago", minutes: function (a) { return Math.round(a) + "m ago" }, hour: "1h ago", hours: function (a) { return Math.round(a) + "h ago" }, day: "a day ago", days: function (a) { return Math.round(a) + " days ago" }, month: "a month ago", months: function (a) { return Math.floor(a / 30) + " months ago" }, year: "a year ago", years: function (a) { return Math.round(a) + " years ago" } }, uk: {
    second: "\u0442\u0456\u043b\u044c\u043a\u0438 \u0449\u043e", minute: "\u0445\u0432\u0438\u043b\u0438\u043d\u0443 \u0442\u043e\u043c\u0443",
    minutes: function (a) { return WPacTime.declineNum(Math.round(a), "\u0445\u0432\u0438\u043b\u0438\u043d\u0443 \u0442\u043e\u043c\u0443", "\u0445\u0432\u0438\u043b\u0438\u043d\u0438 \u0442\u043e\u043c\u0443", "\u0445\u0432\u0438\u043b\u0438\u043d \u0442\u043e\u043c\u0443") }, hour: "\u0433\u043e\u0434\u0438\u043d\u0443 \u0442\u043e\u043c\u0443", hours: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u0433\u043e\u0434\u0438\u043d\u0443 \u0442\u043e\u043c\u0443", "\u0433\u043e\u0434\u0438\u043d\u0438 \u0442\u043e\u043c\u0443",
        "\u0433\u043e\u0434\u0438\u043d \u0442\u043e\u043c\u0443")
    }, day: "\u0434\u0435\u043d\u044c \u0442\u043e\u043c\u0443", days: function (a) { return WPacTime.declineNum(Math.round(a), "\u0434\u0435\u043d\u044c \u0442\u043e\u043c\u0443", "\u0434\u043d\u0456 \u0442\u043e\u043c\u0443", "\u0434\u043d\u0456\u0432 \u0442\u043e\u043c\u0443") }, month: "\u043c\u0456\u0441\u044f\u0446\u044c \u0442\u043e\u043c\u0443", months: function (a) {
      return WPacTime.declineNum(Math.floor(a / 30), "\u043c\u0456\u0441\u044f\u0446\u044c \u0442\u043e\u043c\u0443",
        "\u043c\u0456\u0441\u044f\u0446\u0456 \u0442\u043e\u043c\u0443", "\u043c\u0456\u0441\u044f\u0446\u0456\u0432 \u0442\u043e\u043c\u0443")
    }, year: "\u0440\u0456\u043a \u0442\u043e\u043c\u0443", years: function (a) { return WPacTime.declineNum(Math.round(a), "\u0440\u0456\u043a \u0442\u043e\u043c\u0443", "\u0440\u043e\u043a\u0438 \u0442\u043e\u043c\u0443", "\u0440\u043e\u043a\u0456\u0432 \u0442\u043e\u043c\u0443") }
  }, ro: {
    second: "chiar acum", minute: "\u00een urm\u0103 minut", minutes: function (a) {
      return WPacTime.declineNum(Math.round(a),
        "o minuta in urma", "minute in urma", "de minute in urma")
    }, hour: "acum o ora", hours: function (a) { return WPacTime.declineNum(Math.round(a), "acum o ora", "ore in urma", "de ore in urma") }, day: "o zi in urma", days: function (a) { return WPacTime.declineNum(Math.round(a), "o zi in urma", "zile in urma", "de zile in urma") }, month: "o luna in urma", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "o luna in urma", "luni in urma", "de luni in urma") }, year: "un an in urma", years: function (a) {
      return WPacTime.declineNum(Math.round(a),
        "un an in urma", "ani in urma", "de ani in urma")
    }
  }, lv: {
    second: "Maz\u0101k par min\u016bti", minute: "Pirms min\u016btes", minutes: function (a) { return WPacTime.declineNum(Math.round(a), "pirms min\u016btes", "pirms min\u016bt\u0113m", "pirms min\u016bt\u0113m") }, hour: "pirms stundas", hours: function (a) { return WPacTime.declineNum(Math.round(a), "pirms stundas", "pirms stund\u0101m", "pirms stund\u0101m") }, day: "pirms dienas", days: function (a) {
      return WPacTime.declineNum(Math.round(a), "pirms dienas", "pirms dien\u0101m",
        "pirms dien\u0101m")
    }, month: "pirms m\u0113ne\u0161a", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "pirms m\u0113ne\u0161a", "pirms m\u0113ne\u0161iem", "pirms m\u0113ne\u0161iem") }, year: "pirms gada", years: function (a) { return WPacTime.declineNum(Math.round(a), "pirms gada", "pirms gadiem", "pirms gadiem") }
  }, lt: {
    second: "k\u0105 tik", minute: "prie\u0161 minut\u0119", minutes: function (a) { return WPacTime.declineNum(Math.round(a), "minut\u0117 prie\u0161", "minut\u0117s prie\u0161", "minu\u010di\u0173 prie\u0161") },
    hour: "prie\u0161 valand\u0105", hours: function (a) { return WPacTime.declineNum(Math.round(a), "valanda prie\u0161", "valandos prie\u0161", "valand\u0173 prie\u0161") }, day: "prie\u0161 dien\u0105", days: function (a) { return WPacTime.declineNum(Math.round(a), "diena prie\u0161", "dienos prie\u0161", "dien\u0173 prie\u0161") }, month: "prie\u0161 m\u0117nes\u012f", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "m\u0117nes\u012f prie\u0161", "m\u0117nesiai prie\u0161", "m\u0117nesi\u0173 prie\u0161") },
    year: "prie\u0161 metus", years: function (a) { return WPacTime.declineNum(Math.round(a), "metai prie\u0161", "metai prie\u0161", "met\u0173 prie\u0161") }
  }, kk: {
    second: "\u0431\u0456\u0440 \u043c\u0438\u043d\u0443\u0442\u0442\u0430\u043d \u0430\u0437 \u0443\u0430\u049b\u044b\u0442 \u0431\u04b1\u0440\u044b\u043d", minute: "\u0431\u0456\u0440 \u043c\u0438\u043d\u0443\u0442 \u0431\u04b1\u0440\u044b\u043d", minutes: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u043c\u0438\u043d\u0443\u0442 \u0431\u04b1\u0440\u044b\u043d",
        "\u043c\u0438\u043d\u0443\u0442 \u0431\u04b1\u0440\u044b\u043d", "\u043c\u0438\u043d\u0443\u0442 \u0431\u04b1\u0440\u044b\u043d")
    }, hour: "\u0431\u0456\u0440 \u0441\u0430\u0493\u0430\u0442 \u0431\u04b1\u0440\u044b\u043d", hours: function (a) { return WPacTime.declineNum(Math.round(a), "\u0441\u0430\u0493\u0430\u0442 \u0431\u04b1\u0440\u044b\u043d", "\u0441\u0430\u0493\u0430\u0442 \u0431\u04b1\u0440\u044b\u043d", "\u0441\u0430\u0493\u0430\u0442 \u0431\u04b1\u0440\u044b\u043d") }, day: "\u0431\u0456\u0440 \u043a\u04af\u043d \u0431\u04b1\u0440\u044b\u043d",
    days: function (a) { return WPacTime.declineNum(Math.round(a), "\u043a\u04af\u043d \u0431\u04b1\u0440\u044b\u043d", "\u043a\u04af\u043d \u0431\u04b1\u0440\u044b\u043d", "\u043a\u04af\u043d \u0431\u04b1\u0440\u044b\u043d") }, month: "\u0431\u0456\u0440 \u0430\u0439 \u0431\u04b1\u0440\u044b\u043d", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "\u0430\u0439 \u0431\u04b1\u0440\u044b\u043d", "\u0430\u0439 \u0431\u04b1\u0440\u044b\u043d", "\u0430\u0439 \u0431\u04b1\u0440\u044b\u043d") }, year: "\u0431\u0456\u0440 \u0436\u044b\u043b \u0431\u04b1\u0440\u044b\u043d",
    years: function (a) { return WPacTime.declineNum(Math.round(a), "\u0436\u044b\u043b \u0431\u04b1\u0440\u044b\u043d", "\u0436\u044b\u043b \u0431\u04b1\u0440\u044b\u043d", "\u0436\u044b\u043b \u0431\u04b1\u0440\u044b\u043d") }
  }, ka: {
    second: "\u10ec\u10d0\u10db\u10d8\u10e1 \u10ec\u10d8\u10dc", minute: "\u10ec\u10e3\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc", minutes: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u10ec\u10e3\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10ec\u10e3\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc",
        "\u10ec\u10e3\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc")
    }, hour: "\u10e1\u10d0\u10d0\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc", hours: function (a) { return WPacTime.declineNum(Math.round(a), "\u10e1\u10d0\u10d0\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10e1\u10d0\u10d0\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10e1\u10d0\u10d0\u10d7\u10d8\u10e1 \u10ec\u10d8\u10dc") }, day: "\u10d3\u10e6\u10d8\u10e1 \u10ec\u10d8\u10dc", days: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u10d3\u10e6\u10d8\u10e1 \u10ec\u10d8\u10dc",
        "\u10d3\u10e6\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10d3\u10e6\u10d8\u10e1 \u10ec\u10d8\u10dc")
    }, month: "\u10d7\u10d5\u10d8\u10e1 \u10ec\u10d8\u10dc", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "\u10d7\u10d5\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10d7\u10d5\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10d7\u10d5\u10d8\u10e1 \u10ec\u10d8\u10dc") }, year: "\u10ec\u10da\u10d8\u10e1 \u10ec\u10d8\u10dc", years: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u10ec\u10da\u10d8\u10e1 \u10ec\u10d8\u10dc",
        "\u10ec\u10da\u10d8\u10e1 \u10ec\u10d8\u10dc", "\u10ec\u10da\u10d8\u10e1 \u10ec\u10d8\u10dc")
    }
  }, hy: {
    second: "\u0574\u056b \u0584\u0576\u056b \u057e\u0561\u0575\u0580\u056f\u0575\u0561\u0576 \u0561\u057c\u0561\u057b", minute: "\u0574\u0565\u056f \u0580\u0578\u057a\u0565 \u0561\u057c\u0561\u057b", minutes: function (a) { return WPacTime.declineNum(Math.round(a), "\u0580\u0578\u057a\u0565 \u0561\u057c\u0561\u057b", "\u0580\u0578\u057a\u0565 \u0561\u057c\u0561\u057b", "\u0580\u0578\u057a\u0565 \u0561\u057c\u0561\u057b") },
    hour: "\u0574\u0565\u056f \u056a\u0561\u0574 \u0561\u057c\u0561\u057b", hours: function (a) { return WPacTime.declineNum(Math.round(a), "\u056a\u0561\u0574 \u0561\u057c\u0561\u057b", "\u056a\u0561\u0574 \u0561\u057c\u0561\u057b", "\u056a\u0561\u0574 \u0561\u057c\u0561\u057b") }, day: "\u0574\u0565\u056f \u0585\u0580 \u0561\u057c\u0561\u057b", days: function (a) { return WPacTime.declineNum(Math.round(a), "\u0585\u0580 \u0561\u057c\u0561\u057b", "\u0585\u0580 \u0561\u057c\u0561\u057b", "\u0585\u0580 \u0561\u057c\u0561\u057b") },
    month: "\u0574\u0565\u056f \u0561\u0574\u056b\u057d \u0561\u057c\u0561\u057b", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "\u0561\u0574\u056b\u057d \u0561\u057c\u0561\u057b", "\u0561\u0574\u056b\u057d \u0561\u057c\u0561\u057b", "\u0561\u0574\u056b\u057d \u0561\u057c\u0561\u057b") }, year: "\u0574\u0565\u056f \u057f\u0561\u0580\u056b \u0561\u057c\u0561\u057b", years: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u057f\u0561\u0580\u056b \u0561\u057c\u0561\u057b", "\u057f\u0561\u0580\u056b \u0561\u057c\u0561\u057b",
        "\u057f\u0561\u0580\u056b \u0561\u057c\u0561\u057b")
    }
  }, fr: { second: "tout \u00e0 l'heure", minute: "environ une minute", minutes: function (a) { return Math.round(a) + " minutes" }, hour: "environ une heure", hours: function (a) { return "environ " + Math.round(a) + " heures" }, day: "un jour", days: function (a) { return Math.round(a) + " jours" }, month: "environ un mois", months: function (a) { return Math.floor(a / 30) + " mois" }, year: "environ un an", years: function (a) { return Math.round(a) + " ans" } }, es: {
    second: "ahora", minute: "hace un minuto",
    minutes: function (a) { return "hace " + Math.round(a) + " minuts" }, hour: "hace una hora", hours: function (a) { return "hace " + Math.round(a) + " horas" }, day: "hace un dia", days: function (a) { return "hace " + Math.round(a) + " d\u00edas" }, month: "hace un mes", months: function (a) { return "hace " + Math.floor(a / 30) + " meses" }, year: "hace a\u00f1os", years: function (a) { return "hace " + Math.round(a) + " a\u00f1os" }
  }, el: {
    second: "\u03bb\u03b9\u03b3\u03cc\u03c4\u03b5\u03c1\u03bf \u03b1\u03c0\u03cc \u03ad\u03bd\u03b1 \u03bb\u03b5\u03c0\u03c4\u03cc",
    minute: "\u03b3\u03cd\u03c1\u03c9 \u03c3\u03c4\u03bf \u03ad\u03bd\u03b1 \u03bb\u03b5\u03c0\u03c4\u03cc", minutes: function (a) { return Math.round(a) + " minutes" }, hour: "\u03b3\u03cd\u03c1\u03c9 \u03c3\u03c4\u03b7\u03bd \u03bc\u03b9\u03b1 \u03ce\u03c1\u03b1", hours: function (a) { return "about " + Math.round(a) + " hours" }, day: "\u03bc\u03b9\u03b1 \u03bc\u03ad\u03c1\u03b1", days: function (a) { return Math.round(a) + " days" }, month: "\u03b3\u03cd\u03c1\u03c9 \u03c3\u03c4\u03bf\u03bd \u03ad\u03bd\u03b1 \u03bc\u03ae\u03bd\u03b1",
    months: function (a) { return Math.floor(a / 30) + " months" }, year: "\u03b3\u03cd\u03c1\u03c9 \u03c3\u03c4\u03bf\u03bd \u03ad\u03bd\u03b1 \u03c7\u03c1\u03cc\u03bd\u03bf", years: function (a) { return Math.round(a) + " years" }
  }, de: {
    second: "soeben", minute: "vor einer Minute", minutes: function (a) { return "vor " + Math.round(a) + " Minuten" }, hour: "vor einer Stunde", hours: function (a) { return "vor " + Math.round(a) + " Stunden" }, day: "vor einem Tag", days: function (a) { return "vor " + Math.round(a) + " Tagen" }, month: "vor einem Monat", months: function (a) {
      return "vor " +
        Math.floor(a / 30) + " Monaten"
    }, year: "vor einem Jahr", years: function (a) { return "vor " + Math.round(a) + " Jahren" }
  }, be: {
    second: "\u043c\u0435\u043d\u0448 \u0437\u0430 \u0445\u0432\u0456\u043b\u0456\u043d\u0443 \u0442\u0430\u043c\u0443", minute: "\u0445\u0432\u0456\u043b\u0456\u043d\u0443 \u0442\u0430\u043c\u0443", minutes: function (a) {
      return WPacTime.declineNum(Math.round(a), "\u0445\u0432\u0456\u043b\u0456\u043d\u0430 \u0442\u0430\u043c\u0443", "\u0445\u0432\u0456\u043b\u0456\u043d\u044b \u0442\u0430\u043c\u0443",
        "\u0445\u0432\u0456\u043b\u0456\u043d \u0442\u0430\u043c\u0443")
    }, hour: "\u0433\u0430\u0434\u0437\u0456\u043d\u0443 \u0442\u0430\u043c\u0443", hours: function (a) { return WPacTime.declineNum(Math.round(a), "\u0433\u0430\u0434\u0437\u0456\u043d\u0443 \u0442\u0430\u043c\u0443", "\u0433\u0430\u0434\u0437\u0456\u043d\u044b \u0442\u0430\u043c\u0443", "\u0433\u0430\u0434\u0437\u0456\u043d \u0442\u0430\u043c\u0443") }, day: "\u0434\u0437\u0435\u043d\u044c \u0442\u0430\u043c\u0443", days: function (a) {
      return WPacTime.declineNum(Math.round(a),
        "\u0434\u0437\u0435\u043d\u044c \u0442\u0430\u043c\u0443", "\u0434\u043d\u0456 \u0442\u0430\u043c\u0443", "\u0434\u0437\u0451\u043d \u0442\u0430\u043c\u0443")
    }, month: "\u043c\u0435\u0441\u044f\u0446 \u0442\u0430\u043c\u0443", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "\u043c\u0435\u0441\u044f\u0446 \u0442\u0430\u043c\u0443", "\u043c\u0435\u0441\u044f\u0446\u0430 \u0442\u0430\u043c\u0443", "\u043c\u0435\u0441\u044f\u0446\u0430\u045e \u0442\u0430\u043c\u0443") }, year: "\u0433\u043e\u0434 \u0442\u0430\u043c\u0443",
    years: function (a) { return WPacTime.declineNum(Math.round(a), "\u0433\u043e\u0434 \u0442\u0430\u043c\u0443", "\u0433\u0430\u0434\u044b \u0442\u0430\u043c\u0443", "\u0433\u043e\u0434 \u0442\u0430\u043c\u0443") }
  }, it: {
    second: "proprio ora", minute: "un minuto fa", minutes: function (a) { return WPacTime.declineNum(Math.round(a), "un minuto fa", "minuti fa", "minuti fa") }, hour: "un'ora fa", hours: function (a) { return WPacTime.declineNum(Math.round(a), "un'ora fa", "ore fa", "ore fa") }, day: "un giorno fa", days: function (a) {
      return WPacTime.declineNum(Math.round(a),
        "un giorno fa", "giorni fa", "giorni fa")
    }, month: "un mese fa", months: function (a) { return WPacTime.declineNum(Math.floor(a / 30), "un mese fa", "mesi fa", "mesi fa") }, year: "un anno fa", years: function (a) { return WPacTime.declineNum(Math.round(a), "un anno fa", "anni fa", "anni fa") }
  }, tr: {
    second: "az \u00f6nce", minute: "dakika \u00f6nce", minutes: function (a) { return Math.round(a) + " dakika \u00f6nce" }, hour: "saat \u00f6nce", hours: function (a) { return Math.round(a) + " saat \u00f6nce" }, day: "g\u00fcn \u00f6nce", days: function (a) {
      return Math.round(a) +
        " g\u00fcn \u00f6nce"
    }, month: "ay \u00f6nce", months: function (a) { return Math.floor(a / 30) + " ay \u00f6nce" }, year: "y\u0131l \u00f6nce", years: function (a) { return Math.round(a) + " y\u0131l \u00f6nce" }
  }, nb: {
    second: "n\u00e5 nettopp", minute: "ett minutt siden", minutes: function (a) { return Math.round(a) + " minutter siden" }, hour: "en time siden", hours: function (a) { return Math.round(a) + " timer siden" }, day: "en dag siden", days: function (a) { return Math.round(a) + " dager siden" }, month: "en m\u00e5ned siden", months: function (a) {
      return Math.floor(a /
        30) + " m\u00e5neder siden"
    }, year: "ett \u00e5r siden", years: function (a) { return Math.round(a) + " \u00e5r siden" }
  }, da: {
    second: "lige nu", minute: "et minut siden", minutes: function (a) { return Math.round(a) + " minutter siden" }, hour: "en time siden", hours: function (a) { return Math.round(a) + " timer siden" }, day: "en dag siden", days: function (a) { return Math.round(a) + " dage siden" }, month: "en m\u00e5ned siden", months: function (a) { return Math.floor(a / 30) + " m\u00e5neder siden" }, year: "et \u00e5r siden", years: function (a) {
      return Math.round(a) +
        " \u00e5r siden"
    }
  }, nl: { second: "zojuist", minute: "minuten geleden", minutes: function (a) { return Math.round(a) + " minuten geleden" }, hour: "uur geleden", hours: function (a) { return Math.round(a) + " uur geleden" }, day: "1 dag geleden", days: function (a) { return Math.round(a) + " dagen geleden" }, month: "maand geleden", months: function (a) { return Math.floor(a / 30) + " maanden geleden" }, year: "jaar geleden", years: function (a) { return Math.round(a) + " jaar geleden" } }, ca: {
    second: "ara mateix", minute: "fa un minut", minutes: function (a) {
      return "fa " +
        Math.round(a) + " minuts"
    }, hour: "fa una hora", hours: function (a) { return "fa " + Math.round(a) + " hores" }, day: "fa un dia", days: function (a) { return "fa " + Math.round(a) + " dies" }, month: "fa un mes", months: function (a) { return "fa " + Math.floor(a / 30) + " mesos" }, year: "fa un any", years: function (a) { return "fa " + Math.round(a) + " anys" }
  }, sv: {
    second: "just nu", minute: "en minut sedan", minutes: function (a) { return Math.round(a) + " minuter sedan" }, hour: "en timme sedan", hours: function (a) { return Math.round(a) + " timmar sedan" }, day: "en dag sedan",
    days: function (a) { return Math.round(a) + " dagar sedan" }, month: "en m\u00e5nad sedan", months: function (a) { return Math.floor(a / 30) + " m\u00e5nader sedan" }, year: "ett \u00e5r sedan", years: function (a) { return Math.round(a) + " \u00e5r sedan" }
  }, pl: {
    second: "w\u0142a\u015bnie teraz", minute: "minut\u0119 temu", minutes: function (a) { return Math.round(a) + " minut temu" }, hour: "godzin\u0119 temu", hours: function (a) { return Math.round(a) + " godzin temu" }, day: "wczoraj", days: function (a) { return Math.round(a) + " dni temu" }, month: "miesi\u0105c temu",
    months: function (a) { return Math.floor(a / 30) + " miesi\u0119cy temu" }, year: "rok temu", years: function (a) { return Math.round(a) + " lat temu" }
  }, pt: {
    second: "agora", minute: "1 minuto atr\u00e1s", minutes: function (a) { return Math.round(a) + " minutos atr\u00e1s" }, hour: "1 hora atr\u00e1s", hours: function (a) { return Math.round(a) + " horas atr\u00e1s" }, day: "1 dia atr\u00e1s", days: function (a) { return Math.round(a) + " dias atr\u00e1s" }, month: "1 m\u00eas atr\u00e1s", months: function (a) { return Math.floor(a / 30) + " meses atr\u00e1s" },
    year: "1 ano atr\u00e1s", years: function (a) { return Math.round(a) + " anos atr\u00e1s" }
  }, hu: {
    second: "\u00e9pp az im\u00e9nt", minute: "1 perccel ezel\u0151tt", minutes: function (a) { return Math.round(a) + " perccel ezel\u0151tt" }, hour: "\u00f3r\u00e1val ezel\u0151tt", hours: function (a) { return Math.round(a) + " \u00f3r\u00e1val ezel\u0151tt" }, day: "nappal ezel\u0151tt", days: function (a) { return Math.round(a) + " nappal ezel\u0151tt" }, month: "h\u00f3nappal ezel\u0151tt", months: function (a) { return Math.floor(a / 30) + " h\u00f3nappal ezel\u0151tt" },
    year: "\u00e9vvel ezel\u0151tt", years: function (a) { return Math.round(a) + " \u00e9vvel ezel\u0151tt" }
  }, fi: {
    second: "juuri nyt", minute: "minuutti sitten", minutes: function (a) { return Math.round(a) + " minuuttia sitten" }, hour: "tunti sitten", hours: function (a) { return Math.round(a) + " tuntia sitten" }, day: "p\u00e4iv\u00e4 sitten", days: function (a) { return Math.round(a) + " p\u00e4iv\u00e4\u00e4 sitten" }, month: "kuukausi sitten", months: function (a) { return Math.floor(a / 30) + " kuukautta sitten" }, year: "vuosi sitten", years: function (a) {
      return Math.round(a) +
        " vuotta sitten"
    }
  }, he: {
    second: "\u05d4\u05e8\u05d2\u05e2", minute: "\u05dc\u05e4\u05e0\u05d9 \u05d3\u05e7\u05d4", minutes: function (a) { return "\u05dc\u05e4\u05e0\u05d9 " + Math.round(a) + " \u05d3\u05e7\u05d5\u05ea" }, hour: "\u05dc\u05e4\u05e0\u05d9 \u05e9\u05e2\u05d4", hours: function (a) { return "\u05dc\u05e4\u05e0\u05d9 " + Math.round(a) + " \u05e9\u05e2\u05d5\u05ea" }, day: "\u05dc\u05e4\u05e0\u05d9 \u05d9\u05d5\u05dd", days: function (a) { return "\u05dc\u05e4\u05e0\u05d9 " + Math.round(a) + " \u05d9\u05de\u05d9\u05dd" }, month: "\u05dc\u05e4\u05e0\u05d9 \u05d7\u05d5\u05d3\u05e9",
    months: function (a) { return 2 == Math.floor(a / 30) ? "\u05dc\u05e4\u05e0\u05d9 \u05d7\u05d5\u05d3\u05e9\u05d9\u05d9\u05dd" : "\u05dc\u05e4\u05e0\u05d9 " + Math.floor(a / 30) + " \u05d7\u05d5\u05d3\u05e9\u05d9\u05dd" }, year: "\u05dc\u05e4\u05e0\u05d9 \u05e9\u05e0\u05d4", years: function (a) { return "\u05dc\u05e4\u05e0\u05d9 " + Math.round(a) + " \u05e9\u05e0\u05d9\u05dd" }
  }, bg: {
    second: "\u0432 \u043c\u043e\u043c\u0435\u043d\u0442\u0430", minute: "\u043f\u0440\u0435\u0434\u0438 1 \u043c\u0438\u043d\u0443\u0442\u0430", minutes: function (a) {
      return "\u043f\u0440\u0435\u0434\u0438 " +
        Math.round(a) + " \u043c\u0438\u043d\u0443\u0442\u0438"
    }, hour: "\u043f\u0440\u0435\u0434\u0438 1 \u0447\u0430\u0441", hours: function (a) { return "\u043f\u0440\u0435\u0434\u0438 " + Math.round(a) + " \u0447\u0430\u0441\u0430" }, day: "\u043f\u0440\u0435\u0434\u0438 1 \u0434\u0435\u043d", days: function (a) { return "\u043f\u0440\u0435\u0434\u0438 " + Math.round(a) + " \u0434\u043d\u0438" }, month: "\u043f\u0440\u0435\u0434\u0438 1 \u043c\u0435\u0441\u0435\u0446", months: function (a) {
      return "\u043f\u0440\u0435\u0434\u0438 " + Math.floor(a /
        30) + " \u043c\u0435\u0441\u0435\u0446\u0430"
    }, year: "\u043f\u0440\u0435\u0434\u0438 1 \u0433\u043e\u0434\u0438\u043d\u0430", years: function (a) { return "\u043f\u0440\u0435\u0434\u0438 " + Math.round(a) + " \u0433\u043e\u0434\u0438\u043d\u0438" }
  }, sk: {
    second: "pr\u00e1ve teraz", minute: "pred min\u00fatov", minutes: function (a) { return "pred " + Math.round(a) + " min\u00fatami" }, hour: "pred hodinou", hours: function (a) { return "pred " + Math.round(a) + " hodinami" }, day: "v\u010dera", days: function (a) { return "pred " + Math.round(a) + " d\u0148ami" },
    month: "pred mesiacom", months: function (a) { return "pred " + Math.floor(a / 30) + " mesiacmi" }, year: "pred rokom", years: function (a) { return "pred " + Math.round(a) + " rokmi" }
  }, lo: {
    second: "\u0ea7\u0eb1\u0ec8\u0e87\u0e81\u0eb5\u0ec9\u0e99\u0eb5\u0ec9", minute: "\u0edc\u0eb6\u0ec8\u0e87\u0e99\u0eb2\u0e97\u0eb5\u0e81\u0ec8\u0ead\u0e99", minutes: function (a) { return Math.round(a) + " \u0e99\u0eb2\u0e97\u0eb5\u0e81\u0ec8\u0ead\u0e99" }, hour: "\u0edc\u0eb6\u0ec8\u0e87\u0e8a\u0ebb\u0ec8\u0ea7\u0ec2\u0ea1\u0e87\u0e81\u0ec8\u0ead\u0e99",
    hours: function (a) { return Math.round(a) + " \u0ebb\u0ec8\u0ea7\u0ec2\u0ea1\u0e87\u0e81\u0ec8\u0ead\u0e99" }, day: "\u0edc\u0eb6\u0ec8\u0e87\u0ea1\u0eb7\u0ec9\u0e81\u0ec8\u0ead\u0e99", days: function (a) { return Math.round(a) + " \u0ea1\u0eb7\u0ec9\u0e81\u0ec8\u0ead\u0e99" }, month: "\u0edc\u0eb6\u0ec8\u0e87\u0ec0\u0e94\u0eb7\u0ead\u0e99\u0e81\u0ec8\u0ead\u0e99", months: function (a) { return Math.floor(a / 30) + " \u0ec0\u0e94\u0eb7\u0ead\u0e99\u0e81\u0ec8\u0ead\u0e99" }, year: "\u0edc\u0eb6\u0ec8\u0e87\u0e9b\u0eb5\u0e81\u0ec8\u0ead\u0e99",
    years: function (a) { return Math.round(a) + " \u0e9b\u0eb5\u0e81\u0ec8\u0ead\u0e99" }
  }, sl: { second: "pravkar", minute: "pred eno minuto", minutes: function (a) { return "pred " + Math.round(a) + " minutami" }, hour: "pred eno uro", hours: function (a) { return "pred " + Math.round(a) + " urami" }, day: "pred enim dnem", days: function (a) { return "pred " + Math.round(a) + " dnevi" }, month: "pred enim mesecem", months: function (a) { return "pred " + Math.floor(a / 30) + " meseci" }, year: "pred enim letom", years: function (a) { return "pred " + Math.round(a) + " leti" } },
  et: { second: "just n\u00fc\u00fcd", minute: "minut tagasi", minutes: function (a) { return Math.round(a) + " minutit tagasi" }, hour: "tund tagasi", hours: function (a) { return Math.round(a) + " tundi tagasi" }, day: "p\u00e4ev tagasi", days: function (a) { return Math.round(a) + " p\u00e4eva tagasi" }, month: "kuu aega tagasi", months: function (a) { return Math.floor(a / 30) + " kuud tagasi" }, year: "aasta tagasi", years: function (a) { return Math.round(a) + " aastat tagasi" } }
};
function rplg_badge_init(a, b, d) { var e = a.querySelector(".wp-" + b + "-badge"), f = a.querySelector(".wp-" + b + "-form"); if (e && f) { var h = document.createElement("div"); h.className = d + " wpac"; -1 < e.className.indexOf("-fixed") && h.appendChild(e); h.appendChild(f); document.body.appendChild(h); e.onclick = function () { rplg_load_imgs(h); f.style.display = "block" } } }
function rplg_load_imgs(a) { a = a.querySelectorAll("img.rplg-blazy[data-src]"); for (var b = 0; b < a.length; b++)a[b].setAttribute("src", a[b].getAttribute("data-src")), a[b].removeAttribute("data-src") }
function rplg_next_reviews(a, b) { var d = this.parentNode, e = ".wp-" + a + "-review.wp-" + a + "-hide"; reviews = d.querySelectorAll(e); for (var f = 0; f < b && f < reviews.length; f++)reviews[f] && (reviews[f].className = reviews[f].className.replace("wp-" + a + "-hide", " "), rplg_load_imgs(reviews[f])); reviews = d.querySelectorAll(e); 1 > reviews.length && d.removeChild(this); window.rplg_blazy && window.rplg_blazy.revalidate(); return !1 } function rplg_leave_review_window() { _rplg_popup(this.getAttribute("href"), 620, 500); return !1 }
function _rplg_lang() { var a = navigator; return (a.language || a.systemLanguage || a.userLanguage || "en").substr(0, 2).toLowerCase() } function _rplg_popup(a, b, d, e, f, h) { f = f || screen.height / 2 - d / 2; h = h || screen.width / 2 - b / 2; return window.open(a, "", "location=1,status=1,resizable=yes,width=" + b + ",height=" + d + ",top=" + f + ",left=" + h) }
function _rplg_timeago(a) { for (var b = 0; b < a.length; b++) { var d = a[b].className; -1 < d.indexOf("google") ? (d = parseInt(a[b].getAttribute("data-time")), d *= 1E3) : d = -1 < d.indexOf("facebook") ? (new Date(a[b].getAttribute("data-time").replace(/\+\d+$/, ""))).getTime() : (new Date(a[b].getAttribute("data-time").replace(/ /, "T"))).getTime(); a[b].innerHTML = WPacTime.getTime(d, _rplg_lang(), "ago") } }
function _rplg_init_blazy(a) { window.Blazy ? window.rplg_blazy = new Blazy({ selector: "img.rplg-blazy" }) : 0 < a && setTimeout(function () { _rplg_init_blazy(a - 1) }, 200) } function _rplg_read_more() { for (var a = document.querySelectorAll(".wp-more-toggle"), b = 0; b < a.length; b++)(function (a) { a.onclick = function () { a.parentNode.removeChild(a.previousSibling.previousSibling); a.previousSibling.className = ""; a.textContent = "" } })(a[b]) }
function _rplg_get_parent(a, b) { b = b || "rplg"; if (0 > a.className.split(" ").indexOf(b)) for (; (a = a.parentElement) && 0 > a.className.split(" ").indexOf(b);); return a }
function _grw_init_slider(a) {
  function b() { var b = a.querySelector(".grw-slider .grw-row"); b.className = 510 > b.offsetWidth ? "grw-row grw-row-xs" : 750 > b.offsetWidth ? "grw-row grw-row-x" : 1100 > b.offsetWidth ? "grw-row grw-row-s" : 1450 > b.offsetWidth ? "grw-row grw-row-m" : 1800 > b.offsetWidth ? "grw-row grw-row-l" : "grw-row grw-row-xl"; p.length && setTimeout(d, 200) } function d() {
    var b = a.querySelector(".grw-slider-reviews"), d = a.querySelectorAll(".grw-slider-review"), f = Math.round(b.offsetWidth / d[0].offsetWidth), h = Math.ceil(d.length /
      f), g = a.querySelector(".grw-slider-dots"); if (g) {
        g.innerHTML = ""; for (var m = 0; m < h; m++) {
          var c = document.createElement("div"); c.className = "grw-slider-dot"; x = Math.ceil((b.scrollLeft + (b.scrollLeft + d[0].offsetWidth * f)) / 2 * h / b.scrollWidth); x == m + 1 && (c.className = "grw-slider-dot active"); c.setAttribute("data-index", m + 1); c.setAttribute("data-visible", f); g.appendChild(c); c.onclick = function () {
            var b = a.querySelector(".grw-slider-dot.active"); b = parseInt(b.getAttribute("data-index")); var c = parseInt(this.getAttribute("data-index")),
              d = parseInt(this.getAttribute("data-visible")); b < c ? e(d * Math.abs(c - b)) : n.scrollBy(-p[0].offsetWidth * d * Math.abs(c - b), 0); a.querySelector(".grw-slider-dot.active").className = "grw-slider-dot"; this.className = "grw-slider-dot active"; l && clearInterval(l)
          }
        }
      }
  } function e(a) { n.scrollBy(p[0].offsetWidth * a, 0) } function f() {
    var b = a.querySelector(".grw-slider-review:last-child"), d = b.getBoundingClientRect(); b = b.parentNode.getBoundingClientRect(); (2 > Math.abs(b.left - d.left) || b.left <= d.left) && d.left < b.right && (2 > Math.abs(b.right -
      d.right) || b.right >= d.right) && d.right > b.left ? n.scrollBy(-n.scrollWidth, 0) : e(1); l = setTimeout(f, v)
  } var h = a.querySelector(".grw-slider"), u = JSON.parse(h.getAttribute("data-options")), v = 1E3 * u.speed, n = a.querySelector(".grw-slider-reviews"), p = a.querySelectorAll(".grw-slider-review"), r = null, l = null, m = function () {
    (h.offsetWidth || h.offsetHeight || h.getClientRects().length) && "hidden" !== window.getComputedStyle(h).visibility ? (setTimeout(b, 1), _rplg_init_blazy(10), p.length && u.autoplay && setTimeout(f, v)) : setTimeout(m,
      300)
  }; m(); window.addEventListener("resize", function () { clearTimeout(r); r = setTimeout(function () { b() }, 150) }); n && n.addEventListener("scroll", function () { setTimeout(d, 200); window.rplg_blazy && window.rplg_blazy.revalidate() }); var t = a.querySelector(".grw-slider-prev"); t && (t.onclick = function () { n.scrollBy(-p[0].offsetWidth, 0); l && clearInterval(l) }); if (t = a.querySelector(".grw-slider-next")) t.onclick = function () { e(1); l && clearInterval(l) }
}
function grw_init(a, b) { _rplg_timeago(document.querySelectorAll(".wpac [data-time]")); _rplg_read_more(); _rplg_init_blazy(10); (a = _rplg_get_parent(a, "wp-gr")) && "true" != a.getAttribute("data-exec") && "slider" == b && (a.setAttribute("data-exec", "true"), _grw_init_slider(a)) } document.addEventListener("DOMContentLoaded", function () { for (var a = document.querySelectorAll('.wp-gr[data-exec="false"]'), b = 0; b < a.length; b++) { var d = a[b]; grw_init(d, d.getAttribute("data-layout")) } });