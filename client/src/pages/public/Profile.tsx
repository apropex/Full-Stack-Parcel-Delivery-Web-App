import bgImg from "@/assets/images/a7.jpg";
import PageContainer from "@/components/layouts/PageContainer";
import Loading from "@/components/loader/Loading";
import { UpdateProfileForm } from "@/components/modules/public/UpdateProfileForm";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";
import { User2Icon } from "lucide-react";

export default function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <PageContainer className="p-0">
      <div className="w-full relative">
        <img src={bgImg} alt="" className="w-full max-h-60 object-cover" />

        <UpdateProfileForm />

        <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row px-4">
          <div className="size-24 md:size-32 rounded-full overflow-hidden grid place-content-center bg-background/50 border-2 -translate-y-[40%]">
            {user && user.image ? (
              <img
                src={user.image}
                alt="profile image"
                className="w-full h-full object-cover"
              />
            ) : (
              <User2Icon size={52} />
            )}
          </div>

          <div className="flex-1 ml-4 mt-2 grid grid-cols-2">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                {user?.name.firstName} {user?.name.lastName}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Role: {user?.role}</p>
              <p className="text-muted-foreground">
                Member from: {format(user!.createdAt, "y")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
