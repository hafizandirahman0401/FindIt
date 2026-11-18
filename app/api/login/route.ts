import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 }
      );
    }

    const passwordCocok = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCocok) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      message: "Login berhasil.",
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login gagal:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}