import { Dialog } from "@headlessui/react";
import React, { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";


const Step2: FC<Partial<StepWizardChildProps> & { setOrganizationName: (x: string) => void }> = (props) => {
  const { setOrganizationName, nextStep, previousStep } = props;

  const handleName = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setOrganizationName(value);
  };


  return (
    <div>
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        {"What's the name of your real estate company?"}
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          {"It's okay if you do not have a company! You can use any name you like here. Be creative"}
        </p>
      </div>

      <div className="mt-4">
        <input
          type="text"
          className="outline-none shadow-md focus:border-black focus:border-4 block w-full sm:text-sm border-black border-1 rounded-sm h-8 px-2"
          placeholder="Enter Company name"
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