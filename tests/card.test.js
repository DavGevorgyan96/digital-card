// Запуск: node --test tests/
// Без зависимостей: используется встроенный в Node тест-раннер.
const test = require("node:test");
const assert = require("node:assert/strict");
const vcard = require("../js/vcard.js");
const qr = require("../js/qr.js");

const base = {
  person: { firstName: "Արամ", lastName: "Петросян", title: "Директор; основатель", company: "ООО «Ромашка, Лтд»" },
  contacts: { phone: "+374 (99) 12-34-56", email: "aram@example.com" },
  links: { website: "https://example.com/?a=1,2;b" },
  address: { street: "ул. Абовяна, 1\nофис 5", city: "Երևան", region: "", postalCode: "0001", country: "Армения" },
};

function unfold(text) { return text.replace(/\r\n /g, ""); }

test("vCard 3.0: структура, CRLF, обязательные поля", () => {
  const v = vcard.build(base);
  assert.ok(v.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n"));
  assert.ok(v.endsWith("END:VCARD\r\n"));
  assert.equal(v.replace(/\r\n/g, "").includes("\n"), false, "только CRLF");
  const lines = unfold(v).split("\r\n");
  assert.ok(lines.includes("N:Петросян;Արամ;;;"));
  assert.ok(lines.includes("FN:Արամ Петросян"));
  assert.ok(lines.includes("TEL;TYPE=CELL,VOICE:+37499123456"));
  assert.ok(lines.includes("EMAIL;TYPE=INTERNET:aram@example.com"));
});

test("vCard: экранирование ; , \\ и переносов строк", () => {
  const lines = unfold(vcard.build(base)).split("\r\n");
  assert.ok(lines.includes("TITLE:Директор\\; основатель"));
  assert.ok(lines.includes("ORG:ООО «Ромашка\\, Лтд»"));
  assert.ok(lines.includes("ADR;TYPE=WORK:;;ул. Абовяна\\, 1\\nофис 5;Երևան;;0001;Армения"));
  assert.ok(lines.includes("URL:https://example.com/?a=1,2;b"), "URL не экранируется");
  assert.equal(vcard.escapeText("a\\b"), "a\\\\b");
});

test("vCard: строки не длиннее 75 октетов, UTF-8 не разрывается", () => {
  const long = { person: { firstName: "Имя", lastName: "Фамилия", title: "Очень длинная должность ".repeat(8) + "Հայերեն տեքստ ".repeat(6) + "🙂🙂🙂" } };
  const v = vcard.build(long);
  for (const line of v.split("\r\n")) {
    assert.ok(Buffer.byteLength(line, "utf8") <= 75, `длина строки: ${Buffer.byteLength(line, "utf8")}`);
  }
  // Круговая проверка: байты → UTF-8 → разворачивание даёт исходный текст без искажений
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.from(v, "utf8"));
  assert.ok(unfold(decoded).includes("TITLE:" + long.person.title.trim()));
});

test("vCard: пустые поля не попадают в файл", () => {
  const v = vcard.build({ person: { firstName: "A", lastName: "B" }, contacts: {}, links: {}, address: { street: "", city: "" } });
  for (const key of ["ORG", "TITLE", "TEL", "EMAIL", "URL", "ADR"]) {
    assert.equal(new RegExp("^" + key, "m").test(v), false, key);
  }
});

test("QR: проверка адреса для печати", () => {
  assert.deepEqual(qr.checkUrl("https://card.mydomain.am/"), { ok: true, url: "https://card.mydomain.am/" });
  assert.equal(qr.checkUrl("https://user.github.io/card").ok, true);
  assert.equal(qr.checkUrl("").reason, "empty");
  assert.equal(qr.checkUrl("card.am").reason, "invalid");
  assert.equal(qr.checkUrl("http://card.mydomain.am/").reason, "not-https");
  assert.equal(qr.checkUrl("https://localhost:8080/").reason, "local");
  assert.equal(qr.checkUrl("https://127.0.0.1/").reason, "local");
  assert.equal(qr.checkUrl("https://192.168.1.5/").reason, "local");
  assert.equal(qr.checkUrl("https://example.com/").reason, "demo");
  assert.equal(qr.checkUrl("https://abc.ngrok-free.app/").reason, "temporary");
});

test("QR: квадратная матрица и SVG с полями 4 модуля", () => {
  const url = "https://card.mydomain.am/";
  const m = qr.matrix(url);
  assert.ok(m.length >= 21 && m.every((row) => row.length === m.length));
  const svg = qr.svg(url);
  const total = m.length + 8;
  assert.ok(svg.includes(`viewBox="0 0 ${total} ${total}"`));
  assert.ok(svg.includes('fill="#ffffff"') && svg.includes('fill="#000000"'));
});
