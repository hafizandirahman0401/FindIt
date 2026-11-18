import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Akses ditolak. Silakan login sebagai Admin." },
        { status: 401 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Kamu tidak memiliki akses Admin." },
        { status: 403 }
      );
    }

    const laporan = await prisma.report.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            nama: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      laporan,
    });
  } catch (error) {
    console.error("Gagal mengambil laporan Admin:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil laporan." },
      { status: 500 }
    );
  }
}