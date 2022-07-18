import {Dialog} from "@headlessui/react";
import {FC} from "react";
import {StepWizardChildProps} from "react-step-wizard";


const Step1: FC<Partial<StepWizardChildProps>> = ({nextStep}) => {


    return (
        <div>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
            >
                Create your organization
            </Dialog.Title>
            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    An organization represents your real estate empire. You can create properties and invite users to
                    your organization.
                </p>
            </div>

            <div className="mt-4">
                <button
                    onClick={() => nextStep && nextStep()}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Lets get started!
                </button>
            </div>
        </div>
    )
}

export default Step1