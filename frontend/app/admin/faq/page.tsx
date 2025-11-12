"use client";

import Editfaq from "@/app/components/Admin/Customaiztion/Editfaq";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import AdminSidebar from "@/app/components/Admin/Sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React, { FC } from "react";

type Props = {};

const page: FC<Props> = ({ params }: any) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Admin Dashboard - Learnix"
          description="Learnix is a platform for student to learn and get help from teachers!"
          keywords="Programming, MERN, MachineLearing"
        />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <Editfaq />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
