import {NextPage} from 'next';
import {useOrganizationList, useUser} from '@clerk/nextjs';
import {trpc} from '@/utils/trpc';
import TitleContentLayout from '../../components/layouts/TitleContentLayout';
import {useForm, Form} from '@/common/Form';
import {z} from 'zod';
import {useOrganization} from '@clerk/nextjs';
import Input from '@/common/Input';
import {toast} from 'react-toastify';
import {OrganizationInvitationResource} from '@clerk/types';
import {OrganizationMembershipRole} from '@clerk/backend-core/src/api/resources/Enums';
import {first, uniqueId} from 'lodash-es';
import Loader from '@/common/Loader';
import Button from '@/common/Button';

const schema = z.object({
  emailAddress: z.string().email('Must be an email'),
});

type Schema = z.infer<typeof schema>;

const Tenants: NextPage = () => {
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

  const revoke = async (invitation: OrganizationInvitationResource) => {
    await invitation.revoke();
  };

  const revokeInvite = (id: string) => {
    revokeMutation.mutate({id});
  };

  query.data && query.data.pendingInvitations.map(inv => console.log(inv));

  return (
    <>
      <TitleContentLayout title="Tenants" isLoading={query.isLoading}>
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
                <div key={uniqueId('pending-')}>
                  <div>
                    {inv.status}: {inv.email_address}
                  </div>
                  <Button onClick={() => revokeInvite(inv.id)} color="Error">
                    Revoke
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </TitleContentLayout>
    </>
  );
};

export default Tenants;
