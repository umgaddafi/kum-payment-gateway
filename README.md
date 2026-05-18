# Kum Payment Gateway

A simple payment gateway simulation web app built with Laravel, React, Inertia, and Vite. It runs entirely with dummy data and does not require a database connection.

## Stack

- Laravel 11
- React 18 with Inertia.js
- Tailwind CSS
- Vite

## Features

- Public payment checkout simulation form
- Mock approve, decline, and pending payment outcomes
- Session-backed dummy transaction activity
- Public dashboard with recent transactions and summary stats
- Deployment notes for Bluehost shared hosting

## Folder Structure

- `app/Http/Controllers`: page, profile, and payment controllers
- `app/Http/Requests`: request validation rules
- `app/Models`: framework model stubs
- `app/Services`: payment simulation logic
- `app/Services/DemoTransactionStore.php`: dummy transaction source
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

3. Copy the environment defaults. No database setup is needed.

```env
DB_CONNECTION=null
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

4. Start development.

```bash
composer run dev
```

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

6. Configure your production `.env` to keep file-based services:

```bash
php artisan optimize:clear
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
- Build assets before going live on shared hosting.
