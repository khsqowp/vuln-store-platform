# Shopping Mall Site Scope

Last updated: 2026-05-05

This document captures the planned shopping mall page and feature scope before API design. Do not treat this as implementation work; use it as product context for API and page planning.

## Topic

Shopping mall

## Customer-Facing Features And Pages

1. Community
2. Login
3. Register
4. Cart
5. Coupons and mileage
6. Events, including attendance check
7. Product sales page, including seller information
8. Product management page
9. Product detail page
10. My page
11. Search
12. Wishlist page
13. Likes
14. Review page
15. Menu
16. Privacy policy
17. Customer center, including 1:1 inquiries and Q&A
18. Product inquiry page inside product sales/detail flow
19. Payment page
20. Delivery tracking page

## Admin Pages

1. Member management page
2. Partner management page
3. Product management page
   - Product registration and editing
   - Category and display management
   - Inventory and warehouse organization
   - Product approval process
4. Community management page
5. Employee management
6. Order and settlement management page
   - Order lifecycle management
   - Settlement system
   - Delivery and logistics tracking
7. CS management
   - 1:1 inquiries
   - Q&A
8. Marketing and promotion management page
   - Coupon and discount management
   - Events and special exhibitions
   - Advertising operations
9. Data analysis and statistics
   - Sales reports
   - User behavior analytics
   - Dashboard
10. System management and security
    - Permission management
    - Audit logs
    - Security configuration
    - System settings

## Notes For API Design

- API design should cover both customer-facing and admin workflows.
- Some features have overlapping domain concepts and should be modeled consistently:
  - Coupons, mileage, promotions, and events
  - Wishlist, likes, reviews, and product inquiries
  - Product sales pages, product detail pages, product management, inventory, and approval
  - Customer center, product Q&A, admin CS management
  - Orders, payment, delivery tracking, settlements
- Admin APIs should consider role-based access control, audit logs, and operational workflows from the beginning.
