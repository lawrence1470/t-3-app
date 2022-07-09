import Header from './Header'
import {FC, ReactNode} from "react";

type Props = {
    children: ReactNode
}

const Layout: FC<Props> = ({children}) => (
    <>
        <Header/>
        <main>{children}</main>
    </>
)

export default Layout