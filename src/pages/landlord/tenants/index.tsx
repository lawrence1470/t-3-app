import {NextPage} from 'next';
import {trpc} from '@/utils/trpc';
import TitleContentLayout from '../../../components/layouts/TitleContentLayout';
import {useForm, Form} from '@/common/Form';
import {z} from 'zod';
import Input from '@/common/Input';
import {toast} from 'react-toastify';
import {OrganizationInvitationResource} from '@clerk/types';
import {first, uniqueId} from 'lodash-es';
import Button from '@/common/Button';
import {ReactElement} from 'react';
import AppLayout from '../../../components/layouts/AppLayout';
import Properties from '../properties';
import {NextPageWithLayout} from '../../_app';

const schema = z.object({
  emailAddress: z.string().email('Must be an email'),
});

type Schema = z.infer<typeof schema>;

const Tenants: NextPageWithLayout = () => {
  const query = trpc.useQuery(['tenant.getAllInvitations'], {});
  const form = useForm({
    schema: schema,
  });

  const mutation = trpc.useMutation(['tenant.invite'], {
    onSuccess: () => {
      toast.success('an email invite was sent!');
      query.refetch();
      form.reset({emailAddress: ''});
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const revokeMutation = trpc.useMutation(['tenant.revokeInvite'], {
    onSuccess: () => {
      toast.success('user has been removed');
      query.refetch();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = async ({emailAddress}: Schema) => {
    mutation.mutate({
      emailAddress,
    });
  };

  const revokeInvite = (id: string) => {
    revokeMutation.mutate({id});
  };

  query.data && query.data.pendingInvitations.map(inv => console.log(inv));

  return (
    <>
      <div>
        <h1>Lets invite a user</h1>
        <div>
          <Form form={form} onSubmit={onSubmit}>
            <Input type="text" placeholder="Email" {...form.register('emailAddress')} />

            <button className="rounded bg-green-300 p-1" type="submit">
              Invite user
            </button>
          </Form>
        </div>

        <div>
          {query.data &&
            query.data.pendingInvitations.map(inv => (
              <div key={uniqueId('pending-')} className="flex items-center">
                <div>
                  {inv.status}: {inv.emailAddress}
                </div>
                <Button onClick={() => revokeInvite(inv.id)} color="Error">
                  Revoke
                </Button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

Tenants.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <TitleContentLayout title="Tenants">{page}</TitleContentLayout>
    </AppLayout>
  );
};

export default Tenants;
