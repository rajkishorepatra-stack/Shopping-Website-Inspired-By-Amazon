# Admin Panel Documentation

## Admin Login Credentials

**Username:** `admin`
**Password:** `admin123`

## Accessing the Admin Panel

1. Navigate to `admin-login.html` in your browser
2. Enter the credentials above
3. Click "Login to Admin Panel"

Alternatively, you can access it directly:
- **Login Page:** `admin-login.html`
- **Dashboard:** `admin-dashboard.html` (redirects to login if not authenticated)

## Features

### Login Page
- Clean, modern login interface
- Password visibility toggle
- "Remember me" functionality
- Demo credentials displayed
- Form validation with error messages
- Back to store link

### Admin Dashboard

#### 1. Dashboard Section
- **Statistics Cards:**
  - Total Orders (updates dynamically)
  - Total Revenue (calculates from orders)
  - Total Products (32 items)
  - Total Customers

- **Recent Orders Table:**
  - Shows last 5 orders
  - Order ID, Date, Amount, Status

- **Sales Chart Placeholder**

#### 2. Orders Management
- View all orders with filtering
- Filter by order status (All, Processing, Delivered, Pending)
- Search functionality
- View detailed order information
- Update order status
- Order items with images and prices

#### 3. Products Section
- Product grid display
- Product information
- Add product functionality (placeholder)

#### 4. Analytics Section
- Order status distribution charts
- Visual representation of orders by status
- Monthly revenue tracking (placeholder)

#### 5. Customers Section
- Customer information table
- Email, order count, and spending data
- (Can be expanded with real customer data)

#### 6. Settings Section
- Account settings
- Change password functionality
- Email management

## Data Persistence

### How Data is Stored:
- **Orders Data:** Stored in browser's `localStorage` under key `orders`
- **Authentication:** Stored in `sessionStorage` while logged in
- **Remember Me:** Optional localStorage for username

### Data Flow:
1. Products are added to cart from the main store
2. Orders are created when users checkout
3. Admin can view all orders and update their status
4. Changes are saved to localStorage in real-time

## Navigation

### Sidebar Navigation:
- **Dashboard** - Overview and statistics
- **Orders** - Manage all orders
- **Products** - Product management
- **Analytics** - Sales and order data
- **Customers** - Customer information
- **Settings** - Account and password settings

### Top Bar Features:
- Search functionality
- Notification badge
- Admin profile display
- Menu toggle (mobile)

## Responsive Design

The admin panel is fully responsive:
- **Desktop:** Full sidebar visible with all content
- **Tablet:** Collapsible sidebar
- **Mobile:** Hidden sidebar with hamburger menu

## Security Notes

This is a demo admin panel. For production:
- Use server-side authentication
- Implement secure password hashing
- Add role-based access control
- Use HTTPS
- Implement session timeouts
- Add proper authorization checks

## Integration with Main Store

The admin panel integrates with the main store:
- Reads order data from store's localStorage
- Can view all customer orders
- Can update order status
- Statistics update in real-time

## Logout

Click the "Logout" button in the sidebar footer to:
- Clear session data
- Redirect to login page
- End admin session

## Demo Usage

1. Go to the main store (`index.html`)
2. Add products to cart
3. Click cart to checkout
4. Place an order
5. Go to admin panel (`admin-login.html`)
6. Login with `admin` / `admin123`
7. View your order in Dashboard → Recent Orders
8. Go to Orders section to see all orders
9. Click "View" to see order details
10. Update order status and click "Update"