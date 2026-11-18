
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

// GET: Mengambil notifikasi admin
export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Akses ditolak. Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const [notifikasi, jumlahBelumDibaca] = await Promise.all([
      prisma.adminNotification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        include: {
          report: {
            select: {
              id: true,
              namaBarang: true,
              jenisLaporan: true,
              status: true,
            },
          },
        },
      }),

      prisma.adminNotification.count({
        where: {
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      notifikasi,
      jumlahBelumDibaca,
    });
  } catch (error) {
    console.error("Gagal mengambil notifikasi admin:", error);

    return NextResponse.json(
      { message: "Gagal mengambil notifikasi admin." },
      { status: 500 }
    );
  }
}

// PATCH: Menandai notifikasi admin sudah dibaca
export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Akses ditolak. Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID notifikasi tidak valid." },
        { status: 400 }
      );
    }

    const hasil = await prisma.adminNotification.updateMany({
      where: {
        id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    if (hasil.count === 0) {
      const notifikasi = await prisma.adminNotification.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!notifikasi) {
        return NextResponse.json(
          { message: "Notifikasi tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Notifikasi berhasil ditandai sudah dibaca.",
    });
  } catch (error) {
    console.error("Gagal memperbarui notifikasi admin:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui notifikasi admin." },
      { status: 500 }
    );
  }
}
