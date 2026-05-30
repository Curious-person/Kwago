"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  DollarSign,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import {
  createProduct,
  checkProductNameExists,
} from "@/lib/services/productService";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { fetchCategories } from "@/app/dashboard/author/categories/actions";
import { Category } from "@/lib/types/category";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  price: z
    .number({ message: "Price must be a valid number" })
    .min(0.01, "Price must be greater than 0"),
  condition: z.enum(["New", "Used"]),
  category_ids: z.array(z.string()).min(1, "At least one category is required"),
  image: z
    .string()
    .min(1, "Image URL is required")
    .url("Image must be a valid URL"),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: `temp-${Date.now()}`,
      name: "",
      price: 0,
      condition: "New",
      category_ids: [],
      image:
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = form;
  const watchedValues = watch();

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAIReviewModalOpen, setIsAIReviewModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    [],
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories on mount
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.success && response.data) {
          setAvailableCategories(response.data as Category[]);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const categoryOptions = availableCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const handleConditionToggle = () => {
    setValue("condition", watchedValues.condition === "New" ? "Used" : "New", {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsCreating(true);
    setCreateError(null);

    // Check for duplicates
    const excludeId = data.id?.startsWith("temp-") ? undefined : data.id;
    const existsResponse = await checkProductNameExists(data.name, excludeId);
    if (existsResponse.success && existsResponse.data) {
      setCreateError(
        "A product with this name already exists in your inventory.",
      );
      setIsCreating(false);
      return;
    }

    const response = await createProduct({
      name: data.name,
      price: data.price,
      condition: data.condition,
      image: data.image,
      category_ids: data.category_ids,
      description: data.description,
    });

    if (!response.success) {
      setCreateError(response.error.message);
      setIsCreating(false);
      return;
    }

    // Success - show AI modal first
    setCreatedProduct(response.data);
    setIsCreating(false);
    setIsAIReviewModalOpen(true);

    // Transition to success modal after simulation
    setTimeout(() => {
      setIsAIReviewModalOpen(false);
      setTimeout(() => {
        setIsPublishModalOpen(true);
        // Reset form to defaults
        reset({
          id: `temp-${Date.now()}`,
          name: "",
          price: 0,
          condition: "New",
          category_ids: [],
          image:
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
          description: "",
        });
      }, 300);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/author/products")}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
              {watchedValues.id?.startsWith("temp-")
                ? "Add Product"
                : "Edit Product"}
            </h1>
            <p className="text-zinc-500 text-sm">
              {watchedValues.id?.startsWith("temp-")
                ? "Add a new collectible to your inventory."
                : "Update the product details."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push("/dashboard/author/products")}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="gap-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Product</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Error Display */}
          {createError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Failed to create product
                  </p>
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Product Image
              </label>
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100 group">
                <img
                  src={watchedValues.image || ""}
                  alt={watchedValues.name || "Product"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon size={24} className="text-white" />
                </div>
              </div>
              <Input
                {...register("image")}
                placeholder="Image URL"
                className={`bg-zinc-50 ${errors.image ? "border-red-500 focus:ring-red-500" : ""}`}
                disabled={isCreating}
              />
              {errors.image && (
                <p className="text-xs text-red-500">{errors.image.message}</p>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Product Name
                </label>
                <Input
                  {...register("name")}
                  placeholder="e.g. Marvel Legends Iron Man Mark LXXXV"
                  className={`text-xl font-bold py-6 px-6 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                  disabled={isCreating}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="29.99"
                      className={`pl-10 h-12 ${errors.price ? "border-red-500 focus:ring-red-500" : ""}`}
                      disabled={isCreating}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Condition
                  </label>
                  <div
                    className={`h-12 flex items-center justify-between px-4 bg-zinc-100 rounded-full transition-colors ${
                      isCreating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-zinc-200"
                    }`}
                    onClick={isCreating ? undefined : handleConditionToggle}
                  >
                    <span className="text-sm font-bold text-zinc-900">
                      {watchedValues.condition}
                    </span>
                    <Badge
                      variant={
                        watchedValues.condition === "New"
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full h-6 px-3"
                    >
                      Toggle
                    </Badge>
                  </div>
                  {errors.condition && (
                    <p className="text-xs text-red-500">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Categories
                </label>
                <Controller
                  name="category_ids"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={categoryOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select product categories..."
                      disabled={isCreating || isLoadingCategories}
                    />
                  )}
                />
                {errors.category_ids && (
                  <p className="text-xs text-red-500">
                    {errors.category_ids.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Description (Optional)
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Add a detailed description of your product..."
                  className={`w-full min-h-[120px] px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-y disabled:opacity-50 disabled:cursor-not-allowed ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
                  disabled={isCreating}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-10">
          <section className="bg-zinc-50 p-6 rounded-[24px] border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
              Quick Preview
            </h3>
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-200">
                <img
                  src={watchedValues.image || ""}
                  alt={watchedValues.name || "Product preview"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {watchedValues.category_ids &&
                  watchedValues.category_ids.length > 0
                    ? availableCategories.find(
                        (c) => c.id === watchedValues.category_ids[0],
                      )?.name
                    : "Uncategorized"}
                  {watchedValues.category_ids &&
                    watchedValues.category_ids.length > 1 &&
                    ` +${watchedValues.category_ids.length - 1}`}
                </Badge>
                <h4 className="font-bold text-zinc-900 leading-tight line-clamp-2 text-lg">
                  {watchedValues.name || "Untitled Product"}
                </h4>
                <p className="text-2xl font-bold text-[#0066FF]">
                  ${(watchedValues.price || 0).toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${watchedValues.condition === "New" ? "bg-[#0066FF]" : "bg-zinc-400"}`}
                  />
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {watchedValues.condition}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={isAIReviewModalOpen} onOpenChange={setIsAIReviewModalOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border border-zinc-100 shadow-none bg-white rounded-2xl [&>button]:hidden">
          <div className="p-12 space-y-8 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-amber-400/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center ring-1 ring-amber-100 z-10">
                <Sparkles className="text-amber-500 animate-pulse" size={32} />
              </div>
            </div>
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                AI Content Review
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                Our AI moderation system is analyzing your product details and
                image to ensure they meet community guidelines.
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border border-zinc-100 shadow-none bg-white rounded-2xl">
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/5 flex items-center justify-center mb-6 ring-1 ring-[#0066FF]/10">
                <CheckCircle2 className="text-[#0066FF]" size={28} />
              </div>
              <DialogTitle className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                Product Saved Successfully
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm leading-relaxed">
                Your collectible has been added to your inventory. It is now
                visible in your product list.
              </DialogDescription>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                    Product Details
                  </p>
                  <p className="text-sm font-medium text-zinc-600">
                    {watchedValues.name || "Untitled Product"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsPublishModalOpen(false)}
              className="flex-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              Add Another
            </Button>
            <Button
              onClick={() => router.push("/dashboard/author/products")}
              className="flex-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              View Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
