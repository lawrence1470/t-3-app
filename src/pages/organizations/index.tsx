import {NextPage} from 'next';
import {useOrganization, useOrganizationList} from '@clerk/nextjs';
import Button from '@/common/Button';
import {useRouter} from 'next/router';

const Organizations: NextPage = () => {
  const router = useRouter();
  const {setActive, organizationList, isLoaded} = useOrganizationList();
  const {organization} = useOrganization();

  if (!isLoaded) {
    return null;
  }

  console.log(organizationList, 'list');

  const handleSelect = (type: 'landlord' | 'tenant', orgId: string) => {
    setActive({organization: orgId});

    type === 'landlord' ? router.push('/properties') : router.push('/tenants');
  };

  const landlordOrgs = organizationList.filter(org => org.membership.role === 'admin');
  const tenantOrgs = organizationList.filter(org => org.membership.role === 'basic_member');

  return (
    <div>
      <h1 className="text-2xl font-bold underline">choose and organization</h1>
      <div>
        <h1>As a tenant</h1>
        {tenantOrgs.map(org => (
          <div key={org.organization.id}>
            <Button onClick={() => handleSelect('tenant', org.organization.id)} color="Primary">
              {org.organization.name}
            </Button>
          </div>
        ))}
      </div>

      <div>
        <h1>As a landlord</h1>
        {landlordOrgs.map(org => (
          <div key={org.organization.id}>
            <Button color="Primary" onClick={() => handleSelect('landlord', org.organization.id)}>
              {org.organization.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Organizations;
