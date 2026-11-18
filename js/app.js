/*
 * Отрисовка визитки по данным из config.js.
 * Данные вставляются только как текст (textContent) и проверенные ссылки —
 * HTML из конфига не исполняется.
 */
(function () {
  "use strict";

  var DEFAULT_LABELS = {
    demoBanner: "Демо-данные — замените их в файле config.js",
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
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
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
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = total * scale;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    m.forEach(function (row, r) {
      row.forEach(function (dark, c) {
        if (dark) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      });
    });
    return new Promise(function (resolve) { canvas.toBlob(resolve, "image/png"); });
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
  function tile(href, icon, label, external) {
    return el("a", {
      class: "tile", href: href,
      target: external ? "_blank" : null, rel: external ? "noopener noreferrer" : null,
    }, [iconNode(icon), el("span", { text: label })]);
  }

  function row(href, icon, label, caption, wrapCaption) {
    return el("li", {}, [
      el("a", { class: "row", href: href, target: "_blank", rel: "noopener noreferrer" }, [
        el("span", { class: "row-icon", icon: icon }),
        el("span", { class: "row-text" }, [
          el("span", { class: "row-label", text: label }),
          caption ? el("span", { class: "row-sub" + (wrapCaption ? " wrap" : ""), text: caption }) : null,
        ]),
        (function () { var c = iconNode("chevron"); c.setAttribute("class", "row-chevron"); return c; })(),
      ]),
    ]);
  }

  function render() {
    var main = document.getElementById("card");
    var parts = [];

    if (cfg.demo) parts.push(el("p", { class: "demo-banner", text: L.demoBanner }));
    parts.push(el("div", { class: "cover", "aria-hidden": "true" }));

    // Шапка
    var avatar = el("div", { class: "avatar" });
    if (str(person.photo)) {
      var img = el("img", { src: str(person.photo), alt: fullName, width: "112", height: "112", decoding: "async" });
      img.addEventListener("error", function () { avatar.textContent = initials(); });
      avatar.appendChild(img);
    } else {
      avatar.textContent = initials();
      avatar.setAttribute("aria-hidden", "true");
    }
    var title = str(person.title), company = str(person.company);
    var hero = el("header", { class: "hero" }, [
      avatar,
      fullName ? el("h1", { class: "name", text: fullName }) : null,
      title || company
        ? el("p", { class: "role" }, [
            title ? el("strong", { text: title }) : null,
            company ? el("span", { text: company }) : null,
          ])
        : null,
      str(person.bio) ? el("p", { class: "bio", text: str(person.bio) }) : null,
    ]);
    parts.push(hero);

    // Главное действие
    parts.push(el("div", { class: "section" }, [
      el("button", { type: "button", class: "btn btn-primary", id: "save-contact", onclick: saveContact },
        [iconNode("userPlus"), el("span", { text: L.saveContact })]),
    ]));

    // Связаться
    var tiles = [];
    var tel = window.CardVCard.normalizePhone(contacts.phone);
    if (tel) tiles.push(tile("tel:" + tel, "phone", L.call));
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(contacts.email))) tiles.push(tile("mailto:" + str(contacts.email), "mail", L.email));
    var wa = phoneDigits(contacts.whatsapp);
    if (wa) tiles.push(tile("https://wa.me/" + wa, "whatsapp", L.whatsapp, true));
    var tg = telegramUrl(contacts.telegram);
    if (tg) tiles.push(tile(tg, "telegram", L.telegram, true));
    if (tiles.length) {
      parts.push(el("section", { class: "section", "aria-labelledby": "contact-title" }, [
        el("h2", { class: "section-title", id: "contact-title", text: L.contactTitle }),
        el("div", { class: "tiles" }, tiles),
      ]));
    }

    // Ссылки и адрес
    var rows = [];
    [["instagram", "instagram"], ["facebook", "facebook"], ["linkedin", "linkedin"], ["website", "globe"]].forEach(function (pair) {
      var url = webUrl(links[pair[0]]);
      if (url) rows.push(row(url, pair[1], L[pair[0]], linkCaption(url, pair[0] === "website")));
    });
    var addressText = [address.street, address.city, address.region, address.postalCode, address.country].map(str).filter(Boolean).join(", ");
    if (addressText) {
      var mapUrl = webUrl(address.mapUrl) || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addressText);
      var r = row(mapUrl, "pin", L.address, addressText, true);
      r.querySelector("a").setAttribute("aria-label", L.address + ": " + addressText + ". " + L.openMap);
      rows.push(r);
    }
    if (rows.length) {
      parts.push(el("section", { class: "section", "aria-labelledby": "links-title" }, [
        el("h2", { class: "section-title", id: "links-title", text: L.linksTitle }),
        el("ul", { class: "rows" }, rows),
      ]));
    }

    // Поделиться и QR
    parts.push(el("div", { class: "section actions" }, [
      el("button", { type: "button", class: "btn btn-secondary", id: "share", onclick: share }, [iconNode("share"), el("span", { text: L.share })]),
      el("button", { type: "button", class: "btn btn-secondary", id: "show-qr", onclick: openQr }, [iconNode("qr"), el("span", { text: L.showQr })]),
    ]));

    main.replaceChildren.apply(main, parts);
    main.removeAttribute("aria-busy");
  }

  render();
})();
