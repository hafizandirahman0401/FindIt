"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lihatPassword, setLihatPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const hasil = await response.json();

      if (!response.ok) {
        alert(hasil.message || "Login gagal.");
        return;
      }

      alert("Login berhasil! Selamat datang di FindIt.");
      window.location.href = "/";
    } catch (error) {
      console.error("Kesalahan login:", error);
      alert("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F3F7FF] px-5 py-10">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm">

        {/* CARD LOGIN */}
        <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_70px_-20px_rgba(30,64,175,0.22)]">

          {/* HEADER */}
          <div className="bg-linear-to-br from-[#173B70] via-blue-800 to-blue-600 px-6 py-6 text-center text-white">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl font-extrabold backdrop-blur">
              F
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              User Area
            </p>

            <h1 className="mt-2 text-2xl font-extrabold">
              Selamat Datang!
            </h1>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Masuk ke akun untuk menggunakan layanan FindIt.
            </p>
          </div>

          {/* FORM */}
          <div className="p-5">

            <form onSubmit={handleLogin} className="space-y-4">

              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Username
                </label>

                <div className="group relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition-colors duration-200 group-hover:text-blue-600 group-focus-within:text-blue-700">
                    ♙
                  </span>

                  <input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-blue-300 hover:bg-white hover:shadow-md hover:shadow-blue-100/60 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100/80 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <div className="group relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition-colors duration-200 group-hover:text-blue-600 group-focus-within:text-blue-700">
                    ◈
                  </span>

                  <input
                    id="password"
                    type={lihatPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-24 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-blue-300 hover:bg-white hover:shadow-md hover:shadow-blue-100/60 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100/80 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setLihatPassword(!lihatPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
                  >
                    {lihatPassword ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              </div>

              {/* TOMBOL LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#173B70] to-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke Akun
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>

            </form>

            {/* LINK REGISTER */}
            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="text-sm text-slate-600">
                Belum punya akun?
              </p>

              <a
                href="/register"
                className="mt-2 inline-block text-sm font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
              >
                Daftar Sekarang →
              </a>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          © 2026 FindIt — User Panel
        </p>

      </div>
    </main>
  );
}