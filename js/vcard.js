/*
 * Генерация vCard 3.0 (RFC 2426) в UTF-8.
 * Работает и в браузере (window.CardVCard), и в Node (module.exports) — для тестов.
 */
(function (root) {
  "use strict";

  var CRLF = "\r\n";

  function clean(v) {
    return v == null ? "" : String(v).trim();
  }

  // Экранирование текстовых значений: \ ; , и переносы строк.
  function escapeText(v) {
    return clean(v)
      .replace(/\\/g, "\\\\")
      .replace(/\r\n|\r|\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }

  // Для URI/телефонов: значения не экранируются, но переносы строк недопустимы.
  function oneLine(v) {
    return clean(v).replace(/[\r\n]+/g, " ");
  }

  function utf8Length(ch) {
    var c = ch.codePointAt(0);
    return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // Перенос длинных строк: не более 75 октетов, продолжение начинается с пробела.
  // Многобайтовые символы (кириллица, армянский, эмодзи) не разрываются.
  function fold(line) {
    var out = [];
    var current = "";
    var bytes = 0;
    var limit = 75;
    Array.from(line).forEach(function (ch) {
      var len = utf8Length(ch);
      if (bytes + len > limit) {
        out.push(current);
        current = " ";
        bytes = 1;
      }
      current += ch;
      bytes += len;
    });
    out.push(current);
    return out.join(CRLF);
  }

  function normalizePhone(v) {
    var s = clean(v);
    if (!s) return "";
    var plus = s.charAt(0) === "+" ? "+" : "";
    return plus + s.replace(/\D/g, "");
  }

  function build(config) {
    var p = (config && config.person) || {};
    var c = (config && config.contacts) || {};
    var l = (config && config.links) || {};
    var a = (config && config.address) || {};

    var first = clean(p.firstName);
    var last = clean(p.lastName);
    var full = clean(p.displayName) || [first, last].filter(Boolean).join(" ") || clean(p.company);

    var lines = ["BEGIN:VCARD", "VERSION:3.0"];
    lines.push("N:" + [last, first, "", "", ""].map(escapeText).join(";"));
    lines.push("FN:" + escapeText(full));
    if (clean(p.company)) lines.push("ORG:" + escapeText(p.company));
    if (clean(p.title)) lines.push("TITLE:" + escapeText(p.title));

    var phone = normalizePhone(c.phone);
    if (phone) lines.push("TEL;TYPE=CELL,VOICE:" + phone);
    if (clean(c.email)) lines.push("EMAIL;TYPE=INTERNET:" + oneLine(c.email));
    if (clean(l.website)) lines.push("URL:" + oneLine(l.website));

    var adr = [a.street, a.city, a.region, a.postalCode, a.country].map(clean);
    if (adr.some(Boolean)) {
      // ADR: абонентский ящик; доп. адрес; улица; город; регион; индекс; страна
      lines.push("ADR;TYPE=WORK:;;" + adr.map(escapeText).join(";"));
    }

    lines.push("END:VCARD");
    return lines.map(fold).join(CRLF) + CRLF;
  }

  var api = { build: build, escapeText: escapeText, fold: fold, normalizePhone: normalizePhone };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CardVCard = api;
})(typeof window !== "undefined" ? window : globalThis);
