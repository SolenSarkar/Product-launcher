# GitHub Pages Deployment Plan for Product-launcher

## Steps to Complete:

### 1. Setup Git (if not already)
- [x] Check git status ✓
- [x] git init (already exists)
- [x] Create .gitignore ✓
- [x] Create README.md ✓
- [ ] git add .
- [ ] git commit -m "Add .gitignore, README.md, update TODO"
- [x] Pushed root TODO update

### 2. Connect to Existing Repo (skip, already connected)

### 3. Prepare for GitHub Pages
- [x] Rename landing-page/ to docs/ ✓
  - mkdir docs ✓
  - move landing-page\\* docs\\ ✓
  - rmdir landing-page ✓
- [x] Verify docs/index.html loads locally ✓ (all relative paths work: pure-styles.css, utilities.css, script.js)
- [x] Update paths if needed ✓ (no changes needed)

### 4. Enable Pages & Push
- [x] git add . ✓
- [x] git commit -m "Move to docs/ for GitHub Pages" ✓
- [x] git push ✓
- [ ] Set Pages source to main:/docs in GitHub Settings (do in browser: repo Settings > Pages > Source: main/docs)

### 5. Verify
- [ ] Visit https://solensarkar.github.io/Product-launcher/
- [ ] Test theme toggle, responsiveness live
