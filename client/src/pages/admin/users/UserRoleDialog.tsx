import Separator from "@/components/Separator";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserMutation } from "@/redux/features/auth.api";
import type { iChildren, iUserInfo } from "@/types";
import { useState } from "react";

interface iProps extends iChildren {
  user: iUserInfo;
}

export function UpdateUser({ children, user }: iProps) {
  const { _id, role, isDeleted, isActive, email } = user;
  const name = `${user.name.firstName} ${user.name.lastName}`;

  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState(role);
  const [userStatus, setUserStatus] = useState(isActive);
  const [userDelete, setUserDelete] = useState(isDeleted ? "DELETE" : "CALL-BACK");

  const [updateUser] = useUpdateUserMutation();

  const handleUpdateUser = async () => {
    const fields = {
      role: userRole,
      isDeleted: userDelete === "DELETE",
      isActive: userStatus,
    };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(fields));

      const result = await updateUser({ id: _id, data: formData }).unwrap();

      console.log("result", result);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>You are going to update the user.</p>
              <p className="pt-3">user Details:</p>
              <Separator side="X" className="max-w-40 mt-1 mb-1.5 " />
              <p>Name: {name}</p>
              <p>Email: {email}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 ">User Role</Label>
            <Select onValueChange={setUserRole} value={userRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={"Select an user role"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>User Roles</SelectLabel>
                  <SelectItem value={"SENDER"}>SENDER</SelectItem>
                  <SelectItem value={"RECEIVER"}>RECEIVER</SelectItem>
                  <SelectItem value={"ADMIN"}>ADMIN</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 ">User Status</Label>
            <Select onValueChange={setUserStatus} value={userStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={"Select an user status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>User Status</SelectLabel>
                  <SelectItem value={"ACTIVE"}>ACTIVE</SelectItem>
                  <SelectItem value={"INACTIVE"}>INACTIVE</SelectItem>
                  <SelectItem value={"BLOCKED"}>BLOCKED</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2">User Soft Delete</Label>
            <Select onValueChange={setUserDelete} value={userDelete}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>User Delete Status</SelectLabel>
                  <SelectItem value={"DELETE"}>DELETE</SelectItem>
                  <SelectItem value={"CALL-BACK"}>CALL-BACK</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateUser}>Save Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
