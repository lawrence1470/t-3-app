import type {NextPage} from "next";
import {trpc} from "../utils/trpc";

const Home: NextPage = () => {
    const hello = trpc.useQuery(["example.getAll"]);
    return (
        <>
            <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
                {hello.data ? <p>{hello.data.toString()}</p> : <p>Loading..</p>}
            </div>
        </>
    );
};

export default Home;
