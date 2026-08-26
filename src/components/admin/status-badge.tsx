import { Badge } from "@/components/ui/badge";

const map: Record<string, { tone: "success" | "warning" | "neutral" | "accent" | "danger"; label: string }> = {
  published: { tone: "success", label: "Published" },
  draft: { tone: "neutral", label: "Draft" },
  scheduled: { tone: "warning", label: "Scheduled" },
  OPEN: { tone: "success", label: "Open" },
  CLOSED: { tone: "neutral", label: "Closed" },
  NEW: { tone: "accent", label: "New" },
  REVIEWING: { tone: "warning", label: "Reviewing" },
  ACCEPTED: { tone: "success", label: "Accepted" },
  DECLINED: { tone: "danger", label: "Declined" },
  READ: { tone: "neutral", label: "Read" },
  ARCHIVED: { tone: "neutral", label: "Archived" },
  planned: { tone: "warning", label: "Planned" },
  "in-progress": { tone: "accent", label: "In Progress" },
  completed: { tone: "success", label: "Completed" },
  proposed: { tone: "warning", label: "Proposed" },
  ongoing: { tone: "accent", label: "Ongoing" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = map[status] ?? { tone: "neutral" as const, label: status };
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
