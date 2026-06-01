# 🏆 Malabo WC2026 — Setup Guide

> Follow these steps once to connect the website to Google Sheets and publish it on GitHub Pages.

---

## Overview

| Component | What it does |
|---|---|
| **Google Sheet** | Stores player entries (`Players` tab) and tournament results (`Results` tab) |
| **Google Apps Script** | A tiny free API that reads/writes the Sheet from the website |
| **MalaboWC26.html** | The website — reads the leaderboard, accepts form submissions |
| **GitHub Pages** | Free hosting for the HTML file |

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a **New Spreadsheet**
2. Name it: **`Malabo WC2026`**
3. Create **two tabs** by right-clicking the default "Sheet1" tab at the bottom:

---

### Tab 1 — Rename to `Players`

Set up these headers in **Row 1**:

| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | Name | Title Contender | Dark Horse | Underdog |

> Leave all other rows empty — the website will fill them in automatically as players submit entries.

---

### Tab 2 — Rename to `Results`

Set up these headers in **Row 1**:

| A | B |
|---|---|
| Team | Stage |

**Stage codes to use** (you update this tab as the tournament progresses):

| Code | Meaning |
|------|---------|
| `R32` | Knocked out in Round of 32 |
| `R16` | Reached Round of 16 |
| `QF` | Reached Quarter Final |
| `SF` | Reached Semi Final |
| `RU` | Runner-Up (lost the final) |
| `CH` | 🏆 Champion |

**Example — fill in as results come in:**

| Team | Stage |
|------|-------|
| Spain | CH |
| France | RU |
| England | SF |
| Brazil | QF |

> Scores on the leaderboard update automatically within 60 seconds of you saving a change here.

---

### Get your Sheet ID

Look at the URL when your sheet is open:

```
https://docs.google.com/spreadsheets/d/  THIS_IS_YOUR_SHEET_ID  /edit
```

Copy and save that ID — you'll need it in the next step.

---

### Set sharing

Click **Share** (top right) → **Change to anyone with the link** → **Viewer** → Done.

---

## Step 2 — Create the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. A new tab opens with `Code.gs`
3. **Delete all existing code**
4. **Paste the full contents** of [`Code.gs`](./Code.gs) from this project
5. Find this line near the top and replace the placeholder:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   ```
   Replace with your actual Sheet ID:
   ```javascript
   const SHEET_ID = 'abc123xyz...';
   ```
6. Click **Save** (💾 or Ctrl+S / Cmd+S)

---

### Deploy as a Web App

1. Click **Deploy → New Deployment**
2. Click the **⚙️ gear icon** next to "Select type" → choose **Web app**
3. Fill in the settings:
   - **Description**: `Malabo WC2026 API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. A permissions dialog will appear — click **Authorize access** → choose your Google account → click **Allow**
6. Your **Web App URL** is now shown — it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. **Copy this URL** — you need it in the next step.

> ⚠️ **Important**: Every time you edit `Code.gs`, you must create a **New Deployment** (not "Manage deployments" > Redeploy, which reuses old code). Always use **Deploy → New Deployment** to get fresh code running.

---

## Step 3 — Configure the HTML

Open `MalaboWC26.html` in a text editor and find this line near the bottom of the file (inside the `<script>` block):

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

Replace it with your Web App URL:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

Save the file. The yellow warning banner will disappear and the leaderboard + form will now work.

---

## Step 4 — Publish to GitHub Pages

### First-time setup

1. Create a new **public** repository at [github.com/new](https://github.com/new)
   - Suggested name: `malabo-wc2026`
2. Open Terminal and run:
   ```bash
   cd /Users/jerome/worldcup2026
   git init
   git add MalaboWC26.html Code.gs SETUP.md
   git commit -m "Initial commit: Malabo WC2026 competition"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/malabo-wc2026.git
   git push -u origin main
   ```
3. Go to your repo on GitHub → **Settings → Pages**
4. Under **Source**, select branch `main` and folder `/ (root)` → click **Save**
5. Wait ~60 seconds, then your site is live at:
   ```
   https://YOUR_USERNAME.github.io/malabo-wc2026/MalaboWC26.html
   ```

### 💡 Optional — Use a cleaner URL

Rename `MalaboWC26.html` → `index.html` so the site is accessible at the root:
```
https://YOUR_USERNAME.github.io/malabo-wc2026/
```

### Updating the site

After any change to the HTML:
```bash
git add MalaboWC26.html
git commit -m "Update: description of change"
git push
```
GitHub Pages will redeploy automatically within ~60 seconds.

---

## Step 5 — Share the link

Send the GitHub Pages URL to all participants. Anyone with the link can:
- View the live leaderboard
- Submit their picks (until the 10 June 2026 deadline)

You manage everything by editing the **Results tab** in Google Sheets.

---

## Admin Workflow During the Tournament

As matches are played:

1. Open your Google Sheet → **Results** tab
2. Add or update a row: `Team name | Stage code`
3. Save — the leaderboard recalculates automatically for everyone within 60 seconds

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Yellow banner still showing | Make sure `APPS_SCRIPT_URL` in the HTML is replaced with the real URL |
| Leaderboard shows "Error" | Re-check the Apps Script URL; make sure it's deployed with "Anyone" access |
| Form says player already entered | Each player name must be unique — case-insensitive check |
| Code changes not taking effect | You must create a **New Deployment** each time you edit `Code.gs` |
| CORS error in browser console | Re-deploy the Apps Script as a new deployment with "Anyone" access |
| GitHub Pages not updating | Wait 60–90 seconds after `git push`; check the Actions tab for build status |

---

## File Summary

| File | Purpose |
|---|---|
| `MalaboWC26.html` | The website — host this on GitHub Pages |
| `Code.gs` | Google Apps Script — paste into Apps Script editor |
| `SETUP.md` | This guide |
