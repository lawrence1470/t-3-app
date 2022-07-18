import { Dialog } from "@headlessui/react";
import React, { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";


const Step2: FC<Partial<StepWizardChildProps> & { setName: (x: string) => void }> = (props) => {
  const { setName, nextStep, previousStep } = props;

  const handleName = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setName(value);
  };


  return (
    <div>
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        First set a name for your organization
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          An organization represents your real estate empire. You can create properties and invite users to
          your organization.
        </p>
      </div>

      <div className="mt-4">
        <input
          type="text"
          className="shadow-md focus:border-black focus:border-4 block w-full sm:text-sm border-black border-1 rounded-sm h-8 px-2"
          placeholder="Org name"
          onChange={handleName}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => previousStep && previousStep()}
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Back
        </button>
        <button
          onClick={() => nextStep && nextStep()}
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;