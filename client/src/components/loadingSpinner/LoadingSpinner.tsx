//

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface iProps {
  isLoading: boolean;
  defaultText: string;
  loadingText: string;
  className?: string;
}

export default function LoadingSpinner({
  isLoading,
  defaultText,
  loadingText,
  className = "",
}: iProps) {
  return (
    <>
      {isLoading ? (
        <span className={cn("flex items-center justify-center gap-x-1.5", className)}>
          <span>
            <Loader2 className="animate-spin" />
          </span>
          {loadingText}
        </span>
      ) : (
        <span>{defaultText}</span>
      )}
    </>
  );
}
