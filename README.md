
# Ecommerce Platform

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Setup and Installation](#setup-and-installation)
5. [Running the Project](#running-the-project)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Design Decisions](#design-decisions)
9. [User Manual](#user-manual)
10. [Admin Panel](#admin-panel)


## Project Overview

This is a fully functional **ecommerce platform** built with Next.js, Supabase, and Stripe. It allows users to browse products, manage their cart, checkout with Stripe payments, track orders, and access user profiles.

The platform supports **mobile-friendly, responsive design** and includes an admin panel to manage products.



## Features

* **Browse Products:** Users can view products by categories (8 categories supported).
* **Product Details:** Click on a product to view full details, images, price, and availability.
* **Cart Management:** Add items to cart, adjust quantities, or remove items before checkout.
* **Secure Checkout:** Stripe payment integration for secure online payments.
* **Order Tracking:** Track the status of all orders via the Order History page.
* **User Profile:** Manage address, phone, email, and view order history.
* **Admin Panel:** Add, edit, or delete products.
* **Responsive Design:** Optimized for desktop, tablet, and mobile devices.


## Technology Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend:** Supabase (PostgreSQL, Auth, Storage)
* **Payments:** Stripe
* **Icons:** React Icons (FaShoppingCart, FaLock, etc.)



## Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env.local` file at the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

> Make sure to replace these with your actual keys from Supabase and Stripe.

4. **Create Supabase Tables**

* `products` table:

```sql
create table public.products (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text null,
  price numeric not null,
  stock integer not null,
  category text not null,
  subcategory text not null,
  rating numeric null default 0,
  reviews integer null default 0,
  image_url text null,
  constraint products_pkey primary key (id)
);
```

* `orders` table:

```sql
create table public.orders (
  id bigint generated always as identity not null,
  user_id uuid null,
  items jsonb not null,
  total_amount numeric not null,
  shipping_address text not null,
  payment_method jsonb null,
  status text null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_user_id_fkey foreign key (user_id) references auth.users (id)
);
```

* `profiles` table (optional for user info):

```sql
create table public.profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  email text,
  phone text,
  address text,
  city text,
  zip text,
  country text,
  membership text
);
```

---

## Running the Project

1. **Start development server**

```bash
npm run dev
```

2. Open `http://localhost:3000` in your browser.

---

## Testing

* Add products to the cart and verify the **cart count** updates.
* Proceed to checkout and test **Stripe payment flow** in test mode.
* Verify **order creation** in Supabase and stock updates.
* Test **order tracking** and **profile update** functionalities.
* Test responsiveness on mobile/tablet screens.

---

## Deployment

* Deploy on **Vercel**: `https://vercel.com/new` → Connect GitHub repo → Add environment variables.
* Make sure **Stripe webhook URLs** and Supabase keys are properly set for production.
* Production URL will look like: `https://your-project.vercel.app`.

---

## Design Decisions

* **Next.js**: Provides SSR/SSG for performance and SEO.
* **Supabase**: Manages database, auth, and storage with minimal backend setup.
* **Stripe**: Used for secure online payments and order processing.
* **Tailwind CSS**: Chosen for rapid, responsive UI development.
* **React Context API**: Used for global cart state management.



## User Manual

### Step 1: Browse Product Catalog

* Go to the website and explore product categories.
* Click **"View"** on a product card to see details.

### Step 2: View Product Details and Add to Cart

* See full product info on the product page.
* Click **"Add to Cart"** to add items.
* Cart icon shows current quantity.

### Step 3: Manage Your Cart

* Click cart icon to open cart page.
* Adjust quantities or remove items before checkout.

### Step 4: Checkout Process

* Click **Checkout**, log in or sign up if required.
* Enter **shipping address** and **payment details**.

### Step 5: Payment and Order Success

* Complete Stripe payment.
* card number:4242 4242 4242 4242
* Redirected to **Order Success** page.
* Click **"View My Orders"** to track all orders.
  

### Step 6: Order Tracking

 View order status (pending, completed, shipped, etc.) on Order History page.

---

## Admin Panel

1. Click **Admin** link in the navbar.
2. Enter password: `Roshly`.
3. Admin can **add, edit, or delete products**.

---

## Screenshots (Optional)

* **Home Page**
* **Product Details**
* **Cart Page**
* **Checkout Page**
* **Order History**
* **Admin Panel**


