import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import ParcelForm from "@/components/modules/parcel/ParcelForm";
import {
  ParcelFormSchema,
  type ParcelFormValues,
} from "@/components/modules/parcel/parcelFormValidation";
import { Button } from "@/components/ui/button";
import { ParcelTypes } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddParcel() {
  const [submitting, setSubmitting] = useState<boolean>(false);

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

  const onSubmit = async (data: ParcelFormValues) => {
    setSubmitting(true);
    const kilo = data.kilo;
    const gram = data.gram / 1000;

    const parcelData = {
      title: data.title,
      description: data.description || "",
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

    console.log({ data });
    console.log({ parcelData });
    setSubmitting(false);
  };

  //

  return (
    <div>
      <h2 className="text-4xl font-semibold text-primary text-center">Add Parcel Form</h2>
      <p className="text-center text-muted-foreground mt-1 mb-7">
        Enter all valid values to create a Parcel; the parcel will then be made public.
      </p>
      <div className="w-full max-w-4xl mx-auto border p-5 rounded-2xl">
        <ParcelForm form={form} onSubmit={onSubmit} formId="_create_parcel_from_id" />

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
