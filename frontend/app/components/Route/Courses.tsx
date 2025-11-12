import { useGetUserCoursesQuery } from "@/redux-toolkit/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
  const { data, isLoading } = useGetUserCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(
    function () {
      if (data) {
        setCourses(data.allCourses);
      }
    },
    [data]
  );
  return (
    <div>
      <div className={`w-[90%] 800px:w-[80%] mx-auto my-20`}>
        <h1 className="text-center font-Poppins text-[35px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Expand Your Career{" "}
          <span className="text-gradient">Opportunities</span> With Us! <br />
          Opportunities Awaits You
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {courses &&
            courses.map((course, index) => (
              <CourseCard key={index} course={course} isProfile={false} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
