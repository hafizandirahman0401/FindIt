
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  jumlah: number;
};

export default function MarkAllNotificationsRead({
  jumlah,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  async function tandaiSemuaDibaca() {
    try {
      setLoading(true);
      setPesan("");

      const response = await fetch("/api/riwayat/notifikasi", {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui notifikasi.");
      }

      setPesan("Semua notifikasi sudah dibaca.");
      router.refresh();
    } catch (error) {
      setPesan(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  if (jumlah === 0) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={tandaiSemuaDibaca}
        disabled={loading}
        className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : "✓ Tandai Semua Dibaca"}
      </button>

      {pesan && (
        <p className="text-xs font-medium text-slate-600">
          {pesan}
        </p>
      )}
    </div>
  );
}
