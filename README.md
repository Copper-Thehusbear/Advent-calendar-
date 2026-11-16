# CRABMAS — 24 Days With My Little Frog 🐸🦀

A personal Christmas advent calendar website, made with love.

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ENTRY_PASSWORD` | Magic words James types to enter |
| `ADMIN_PASSWORD` | Your admin panel password |
| `JWT_SECRET` | Random string for session tokens (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config (from Firebase Console → Project Settings) |
| `FIREBASE_PROJECT_ID` | Firebase project ID (server-side) |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database** (start in production mode)
4. Go to **Project Settings → Service accounts** → Generate new private key
5. Add Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // All access via Admin SDK only
    }
  }
}
```

### 4. Deploy to Vercel

```bash
npx vercel
```

Add all env vars in Vercel Dashboard → Settings → Environment Variables.

## Pages

| Route | Description |
|---|---|
| `/` | Secret entrance — James types the magic words |
| `/calendar` | 24-box advent calendar grid |
| `/day/[1-24]` | Each day's surprise card |
| `/admin` | Admin panel — edit cards, see what James opened |

## Admin Panel

Go to `/admin` and enter your `ADMIN_PASSWORD`. From there you can:
- Edit the message, title, emoji for any day
- Change card type (love note, memory, coupon, poem)
- Add an image URL
- See which days James has opened and when

Cards default to the built-in content in `src/lib/constants.ts`. Saving from admin stores overrides in Firebase.

## Features

- 🔒 Server-side date locking (Thai timezone) — can't be bypassed
- 🐸 Frog cursor Easter egg follows the mouse
- 🔔 Bell chime plays on card opening
- ✨ Confetti burst on open
- ⏱ Countdown to next day
- 📱 Mobile-first, works on iPhone
- 🎄 Day 9 special anniversary moment
- ❤️ Day 24 Christmas Eve finale
