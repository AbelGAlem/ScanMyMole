import { PredictResponse } from "@/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const FASTAPI_URL = process.env.FASTAPI_URL;
    if (!FASTAPI_URL) {
      return NextResponse.json(
        { error: "Server misconfigured: FASTAPI_URL is missing" },
        { status: 500 }
      );
    }
    const incoming = await req.formData();

    // Basic validation (file required)
    const file = incoming.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "file must be an image" }, { status: 400 });
    }

    // Optional fields with sane defaults
    const age = (incoming.get("age") ?? "40").toString();
    const localization = (incoming.get("localization") ?? "unknown").toString();
    const top_k = (incoming.get("top_k") ?? "3").toString();

    // Rebuild FormData to forward to FastAPI
    const formDate = new FormData();
    formDate.append("file", file, file.name); // preserves filename & type
    formDate.append("age", age);
    formDate.append("localization", localization);
    formDate.append("top_k", top_k);


    const res = await fetch(FASTAPI_URL, {
      method: "POST",
      body: formDate
    });

    // Bubble up FastAPI error codes
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Upstream error ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = (await res.json()) as PredictResponse;
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected server error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
