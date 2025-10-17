# Vendetta Roasting Development Roadmap

## Current State Analysis

**✅ What's Already Implemented:**
- Basic Next.js + TypeScript + Tailwind CSS setup
- Custom coffee-themed color palette (coffee, cream variants)
- Responsive layout with Header/Footer components
- Homepage with hero section, featured products, about section
- Shop page with product filtering and mock data
- Subscriptions page with plans and frequency options
- Wholesale page with application form
- Admin dashboard with basic layout and mock data
- NextAuth.js setup with hardcoded admin credentials
- AuthContext for authentication state management

**🔧 What Needs to be Built:**
- Database integration (PostgreSQL)
- Real product management
- Shopping cart functionality
- User accounts and authentication
- Payment processing (Stripe)
- Content management (Sanity CMS)
- Review system
- Order management

---

# **Development Roadmap**

## **Phase 1: Foundation & Database Setup** 
*Small, incremental steps to establish the data layer*

### **Step 1.1: Environment Setup**
- [X] Create `.env.local` file with database credentials
- [X] Add environment variables for NextAuth, database, and future services
- [X] Test that the app still runs with new environment variables

### **Step 1.2: Database Schema Design**
- [X] Design database tables (users, products, orders, reviews, etc.)
- [X] Create SQL migration files
- [X] Set up database connection utility

### **Step 1.3: Basic Database Integration**
- [X] Install and configure database client (Prisma or similar)
- [X] Create initial database schema
- [X] Test database connection
- [X] Create basic CRUD operations for products

---

## **Phase 2: Product Management**
*Build the core e-commerce functionality*

### **Step 2.1: Product Data Migration**
- [X] Replace mock product data with real database queries
- [X] Create product detail pages with dynamic routing
- [X] Add product image handling
- [X] Test product pages load correctly

### **Step 2.2: Product Categories & Filtering**
- [X] Implement category-based filtering
- [X] Add search functionality
- [X] Create product sorting options
- [X] Test filtering and search features

### **Step 2.3: Admin Product Management**
- [X] Create admin interface for adding/editing products
- [X] Add product image upload functionality
- [X] Implement product status management (active/inactive)
- [X] Test admin product management

---

## **Phase 3: User Authentication & Accounts**
*Build the user system*

### **Step 3.1: User Registration**
- [X] Create user registration form
- [X] Implement email/password authentication
- [ ] Add OAuth providers (Google, Facebook)
- [X] Test user registration flow

### **Step 3.2: User Account Pages**
- [X] Create user dashboard
- [X] Add order history page
- [X] Implement account settings
- [X] Test user account functionality

### **Step 3.3: Dynamic Header & Navigation**
- [X] Implement dynamic header for authenticated users
- [X] Show user's name when logged in
- [X] Replace Sign In/Register with Dashboard/Sign Out
- [X] Update mobile navigation with authentication state
- [X] Test dynamic header functionality

### **Step 3.4: Protected Routes**
- [ ] Implement route protection for user accounts
- [ ] Add middleware for authentication
- [ ] Test protected route access

---

## **🎉 Phase 3 Progress Summary**

### **✅ Completed Features:**
- **User Registration & Login** - Complete authentication system with API integration
- **Account Management** - Dashboard, order history, and settings pages
- **Dynamic Navigation** - Header shows user's name when logged in
- **Responsive Design** - All pages work on mobile and desktop
- **Form Validation** - Client and server-side validation
- **Error Handling** - Proper error messages and user feedback
- **Loading States** - User feedback during data operations

### **📊 Current Status:**
- **Step 3.1: User Registration** - 95% complete (OAuth providers optional)
- **Step 3.2: User Account Pages** - 100% complete
- **Step 3.3: Dynamic Header & Navigation** - 100% complete
- **Step 3.4: Protected Routes** - 0% complete (next phase)

### **🚀 Ready for Next Phase:**
Phase 3 is essentially complete! The core user authentication and account management system is fully functional.

---

## **Phase 4: Shopping Cart & Checkout**
*Build the e-commerce core*

### **Step 4.1: Shopping Cart State**
- [ ] Create cart context and state management
- [ ] Implement add/remove/update cart items
- [ ] Add persistent cart storage
- [ ] Test cart functionality

