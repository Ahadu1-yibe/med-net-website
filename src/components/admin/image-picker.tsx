"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Upload, Link2, Check, Image as ImageIcon } from "lucide-react";
import { Input, Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  alt: string;
  kind: string;
  externalUrl?: string | null;
};

export default function ImagePicker({
  name,
  value,
  onChange,
  label,
}: {
  name: string;
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  async function loadLibrary() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media/list");
      if (res.ok) setItems(await res.json());
    } catch {
      setError("Could not load the media library.");
    } finally {
      setLoading(false);
    }
  }

  async function openModal() {
    setOpen(true);
    await loadLibrary();
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setItems((prev) => [json, ...prev]);
      onChange(json.url);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addExternal() {
    if (!/^https?:\/\/.+/.test(externalUrl)) {
      setError("Enter a valid URL starting with https://");
      return;
    }
    onChange(externalUrl);
    setOpen(false);
    setExternalUrl("");
    setError("");
  }

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-medium text-foreground">{label}</label>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-start gap-3">
        <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-line-strong" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" size="sm" onClick={openModal}>
            Choose from library
          </Button>
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload new image"}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-xs text-danger hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
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

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Media library"
              className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-display text-base font-semibold text-foreground">Media library</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-end gap-3 border-b border-line px-5 py-4">
                <Field label="Add by URL" className="flex-1 min-w-56">
                  <div className="flex gap-2">
                    <Input
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" variant="subtle" size="md" onClick={addExternal}>
                      <Link2 className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </Field>
              </div>

              {error && <p className="px-5 pt-3 text-xs text-danger">{error}</p>}

              <div className="flex-1 overflow-y-auto p-5 scrollbar-subtle">
                {loading ? (
                  <p className="py-10 text-center text-sm text-fg-muted">Loading…</p>
                ) : items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line-strong py-12 text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-line-strong" />
                    <p className="mt-3 text-sm font-medium text-foreground">The library is empty</p>
                    <p className="mt-1 text-xs text-fg-muted">Upload an image or add one by URL.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(item.url);
                          setOpen(false);
                        }}
                        className={cn(
                          "group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-muted transition-all",
                          value === item.url ? "border-accent" : "border-transparent hover:border-line-strong"
                        )}
                        title={item.filename}
                      >
                        <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                        {value === item.url && (
                          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-fg">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
