# Kum Payment Gateway

A simple payment gateway simulation web app built with Laravel, React, Inertia, Vite, and MySQL. It is structured for local development and practical deployment to Bluehost shared hosting from GitHub.

## Stack

- Laravel 11
- React 18 with Inertia.js
- MySQL
- Tailwind CSS
- Vite

## Features

- Public payment checkout simulation form
- Mock approve, decline, and pending payment outcomes
- Transaction storage in MySQL
- Admin dashboard with recent transactions and summary stats
- Laravel authentication for admin access
- Deployment notes for Bluehost shared hosting

## Folder Structure

- `app/Http/Controllers`: page, profile, and payment controllers
- `app/Http/Requests`: request validation rules
- `app/Models`: Eloquent models
- `app/Services`: payment simulation logic
- `database/migrations`: database schema
- `database/seeders`: demo admin and sample transaction records
- `resources/js/Pages/Payments`: React payment page
- `resources/js/Components/Payments`: reusable payment UI components
- `public/build`: production frontend assets after Vite build

## Local Setup

1. Install dependencies.

```bash
composer install
npm install
```

2. Create your environment file and app key.

```bash
cp .env.example .env
php artisan key:generate
```

3. Update `.env` with your MySQL credentials.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kum_payment_gateway
DB_USERNAME=root
DB_PASSWORD=
```

4. Run migrations and seed demo data.

```bash
php artisan migrate --seed
```

5. Start development.

```bash
composer run dev
```

## Demo Admin Login

- Email: `admin@kumgateway.test`
- Password: `password`

## Payment Simulation Rules

- Card ending in `4242`: approved
- Card ending in `0002`: declined for insufficient funds
- Card ending in `9995`: declined for suspected fraud
- Amount `>= 5000`: pending manual review

## Bluehost Deployment

1. Push the repository to GitHub.
2. In Bluehost cPanel, use `Git Version Control` or clone the repo into a directory outside `public_html`, for example `/home/USERNAME/kum-payment-gateway`.
3. If Bluehost lets you change the document root, point it to the Laravel `public/` folder.
4. If you must use `public_html`, copy the contents of `public/` into `public_html/` and update `index.php` so it points back to the real Laravel app folder.
5. Install dependencies and build assets:

```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

6. Configure your production `.env` with Bluehost database credentials.
7. Run:

```bash
php artisan migrate --force
php artisan storage:link
```

8. Ensure these directories are writable:

```text
storage/
bootstrap/cache/
```

## Example `public_html/index.php` Path Update

If your app code lives in `/home/USERNAME/kum-payment-gateway` and your web root is `public_html`, the relevant lines should look like:

```php
require __DIR__.'/../kum-payment-gateway/vendor/autoload.php';
$app = require_once __DIR__.'/../kum-payment-gateway/bootstrap/app.php';
```

## Notes

- This app simulates payments only.
- Password reset email delivery needs real mail settings in production.
- Build assets before going live on shared hosting.
