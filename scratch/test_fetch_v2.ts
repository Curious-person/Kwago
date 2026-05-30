import { createClient } from "@supabase/supabase-js";

// Manual env config for scratch script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function testFetch() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(category_id, categories(name))")
    .limit(5);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Results count:", data.length);
  data.forEach((p, i) => {
    console.log(`Product ${i}:`, p.name);
    console.log(`  - Legacy Category:`, p.category);
    console.log(`  - PC Data:`, JSON.stringify(p.product_categories, null, 2));
  });
}

testFetch();
