import { Dialog, Transition } from "@headlessui/react";
import React, { FC, FormEventHandler, Fragment, useCallback, useRef, useState } from "react";
import StepWizard from "react-step-wizard";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Review from "./Review";
import { useOrganizationList } from "@clerk/nextjs";
import ReactCanvasConfetti from "react-canvas-confetti";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};

type Props = {
  isOpen: boolean
}

const CreateOrganization: FC<Props> = ({ isOpen }) => {

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    refAnimationInstance.current &&
    // @ts-ignore
    refAnimationInstance.current({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio)
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 60
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [makeShot]);


  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");

  const handleSubmit = () => {
    if (organizationName !== "" && createOrganization) {
      setOrganizationName("");
      console.log("here");
      try {
        createOrganization({ name: organizationName });
        fire();
      } catch (e) {
        console.error(e);
      }
    }
  };


  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => undefined}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <StepWizard>
                    <Step1 />
                    <Step2 setOrganizationName={setOrganizationName} />
                    <Review organizationName={organizationName} handleSubmit={handleSubmit} />
                  </StepWizard>
                </Dialog.Panel>

              </Transition.Child>
            </div>
          </div>
          {/*// @ts-ignore*/}
          <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        </Dialog>
      </Transition>
    </>
  );
};


export default CreateOrganization;