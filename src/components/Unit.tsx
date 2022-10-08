import {FC} from 'react';
import Link from 'next/link';
import Avatar from '@/common/Avatar';
import {trpc} from '@/utils/trpc';
import LoadingSpinner from 'react-spinners/HashLoader';
import { isFetchedWithSuccess } from "../helpers";

type Props = {
  unitName: string;
  id: string;
};

const Unit: FC<Props> = ({unitName, id}) => {
  const query = trpc.useQuery(['unit.getById', {unitId: id}], {});

  return (
    <>
      {!isFetchedWithSuccess(query) ? (
        <LoadingSpinner color="black" size={30} />
      ) : (
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
          <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">Unit: {unitName}</h5>
          <p className="text-gray-700 text-base mb-4">Something something something</p>
          <div className="flex items-center">
            <Link href={`/landlord/units/${id}`}>
              <button
                type="button"
                className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                View Unit
              </button>
            </Link>
            <div>{query.data.unit.tenantId ? <Avatar /> : <h1>no user</h1>}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Unit;
