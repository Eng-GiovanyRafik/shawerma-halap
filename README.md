# شاورما حلب — المرحلة الثانية

تمت إضافة:
- Firebase Firestore لحفظ الطلبات.
- Firebase Authentication للوحة الإدارة.
- Admin Dashboard على `/#admin`.
- تغيير حالة الطلب من لوحة الإدارة.
- Capacitor وتجهيز المشروع للتحويل إلى Android.
- ملفات Firebase rules/indexes و`.env.example`.

## 1) Firebase

أنشئ مشروعًا في Firebase، أضف Web App، ثم ضع بياناته في `.env.local` بناءً على `.env.example`.

فعّل:
- Firestore Database
- Authentication > Email/Password

أنشئ مستخدم Admin من Firebase Authentication.

ثم انشر قواعد Firestore:
```bash
npx firebase login
npx firebase deploy --only firestore
```

## 2) تشغيل الموقع

```bash
npm install
npm run dev
```

## 3) لوحة الإدارة

بعد تشغيل الموقع افتح:
`http://localhost:5173/#admin`

سجّل دخول مستخدم الإدارة الذي أنشأته في Firebase Authentication.

## 4) Android APK

ثبّت Android Studio وAndroid SDK، ثم:
```bash
npm install
npm run build
npx cap add android
npm run sync
npm run open:android
```

من Android Studio اختر Build > Generate App Bundle / APK.

> ملاحظة: لا تضع بيانات Firebase السرية أو كلمات مرور الإدارة داخل الكود. إعدادات Web Firebase الموجودة في `.env.local` مخصصة للتطبيق، بينما صلاحيات Firestore هي التي تحمي البيانات.
