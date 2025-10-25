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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParcelTypes } from "@/constants";
import { cn } from "@/lib/utils";
import { useLazyGetSingleUserQuery } from "@/redux/features/auth.api";
import { useCreateParcelMutation } from "@/redux/features/parcel.api";
import type { iUserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AddParcel() {
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<boolean>(false);
  const [receiverInput, setReceiverInput] = useState<string>("");
  const [receiver, setReceiver] = useState<iUserInfo | null>(null);
  const [isInitial, setIsInitial] = useState<boolean>(true);

  const navigate = useNavigate();

  const [trigger, { isLoading, isError }] = useLazyGetSingleUserQuery();

  const uploaderRef = useRef<iMultipleImageUploaderRef>(null);

  const [createParcel] = useCreateParcelMutation();

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

  const { watch, setError, clearErrors } = form;
  const [kilo, gram] = watch(["kilo", "gram"]);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }

    const hasKilo = Number(kilo.toString().trim());
    const hasGram = Number(gram.toString().trim());

    if (hasKilo + hasGram <= 0) {
      setError("kilo", { type: "manual", message: "Weight is required" });
      setError("gram", { type: "manual", message: "Weight is required" });
    } else {
      clearErrors("kilo");
      clearErrors("gram");
    }

    //
  }, [kilo, gram, setError, clearErrors]);

  const onSubmit = async (data: ParcelFormValues) => {
    if (images.length <= 0) {
      setErrMsg(true);
      return;
    }

    const kilo = data.kilo;
    const gram = data.gram / 1000;

    const parcelData = {
      title: data.title,
      description: data.description,
      type: data.type,
      weight: kilo + gram,
      receiver: receiver?._id,
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

    const loaderId = toast.loading("Creating parcel");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("data", JSON.stringify(parcelData));
    images.forEach((image) => formData.append("files", image));

    try {
      const result = await createParcel(formData).unwrap();
      const message = result?.message;
      if (result.success) {
        toast.success(message, { id: loaderId });
        uploaderRef.current?.clearAll();
        form.reset();
        setImages([]);
        navigate("/sender/my-parcels");
      } else toast.error(message, { id: loaderId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to create parcel", { id: loaderId });
    } finally {
      setSubmitting(false);
    }
  };

  const getReceiver = async () => {
    if (!receiverInput) return;
    const result = await trigger({ idOrEmail: receiverInput }).unwrap();
    if (result?.email) setReceiver(result);
  };

  //

  return (
    <div>
      <h2 className="text-4xl font-semibold text-primary text-center">Add Parcel Form</h2>
      <p className="text-center text-muted-foreground mt-1 mb-7">
        Enter all valid values to create a Parcel; the parcel will then be made public.
      </p>

      <div
        className={cn("w-full max-w-4xl mx-auto border p-5 rounded-2xl", {
          "animate-pulse": submitting,
        })}
      >
        {receiver ? (
          <div>
            <p>Receiver Information</p>
            <div className="text-muted-foreground">
              <p>
                Name: {receiver.name?.firstName} {receiver.name?.lastName}
              </p>
              <p>Email: {receiver.email}</p>
            </div>
          </div>
        ) : (
          <div>
            <p>No receiver found, find the receiver entering the receiver's email.</p>
            <div className="flex items-center gap-2.5 mt-1.5">
              <Input
                type="email"
                placeholder="Enter parcel receiver's email here..."
                className={cn("flex-1 min-w-[300px]", {
                  "border-destructive": isError && !receiver,
                })}
                onChange={(e) => setReceiverInput(e.target.value)}
              />
              <Button
                size="sm"
                variant={"outline"}
                onClick={getReceiver}
                disabled={!receiverInput}
              >
                <LoadingSpinner
                  isLoading={isLoading}
                  defaultText="Submit"
                  loadingText="Submitting..."
                />
              </Button>
            </div>
            {isError && !receiver && (
              <span className="text-sm text-destructive mt-0.5">
                No receiver found, check email spelling and try again.
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={cn("w-full max-w-4xl mx-auto border p-5 rounded-2xl mt-8", {
          "animate-pulse": submitting,
        })}
      >
        <ParcelForm form={form} onSubmit={onSubmit} formId="_create_parcel_from_id" />

        <div className="mt-4">
          <Label className="mb-1.5">Select Images</Label>
          <MultipleImageUploader ref={uploaderRef} onChange={setImages} />
          {errMsg && images.length <= 0 && (
            <span className="text-destructive text-sm">Minimum 1 image is required</span>
          )}
        </div>

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
