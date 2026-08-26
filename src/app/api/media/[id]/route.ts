import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return new NextResponse("Not found", { status: 404 });

  if (asset.kind === "EXTERNAL" && asset.externalUrl) {
    return NextResponse.redirect(asset.externalUrl);
  }
  if (!asset.data) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(asset.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
