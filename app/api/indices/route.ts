import { NextResponse } from "next/server";
import { getMarketState } from "@/lib/market-engine";

export function GET() {
  return NextResponse.json({ indices: getMarketState().indices });
}
