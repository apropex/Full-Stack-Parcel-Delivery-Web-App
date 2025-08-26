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
import { useDeleteStatusMutation } from "@/redux/features/parcel.api";
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
  note: z.string().optional(),
  deletedStatus: z.string(),
  presentStatus: z.enum(Object.values(ParcelStatus)),
});

export type StatusFormValues = z.infer<typeof StatusSchema>;

export function DeleteStatusLog({ children, parcel }: iProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [deleteStatusLogs] = useDeleteStatusMutation();

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(StatusSchema),
    defaultValues: {
      deletedStatus: "",
      note: "",
      presentStatus: ParcelStatus.Approved,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: StatusFormValues) => {
    const statusAndDate = data.deletedStatus.split("&");

    const newData = {
      note: data.note,
      deletedStatus: statusAndDate?.[0],
      updatedAt: statusAndDate?.[1],
      presentStatus: data.presentStatus,
    };

    const loaderId = toast.loading("Deleting parcel");
    setSubmitting(true);
    try {
      const result = await deleteStatusLogs({ id: parcel!._id, data: newData }).unwrap();
      const message = result?.message;
      if (result.success) {
        toast.success(message, { id: loaderId });
        setOpen(false);
        form.reset();
      } else toast.error(message, { id: loaderId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete parcel status", { id: loaderId });
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
          <DialogTitle>Delete Parcel Status Logs</DialogTitle>
          <DialogDescription>
            Here you can delete status. But you have to select a present status. First
            select the status whose you want to delete, and then select the new status.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="deletedStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select the status you want to delete</FormLabel>
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
                name="presentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Select the new status (what will be the present status)
                    </FormLabel>
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
