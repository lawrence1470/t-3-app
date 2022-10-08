import {GetServerSideProps, NextPage} from 'next';
import {trpc} from '@/utils/trpc';
import TitleContentLayout from '../../../components/layouts/TitleContentLayout';
import {Form, useForm} from '@/common/Form';
import {z} from 'zod';
import Input from '@/common/Input';
import {isNull, uniqueId} from 'lodash-es';
import {toast} from 'react-toastify';
import {NextRouter, useRouter} from 'next/router';
import {FC, ReactElement, useState} from 'react';
import Button from '@/common/Button';
import {isFetchedWithSuccess} from '../../../helpers';
import AppLayout from '../../../components/layouts/AppLayout';
import {NextPageWithLayout} from '../../_app';
import {appRouter} from '../../../server/router';
import {createContext} from '../../../server/router/context';
import superjson from 'superjson';
import {createSSGHelpers} from '@trpc/react/ssg';
import LoadingSpinner from 'react-spinners/HashLoader';

const schema = z.object({
  query: z.string(),
});

type Schema = z.infer<typeof schema>;

type Props = {
  id: string;
};

const Unit: NextPageWithLayout<Props> = ({id}) => {
  const router = useRouter();

  const queryUnit = trpc.useQuery(['unit.getById', {unitId: id}], {
    enabled: id !== 'undefined',
  });

  const getTenants = trpc.useMutation(['tenant.findByQuery'], {});

  const removeTenant = trpc.useMutation(['unit.removeTenant'], {
    onSuccess: () => {
      toast.success('User has been removed');
      queryUnit.refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const addUser = trpc.useMutation(['unit.addUser'], {
    onSuccess: () => {
      toast.success('User has been added successfuly');
      queryUnit.refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: schema,
  });

  const onSubmit = (formValues: Schema) => {
    if (!router.isReady) {
      return toast.error('Request could not be submitted');
    }
    getTenants.mutate({query: formValues.query});
  };


  const handleAddUser = (id: string) => {
    const unitId = router.query.id as string;
    addUser.mutate({tenantId: id, unitId});
  };

  const removeUser = (unitId: string) => {
    removeTenant.mutate({unitId});
  };

  if (!isFetchedWithSuccess(queryUnit)) {
    return <LoadingSpinner />;
  }

  const {unit, tenant} = queryUnit.data;


  return (
    <>
      <div>
        {isNull(tenant) ? (
          <div>
            <h1>there are no users attached to this unit</h1>

            <Form form={form} onSubmit={onSubmit}>
              <Input type="text" placeholder="Type here" {...form.register('query')} />

              <button className="rounded bg-green-300 p-1" type="submit">
                Find user
              </button>
            </Form>
            {getTenants.isLoading ? (
              <LoadingSpinner />
            ) : (
              getTenants.isSuccess &&
              getTenants.data.map(tenant => (
                <div key={tenant.id}>
                  <Button onClick={() => handleAddUser(tenant.id)} type="button" color="Primary">
                    {tenant.emailAddresses[0]!.emailAddress!}
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            <h1>There is someone attached to this</h1>
            <div>
              <h1>{tenant.emailAddress}</h1>
              <Button onClick={() => removeUser(unit.id)} color={'Error'}>
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// TODO get rid of Server side
export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.prefetchQuery('unit.getById', {
    unitId: query.id as string,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: query.id,
    },
  };
};

Unit.getLayout = function getLayout(page: ReactElement) {
  const unitQuery = trpc.useQuery(['unit.getById', {unitId: page.props.id}], {});

  return (
    <AppLayout>
      <TitleContentLayout title="Unit">{page}</TitleContentLayout>
    </AppLayout>
  );
};

export default Unit;
