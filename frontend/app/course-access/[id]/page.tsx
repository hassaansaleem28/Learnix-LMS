"use client";
import CourseContentt from "@/app/components/Course/CourseContentt";
import Loader from "@/app/components/Loader/Loader";
import Courses from "@/app/components/Route/Courses";
import { useLoadUserQuery } from "@/redux-toolkit/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  params: any;
};

const Page = ({ params }: Props) => {
  const id = params.id;
  const { data, isLoading, error } = useLoadUserQuery(undefined, {});

  useEffect(
    function () {
      if (data) {
        const isPurchased = data.user?.courses.find(
          (item: any) => item._id === id
        );
        if (!isPurchased) redirect("/");
        if (error) redirect("/");
      } else redirect("/");
    },
    [data, error]
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContentt id={id} userData={data.user} />
        </div>
      )}
    </>
  );
};

export default Page;
