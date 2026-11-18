
"use client";

import { useEffect, useState } from "react";

export default function NotificationBadge() {
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    let aktif = true;

    async function ambilNotifikasi() {
      try {
        const response = await fetch("/api/riwayat/notifikasi", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (aktif) {
          setJumlah(data.jumlahBelumDibaca ?? 0);
        }
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    }

    ambilNotifikasi();

    // Periksa notifikasi setiap 15 detik
    const interval = setInterval(ambilNotifikasi, 15000);

    return () => {
      aktif = false;
      clearInterval(interval);
    };
  }, []);

  if (jumlah === 0) return null;

  return (
    <span className="ml-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-extrabold text-white">
      {jumlah > 99 ? "99+" : jumlah}
    </span>
  );
}
