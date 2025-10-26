import PageContainer from "@/components/layouts/PageContainer";
import Loading from "@/components/loader/Loading";
import PaginationComponent from "@/components/PaginationComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetAllUsersQuery } from "@/redux/features/auth.api";
import type { iUserInfo } from "@/types";
import AllSearchParams from "@/utils/allSearchParams";
import { EditIcon } from "lucide-react";
import { UpdateUser } from "./UserRoleDialog";

export default function AllUsers() {
  const { page, limit } = AllSearchParams();

  const { data, isLoading, isError } = useGetAllUsersQuery(
    { page: page as string, limit: limit as string },
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading) return <Loading />;
  if (!isLoading && isError)
    return (
      <div className="text-center text-red-600 py-10">
        Something went wrong while fetching users.
      </div>
    );

  const currentPage = data?.meta?.present_page;
  const totalPages = data?.meta?.total_page;
  const users: iUserInfo[] = data?.data ?? [];

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Users</h1>
        <p className="text-muted-foreground max-w-xl">
          Manage all registered users on the platform. You can view user information,
          update their roles, or deactivate accounts as needed.
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, idx) => (
                <TableRow
                  key={user._id}
                  className={cn({
                    "bg-red-500/10": user.isDeleted,
                  })}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {user.name.firstName} {user.name.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <button
                      className={cn("uppercase font-medium", {
                        "text-green-500": user.isActive === "ACTIVE",
                        "text-amber-500": user.isActive === "INACTIVE",
                        "text-red-500": user.isActive === "BLOCKED",
                      })}
                    >
                      {user.isActive}
                    </button>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <UpdateUser user={user}>
                      <button className="p-0.5 ">
                        <EditIcon size={16} />
                      </button>
                    </UpdateUser>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages && currentPage && (
        <div className="my-6">
          <PaginationComponent currentPage={currentPage!} totalPages={totalPages!} />
        </div>
      )}
    </PageContainer>
  );
}
