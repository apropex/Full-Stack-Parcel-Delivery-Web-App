import { cn } from "@/lib/utils";

export default function Separator({
  side,
  className,
}: {
  side: "X" | "Y";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-auto",
        { "border-l": side === "Y" },
        { "border-t": side === "X" },
        className
      )}
    />
  );
}
