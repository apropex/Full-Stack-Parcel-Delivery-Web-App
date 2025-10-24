import Loading from "@/components/loader/Loading";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import ParcelForm from "@/components/modules/parcel/ParcelForm";
import {
  ParcelFormSchema,
  type ParcelFormValues,
} from "@/components/modules/parcel/parcelFormValidation";
import MultipleImageUploader, {
  type iMultipleImageUploaderRef,
} from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ParcelTypes } from "@/constants";
import { cn } from "@/lib/utils";
import {
  useGetSingleParcelQuery,
  useUpdateParcelMutation,
} from "@/redux/features/parcel.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function UpdateParcel() {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const uploaderRef = useRef<iMultipleImageUploaderRef>(null);

  const {
    data: parcel,
    isLoading,
    isError,
  } = useGetSingleParcelQuery({ id: id! }, { skip: !id });

  const [updateParcel] = useUpdateParcelMutation();

  //
  const form = useForm<ParcelFormValues>({
    resolver: zodResolver(ParcelFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: ParcelTypes.Box,
      kilo: 0,
      gram: 0,
      pickupStreet: "",
      pickupCity: "",
      pickupStateOrProvince: "",
      pickupPostalCode: "",
      pickupCountry: "Bangladesh",
      deliveryStreet: "",
      deliveryCity: "",
      deliveryStateOrProvince: "",
      deliveryPostalCode: "",
      deliveryCountry: "Bangladesh",
    },
    mode: "onBlur",
  });

  const setValue = form.setValue;

  useEffect(() => {
    if (parcel) {
      const integerPart = Math.floor(parcel.weight);
      const fractionPart = +(parcel.weight - integerPart).toFixed(3);

      setValue("title", parcel.title);
      setValue("description", parcel.description);
      setValue("type", parcel.type as (typeof ParcelTypes)[keyof typeof ParcelTypes]);
      setValue("kilo", integerPart);
      setValue("gram", fractionPart);
      setValue("pickupStreet", parcel.pickupAddress.street);
      setValue("pickupCity", parcel.pickupAddress.city);
      setValue("pickupStateOrProvince", parcel.pickupAddress.stateOrProvince);
      setValue("pickupPostalCode", parcel.pickupAddress.postalCode);
      setValue("pickupCountry", parcel.pickupAddress.country);
      setValue("deliveryStreet", parcel.deliveryAddress.street);
      setValue("deliveryCity", parcel.deliveryAddress.city);
      setValue("deliveryStateOrProvince", parcel.deliveryAddress.stateOrProvince);
      setValue("deliveryPostalCode", parcel.deliveryAddress.postalCode);
      setValue("deliveryCountry", parcel.deliveryAddress.country);
    }
  }, [parcel, isLoading, setValue]);

  useEffect(() => {
    if (parcel?.images) setDefaultImages(parcel.images);
  }, [parcel]);

  //

  const onSubmit = async (data: ParcelFormValues) => {
    const kilo = data.kilo;
    const gram = data.gram / 1000;

    const parcelData = {
      title: data.title,
      description: data.description,
      type: data.type,
      weight: kilo + gram,
      pickupAddress: {
        street: data.pickupStreet,
        city: data.pickupCity,
        stateOrProvince: data.pickupStateOrProvince,
        postalCode: data.pickupPostalCode,
        country: data.pickupCountry,
      },
      deliveryAddress: {
        street: data.deliveryStreet,
        city: data.deliveryCity,
        stateOrProvince: data.deliveryStateOrProvince,
        postalCode: data.deliveryPostalCode,
        country: data.deliveryCountry,
      },
    };

    const loaderId = toast.loading("Updating parcel");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("data", JSON.stringify(parcelData));
    if (images && images.length > 0) {
      images.forEach((image) => formData.append("files", image));
    }

    try {
      const result = await updateParcel({ id: parcel!._id, data: formData }).unwrap();
      const message = result?.message;
      if (result.success) {
        toast.success(message, { id: loaderId });
        uploaderRef.current?.clearAll();
        form.reset();
        setImages([]);
      } else toast.error(message, { id: loaderId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update parcel", { id: loaderId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectImage = (link: string) => {
    if (selectedImages.some((image) => image === link)) {
      const filteredImages = selectedImages.filter((image) => image !== link);
      setSelectedImages(filteredImages);
    } else {
      setSelectedImages((prev) => [link, ...prev]);
    }
  };

  const handleRemoveImageView = (value?: string) => {
    if (value === "all") {
      setSelectedImages((prev) => [...defaultImages, ...prev]);
      setDefaultImages([]);
    } else {
      const filteredImages = defaultImages.filter(
        (image) => !selectedImages.some((link) => link === image)
      );
      setDefaultImages([...filteredImages]);
    }
  };

  if (isLoading) return <Loading />;
  if (!isLoading && isError) return <div>Something is wrong...</div>;

  //

  return (
    <div>
      <h2 className="text-4xl font-semibold text-primary text-center">
        Update Parcel Form
      </h2>
      <p className="text-center text-muted-foreground mt-1 mb-7">
        Enter all valid values to create a Parcel; the parcel will then be made public.
      </p>

      <div
        className={cn("w-full max-w-4xl mx-auto border p-5 rounded-2xl mt-8", {
          "animate-pulse": submitting,
        })}
      >
        <ParcelForm form={form} onSubmit={onSubmit} formId="_create_parcel_from_id" />

        {defaultImages.length < 3 && (
          <div className="mt-4">
            <Label className="mb-1.5">Add New Images</Label>
            <MultipleImageUploader
              ref={uploaderRef}
              onChange={setImages}
              defaultFiles={defaultImages.length}
            />
          </div>
        )}

        {defaultImages.length > 0 && (
          <>
            <Label className="mb-1.5 mt-6">Update Old Images</Label>
            <div className="border border-input rounded-xl overflow-hidden p-3">
              <div className="pb-3 flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImageView()}
                  disabled={defaultImages.length === 0 || selectedImages.length === 0}
                >
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove selected images
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImageView("all")}
                  disabled={defaultImages.length === 0}
                >
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Remove all
                </Button>
              </div>
              <div className="rounded-md overflow-hidden grid grid-cols-3 gap-2">
                {defaultImages.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectImage(image)}
                    className="w-full h-full cursor-pointer relative"
                  >
                    <img
                      src={image}
                      alt="img"
                      className={cn("w-full h-full object-cover", {
                        "opacity-40": selectedImages.some((link) => image === link),
                      })}
                    />
                    <span className="inline-flex items-center justify-center rounded-md p-1.5 absolute top-2 right-2 bg-background/60">
                      <Checkbox
                        id={image}
                        checked={selectedImages.some((link) => image === link)}
                        className="cursor-pointer"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={submitting}
            form="_create_parcel_from_id"
            className="mt-6 w-full max-w-md"
          >
            <LoadingSpinner
              isLoading={submitting}
              defaultText="Submit"
              loadingText="Submitting..."
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
