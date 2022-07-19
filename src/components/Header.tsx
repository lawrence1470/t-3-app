import Image from "next/image";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  MenuAlt2Icon

} from "@heroicons/react/outline";
import { FC } from "react";


const OrganizationItem = () => {
  const { organizationList, isLoaded } = useOrganizationList();

  return (
    <div>
      <div>hi</div>
    </div>
  );
};


const Header: FC = () => {
  const { user } = useUser();

  return (
    <header className="w-full">
      <div
        className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
        <OrganizationItem />
        <div className="flex-1 flex justify-end px-4 sm:px-6">
          <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
            <Menu as="div" className="relative flex-shrink-0">
              <div>
                <Menu.Button
                  className="bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <span className="mr-2">{user ? <h1>Hello, {user.firstName}!</h1> : null}</span>
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