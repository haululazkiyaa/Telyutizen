import React from "react";
import Navbar from "../Navbar";
import { useRouter } from "next/router";

type AppShellProps = {
  children: React.ReactNode;
};

const disableNavbar = ["/auth/register", "/auth/login", "/_error"];

export default function AppShell(props: AppShellProps) {
  const { children } = props;
  const { pathname } = useRouter();

  return (
    <>
      {!disableNavbar.includes(pathname) && <Navbar />}
      {children}
    </>
  );
}
