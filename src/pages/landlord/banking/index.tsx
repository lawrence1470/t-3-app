import {NextPageWithLayout} from '../../_app';
import {trpc} from '@/utils/trpc';
import Loader from '@/common/Loader';
import Button from '@/common/Button';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';
import {ReactElement} from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import TitleContentLayout from '../../../components/layouts/TitleContentLayout';
import {isFetchedWithSuccess} from '../../../helpers';
import LoadingSpinner from 'react-spinners/HashLoader';

const Banking: NextPageWithLayout = () => {
  const router = useRouter();
  const mutationAddStripe = trpc.useMutation('stripe.createConnectedAccount', {
    onSuccess: data => {
      const link = data.url;
      router.push(link);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const mutationEditStripe = trpc.useMutation('stripe.createConnectedAccount', {
    onSuccess: data => {
      const link = data.url;
      router.push(link);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const query = trpc.useQuery(['stripe.getConnectedAccount']);

  const handleAddStripe = () => {
    mutationAddStripe.mutate();
  };

  const handleStripeDashBoard = () => {
    mutationEditStripe.mutate();
  };

  if (!isFetchedWithSuccess(query)) {
    return <LoadingSpinner />;
  }

  const {stripAccount, availableBalance, pendingBalance} = query.data;

  return (
    <>
      <Loader isLoading={mutationAddStripe.isLoading}>
        <div>
          {stripAccount ? (
            <div>
              {stripAccount.charges_enabled ? (
                <div>
                  <h1>All good</h1>
                  {/*<p>Pending {balance.pending}</p>*/}
                  <div className="">
                    <span>Available</span> ${availableBalance}
                    <span>Pending</span> ${pendingBalance}
                  </div>
                </div>
              ) : (
                <div>
                  <h1>still missing information</h1>
                  <Button onClick={handleStripeDashBoard}>Go to stripe dashboard</Button>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={handleAddStripe}>Add banking information using stripe</Button>
          )}
        </div>
      </Loader>
    </>
  );
};

Banking.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <TitleContentLayout title="Banking">{page}</TitleContentLayout>
    </AppLayout>
  );
};

export default Banking;
