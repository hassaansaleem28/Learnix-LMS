"use client";
import Heading from "../../utils/Heading";
import React from "react";
import AdminSidebar from "../../components/Admin/Sidebar/AdminSidebar";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import UserAnalytics from "@/app/components/Admin/Analytics/UserAnalytics";
import OrdersAnalytics from "@/app/components/Admin/Analytics/OrdersAnalytics";

function page() {
  return (
    <div>
      <Heading
        title={`Admin Dashboard - Learnix`}
        description="Online Courses - Learn Anything, On Your Schedule"
        keywords="IT, Psychology, Leadership, etc."
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <OrdersAnalytics />
        </div>
      </div>
    </div>
  );
}

export default page;
