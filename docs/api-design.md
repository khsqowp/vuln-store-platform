# Shopping Mall API Design

Last updated: 2026-05-05

This document defines the first API surface for the shopping mall vulnerability diagnosis project. The APIs are intentionally scaffolded as domain endpoints and scenario metadata first. Database models and intentionally vulnerable behavior should be implemented later per scenario.

## Base Rules

- Base path: `/api`
- Response wrapper:

```json
{
  "status": "OK",
  "message": "Human-readable message",
  "data": {}
}
```

- Scenario IDs use `VULN-001` through `VULN-050`.
- Customer APIs and admin APIs are separated by path.
- Admin APIs must eventually enforce role-based access control, audit logging, and operational state transitions.

## Scenario Catalog API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/vulnerability-scenarios` | List all 50 vulnerability diagnosis scenarios |
| GET | `/api/vulnerability-scenarios/{scenarioId}` | Get one scenario, for example `VULN-001` |

## Customer APIs

| Method | Path | Domain | Related scenarios |
|--------|------|--------|-------------------|
| POST | `/api/auth/login` | Login | VULN-001, VULN-021, VULN-032, VULN-033, VULN-034 |
| POST | `/api/auth/register` | Register | VULN-016, VULN-031, VULN-042 |
| POST | `/api/auth/password-reset/request` | Password reset request | VULN-032, VULN-041 |
| POST | `/api/auth/password-reset/confirm` | Password reset confirm | VULN-041 |
| POST | `/api/users/me/password` | Password change | VULN-022, VULN-027 |
| GET | `/api/users/me` | My page profile | VULN-010, VULN-048 |
| GET | `/api/products` | Product listing | VULN-002, VULN-044 |
| GET | `/api/products/{productId}` | Product detail | VULN-009, VULN-044 |
| GET | `/api/search` | Search | VULN-002, VULN-008, VULN-049 |
| GET | `/api/cart` | Cart detail | VULN-014, VULN-030, VULN-048 |
| POST | `/api/cart/items` | Add cart item | VULN-014, VULN-030 |
| PUT | `/api/cart/items/{cartItemId}` | Update cart item | VULN-014, VULN-030 |
| DELETE | `/api/cart/items/{cartItemId}` | Delete cart item | VULN-044 |
| POST | `/api/orders/checkout` | Checkout/payment | VULN-013, VULN-030, VULN-036, VULN-040, VULN-046, VULN-049 |
| GET | `/api/orders/{orderId}` | Order detail | VULN-003, VULN-011, VULN-048 |
| GET | `/api/orders/{orderId}/delivery` | Delivery tracking | VULN-003, VULN-011 |
| GET | `/api/coupons` | Coupon list | VULN-029, VULN-035 |
| POST | `/api/coupons/redeem` | Coupon redeem | VULN-029, VULN-035 |
| GET | `/api/mileage` | Mileage balance | VULN-036 |
| GET | `/api/events` | Event list | VULN-025 |
| POST | `/api/events/attendance` | Attendance check | None yet |
| POST | `/api/events/banner/preview` | External banner preview | VULN-025 |
| GET | `/api/wishlist` | Wishlist list | VULN-028 |
| POST | `/api/wishlist/{productId}` | Add wishlist item | VULN-028 |
| POST | `/api/likes/{targetType}/{targetId}` | Like toggle | VULN-028 |
| GET | `/api/community/posts` | Community post list | VULN-005, VULN-026 |
| POST | `/api/community/posts` | Community post create | VULN-005, VULN-026 |
| DELETE | `/api/community/posts/{postId}` | Community post delete | VULN-026 |
| GET | `/api/products/{productId}/reviews` | Review list | VULN-006 |
| POST | `/api/products/{productId}/reviews` | Review create/upload | VULN-006, VULN-017 |
| GET | `/api/products/{productId}/inquiries` | Product inquiry list | VULN-012 |
| POST | `/api/products/{productId}/inquiries` | Product inquiry create | VULN-012 |
| GET | `/api/cs/inquiries` | 1:1 inquiry list | VULN-012 |
| GET | `/api/cs/inquiries/{inquiryId}` | 1:1 inquiry detail | VULN-012 |
| POST | `/api/cs/inquiries` | 1:1 inquiry create/upload | VULN-007, VULN-024 |
| GET | `/api/files/download` | File download | VULN-024 |

## Admin APIs

| Method | Path | Domain | Related scenarios |
|--------|------|--------|-------------------|
| GET | `/api/admin/users` | Member management | VULN-004, VULN-015, VULN-023, VULN-048 |
| PUT | `/api/admin/users/{userId}` | Member update | VULN-015, VULN-023 |
| GET | `/api/admin/partners` | Partner management | VULN-015, VULN-023 |
| GET | `/api/admin/products` | Product management | VULN-015, VULN-018, VULN-023 |
| POST | `/api/admin/products` | Product registration | VULN-018, VULN-025 |
| PUT | `/api/admin/products/{productId}` | Product edit | VULN-018, VULN-025 |
| POST | `/api/admin/products/{productId}/approve` | Product approval | VULN-015, VULN-023 |
| GET | `/api/admin/inventory` | Inventory and warehouse | VULN-030 |
| GET | `/api/admin/community/posts` | Community management | VULN-005, VULN-026 |
| GET | `/api/admin/employees` | Employee management | VULN-015, VULN-023 |
| GET | `/api/admin/orders` | Order lifecycle management | VULN-003, VULN-011, VULN-048 |
| GET | `/api/admin/settlements` | Settlement management | VULN-013, VULN-036 |
| GET | `/api/admin/cs/inquiries` | CS management | VULN-007, VULN-012 |
| GET | `/api/admin/promotions/coupons` | Coupon/discount management | VULN-029, VULN-035 |
| POST | `/api/admin/promotions/events` | Event/promotion management | VULN-025 |
| GET | `/api/admin/analytics/sales` | Sales report | VULN-015, VULN-023 |
| GET | `/api/admin/analytics/users` | User behavior analytics | VULN-015, VULN-023 |
| GET | `/api/admin/system/roles` | Permission management | VULN-015, VULN-023 |
| GET | `/api/admin/system/audit-logs` | Audit logs | VULN-045 |
| GET | `/api/admin/system/security-settings` | Security settings | VULN-019, VULN-020, VULN-037, VULN-043, VULN-046, VULN-050 |

