/**
 * Онлайн-запись OMG. Studio: Google Apps Script для Google Таблицы.
 *
 * Развёртывание:
 * 1. Создать Google Таблицу → Расширения → Apps Script → вставить этот файл вместо Code.gs.
 * 2. Выбрать функцию setupSheet и нажать «Выполнить» один раз (разрешить доступ).
 * 3. Развернуть → Новое развёртывание → Тип «Веб-приложение» → Запуск от имени «Я» →
 *    Доступ «Все» → скопировать адрес, который заканчивается на /exec.
 * 4. На сайте записать этот адрес в файл .env: VITE_BOOKING_URL=<адрес /exec> и пересобрать сайт.
 * После правки скрипта: Развернуть → Управление развёртываниями → Изменить → Новая версия
 * (адрес не меняется).
 *
 * Лист «Записи», колонки:
 * A Дата (yyyy-MM-dd) | B Время (HH:mm, пусто = весь день) | C Услуга | D Статус |
 * E Имя | F Телефон | G Комментарий | H Создано
 */

var SHEET_NAME = "Записи";
var TZ = "Europe/Moscow";
var HEADERS = ["Дата", "Время", "Услуга", "Статус", "Имя", "Телефон", "Комментарий", "Создано"];
var BUSY_STATUSES = ["занято", "записан"];

// Должны совпадать с WORK_START / WORK_END в src/data/site.ts
var WORK_START = 10;
var WORK_END = 22;
var SLOTS = [];
for (var h = WORK_START; h < WORK_END; h++) {
  SLOTS.push((h < 10 ? "0" : "") + h + ":00");
}

var MAX_LENGTH = 500;

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
  // Текстовый формат: Таблица не превратит даты, время и телефоны с «+» в числа и формулы
  sheet.getRange("A:G").setNumberFormat("@");
  sheet.setFrozenRows(1);
}

function getSheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    setupSheet();
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  }
  return sheet;
}

function normDate_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, TZ, "yyyy-MM-dd");
  return String(value || "").trim();
}

function normTime_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, TZ, "HH:mm");
  var s = String(value || "").trim();
  // «9:00» → «09:00»
  var m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m) return (m[1].length === 1 ? "0" : "") + m[1] + ":" + m[2];
  return s;
}

function normStatus_(value) {
  return String(value || "").trim().toLowerCase();
}

function today_() {
  return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
}

// Занятые слоты с сегодняшнего дня: только дата, время, статус
function readBusy_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var rows = sheet.getRange(2, 1, last - 1, 4).getValues();
  var today = today_();
  var result = [];
  for (var i = 0; i < rows.length; i++) {
    var date = normDate_(rows[i][0]);
    var status = normStatus_(rows[i][3]);
    if (!date || date < today) continue;
    if (BUSY_STATUSES.indexOf(status) === -1) continue;
    result.push({ date: date, time: normTime_(rows[i][1]), status: status });
  }
  return result;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Защита от формул: значения, которые начинаются с = + - @, пишутся как текст
function safe_(value) {
  var s = String(value || "");
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doGet() {
  return json_(readBusy_());
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "Проверьте данные заявки" });
  }

  // Ловушка для ботов
  if (data.website) return json_({ ok: true });

  var date = String(data.date || "").trim();
  var time = String(data.time || "").trim();
  var service = String(data.service || "").trim();
  var name = String(data.name || "").trim();
  var phone = String(data.phone || "").trim();
  var comment = String(data.comment || "").trim();

  var valid =
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    date >= today_() &&
    SLOTS.indexOf(time) !== -1 &&
    service &&
    name &&
    phone &&
    [service, name, phone, comment].every(function (v) {
      return v.length <= MAX_LENGTH;
    });
  if (!valid) return json_({ ok: false, error: "Проверьте данные заявки" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var busy = readBusy_();
    for (var i = 0; i < busy.length; i++) {
      if (busy[i].date === date && (busy[i].time === time || busy[i].time === "")) {
        return json_({ ok: false, error: "Это время уже занято, выберите другое" });
      }
    }
    getSheet_().appendRow([
      safe_(date),
      safe_(time),
      safe_(service),
      "записан",
      safe_(name),
      safe_(phone),
      safe_(comment),
      Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm"),
    ]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
