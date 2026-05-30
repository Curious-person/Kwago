import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export default async function DashboardPage() {
  const role = await getUserRole();

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "author") {
    redirect("/dashboard/author/posts");
  }

  // member or unauthenticated → home
  redirect("/");
}
