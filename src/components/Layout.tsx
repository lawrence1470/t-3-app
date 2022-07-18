import Header from './Header'
import {FC, ReactNode, useState} from "react";
import NarrowSideBar from "./NarrowSidebar/NarrowSidebar";

type Props = {
    children: ReactNode
}

const Layout: FC<Props> = ({children}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


    return (
        <>
            <div className="h-full flex">
                <NarrowSideBar/>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header/>
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}

export default Layout