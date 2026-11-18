
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Mengambil jumlah notifikasi yang belum dibaca
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const jumlah = await prisma.reportStatusHistory.count({
      where: {
        isRead: false,
        report: {
          userId: session.userId,
        },
      },
    });

    return NextResponse.json({
      jumlahBelumDibaca: jumlah,
    });
  } catch (error) {
    console.error("Gagal mengambil notifikasi:", error);

    return NextResponse.json(
      { message: "Gagal mengambil notifikasi." },
      { status: 500 }
    );
  }
}

// PATCH: Menandai semua notifikasi pengguna sebagai sudah dibaca
export async function PATCH() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const hasil = await prisma.reportStatusHistory.updateMany({
      where: {
        isRead: false,
        report: {
          userId: session.userId,
        },
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      message: "Semua notifikasi berhasil ditandai sudah dibaca.",
      jumlahDibaca: hasil.count,
    });
  } catch (error) {
    console.error("Gagal memperbarui notifikasi:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui notifikasi." },
      { status: 500 }
    );
  }
}
