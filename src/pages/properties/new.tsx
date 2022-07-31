import type { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TitleContentLayout from "../../components/layouts/TitleContentLayout";
import { z } from "zod";
import LoadingIndicator from "@/common/LoadingIndicator";


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

  const mutation = trpc.useMutation(["property.create"]);

  const onSubmit = (data: Schema) => {
    console.log("here", data.nickname);
    mutation.mutate({ nickname: data.nickname });
  };

  console.log(mutation.error, "error");


  return (
    <>
      <LoadingIndicator isLoading={isLoading} />
      <TitleContentLayout title="Create new property" isLoading={mutation.isLoading}>
        <div>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <input className="border-4" {...register("nickname")} />
            <p>{errors.nickname?.message}</p>
            <button className="rounded bg-green-300 p-1" type="submit">Create Property</button>
          </form>
          {mutation.error && <p>Something went wrong! {mutation.error.message}</p>}
        </div>
      </TitleContentLayout>
    </>
  );
};


export default NewProperty;
