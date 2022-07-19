import type {NextPage} from "next";
import {trpc} from "../utils/trpc";
import axios from "axios";
import {GetServerSideProps} from 'next'
import {getUser} from './api/user'
import {withServerSideAuth} from "@clerk/nextjs/ssr";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import CreateOrganization from "../components/CreateOrgnization";


const Home: NextPage = () => {
    const hello = trpc.useQuery(["example.getAll"]);

    const { organizationList, isLoaded } = useOrganizationList();


    console.log(isLoaded, 'load',organizationList)

    if (!isLoaded) {
        return <span>loading</span>
    }


    return (
        <>
            <div className="relative pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
                hi
                {/*<CreateOrganization isOpen={false}/>*/}
                {hello.data ? <p>{hello.data.toString()}</p> : <p>Loading..</p>}
            </div>
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

export default Home;
