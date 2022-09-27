import {FC} from 'react';
import Link from 'next/link';

type Props = {
  nickname: string;
  id: string;
};

const Property: FC<Props> = ({nickname, id}) => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg shadow-lg bg-white max-w-sm">
        <img className="rounded-t-lg" src="https://mdbootstrap.com/img/new/standard/nature/184.jpg" alt="" />
        <div className="p-6">
          <h5 className="text-gray-900 text-xl font-medium mb-2">{nickname}</h5>
          <Link href={`/properties/${id}`}>
            <button
              type="button"
              className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              View property
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Property;
