# 🚀 Mission Control Dashboard - Quick Setup Guide

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **npm or yarn** package manager  
3. **Convex account** (free): https://convex.dev

## ⚡ Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd /home/kunekune/mission-control-dashboard
npm install
```

### Step 2: Setup Convex Backend
```bash
# Install Convex CLI globally (if not installed)
npm install -g convex

# Initialize Convex project (creates deployment)  
npx convex dev
```
- This opens your browser to create/login to Convex account
- Creates a new deployment automatically
- Copies the deployment URL

### Step 3: Configure Environment
```bash
# Edit .env.local with your Convex deployment URL
# (URL provided by previous step)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
```

### Step 4: Start Development Servers

**Terminal 1 - Convex Backend:**
```bash
npx convex dev
```

**Terminal 2 - Next.js Frontend:**  
```bash
npm run dev
```

### Step 5: Access Dashboard
- **Frontend**: http://localhost:3000
- **Convex Dashboard**: https://dashboard.convex.dev

## 🎯 Expected Result

You should see:
- ✅ Mission Control dark theme dashboard
- ✅ Sidebar with navigation items
- ✅ Top metrics bar (0 tasks initially)
- ✅ 5-column Kanban board (Recurring, Backlog, In Progress, Review, Done)
- ✅ Real-time connection to Convex

## 📊 Adding Sample Data

### Via Convex Dashboard:
1. Open https://dashboard.convex.dev
2. Navigate to your deployment  
3. Go to "Data" tab
4. Add sample users, projects, tasks

### Via Code (Optional):
```typescript
// Add seed data script in convex/seed.ts
```

## 🎨 Features Overview

### ✅ Completed Features:
- **Responsive Design**: Desktop, tablet, mobile
- **Dark Theme**: Mission Control aesthetic
- **Real-time Database**: Powered by Convex  
- **Kanban Board**: 5-column task management
- **Metrics Dashboard**: Live task statistics
- **Task Cards**: Priority, assignee, due dates
- **Project Organization**: Color-coded projects
- **TypeScript**: Full type safety

### 🔄 Next Steps (Optional):
- Add drag & drop functionality (@dnd-kit)
- Implement task creation modal
- Add user authentication  
- Deploy to Vercel/Netlify

## 🚀 Deployment

### Convex Production:
```bash
npx convex deploy --prod
```

### Vercel Deployment:
```bash
npm install -g vercel
vercel
# Set NEXT_PUBLIC_CONVEX_URL in Vercel dashboard
```

## 🛠️ Development Tips

### File Structure:
```
src/
├── components/
│   ├── dashboard/     # Kanban, metrics, task cards
│   └── ui/           # Reusable components (Sidebar)
├── app/              # Next.js pages
└── types/            # TypeScript definitions

convex/
├── schema.ts         # Database schema
├── tasks.ts          # Task CRUD operations  
├── users.ts          # User management
└── projects.ts       # Project management
```

### Key Commands:
```bash
npm run dev          # Start Next.js
npx convex dev       # Start Convex backend
npx convex dashboard # Open Convex dashboard
npm run build        # Production build
```

## 🎯 Customization

### Colors (tailwind.config.js):
```javascript
colors: {
  'mission': {
    'dark': '#0a0a0b',    // Main background
    'gray': '#1a1a1b',    // Sidebar
    'blue': '#3b82f6',    // Accents
    // ... customize as needed
  }
}
```

### Database Schema (convex/schema.ts):
- Add custom fields to tasks
- Create new tables  
- Modify relationships

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot connect to Convex"**
   - Check NEXT_PUBLIC_CONVEX_URL in .env.local
   - Ensure `npx convex dev` is running

2. **"Module not found" errors**
   - Run `npm install` 
   - Check import paths (@ alias points to src/)

3. **TypeScript errors**
   - Run `npx convex dev` to regenerate API types
   - Check convex/_generated/api.d.ts

4. **Styling issues**  
   - Ensure TailwindCSS is properly configured
   - Check globals.css imports

## 📞 Support

If you encounter issues:
1. Check Convex documentation: https://docs.convex.dev
2. Review Next.js docs: https://nextjs.org/docs  
3. Check component props and TypeScript errors

---

**🎉 Enjoy your new Mission Control Dashboard!**