import { NextResponse } from "next/server";
import { getSourceRecords } from "@/lib/sources";

export function GET() {
  return NextResponse.json({ sources: getSourceRecords() });
}
