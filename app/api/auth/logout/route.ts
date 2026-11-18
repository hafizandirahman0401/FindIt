import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      message: "Logout berhasil.",
    });
  } catch (error) {
    console.error("Logout gagal:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat logout." },
      { status: 500 }
    );
  }
}