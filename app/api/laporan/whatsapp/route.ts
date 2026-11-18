
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Pastikan pengguna sudah login
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Ambil ID laporan
    const body = await request.json();
    const reportId = Number(body.reportId);

    if (!Number.isInteger(reportId) || reportId <= 0) {
      return NextResponse.json(
        { message: "ID laporan tidak valid." },
        { status: 400 }
      );
    }

    // Pastikan laporan tersedia
    const laporan = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        namaBarang: true,
        jenisLaporan: true,
      },
    });

    if (!laporan) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Simpan notifikasi untuk Admin
    await prisma.adminNotification.create({
      data: {
        reportId: laporan.id,
        jenis: "WHATSAPP",
        pesan: `Pengguna membuka WhatsApp untuk menanyakan barang "${laporan.namaBarang}" (${laporan.jenisLaporan}).`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Aktivitas WhatsApp berhasil dicatat.",
    });
  } catch (error) {
    console.error("Gagal mencatat aktivitas WhatsApp:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
