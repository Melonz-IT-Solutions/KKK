# Login Authentication Logic

This document describes the logic and flow for login authentication in this project. Update this file whenever you change the login authentication logic so that future updates remain consistent and avoid hallucination.

## Current Login Authentication Flow

1. **Form Validation**
   - Uses `react-hook-form` with `zod` schema validation.
   - Fields: `username` (required), `password` (required).

2. **Form Components**
   - Custom `Input` component with support for icons, sizes, and password visibility toggle.
   - Custom `Button` component for submission.

3. **Password Visibility**
   - Uses a `showPassword` state to toggle between password and text input types.
   - Eye/EyeOff icons toggle this state.

4. **Submission**
   - On submit, calls the `onSubmit` prop with `{ username, password }`.
   - Button shows loading state when submitting.

5. **Error Handling**
   - Validation errors are shown below each input.
   - Submission errors (e.g., invalid credentials) should be handled in the parent and passed as props if needed.

## Example Usage

```
<Form form={form} className="w-87.5">
  <Input ... />
  <Button ... />
</Form>
```

## Update Instructions

- When updating login authentication logic, document all changes here.
- Include any new validation, API calls, or UI/UX changes.
- Reference this doc before making further changes to avoid inconsistencies.

## Auth.js Integration (2026-05-28)

### Overview

- Login authentication now uses [Auth.js](https://authjs.dev/) for secure, extensible authentication.
- Auth.js handles credential validation, session management, and can be extended for OAuth/social logins.

### Implementation Steps

1. **Install Auth.js**
   - `npm install @auth/core @auth/react`
2. **Configure Auth.js Provider**
   - Wrap your app with the Auth.js provider (see Auth.js docs for Next.js or React setup).
3. **Login Flow**
   - On form submit, call the Auth.js `signIn` method with username and password.
   - Example:
     ```tsx
     import { signIn } from '@auth/react'
     // ...
     async function onSubmit({ username, password }) {
       const result = await signIn('credentials', {
         username,
         password,
         redirect: false,
       })
       // Handle result: result.error, result.ok, result.url
     }
     ```
   - Show error messages if `result.error` is set.
4. **Session Handling**
   - Use Auth.js hooks (e.g., `useSession`) to access user session and authentication state.
5. **Error Handling**
   - Display Auth.js errors below the form as needed.

### Example Usage

```
<Form form={form} onSubmit={onSubmit}>
  {/* ...fields... */}
</Form>
```

### Notes

- You can extend Auth.js to support OAuth providers (Google, GitHub, etc.) or custom backends.
- Always update this doc when changing authentication logic or provider.
