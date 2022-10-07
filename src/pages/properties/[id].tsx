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
import Unit from '../../components/Unit';

const schema = z.object({
  units: z.array(
    z.object({
      unitName: z.string().min(1, "Can't be empty"),
    })
  ),
});

type Schema = z.infer<typeof schema>;

const Property: NextPage = () => {
  const router = useRouter();

  const [isEditingUnits, setEditUnits] = useState(false);

  const mutation = trpc.useMutation(['unit.create'], {
    onSuccess: () => {
      toast.success('Successfully added units');
      query.refetch();
      setEditUnits(false);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: schema,
    defaultValues: {
      units: [{unitName: ''}],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'units',
  });

  const onSubmit = (formValues: Schema) => {
    if (!router.isReady) {
      return toast.error('Request could not be submitted');
    }
    const {units} = formValues;
    const propertyId = router.query.id! as string; // TODO maybe clean this up;
    mutation.mutate({
      units,
      propertyId,
    });
  };

  const handleAddUnit = () => {
    append({unitName: ''});
  };

  const handleRemoveUnit = (index: number) => {
    remove(index);
  };

  const query = trpc.useQuery(['property.getPropertyById', {propertyId: router.query.id! as string}], {
    enabled: typeof router.query.id !== 'undefined',
  });

  const handleUnitEditing = () => {
    setEditUnits(!isEditingUnits);
  };

  return (
    <TitleContentLayout title="Property" isLoading={query.isLoading}>
      <div>
        <Button onClick={handleUnitEditing} type="button" color={isEditingUnits ? 'Error' : 'Primary'}>
          {isEditingUnits ? 'Cancel' : 'Add / Edit Units'}
        </Button>
        {isEditingUnits && (
          <div>
            <Form form={form} onSubmit={onSubmit}>
              {fields.map((field, index) => (
                <div key={uniqueId('unit-form-')} className="flex items-center">
                  <Input type="text" placeholder="Unit name" {...form.register(`units.${index}.unitName`)} />
                  {fields.length > 1 && (
                    <Button color="Error" onClick={() => handleRemoveUnit(index)} type="button">
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button color="Primary" type="submit">
                Submit units
              </Button>
            </Form>
            <div className="mt-10">
              <Button onClick={handleAddUnit} type="button" color="Primary">
                Add another unit
              </Button>
            </div>
          </div>
        )}{' '}
        <div>
          {query.isSuccess && query.data && (
            <div>
              {query.data.units.length ? (
                query.data.units.map(unit => (
                  <div key={uniqueId('unit-')} className="my-5">
                    <Unit unitName={unit.unitName} id={unit.id} />
                  </div>
                ))
              ) : (
                <div>Please create some units</div>
              )}
            </div>
          )}
        </div>
      </div>
    </TitleContentLayout>
  );
};

export default Property;
