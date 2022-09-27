import {NextPage} from 'next';
import {useUser} from '@clerk/nextjs';
import {trpc} from '@/utils/trpc';
import TitleContentLayout from '../../components/layouts/TitleContentLayout';
import Link from 'next/link';

const Property: NextPage = () => {
  const {user} = useUser();

  const query = trpc.useQuery(['property.getAllByUser', {landlordId: user!.id}], {
    enabled: typeof user?.id !== 'undefined',
  });

  return (
    <TitleContentLayout title="Property" isLoading={query.isLoading}>
      <div>
        <h1>Here are all the tenants</h1>
        <Link href="/tenants">
          <button className="bg-blue-500 text-white p-2">Add more users</button>
        </Link>
      </div>
    </TitleContentLayout>
  );
};

export default Property;
