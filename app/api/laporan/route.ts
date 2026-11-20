import { revalidatePath } from "next/cache";

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

    // Pastikan akun masih tersedia
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Akun pengguna tidak ditemukan." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const jenis = String(body.jenis ?? "").trim();
    const nama = String(body.nama ?? "").trim();
    const kategori = String(body.kategori ?? "").trim();
    const lokasi = String(body.lokasi ?? "").trim();
    const deskripsi = String(body.deskripsi ?? "").trim();
    const foto = body.foto ? String(body.foto) : null;
    const tanggal = String(body.tanggal ?? "").trim();

    // Data WhatsApp
    const nomorInput = String(body.kontakPelapor ?? "").trim();
    const consentKontak = body.consentKontak === true;

    // Ambil angka saja dari nomor WhatsApp
    const kontakPelapor = nomorInput.replace(/\D/g, "");

    // Validasi data wajib
    if (!nama || !kategori || !lokasi || !deskripsi || !tanggal) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (!["Hilang", "Temuan"].includes(jenis)) {
      return NextResponse.json(
        { message: "Jenis laporan tidak valid." },
        { status: 400 }
      );
    }

    // Jika pengguna menyetujui kontak ditampilkan,
    // nomor WhatsApp wajib diisi dan harus valid
    if (consentKontak) {
      if (
        !kontakPelapor ||
        kontakPelapor.length < 10 ||
        kontakPelapor.length > 15
      ) {
        return NextResponse.json(
          { message: "Masukkan nomor WhatsApp yang valid." },
          { status: 400 }
        );
      }
    }

    const tanggalKejadian = new Date(`${tanggal}T00:00:00`);

    if (Number.isNaN(tanggalKejadian.getTime())) {
      return NextResponse.json(
        { message: "Tanggal kejadian tidak valid." },
        { status: 400 }
      );
    }

    if (
      foto &&
      (!foto.startsWith("data:image/") || foto.length > 2_000_000)
    ) {
      return NextResponse.json(
        { message: "Foto tidak valid atau ukurannya terlalu besar." },
        { status: 400 }
      );
    }

    // Simpan kategori dan laporan dalam satu transaksi
    const laporan = await prisma.$transaction(async (tx) => {
      const dataKategori = await tx.category.upsert({
        where: {
          namaKategori: kategori,
        },
        update: {},
        create: {
          namaKategori: kategori,
        },
      });

      return tx.report.create({
        data: {
          userId: user.id,
          categoryId: dataKategori.id,
          namaBarang: nama,
          jenisLaporan: jenis,
          deskripsi,
          lokasi,
          tanggalKejadian,
          foto,

          // Simpan WhatsApp hanya jika pengguna menyetujui
          kontakPelapor: consentKontak ? kontakPelapor : null,
          consentKontak,

          status: "Menunggu Verifikasi",

          statusHistory: {
            create: {
              statusSebelumnya: null,
              statusBaru: "Menunggu Verifikasi",
              catatan: "Laporan baru dibuat oleh pengguna.",
              changedBy: user.id,
            },
          },
        },
        include: {
          category: true,
        },
      });
    });

    // Buat notifikasi admin setelah laporan berhasil disimpan
    await prisma.adminNotification.create({
      data: {
        reportId: laporan.id,
        jenis: jenis === "Hilang" ? "LAPORAN_HILANG" : "LAPORAN_TEMUAN",
        pesan:
          jenis === "Hilang"
            ? `Laporan barang hilang baru masuk: ${nama}. Lokasi: ${lokasi}.`
            : `Laporan barang temuan baru masuk: ${nama}. Lokasi: ${lokasi}.`,
      },
    });

    // Perbarui halaman Beranda setelah laporan baru disimpan
      revalidatePath("/");
      revalidatePath("/barang-hilang");
      revalidatePath("/barang-temuan");

    return NextResponse.json(
      {
        message: "Laporan berhasil disimpan ke database.",
        laporan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menyimpan laporan:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan laporan." },
      { status: 500 }
    );
  }
}
