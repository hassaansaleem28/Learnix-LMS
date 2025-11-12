"use client";
import { useGetAllCoursesQuery } from "@/redux-toolkit/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux-toolkit/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer/Footer";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(
    function () {
      if (category === "All") {
        setCourses(data?.allCourses);
      }
      if (category !== "All") {
        setCourses(
          data?.allCourses?.filter((item: any) => item.categories === category)
        );
      }
      if (search) {
        setCourses(
          data?.allCourses.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    },
    [data, category, search]
  );
  const categories = categoriesData?.layout.categories;

  return (
    <div className="min-h-screen">
      {" "}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title="All Courses - Learnix"
              description="LEARNIX IS A YOUR SHELTER FOR LEARNING!"
              keywords="MERN, MEAN, MEVN, AI/ML, GEN AI"
            />
            <br />
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-[Poppins] cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div
                        className={`h-[35px] ${
                          category === item.title
                            ? "bg-[crimson]"
                            : "bg-[#5050cb]"
                        } m-3 px-3 rounded-[30px] flex items-center justify-center font-[Poppins] cursor-pointer`}
                        onClick={() => setCategory(item.title)}
                      >
                        {item.title}
                      </div>
                    </div>
                  );
                })}
            </div>
            {courses && courses.length === 0 && (
              <p
                className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
              >
                {search
                  ? "No Courses Found!"
                  : "No Courses Found in this Category. Try Another One!"}
              </p>
            )}
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((course: any, index: number) => (
                  <CourseCard course={course} key={index} />
                ))}
            </div>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
