import { useGetAllCoursesQuery } from "@/redux-toolkit/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";

type Props = {
  user: any;
};

const EnrolledCourses = ({ user }: Props) => {
  const { data, isLoading } = useGetAllCoursesQuery(undefined, {});
  const [courses, setCourses] = useState([]);

  useEffect(
    function () {
      if (data) {
        const filteredCourses = user?.courses
          ?.map((item: any, index: number) =>
            data.allCourses.find((course: any) => course._id === item._id)
          )
          .filter((course: any) => course !== undefined);
        setCourses(filteredCourses);
      }
    },
    [data]
  );

  return (
    <div className="w-full px-6 800px:px-10 800px:pl-8">
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] mt-[6rem] xl:grid-cols-3 xl:gap-[35px]">
        {courses &&
          courses.map((item: any, index: number) => (
            <CourseCard key={index} course={item} isProfile={true} />
          ))}
      </div>
      {courses.length === 0 && (
        <h1 className="text-center text-[18px] font-[Poppins]">
          {"You don't have any purchased Courses!"}
        </h1>
      )}
    </div>
  );
};

export default EnrolledCourses;
