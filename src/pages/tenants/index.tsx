import {NextPage} from 'next';
import {useOrganizationList, useUser} from '@clerk/nextjs';
import {trpc} from '@/utils/trpc';
import TitleContentLayout from '../../components/layouts/TitleContentLayout';
import {useForm, Form} from '@/common/Form';
import {z} from 'zod';
import {useOrganization} from '@clerk/nextjs';
import Input from '@/common/Input';
import {toast} from 'react-toastify';
import {CreateOrganizationInvitationParams, OrganizationInvitationResource} from '@clerk/types';
import {OrganizationMembershipRole} from '@clerk/backend-core/src/api/resources/Enums';
import {first} from 'lodash-es';

const schema = z.object({
  emailAddress: z.string().email('Must be an email'),
});

type Schema = z.infer<typeof schema>;

const Tenants: NextPage = () => {
  const {user} = useUser();
  const {organizationList, isLoaded} = useOrganizationList();
  const {organization, invitationList} = useOrganization({invitationList: {}});

  console.log(organization, 'organization');

  const query = trpc.useQuery(['property.getAllByUser', {landlordId: user!.id}], {
    enabled: typeof user?.id !== 'undefined',
  });

  const mutation = trpc.useMutation(['tenant.invite'], {
    onSuccess: () => {
      toast.success('an email invite was sent!');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: schema,
  });

  const onSubmit = async ({emailAddress}: Schema) => {
    const orgOfAdmin = first(organizationList);

    // if () {
    //   try {
    //     await orgOfAdmin.organization.inviteMember({
    //       emailAddress: emailAddress,
    //       rol
    //     })// inviteMember({emailAddress: emailAddress, role: 'basic_member'});
    //   } catch (error) {
    //     console.error(error);
    //     toast.error('Something went wrong when inviting a user');
    //   }
    // }
    mutation.mutate({
      emailAddress,
      role: 'basic_member',
      inviterUserId: user!.id,
      organizationId: orgOfAdmin!.organization.id,
    });
  };

  const revoke = async (invitation: OrganizationInvitationResource) => {
    await invitation.revoke();
  };

  return (
    <TitleContentLayout title="Tenants" isLoading={query.isLoading}>
      <div>
        <h1>Lets invite a user</h1>

        <div>
          <Form form={form} onSubmit={onSubmit}>
            <Input label="Email" type="text" placeholder="Email" {...form.register('emailAddress')} />

            <button className="rounded bg-green-300 p-1" type="submit">
              Invite user
            </button>
          </Form>
        </div>

        <div>
          {!invitationList ? (
            <div>
              <h2>no users have been invited yet</h2>
            </div>
          ) : (
            <div>
              <ul>
                {invitationList.map(i => (
                  <li key={i.id}>
                    {i.emailAddress}
                    <button onClick={() => revoke(i)}>Revoke</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </TitleContentLayout>
  );
};

export default Tenants;
