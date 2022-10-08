import {FC} from 'react';

type Props = {
  children: JSX.Element;
  title: string;
};

const TitleContentLayout: FC<Props> = ({children, title}) => {
  return (
    <div>
      <div className="flex-1">
        <div className="">
          <div className="pt-10 pb-16">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
            </div>
            <div className="">
              <div className="py-6 h-full">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleContentLayout;
