import type { NextPage } from "next";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";


const Organization: NextPage = () => {
  const router = useRouter();
  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setOrganizationName(val);
  };

  const createOrganizationMutation = useMutation(() => {
    return fetch("/api/createOrganization", { method: "POST", body: JSON.stringify({ test: "test" }) });
  });

  const handleSubmit = async () => {
    if (organizationName !== "" && createOrganization) {
      await createOrganization({ name: organizationName });
      router.push("/properties");
    }
  };


  return (
    <div className="flex flex-col h-full p-10">
      <h1 className="relative pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
        organizations
      </h1>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Organization name
        </label>
        <div className="mt-1">
          <input
            onChange={(e) => handleChange(e)}
            type="text"
            name="orgName"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button onClick={handleSubmit} className="bg-green-300 rounded p-1 mt-5">create org</button>
    </div>
  );
};


// export const getServerSideProps = withServerSideAuth(async ({req}) => {
//     // const {userId} = req.auth
//     // console.log(userId, 'id of user')
//     // const res = await axios.get(`https://api.clerk.dev/v1/users/${userId}`, {
//     //     headers: {
//     //         "Authentication": process.env.CLERK_API_KEY as string
//     //     }
//     // })
//     //
//     // console.log('fsdfds', res.data)
//     return {props: {}}
// })

export default Organization;
