import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export default function Markdown({ content, className }: { content: string; className?: string }) {
  if (!content?.trim()) return null;
  return (
    <div className={cn("prose prose-mednet prose-sm sm:prose-base max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