### **Step 4.2: Cart UI Components**
- [ ] Create cart page
- [ ] Add cart sidebar/dropdown
- [ ] Implement cart item management
- [ ] Test cart UI interactions

### **Step 4.3: Checkout Process**
- [ ] Create checkout form
- [ ] Add shipping address management
- [ ] Implement order summary
- [ ] Test checkout flow

---

## **Phase 5: Payment Integration**
*Add Stripe payment processing*

### **Step 5.1: Stripe Setup**
- [ ] Install and configure Stripe
- [ ] Create Stripe API routes
- [ ] Add payment form components
- [ ] Test Stripe integration

### **Step 5.2: Order Processing**
- [ ] Implement order creation
- [ ] Add order confirmation emails
- [ ] Create order tracking
- [ ] Test complete order flow

---

## **Phase 6: Subscription System**
*Build the recurring subscription functionality*

### **Step 6.1: Stripe Billing Setup**
- [ ] Configure Stripe Billing
- [ ] Create subscription plans
- [ ] Implement subscription management
- [ ] Test subscription creation

### **Step 6.2: Subscription Management**
- [ ] Create subscription dashboard
- [ ] Add subscription modification
- [ ] Implement delivery scheduling
- [ ] Test subscription system

---

## **Phase 7: Wholesale Portal**
*Build the B2B functionality*

### **Step 7.1: Wholesale Authentication**
- [ ] Create wholesale user registration
- [ ] Implement wholesale account approval
- [ ] Add wholesale-specific authentication
- [ ] Test wholesale access

### **Step 7.2: Wholesale Features**
- [ ] Create wholesale pricing system
- [ ] Add bulk ordering options
- [ ] Implement Seattle-area shipping restrictions
- [ ] Test wholesale functionality

---

## **Phase 8: Content Management**
*Add CMS integration*

### **Step 8.1: Sanity CMS Setup**
- [ ] Install and configure Sanity
- [ ] Create content schemas
- [ ] Set up Sanity Studio
- [ ] Test CMS integration

### **Step 8.2: Dynamic Content**
- [ ] Replace static content with CMS data
- [ ] Add announcements system
- [ ] Implement events calendar
- [ ] Test dynamic content loading

---

## **Phase 9: Review System**
*Build customer reviews*

### **Step 9.1: Review Database**
- [ ] Create review database schema
- [ ] Implement review submission
- [ ] Add review approval system
- [ ] Test review functionality

### **Step 9.2: Review Display**
- [ ] Add reviews to product pages
- [ ] Create review management for admin
- [ ] Implement review moderation
- [ ] Test review system

---

## **Phase 10: Admin Dashboard**
*Complete the admin interface*

### **Step 10.1: Order Management**
- [ ] Create order management interface
- [ ] Add order status updates
- [ ] Implement order tracking
- [ ] Test admin order management

### **Step 10.2: Analytics & Reporting**
- [ ] Add sales analytics
- [ ] Create customer reports
- [ ] Implement inventory tracking
- [ ] Test admin analytics

---

## **Development Guidelines**

### **Commit Strategy:**
1. **One feature per commit** - Never commit multiple features at once
2. **Test before commit** - Always run `npm run dev` to verify changes
3. **Ask before committing** - I'll always ask for your approval
4. **Small, focused changes** - Each commit should be easily reviewable

### **Testing Protocol:**
1. Make a small change
2. Run `npm run dev`
3. Test the functionality in the browser
4. If it works, ask for commit approval
5. If it doesn't work, fix the issue before proceeding

### **Error Prevention:**
- Always check for TypeScript errors
- Verify imports are correct
- Test database connections before proceeding
- Use environment variables for sensitive data

### **Current Progress Tracking:**
- **Current Phase:** Phase 1 - Foundation & Database Setup
- **Current Step:** Step 1.1 - Environment Setup
- **Last Updated:** [Date will be updated as we progress]

---

## **Quick Reference**

### **Tech Stack:**
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (via Supabase or Neon)
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **CMS:** Sanity
- **Deployment:** Vercel

### **Key Features:**
- E-commerce with shopping cart
- Subscription service
- Wholesale portal
- Admin dashboard
- Review system
- Content management

### **Business Rules:**
- Wholesale accounts require approval
- Seattle-area shipping for wholesale only
- Admin approval required for reviews
- Subscription management via Stripe Billing
