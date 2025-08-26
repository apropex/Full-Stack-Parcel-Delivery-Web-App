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
import { useUpdateStatusLogsMutation } from "@/redux/features/parcel.api";
import type { iChildren, iParcelResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface iProps extends iChildren {
  parcel: iParcelResponse;
}

const StatusSchema = z.object({
  status: z.string(),
  note: z.string().optional(),
});

export type StatusFormValues = z.infer<typeof StatusSchema>;

export function UpdateStatusLogs({ children, parcel }: iProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [updateStatusLogs] = useUpdateStatusLogsMutation();

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(StatusSchema),
    defaultValues: {
      status: "",
      note: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: StatusFormValues) => {
    const statusAndDate = data.status.split("&");

    const newData = {
      note: data.note,
      status: statusAndDate?.[0],
      updatedAt: statusAndDate?.[1],
    };

    const loaderId = toast.loading("Creating parcel");
    setSubmitting(true);
    try {
      const result = await updateStatusLogs({ id: parcel!._id, data: newData }).unwrap();
      const message = result?.message;
      if (result.success) {
        toast.success(message, { id: loaderId });
        setOpen(false);
        form.reset();
      } else toast.error(message, { id: loaderId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update parcel status log", { id: loaderId });
    } finally {
      setSubmitting(false);
    }
  };

  const logs = parcel?.statusLogs || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Parcel Status Logs Note</DialogTitle>
          <DialogDescription>
            Here you can update status note. Select the status whose note you want to
            change.
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
                    <FormLabel>Select status you want to change</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a parcel status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {logs.map((log, i) => (
                          <SelectItem value={`${log.status}&${log.updatedAt}`} key={i}>
                            {`${log.status} - ${format(new Date(log.updatedAt), "PP HH:mm:ss")}`}
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
