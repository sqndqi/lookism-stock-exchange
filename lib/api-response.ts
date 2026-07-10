import { NextResponse } from "next/server";

export function apiOk<T>(data: T, meta: Record<string, unknown> = {}) {
  return NextResponse.json({
    ok: true,
    data,
    meta
  });
}

export function apiError(code: string, message: string, status = 400, meta: Record<string, unknown> = {}) {
  return NextResponse.json({
    ok: false,
    error: { code, message },
    meta
  }, { status });
}
