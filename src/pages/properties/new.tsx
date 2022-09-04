import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TitleContentLayout from "../../components/layouts/TitleContentLayout";
import { z } from "zod";
import LoadingIndicator from "@/common/LoadingIndicator";
import dynamic from "next/dynamic";
import { useState } from "react";
import { GeoJSON } from "geojson";


/*
  Mapbox causes an error when rendered with SSR
  The following import renders mapbox without SSR
*/

const AddressAutofill = dynamic(
  () => {
    return import("../../components/AddressAutofill");
  },
  { ssr: false }
);

const AddressMiniMap = dynamic(
  () => {
    return import("../../components/AddressMiniMap");
  },
  { ssr: false }
);

const schema = z.object({
  nickname: z.string().min(5, { message: "Must be 5 or more characters long" })
});

type Schema = z.infer<typeof schema>;

const NewProperty: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: ""
    }
  });

  const [geoLocation, setGeoLocation] = useState<GeoJSON.Feature<GeoJSON.Point> | undefined>(undefined);

  const mutation = trpc.useMutation(["property.create"]);

  const onSubmit = (data: Schema) => {
    mutation.mutate({ nickname: data.nickname });
  };

  console.log(mutation.error, "error");
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    return <div>hello</div>;
  }

  return (
    <>
      <LoadingIndicator isLoading={mutation.isLoading} />
      <TitleContentLayout title="Create new property" isLoading={mutation.isLoading}>
        <div>
          <AddressMiniMap geoLocation={geoLocation} />
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Nick name" type="text" className="default_input_state" {...register("nickname")} />
            <AddressAutofill register={register} setGeoLocation={setGeoLocation} />
            <input
              type="text"
              className="default_input_state"
              placeholder="City"
              autoComplete="address-level2"
            />
            <input
              type="text"
              className="default_input_state"
              placeholder="State / Region"
              autoComplete="address-level1"
            />
            <input
              type="text"
              className="default_input_state"
              placeholder="ZIP / Postcode"
              autoComplete="postal-code"
            />
            <button className="rounded bg-green-300 p-1" type="submit">Create Property</button>


            <p>{errors.nickname?.message}</p>

          </form>
          {mutation.error && <p>Something went wrong! {mutation.error.message}</p>}
        </div>
      </TitleContentLayout>
    </>
  );
};


export default NewProperty;
