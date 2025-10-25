import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ParcelStatus } from "@/constants";
import { cn } from "@/lib/utils";
import type { iParcelResponse, iStatusLog } from "@/types";
import HandleTextCopy from "@/utils/HandleTextCopy";
import { format } from "date-fns";
import ParcelActionButtons from "./ParcelActionButtons";

const { Received, Blocked, Delivered } = ParcelStatus;

interface iProps {
  parcel: iParcelResponse;
  index?: number;
}

export default function ParcelCard({ parcel, index }: iProps) {
  //
  const Status = parcel.status;

  const isReceived = Status === Received;
  const isDelivered = Status === Delivered;
  const isBlocked = Status === Blocked;

  return (
    <Card
      className={cn({
        "border-red-500/50": isBlocked,
        "border-cyan-500/50": isDelivered,
        "border-green-500/50": isReceived,
      })}
    >
      <CardContent className="p-4 py-0">
        <div className="relative">
          <div className="absolute text-xs -right-3 -top-3 bg-background flex items-center justify-center size-6 p-1 z-10 rounded-full text-foreground">
            {index}
          </div>

          <div className="group">
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
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-150">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>

          <h3 className="font-medium my-3">{parcel.title}</h3>
          <p className="py-1">
            Parcel Status:{" "}
            <span
              className={cn("bg-muted px-1 py-0.5 border rounded", {
                "bg-red-500": isBlocked,
                "bg-cyan-600": isDelivered,
                "bg-green-600": isReceived,
              })}
            >
              {Status}
            </span>
          </p>

          <HandleTextCopy text={parcel.trackingId} />

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

          <div className="mt-4">
            <p className="bg-muted p-1.5 rounded-xs text-sm">Status Logs</p>
            {parcel.statusLogs.slice(0, 2).map((log: iStatusLog, i) => (
              <div key={i} className={cn("mt-2 pt-1.5 text-xs", { "border-t": i !== 0 })}>
                <p>
                  Status: <span className="text-muted-foreground">{log.status}</span>
                </p>
                <p>
                  Updated Ad:{" "}
                  <span className="text-muted-foreground">
                    {format(new Date(log.updatedAt), "PP HH:mm:ss")}
                  </span>
                </p>
                <p>
                  Updated:{" "}
                  <span className="text-muted-foreground">
                    {typeof log.updatedBy === "object"
                      ? `${log.updatedBy.name.firstName} ${log.updatedBy.name.lastName}`
                      : "Unknown User"}
                    {". "}
                    {log.updatedFrom}
                  </span>
                </p>
              </div>
            ))}

            {parcel.statusLogs.length > 2 && (
              <p className="mt-4 text-xs text-foreground/90 bg-green-400/7 p-0.5">
                Click on parcel detail to see all status...
              </p>
            )}
          </div>
        </div>

        <ParcelActionButtons parcel={parcel} />
      </CardContent>
    </Card>
  );
}
