import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { iChildren, iResponse } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface iProps extends iChildren {
  onConfirm: () => Promise<iResponse<null>>;
  description: string;
  confirmText: string;
}

export default function DeleteConfirmation({
  children,
  onConfirm,
  description,
  confirmText,
}: iProps) {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleConfirm = async () => {
    const loaderId = toast.loading(`Deleting ${name}`);

    setDeleting(true);
    try {
      const result = await onConfirm();
      if (result.success) {
        toast.success(result.message, { id: loaderId });
      } else toast.error(result.message, { id: loaderId });
    } catch {
      toast.error(`Operation failed`, { id: loaderId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90 text-white"
            disabled={deleting}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
