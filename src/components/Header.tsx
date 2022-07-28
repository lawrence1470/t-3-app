import Image from "next/image";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  MenuAlt2Icon

} from "@heroicons/react/outline";
import React, { FC } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { capitalize, first } from "lodash-es";


const OrganizationItem = () => {
  const { organizationList, isLoaded } = useOrganizationList();


  const orgOfAdmin = first(organizationList);

  if (typeof orgOfAdmin === "undefined") {
    return <h1>No organization found for this user</h1>;
  }


  return (
    <div className="flex items-center px-4 m-4 rounded-full bg-white">
      {isLoaded ? <h1 className="text-black font-semibold">{capitalize(orgOfAdmin.organization.name)}</h1> : <h1>loading...</h1>}
    </div>
  );
};


const Header: FC = () => {
  const { user } = useUser();
  return (
    <header className="w-full px-10 mt-5">
      <div
        className="rounded-xl relative flex-shrink-0 h-16 shadow-lg flex bg-polarBlack bg-hero-pattern">
        <OrganizationItem />
        <div className="flex-1 flex justify-end px-4 sm:px-6">
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
            <Menu as="div" className="relative flex-shrink-0">
              <div>
                <Menu.Button
                  className="bg-white cursor-pointer rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <span className="mr-2 p-1">{user ? <h1>Hello, {user.firstName}!</h1> : null}</span>
                  <UserButton />
                </Menu.Button>
              </div>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;