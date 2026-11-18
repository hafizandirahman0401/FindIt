
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import DashboardAdminClient from "./DashboardAdminClient";

export default function DashboardAdminPage() {
  return (
    <Suspense fallback={<div>Memuat dashboard admin...</div>}>
      <DashboardAdminContent />
    </Suspense>
  );
}

async function DashboardAdminContent() {
  // Periksa session Admin
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Pastikan akun masih memiliki role ADMIN di database
  const admin = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <DashboardAdminClient />;
}
