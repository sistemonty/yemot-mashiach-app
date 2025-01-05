/**
 * בדיקת מספר טלפון מול רשימה בגיליון
 */

// מזהה הגיליון
const SPREADSHEET_ID = '1sV564Vfd6Uy7FzGaa68h9V3-YOSNoorzSrp_V35tK8Y';
const CACHE_TIME = 21600; // 6 שעות בשניות
const CACHE_KEY = 'authorized_numbers';

function doGet(e) {
  // בדיקה אם זו בקשת API
  if (e?.parameter?.ApiPhone) {
    try {
      // ניקוי מספר הטלפון
      var phone = e.parameter.ApiPhone.replace(/[^0-9]/g, '');
      if (phone.startsWith('972')) phone = phone.substring(3);
      if (phone.startsWith('0')) phone = phone.substring(1);
      
      // בדיקה מול הגיליון
      var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
      var numbers = sheet.getRange('A:A').getValues();
      
      // חיפוש המספר
      for (var i = 0; i < numbers.length; i++) {
        if (!numbers[i][0]) continue;
        var cleanNum = numbers[i][0].toString().replace(/[^0-9]/g, '');
        if (cleanNum.startsWith('972')) cleanNum = cleanNum.substring(3);
        if (cleanNum.startsWith('0')) cleanNum = cleanNum.substring(1);
        
        if (cleanNum === phone) {
          return ContentService.createTextOutput('api_answer_OK')
            .setMimeType(ContentService.MimeType.RAW);
        }
      }
      
      return ContentService.createTextOutput('api_answer_ERROR')
        .setMimeType(ContentService.MimeType.RAW);
      
    } catch (error) {
      return ContentService.createTextOutput('api_answer_ERROR')
        .setMimeType(ContentService.MimeType.RAW);
    }
  }
  
  // אם אין פרמטר ApiPhone, זו בקשה לדף הניהול
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ניהול מספרים מורשים')
    .setFaviconUrl('https://www.google.com/favicon.ico');
}

// פונקציה לבדיקת התשובה מה-API
function testApi() {
  var url = ScriptApp.getService().getUrl() + "?ApiPhone=037509777";
  var response = UrlFetchApp.fetch(url);
  Logger.log("Status code: " + response.getResponseCode());
  Logger.log("Headers: " + JSON.stringify(response.getAllHeaders()));
  Logger.log("Content: " + response.getContentText());
  return response.getContentText();
}

// פונקציה עוזרת להחזרת טקסט פשוט
function TextOutput(text) {
  var output = ContentService.createTextOutput(text);
  output.setMimeType(ContentService.MimeType.TEXT);
  // מוסיף headers כדי למנוע caching
  output.addHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  output.addHeader('Pragma', 'no-cache');
  output.addHeader('Expires', '0');
  return output;
}

// פונקציה לקבלת המספרים מהקאש או מהגיליון
function getAuthorizedNumbers() {
  var cache = CacheService.getScriptCache();
  var cachedNumbers = cache.get(CACHE_KEY);
  
  if (cachedNumbers != null) {
    return JSON.parse(cachedNumbers);
  }
  
  // אם אין בקאש, קורא מהגיליון
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  
  var numbers = sheet.getRange('A2:A' + lastRow)
    .getValues()
    .flat()
    .filter(n => n) // מסנן תאים ריקים
    .map(n => n.toString().replace(/[^0-9]/g, '')); // מנקה את המספרים
    
  // שומר בקאש
  cache.put(CACHE_KEY, JSON.stringify(numbers), CACHE_TIME);
  
  return numbers;
}

// פונקציה לתיעוד השיחות (אופציונלי)
function logCall(phone, callId, status) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Logs') || 
                SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet('Logs');
    
    sheet.appendRow([
      new Date(), 
      phone, 
      callId, 
      status
    ]);
  } catch (error) {
    console.error('Error logging call:', error);
  }
}

// פונקציה להחזרת כל המספרים
function getNumbers() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  return sheet.getRange('A2:A' + sheet.getLastRow()).getValues().flat();
}

// פונקציה להוספת מספר חדש
function addNumber(number) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  sheet.appendRow([number]);
  // מנקה את הקאש כדי שיתעדכן בפעם הבאה
  CacheService.getScriptCache().remove(CACHE_KEY);
  return true;
}

// פונקציה למחיקת מספר
function deleteNumber(number) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == number) {
      sheet.deleteRow(i + 1);
      // מנקה את הקאש כדי שיתעדכן בפעם הבאה
      CacheService.getScriptCache().remove(CACHE_KEY);
      return true;
    }
  }
  return false;
}

// פונקציה שתרוץ כל שעה
function updateCache() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  
  var numbers = sheet.getRange('A2:A' + lastRow)
    .getValues()
    .flat()
    .filter(n => n)
    .map(n => n.toString().replace(/[^0-9]/g, ''));
    
  CacheService.getScriptCache().put(CACHE_KEY, JSON.stringify(numbers), CACHE_TIME);
}

// פונקציה חדשה לתיעוד בקשות
function logRequest(data) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('log');
    
    // אם הגיליון לא קיים, נייצר אותו עם כותרות
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet('log');
      sheet.appendRow([
        'תאריך ושעה',
        'מספר טלפון',
        'כל הפרמטרים',
        'תוצאה',
        'תשובה שנשלחה'  // עמודה חדשה
      ]);
    }
    
    // הוספת השורה החדשה
    sheet.appendRow([
      data.timestamp,
      data.phone,
      data.allParams,
      data.result,
      data.response || ''  // התשובה ששלחנו
    ]);
  } catch (error) {
    console.error('שגיאה בכתיבת לוג:', error);
  }
}