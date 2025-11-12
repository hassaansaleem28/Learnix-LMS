"use client";

import EditCourse from "@/app/components/Admin/Course/EditCourse";
import DashboardHeader from "../../../../app/components/Admin/DashboardHeader";
import AdminSidebar from "../../../../app/components/Admin/Sidebar/AdminSidebar";
import Heading from "../../../../app/utils/Heading";
import React, { FC } from "react";

type Props = {};

const page: FC<Props> = ({ params }: any) => {
  const { id } = params;

  return (
    <div>
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
          <EditCourse id={id} />
        </div>
      </div>
    </div>
  );
};

export default page;
