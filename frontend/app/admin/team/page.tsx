"use client";
import Heading from "../../../app/utils/Heading";
import AdminProtected from "../../../app/hooks/adminProtected";
import React from "react";
import AdminSidebar from "../../../app/components/Admin/Sidebar/AdminSidebar";
import DashboardHero from "../../../app/components/Admin/DashboardHero";
import AllUsers from "../../../app/components/Admin/Users/AllUsers";

function page() {
  return (
    <div>
      <AdminProtected>
        <Heading
          title={`Admin Dashboard - Learnix`}
          description="Online Courses - Learn Anything, On Your Schedule"
          keywords="IT, Psychology, Leadership, etc."
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <AllUsers isTeam={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
}

export default page;
