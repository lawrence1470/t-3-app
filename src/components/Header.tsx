import Image from "next/image";
import Link from "next/link";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

// Header component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Header = () => (
    <header>
        <div>
            <Link href="/">
                <a>
                    <Image src="/logo.svg" width="32" height="32" alt="Logo"/>
                </a>
            </Link>
        </div>
        <div>
            <SignedOut>
                <Link href="/sign-in">Sign in</Link>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>
    </header>
);

export default Header;