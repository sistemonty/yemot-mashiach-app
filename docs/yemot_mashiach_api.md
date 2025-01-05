# ימות המשיח - תיעוד API

## תוכן עניינים
1. [הגדרות בסיסיות](#הגדרות-בסיסיות)
2. [שליחת נתונים](#שליחת-נתונים)
3. [קבלת נתונים מהמשתמש](#קבלת-נתונים-מהמשתמש)
4. [תשובות מהשרת](#תשובות-מהשרת)
5. [פעולות מיוחדות](#פעולות-מיוחדות)
6. [לוגים](#לוגים)

## הגדרות בסיסיות

### הגדרת שלוחת API
```
type=api
api_link=https://your-server.com/api-endpoint
```

### שיטות שליחה
- GET (ברירת מחדל)
- POST:
```
api_url_post=yes
```

### תיקיית קבצים
```
api_dir=/path/to/files
```

## שליחת נתונים

### פרמטרים קבועים
```
api_add_0=param1=value1
api_add_1=param2=value2
```

### פרמטרים מובנים
- `ApiCallId` - מזהה שיחה
- `ApiPhone` - מספר טלפון המתקשר
- `ApiDID` - מספר המערכת
- `ApiExtension` - שלוחה נוכחית
- `ApiTime` - זמן Unix

לביטול פרמטר:
```
api_[param_name]_send=no
```

## קבלת נתונים מהמשתמש

### הקשות
```
api_000=ID,yes,max_digits,min_digits,timeout,type,options
```

### הקלטה
```
api_001=RECORDING,yes,record,save_path,filename,options
```

### זיהוי דיבור
```
api_002=VOICE,yes,voice,language,options
```

## תשובות מהשרת

### פוגמאות לתשובות בפורמט טקסט פשוט

#### מעבר לשלוחה
```
go_to_folder=/1/2
```

#### השמעת הודעה ומעבר לשלוחה
```
id_list_message=t-ברוכים הבאים למערכת&go_to_folder=/1/2
```

#### בקשת קלט מהמשתמש
```
read=t-אנא הקש את תעודת הזהות=ID,yes,9,8,7,Number
```

#### ניתוב שיחה
```
routing_yemot=0773137770
```

## פעולות מיוחדות

### סליקת אשראי
```
credit_card=company,amount,store_id,payments,currency
```

### ניתוב שיחה
```
routing=phone_number,options
```

### מוזיקה בהמתנה
```
music_on_hold=file,duration
```

## לוגים

### הגדרות
```
api_log=no  # ביטול לוגים
api_log_no& # ביטול לוג לפעולה ספציפית
```

### מיקום
- נתיב: `/Log/LogApi.ymgr`
- פורמט: 
  - ApiSend: `=` -> `^`, `&` -> `*`
  - ApiAnswer: `,` -> `^`, `&` -> `*` 