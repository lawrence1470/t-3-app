import type {NextPage} from 'next';
import {trpc} from '@/utils/trpc';
import {useForm, Form} from '@/common/Form';
import Input from '@/common/Input';
import {zodResolver} from '@hookform/resolvers/zod';
import TitleContentLayout from '../../../components/layouts/TitleContentLayout';
import {z} from 'zod';
import Loader from '@/common/Loader';
import dynamic from 'next/dynamic';
import {ReactElement, useEffect, useState} from 'react';
import {GeoJSON} from 'geojson';
import {ToastContainer, toast} from 'react-toastify';
import {useUser} from '@clerk/clerk-react';
import {useRouter} from 'next/router';
import AppLayout from '../../../components/layouts/AppLayout';
import Properties from './index';
import {NextPageWithLayout} from '../../_app';

/*
  Mapbox causes an error when rendered with SSR
  The following import renders mapbox without SSR
*/

const AddressAutofill = dynamic(
  () => {
    return import('../../../components/AddressAutofill');
  },
  {ssr: false}
);

const AddressMiniMap = dynamic(
  () => {
    return import('../../../components/AddressMiniMap');
  },
  {ssr: false}
);

const schema = z.object({
  nickname: z.string().min(5, {message: 'Must be 5 or more characters long'}),
  streetAddress: z.string().min(1, {message: 'is required'}),
  zip: z.string().min(1, {message: 'is required'}),
  state: z.string().min(1, {message: 'is required'}),
  city: z.string().min(1, {message: 'is required'}),
});

type Schema = z.infer<typeof schema>;

const NewProperty: NextPageWithLayout = () => {
  const form = useForm({
    schema: schema,
  });

  const {user} = useUser();
  const router = useRouter();
  const [geoLocation, setGeoLocation] = useState<GeoJSON.Feature<GeoJSON.Point> | undefined>(undefined);

  const mutation = trpc.useMutation(['property.create'], {
    onSuccess: () => {
      router.push('/landlord/properties');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = (formValues: Schema) => {
    const landlordId = user?.id;

    if (typeof landlordId !== 'string') {
      toast.error('Error: Your profile could not be found');
      return;
    }

    mutation.mutate({...formValues, landlordId});
  };

  return (
    <>
      <div>
        <AddressMiniMap geoLocation={geoLocation} />
        <Form form={form} onSubmit={onSubmit}>
          <Input label="Property nickname" type="text" placeholder="Property nickname" {...form.register('nickname')} />
          <AddressAutofill setGeoLocation={setGeoLocation}>
            <Input
              label="Address"
              type="text"
              placeholder="Address"
              {...form.register('streetAddress')}
              autoComplete="street-address"
            />
          </AddressAutofill>
          <Input
            label="State"
            type="text"
            placeholder="State"
            {...form.register('state')}
            autoComplete="address-level1"
          />
          <Input label="City" type="text" placeholder="City" {...form.register('city')} autoComplete="address-level2" />
          <Input
            label="ZIP / Postcode"
            type="text"
            placeholder="ZIP / Postcode"
            {...form.register('zip')}
            autoComplete="postal-code"
          />

          <button className="rounded bg-green-300 p-1" type="submit">
            Create Property
          </button>
        </Form>
      </div>
    </>
  );
};

NewProperty.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <TitleContentLayout title="New Property">{page}</TitleContentLayout>
    </AppLayout>
  );
};

export default NewProperty;
