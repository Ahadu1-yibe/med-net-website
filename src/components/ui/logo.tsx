import { cn } from "@/lib/utils";

export default function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      <img
        src="/brand/mednet-logo-light.jpeg"
        alt="Med-Net Digital Health Collaborative"
        className="h-full w-full object-contain mix-blend-multiply dark:hidden"
        loading={priority ? "eager" : "lazy"}
      />
      <img
        src="/brand/mednet-logo-dark.jpeg"
        alt=""
        aria-hidden
        className="hidden h-full w-full object-contain mix-blend-screen dark:block"
        loading={priority ? "eager" : "lazy"}
      />
    </span>
  );
}
