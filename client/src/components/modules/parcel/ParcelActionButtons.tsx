import DeleteConfirmation from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { ParcelStatus, ROLES } from "@/constants";
import useAuth from "@/hooks/useAuth";
import {
  useCancelParcelMutation,
  useConfirmParcelMutation,
  useDeleteParcelMutation,
} from "@/redux/features/parcel.api";
import type { iParcelResponse } from "@/types";
import { isUserInfo } from "@/types/auth.type";
import { Edit2Icon, EyeIcon, Trash2Icon, XIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

const { Requested, Approved, Delivered, Received, Blocked } = ParcelStatus;

interface iProps {
  parcel: iParcelResponse;
  isViewButton?: boolean;
}

export default function ParcelActionButtons({ parcel, isViewButton = true }: iProps) {
  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();
  const [deleteParcel] = useDeleteParcelMutation();
  const [cancelParcel] = useCancelParcelMutation();
  const [confirmParcel] = useConfirmParcelMutation();

  //
  const Status = parcel.status;
  const isRequested = Status === Requested;
  const isApproved = Status === Approved;
  const isDelivered = Status === Delivered;
  const isReceived = Status === Received;
  const isBlocked = Status === Blocked;

  const isSender = isUserInfo(parcel.sender) && user?._id === parcel.sender._id;
  const isReceiver = isUserInfo(parcel.receiver) && user?._id === parcel.receiver._id;
  const isAdmin = user?.role === ROLES.ADMIN;

  const onConfirmConfirm = async () => {
    return await confirmParcel({ id: parcel._id }).unwrap();
  };

  const onCancelConfirm = async () => {
    return await cancelParcel({ id: parcel._id }).unwrap();
  };

  const onDeleteConfirm = async () => {
    return await deleteParcel({ id: parcel._id }).unwrap();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-6 flex gap-3 flex-wrap">
      {isSender && (
        <>
          <DeleteConfirmation
            onConfirm={onCancelConfirm}
            description="Your are going to cancel the parcel"
            confirmText="Confirm"
          >
            <Button
              variant={"outline"}
              size="sm"
              className="flex-1"
              disabled={!isRequested && !isApproved}
            >
              {!isRequested && !isApproved ? (
                Status
              ) : (
                <>
                  <XIcon /> Cancel
                </>
              )}
            </Button>
          </DeleteConfirmation>
          <Button
            asChild
            variant={"outline"}
            size="sm"
            className="flex-1"
            disabled={isBlocked}
          >
            <Link to={`/sender/my-parcels/update/${parcel._id}`}>
              <Edit2Icon />
              Edit
            </Link>
          </Button>
          <DeleteConfirmation
            onConfirm={onDeleteConfirm}
            description="Your are going to delete the parcel"
            confirmText="Delete"
          >
            <Button
              variant={"outline"}
              size="sm"
              className="flex-1"
              disabled={!isRequested && !isApproved && !isBlocked}
            >
              <Trash2Icon />
              Delete
            </Button>
          </DeleteConfirmation>
        </>
      )}

      {isReceiver && (
        <DeleteConfirmation
          onConfirm={onConfirmConfirm}
          description="Your are going to delete the parcel"
          confirmText="Delete"
        >
          <Button
            variant={"outline"}
            size="sm"
            className="flex-1"
            disabled={!isDelivered}
          >
            {isReceived ? "Already Received" : isDelivered ? Received : Status}
          </Button>
        </DeleteConfirmation>
      )}

      {isAdmin && (
        <>
          <Button variant={"outline"} size="sm" className="flex-1">
            Update Status
          </Button>
          <Button variant={"outline"} size="sm" className="flex-1">
            Update Status Log
          </Button>
          <Button variant={"outline"} size="sm" className="flex-1">
            Delete Status
          </Button>
        </>
      )}

      {isViewButton && (
        <Button asChild variant={"outline"} size="sm" className="flex-1">
          <Link to={`${pathname}/${parcel._id}`}>
            <EyeIcon />
            See The Parcel In Detail
          </Link>
        </Button>
      )}
    </div>
  );
}
