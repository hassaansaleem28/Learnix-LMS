import React, { FC } from "react";
import useUserAuth from "./useUserAuth";
import { redirect } from "next/navigation";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = useUserAuth();

  return isAuthenticated ? children : redirect("/");
}
