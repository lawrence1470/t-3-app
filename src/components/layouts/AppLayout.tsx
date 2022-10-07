import Header from '../Header';
import {FC, ReactNode, useState} from 'react';
import NarrowSideBar from '../NarrowSidebar/NarrowSidebar';

type Props = {
  children: ReactNode;
};

const AppLayout: FC<Props> = ({children}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="h-full flex">
        <NarrowSideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="overflow-y-scroll">
            <div className="max-w-4xl mx-auto flex flex-col px-10 relative">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
