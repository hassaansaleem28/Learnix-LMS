"use client";

import React, { FC, useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useLogoutQuery } from "../../../redux-toolkit/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import EnrolledCourses from "./EnrolledCourses";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [logOut, setLogOut] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logOut ? true : false,
  });

  async function logoutHandler() {
    setLogOut(true);
    await signOut();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] bg-white dark:bg-slate-900 bg-opacity-90 border dark:border-[#ffffff1d] border:[#0a090915] rounded-[5px] dark:shadow-sm shadow-md mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <ProfileSidebar
          user={user}
          avatar={avatar}
          active={active}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}
      {active === 3 && <EnrolledCourses user={user} />}
    </div>
  );
};

export default Profile;
