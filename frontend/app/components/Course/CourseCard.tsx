import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  course: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ course, isProfile }) => {
  return (
    <Link
      href={
        !isProfile ? `/course/${course._id}` : `course-access/${course._id}`
      }
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-2 shadow-sm dark:shadow-inner">
        <Image
          src={course.thumbnail.url}
          alt="course image"
          width={500}
          height={300}
          className="rounded w-full"
          objectFit="contain"
        />
        <br />
        <h1 className="font-Poppins font-[600] mb-4 text-[16px] text-black dark:text-[#fff]">
          {course.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={course.ratings} />
          <h5
            className={`text-black dark:text-[#fff] ${
              isProfile && "hidden 800px:inline"
            }`}
          >
            {course.purchased} Students
          </h5>
        </div>
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-black dark:text-[#fff] font-[500] text-[1.3rem]">
              {course.price === 0 ? "FREE" : "$" + course.price}
            </h3>
            <h5 className="pl-3 text-[17px] mt-[-5px] line-through opacity-80 text-black dark:text-[#fff] font-[400]">
              ${course.estimatedPrice}
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <AiOutlineUnorderedList size={20} fill="#fff" />
            <h5 className="pl-2 text-black dark:text-[#fff]">
              {course.courseData.length} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
