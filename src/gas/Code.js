/**
 * בדיקת מספר טלפון מול רשימה בגיליון
 */

// מזהה הגיליון
const SPREADSHEET_ID = '1sV564Vfd6Uy7FzGaa68h9V3-YOSNoorzSrp_V35tK8Y';
const WEBHOOK_URL = 'https://hook.integrator.boost.space/7q9am87ltqk52mm49rpp3xecur23a5ci';
const CACHE_KEY = 'PHONE_NUMBERS';
const CACHE_EXPIRATION = 21600; // 6 שעות

function loadPhoneNumbers() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY);
  
  if (cached != null) {
    return JSON.parse(cached);
  }
  
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  var numbers = sheet.getRange('A1:A' + lastRow).getValues();
  var cleanNumbers = [];
  
  for (var i = 0; i < numbers.length; i++) {
    if (!numbers[i][0]) continue;
    var num = numbers[i][0].toString().replace(/[^0-9]/g, '');
    if (num.startsWith('972')) num = num.substring(3);
    if (num.startsWith('0')) num = num.substring(1);
    cleanNumbers.push(num);
  }
  
  cache.put(CACHE_KEY, JSON.stringify(cleanNumbers), CACHE_EXPIRATION);
  return cleanNumbers;
}

function doGet(e) {
  const ApiPhone = e.parameter.ApiPhone;
  
  if (!ApiPhone) {
    return ContentService.createTextOutput("ERROR");
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // חיפוש מספר הטלפון בגיליון
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == ApiPhone) {
      return ContentService.createTextOutput("OK");
    }
  }
  
  return ContentService.createTextOutput("ERROR");
}