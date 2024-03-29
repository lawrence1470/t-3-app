import {NextPageWithLayout} from '../../_app';
import {useUser} from '@clerk/nextjs';
import {trpc} from '@/utils/trpc';
import Loader from '@/common/Loader';
import {isFetchedWithSuccess} from '../../../helpers';
import Property from '@/common/Property';
import { ReactElement } from "react";
import AppLayout from "../../../components/layouts/AppLayout";
import TitleContentLayout from "../../../components/layouts/TitleContentLayout";
import Banking from "../banking";

const Dashboard: NextPageWithLayout = () => {
  const {user} = useUser();

  const query = trpc.useQuery(['property.getAllByLandlord', {landlordId: user!.id}], {
    enabled: typeof user?.id !== 'undefined',
  });

  return (
    <>
      <Loader isLoading={query.isLoading}>
        <div>
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">landlord dashboard</div>
        </div>
      </Loader>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <TitleContentLayout title="Dashboard">{page}</TitleContentLayout>
    </AppLayout>
  );
};

export default Dashboard;
