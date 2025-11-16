"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "./NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assets/avatar.jpg";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "../../redux-toolkit/features/auth/authApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/redux-toolkit/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, setRoute, open }) => {
  const [isSticky, setIsSticky] = useState(false);
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logOut, setLogOut] = useState(false);
  const {} = useLogoutQuery(undefined, { skip: !logOut });

  useEffect(() => {
    if (!isLoading) {
      if (!userData && data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
        refetch();
      }
    }
    if (data === null && isSuccess) toast.success("Login Successful!");
    if (data === null && !isLoading && !userData) setLogOut(true);
  }, [data, userData, isLoading]);

  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function handleClose(e: any) {
    if (e.target.id === "screen") setOpenSidebar(false);
  }

  return (
    <div
      className={`
        w-[94%] m-auto flex justify-center items-center 
        rounded-xl p-[2px] transition-all duration-300
        bg-gradient-to-r
        from-[#60a5fa] via-[#a78bfa] to-[#7c3aed]
        dark:from-[#8c52f7] dark:via-[#56e7fa] dark:to-[#3b88fa]
        ${
          isSticky
            ? "fixed top-4 left-1/2 -translate-x-1/2 z-[9999] shadow-lg"
            : "mt-6"
        }
      `}
    >
      <div
        className="
          w-full rounded-xl 
          bg-white dark:bg-[#0b0f1e]
          transition-all duration-300
        "
      >
        <div className="w-[95%] 800px:w-[92%] m-auto h-[80px] flex items-center justify-between p-3">
          <Link
            href={"/"}
            className="text-[30px] font-Poppins font-[500] text-black dark:text-white"
          >
            Learnix
          </Link>

          <NavItems activeItem={activeItem} isMobile={false} />

          <div className="flex items-center gap-4">
            <ThemeSwitcher />

            {/* Mobile Menu Icon */}
            <div className="800px:hidden">
              <HiOutlineMenuAlt3
                size={25}
                className="cursor-pointer dark:text-white text-black"
                onClick={() => setOpenSidebar(true)}
              />
            </div>

            {userData ? (
              <Link href={"/profile"}>
                <Image
                  src={
                    userData?.user.avatar ? userData?.user.avatar.url : avatar
                  }
                  alt="Image"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-full cursor-pointer"
                />
              </Link>
            ) : (
              <HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] bg-[#00000024] dark:bg-[unset]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0 z-[9999999999]">
              <NavItems activeItem={activeItem} isMobile={true} />

              {userData ? (
                <Link href={"/profile"}>
                  <Image
                    src={
                      userData?.user.avatar ? userData?.user.avatar.url : avatar
                    }
                    alt="Image pfp"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] ml-5 rounded-full cursor-pointer"
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="ml-6 mt-4 cursor-pointer dark:text-white text-black"
                  onClick={() => {
                    setOpen(true);
                    setOpenSidebar(false);
                  }}
                />
              )}

              <p className="text-[16px] px-5 mt-6 text-black dark:text-white">
                Copyright &copy; {new Date().getFullYear()} Learnix.
              </p>
            </div>
          </div>
        )}

        {/* MODALS */}
        {route === "Login" && open && (
          <CustomModal
            open={open}
            setOpen={setOpen}
            setRoute={setRoute}
            activeItem={activeItem}
            component={Login}
            refetch={refetch}
          />
        )}

        {route === "Sign-Up" && open && (
          <CustomModal
            open={open}
            setOpen={setOpen}
            setRoute={setRoute}
            activeItem={activeItem}
            component={SignUp}
          />
        )}

        {route === "Verification" && open && (
          <CustomModal
            open={open}
            setOpen={setOpen}
            setRoute={setRoute}
            activeItem={activeItem}
            component={Verification}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
