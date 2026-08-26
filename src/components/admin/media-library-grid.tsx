"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Link2, Trash2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/field";
import { updateMediaMeta, addExternalMedia, deleteMedia } from "@/lib/actions/media";
import { formatDate } from "@/lib/utils";

type Asset = {
  id: string;
  filename: string;
  kind: string;
  alt: string;
  size: number;
  url: string;
  createdAt: string;
};

function formatSize(bytes: number) {
  if (!bytes) return "External";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryGrid({ assets }: { assets: Asset[] }) {
  const [items, setItems] = useState(assets);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("alt", file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setItems((prev) => [
        {
          id: json.id,
          filename: json.filename,
          kind: "UPLOAD",
          alt: json.alt ?? "",
          size: json.size ?? 0,
          url: json.url,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function addExternal() {
    setError("");
    const fd = new FormData();
    fd.set("externalUrl", externalUrl);
    const result = await addExternalMedia(null, fd);
    if (result?.ok && result.id) {
      setItems((prev) => [
        {
          id: result.id!,
          filename: externalUrl.split("/").pop() || "external-image",
          kind: "EXTERNAL",
          alt: "",
          size: 0,
          url: externalUrl,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setExternalUrl("");
    } else {
      setError(result?.message ?? "Could not add the image.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-card p-5 shadow-sm">
        <Button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        <div className="flex flex-1 items-end gap-2">
          <Field label="Or add an external image URL" className="flex-1 min-w-56">
            <Input
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Field>
          <Button type="button" variant="outline" onClick={addExternal}>
            <Link2 className="h-4 w-4" />
            Add
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-card/60 px-6 py-16 text-center">
          <h3 className="font-display text-base font-semibold text-foreground">The media library is empty</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
            Upload images here first, then assign them to projects, research and posts through each item's editor.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              saved={savedId === asset.id}
              onSaveAlt={(alt) =>
                startTransition(async () => {
                  const fd = new FormData();
                  fd.set("id", asset.id);
                  fd.set("alt", alt);
                  await updateMediaMeta(null, fd);
                  setItems((prev) => prev.map((i) => (i.id === asset.id ? { ...i, alt } : i)));
                  setSavedId(asset.id);
                  setTimeout(() => setSavedId(""), 2000);
                })
              }
              onDelete={() => {
                if (!window.confirm(`Delete "${asset.filename}" from the library?`)) return;
                startTransition(async () => {
                  const fd = new FormData();
                  fd.set("id", asset.id);
                  await deleteMedia(fd);
                  setItems((prev) => prev.filter((i) => i.id !== asset.id));
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({
  asset,
  saved,
  onSaveAlt,
  onDelete,
}: {
  asset: Asset;
  saved: boolean;
  onSaveAlt: (alt: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <div className="aspect-[16/9] bg-muted">
        <img src={asset.url} alt={asset.alt} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-medium text-foreground" title={asset.filename}>
            {asset.filename}
          </p>
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-fg-muted">
            {formatSize(asset.size)}
          </span>
        </div>
        <p className="text-[11px] text-fg-muted">Added {formatDate(asset.createdAt)}</p>
        <form
          action={(formData) => onSaveAlt(String(formData.get("alt") ?? ""))}
          className="flex items-end gap-2"
        >
          <Field label="Alt text" className="flex-1">
            <Input name="alt" defaultValue={asset.alt} placeholder="Describe this image…" className="h-9 text-xs" />
          </Field>
          <Button type="submit" variant="subtle" size="sm" className="h-9 shrink-0">
            {saved ? <Check className="h-3.5 w-3.5 text-success" /> : <Save className="h-3.5 w-3.5" />}
          </Button>
        </form>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <code className="max-w-[180px] truncate text-[10px] text-fg-muted">{asset.url}</code>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${asset.filename}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:border-danger hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
