import {NextPage} from 'next';
import {trpc} from '@/utils/trpc';
import TitleContentLayout from '../../components/layouts/TitleContentLayout';
import {Form, useForm} from '@/common/Form';
import {z} from 'zod';
import {useFieldArray} from 'react-hook-form';
import Input from '@/common/Input';
import {uniqueId} from 'lodash-es';
import {toast} from 'react-toastify';
import {NextRouter, useRouter} from 'next/router';
import {FC, useState} from 'react';
import Button from '@/common/Button';

const schema = z.object({
  query: z.string(),
});

type Schema = z.infer<typeof schema>;

const Unit: NextPage = () => {
  const router = useRouter();

  const queryUnits = trpc.useQuery(['unit.getById', {unitId: router.query.id! as string}], {
    enabled: typeof router.query.id !== 'undefined',
  });

  const getTenants = trpc.useMutation(['tenant.findByQuery'], {});

  const addUser = trpc.useMutation(['unit.addUser'], {
    onSuccess: () => {
      toast.success('User has been added successfuly');
      queryUnits.refetch();
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
    console.log('here');
    getTenants.mutate({query: formValues.query});
  };

  console.log(getTenants.data);

  const handleAddUser = (id: string) => {
    const unitId = router.query.id as string;
    addUser.mutate({tenantId: id, unitId});
  };

  return (
    <>
      {queryUnits.isSuccess && queryUnits.data && (
        <TitleContentLayout title={`Unit ${queryUnits.data.unit.unitName}`} isLoading={queryUnits.isLoading}>
          <div>
            {!queryUnits.data.tenant ? (
              <div>
                <h1>there are no users attached to this unit</h1>

                <Form form={form} onSubmit={onSubmit}>
                  <Input type="text" placeholder="Type here" {...form.register('query')} />

                  <button className="rounded bg-green-300 p-1" type="submit">
                    Find user
                  </button>
                </Form>
                {getTenants.data &&
                  getTenants.data.map(tenant => (
                    <div key={tenant.id}>
                      <Button onClick={() => handleAddUser(tenant.id)} type="button" color="Primary">
                        {tenant.emailAddresses[0]!.emailAddress}
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                <h1>There is someone attached to this</h1>
                <div>{queryUnits.data.tenant.emailAddress}</div>
              </div>
            )}
          </div>
        </TitleContentLayout>
      )}
    </>
  );
};

export default Unit;
