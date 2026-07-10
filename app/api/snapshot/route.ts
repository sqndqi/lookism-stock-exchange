import { NextResponse } from "next/server";
import snapshot from "@/public/data/market-snapshot.json";

export function GET() {
  return NextResponse.json(snapshot);
}
