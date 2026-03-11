import { put, list, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }

  const allowed = ["image/", "video/"];
  if (!allowed.some((t) => file.type.startsWith(t))) {
    return NextResponse.json({ error: "Only images and videos allowed" }, { status: 400 });
  }

  const blob = await put(`blog/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}

export async function GET() {
  const { blobs } = await list({ prefix: "blog/" });

  const media = blobs.map((b) => ({
    url: b.url,
    pathname: b.pathname,
    size: b.size,
    uploadedAt: b.uploadedAt,
  }));

  return NextResponse.json(media);
}

export async function DELETE(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "No url provided" }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ success: true });
}
