# Shopping Mall Design Guidelines

Last updated: 2026-05-05

## Product Direction

Build a fashion commerce site whose information architecture follows MUSINSA-style shopping flows, while the component language follows the clean, dense, mobile-friendly principles of Toss Design System.

Primary references:

- MUSINSA main/recommend structure: https://www.musinsa.com/main/musinsa/recommend?gf=M
- Toss Design System overview for Apps in Toss: https://developers-apps-in-toss.toss.im/design/components.md

Note: The MUSINSA URL currently redirects to a global location selector in this environment, so use the user's stated intent and common MUSINSA patterns as the working reference.

## Site Structure

Use a commerce-first structure. The first screen should be the usable shopping experience, not a marketing landing page.

- Global header: logo, search, category navigation, account, cart, recently viewed or quick links.
- Main home: recommendation feed, ranking sections, category shortcuts, promotion bands, new arrivals, sale modules.
- Product listing: category tabs, filters, sort, product grid, price and discount emphasis, pagination or infinite loading.
- Product detail: image gallery, brand/product title, price, sale info, delivery/benefit summary, options, buy/cart actions, reviews, Q&A.
- Search: search input, recent/popular keywords, result count, filters, product grid.
- Cart/order: dense item list, quantity controls, coupon/benefit area, sticky payment summary.
- My page: orders, profile, coupons, reviews, inquiries.
- Community/event/customer support: secondary commerce content, kept visually quieter than shopping flows.
- Admin/seller surfaces: utilitarian dashboards with dense tables and clear actions.

## Layout Principles

- Prioritize dense, scannable commerce UI over decorative layouts.
- Keep the header and navigation predictable across pages.
- Use full-width content bands or unframed layouts for major sections.
- Use cards only for repeated product items, modals, and genuinely framed tools.
- Do not put cards inside cards.
- Product grids should remain stable across loading, hover, discount labels, and long names.
- Mobile pages should expose primary shopping actions quickly, especially search, cart, category, and buy actions.
- Sticky bottom actions are appropriate on mobile product detail and checkout flows.

## Visual Language

- Overall tone: clean, precise, high-contrast, and functional.
- Base palette: white, black, neutral grays, with restrained accent colors for sale, status, and primary actions.
- Avoid a one-note palette dominated by a single hue.
- Avoid decorative gradient blobs, bokeh, or purely atmospheric backgrounds.
- Use real product imagery or realistic generated product images when visual assets are needed.
- Product photography should be inspectable: clear, bright, not overly dark, blurred, or cropped.
- Use 8px or smaller border radius unless an existing component style requires otherwise.
- Letter spacing should remain 0.
- Do not scale font size directly with viewport width.

## TDS-Inspired Component Rules

Use Toss-style clarity and interaction discipline without copying restricted assets or claiming TDS ownership.

- Buttons: clear hierarchy for primary, secondary, destructive, and text actions.
- Icon buttons: use familiar icons for cart, search, back, close, favorite, share, filter, sort, and menu.
- Form fields: large touch targets, direct labels, immediate validation feedback.
- Tabs and segmented controls: category switching, product detail sections, filter modes.
- Toggles and checkboxes: binary preferences, agreement checks, saved filters.
- Menus and sheets: option sets, sorting, mobile filters, product options.
- Lists: strong alignment, predictable spacing, concise labels.
- Badges: sale rate, new, sold out, limited, coupon, delivery status.
- Toasts and dialogs: short, action-oriented Korean copy.
- Empty states: explain what is empty and provide the next useful action.

## Typography

- Use a modern Korean-compatible sans-serif stack.
- Product names should be readable at grid scale and clamp cleanly.
- Prices and discounts need stronger hierarchy than supporting text.
- Section headings should be compact inside commerce surfaces.
- Reserve large display text for true hero or campaign areas only.
- Button text must fit on mobile; wrap or resize only when necessary.

## Commerce UX Details

- Product cards should include image, brand, product name, price, discount, rating/review count if available, and optional quick action.
- Sale price, discount rate, and sold-out state should be visually unmistakable.
- Filters should support category, price, brand, size, color, discount, delivery, and review/rating when data exists.
- Sort options should include recommended, newest, popular, low price, high discount.
- Product detail option selection must make unavailable sizes/options clear.
- Checkout should always show final price, discount, delivery fee, and payment amount.
- Error and validation messages should be specific and recoverable.

## UX Writing

- Write concise Korean UI copy.
- Prefer direct action labels: "장바구니", "바로 구매", "필터", "정렬", "쿠폰 적용".
- Avoid feature-explaining text inside the app unless the user needs it to complete a task.
- Empty, error, and success states should explain outcome and next action in one short sentence.

## Implementation Guardrails

- Match existing project patterns before adding new UI abstractions.
- Keep layouts responsive with explicit grid, aspect-ratio, min/max, and stable control dimensions.
- Verify mobile and desktop views when adding major UI.
- Do not import or reuse Toss-owned UI kit assets unless the project has explicit permission.
- Treat this document as the default design source for future shopping mall work in this repository.
