import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf"];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const alt = typeof formData.get("alt") === "string" ? String(formData.get("alt")) : "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds the 8MB limit" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await db.mediaAsset.create({
    data: {
      filename: file.name.slice(0, 255),
      mimeType: file.type,
      size: file.size,
      kind: "UPLOAD",
      alt,
      data: buffer,
    },
  });

  return NextResponse.json({
    id: asset.id,
    url: `/api/media/${asset.id}`,
    filename: asset.filename,
    mimeType: asset.mimeType,
    alt: asset.alt,
    createdAt: asset.createdAt,
  });
}
