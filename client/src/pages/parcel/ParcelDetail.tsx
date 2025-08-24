import Loading from "@/components/loader/Loading";
import { Button } from "@/components/ui/button";
import { ParcelStatus } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useGetSingleParcelQuery } from "@/redux/features/parcel.api";
import type { iStatusLog } from "@/types";
import { isUserInfo } from "@/types/auth.type";
import { format } from "date-fns";
import { Edit2Icon, Trash2Icon, XIcon } from "lucide-react";
import { useParams } from "react-router";

const { Requested, Approved, Delivered, Received, Blocked } = ParcelStatus;

export default function ParcelDetail() {
  const { id } = useParams();

  const { user, isLoading: userLoading } = useAuth();

  const {
    data: parcel,
    isLoading,
    isError,
  } = useGetSingleParcelQuery({ id: id! }, { skip: !id });

  if (isLoading || userLoading) return <Loading />;
  if ((!isLoading && isError) || !parcel) return <div>Something went wrong</div>;

  const receiverName = isUserInfo(parcel.receiver) ? parcel.receiver.name : undefined;

  const Status = parcel.status;
  const isSender = isUserInfo(parcel.sender) && user?._id === parcel.sender._id;
  const isRequested = Status === Requested;
  const isApproved = Status === Approved;
  const isDelivered = Status === Delivered;
  const isReceived = Status === Received;
  const isBlocked = Status === Blocked;

  return (
    <div
      className={cn("w-full max-w-6xl mx-auto border p-4 rounded-2xl", {
        "border-red-400/50": isBlocked,
        "border-green-400/50": isReceived,
      })}
    >
      <div>
        <div className="flex items-center flex-wrap gap-2.5">
          {parcel.images.map((link, i) => (
            <img
              src={link}
              alt="Parcel-Image"
              key={i}
              className="h-40 sm:h-60 min-w-[300px] object-cover flex-1 rounded-xl"
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2 mt-6">
          <h3 className="font-medium my-3 flex-1">{parcel.title}</h3>

          <p
            className={cn("bg-muted px-1 py-0.5 border rounded", {
              "bg-red-400": isBlocked,
              "bg-green-600": isReceived,
            })}
          >
            {Status}
          </p>
        </div>

        <p className="text-muted-foreground">{parcel.description}</p>

        <div className="space-y-1 mt-4">
          <p>
            Parcel Type: <span className="text-muted-foreground">{parcel.type}</span>
          </p>

          <div className="grid sm:grid-cols-2 gap-1">
            <p>
              Parcel Weight:{" "}
              <span className="text-muted-foreground">{parcel.weight}kg</span>
            </p>
            <p>
              Parcel Rent: <span className="text-muted-foreground">৳{parcel.rent}</span>
            </p>
          </div>

          <p>
            Pickup Address:{" "}
            <span className="text-muted-foreground">
              {parcel.pickupAddress.street}, {parcel.pickupAddress.stateOrProvince},{" "}
              {parcel.pickupAddress.city}, {parcel.pickupAddress.country}
            </span>
          </p>
          <p>
            Receiver Name:{" "}
            <span className="text-muted-foreground">
              {receiverName?.firstName}, {receiverName?.lastName}
            </span>
          </p>
          <p>
            Delivery Address:{" "}
            <span className="text-muted-foreground">
              {parcel.deliveryAddress.street}, {parcel.deliveryAddress.stateOrProvince},{" "}
              {parcel.deliveryAddress.city}, {parcel.deliveryAddress.country}
            </span>
          </p>
        </div>

        <p className="bg-muted px-1 py-1 rounded-xs mt-4">All Status Logs</p>
        <div className="mt-2 grid md:grid-cols-2 gap-3">
          {parcel.statusLogs.map((log: iStatusLog, i) => (
            <div key={i} className="border p-2 rounded-md">
              <p>
                Status: <span className="text-muted-foreground">{log.status}</span>
              </p>
              <p>
                Status Date:{" "}
                <span className="text-muted-foreground">
                  {format(log.updatedAt, "PP")}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">{log.updatedFrom}</span>
              </p>
              <p>
                Updated:{" "}
                <span className="text-muted-foreground">
                  {typeof log.updatedBy === "object"
                    ? `${log.updatedBy.name.firstName} ${log.updatedBy.name.lastName}`
                    : "Unknown User"}
                </span>
              </p>
              {log.note && (
                <p>
                  Note: <span className="text-muted-foreground">{log.note}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3 flex-wrap">
        {isSender ? (
          <>
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
            <Button variant={"outline"} size="sm" className="flex-1" disabled={isBlocked}>
              <Edit2Icon />
              Edit
            </Button>
            <Button
              variant={"outline"}
              size="sm"
              className="flex-1"
              disabled={!isRequested && !isApproved && !isBlocked}
            >
              <Trash2Icon />
              Delete
            </Button>
          </>
        ) : (
          <Button
            variant={"outline"}
            size="sm"
            className="flex-1"
            disabled={!isDelivered}
          >
            {isReceived ? "Already Received" : isDelivered ? Received : Status}
          </Button>
        )}
      </div>
    </div>
  );
}
