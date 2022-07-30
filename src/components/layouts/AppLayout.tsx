import Header from "../Header";
import { FC, ReactNode, useState } from "react";
import NarrowSideBar from "../NarrowSidebar/NarrowSidebar";

type Props = {
  children: ReactNode
}

const AppLayout: FC<Props> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <>
      <div className="h-full flex">
        <NarrowSideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main>
            <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0 relative">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;