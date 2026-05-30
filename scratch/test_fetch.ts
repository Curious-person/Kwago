import { createClient } from "./lib/supabase/client";

async function testFetch() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(category_id, categories(name))")
    .limit(1);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Product Data:", JSON.stringify(data, null, 2));
}

testFetch();
