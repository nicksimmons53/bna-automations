"use client";

import { Inter, Raleway } from "next/font/google";
import "./globals.css";
import {Drawer, DrawerContent, HeroUIProvider} from "@heroui/react";
import {finishAuth} from "@/app/auth/route";
import {redirect, usePathname} from "next/navigation";
import {useRouter} from "next/router";
import {DrawerHeader} from "@heroui/drawer";

const inter = Inter({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const path = usePathname();
  const signOut = async() => {
    finishAuth();
  }

  console.log(path);

  return (
    <html lang="en">
      <body className={raleway.className}>
        <HeroUIProvider>
          {/*{!path.includes("/login") && (*/}
          {/*  <Navbar isBordered>*/}
          {/*    <NavbarContent justify={"start"}>*/}
          {/*      <NavbarItem>*/}
          {/*        <h1>BNA Automations</h1>*/}
          {/*      </NavbarItem>*/}
          {/*    </NavbarContent>*/}
          {/*    <NavbarContent justify={"end"}>*/}
          {/*      <NavbarItem>*/}
          {/*        <Button onClick={signOut} color={"danger"}>Sign Out</Button>*/}
          {/*      </NavbarItem>*/}
          {/*    </NavbarContent>*/}
          {/*  </Navbar>*/}
          {/*)}*/}
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
