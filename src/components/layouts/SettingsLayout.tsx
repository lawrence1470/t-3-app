import { CreditCardIcon, OfficeBuildingIcon, UserIcon, UsersIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { FC } from "react";
import { useRouter } from "next/router";
import { last } from "lodash-es";
import Link from "next/link";
import { SETTINGS_TABS } from "../../constants";
import TitleContentLayout from "./TitleContentLayout";


type Props = {
  children: JSX.Element
}


const SettingsLayout: FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathNameArray = router.pathname.split("/");
  const currentTab = last(pathNameArray);

  return (
    <TitleContentLayout title="Settings">
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            // defaultValue={tabs.find((tab) => tab.current).name}
          >
            {SETTINGS_TABS.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {SETTINGS_TABS.map((tab) => (
                <Link
                  passHref
                  key={tab.name}
                  href={tab.link}
                >
                  <a className={classNames(
                    currentTab === tab.link
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm"
                  )}>
                    <tab.icon
                      className={classNames(
                        currentTab === tab.link ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500",
                        "-ml-0.5 mr-2 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-10 divide-y divide-gray-200">
            {children}
          </div>
        </div>
      </div>
    </TitleContentLayout>
  );
};

export default SettingsLayout;
