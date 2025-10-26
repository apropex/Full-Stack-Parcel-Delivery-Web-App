import ProfilePicUploader from "@/components/ProfilePicUploader";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
});

type iFormValues = z.infer<typeof FormSchema>;

export function UpdateProfileForm({
  onClick,
  previewLink,
}: {
  onClick: () => void;
  previewLink?: string;
}) {
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
      await updateUser({ id: user._id, data: formData }).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      onClick();
    }
  };

  return (
    <div>
      <p className="text-center mb-2">Profile Pic</p>
      <ProfilePicUploader setBlob={setBlob} previewLink={previewLink} />
      <Form {...form}>
        <form className="space-y-5 mt-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="sm:flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-full max-w-60">
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
