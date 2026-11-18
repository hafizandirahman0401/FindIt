
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function kirimNotifikasiStatus({
  email,
  nama,
  namaBarang,
  status,
}: {
  email: string;
  nama: string;
  namaBarang: string;
  status: string;
}) {
  await transporter.sendMail({
    from: `"FindIt" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Pembaruan Status Laporan FindIt`,
    text: `Halo ${nama}, status laporan barang ${namaBarang} telah diperbarui menjadi: ${status}. Silakan buka FindIt untuk melihat detail laporan.`,
    html: `
      <h2>Halo, ${nama}!</h2>
      <p>Status laporan barang <b>${namaBarang}</b> telah diperbarui.</p>
      <p>Status terbaru: <b>${status}</b></p>
      <p>Silakan buka FindIt untuk melihat detail laporan kamu.</p>
      <p>Terima kasih telah menggunakan FindIt.</p>
    `,
  });
}
