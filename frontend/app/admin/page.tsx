"use client";
import React, { FC } from "react";
import Heading from "../utils/Heading";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";

type Props = {};

const page: FC<Props> = ({}) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title={`Admin Dashboard - Learnix`}
          description="Online Courses - Learn Anything, On Your Schedule"
          keywords="IT, Psychology, Leadership, etc."
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
