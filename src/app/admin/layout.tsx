import { cookies } from "next/headers";
import AdminLogin from "@/components/admin/AdminLogin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuth = session?.value === process.env.ADMIN_PASSWORD;

  if (!isAuth) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
