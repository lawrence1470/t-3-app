import {FC} from 'react';
import classNames from 'classnames';
import Loader from '@/common/Loader';

type Props = {
  children: JSX.Element;
  title: string;
  isLoading?: boolean;
};

const TitleContentLayout: FC<Props> = ({children, title, isLoading = false}) => {
  return (
    <div className="">
      <div className="flex-1">
        <div className="">
          <div className="pt-10 pb-16">
            <div >
              <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
            </div>
            <div className="">
              <Loader isLoading={isLoading}>
                <div className="py-6 h-full">{children}</div>
              </Loader>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleContentLayout;
