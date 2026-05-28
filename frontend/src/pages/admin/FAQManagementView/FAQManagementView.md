# FAQManagementView

Admin panel for managing FAQs — full CRUD (create, read, update, delete) with modal forms, search, category filter, and pagination.

## Route

`/admin/faq` (admin)

## API

Fetches from `GET /api/faqs`, creates via `POST /api/faqs`, updates via `PUT /api/faqs/:id`, deletes via `DELETE /api/faqs/:id`.

## Usage

```tsx
import { FAQManagementView } from '@/pages/admin'
```