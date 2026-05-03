# GitHub Pages Deployment Plan for Product-launcher

## Steps to Complete:

### 1. Setup Git (if not already)
- [ ] Check git status
- [ ] git init (if needed)
- [ ] Create .gitignore
- [ ] Create README.md
- [ ] git add .
- [ ] git commit -m "Initial commit: Product landing page"

### 2. Connect to Existing Repo
- [ ] git remote add origin https://github.com/SolenSarkar/Product-launcher.git
- [ ] git branch -M main
- [ ] git push -u origin main

### 3. Prepare for GitHub Pages
- [ ] Rename landing-page/ to docs/
  - mv landing-page/* docs/
  - rmdir landing-page
- [ ] Update paths in docs/index.html if needed (check relative links)

### 4. Enable Pages
- [ ] Via GitHub web: Settings > Pages > Source: Deploy from branch main /docs folder
- [ ] Or gh pages enable

### 5. Verify
- [ ] Check https://solensarkar.github.io/Product-launcher/
- [ ] Test live site
