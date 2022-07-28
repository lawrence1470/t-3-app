import { useRef, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import classNames from "classnames";
import SettingsLayout from "../../../components/layouts/SettingsLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "react-modal";
import { useMutation } from "react-query";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const Account: NextPage = () => {
  const router = useRouter();

  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true);


  const deleteMutation = useMutation(() => {
    console.log("here");
    return axios.delete("/api/deleteAccount");
  });

  return (
    <>
      <div className="absolute">
        {
          <Modal
            ariaHideApp={false}
            isOpen={Boolean(router.query.delete)}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h1 className="font-semibold">Are you sure you want to delete?</h1>
            <p>Please note that deleting an organization will also delete all memberships and invitations. This is not
              reversible.</p>
            <button onClick={() => router.push("/settings/account")} className="rounded bg-gray-200 p-2">Cancel</button>
            <button onClick={() => deleteMutation.mutate()} className="bg-red-200 rounded ml-2 p-2">Delete</button>
          </Modal>
        }
      </div>
      <SettingsLayout>
        <div>

          <div className="space-y-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account</h3>
            <p className="max-w-2xl text-sm text-gray-500">
              Manage how information is displayed on your account.
            </p>
          </div>
          <div className="mt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Language</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="flex-grow">English</span>
                  <span className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Update
                    </button>
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                <dt className="text-sm font-medium text-gray-500">Date format</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="flex-grow">DD-MM-YYYY</span>
                  <span className="ml-4 flex-shrink-0 flex items-start space-x-4">
                    <button
                      type="button"
                      className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Update
                    </button>
                    <span className="text-gray-300" aria-hidden="true">
                      |
                    </span>
                    <button
                      type="button"
                      className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Remove
                    </button>
                  </span>
                </dd>
              </div>
              <Switch.Group as="div" className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                <Switch.Label as="dt" className="text-sm font-medium text-gray-500" passive>
                  Automatic timezone
                </Switch.Label>
                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Switch
                    checked={automaticTimezoneEnabled}
                    onChange={setAutomaticTimezoneEnabled}
                    className={classNames(
                      automaticTimezoneEnabled ? "bg-purple-600" : "bg-gray-200",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-auto"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        automaticTimezoneEnabled ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
            </dl>
          </div>
          <Link href="?delete=true" passHref>
            <a className="bg-red-500 rounded p-2 text-white">Delete Account</a>
          </Link>
        </div>
      </SettingsLayout>
    </>
  );
};

export default Account;