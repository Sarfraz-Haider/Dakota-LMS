# Dakota LMS - Leave Management System

A complete leave management system for Dakota, connected to Google Sheets as the backend database.

## Features
- Employee leave requests (Annual, Casual, Sick, Bereavement, Maternity/Paternity)
- Manager/Lead approval workflow
- Live leave balance tracking (14 Annual, 10 Casual, 10 Sick)
- Edit & delete requests (Managers/Leads)
- Policy FAQ (offline, no API needed)
- Role-based access (Manager → Lead → Employee)
- Password protection for Managers & Leads
- All data syncs with your existing Google Sheet

## Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
1. Create a new GitHub repository (e.g., `dakota-lms`)
2. Upload these files to the repository (or use git):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/dakota-lms.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `dakota-lms` repository
4. Framework Preset: **Vite**
5. Click "Deploy"
6. Wait ~1 minute for build to complete
7. Your app is live at `dakota-lms-xxx.vercel.app`!

### Step 3: Share with your team
Send the Vercel URL to your team. That's it!

## Google Apps Script Setup (already done)
The Apps Script is already deployed and connected. If you need to update it:
1. Open your Google Sheet → Extensions → Apps Script
2. The script connects to the "Form Responses 1" tab
3. Any changes require a new deployment (Deploy → New Deployment)

## Default Password
- Managers & Leads: `dakota2026`
- Regular employees: No password needed

## Tech Stack
- React 18 + Vite
- Google Apps Script (free backend)
- Vercel (free hosting)
- Total cost: $0
