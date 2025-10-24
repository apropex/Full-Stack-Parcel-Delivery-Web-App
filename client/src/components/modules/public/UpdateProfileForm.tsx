import ProfilePicUploader from "@/components/ProfilePicUploader";
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
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { useUpdateUserMutation } from "@/redux/features/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
});

type iFormValues = z.infer<typeof FormSchema>;

export function UpdateProfileForm() {
  const [open, setOpen] = useState<boolean>(false);
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [updateUser] = useUpdateUserMutation();
  const { user } = useAuth();

  const form = useForm<iFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("firstName", user.name.firstName);
      form.setValue("lastName", user.name.lastName);
    }
  }, [user, form]);

  const onSubmit = async (data: iFormValues) => {
    if (!user || !user._id) return;

    const name = {
      firstName: data.firstName,
      lastName: data.lastName,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify({ name }));
    if (blob) formData.append("file", blob);

    try {
      const result = await updateUser({ id: user._id, data: formData }).unwrap();
      console.log({ result });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute right-2 top-2" variant="outline">
          <Edit2Icon />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div />
        <ProfilePicUploader setBlob={setBlob} />
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
