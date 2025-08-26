import { cn } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { useState } from "react";

interface iProps {
  text: string;
  className?: string;
}

export default function HandleTextCopy({ text, className = "" }: iProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div
      className={cn(
        "w-full border rounded-sm py-1 px-1.5 my-2 flex items-center justify-between",
        className
      )}
    >
      <p>{text}</p>
      {isCopied ? (
        <p className="text-muted-foreground text-sm">Copied!</p>
      ) : (
        <button className="cursor-pointer text-muted-foreground" onClick={handleCopy}>
          <CopyIcon size={16} />
        </button>
      )}
    </div>
  );
}
