import { requireRole } from "@/lib/auth";
import { ProductReviewManager } from "./ProductReviewManager";

export default async function AdminProductsPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Product Review
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          Audit and approve user-submitted products. Ensure all listings meet
          quality standards before publishing to the marketplace.
        </p>
      </div>

      <ProductReviewManager />
    </div>
  );
}
