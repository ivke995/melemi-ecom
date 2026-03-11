# Bojana Melemi — eCommerce Storefront

Bojana Melemi is a full-stack Next.js (App Router) ecommerce app with Clerk auth, MongoDB (Mongoose), Cloudinary image uploads, and background jobs via Inngest. The UI is localized in Serbian/Croatian, with storefront routes like `/prodavnica`, `/o-nama`, and `/kontakt`.

## Features

- Product catalog, product detail pages, cart, and checkout flow
- Customer order history and address management
- Seller dashboard for product management and order handling
- Clerk authentication with protected API routes
- Cloudinary-based product image uploads
- Inngest functions for user sync and batched order creation
- Tailwind CSS UI with reusable components

## Tech Stack

- Next.js 15 (React 19, App Router)
- Tailwind CSS
- MongoDB + Mongoose
- Clerk Auth
- Cloudinary
- Inngest

## Getting Started

### 1) Clone the repo

```bash
git clone https://github.com/ivke995/melemi-ecom.git
cd melemi-ecom
```

### 2) Install dependencies

```bash
npm install
```

### 3) Environment variables

Create a `.env` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CURRENCY=KM
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Notes:
- `MONGODB_URI` should be the base connection string (the app uses `/quickcart`).
- `NEXT_PUBLIC_CURRENCY` is used as a suffix label in prices.
https://github.com/ivke995/melemi-ecom.git
### 4) Run locally

```bash
npm run dev
```

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run dev:turbopack` — start Turbopack dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run Next.js ESLint

## Project Structure

- `app/` — App Router pages and API routes
- `components/` — shared UI components
- `context/AppContext.jsx` — global client state
- `models/` — Mongoose models
- `config/` — DB connection and Inngest config
- `assets/` — icons and dummy data

## Tests

No automated test runner is configured yet.

## License

MIT — see `LICENSE.md`.
