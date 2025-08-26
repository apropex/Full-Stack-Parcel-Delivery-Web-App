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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ParcelStatus } from "@/constants";
import { useUpdateStatusMutation } from "@/redux/features/parcel.api";
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
  status: z.enum(Object.values(ParcelStatus), "Enter a valid parcel status"),
  note: z.string().optional(),
});

export type StatusFormValues = z.infer<typeof StatusSchema>;

export function UpdateStatus({ children, id }: iProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [updateStatus] = useUpdateStatusMutation();

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(StatusSchema),
    defaultValues: {
      status: ParcelStatus.Approved,
      note: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: StatusFormValues) => {
    const loaderId = toast.loading("Creating parcel");
    setSubmitting(true);
    try {
      const result = await updateStatus({ id, data }).unwrap();
      const message = result?.message;
      if (result.success) {
        toast.success(message, { id: loaderId });
        setOpen(false);
        form.reset();
      } else toast.error(message, { id: loaderId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update parcel status", { id: loaderId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Parcel Status</DialogTitle>
          <DialogDescription>
            Make changes to parcel status here. Click save changes when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a parcel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ParcelStatus).map((type) => (
                          <SelectItem value={type} key={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <LoadingSpinner
                  isLoading={submitting}
                  defaultText="Save Changes"
                  loadingText="Saving..."
                />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
