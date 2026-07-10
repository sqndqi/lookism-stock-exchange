import { NextResponse } from "next/server";
import { currentSeason } from "@/lib/seasons";

export function GET() {
  return NextResponse.json({ currentSeason });
}
