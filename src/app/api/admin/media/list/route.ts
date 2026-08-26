import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      filename: true,
      mimeType: true,
      kind: true,
      alt: true,
      externalUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    assets.map((a) => ({
      id: a.id,
      url: a.kind === "EXTERNAL" && a.externalUrl ? a.externalUrl : `/api/media/${a.id}`,
      filename: a.filename,
      alt: a.alt,
      kind: a.kind,
    }))
  );
}
