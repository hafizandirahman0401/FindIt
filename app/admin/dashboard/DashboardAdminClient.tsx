"use client";

import { useEffect, useMemo, useState } from "react";

type StatusLaporan =
  | "Menunggu Verifikasi"
  | "Tersedia"
  | "Dalam Proses Pengambilan"
  | "Selesai";

type FilterJenis = "Semua" | "Hilang" | "Temuan";
type MenuAktif = "dashboard" | "laporan" | "riwayat";

type Laporan = {
  id: number;
  namaBarang: string;
  jenisLaporan: string;
  deskripsi: string;
  lokasi: string;
  tanggalKejadian: string;
  foto: string | null;
  status: string;
  createdAt: string;
  category: {
    namaKategori: string;
  };
  user: {
    id: number;
    nama: string;
    username: string | null;
  };
};

type NotifikasiAdmin = {
  id: number;
  reportId: number | null;
  jenis: string;
  pesan: string;
  isRead: boolean;
  createdAt: string;
  report: {
    id: number;
    namaBarang: string;
    jenisLaporan: string;
    status: string;
  } | null;
};

export default function DashboardAdminClient() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pencarian, setPencarian] = useState("");
  const [filterJenis, setFilterJenis] =
    useState<FilterJenis>("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [menuAktif, setMenuAktif] =
    useState<MenuAktif>("dashboard");
  const [laporanTerpilih, setLaporanTerpilih] =
    useState<Laporan | null>(null);
  const [pesan, setPesan] = useState("");
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [notifikasi, setNotifikasi] = useState<NotifikasiAdmin[]>([]);
  const [jumlahNotif, setJumlahNotif] = useState(0);
  const [bukaNotifikasi, setBukaNotifikasi] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);

  async function ambilLaporan() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/laporan", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        window.location.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil laporan.");
      }

      setLaporan(data.laporan || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil laporan."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilLaporan();
  }, []);

  async function ambilNotifikasi() {
    setLoadingNotif(true);
    try {
      const response = await fetch("/api/admin/notifikasi", {
        cache: "no-store",
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        window.location.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil notifikasi.");
      }

      setNotifikasi(data.notifikasi || []);
      setJumlahNotif(data.jumlahBelumDibaca ?? data.unreadCount ?? 0);
    } catch (err) {
      console.error("Gagal mengambil notifikasi admin:", err);
    } finally {
      setLoadingNotif(false);
    }
  }

  async function bacaNotifikasi(id: number, reportId: number | null) {
    try {
      const response = await fetch("/api/admin/notifikasi", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuka notifikasi.");
      }

      setNotifikasi((sebelumnya) =>
        sebelumnya.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
      setJumlahNotif((sebelumnya) => Math.max(0, sebelumnya - 1));
      setBukaNotifikasi(false);

      if (reportId !== null) {
        const laporanAda = laporan.find((item) => item.id === reportId);
        if (laporanAda) {
          setLaporanTerpilih(laporanAda);
          setMenuAktif("laporan");
        } else {
          await ambilLaporan();
          setMenuAktif("laporan");
          setPesan("Laporan terkait notifikasi dibuka. Silakan periksa daftar laporan.");
        }
      }
    } catch (err) {
      setPesan(
        err instanceof Error ? err.message : "Gagal membuka notifikasi."
      );
    }
  }

  useEffect(() => {
    ambilNotifikasi();
    const interval = window.setInterval(() => {
      ambilNotifikasi();
    }, 15000);
    return () => window.clearInterval(interval);
  }, []);

  async function ubahStatus(id: number, status: StatusLaporan) {
    setProsesId(id);
    setPesan("");

    try {
      const response = await fetch(`/api/admin/laporan/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status.");
      }

      setLaporan((sebelumnya) =>
        sebelumnya.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );

      setLaporanTerpilih((sebelumnya) =>
        sebelumnya?.id === id
          ? { ...sebelumnya, status }
          : sebelumnya
      );

      setPesan("Status laporan berhasil diperbarui.");
    } catch (err) {
      setPesan(
        err instanceof Error ? err.message : "Gagal mengubah status."
      );
    } finally {
      setProsesId(null);
    }
  }

  async function hapusLaporan(id: number) {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus laporan ini secara permanen?"
    );

    if (!yakin) return;

    setProsesId(id);
    setPesan("");

    try {
      const response = await fetch(`/api/admin/laporan/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus laporan.");
      }

      setLaporan((sebelumnya) =>
        sebelumnya.filter((item) => item.id !== id)
      );

      if (laporanTerpilih?.id === id) {
        setLaporanTerpilih(null);
      }

      setPesan("Laporan berhasil dihapus dari database.");
    } catch (err) {
      setPesan(
        err instanceof Error ? err.message : "Gagal menghapus laporan."
      );
    } finally {
      setProsesId(null);
    }
  }

  async function keluar() {
    try {
      const response = await fetch("/api/admin", {
        method: "DELETE",
      });

      if (!response.ok) {
        setPesan("Gagal keluar dari akun Admin.");
        return;
      }

      window.location.replace("/admin/login");
    } catch {
      setPesan("Tidak dapat terhubung ke server.");
    }
  }

  const jumlahHilang = laporan.filter(
    (item) => item.jenisLaporan === "Hilang"
  ).length;

  const jumlahTemuan = laporan.filter(
    (item) => item.jenisLaporan === "Temuan"
  ).length;

  const jumlahMenunggu = laporan.filter(
    (item) => item.status === "Menunggu Verifikasi"
  ).length;

  const jumlahTersedia = laporan.filter(
    (item) => item.status === "Tersedia"
  ).length;

  const jumlahDalamProses = laporan.filter(
    (item) => item.status === "Dalam Proses Pengambilan"
  ).length;

  const jumlahSelesai = laporan.filter(
    (item) => item.status === "Selesai"
  ).length;

  const laporanTersaring = useMemo(() => {
    return laporan.filter((item) => {
      const kataKunci = pencarian.toLowerCase().trim();

      const cocokPencarian = [
        item.namaBarang,
        item.category?.namaKategori,
        item.lokasi,
        item.deskripsi,
        item.user?.nama,
      ].some((nilai) =>
        String(nilai || "").toLowerCase().includes(kataKunci)
      );

      const cocokJenis =
        filterJenis === "Semua" ||
        item.jenisLaporan === filterJenis;

      const cocokStatus =
        filterStatus === "Semua" ||
        item.status === filterStatus;

      return cocokPencarian && cocokJenis && cocokStatus;
    });
  }, [laporan, pencarian, filterJenis, filterStatus]);

  const laporanSelesai = laporan.filter(
    (item) => item.status === "Selesai"
  );

  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function warnaStatus(status: string) {
    if (status === "Selesai") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "Tersedia") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "Dalam Proses Pengambilan") {
      return "border-purple-200 bg-purple-50 text-purple-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  function bukaMenu(menu: MenuAktif) {
    setMenuAktif(menu);
    setPesan("");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-medium text-slate-600">
          Memuat data laporan dari database...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-4xl">⚠️</p>
          <h1 className="mt-4 text-xl font-bold">
            Gagal Memuat Laporan
          </h1>
          <p className="mt-3 text-sm text-red-600">{error}</p>
          <button
            onClick={ambilLaporan}
            className="mt-6 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 md:flex">

      {/* SIDEBAR */}
      <aside className="flex w-full shrink-0 flex-col bg-[#173B70] text-white md:sticky md:top-0 md:h-screen md:w-64">
        <div className="border-b border-white/10 px-6 py-7">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl font-extrabold text-blue-800">
              F
            </span>
            <div>
              <h1 className="text-2xl font-extrabold">FindIt</h1>
              <p className="text-xs tracking-widest text-blue-200">
                ADMIN PANEL
              </p>
            </div>
          </a>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-blue-300">
            Menu Utama
          </p>

          <nav className="space-y-2">
            <button
              onClick={() => bukaMenu("dashboard")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                menuAktif === "dashboard"
                  ? "bg-white text-blue-800 shadow"
                  : "text-blue-100 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">▦</span>
              Dashboard
            </button>

            <button
              onClick={() => bukaMenu("laporan")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                menuAktif === "laporan"
                  ? "bg-white text-blue-800 shadow"
                  : "text-blue-100 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">▤</span>
              Semua Laporan
              <span className="ml-auto rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                {laporan.length}
              </span>
            </button>

            <button
              onClick={() => bukaMenu("riwayat")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                menuAktif === "riwayat"
                  ? "bg-white text-blue-800 shadow"
                  : "text-blue-100 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">◷</span>
              Riwayat
            </button>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/10 p-3">
            <p className="text-sm font-bold">Administrator</p>
            <p className="mt-1 text-xs text-blue-200">
              Pengelola FindIt
            </p>
          </div>

          <button
            onClick={keluar}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-100 hover:bg-red-500/20 hover:text-white"
          >
            <span className="text-lg">⇥</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="min-w-0 flex-1">

        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 md:px-10">
          <div>
            <p className="text-sm text-slate-500">
              FindIt / Panel Administrator
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-800">
              {menuAktif === "dashboard"
                ? "Dashboard"
                : menuAktif === "laporan"
                  ? "Semua Laporan"
                  : "Riwayat Laporan"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setBukaNotifikasi((sebelumnya) => !sebelumnya)}
                aria-label="Buka notifikasi admin"
                aria-expanded={bukaNotifikasi}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 transition hover:bg-slate-50"
              >
                🔔
                {jumlahNotif > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {jumlahNotif > 99 ? "99+" : jumlahNotif}
                  </span>
                )}
              </button>

              {bukaNotifikasi && (
                <>
                  <button
                    type="button"
                    aria-label="Tutup notifikasi"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setBukaNotifikasi(false)}
                  />
                  <div className="absolute right-0 z-40 mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                      <div>
                        <h3 className="font-bold text-slate-800">Notifikasi Admin</h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {jumlahNotif} belum dibaca
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={ambilNotifikasi}
                        disabled={loadingNotif}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                      >
                        {loadingNotif ? "Memuat..." : "Muat ulang"}
                      </button>
                    </div>

                    <div className="max-h-105 overflow-y-auto">
                      {notifikasi.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                          <div className="text-3xl">🔕</div>
                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            Belum ada notifikasi
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Notifikasi laporan baru akan muncul di sini.
                          </p>
                        </div>
                      ) : (
                        notifikasi.map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => bacaNotifikasi(item.id, item.reportId)}
                            className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-blue-50 ${
                              item.isRead ? "bg-white" : "bg-blue-50/70"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 text-xl">
                                {item.jenis === "LAPORAN_HILANG"
                                  ? "🔍"
                                  : item.jenis === "LAPORAN_TEMUAN"
                                    ? "📦"
                                    : "🔔"}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-slate-800">
                                  {item.jenis === "LAPORAN_HILANG"
                                    ? "Laporan Barang Hilang"
                                    : item.jenis === "LAPORAN_TEMUAN"
                                      ? "Laporan Barang Temuan"
                                      : "Notifikasi FindIt"}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-600">
                                  {item.pesan}
                                </span>
                                {item.report && (
                                  <span className="mt-1 block text-xs font-semibold text-blue-700">
                                    {item.report.namaBarang} · {item.report.status}
                                  </span>
                                )}
                                <span className="mt-2 block text-[11px] text-slate-400">
                                  {new Date(item.createdAt).toLocaleString("id-ID")}
                                </span>
                              </span>
                              {!item.isRead && (
                                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <a
              href="/"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Lihat Website ↗
            </a>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              A
            </div>
          </div>
        </header>

        <div className="p-5 md:p-10">

          {pesan && (
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-medium text-blue-800">
              {pesan}
            </div>
          )}

          {/* HALAMAN DASHBOARD */}
          {menuAktif === "dashboard" && (
            <>
              <div className="rounded-2xl bg-linear-to-r from-blue-800 to-blue-600 p-7 text-white shadow-sm md:p-9">
                <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                  Panel Administrator
                </p>
                <h1 className="mt-3 text-3xl font-extrabold">
                  Selamat Datang, Admin!
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                  Kelola laporan barang hilang dan barang temuan
                  yang dikirimkan oleh pengguna melalui sistem FindIt.
                </p>
                <button
                  onClick={() => bukaMenu("laporan")}
                  className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-800 hover:bg-blue-50"
                >
                  Kelola Semua Laporan →
                </button>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    judul: "Total Laporan",
                    angka: laporan.length,
                    keterangan: "Seluruh laporan masuk",
                    ikon: "▤",
                    warna: "bg-blue-50 text-blue-700",
                  },
                  {
                    judul: "Barang Hilang",
                    angka: jumlahHilang,
                    keterangan: "Laporan kehilangan",
                    ikon: "⌕",
                    warna: "bg-amber-50 text-amber-700",
                  },
                  {
                    judul: "Barang Temuan",
                    angka: jumlahTemuan,
                    keterangan: "Laporan penemuan",
                    ikon: "⌖",
                    warna: "bg-emerald-50 text-emerald-700",
                  },
                  {
                    judul: "Menunggu Verifikasi",
                    angka: jumlahMenunggu,
                    keterangan: "Perlu diperiksa admin",
                    ikon: "◷",
                    warna: "bg-orange-50 text-orange-700",
                  },
                ].map((item) => (
                  <article
                    key={item.judul}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-500">
                        {item.judul}
                      </p>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${item.warna}`}>
                        {item.ikon}
                      </span>
                    </div>
                    <p className="mt-5 text-3xl font-extrabold text-slate-800">
                      {item.angka}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {item.keterangan}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Barang Tersedia</p>
                  <p className="mt-2 text-2xl font-extrabold text-blue-700">
                    {jumlahTersedia}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">
                    Dalam Proses Pengambilan
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-purple-700">
                    {jumlahDalamProses}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Laporan Selesai</p>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                    {jumlahSelesai}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Total Barang Hilang</p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-700">
                    {jumlahHilang}
                  </p>
                </div>
              </div>

              {/* LAPORAN TERBARU */}
              <section className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                  <div>
                    <h3 className="text-lg font-extrabold">
                      Laporan Terbaru
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Laporan yang terakhir masuk ke sistem.
                    </p>
                  </div>
                  <button
                    onClick={() => bukaMenu("laporan")}
                    className="text-sm font-bold text-blue-700 hover:text-blue-900"
                  >
                    Lihat Semua →
                  </button>
                </div>

                {laporan.length === 0 ? (
                  <div className="p-12 text-center text-sm text-slate-500">
                    Belum ada laporan dari pengguna.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {[...laporan]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .slice(0, 5)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-slate-50"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            {item.foto ? (
                              <img
                                src={item.foto}
                                alt={item.namaBarang}
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                📦
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-bold">
                                {item.namaBarang}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {item.jenisLaporan} · {item.lokasi}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${warnaStatus(item.status)}`}>
                              {item.status}
                            </span>
                            <button
                              onClick={() => setLaporanTerpilih(item)}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                            >
                              Detail
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* HALAMAN SEMUA LAPORAN */}
          {menuAktif === "laporan" && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
                <div>
                  <h3 className="text-lg font-extrabold">
                    Semua Laporan
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Periksa dan kelola seluruh laporan pengguna.
                  </p>
                </div>
                <button
                  onClick={ambilLaporan}
                  className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  ↻ Muat Ulang
                </button>
              </div>

              <div className="space-y-4 border-b border-slate-100 bg-slate-50/70 p-6">
                <div>
                  <label
                    htmlFor="pencarian-laporan"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Cari laporan
                  </label>
                  <input
                    id="pencarian-laporan"
                    type="text"
                    value={pencarian}
                    onChange={(e) => setPencarian(e.target.value)}
                    placeholder="Cari nama barang, kategori, lokasi, atau pelapor..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Jenis laporan
                    </label>
                    <select
                      value={filterJenis}
                      onChange={(e) =>
                        setFilterJenis(e.target.value as FilterJenis)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    >
                      <option value="Semua">Semua Jenis</option>
                      <option value="Hilang">Barang Hilang</option>
                      <option value="Temuan">Barang Temuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Status laporan
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Menunggu Verifikasi">
                        Menunggu Verifikasi
                      </option>
                      <option value="Tersedia">Tersedia</option>
                      <option value="Dalam Proses Pengambilan">
                        Dalam Proses Pengambilan
                      </option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <p className="text-sm text-slate-500">
                  Menampilkan{" "}
                  <strong className="text-blue-700">
                    {laporanTersaring.length}
                  </strong>{" "}
                  dari {laporan.length} laporan.
                </p>
              </div>

              {laporanTersaring.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-4xl">📭</p>
                  <h3 className="mt-4 font-bold">
                    Laporan tidak ditemukan
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Coba kata kunci atau filter yang berbeda.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-250 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Foto</th>
                        <th className="px-5 py-4">Nama Barang</th>
                        <th className="px-5 py-4">Pelapor</th>
                        <th className="px-5 py-4">Jenis</th>
                        <th className="px-5 py-4">Kategori</th>
                        <th className="px-5 py-4">Lokasi</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {laporanTersaring.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/50">
                          <td className="px-5 py-4">
                            {item.foto ? (
                              <img
                                src={item.foto}
                                alt={item.namaBarang}
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                                📦
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            {item.namaBarang}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {item.user?.nama || "-"}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                              {item.jenisLaporan}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {item.category?.namaKategori || "-"}
                          </td>

                          <td className="px-5 py-4">
                            {item.lokasi}
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={item.status}
                              disabled={prosesId === item.id}
                              onChange={(e) =>
                                ubahStatus(
                                  item.id,
                                  e.target.value as StatusLaporan
                                )
                              }
                              className={`rounded-lg border px-3 py-2 text-xs font-bold outline-none disabled:opacity-50 ${warnaStatus(item.status)}`}
                            >
                              <option value="Menunggu Verifikasi">
                                Menunggu Verifikasi
                              </option>
                              <option value="Tersedia">Tersedia</option>
                              <option value="Dalam Proses Pengambilan">
                                Dalam Proses Pengambilan
                              </option>
                              <option value="Selesai">Selesai</option>
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setLaporanTerpilih(item)}
                                className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                              >
                                Detail
                              </button>

                              <button
                                onClick={() => hapusLaporan(item.id)}
                                disabled={prosesId === item.id}
                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* HALAMAN RIWAYAT */}
          {menuAktif === "riwayat" && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h3 className="text-lg font-extrabold">
                  Riwayat Laporan Selesai
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Daftar laporan yang telah diselesaikan.
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6 rounded-xl bg-emerald-50 p-5">
                  <p className="text-sm font-semibold text-emerald-800">
                    Total Laporan Selesai
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                    {laporanSelesai.length}
                  </p>
                </div>

                {laporanSelesai.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-4xl">📂</p>
                    <h3 className="mt-4 font-bold">
                      Belum Ada Riwayat
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Laporan yang berstatus Selesai akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {laporanSelesai.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              alt={item.namaBarang}
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                              📦
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-bold">{item.namaBarang}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.jenisLaporan} · {item.user?.nama || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.lokasi}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            Selesai
                          </span>
                          <button
                            onClick={() => setLaporanTerpilih(item)}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            Dashboard Admin FindIt — Data terhubung langsung ke MySQL.
          </p>
        </div>
      </div>

      {/* MODAL DETAIL LAPORAN */}
      {laporanTerpilih && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setLaporanTerpilih(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between bg-linear-to-r from-blue-800 to-blue-600 p-6 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  Informasi Laporan
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Detail Barang
                </h2>
              </div>

              <button
                onClick={() => setLaporanTerpilih(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-2xl hover:bg-white/20"
              >
                ×
              </button>
            </div>

            <div className="max-h-[65vh] space-y-6 overflow-y-auto p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {laporanTerpilih.jenisLaporan}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${warnaStatus(laporanTerpilih.status)}`}>
                  {laporanTerpilih.status}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold">
                {laporanTerpilih.namaBarang}
              </h3>

              {laporanTerpilih.foto ? (
                <img
                  src={laporanTerpilih.foto}
                  alt={laporanTerpilih.namaBarang}
                  className="max-h-80 w-full rounded-2xl border border-slate-200 object-contain"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-50 text-5xl">
                  📦
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Nama Pelapor</p>
                  <p className="mt-2 font-bold">
                    {laporanTerpilih.user?.nama || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Kategori</p>
                  <p className="mt-2 font-bold">
                    {laporanTerpilih.category?.namaKategori || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Lokasi</p>
                  <p className="mt-2 font-bold">
                    {laporanTerpilih.lokasi}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Tanggal Kejadian</p>
                  <p className="mt-2 font-bold">
                    {formatTanggal(laporanTerpilih.tanggalKejadian)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold">Deskripsi Lengkap</h3>
                <p className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-7 text-slate-600">
                  {laporanTerpilih.deskripsi}
                </p>
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Ubah Status Laporan
                </label>
                <select
                  value={laporanTerpilih.status}
                  disabled={prosesId === laporanTerpilih.id}
                  onChange={(e) =>
                    ubahStatus(
                      laporanTerpilih.id,
                      e.target.value as StatusLaporan
                    )
                  }
                  className={`w-full rounded-xl border px-4 py-3 font-semibold ${warnaStatus(laporanTerpilih.status)}`}
                >
                  <option value="Menunggu Verifikasi">
                    Menunggu Verifikasi
                  </option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Dalam Proses Pengambilan">
                    Dalam Proses Pengambilan
                  </option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-5">
              <button
                onClick={() => setLaporanTerpilih(null)}
                className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800"
              >
                Tutup
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}