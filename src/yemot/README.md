# תיעוד מודול API - ימות המשיח

## הגדרות בסיסיות
```
type=api
api_link=https://example.com/YemotApi
api_method=GET
```

## הבהרה חשובה - תשובות מהשרת

כאשר מגדירים בקובץ `config.txt`:
```
api_answer_OK=go_to_folder=/1
api_answer_ERROR=go_to_folder=hangup
```

השרת צריך להחזיר **בדיוק** את אחת מהתשובות הבאות:
- `OK` - בדיוק כך, ללא תוספות
- `ERROR` - בדיוק כך, ללא תוספות

לא להחזיר:
- ❌ `api_answer_OK`
- ❌ `api_answer_ERROR`
- ❌ תשובה בפורמט JSON
- ❌ תשובות עם תוספות אחרות

דוגמה לקוד שרת תקין ב-Google Apps Script:
```javascript
function doGet(e) {
  const ApiPhone = e.parameter.ApiPhone;
  
  if (!ApiPhone) {
    return ContentService.createTextOutput("ERROR");
  }

  // בדיקת המספר בגיליון
  if (/* המספר נמצא */) {
    return ContentService.createTextOutput("OK");
  }
  
  return ContentService.createTextOutput("ERROR");
}
```

## פרמטרים שנשלחים לשרת
- `ApiPhone` - מספר הטלפון של המתקשר
- `ApiDID` - מספר הטלפון של המערכת
- `ApiCallId` - מזהה ייחודי לשיחה
- `ApiExtension` - השלוחה הנוכחית
- `ApiTime` - זמן בשניות מ-1970 