# Admin Dashboard Testing Guide - Step 10.1

## Testing Checklist for Order Management

### 1. Admin Authentication ✅
- [X] Navigate to `/admin/login`
- [X] Login with credentials:
  - Email: `admin@vendettaroasting.com`
  - Password: `admin123`
- [X] Verify redirect to `/admin` dashboard
- [X] Verify admin sidebar navigation is visible
- [X] Verify "Sign Out" button works

### 2. Admin Dashboard Home (`/admin`)
- [X] Dashboard loads without errors
- [X] Stats cards display (may show 0 if no data)
- [X] Recent orders table displays
- [ ] Navigation links work (Orders, Products, Customers, Subscriptions)
- [ ] "View Site" link redirects to homepage

### 3. Order List Page (`/admin/orders`)
- [ ] Page loads without errors
- [ ] Orders table displays (empty state if no orders)
- [ ] Status filter dropdown works:
  - [ ] "All Orders" shows all orders
  - [ ] "Pending" filters to pending orders
  - [ ] "Processing" filters to processing orders
  - [ ] "Shipped" filters to shipped orders
  - [ ] "Delivered" filters to delivered orders
  - [ ] "Cancelled" filters to cancelled orders
  - [ ] "Refunded" filters to refunded orders
- [ ] Search functionality works:
  - [ ] Search by order number
  - [ ] Search by customer name
  - [ ] Search by customer email
- [ ] Order table columns display correctly:
  - [ ] Order Number
  - [ ] Customer (name and email)
  - [ ] Date
  - [ ] Status (with color coding)
  - [ ] Payment Status (with color coding)
  - [ ] Total amount
  - [ ] "View" link

### 4. Order Detail Page (`/admin/orders/[orderId]`)
- [ ] Navigate to order detail from orders list
- [ ] Order information displays:
  - [ ] Order number
  - [ ] Order items with quantities and prices
  - [ ] Subtotal, tax, shipping, total
  - [ ] Customer information
  - [ ] Shipping address
- [ ] Status update form works:
  - [ ] Order status dropdown (pending, processing, shipped, delivered, cancelled, refunded)
  - [ ] Payment status dropdown (pending, paid, failed, refunded)
  - [ ] Notes textarea
  - [ ] "Update Order" button submits successfully
  - [ ] Success message appears after update
  - [ ] Order data refreshes after update

### 5. API Endpoints Testing

#### GET `/api/admin/orders`
- [ ] Returns 401 if not authenticated
- [ ] Returns 401 if user is not admin
- [ ] Returns orders list if authenticated as admin
- [ ] Query parameters work:
  - [ ] `?status=pending` filters correctly
  - [ ] `?limit=10` limits results
  - [ ] `?offset=0` paginates correctly

#### GET `/api/admin/orders/[orderId]`
- [ ] Returns 401 if not authenticated
- [ ] Returns 401 if user is not admin
- [ ] Returns 404 if order not found
- [ ] Returns order details with items if found

#### PUT `/api/admin/orders/[orderId]`
- [ ] Returns 401 if not authenticated
- [ ] Returns 401 if user is not admin
- [ ] Updates order status successfully
- [ ] Updates payment status successfully
- [ ] Updates notes successfully
- [ ] Returns updated order data

### 6. Error Handling
- [ ] Unauthorized access redirects to login
- [ ] Non-admin users cannot access admin routes
- [ ] Database errors are handled gracefully
- [ ] Empty states display correctly (no orders, no search results)

### 7. Database Integration
- [ ] Orders are fetched from database (if connected)
- [ ] Order updates persist to database
- [ ] Customer information joins correctly
- [ ] Order items are fetched correctly

## Test Data Setup (Optional)

If you want to test with sample data, you can run these SQL queries in your database:

```sql
-- Create a test user
INSERT INTO users (id, email, first_name, last_name, password_hash, role, created_at)
VALUES (gen_random_uuid(), 'test@example.com', 'Test', 'User', 'hash', 'customer', NOW())
ON CONFLICT DO NOTHING;

-- Create a test order
INSERT INTO orders (id, order_number, user_id, status, payment_status, subtotal, tax_amount, shipping_amount, total_amount, created_at)
VALUES (
  gen_random_uuid(),
  'ORD-TEST-001',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'pending',
  'paid',
  50.00,
  5.00,
  0.00,
  55.00,
  NOW()
)
ON CONFLICT DO NOTHING;

-- Create test order items
INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
  gen_random_uuid(),
  o.id,
  (SELECT id FROM products LIMIT 1),
  'Test Product',
  2,
  25.00,
  50.00
FROM orders o
WHERE o.order_number = 'ORD-TEST-001'
LIMIT 1
ON CONFLICT DO NOTHING;
```

## Known Issues to Check

1. **Database Connection**: If DATABASE_URL is not set, queries will fail gracefully
2. **Empty Database**: If no orders exist, pages should show empty states
3. **Session Management**: Admin session should persist across page refreshes
4. **Route Protection**: Middleware should protect all `/admin/*` routes

## Next Steps After Testing

- [ ] Fix any bugs found during testing
- [ ] Add error messages for better UX
- [ ] Add loading states for better UX
- [ ] Consider adding pagination for large order lists
- [ ] Consider adding export functionality
- [ ] Move to Step 10.2: Analytics & Reporting

