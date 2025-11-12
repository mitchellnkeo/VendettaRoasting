# Dependency Analysis & Optimization

## Current Situation
- **node_modules size**: ~299MB
- **Direct dependencies**: 16 packages
- **Issue**: Many packages are transitive dependencies (dependencies of dependencies)

## Actually Used Packages (from code analysis)

### ✅ Core Framework (REQUIRED - Cannot Remove)
- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM rendering

### ✅ Actually Used in Code
- `next-auth` - Authentication (used in multiple files)
- `@sanity/client` - Sanity CMS client (used in `src/lib/sanity.ts`)
- `@sanity/image-url` - Sanity image URLs (used in `src/lib/sanity.ts`)
- `sanity` - Sanity Studio (used for `npm run studio` command)
- `@stripe/stripe-js` - Stripe client-side (used in `PaymentForm.tsx`)
- `@stripe/react-stripe-js` - Stripe React components (used in `PaymentForm.tsx`)
- `stripe` - Stripe server-side (used in `src/lib/stripe.ts`)
- `pg` - PostgreSQL client (used in `src/lib/database.ts`)
- `formidable` - File upload parsing (used in `src/pages/api/upload/blob.ts`)
- `@vercel/blob` - Vercel Blob storage (used in `src/lib/blob.ts`)

### ⚠️ Imported But NOT Actually Used
- `bcryptjs` - Imported in auth files but has TODO comments, not actually hashing passwords
- `@types/bcryptjs` - Type definitions for unused package

### ✅ Development Tools (REQUIRED)
- `typescript` - TypeScript compiler
- `@types/node`, `@types/react`, `@types/react-dom` - TypeScript types
- `tailwindcss`, `postcss`, `autoprefixer` - CSS processing
- `eslint`, `eslint-config-next` - Code linting

## Optimization Opportunities

### 1. Remove Unused Packages
**Can be removed:**
- `bcryptjs` - Not actually used (has TODO comments)
- `@types/bcryptjs` - Type definitions for unused package

**Impact**: Small (~2MB), but cleaner codebase

### 2. Make Sanity Studio Optional
**Current**: `sanity` package is always installed (~50MB+ with dependencies)
**Option**: Only install when needed for content editing

**Impact**: Large (~50MB+), but Sanity Studio is only needed for content editing, not for the app to run

### 3. Transitive Dependencies (Cannot Remove)
These are dependencies of dependencies and cannot be directly removed:
- `next` brings in: webpack, babel, swc, etc. (~100MB+)
- `sanity` brings in: many UI libraries, React dependencies (~50MB+)
- `@stripe/react-stripe-js` brings in: React dependencies
- `stripe` brings in: HTTP clients, crypto libraries

## Recommended Actions

### Immediate (Safe to Remove)
1. Remove `bcryptjs` and `@types/bcryptjs` - not actually used
2. Add TODO comment to re-add when password hashing is implemented

### Future Optimization
1. Consider making `sanity` a dev dependency (only needed for Studio)
2. Use `npm ci` instead of `npm install` for faster, reproducible installs
3. Consider using `pnpm` which uses hard links and saves disk space

## Estimated Savings
- Removing `bcryptjs`: ~2MB
- Making `sanity` optional: ~50MB+ (but breaks `npm run studio`)
- **Total possible**: ~52MB (but most of the 299MB is unavoidable transitive deps)

## Reality Check
**Most of the 299MB is unavoidable** because:
- Next.js ecosystem requires webpack, babel, swc (~100MB+)
- React and its dependencies (~50MB+)
- Sanity CMS with all its dependencies (~50MB+)
- Stripe SDKs (~20MB+)
- TypeScript and build tools (~30MB+)
- Other transitive dependencies (~50MB+)

**The real issue is likely iCloud Drive**, not the package count. Moving the project to a local directory will solve the performance issues.

