# House Grouping App

Small React app (Vite) that groups rows in an uploaded Excel file by house number, adds a Roof count and S.No for each member, and allows downloading the processed workbook.

Prerequisites
- Node.js v16+ and npm installed

Quick start (PowerShell on Windows):

```powershell
cd d:\Voting
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173) in your browser.

Notes
- The project uses plain CSS with a handful of Tailwind-like utility classes included in `src/styles.css` so you don't need Tailwind to run it.
- If you prefer real Tailwind, initialize it and replace `src/styles.css` content with Tailwind's directives.
