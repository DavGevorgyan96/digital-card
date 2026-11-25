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

  // Угловой «глаз» 7×7 модулей со скруглёнными углами: рамка + квадрат в центре.
  function eye(x, y) {
    return (
      "M" + (x + 2) + " " + y + "h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" +
      "M" + (x + 2) + " " + (y + 1) + "a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" +
      "M" + (x + 2.8) + " " + (y + 2) + "h1.4a0.8 0.8 0 0 1 0.8 0.8v1.4a0.8 0.8 0 0 1-0.8 0.8h-1.4a0.8 0.8 0 0 1-0.8-0.8v-1.4a0.8 0.8 0 0 1 0.8-0.8z"
    );
  }

  // SVG: тёмный код на белом фоне, поля 4 модуля, размер по умолчанию 1200 px
  // (векторный — масштабируется для печати без потерь). Стиль: модули — точки,
  // угловые квадраты скруглены. Читается камерами телефонов, проверено декодером.
  function svg(text, sizePx) {
    var m = matrix(text);
    var n = m.length;
    var q = QUIET_ZONE;
    var total = n + q * 2;
    var size = sizePx || 1200;
    var inEye = function (r, c) { return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7); };
    var d = "";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (!m[r][c] || inEye(r, c)) continue;
        // круг радиусом 0.44 модуля из двух дуг
        d += "M" + (c + q + 0.06) + " " + (r + q + 0.5) + "a0.44 0.44 0 1 0 0.88 0a0.44 0.44 0 1 0-0.88 0z";
      }
    }
    d += eye(q, q) + eye(q + n - 7, q) + eye(q, q + n - 7);
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 ' + total + " " + total + '">' +
      '<rect width="' + total + '" height="' + total + '" fill="#ffffff"/>' +
      '<path fill="#000000" fill-rule="evenodd" d="' + d + '"/></svg>\n'
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
