/**
 * Diagnostic script to check if the products table exists and is properly configured
 * Run this to diagnose issues with product creation
 */

import { createClient } from "@/lib/supabase/client";

async function checkProductsTable() {
  console.log("=== Products Table Diagnostic ===\n");

  const supabase = createClient();

  // Check 1: Can we connect to Supabase?
  console.log("1. Checking Supabase connection...");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("❌ Authentication failed:", authError);
    return;
  }
  console.log("✅ Connected as:", user.email);
  console.log("   User ID:", user.id);

  // Check 2: Does the products table exist?
  console.log("\n2. Checking if products table exists...");
  const { data: tables, error: tableError } = await supabase
    .from("products")
    .select("*")
    .limit(0);

  if (tableError) {
    console.error("❌ Table check failed:", tableError);
    console.error("   This likely means the products table does not exist.");
    console.error("   Please run the schema: database/products_schema.sql");
    return;
  }
  console.log("✅ Products table exists");

  // Check 3: Can we read from the table?
  console.log("\n3. Checking read permissions...");
  const { data: products, error: readError } = await supabase
    .from("products")
    .select("*");

  if (readError) {
    console.error("❌ Read failed:", readError);
    return;
  }
  console.log("✅ Can read from products table");
  console.log(`   Found ${products?.length || 0} products`);

  // Check 4: Try to insert a test product
  console.log("\n4. Testing insert permissions...");
  const testProduct = {
    name: "Test Product - DELETE ME",
    price: 9.99,
    condition: "New",
    image: "https://via.placeholder.com/400",
    category: "Test",
    description: "This is a test product created by the diagnostic script",
    author_id: user.id,
  };

  const { data: insertedProduct, error: insertError } = await supabase
    .from("products")
    .insert(testProduct)
    .select()
    .single();

  if (insertError) {
    console.error("❌ Insert failed:", insertError);
    console.error("   Error code:", insertError.code);
    console.error("   Error message:", insertError.message);
    console.error("   Error details:", insertError.details);
    console.error("   Error hint:", insertError.hint);
    return;
  }
  console.log("✅ Successfully inserted test product");
  console.log("   Product ID:", insertedProduct?.id);

  // Check 5: Clean up test product
  console.log("\n5. Cleaning up test product...");
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", insertedProduct.id);

  if (deleteError) {
    console.error("❌ Delete failed:", deleteError);
    console.error(
      "   Please manually delete the test product with ID:",
      insertedProduct.id,
    );
    return;
  }
  console.log("✅ Test product deleted");

  console.log("\n=== All checks passed! ===");
  console.log("The products table is properly configured.");
}

// Run the diagnostic
checkProductsTable().catch(console.error);
