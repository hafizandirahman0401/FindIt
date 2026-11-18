
"use client";

type Props = {
  href: string;
  reportId: number;
};

export default function TombolWhatsApp({
  href,
  reportId,
}: Props) {
  const catatKlikWhatsApp = () => {
    fetch("/api/laporan/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportId }),
      keepalive: true,
    }).catch((error) => {
      console.error("Gagal mencatat aktivitas WhatsApp:", error);
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={catatKlikWhatsApp}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 sm:w-auto"
    >
      <span className="text-lg" aria-hidden="true">
        ●
      </span>
      Hubungi via WhatsApp
    </a>
  );
}