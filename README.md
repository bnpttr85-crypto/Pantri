# Pantry Pal (Stockd)

Smart pantry management app with recipe matching, barcode scanning, and grocery list generation.

## Features

- 📦 **Pantry Management** - Track all your ingredients
- 🍳 **Recipe Matching** - Find recipes based on what you have
- 📱 **Barcode Scanning** - Scan products to add to pantry
- 🛒 **Smart Grocery Lists** - Auto-generate shopping lists
- 🧂 **Spice Rack** - Track your spice collection
- 💰 **Budget Tracking** - Monitor food spending
- 📥 **Recipe Import** - Import recipes from URLs

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Netlify

### Option A: One-Click Deploy (Easiest)

1. Push to GitHub first (see below)
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click **"Add new site"** → **"Import an existing project"**
4. Select **GitHub** and authorize
5. Choose your repository
6. Netlify auto-detects settings from `netlify.toml`
7. Click **"Deploy site"**

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize project (run in project folder)
netlify init

# Deploy to preview URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Option C: Drag & Drop

1. Run `npm run build` locally
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag your `.next` folder to deploy

---

## Push to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Login to GitHub CLI
gh auth login

# Create repo and push
gh repo create stockd --public --source=. --push
```

---

## Environment Variables

For Spoonacular API (online recipe search):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SPOONACULAR_API_KEY` | Get free key at [spoonacular.com](https://spoonacular.com/food-api) |

Add in Netlify: Site Settings → Environment Variables

---

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Home page
│   ├── pantry/         # Pantry management
│   ├── recipes/        # Recipe browser
│   ├── barcode/        # Barcode scanner
│   ├── lists/          # Grocery lists
│   ├── spices/         # Spice rack
│   └── ...
├── components/         # Reusable components
├── context/           # React context (app state)
├── data/              # Static data (recipes, ingredients)
├── types/             # TypeScript types
└── utils/             # Utility functions
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Barcode:** Quagga2 + Native BarcodeDetector API
- **OCR:** Tesseract.js (receipt scanning)

---

## License

MIT
