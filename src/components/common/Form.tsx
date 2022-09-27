import React from 'react';
// function to resolve zod schema we provide
import {zodResolver} from '@hookform/resolvers/zod';

// We will fully type `<Form />` component by providing component props and fwding // those
import {ComponentProps} from 'react';

import {
  // we import useForm hook as useHookForm
  useForm as useHookForm,
  // typescript types of useHookForm props
  UseFormProps as UseHookFormProps,
  // context provider for our form
  FormProvider,
  // return type of useHookForm hook
  UseFormReturn,
  // typescript type of form's field values
  FieldValues,
  // type of submit handler event
  SubmitHandler,
  // hook that would return errors in current instance of form
  useFormContext,
} from 'react-hook-form';

// Type of zod schema
import {ZodSchema, TypeOf} from 'zod';

// We provide additional option that would be our zod schema.
interface UseFormProps<T extends ZodSchema<any>> extends UseHookFormProps<TypeOf<T>> {
  schema: T;
}

export const useForm = <T extends ZodSchema<any>>({schema, ...formConfig}: UseFormProps<T>) => {
  return useHookForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
};

// we omit the native `onSubmit` event in favor of `SubmitHandler` event
// the beauty of this is, the values returned by the submit handler are fully typed

interface FormProps<T extends FieldValues = any> extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export const Form = <T extends FieldValues>({form, onSubmit, children, ...props}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      {/* the `form` passed here is return value of useForm() hook */}
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset disabled={form.formState.isSubmitting}>{children}</fieldset>
      </form>
    </FormProvider>
  );
};

export function FieldError({name}: {name?: string}) {
  // the useFormContext hook returns the current state of hook form.
  const {
    formState: {errors},
  } = useFormContext();

  if (!name) return null;

  const error = errors[name];

  if (!error) return null;

  return <span>{`${error.message}`}</span>;
}
