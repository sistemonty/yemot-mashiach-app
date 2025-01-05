const express = require('express');
const app = express();

// פונקציה לניקוי מספר טלפון
function cleanPhoneNumber(phone) {
  if (!phone) return '';
  phone = phone.toString().replace(/[^0-9]/g, '');
  if (phone.startsWith('972')) {
    phone = phone.substring(3);
  }
  if (phone.startsWith('0')) {
    phone = phone.substring(1);
  }
  return phone;
}

// נקודת קצה עבור ימות המשיח
app.get('/', (req, res) => {
  const phone = req.query.ApiPhone;
  
  // רשימת מספרים מורשים (בהמשך נחבר לגיליון)
  const allowedNumbers = [
    '527654321',
    '541234567'
  ];
  
  if (!phone) {
    return res.send('blocked');
  }
  
  const cleanPhone = cleanPhoneNumber(phone);
  
  if (!cleanPhone || cleanPhone.length < 8) {
    return res.send('blocked');
  }
  
  // בדיקה אם המספר מורשה
  const isAllowed = allowedNumbers.includes(cleanPhone);
  
  // החזרת תשובה בפורמט שימות המשיח מצפה לו
  return res.send(isAllowed ? 'allowed' : 'blocked');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 