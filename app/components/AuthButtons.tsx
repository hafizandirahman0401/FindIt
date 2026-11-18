"use client";

import { useEffect, useState } from "react";

export default function AuthButtons() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cekLogin() {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const hasil = await response.json();
          setIsLogin(!!hasil.user);
        } else {
          setIsLogin(false);
        }
      } catch {
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    }

    cekLogin();
  }, []);

  async function handleLogout() {
    const yakin = window.confirm("Apakah kamu yakin ingin logout?");

    if (!yakin) return;

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        alert("Logout gagal. Silakan coba lagi.");
      }
    } catch {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  }

  if (loading) return null;

  if (!isLogin) {
    return (
      <a
        href="/login"
        className="shrink-0 rounded-xl border border-blue-200 px-4 py-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50 sm:text-sm"
      >
        Login
      </a>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="shrink-0 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-700 sm:text-sm"
    >
      Logout
    </button>
  );
}