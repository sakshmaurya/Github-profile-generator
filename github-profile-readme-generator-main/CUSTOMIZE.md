# 🎨 Customization Guide

Is file ko follow karke project ko apna banao. Niche diye gaye placeholders ko apni details se replace karo.

---

## 📝 Required Information

Apni yeh details ready rakho:

- **Your Name**: Tumhara naam (e.g., "John Doe")
- **GitHub Username**: Tumhara GitHub username (e.g., "johndoe123")
- **Repository Name**: Tumhara repo ka naam (e.g., "my-readme-generator")
- **Website URL**: Tumhari website (agar hai, e.g., "https://johndoe.com")
- **Twitter Username**: Tumhara Twitter handle (e.g., "johndoe")
- **LinkedIn Username**: Tumhara LinkedIn username (e.g., "johndoe")

---

## 🔧 Files to Customize

### 1. package.json
**Location**: `package.json`

**Replace**:
```json
"author": "YOUR_NAME <your.email@example.com>"
```
**With**:
```json
"author": "John Doe <john.doe@example.com>"
```

---

### 2. README.md
**Location**: `README.md`

**Replace**:
- `YOUR_USERNAME` → Tumhara GitHub username
- `YOUR_REPO` → Tumhara repository name

**Example**:
```markdown
git clone https://github.com/johndoe123/my-readme-generator.git
cd my-readme-generator
```

---

### 3. src/app/layout.tsx
**Location**: `src/app/layout.tsx`

**Replace**:
```typescript
authors: [{ name: 'YOUR_NAME', url: 'https://github.com/YOUR_USERNAME' }],
creator: 'YOUR_NAME',
publisher: 'YOUR_NAME',
metadataBase: new URL('https://your-domain.com/'),
```

**With**:
```typescript
authors: [{ name: 'John Doe', url: 'https://github.com/johndoe123' }],
creator: 'John Doe',
publisher: 'John Doe',
metadataBase: new URL('https://johndoe.com/'),
```

**Also replace**:
- `https://your-domain.com/` → Tumhari website URL
- `@YOUR_USERNAME` → Tumhara Twitter handle (e.g., `@johndoe`)

---

### 4. src/app/sitemap.ts
**Location**: `src/app/sitemap.ts`

**Replace**:
```typescript
const baseUrl = 'https://your-domain.com';
```

**With**:
```typescript
const baseUrl = 'https://johndoe.com';
```

---

### 5. src/app/robots.ts
**Location**: `src/app/robots.ts`

**Replace**:
```typescript
const baseUrl = 'https://your-domain.com';
```

**With**:
```typescript
const baseUrl = 'https://johndoe.com';
```

---

### 6. src/lib/markdown-generator.ts
**Location**: `src/lib/markdown-generator.ts`

**Replace**:
```typescript
src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/master/src/images/icons/Social/${icon}"
```

**With**:
```typescript
src="https://raw.githubusercontent.com/johndoe123/my-readme-generator/master/src/images/icons/Social/${icon}"
```

---

### 7. src/components/layout/footer.tsx
**Location**: `src/components/layout/footer.tsx`

**Replace**:
- `YOUR_USERNAME` → Tumhara GitHub username
- `YOUR_REPO` → Tumhara repository name
- `YOUR_NAME` → Tumhara naam
- `https://twitter.com/YOUR_USERNAME` → Tumhara Twitter URL
- `https://linkedin.com/in/YOUR_USERNAME` → Tumhara LinkedIn URL

**Example**:
```tsx
href="https://github.com/johndoe123/my-readme-generator"
href="https://github.com/johndoe123"
href="https://twitter.com/johndoe"
href="https://linkedin.com/in/johndoe"
Made with ❤️ by John Doe
```

---

## 🚀 Optional Customizations

### env.example (Environment Variables)
**Location**: `env.example`

Agar tum Google Analytics use karna chahte ho:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

Phir file ko rename karo:
```bash
cp env.example .env.local
```

---

## 📊 Optional: Update Example Pages

Agar tum chahte ho ki example pages mein bhi tumhara username dikhe, toh yeh files update kar sakte ho:

### src/app/addons/page.tsx
- `rahuldkjain` → Tumhara GitHub username

### src/app/about/page.tsx
- `rahuldkjain` → Tumhara GitHub username
- GitHub badges URLs update karo

### src/markdown-pages/addons.md
- Example stats mein `rahuldkjain` → Tumhara username

### src/markdown-pages/about.md
- Badges aur examples update karo

### src/markdown-pages/support.md
- Donation links remove karo ya apne links se replace karo

### src/app/support/page.tsx
- Donation links remove karo ya apne links se replace karo

### src/components/ui/github-stats.tsx
- GitHub API repo URL update karo

### src/components/ui/buy-me-coffee.tsx
- Buy Me a Coffee widget ID update karo ya remove karo

---

## ✅ Quick Checklist

- [ ] package.json - Author name/email
- [ ] README.md - GitHub username & repo name
- [ ] src/app/layout.tsx - All metadata
- [ ] src/app/sitemap.ts - Base URL
- [ ] src/app/robots.ts - Base URL
- [ ] src/lib/markdown-generator.ts - Social icon CDN
- [ ] src/components/layout/footer.tsx - All links
- [ ] env.example → .env.local (optional)
- [ ] Example pages (optional)

---

## 🎯 After Customization

1. **Test locally**:
```bash
npm run dev
```

2. **Build for production**:
```bash
npm run build
```

3. **Deploy to GitHub Pages/Vercel/Netlify**

4. **Update GitHub repository**:
   - Repository description
   - Repository website URL
   - Topics/tags

---

## 💡 Tips

- Agar tumhari website nahi hai, toh `https://your-domain.com` ko `https://YOUR_USERNAME.github.io/YOUR_REPO` se replace kar sakte ho
- Donation links remove karne ke liye, un components ko comment out kar sakte ho
- Example pages mein tumhara username dikhane se project zyada professional lagega

---

## 🆘 Need Help?

Agar koi issue aaye:
1. Check karo ki saare placeholders replace hue hain ya nahi
2. Console mein errors check karo
3. GitHub issues check karo

---

**Happy Customizing! 🎉**
