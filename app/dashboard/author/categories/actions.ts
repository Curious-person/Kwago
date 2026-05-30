"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Category, CategoryApiResponse } from "@/lib/types/category";

export async function fetchCategories(): Promise<CategoryApiResponse> {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch categories with linked products and their images
    const { data: categoriesData, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        product_categories (
          products (
            image
          )
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching categories:", error);
      throw new Error(error.message);
    }

    const mappedCategories: Category[] = (categoriesData || []).map(
      (cat: any) => {
        // Extract images from the joined products
        const productImages = (cat.product_categories || [])
          .map((pc: any) => pc.products?.image)
          .filter(Boolean);

        return {
          id: cat.id,
          name: cat.name,
          description: cat.description,
          author_id: cat.author_id,
          product_count: productImages.length,
          product_images: productImages.slice(0, 3), // Show first 3 images
          created_at: cat.created_at,
          updated_at: cat.updated_at,
        };
      },
    );

    return {
      success: true,
      data: mappedCategories,
    };
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch categories",
    };
  }
}

export async function createCategory(
  name: string,
  description?: string,
): Promise<CategoryApiResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const newCategory = {
      name,
      description,
      author_id: userData.user.id,
    };

    const { data, error } = await supabase
      .from("categories")
      .insert(newCategory)
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating category:", error);
      return { success: false, error: error.message };
    }

    const mappedCategory: Category = {
      id: data.id,
      name: data.name,
      description: data.description,
      author_id: data.author_id,
      product_count: 0,
      product_images: [],
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return { success: true, data: mappedCategory };
  } catch (error: any) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: error.message || "Failed to create category",
    };
  }
}

export async function updateCategory(
  id: string,
  name: string,
  description?: string,
): Promise<CategoryApiResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("categories")
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("author_id", userData.user.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating category:", error);
      return { success: false, error: error.message };
    }

    const mappedCategory: Category = {
      id: data.id,
      name: data.name,
      description: data.description,
      author_id: data.author_id,
      product_count: 0, // In real scenario, preserve or recalculate
      product_images: [],
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return { success: true, data: mappedCategory };
  } catch (error: any) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: error.message || "Failed to update category",
    };
  }
}

export async function deleteCategory(id: string): Promise<CategoryApiResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("author_id", userData.user.id);

    if (error) {
      console.error("Supabase error deleting category:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error.message || "Failed to delete category",
    };
  }
}
