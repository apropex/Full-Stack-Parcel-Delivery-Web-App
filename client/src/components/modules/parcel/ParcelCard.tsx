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
import { format } from "date-fns";
import ParcelActionButtons from "./ParcelActionButtons";

const { Received, Blocked } = ParcelStatus;

export default function ParcelCard({ parcel }: { parcel: iParcelResponse }) {
  //
  const Status = parcel.status;

  const isReceived = Status === Received;
  const isBlocked = Status === Blocked;

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

        <ParcelActionButtons parcel={parcel} />
      </CardContent>
    </Card>
  );
}
