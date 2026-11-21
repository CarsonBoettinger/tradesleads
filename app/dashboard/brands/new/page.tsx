import { connection } from "next/server";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth/profile";
import { AddBusinessForm } from "@/components/dashboard/add-business-form";

export const instant = false;

export default async function NewBrandPage() {
  await connection();
  const staff = await requireStaff();
  if (!staff) redirect("/dashboard");
  return <AddBusinessForm />;
}
