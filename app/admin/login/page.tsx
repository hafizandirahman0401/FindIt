
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [lihatPassword, setLihatPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPesan("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan(data.message || "Email atau password salah.");
        return;
      }

      setPesan("Login berhasil! Mengalihkan ke dashboard...");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setPesan("Tidak dapat terhubung ke server.");
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

        {/* LOGIN CARD */}
        <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_70px_-20px_rgba(30,64,175,0.22)]">

          {/* HEADER */}
          <div className="bg-linear-to-br from-[#173B70] via-blue-800 to-blue-600 px-6 py-5 text-center text-white">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl backdrop-blur">
              ♙
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
              Administrator Area
            </p>

            <h1 className="mt-2 text-2xl font-extrabold">
              Selamat Datang
            </h1>

            <p className="mt-2 text-sm leading-6 text-blue-100">
              Silakan masuk untuk mengelola sistem FindIt.
            </p>
          </div>

          {/* FORM */}
          <div className="p-5">
            <form onSubmit={handleLogin} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email Admin
                </label>

                <div className="group relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition-colors duration-200 group-hover:text-blue-600 group-focus-within:text-blue-700">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email admin"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
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

              {/* PESAN */}
              {pesan && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                    pesan.startsWith("Login berhasil")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {pesan}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#173B70] to-blue-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memeriksa akun...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
            </form>

            {/* KEMBALI */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <a
                href="/"
                className="block text-center text-sm font-semibold text-slate-500 transition hover:text-blue-700"
              >
                ← Kembali ke Beranda
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            © 2026 FindIt — Admin Panel
          </p>
        </div>
      </div>
    </main>
  );
}
