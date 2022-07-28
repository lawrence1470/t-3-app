import type { NextPage } from "next";
import React from 'react'
import { trpc } from "../../utils/trpc";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";


const Test: NextPage = () => {


  return (
    <>
      <h1>test</h1>
    </>
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

export default Test;
