# Backend API Documentation (tRPC)

## 1) Backend overview

The backend is an Express server exposing a tRPC API at:

- `http://localhost:8000/trpc`

Code flow:

1. Express bootstrap: `apps/api/src/index.ts`
2. Public API router: `packages/trpc/src/router.ts`
3. Server-side routes and auth middleware: `packages/trpc/server/routes/**`, `packages/trpc/server/trpc.ts`
4. Business logic: `packages/services/**`
5. Persistence: Drizzle schema in `packages/Database/src/db/schema.ts`

Authentication is cookie-based:

- Cookie name: `authentication-token`
- Set during sign-up/sign-in
- Required by `authenticatedProcedure` routes

---

## 2) API surface (all procedures)

### Root

#### `health` (query, public)
- Input: `undefined`
- Output:
```json
{ "message": "health check ok" }
```

### `auth` router

#### `auth.createUserWithEmailAndPassword` (mutation, public)
- Input:
```json
{
  "name": "Amit Dewangan",
  "email": "amit@example.com",
  "password": "secret123"
}
```
- Output:
```json
{ "id": 1 }
```
- Side effect: sets `authentication-token` cookie.

#### `auth.signInUserWithEmailAndPassword` (mutation, public)
- Input:
```json
{
  "email": "amit@example.com",
  "password": "secret123"
}
```
- Output:
```json
{ "id": 1 }
```
- Side effect: sets `authentication-token` cookie.

#### `auth.getLoggedInUserInfo` (query, authenticated)
- Input: `undefined`
- Output:
```json
{
  "id": 1,
  "email": "amit@example.com",
  "fullName": "Amit Dewangan",
  "profileImageUrl": null
}
```

---

### `form` router

#### `form.createForm` (mutation, authenticated)
- Input:
```json
{
  "title": "Customer Feedback Form",
  "description": "Collect post-service feedback"
}
```
- Output:
```json
{ "id": 101 }
```

#### `form.listForms` (query, authenticated)
- Input: `undefined`
- Output:
```json
[
  {
    "id": 101,
    "title": "Customer Feedback Form",
    "description": "Collect post-service feedback",
    "createdAt": "2026-08-16T17:00:00.000Z",
    "updatedAt": "2026-08-16T17:00:00.000Z"
  }
]
```

#### `form.getForm` (query, authenticated)
- Input:
```json
{ "formId": 101 }
```
- Output (`null` if not found):
```json
{
  "id": 101,
  "title": "Customer Feedback Form",
  "description": "Collect post-service feedback",
  "createdAt": "2026-08-16T17:00:00.000Z",
  "updatedAt": "2026-08-16T17:00:00.000Z",
  "fields": [
    {
      "id": 501,
      "label": "Email",
      "labelKey": "email",
      "type": "EMAIL",
      "description": "Customer email",
      "placeholder": "john@example.com",
      "isRequired": true,
      "index": "1.00"
    }
  ]
}
```

#### `form.createField` (mutation, authenticated)
- Input:
```json
{
  "formId": 101,
  "label": "Email",
  "type": "EMAIL",
  "description": "Customer email",
  "placeholder": "john@example.com",
  "isRequired": true
}
```
- Output:
```json
{
  "id": 501,
  "labelKey": "email",
  "index": "1.00"
}
```

#### `form.getFields` (query, authenticated)
- Input:
```json
{ "formId": 101 }
```
- Output:
```json
[
  {
    "id": 501,
    "label": "Email",
    "labelKey": "email",
    "type": "EMAIL",
    "description": "Customer email",
    "placeholder": "john@example.com",
    "isRequired": true,
    "index": "1.00"
  }
]
```

#### `form.updateField` (mutation, authenticated)
- Input:
```json
{
  "fieldId": 501,
  "label": "Work Email",
  "isRequired": true
}
```
- Output:
```json
{ "id": 501 }
```

#### `form.deleteField` (mutation, authenticated)
- Input:
```json
{ "fieldId": 501 }
```
- Output:
```json
{ "id": 501 }
```

#### `form.submitForm` (mutation, public)
- Input:
```json
{
  "formId": 101,
  "values": [
    { "formFieldId": 501, "value": "john@example.com" },
    { "formFieldId": 502, "value": "Yes" }
  ]
}
```
- Output:
```json
{ "id": "9001" }
```
> Note: this route currently stringifies `id` in route logic.

#### `form.getFormSubmissions` (query, authenticated)
- Input:
```json
{ "formId": 101 }
```
- Output:
```json
[
  {
    "id": 9001,
    "createdAt": "2026-08-16T17:20:00.000Z",
    "values": [
      { "formFieldId": 501, "value": "john@example.com" },
      { "formFieldId": 502, "value": "Yes" }
    ]
  }
]
```

---

## 3) Allowed field types

`TEXT | NUMBER | EMAIL | YES_NO | PASSWORD`

---

## 4) Test dataset (example)

Reusable dataset is available at:

- `apps/api/test-data/trpc-api-dataset.json`

This dataset is designed for a full flow:

1. create user
2. sign in
3. create form
4. create fields
5. get form/fields
6. submit form (public)
7. fetch submissions

---

## 5) Suggested manual test flow

1. Start backend:
   - `pnpm --filter api dev`
2. Use the web app (`apps/web`) or any tRPC client to call procedures in this order:
   - `health`
   - `auth.createUserWithEmailAndPassword`
   - `auth.getLoggedInUserInfo`
   - `form.createForm`
   - `form.createField` (2+ fields)
   - `form.getForm`
   - `form.submitForm`
   - `form.getFormSubmissions`
3. Verify:
   - authenticated routes fail without cookie
   - field ordering (`index`) increases
   - submissions persist with `values` JSON

