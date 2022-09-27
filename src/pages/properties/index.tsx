import {NextPage} from 'next';
import TitleContentLayout from '../../components/layouts/TitleContentLayout';
import Link from 'next/link';
import {trpc} from '@/utils/trpc';
import {useUser} from '@clerk/nextjs';
import Property from '@/common/Property';

const EmptyProperty = () => {
  return (
    <Link href="/properties/new">
      <button
        type="button"
        className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400"
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
          />
        </svg>
        <span className="mt-2 block text-sm font-medium text-gray-900">Create a new property</span>
      </button>
    </Link>
  );
};

const Properties: NextPage = () => {
  const {user} = useUser();

  const query = trpc.useQuery(['property.getAllByUser', {landlordId: user!.id}], {
    enabled: typeof user?.id !== 'undefined',
  });

  return (
    <TitleContentLayout title="Properties" isLoading={query.isLoading}>
      <div>
        {!query.data && <EmptyProperty />}
        <div className="grid grid-cols-3 gap-12">
          {query.data && query.data.map(({nickname, id}) => <Property key={nickname} nickname={nickname} id={id} />)}
        </div>
      </div>
    </TitleContentLayout>
  );
};

export default Properties;
