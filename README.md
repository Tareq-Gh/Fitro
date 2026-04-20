# FITRO

AI-powered clothing fit analyzer. Enter your body measurements, describe the garment, and instantly know if it will fit — before you buy.

---

## What It Does

1. You enter your body measurements (chest, waist, hips, etc.)
2. You describe the garment (category, material, fit type, measurements from the label)
3. FITRO calculates the **ease** and returns: `Tight` / `Slightly Tight` / `Perfect Fit` / `Comfortable` / `Loose` / `Oversized`

No accounts needed for fit analysis. Admin login required to view the dashboard.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS v4 |
| Backend | Vercel Serverless Functions (`api/`) |
| Database | MongoDB Atlas |
| Auth | JWT (admin only) |

---

## Local Setup

**Requirements:** Node.js 18+, Vercel CLI

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in MONGODB_URI, JWT_SECRET, ADMIN_USER, ADMIN_PASS

# 3. Run (frontend + api/ together)
vercel dev
```

Vite-only (no API routes): `npm run dev`

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ADMIN_USER` | Admin dashboard username |
| `ADMIN_PASS` | Admin dashboard password |

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the 4 environment variables in project settings
4. Deploy — Vercel auto-serves `api/*.js` as serverless functions

---

## Project Structure

```
??? api/                  Serverless functions
?   ??? _db.js            MongoDB connection (cached)
?   ??? _User.js          Mongoose model
?   ??? _auth.js          JWT verify helper
?   ??? users.js          POST /api/users  ·  GET /api/users
?   ??? auth.js           POST /api/auth
??? src/
?   ??? components/       Navbar, Footer
?   ??? pages/            Landing, Login, UserInfo, Admin
?   ??? services/api.js   Axios client
?   ??? utils/
?       ??? fitAnalyzer.js  Fit calculation engine
??? vercel.json           SPA rewrites
??? .env.example          Env variable template
```

---

## Fit Engine Logic

```
ease = garment_measurement ? body_measurement

? 1 cm   ?  Tight
2–4 cm   ?  Slightly Tight
5–8 cm   ?  Perfect Fit
9–12 cm  ?  Comfortable
13–18 cm ?  Loose
? 19 cm  ?  Oversized
```

Adjustments applied: `denim ?2`, `polyester ?1`, `slim cut ?2`, `oversized cut +3`
