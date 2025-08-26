import Loading from "@/components/loader/Loading";
import ParcelCard from "@/components/modules/parcel/ParcelCard";
import { Button } from "@/components/ui/button";
import DataFiltering from "@/lib/DataFiltering";
import { useGetAllParcelsQuery } from "@/redux/features/parcel.api";
import parcelChunkArrayMaker from "@/utils/parcelChunkArrayMaker";
import { useSearchParams } from "react-router";

export default function AllParcels() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || undefined;
  const trackingId = searchParams.get("trackingId") || undefined;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const sort = searchParams.get("sort") || undefined;

  const {
    data: parcels,
    isLoading,
    isError,
  } = useGetAllParcelsQuery(
    { search, trackingId, status, type, sort, page, limit },
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading) return <Loading />;
  if (!isLoading && isError) return <div>Something is wrong...</div>;

  const parcelsChunks = parcelChunkArrayMaker(parcels!, Math.ceil(parcels!.length / 4));

  return (
    <section>
      <div className="text-center">
        <h2 className=" text-3xl font-semibold">All Parcels</h2>
        <p className=" mt-4">These parcels are editable, deletable, and cancelable.</p>
      </div>

      <div className="flex justify-end mt-8">
        <DataFiltering>
          <Button variant="outline">Open Parcel Filter</Button>
        </DataFiltering>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
        {parcelsChunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="space-y-3">
            {chunk.map((parcel, index) => (
              <ParcelCard parcel={parcel} key={index} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
