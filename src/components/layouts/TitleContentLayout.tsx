import { FC } from "react";
import classNames from "classnames";

type Props = {
  children: JSX.Element
  title: string
  isLoading?: boolean
}


const TitleContentLayout: FC<Props> = ({ children, title, isLoading }) => {

  return (
    <div className={classNames({ "opacity-40": isLoading })}>
      <div className="flex-1">
        <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
          <div className="pt-10 pb-16">
            <div className="px-4 sm:px-6 md:px-0">
              <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
            </div>
            <div className="px-4 sm:px-6 md:px-0">
              <div className="py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleContentLayout;
