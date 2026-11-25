/*
 * Отрисовка визитки по данным из config.js.
 * Данные вставляются только как текст (textContent) и проверенные ссылки —
 * HTML из конфига не исполняется.
 */
(function () {
  "use strict";

  var DEFAULT_LABELS = {
    demoBanner: "Демо:",
    variantNames: { classic: "Классика", editorial: "Журнал", luxe: "Золото", aurora: "Аврора" },
    cardWord: "Визитка",
    saveContact: "Сохранить контакт",
    contactTitle: "Связаться",
    call: "Позвонить",
    email: "Почта",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    linksTitle: "Ссылки",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    website: "Сайт",
    address: "Адрес",
    openMap: "Открыть на карте",
    share: "Поделиться",
    showQr: "QR-код",
    qrTitle: "QR-код визитки",
    qrHint: "Наведите камеру телефона на код, чтобы открыть визитку.",
    qrSample: "Образец",
    downloadSvg: "Скачать SVG",
    downloadPng: "Скачать PNG",
    close: "Закрыть",
    linkCopied: "Ссылка скопирована",
    copyFailed: "Не удалось скопировать. Ссылка: ",
    vcardHint: "Файл контакта передан. Откройте его и подтвердите добавление.",
    qrBlocked: {
      empty: "Адрес визитки не указан. Заполните publicUrl в config.js — после этого QR-код можно будет скачать.",
      invalid: "Адрес в publicUrl записан с ошибкой. Исправьте его в config.js.",
      "not-https": "Адрес должен начинаться с https://. Исправьте publicUrl в config.js.",
      local: "В publicUrl указан локальный адрес. Для печати нужен постоянный публичный адрес.",
      demo: "В publicUrl указан демонстрационный адрес. Замените его на адрес опубликованной визитки — и QR-код можно будет скачать.",
      temporary: "В publicUrl указан временный адрес. Для печати нужен постоянный адрес.",
    },
  };

  var ICONS = {
    userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9.5" cy="8" r="3.6"/><path d="M3 20c.5-3.6 3.1-5.6 6.5-5.6 1.6 0 3 .4 4.100 1.300M18 13v6M15 16h6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.200 3.500h3l1.500 4-2.100 1.500a12 12 0 0 0 6.400 6.400l1.500-2.100 4 1.500v3a2 2 0 0 1-2.200 2A16.800 16.800 0 0 1 4.200 5.700a2 2 0 0 1 2-2.200z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="m4 7.500 8 6 8-6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3.500 20.500l1.300-4.500a8.500 8.500 0 1 1 3.300 3.200z"/><path fill="currentColor" d="M9.300 7.600c-.5 0-1.300.700-1.300 1.900 0 2.800 3.500 6.300 6.300 6.300 1.200 0 1.900-.800 1.900-1.300v-.800l-2-.900-.900 1c-1.100-.400-2.400-1.700-2.800-2.800l1-.900-.900-2z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4 2.800 11.200l5.700 2.100L21 4zm0 0-3.200 15.500-6-4.400M8.500 13.300V19l3.300-3.900"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.800"/><circle cx="17" cy="7" r=".6" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.800 21v-7.800h2.700l.4-3.200h-3.100V8.100c0-.9.300-1.500 1.600-1.500H17V3.700c-.300 0-1.300-.100-2.400-.100-2.400 0-4.100 1.500-4.100 4.200V10H7.800v3.200h2.700V21z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9.200h3.300V20H4zM5.650 3.800a1.900 1.900 0 1 1 0 3.800 1.900 1.900 0 0 1 0-3.800zM9.800 9.200H13v1.500c.6-1 1.800-1.800 3.500-1.800 3 0 3.900 2 3.900 4.900V20h-3.300v-5.500c0-1.500-.400-2.600-1.800-2.600s-2.200 1-2.200 2.600V20H9.800z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c2.500 2.300 3.700 5.200 3.700 8.500s-1.200 6.200-3.700 8.500c-2.500-2.300-3.700-5.200-3.700-8.500s1.200-6.200 3.700-8.500z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s6.500-5.600 6.500-11A6.500 6.500 0 0 0 5.500 10c0 5.400 6.500 11 6.500 11z"/><circle cx="12" cy="10" r="2.400"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3.500M7.500 8 12 3.500 16.500 8M5 12.500v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="3.500" width="6.500" height="6.500" rx="1"/><rect x="14" y="3.500" width="6.500" height="6.500" rx="1"/><rect x="3.500" y="14" width="6.500" height="6.500" rx="1"/><path d="M14 14h2.500v2.500H14zM18 18h2.500v2.500H18zM20.500 14v1M14 20.500h1"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7.500 10.500 12 15l4.500-4.500M5 19.500h14"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.500 16.500 16.500 7.500M9 7.500h7.500V15"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  var cfg = window.CARD_CONFIG || {};
  var person = cfg.person || {};
  var contacts = cfg.contacts || {};
  var links = cfg.links || {};
  var address = cfg.address || {};
  var L = Object.assign({}, DEFAULT_LABELS, cfg.labels || {});
  L.qrBlocked = Object.assign({}, DEFAULT_LABELS.qrBlocked, (cfg.labels || {}).qrBlocked || {});

  // ---------- Вспомогательное ----------
  function str(v) { return v == null ? "" : String(v).trim(); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "icon") node.innerHTML = ICONS[v] || ""; // только встроенные иконки
      else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function iconNode(name) {
    var wrap = document.createElement("span");
    wrap.innerHTML = ICONS[name] || "";
    return wrap.firstChild;
  }

  // Разрешаем только http(s)-ссылки; «site.am» дополняем до https://site.am
  function webUrl(v) {
    var s = str(v);
    if (!s) return "";
    if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = "https://" + s;
    try {
      var u = new URL(s);
      return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
    } catch (e) { return ""; }
  }

  function phoneDigits(v) { return str(v).replace(/\D/g, ""); }

  function telegramUrl(v) {
    var s = str(v);
    if (!s) return "";
    if (/^https?:\/\//i.test(s) || /^t\.me\//i.test(s)) return webUrl(s);
    var name = s.replace(/^@/, "");
    return /^[A-Za-z0-9_]{3,}$/.test(name) ? "https://t.me/" + name : "";
  }

  // Короткая подпись под ссылкой: @имя для соцсетей, домен для сайта
  function linkCaption(url, isSite) {
    try {
      var u = new URL(url);
      var host = u.hostname.replace(/^www\./, "");
      if (isSite) return host + (u.pathname.length > 1 ? u.pathname.replace(/\/$/, "") : "");
      var parts = u.pathname.split("/").filter(Boolean);
      var last = parts[parts.length - 1];
      return last ? "@" + decodeURIComponent(last) : host;
    } catch (e) { return ""; }
  }

  function initials() {
    var a = Array.from(str(person.firstName))[0] || "";
    var b = Array.from(str(person.lastName))[0] || "";
    var both = (a + b).toUpperCase();
    if (both) return both;
    return (Array.from(str(person.displayName) || str(person.company))[0] || "•").toUpperCase();
  }

  var fullName =
    str(person.displayName) ||
    [str(person.firstName), str(person.lastName)].filter(Boolean).join(" ") ||
    str(person.company);

  var qrCheck = window.CardQR.checkUrl(cfg.publicUrl);

  // ---------- Вариант оформления ----------
  // У каждого варианта своя композиция (см. раздел «Сборка страницы») и свои стили в variants.css.
  var VARIANTS = ["classic", "editorial", "luxe", "aurora"];
  var variant = (function () {
    var fromUrl = "";
    try { fromUrl = new URLSearchParams(window.location.search).get("v") || ""; } catch (e) {}
    if (VARIANTS.indexOf(fromUrl) !== -1) return fromUrl; // ?v=luxe — для показа вариантов
    return VARIANTS.indexOf(str(cfg.variant)) !== -1 ? str(cfg.variant) : "classic";
  })();
  document.documentElement.setAttribute("data-variant", variant);

  function rnd(min, max, digits) { return (min + Math.random() * (max - min)).toFixed(digits || 0); }

  // Живой фон: «Аврора» — световые пятна и мерцающие точки, «Золото» — лучи и золотая пыль
  if (variant === "aurora") {
    var fxA = el("div", { class: "fx", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]);
    for (var s1 = 0; s1 < 18; s1++) {
      fxA.appendChild(el("b", { style: "left:" + rnd(0, 100, 1) + "%;top:" + rnd(0, 100, 1) + "%;--d:" + rnd(2.4, 5.4, 2) + "s;--delay:" + rnd(0, 5, 2) + "s" }));
    }
    document.body.insertBefore(fxA, document.body.firstChild);
  } else if (variant === "luxe") {
    var fxL = el("div", { class: "lxfx", "aria-hidden": "true" }, [el("div", { class: "lx-rays" })]);
    for (var s2 = 0; s2 < 22; s2++) {
      fxL.appendChild(el("b", { style: "left:" + rnd(0, 100, 1) + "%;--x:" + rnd(-60, 60) + "px;--d:" + rnd(7, 15, 1) + "s;--delay:-" + rnd(0, 15, 1) + "s" }));
    }
    document.body.insertBefore(fxL, document.body.firstChild);
  }

  // ---------- Тема ----------
  (function applyTheme() {
    var t = cfg.theme || {};
    var map = {
      "--cfg-accent": t.accent,
      "--cfg-on-accent": t.onAccent,
      "--cfg-accent-dark": t.accentDark,
      "--cfg-on-accent-dark": t.onAccentDark,
    };
    Object.keys(map).forEach(function (k) {
      if (str(map[k])) document.documentElement.style.setProperty(k, str(map[k]));
    });
    // Цвет панели браузера на телефоне — в тон шапке
    var paneColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    if (paneColor) {
      Array.prototype.forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (m) {
        m.removeAttribute("media");
        m.setAttribute("content", paneColor);
      });
    }
    if (str(cfg.lang)) document.documentElement.lang = str(cfg.lang);
    if (fullName) {
      var tail = [str(person.title), str(person.company)].filter(Boolean).join(", ");
      document.title = fullName + (tail ? " — " + tail : "");
      var meta = document.querySelector('meta[name="description"]');
      if (meta && tail) meta.setAttribute("content", fullName + " — " + tail);
    }
  })();

  // ---------- Уведомление ----------
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(message, ms) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, ms || 3500);
  }

  // ---------- Скачивание файлов ----------
  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = el("a", { href: url, download: filename, style: "display:none" });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function saveContact() {
    var text = window.CardVCard.build(cfg);
    var blob = new Blob([text], { type: "text/vcard;charset=utf-8" });
    var name = (str(cfg.vcardFileName) || "contact").replace(/[^A-Za-z0-9_-]+/g, "-") + ".vcf";
    if (isIOS()) {
      // Safari на iOS сам открывает карточку контакта для файла text/vcard.
      var url = URL.createObjectURL(blob);
      window.location.assign(url);
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    } else {
      downloadBlob(blob, name);
    }
    // Сайт только передаёт файл; добавление в адресную книгу подтверждает пользователь.
    toast(L.vcardHint, 5000);
  }

  // ---------- Поделиться ----------
  function shareUrl() { return qrCheck.ok ? qrCheck.url : window.location.href; }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = el("textarea", { readonly: true, style: "position:fixed;top:0;left:0;opacity:0" });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  function copyLink() {
    var url = shareUrl();
    return copyText(url).then(
      function () { toast(L.linkCopied); },
      function () { toast(L.copyFailed + url, 8000); }
    );
  }

  function share() {
    var data = { title: document.title, url: shareUrl() };
    if (typeof navigator.share === "function") {
      return navigator.share(data).catch(function (err) {
        if (err && err.name === "AbortError") return; // пользователь закрыл меню
        return copyLink();
      });
    }
    return copyLink();
  }

  // ---------- QR ----------
  var qrDialog = document.getElementById("qr-dialog");

  function qrFileBase() {
    try { return "qr-" + new URL(qrCheck.url).hostname.replace(/[^a-z0-9.-]/gi, "-"); }
    catch (e) { return "qr-card"; }
  }

  function qrPngBlob(text, targetPx) {
    var m = window.CardQR.matrix(text);
    var quiet = window.CardQR.QUIET_ZONE;
    var total = m.length + quiet * 2;
    var scale = Math.max(1, Math.floor((targetPx || 2400) / total)); // целое число пикселей на модуль
    var px = total * scale;
    // Рисуем тот же SVG (точки и скруглённые углы), что показан в окне.
    var url = URL.createObjectURL(new Blob([window.CardQR.svg(text, px)], { type: "image/svg+xml" }));
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = px;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, px, px);
        ctx.drawImage(img, 0, 0, px, px);
        URL.revokeObjectURL(url);
        canvas.toBlob(resolve, "image/png");
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  function openQr() {
    // В образце показываем код для введённого значения, но скачать его нельзя.
    var text = qrCheck.ok ? qrCheck.url : str(cfg.publicUrl) || "https://example.com/";
    var frame = el("div", { class: "qr-frame" + (qrCheck.ok ? "" : " is-sample") });
    frame.innerHTML = window.CardQR.svg(text).replace(/^<\?xml[^>]*>\s*/, "");
    var svgEl = frame.querySelector("svg");
    svgEl.removeAttribute("width");
    svgEl.removeAttribute("height");
    svgEl.setAttribute("role", "img");
    svgEl.setAttribute("aria-label", L.qrTitle + (qrCheck.ok ? ": " + qrCheck.url : ""));
    if (!qrCheck.ok) frame.appendChild(el("div", { class: "qr-sample-tag" }, [el("span", { text: L.qrSample })]));

    var svgBtn = el("button", {
      type: "button", class: "btn btn-secondary", disabled: !qrCheck.ok,
      onclick: function () {
        downloadBlob(new Blob([window.CardQR.svg(qrCheck.url)], { type: "image/svg+xml;charset=utf-8" }), qrFileBase() + ".svg");
      },
    }, [iconNode("download"), el("span", { text: L.downloadSvg })]);

    var pngBtn = el("button", {
      type: "button", class: "btn btn-secondary", disabled: !qrCheck.ok,
      onclick: function () {
        qrPngBlob(qrCheck.url).then(function (blob) { if (blob) downloadBlob(blob, qrFileBase() + ".png"); });
      },
    }, [iconNode("download"), el("span", { text: L.downloadPng })]);

    qrDialog.replaceChildren.apply(qrDialog, [
      el("div", { class: "qr-head" }, [
        el("h2", { id: "qr-title", class: "qr-title", text: L.qrTitle }),
        el("button", { type: "button", class: "icon-btn", "aria-label": L.close, icon: "close", onclick: function () { qrDialog.close(); } }),
      ]),
      frame,
      qrCheck.ok ? el("p", { class: "qr-url", text: qrCheck.url }) : null,
      qrCheck.ok
        ? el("p", { class: "qr-hint", text: L.qrHint })
        : el("p", { class: "qr-note", role: "note", text: L.qrBlocked[qrCheck.reason] || L.qrBlocked.demo }),
      el("div", { class: "qr-actions" }, [svgBtn, pngBtn]),
    ].filter(Boolean));

    if (typeof qrDialog.showModal === "function") qrDialog.showModal();
    else qrDialog.setAttribute("open", "");
  }

  qrDialog.addEventListener("click", function (e) {
    if (e.target === qrDialog) qrDialog.close(); // клик по затемнению
  });

  // ---------- Сборка страницы ----------
  // Общие данные для всех вариантов: проверенные ссылки и подписи.
  // Пустые поля: при showEmpty: true кнопка видна, но приглушена и не нажимается
  // (удобно, пока не все контакты известны). Иначе — скрыта.
  var showEmpty = cfg.showEmpty === true;
  function emptyItem(key, icon, label) {
    return { key: key, href: null, icon: icon, label: label, value: "", caption: "", empty: true, aria: label };
  }

  function collectContacts() {
    var list = [];
    var tel = window.CardVCard.normalizePhone(contacts.phone);
    if (tel) list.push({ key: "call", href: "tel:" + tel, icon: "phone", label: L.call, value: str(contacts.phone) });
    else if (showEmpty) list.push(emptyItem("call", "phone", L.call));
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(contacts.email))) {
      list.push({ key: "email", href: "mailto:" + str(contacts.email), icon: "mail", label: L.email, value: str(contacts.email) });
    } else if (showEmpty) list.push(emptyItem("email", "mail", L.email));
    var wa = phoneDigits(contacts.whatsapp);
    if (wa) list.push({ key: "whatsapp", href: "https://wa.me/" + wa, icon: "whatsapp", label: L.whatsapp, value: str(contacts.whatsapp), external: true });
    else if (showEmpty) list.push(emptyItem("whatsapp", "whatsapp", L.whatsapp));
    var tg = telegramUrl(contacts.telegram);
    if (tg) list.push({ key: "telegram", href: tg, icon: "telegram", label: L.telegram, value: linkCaption(tg), external: true });
    else if (showEmpty) list.push(emptyItem("telegram", "telegram", L.telegram));
    return list;
  }

  function collectLinks() {
    var list = [];
    [["instagram", "instagram"], ["facebook", "facebook"], ["linkedin", "linkedin"], ["website", "globe"]].forEach(function (pair) {
      var url = webUrl(links[pair[0]]);
      if (url) list.push({ key: pair[0], href: url, icon: pair[1], label: L[pair[0]], caption: linkCaption(url, pair[0] === "website") });
      else if (showEmpty) list.push(emptyItem(pair[0], pair[1], L[pair[0]]));
    });
    var addressText = [address.street, address.city, address.region, address.postalCode, address.country].map(str).filter(Boolean).join(", ");
    if (addressText) {
      list.push({
        key: "address", icon: "pin", label: L.address, caption: addressText, wrap: true,
        href: webUrl(address.mapUrl) || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addressText),
        aria: L.address + ": " + addressText + ". " + L.openMap,
      });
    } else if (showEmpty) list.push(emptyItem("address", "pin", L.address));
    return list;
  }

  function linkAttrs(item, cls, external) {
    if (item.empty) {
      return { class: cls + " is-empty", "aria-label": item.aria || null, "aria-disabled": "true", title: item.label };
    }
    return {
      class: cls, href: item.href, "aria-label": item.aria || null,
      target: external ? "_blank" : null, rel: external ? "noopener noreferrer" : null,
    };
  }

  // Фото или инициалы внутри переданного элемента
  function fillPortrait(node) {
    if (str(person.photo)) {
      var img = el("img", { src: str(person.photo), alt: fullName, decoding: "async" });
      img.addEventListener("error", function () { node.textContent = initials(); });
      node.appendChild(img);
    } else {
      node.textContent = initials();
      node.setAttribute("aria-hidden", "true");
    }
    return node;
  }

  function saveButton(cls, trailingIcon) {
    return el("button", { type: "button", class: cls, id: "save-contact", onclick: saveContact },
      trailingIcon
        ? [el("span", { text: L.saveContact }), iconNode(trailingIcon)]
        : [iconNode("userPlus"), el("span", { text: L.saveContact })]);
  }

  function toolButtons(cls) {
    return [
      el("button", { type: "button", class: cls, id: "share", "aria-label": L.share, title: L.share, icon: "share", onclick: share }),
      el("button", { type: "button", class: cls, id: "show-qr", "aria-label": L.showQr, title: L.showQr, icon: "qr", onclick: openQr }),
    ];
  }

  // Плашка демо-режима с переключателем вариантов оформления
  function banner() {
    if (!cfg.demo) return null;
    var names = Object.assign({}, DEFAULT_LABELS.variantNames, L.variantNames || {});
    return el("div", { class: "demo-banner" }, [
      el("span", { class: "demo-label", text: L.demoBanner }),
      el("nav", { class: "variant-links", "aria-label": L.demoBanner }, VARIANTS.map(function (v) {
        return el("a", { href: "?v=" + v, "aria-current": v === variant ? "true" : null, text: names[v] || v });
      })),
    ]);
  }

  var title = str(person.title), company = str(person.company), bio = str(person.bio);

  /* ===== Классика: панель с именем + детали ===== */
  function renderClassic(main, contactList, linkList) {
    var details = [];
    if (contactList.length) {
      details.push(el("section", { class: "section", "aria-labelledby": "contact-title" }, [
        el("h2", { class: "section-title", id: "contact-title", text: L.contactTitle }),
        el("div", { class: "tiles" }, contactList.map(function (c) {
          return el("a", linkAttrs(c, "tile", c.external), [
            el("span", { class: "tile-icon", icon: c.icon }), el("span", { class: "tile-label", text: c.label }),
          ]);
        })),
      ]));
    }
    if (linkList.length) {
      details.push(el("section", { class: "section", "aria-labelledby": "links-title" }, [
        el("h2", { class: "section-title", id: "links-title", text: L.linksTitle }),
        el("ul", { class: "rows" }, linkList.map(function (l) {
          var chevron = iconNode("chevron");
          chevron.setAttribute("class", "row-chevron");
          return el("li", {}, [el("a", linkAttrs(l, "row", true), [
            el("span", { class: "row-icon", icon: l.icon }),
            el("span", { class: "row-text" }, [
              el("span", { class: "row-label", text: l.label }),
              l.caption ? el("span", { class: "row-sub" + (l.wrap ? " wrap" : ""), text: l.caption }) : null,
            ]),
            chevron,
          ])]);
        })),
      ]));
    }
    main.className = "card" + (cfg.demo ? " has-banner" : "");
    return [
      banner(),
      el("header", { class: "pane" }, [
        fillPortrait(el("div", { class: "avatar" })),
        el("div", { class: "pane-body" }, [
          title ? el("p", { class: "eyebrow", text: title }) : null,
          fullName ? el("h1", { class: "name", text: fullName }) : null,
          company ? el("p", { class: "company", text: company }) : null,
          bio ? el("p", { class: "bio", text: bio }) : null,
          saveButton("btn btn-primary"),
        ]),
        el("div", { class: "pane-tools" }, toolButtons("tool-btn")),
      ]),
      details.length ? el("div", { class: "details" }, details) : null,
    ];
  }

  /* ===== Журнал: обложка с гигантским именем и типографским списком ===== */
  function renderEditorial(main, contactList, linkList) {
    var words = fullName.split(/\s+/).filter(Boolean);
    var name = el("h1", { class: "ed-name" }, words.map(function (w, i) {
      return el("span", { class: "ed-line" }, [el("span", { class: "ed-word", style: "--i:" + i, text: w })]);
    }));

    // Имя занимает всю ширину колонки: размер шрифта подбирается под самое длинное слово
    function fitName() {
      if (!words.length) return;
      name.style.fontSize = "100px";
      var widest = 0;
      Array.prototype.forEach.call(name.querySelectorAll(".ed-word"), function (w) {
        widest = Math.max(widest, w.getBoundingClientRect().width);
      });
      var share = parseFloat(getComputedStyle(name).getPropertyValue("--ed-name-h")) || 0.26;
      var byWidth = 100 * name.clientWidth / (widest || 1);
      var byHeight = window.innerHeight * share / (words.length * 0.94);
      name.style.fontSize = Math.max(28, Math.floor(Math.min(byWidth, byHeight))) + "px";
    }
    window.addEventListener("resize", fitName);
    setTimeout(fitName, 0);

    // Лёгкий параллакс круга за курсором
    window.addEventListener("pointermove", function (e) {
      main.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
      main.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
    }, { passive: true });

    main.className = "ed" + (cfg.demo ? " has-banner" : "");
    return [
      banner(),
      el("header", { class: "ed-top" }, [
        el("span", { class: "ed-mast", text: company || L.cardWord }),
        el("div", { class: "ed-tools" }, [
          el("button", { type: "button", class: "ed-link", id: "share", text: L.share, onclick: share }),
          el("button", { type: "button", class: "ed-link", id: "show-qr", text: L.showQr, onclick: openQr }),
        ]),
      ]),
      el("div", { class: "ed-hero" }, [
        el("div", { class: "ed-art" }, [fillPortrait(el("div", { class: "ed-disc" }))]),
        name,
        title ? el("p", { class: "ed-role", text: title }) : null,
        bio ? el("p", { class: "ed-bio", text: bio }) : null,
      ]),
      el("div", { class: "ed-side" }, [
        contactList.length ? el("ol", { class: "ed-list" }, contactList.map(function (c, i) {
          return el("li", { style: "--i:" + i }, [el("a", linkAttrs(c, "ed-row", c.external), [
            el("span", { class: "ed-num", text: (i < 9 ? "0" : "") + (i + 1) }),
            el("span", { class: "ed-label", text: c.label }),
            el("span", { class: "ed-value", text: c.value }),
            iconNode("chevron"),
          ])]);
        })) : null,
        linkList.length ? el("nav", { class: "ed-links", "aria-label": L.linksTitle }, linkList.map(function (l) {
          return el("a", linkAttrs(l, "", true), [el("span", { text: l.label })]);
        })) : null,
        saveButton("ed-save", "chevron"),
      ]),
    ];
  }

  /* ===== Золото: ар-деко, портрет в арке, рамка ===== */
  function renderLuxe(main, contactList, linkList) {
    main.className = "lx" + (cfg.demo ? " has-banner" : "");
    return [
      banner(),
      el("div", { class: "lx-frame" }, [
        el("div", { class: "lx-arch" }, [fillPortrait(el("div", { class: "lx-arch-in" }))]),
        title ? el("p", { class: "lx-eyebrow", text: title }) : null,
        fullName ? el("h1", { class: "lx-name", text: fullName }) : null,
        el("div", { class: "lx-orn", "aria-hidden": "true" }, [el("span"), el("i"), el("span")]),
        company ? el("p", { class: "lx-company", text: company }) : null,
        bio ? el("p", { class: "lx-bio", text: bio }) : null,
        saveButton("lx-save"),
        contactList.length ? el("div", { class: "lx-grid" }, contactList.map(function (c, i) {
          var a = el("a", linkAttrs(c, "lx-tile", c.external), [iconNode(c.icon), el("span", { text: c.label })]);
          a.style.setProperty("--i", i);
          return a;
        })) : null,
        linkList.length ? el("nav", { class: "lx-links", "aria-label": L.linksTitle }, linkList.map(function (l, i) {
          var a = el("a", linkAttrs(l, "lx-ico", true), [iconNode(l.icon)]);
          a.setAttribute("aria-label", l.aria || l.label);
          a.setAttribute("title", l.label);
          a.style.setProperty("--i", i);
          return a;
        })) : null,
        el("div", { class: "lx-tools" }, toolButtons("lx-tool")),
      ]),
    ];
  }

  /* ===== Аврора: контакты на орбите вокруг портрета, стеклянный док ===== */
  function renderAurora(main, contactList, linkList) {
    var stage = el("div", { class: "au-stage" }, [
      el("div", { class: "au-orbit" }, [
        el("div", { class: "au-path", "aria-hidden": "true" }),
        fillPortrait(el("div", { class: "au-avatar" })),
        el("div", { class: "au-ring" }, contactList.map(function (c, i) {
          var a = el("a", linkAttrs(c, "au-sat", c.external), [el("span", { class: "au-sat-in", icon: c.icon })]);
          a.setAttribute("aria-label", c.label);
          a.setAttribute("title", c.label);
          a.style.setProperty("--a", (-45 + i * 360 / contactList.length) + "deg");
          a.style.setProperty("--i", i);
          return a;
        })),
      ]),
      el("div", { class: "au-text" }, [
        title ? el("p", { class: "au-eyebrow", text: title }) : null,
        fullName ? el("h1", { class: "au-name", text: fullName }) : null,
        company ? el("p", { class: "au-company", text: company }) : null,
        bio ? el("p", { class: "au-bio", text: bio }) : null,
        saveButton("au-save"),
      ]),
      el("div", { class: "au-tools" }, toolButtons("au-tool")),
    ]);

    // Свечение, следующее за курсором (на компьютере)
    window.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      stage.style.setProperty("--mx", (e.clientX - r.left) + "px");
      stage.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });

    main.className = "au" + (cfg.demo ? " has-banner" : "");
    return [
      banner(),
      stage,
      linkList.length ? el("nav", { class: "au-dock", "aria-label": L.linksTitle }, linkList.map(function (l, i) {
        var a = el("a", linkAttrs(l, "au-dock-item", true), [iconNode(l.icon), el("span", { text: l.label })]);
        a.style.setProperty("--i", i);
        return a;
      })) : null,
    ];
  }

  function render() {
    var main = document.getElementById("card");
    var renderers = { classic: renderClassic, editorial: renderEditorial, luxe: renderLuxe, aurora: renderAurora };
    var parts = renderers[variant](main, collectContacts(), collectLinks());
    main.replaceChildren.apply(main, parts.filter(Boolean));
    main.removeAttribute("aria-busy");
  }

  render();
})();
