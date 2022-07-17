import type {NextPage} from "next";
import {trpc} from "../utils/trpc";
import axios from "axios";
import {GetServerSideProps} from 'next'
import {getUser} from './api/user'
import {withServerSideAuth} from "@clerk/nextjs/ssr";
import {useOrganization} from "@clerk/nextjs";
import {useRouter} from "next/router";
import CreateOrganization from "../components/CreateOrganization";


const Home: NextPage = () => {
    const router = useRouter()
    const hello = trpc.useQuery(["example.getAll"]);

    const {
        organization: currentOrganization,
        membership,
        isLoaded,
    } = useOrganization();


    if (!isLoaded || !currentOrganization) {
        // router.push('/?hasOrg=false')
    }

    return (
        <>
            <div className="relative pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
                hi
                <CreateOrganization isOpen={true}/>
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
