/*
 * QR-код: построение матрицы, SVG и проверка адреса.
 * Генерация полностью локальная (js/vendor/qrcode.js, MIT) — без внешних сервисов
 * и без перенаправлений: в коде записан сам адрес визитки.
 * Работает в браузере (window.CardQR) и в Node (module.exports) — для тестов.
 */
(function (root) {
  "use strict";

  var lib =
    typeof module !== "undefined" && module.exports
      ? require("./vendor/qrcode.js")
      : root.qrcode;

  var QUIET_ZONE = 4; // поля вокруг кода в модулях — минимум по стандарту

  // Матрица модулей: массив строк из true/false. Уровень коррекции Q (~25%) —
  // запас на потёртости и неидеальную печать.
  function matrix(text) {
    var qr = lib(0, "Q");
    qr.addData(text, "Byte");
    qr.make();
    var n = qr.getModuleCount();
    var rows = [];
    for (var r = 0; r < n; r++) {
      var row = [];
      for (var c = 0; c < n; c++) row.push(qr.isDark(r, c));
      rows.push(row);
    }
    return rows;
  }

  // SVG: тёмный код на белом фоне, поля 4 модуля, размер по умолчанию 1200 px
  // (векторный — масштабируется для печати без потерь).
  function svg(text, sizePx) {
    var m = matrix(text);
    var n = m.length;
    var total = n + QUIET_ZONE * 2;
    var size = sizePx || 1200;
    var d = "";
    for (var r = 0; r < n; r++) {
      var c = 0;
      while (c < n) {
        if (!m[r][c]) { c++; continue; }
        var start = c;
        while (c < n && m[r][c]) c++;
        d += "M" + (start + QUIET_ZONE) + " " + (r + QUIET_ZONE) + "h" + (c - start) + "v1h-" + (c - start) + "z";
      }
    }
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 ' + total + " " + total + '" shape-rendering="crispEdges">' +
      '<rect width="' + total + '" height="' + total + '" fill="#ffffff"/>' +
      '<path fill="#000000" d="' + d + '"/></svg>\n'
    );
  }

  /*
   * Годится ли адрес для печатного QR-кода.
   * Возвращает { ok: true, url } или { ok: false, reason: "..." }.
   * reason: "empty" | "invalid" | "not-https" | "local" | "demo" | "temporary"
   */
  function checkUrl(value) {
    var raw = value == null ? "" : String(value).trim();
    if (!raw) return { ok: false, reason: "empty" };
    var u;
    try { u = new URL(raw); } catch (e) { return { ok: false, reason: "invalid" }; }
    if (u.protocol !== "https:") return { ok: false, reason: "not-https" };
    var host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    if (
      host === "localhost" || /\.localhost$/.test(host) || /\.local$/.test(host) ||
      host === "::1" || host === "0.0.0.0" ||
      /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host.indexOf(".") === -1
    ) return { ok: false, reason: "local" };
    if (
      /(^|\.)example\.(com|org|net)$/.test(host) ||
      /\.(example|test|invalid)$/.test(host) ||
      /replace[-_]?me/i.test(u.href)
    ) return { ok: false, reason: "demo" };
    if (/(^|\.)(ngrok\.io|ngrok-free\.app|ngrok\.app|trycloudflare\.com|loca\.lt|localhost\.run|serveo\.net)$/.test(host)) {
      return { ok: false, reason: "temporary" };
    }
    return { ok: true, url: u.href };
  }

  var api = { matrix: matrix, svg: svg, checkUrl: checkUrl, QUIET_ZONE: QUIET_ZONE };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CardQR = api;
})(typeof window !== "undefined" ? window : globalThis);
