import React, { act, FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux-toolkit/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const { data, isLoading, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [editCourse, { isLoading: isEditing, error, isSuccess: editSuccess }] =
    useEditCourseMutation();
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [{ title: "", url: "" }],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});
  const editCourseData =
    data && data.allCourses.find((data: any) => data._id === id);

  async function handleSubmit() {
    const formattedBenefits = benefits.map(benefit => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map(prerequisite => ({
      title: prerequisite.title,
    }));

    const formatCourseContentData = courseContentData.map(courseContent => ({
      videoUrl: courseContent.videoUrl,
      title: courseContent.title,
      description: courseContent.description,
      videoSection: courseContent.videoSection,
      links: courseContent.links.map(link => ({
        title: link.title,
        url: link.url,
      })),
      suggestion: courseContent.suggestion,
    }));

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formatCourseContentData,
    };
    setCourseData(data);
  }

  async function handleCourseEdit(e: any) {
    const data = courseData;
    await editCourse({ id: editCourseData?._id, data });
  }

  useEffect(
    function () {
      if (editSuccess) {
        toast.success("Course Updated Successfully!");
        redirect("/admin/courses");
      }
      if (error) {
        if ("data" in error) {
          const errorMsg = error as any;
          toast.error(errorMsg.data.message);
        }
      }
    },
    [editSuccess, error]
  );

  useEffect(
    function () {
      if (editCourseData) {
        setCourseInfo({
          name: editCourseData.name,
          description: editCourseData.description,
          price: editCourseData.price,
          estimatedPrice: editCourseData.estimatedPrice,
          tags: editCourseData.tags,
          level: editCourseData.level,
          demoUrl: editCourseData.demoUrl,
          thumbnail: editCourseData?.thumbnail?.url,
        });
        setBenefits(editCourseData.benefits);
        setPrerequisites(editCourseData.prerequisites);
        setCourseContentData(editCourseData.courseData);
      }
    },
    [editCourseData]
  );

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseEdit}
            isLoading={isLoading}
            isEditing={isEditing}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