## 50 Scenario Mapping

| ID | Scenario | Primary API surface |
|----|----------|---------------------|
| VULN-001 | SQL Injection - login bypass | `POST /api/auth/login` |
| VULN-002 | SQL Injection - search union based | `GET /api/search`, `GET /api/products` |
| VULN-003 | SQL Injection - blind order lookup | `GET /api/orders/{orderId}`, `GET /api/orders/{orderId}/delivery` |
| VULN-004 | SQL Injection - admin member search | `GET /api/admin/users` |
| VULN-005 | Stored XSS - community board | `POST /api/community/posts` |
| VULN-006 | Stored XSS - review | `POST /api/products/{productId}/reviews` |
| VULN-007 | Stored XSS - 1:1 inquiry admin trigger | `POST /api/cs/inquiries`, `GET /api/admin/cs/inquiries` |
| VULN-008 | Reflected XSS - search results | `GET /api/search` |
| VULN-009 | DOM XSS - product detail | `GET /api/products/{productId}` |
| VULN-010 | IDOR - other user my page | `GET /api/users/me` |
| VULN-011 | IDOR - other user order or delivery | `GET /api/orders/{orderId}/delivery` |
| VULN-012 | IDOR - 1:1 inquiry detail | `GET /api/cs/inquiries/{inquiryId}` |
| VULN-013 | Payment amount parameter tampering | `POST /api/orders/checkout` |
| VULN-014 | Cart price and quantity tampering | `PUT /api/cart/items/{cartItemId}` |
| VULN-015 | Vertical privilege escalation - admin access | `/api/admin/**` |
| VULN-016 | Mass assignment - admin account creation | `POST /api/auth/register` |
| VULN-017 | File upload - review web shell | `POST /api/products/{productId}/reviews` |
| VULN-018 | File upload - admin product web shell | `POST /api/admin/products` |
| VULN-019 | Weak JWT | `GET /api/admin/system/security-settings` |
| VULN-020 | Hardcoded secret key | `GET /api/admin/system/security-settings` |
| VULN-021 | Session fixation | `POST /api/auth/login` |
| VULN-022 | Password change current password missing | `POST /api/users/me/password` |
| VULN-023 | Admin page authentication bypass | `/api/admin/**` |
| VULN-024 | Path traversal - file download | `GET /api/files/download` |
| VULN-025 | SSRF - external image URL | `POST /api/events/banner/preview`, `POST /api/admin/products` |
| VULN-026 | CSRF - community write/delete | `POST /api/community/posts`, `DELETE /api/community/posts/{postId}` |
| VULN-027 | CSRF - password change | `POST /api/users/me/password` |
| VULN-028 | CSRF - wishlist/like | `POST /api/wishlist/{productId}`, `POST /api/likes/{targetType}/{targetId}` |
| VULN-029 | Race condition - duplicate coupon use | `POST /api/coupons/redeem` |
| VULN-030 | Race condition - oversell inventory | `POST /api/orders/checkout`, `GET /api/admin/inventory` |
| VULN-031 | Weak password accepted | `POST /api/auth/register` |
| VULN-032 | Account enumeration | `POST /api/auth/login`, `POST /api/auth/password-reset/request` |
| VULN-033 | Brute force without account lock | `POST /api/auth/login` |
| VULN-034 | Open redirect after login | `POST /api/auth/login` |
| VULN-035 | Coupon code brute force | `POST /api/coupons/redeem` |
| VULN-036 | Mileage parameter tampering | `POST /api/orders/checkout` |
| VULN-037 | Weak CORS configuration | `/api/**` |
| VULN-038 | Detailed error message exposure | `/api/**` |
| VULN-039 | Directory listing | `/uploads/reviews/`, `/uploads/temp/` |
| VULN-040 | Clickjacking | Payment and password pages |
| VULN-041 | Predictable password reset token | `POST /api/auth/password-reset/request` |
| VULN-042 | Email verification bypass | `POST /api/auth/register` |
| VULN-043 | HTTP response header information disclosure | `/api/**`, `/actuator/info` |
| VULN-044 | Unnecessary HTTP methods allowed | `OPTIONS /api/products/{productId}`, `OPTIONS /api/orders/{orderId}` |
| VULN-045 | Sensitive data in logs | `POST /api/auth/login`, `POST /api/orders/checkout` |
| VULN-046 | Weak cache control | `GET /api/users/me`, checkout flow |
| VULN-047 | Weak password hash MD5 | `GET /api/admin/users` |
| VULN-048 | Excessive API response data | `GET /api/users/me`, `GET /api/orders/{orderId}` |
| VULN-049 | Sensitive data in GET parameters | `GET /api/search`, payment complete redirect |
| VULN-050 | No session expiration | `POST /api/auth/login` |

## Next Implementation Order

1. Define entities and repositories for users, products, orders, coupons, reviews, CS inquiries, and admin audit logs.
2. Add request/response DTOs instead of generic placeholder maps.
3. Add scenario toggles so each vulnerability can be enabled in a controlled training profile.
4. Add tests that verify each diagnosis scenario is reachable and documented.
