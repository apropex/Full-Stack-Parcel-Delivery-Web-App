import { cn } from "@/lib/utils";
import type { iChildren } from "@/types";

interface iProps extends iChildren {
  className?: string;
}

export default function PageContainer({ children, className = "" }: iProps) {
  return (
    <div className={cn("container mx-auto px-4 md:px-6 py-8", className)}>{children}</div>
  );
}
