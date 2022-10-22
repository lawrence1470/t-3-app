import {NextPageWithLayout} from '../../_app';
import {useUser} from '@clerk/nextjs';
import {trpc} from '@/utils/trpc';
import Loader from '@/common/Loader';
import {isFetchedWithSuccess} from '../../../helpers';
import Property from '@/common/Property';
import LoadingSpinner from 'react-spinners/HashLoader';
import Button from '@/common/Button';
import {useRouter} from 'next/router';
import { toast } from "react-toastify";

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const query = trpc.useQuery(['tenant.findAssociatedUnit'], {});

  const mutationPayRent = trpc.useMutation('stripe.payRent', {
    onSuccess: data => {
      const url = data.url;
      router.push(url!);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  console.log(query, 'query');

  if (!isFetchedWithSuccess(query)) {
    return <LoadingSpinner />;
  }

  const {unit} = query.data;

  const handlePayRent = () => {
    mutationPayRent.mutate();
  };

  return (
    <>
      <section className="mb-32 text-gray-800 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-6 xl:gap-12 items-center">
          <div className="mb-6 lg:mb-0">
            <div>
              <div className="p-10">
                {unit ? (
                  <div className="mb-6 lg:mb-0">
                    <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight">
                      Are you ready <br />
                      <span className="text-blue-600">You are part of unit {unit.unitName}</span>
                    </h2>
                    <div>
                      <Button onClick={handlePayRent}>Pay rent</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1> you are not part of any units</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
