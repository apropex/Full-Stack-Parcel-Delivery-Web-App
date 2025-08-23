import { useMyParcelsQuery } from "@/redux/features/parcel.api";

import Loading from "@/components/loader/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { iParcelResponse, iStatusLog } from "@/types";
import { format } from "date-fns";
import { Edit2Icon, EyeIcon, Trash2Icon, XIcon } from "lucide-react";

const chunkArray = (array: iParcelResponse[], chunkSize: number): iParcelResponse[][] => {
  const result: iParcelResponse[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
};

export default function WallOfLoveSection() {
  const { data: parcels, isLoading, isError } = useMyParcelsQuery(null);

  if (isLoading) return <Loading />;
  if (!isLoading && isError) return <div>Something is wrong...</div>;

  const parcelsChunks = chunkArray(parcels!, Math.ceil(parcels!.length / 4));

  return (
    <section>
      <div className="text-center">
        <h2 className=" text-3xl font-semibold">Loved by the Community</h2>
        <p className=" mt-6">Harum quae dolore orrupti aut temporibus ariatur.</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
        {parcelsChunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="space-y-3">
            {chunk.map((parcel, index) => (
              <Card
                key={index}
                className={cn({
                  "border-red-400/50": parcel.status === "Blocked",
                  "border-green-400/50": parcel.status === "Received",
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
                          "bg-red-400": parcel.status === "Blocked",
                          "bg-green-600": parcel.status === "Received",
                        })}
                      >
                        {parcel.status}
                      </span>
                    </p>

                    <div className="space-y-1">
                      <p>
                        Parcel Type:{" "}
                        <span className="text-muted-foreground">{parcel.type}</span>
                      </p>

                      <div className="flex justify-between flex-wrap gap-1">
                        <p>
                          Parcel Weight:{" "}
                          <span className="text-muted-foreground">{parcel.weight}kg</span>
                        </p>
                        <p>
                          Parcel Rent:{" "}
                          <span className="text-muted-foreground">৳{parcel.rent}</span>
                        </p>
                      </div>

                      <p>
                        Delivery Address:{" "}
                        <span className="text-muted-foreground">
                          {parcel.deliveryAddress.street},{" "}
                          {parcel.deliveryAddress.stateOrProvince},{" "}
                          {parcel.deliveryAddress.city}, {parcel.deliveryAddress.country}
                        </span>
                      </p>
                    </div>

                    <div className="mt-2">
                      <p className="bg-muted px-1 py-1 rounded-xs">All Status Logs</p>
                      {parcel.statusLogs.map((log: iStatusLog, i) => (
                        <div key={i} className="border-t mt-2 pt-1.5">
                          <p>
                            Status:{" "}
                            <span className="text-muted-foreground">{log.status}</span>
                          </p>
                          <p>
                            Status Date:{" "}
                            <span className="text-muted-foreground">
                              {format(log.updatedAt, "PP")}
                            </span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              {log.updatedFrom}
                            </span>
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
                    <Button
                      variant={"outline"}
                      className="flex-1"
                      disabled={
                        parcel.status !== "Requested" && parcel.status !== "Approved"
                      }
                    >
                      {parcel.status === "Blocked" ? (
                        "Blocked"
                      ) : parcel.status !== "Requested" &&
                        parcel.status !== "Approved" ? (
                        "Dispatched"
                      ) : (
                        <>
                          <XIcon /> Cancel
                        </>
                      )}
                    </Button>
                    <Button
                      variant={"outline"}
                      className="flex-1"
                      disabled={parcel.status === "Blocked"}
                    >
                      <Edit2Icon />
                      Edit
                    </Button>
                    <Button
                      variant={"outline"}
                      className="flex-1"
                      disabled={
                        parcel.status !== "Requested" &&
                        parcel.status !== "Approved" &&
                        parcel.status !== "Blocked"
                      }
                    >
                      <Trash2Icon />
                      Delete
                    </Button>
                    <Button variant={"outline"} className="flex-1">
                      <EyeIcon />
                      See The Parcel In Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
