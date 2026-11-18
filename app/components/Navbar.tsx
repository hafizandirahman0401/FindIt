
import Link from "next/link";
import AuthButtons from "./AuthButtons";
import NotificationBadge from "./NotificationBadge";

type NavbarProps = {
  active?: string;
  showAuth?: boolean;
};

export default function Navbar({
  active = "",
  showAuth = false,
}: NavbarProps) {
  const menu = [
    { label: "Beranda", href: "/" },
    { label: "Barang Hilang", href: "/barang-hilang" },
    { label: "Barang Temuan", href: "/barang-temuan" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Riwayat", href: "/riwayat" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-10 lg:px-12">
        {/* LOGO FINDIT */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-xl font-extrabold text-white shadow-lg shadow-blue-200 transition group-hover:rotate-3">
            F
          </span>

          <span>
            <span className="block text-2xl font-extrabold tracking-tight text-blue-800">
              FindIt
            </span>
            <span className="hidden text-[10px] font-semibold tracking-wider text-slate-400 sm:block">
              LOST & FOUND CAMPUS
            </span>
          </span>
        </Link>

        {/* NAVIGASI DESKTOP */}
        <div className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                active === item.href
                  ? "text-blue-700"
                  : "text-slate-600 transition hover:text-blue-700"
              }
            >
              {item.label}

              {item.href === "/riwayat" && (
                <NotificationBadge />
              )}
            </Link>
          ))}
        </div>

        {/* TOMBOL DESKTOP */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/lapor"
            className="rounded-xl bg-blue-700 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800 sm:px-5 sm:text-sm"
          >
            + Buat Laporan
          </Link>

          {showAuth && <AuthButtons />}
        </div>

        {/* MENU HAMBURGER MOBILE */}
        <details className="group relative lg:hidden">
          <summary
            aria-label="Buka menu navigasi"
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-800 transition hover:bg-blue-100 [&::-webkit-details-marker]:hidden"
          >
            {/* IKON HAMBURGER */}
            <svg
              className="h-6 w-6 group-open:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            {/* IKON TUTUP */}
            <svg
              className="hidden h-6 w-6 group-open:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </summary>

          {/* ISI MENU MOBILE */}
          <div className="absolute right-0 top-full mt-3 w-[min(88vw,320px)] overflow-hidden rounded-2xl border border-blue-100 bg-white p-3 shadow-xl shadow-blue-900/10">
            <div className="mb-3 border-b border-slate-100 px-3 py-3">
              <p className="text-sm font-extrabold text-blue-800">
                Menu FindIt
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Temukan kembali barangmu
              </p>
            </div>

            <div className="space-y-1">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`}
                >
                  {item.label}

                  {item.href === "/riwayat" && (
                    <NotificationBadge />
                  )}

                  {active === item.href && (
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
              <Link
                href="/lapor"
                className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-800"
              >
                + Buat Laporan
              </Link>

              {showAuth && (
                <div className="flex justify-center">
                  <AuthButtons />
                </div>
              )}
            </div>
          </div>
        </details>
      </div>
    </nav>
  );
}