
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { kirimNotifikasiStatus } from "@/lib/email";

type Props = {
  params: Promise<{ id: string }>;
};

const STATUS_VALID = [
  "Menunggu Verifikasi",
  "Tersedia",
  "Dalam Proses Pengambilan",
  "Selesai",
];

async function periksaAdmin() {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    return null;
  }

  return admin;
}

// MENGUBAH STATUS LAPORAN
export async function PATCH(request: Request, { params }: Props) {
  try {
    const admin = await periksaAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Akses ditolak. Silakan login sebagai Admin." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const reportId = Number(id);

    if (!Number.isInteger(reportId) || reportId <= 0) {
      return NextResponse.json(
        { message: "ID laporan tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const statusBaru = String(body.status ?? "").trim();
    const catatan = String(body.catatan ?? "").trim();

    if (!STATUS_VALID.includes(statusBaru)) {
      return NextResponse.json(
        { message: "Status laporan tidak valid." },
        { status: 400 }
      );
    }

    const hasil = await prisma.$transaction(async (tx) => {
      const laporan = await tx.report.findUnique({
        where: { id: reportId },
        include: {
          user: {
            select: {
              nama: true,
              email: true,
            },
          },
        },
      });

      if (!laporan) {
        throw new Error("LAPORAN_TIDAK_DITEMUKAN");
      }

      if (laporan.status === statusBaru) {
        return {
          laporan,
          statusBerubah: false,
        };
      }

      const laporanDiperbarui = await tx.report.update({
        where: { id: reportId },
        data: {
          status: statusBaru,
          statusHistory: {
            create: {
              statusSebelumnya: laporan.status,
              statusBaru,
              catatan: catatan || "Status diperbarui oleh Admin.",
              changedBy: admin.id,
            },
          },
        },
        include: {
          user: {
            select: {
              nama: true,
              email: true,
            },
          },
        },
      });

      return {
        laporan: laporanDiperbarui,
        statusBerubah: true,
      };
    });

    // KIRIM EMAIL JIKA STATUS BENAR-BENAR BERUBAH
    let emailTerkirim = false;

    if (
      hasil.statusBerubah &&
      hasil.laporan.user.email
    ) {
      try {
        await kirimNotifikasiStatus({
          email: hasil.laporan.user.email,
          nama: hasil.laporan.user.nama,
          namaBarang: hasil.laporan.namaBarang,
          status: hasil.laporan.status,
        });

        emailTerkirim = true;
      } catch (emailError) {
        console.error("Gagal mengirim notifikasi email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: hasil.statusBerubah
        ? "Status laporan berhasil diperbarui."
        : "Status laporan tidak berubah.",
      emailTerkirim,
      laporan: hasil.laporan,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "LAPORAN_TIDAK_DITEMUKAN"
    ) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan." },
        { status: 404 }
      );
    }

    console.error("Gagal mengubah status:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengubah status." },
      { status: 500 }
    );
  }
}

// MENGHAPUS LAPORAN
export async function DELETE(_request: Request, { params }: Props) {
  try {
    const admin = await periksaAdmin();

    if (!admin) {
      return NextResponse.json(
        { message: "Akses ditolak. Silakan login sebagai Admin." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const reportId = Number(id);

    if (!Number.isInteger(reportId) || reportId <= 0) {
      return NextResponse.json(
        { message: "ID laporan tidak valid." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const laporan = await tx.report.findUnique({
        where: { id: reportId },
        select: { id: true },
      });

      if (!laporan) {
        throw new Error("LAPORAN_TIDAK_DITEMUKAN");
      }

      await tx.reportStatusHistory.deleteMany({
        where: { reportId },
      });

      await tx.report.delete({
        where: { id: reportId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Laporan berhasil dihapus.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "LAPORAN_TIDAK_DITEMUKAN"
    ) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan." },
        { status: 404 }
      );
    }

    console.error("Gagal menghapus laporan:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus laporan." },
      { status: 500 }
    );
  }
}
