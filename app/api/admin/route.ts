
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  deleteAdminSession,
} from "@/lib/auth";

// LOGIN ADMIN
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if ((!email && !username) || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
        OR: [
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (!admin || !admin.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    const passwordCocok = await compare(
      password,
      admin.password
    );

    if (!passwordCocok) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    await createAdminSession(admin.id);

    return NextResponse.json({
      success: true,
      message: "Login Admin berhasil.",
    });
  } catch (error) {
    console.error("Login Admin error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}

// LOGOUT ADMIN
export async function DELETE() {
  try {
    await deleteAdminSession();

    return NextResponse.json({
      success: true,
      message: "Logout Admin berhasil.",
    });
  } catch (error) {
    console.error("Logout Admin error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal logout Admin.",
      },
      { status: 500 }
    );
  }
}
