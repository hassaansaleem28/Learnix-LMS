import { styles } from "@/app/styles/style";
import CoursePlayer from "../../../../app/utils/CoursePlayer";
import React, { FC } from "react";
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isLoading: boolean;
  isEdit?: boolean;
  isEditing?: boolean;
};

const CoursePreview: FC<Props> = ({
  active,
  setActive,
  courseData,
  isLoading,
  handleCourseCreate,
  isEdit,
  isEditing,
}) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData.estimatedPrice) *
    100;
  const discountPercentagePrice = discountPercentage.toFixed(0);

  function prevButton() {
    setActive(active - 1);
  }
  function createCourse() {
    handleCourseCreate();
  }

  return (
    <div className="w-[90%] m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px]">
            {courseData?.price === 0 ? "Free" : courseData?.price + "$"}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">
            {courseData?.estimatedPrice} $
          </h5>
          <h4 className="pl-5 pt-4 text-[22px]">
            {discountPercentagePrice}% Off
          </h4>
        </div>
        <div className="flex items-center">
          <button
            className={`bg-red-500 px-6 my-4 py-2 rounded-xl font-[500] text-[1.5rem]`}
          >
            Buy Now {courseData?.price}$
          </button>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Discount Code..."
            className={`${styles.input} !w-[60%] ml-3 !mt-0`}
            name=""
            id=""
          />
          <div
            className={`${styles.button} 150px:!w-[50%] 1100px:w-[60%] my-3 ml-4 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>
        <p className="pb-1 text-[18px]">* Source code included</p>
        <p className="pb-1 text-[18px]">* Full lifetime access</p>
        <p className="pb-1 text-[18px]">* Certification of Completion</p>
        <p className="pb-3 800px:pb-1 text-[18px]">* Premium Support</p>
      </div>
      <div className="w-full">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] my-3 font-Poppins font-[600]">
            {courseData?.name}
          </h1>
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5 className="">0 reviews</h5>
            </div>
            <h5>0 students</h5>
          </div>
          <br />
          <h1 className="text-[25px] font-Poppins font-[600]">
            What you&apos;ll learn from this course?
          </h1>
        </div>
        {courseData?.benefits?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="text-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item?.title}</p>
          </div>
        ))}
        <br />
        <br />
        <h1 className="text-[25px] font-Poppins font-[600]">
          What are the prerequisites to start this course?
        </h1>
        {courseData?.prerequisites?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="text-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item?.title}</p>
          </div>
        ))}
        <br />
        <br />
        {/* Course Description */}
        <div className="w-full">
          <h1 className="text-[25px] font-Poppins font-[600s]">
            Course Details
          </h1>
          <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden">
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Previous
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => createCourse()}
        >
          {isEdit
            ? isEditing
              ? "Updating..."
              : "Update"
            : isLoading
            ? "Creating..."
            : "Create"}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
