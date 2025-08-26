import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useConfirmParcelMutation } from "@/redux/features/parcel.api";
import type { iChildren } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface iProps extends iChildren {
  id: string;
}

const StatusSchema = z.object({
  note: z.string().optional(),
});

export type StatusFormValues = z.infer<typeof StatusSchema>;

export function ConfirmParcel({ children, id }: iProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [confirmParcel] = useConfirmParcelMutation();

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(StatusSchema),
    defaultValues: { note: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: StatusFormValues) => {
    const loaderId = toast.loading("Creating parcel");
    setSubmitting(true);
    try {
      const result = await confirmParcel({
        id,
        data: { note: data.note || "" },
      }).unwrap();
      const message = result?.message;
      if (result.success) {
        toast.success(message, { id: loaderId });
        setOpen(false);
        form.reset();
      } else toast.error(message, { id: loaderId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to confirm parcel", { id: loaderId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Parcel</DialogTitle>
          <DialogDescription>
            Your are going to confirm that you got the parcel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parcel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter description here..."
                      className="min-h-32 max-h-60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <LoadingSpinner
                  isLoading={submitting}
                  defaultText="Submit"
                  loadingText="Submitting..."
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
