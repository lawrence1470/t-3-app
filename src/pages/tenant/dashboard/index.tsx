import {NextPageWithLayout} from '../../_app';
import {useUser} from '@clerk/nextjs';
import {trpc} from '@/utils/trpc';
import Loader from '@/common/Loader';
import {isFetchedWithSuccess} from '../../../helpers';
import Property from '@/common/Property';
import LoadingSpinner from 'react-spinners/HashLoader';

const Dashboard: NextPageWithLayout = () => {
  const {user} = useUser();

  const query = trpc.useQuery(['tenant.findAssociatedUnit'], {});

  console.log(query, 'query');

  if (!isFetchedWithSuccess(query)) {
    return <LoadingSpinner />;
  }

  const {unit} = query.data;

  return (
    <>
      <div>
        <div className="p-10">
          <h1>Tenant Dashboard</h1>
          {unit ? (
            <div>You are part of unit {unit.unitName}</div>
          ) : (
            <div>
              <h1> you are not part of any units</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
