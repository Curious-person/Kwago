# Kwago — Dashboard Form Conventions

> **Audience**: Any developer adding a new Create/Edit feature to the Kwago dashboard.
> **Status**: Active — follow this pattern for all new dashboard modules.

---

## The Shared-Form Pattern

Kwago dashboard pages that allow a user to **create** and **edit** the same
resource must share a single form component. Route-level page files are thin
wrappers only.

```
app/dashboard/<role>/<resource>/
  new/page.tsx          ← renders <ResourceForm mode="create" />
  [id]/edit/page.tsx    ← renders <ResourceForm mode="edit" initialData={…} />

components/<domain>/
  ResourceForm.tsx      ← ALL state, logic, and UI lives here
```

### Why

| Concern     | One component                                    |
| ----------- | ------------------------------------------------ |
| DRY         | A single block of UI / logic to maintain         |
| Consistency | Create and Edit always look and behave the same  |
| Type-safety | One set of prop types reviewed in one place      |
| Testability | Unit-test one component, not two near-duplicates |

---

## Reference implementation — Posts

| File                                                                                                    | Role                                               |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`types/post.ts`](../types/post.ts)                                                                     | Domain types (`Post`, `ContentBlock`, `BlockType`) |
| [`lib/data/posts.ts`](../lib/data/posts.ts)                                                             | Mock data (replace with Supabase fetch later)      |
| [`components/blog/PostForm.tsx`](../components/blog/PostForm.tsx)                                       | Shared form component                              |
| [`app/dashboard/author/posts/new/page.tsx`](../app/dashboard/author/posts/new/page.tsx)                 | Create wrapper                                     |
| [`app/dashboard/author/posts/[id]/edit/page.tsx`](../app/dashboard/author/posts/%5Bid%5D/edit/page.tsx) | Edit wrapper                                       |

---

## Step-by-step guide for a new module

### 1 — Define types

Create `types/<resource>.ts` and export the domain interface plus any subtypes.

```ts
// types/product.ts
export interface Product {
  id: string;
  name: string;
  // ...
}
```

### 2 — Centralise mock / seed data

Put sample records in `lib/data/<resource>.ts` and export a named array constant.

```ts
// lib/data/products.ts
import { Product } from "@/types/product";
export const MOCK_PRODUCTS: Product[] = [
  /* ... */
];
```

### 3 — Build `<ResourceForm />`

Create `components/<domain>/ResourceForm.tsx`.

#### Required props shape

```tsx
interface ResourceFormProps {
  mode: "create" | "edit";
  initialData?: Resource; // only in edit mode
  resourceId?: string; // only in edit mode
}
```

#### State initialisation

```tsx
const [fields, setFields] = useState({
  name: initialData?.name ?? "",
  // ... rest of fields
});
```

Using `??` (nullish coalescing) means edit mode pre-fills with real values while
create mode gets sensible defaults.

#### Mode-aware copy

Put all user-facing strings that differ between modes in one object:

```tsx
const copy = {
  pageTitle: mode === "edit" ? "Edit Product" : "Add Product",
  saveLabel: mode === "edit" ? "Update Product" : "Publish Product",
  // ...
};
```

#### Save handler

Branch on `mode` in one `handleSave` function — do not duplicate the function:

```tsx
const handleSave = () => {
  if (mode === "edit") {
    console.log(`Updating ${resourceId}:`, fields);
    // call update service
  } else {
    console.log("Creating:", fields);
    // call create service
  }
};
```

### 4 — Write thin route pages

**Create page** — zero logic, just renders the form:

```tsx
// app/dashboard/.../new/page.tsx
"use client";
import ResourceForm from "@/components/<domain>/ResourceForm";

export default function NewResourcePage() {
  return <ResourceForm mode="create" />;
}
```

**Edit page** — fetch or look up by id, then pass as initialData:

```tsx
// app/dashboard/....[id]/edit/page.tsx
"use client";
import { useParams } from "next/navigation";
import ResourceForm from "@/components/<domain>/ResourceForm";
import { MOCK_RESOURCES } from "@/lib/data/<resource>";

export default function EditResourcePage() {
  const { id } = useParams();
  const resource = MOCK_RESOURCES.find((r) => r.id === id);

  if (!resource) return <p>Not found.</p>;

  return (
    <ResourceForm
      mode="edit"
      resourceId={id as string}
      initialData={resource}
    />
  );
}
```

> **Future DB migration**: When Supabase is wired up, convert the edit page to a
> Server Component. Fetch data with `createServerClient` and pass the result as
> `initialData`. The `ResourceForm` client component API stays unchanged.

---

## Rules & guardrails

- **No logic in page files.** Pages may only import and render. Any state,
  handler, or derived value belongs inside the form component.
- **No shadow utilities** — follow the Kwago "Zero Shadows" design policy.
  Use `border-zinc-100` or `bg-zinc-50` for visual separation.
- **Types come from `types/`** — never redefine an interface locally if a shared
  one already exists.
- **Mock data comes from `lib/data/`** — never inline sample arrays inside a page
  or component.
