import { Dialog } from "@headlessui/react";
import React, { FC } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import {capitalize} from 'lodash-es'


const Review: FC<Partial<StepWizardChildProps> & { name: string }> = (props) => {
  const { name, nextStep, previousStep } = props;



  return (
    <div>
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        Review
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Does everything look right. Click Submit to create organization or go back to edit information.
        </p>
      </div>

      <div className="mt-4 flex">
            <h1>Organization name:</h1> <span className="font-semibold ml-2">{capitalize(name)}</span>
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
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Create Organization
        </button>
      </div>
    </div>
  );
};

export default Review;