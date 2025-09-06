# SESGRG Website - Vercel Deployment Guide

## 🚀 Vercel এ Deploy করার সহজ পদ্ধতি

### Step 1: GitHub এ Repository তৈরি করুন

1. GitHub এ নতুন repository তৈরি করুন
2. Local repository থেকে GitHub এ push করুন:

```bash
git init
git add .
git commit -m "Initial commit: SESGRG website"
git branch -M main
git remote add origin https://github.com/yourusername/sesgrg-website.git
git push -u origin main
```

### Step 2: Vercel এ Deploy করুন

1. [Vercel.com](https://vercel.com) এ যান
2. GitHub account দিয়ে sign up/login করুন
3. "New Project" button এ click করুন
4. আপনার GitHub repository select করুন
5. Following settings configure করুন:

**Framework Preset:** `Create React App`
**Root Directory:** `./` (keep default)
**Build Command:** `cd frontend && yarn build`
**Output Directory:** `frontend/build`

### Step 3: Environment Variables Setup

Vercel dashboard এ গিয়ে Environment Variables add করুন:

**Production Variables:**
```
REACT_APP_BACKEND_URL=/api
REACT_APP_FIREBASE_API_KEY=AIzaSyAW4GNtIBtQuT-M8TYyoh_4S6HfZkI0m3s
REACT_APP_FIREBASE_AUTH_DOMAIN=sesgrg-website.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=sesgrg-website
REACT_APP_FIREBASE_STORAGE_BUCKET=sesgrg-website.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=665472144837
REACT_APP_FIREBASE_APP_ID=1:665472144837:web:f3432c1363adfaccde27ac
REACT_APP_FIREBASE_MEASUREMENT_ID=G-DT31MZ5G0Q
ADMIN_USERNAME=admin
ADMIN_PASSWORD=@dminsesg705
SECRET_KEY=your-production-secret-key-here
```

### Step 4: Deploy!

1. "Deploy" button এ click করুন
2. Vercel automatically build এবং deploy করবে
3. Deploy complete হলে আপনার website URL পাবেন

## 🔧 Network Error Fix করার জন্য

আপনার যে Network Error আসছিল, সেটা এই changes দিয়ে fix হয়ে যাবে:

### 1. Backend URL Configuration Fixed
- Production এ `/api` relative URL ব্যবহার করবে
- Development এ `http://localhost:8001` ব্যবহার করবে

### 2. CORS Updated
- Production domain গুলো CORS এ allow করা হয়েছে
- Vercel এবং Emergent preview domains included

### 3. Vercel.json Updated
- API routing properly configured
- Frontend এবং Backend একসাথে deploy হবে

## 🎯 Expected Results

Deploy করার পর:
- ✅ Frontend load হবে সমস্যা ছাড়াই
- ✅ API calls কাজ করবে
- ✅ Admin login কাজ করবে
- ✅ All pages responsive থাকবে

## 🛠️ Troubleshooting

**যদি এখনও Network Error আসে:**

1. **Check Environment Variables:**
   - Vercel dashboard এ সব environment variables আছে কিনা check করুন

2. **Check Build Logs:**
   - Vercel dashboard এ build logs check করুন

3. **Check Function Logs:**
   - Serverless function logs check করুন API calls এর জন্য

4. **Force Redeploy:**
   - Vercel dashboard থেকে redeploy করুন

## 📞 Support

কোনো সমস্যা হলে Vercel এর documentation check করুন:
- [Vercel Deployment Guide](https://vercel.com/docs)
- [React Deployment on Vercel](https://vercel.com/guides/deploying-react-with-vercel)

## 🎉 Success!

Deploy successful হলে আপনার website live হবে এবং সব features কাজ করবে exactly যেমন reference website এ আছে!