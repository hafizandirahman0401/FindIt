import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nama = String(body.nama ?? "").trim();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!nama || !username || !email || !password) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const akunSudahAda = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (akunSudahAda) {
      return NextResponse.json(
        { message: "Username atau email sudah digunakan." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        nama,
        username,
        email,
        password: passwordHash,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registrasi gagal:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}