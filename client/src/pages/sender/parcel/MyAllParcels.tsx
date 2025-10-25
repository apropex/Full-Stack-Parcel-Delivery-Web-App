import Loading from "@/components/loader/Loading";
import ParcelCard from "@/components/modules/parcel/ParcelCard";
import PaginationComponent from "@/components/PaginationComponent";
import DataFiltering from "@/lib/DataFiltering";
import { useMyParcelsQuery } from "@/redux/features/parcel.api";
import AllSearchParams from "@/utils/allSearchParams";
import parcelChunkArrayMaker from "@/utils/parcelChunkArrayMaker";

export default function MyAllParcels() {
  const { data, isLoading, isError } = useMyParcelsQuery(AllSearchParams(), {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <Loading />;
  if (!isLoading && isError) return <div>Something is wrong...</div>;

  const parcels = data!.data;

  const parcelsChunks = parcelChunkArrayMaker(parcels!, Math.ceil(parcels!.length / 4));

  const present_page = data?.meta?.present_page;
  const total_page = data?.meta?.total_page;

  return (
    <section>
      <div className="text-center">
        <h2 className=" text-3xl font-semibold">My All Parcels</h2>
        <p className=" mt-6">These parcels are editable, deletable, and cancelable.</p>
      </div>

      <div className="mt-8">
        <DataFiltering />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
        {parcelsChunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="space-y-3">
            {chunk.map((parcel, index) => (
              <ParcelCard
                parcel={parcel}
                key={index}
                index={(chunkIndex + 1) * chunk.length - chunk.length + index + 1}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PaginationComponent currentPage={present_page!} totalPages={total_page!} />
      </div>
    </section>
  );
}
