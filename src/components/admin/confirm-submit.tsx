"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmSubmit({
  label = "Delete",
  message = "Are you sure? This action cannot be undone.",
  icon = "delete",
  className,
}: {
  label?: string;
  message?: string;
  icon?: "delete" | "toggle";
  className?: string;
}) {
  return (
    <Button
      type="submit"
      variant="danger"
      size="sm"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {icon === "delete" && <Trash2 className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
}

export function IconSubmit({
  icon,
  title,
  active = false,
}: {
  icon: "publish" | "feature";
  title: string;
  active?: boolean;
}) {
  return (
    <button
      type="submit"
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
        active
          ? "border-success/40 bg-success/10 text-success"
          : "border-line bg-card text-fg-muted hover:border-accent hover:text-accent-strong"
      )}
    >
      {icon === "publish" ? (
        active ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )
      ) : (
        <Star className={cn("h-4 w-4", active && "fill-current")} />
      )}
    </button>
  );
}
