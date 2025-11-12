"use client";

import AdminProtected from "@/app/hooks/adminProtected";
import AdminSidebar from "../../../app/components/Admin/Sidebar/AdminSidebar";
import Heading from "../../../app/utils/Heading";
import React, { FC } from "react";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import EditHero from "@/app/components/Admin/Customaiztion/EditHero";

type Props = {};

const page: FC<Props> = () => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Admin Dashboard - Learnix"
          description="Learnix is a platform for student to learn and get help from teachers!"
          keywords="Programming, MERN, MachineLearing"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
