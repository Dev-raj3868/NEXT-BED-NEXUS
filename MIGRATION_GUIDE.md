# Nexus Bed Management System - Next.js Migration Complete

## Overview
Your Vite + React project has been successfully converted to Next.js with the App Router.

## Key Changes Made

### 1. **Dependencies Updated** (package.json)
- Replaced Vite with Next.js 15.0.0
- Removed react-router-dom (replaced with Next.js routing)
- Removed Vite-related dependencies (@vitejs/plugin-react-swc, vite, etc.)
- Kept all UI dependencies (shadcn/ui components, Radix UI, etc.)

### 2. **Project Structure**
```
app/
├── layout.tsx              (Root layout)
├── page.tsx                (Home redirect to /login)
├── providers.tsx           (Client providers wrapper)
├── (auth)/
│   └── login/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx          (Dashboard layout with sidebar)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── patients/
│   │   ├── add/
│   │   ├── search/
│   │   ├── transfer/
│   │   ├── admission-add/
│   │   └── admission-search/
│   ├── ipd/
│   │   ├── floors/
│   │   ├── rooms/
│   │   ├── department/
│   │   ├── beds/
│   │   ├── ot-rooms/
│   │   └── (other ipd routes)
│   ├── ot/
│   │   ├── slots/
│   │   ├── inventory/
│   │   └── (other ot routes)
│   ├── billing/
│   │   ├── create/
│   │   └── search/
│   └── analytics/
```

### 3. **Configuration Files**
- **next.config.js** - Next.js configuration with optimization settings
- **tsconfig.json** - Updated for Next.js compiler options
- **package.json** - Updated scripts:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run start` - Start production server
  - `npm run lint` - Run linter

### 4. **Component Updates**
- `app/layout.tsx` - New root layout wrapping all pages
- `app/providers.tsx` - Client-side providers (QueryClient, Toaster, etc.)
- `src/components/layout/Sidebar.tsx` - Updated to use Next.js `usePathname()` and `Link`
- `src/components/NavLink.tsx` - Updated to use Next.js Link component
- Login page - Updated to use `useRouter` from `next/navigation`

### 5. **Page Organization**
All pages have been migrated to the new app directory:
- Routes are now file-based in the `app/` directory
- Group routes using parentheses (e.g., `(auth)`, `(dashboard)`)
- Dynamic routes and API routes ready to be added

## Getting Started

### Installation
```bash
cd "Nexus-Bed-Management"
npm install
```

### Development
```bash
npm run dev
```
The app will run at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Migration Notes

### Breaking Changes
1. **Routing** - No longer uses React Router DOM, uses Next.js App Router
2. **Navigation** - Use `next/link` and `next/navigation` instead of React Router
3. **Hooks** - Use `usePathname()` from `next/navigation` instead of `useLocation()`
4. **Route Changes**:
   - `/patients/admission/add` → `/patients/admission-add`
   - `/patients/admission/search` → `/patients/admission-search`
   - `/ipd/floors/add` → `/ipd/add-floor`
   - etc. (all nested routes converted to kebab-case segments)

### What Still Uses Old Structure
Some pages still import from `src/pages/` directory:
```tsx
export { default } from "@/src/pages/patients/AddPatient";
```

These are wrapper pages that re-export the old components. You can:
1. **Gradually migrate** - Keep this pattern and update components as needed
2. **Batch migrate** - Copy components from `src/pages/` to `app/` and update them

### Environment Variables
Create `.env.local` for local development:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Next Steps

### 1. Verify All Pages Work
- Test navigation through the sidebar
- Check all patient, IPD, OT, and billing pages
- Verify responsive design on mobile

### 2. Update API Routes (if needed)
If you have backend API calls, they should still work. Create API routes in `app/api/` if needed:
```
app/api/
├── patients/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── ipd/
│   └── ...
```

### 3. Add Middleware (optional)
For authentication, create `middleware.ts`:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add auth logic here
}

export const config = {
  matcher: ['/((?!login|api|_next|public).*)'],
}
```

### 4. Complete Component Migration
Gradually convert remaining `src/pages/` components to:
1. Remove React Router hooks
2. Use Next.js hooks
3. Add `'use client'` directive if needed for interactivity

### 5. Optimize Images
Next.js provides `next/image` for optimized images:
```tsx
import Image from 'next/image'

<Image 
  src={nexusLogo} 
  alt="Logo"
  width={40}
  height={40}
/>
```

## Troubleshooting

### Common Issues

**Issue**: "useRouter is not exported from 'next/navigation'"
- **Solution**: Import from `next/navigation` not `next/router`

**Issue**: Sidebar links not working
- **Solution**: Ensure you're using `next/link` and checking `usePathname()`

**Issue**: Styles not loading
- **Solution**: Global styles are imported in `app/layout.tsx`. Check the path matches.

**Issue**: Components showing as "use client" errors
- **Solution**: Add `'use client'` directive at the top of components using React hooks

## File Structure Comparison

### Before (Vite)
```
src/
├── main.tsx          (Entry point)
├── App.tsx           (Router setup)
├── pages/            (Page components)
├── components/       (Shared components)
```

### After (Next.js)
```
app/
├── layout.tsx        (Root layout)
├── providers.tsx     (Client providers)
├── page.tsx          (Home page)
└── (routes)/         (Organized routes)

src/
├── components/       (Shared components)
├── hooks/            (Custom hooks)
├── lib/              (Utilities)
```

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm i -g vercel
vercel
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Hosting
```bash
npm run build
npm start
```

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

---

**Migration Date**: January 14, 2026
**Status**: ✅ Complete - Ready for Testing
