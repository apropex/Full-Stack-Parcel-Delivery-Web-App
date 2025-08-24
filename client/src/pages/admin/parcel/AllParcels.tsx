import Loading from "@/components/loader/Loading";
import ParcelCard from "@/components/modules/parcel/ParcelCard";
import { useGetAllParcelsQuery } from "@/redux/features/parcel.api";
import parcelChunkArrayMaker from "@/utils/parcelChunkArrayMaker";

export default function AllParcels() {
  const { data: parcels, isLoading, isError } = useGetAllParcelsQuery(null);

  if (isLoading) return <Loading />;
  if (!isLoading && isError) return <div>Something is wrong...</div>;

  const parcelsChunks = parcelChunkArrayMaker(parcels!, Math.ceil(parcels!.length / 4));

  return (
    <section>
      <div className="text-center">
        <h2 className=" text-3xl font-semibold">My All Parcels</h2>
        <p className=" mt-6">These parcels are editable, deletable, and cancelable.</p>
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
