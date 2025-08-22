import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ParcelTypes } from "@/constants";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { ParcelFormValues } from "./parcelFormValidation";

interface ParcelFormProps {
  form: UseFormReturn<ParcelFormValues>;
  onSubmit: SubmitHandler<ParcelFormValues>;
  formId: string;
}

export default function ParcelForm({ form, onSubmit, formId }: ParcelFormProps) {
  // const [kilo, gram] = form.watch(["kilo", "gram"]);

  //
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id={formId}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parcel Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title here..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parcel Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter description here..."
                  className="min-h-32 max-h-60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a parcel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ParcelTypes).map((type) => (
                      <SelectItem value={type} key={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kilo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilogram</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="peer pe-12"
                      placeholder="kilo"
                      type="number"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      kilo
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gram</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="peer pe-12"
                      placeholder="gram"
                      type="number"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      gram
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PICKUP ADDRESS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6 border-t pt-6">
          <Label>Pickup Address</Label>
          <FormField
            control={form.control}
            name="pickupStreet"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter street" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupStateOrProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter postal code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter country" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DELIVERY ADDRESS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6 border-t pt-6">
          <Label>Delivery Address</Label>
          <FormField
            control={form.control}
            name="deliveryStreet"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter street" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryStateOrProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter postal code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter country" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
