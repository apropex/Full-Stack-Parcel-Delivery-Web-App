import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ParcelStatus } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { iParcelResponse, iStatusLog, iUserInfo } from "@/types";
import { format } from "date-fns";
import { Edit2Icon, EyeIcon, Trash2Icon, XIcon } from "lucide-react";

function isUserInfo(user: unknown): user is iUserInfo {
  return typeof user === "object" && user !== null && "_id" in user && "email" in user;
}

const { Requested, Approved, Delivered, Received, Blocked } = ParcelStatus;

export default function ParcelCard({ parcel }: { parcel: iParcelResponse }) {
  const { user, isLoading } = useAuth();

  const Status = parcel.status;
  const isSender = isUserInfo(parcel.sender) && user?._id === parcel.sender._id;
  const isRequested = Status === Requested;
  const isApproved = Status === Approved;
  const isDelivered = Status === Delivered;
  const isReceived = Status === Received;
  const isBlocked = Status === Blocked;

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card
      className={cn({
        "border-red-400/50": isBlocked,
        "border-green-400/50": isReceived,
      })}
    >
      <CardContent className="p-4 py-0">
        <div>
          <div>
            <Carousel>
              <CarouselContent className="h-40">
                {parcel.images?.map((image, i) => (
                  <CarouselItem key={i}>
                    <img
                      src={image}
                      alt="parcel-image"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <h3 className="font-medium my-3">{parcel.title}</h3>

          <p className="py-2">
            Parcel Status:{" "}
            <span
              className={cn("bg-muted px-1 py-0.5 border rounded", {
                "bg-red-400": isBlocked,
                "bg-green-600": isReceived,
              })}
            >
              {Status}
            </span>
          </p>

          <div className="space-y-1">
            <p>
              Parcel Type: <span className="text-muted-foreground">{parcel.type}</span>
            </p>

            <div className="flex justify-between flex-wrap gap-1">
              <p>
                Parcel Weight:{" "}
                <span className="text-muted-foreground">{parcel.weight}kg</span>
              </p>
              <p>
                Parcel Rent: <span className="text-muted-foreground">৳{parcel.rent}</span>
              </p>
            </div>

            <p>
              Delivery Address:{" "}
              <span className="text-muted-foreground">
                {parcel.deliveryAddress.street}, {parcel.deliveryAddress.stateOrProvince},{" "}
                {parcel.deliveryAddress.city}, {parcel.deliveryAddress.country}
              </span>
            </p>
          </div>

          <div className="mt-2">
            <p className="bg-muted px-1 py-1 rounded-xs">All Status Logs</p>
            {parcel.statusLogs.map((log: iStatusLog, i) => (
              <div key={i} className="border-t mt-2 pt-1.5">
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
              <Button
                variant={"outline"}
                size="sm"
                className="flex-1"
                disabled={isBlocked}
              >
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

          <Button variant={"outline"} size="sm" className="flex-1">
            <EyeIcon />
            See The Parcel In Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
