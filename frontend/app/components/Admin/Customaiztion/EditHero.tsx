import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux-toolkit/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {};

const EditHero: FC<Props> = ({}) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });
  useEffect(
    function () {
      if (data) {
        setTitle(data?.layout?.banner.title);
        setSubTitle(data?.layout?.banner.subTitle);
        setImage(data?.layout?.banner?.image?.url);
      }
      if (isSuccess) {
        refetch();
        toast.success("Hero updated!");
      }
      if (error) {
        if ("data" in error) {
          const errorMsg = error as any;
          toast.error(errorMsg?.data?.message);
        }
      }
    },
    [data, isSuccess, error]
  );

  function handleUpdate(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  async function handleEdit() {
    await editLayout({ type: "Banner", image, title, subTitle });
  }
  return (
    <div className="min-h-screen flex items-center gap-[4rem] justify-center">
      <div className="flex justify-start items-center">
        <div className="relative w-96 h-96 lg:w-[500px] hero_animation lg:h-[500px] rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-[#4338ca] dark:via-[#6366f1] dark:to-[#3730a3]  flex items-center justify-center">
          <div className="relative">
            <img
              src={image || "/api/placeholder/300/300"}
              alt="hero-img"
              className="w-72 h-72 lg:w-96 lg:h-96 object-cover rounded-2xl"
            />
            <input
              type="file"
              name=""
              id="banner"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label
              htmlFor="banner"
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            >
              <AiOutlineCamera className="text-xl text-gray-700" />
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-6 max-w-2xl">
        <div>
          <textarea
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Improve Your Online Learning Experience Better Instantly"
            className="w-full text-3xl lg:text-4xl font-bold text-black dark:text-white bg-transparent border-none outline-none resize-none leading-tight"
            rows={5}
            style={{ lineHeight: "1.3" }}
          />
        </div>

        <div>
          <textarea
            value={subTitle}
            onChange={e => setSubTitle(e.target.value)}
            placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
            className="w-full text-md text-black dark:text-gray-300 bg-transparent border-none outline-none resize-none leading-relaxed"
            rows={3}
          />
        </div>

        <div className="pt-4">
          <button
            onClick={
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? handleEdit
                : () => null
            }
            className={`px-12 py-3 bg-gray-700 font-[600] text-white rounded-lg hover:shadow-lg active:translate-y-2 hover:scale-105 transition-all duration-300 ${
              data?.layout?.banner?.title !== title ||
              data?.layout?.banner?.subTitle !== subTitle ||
              data?.layout?.banner?.image?.url !== image
                ? "!cursor-pointer !bg-gradient-to-r !from-blue-500 !to-purple-600"
                : "!cursor-not-allowed"
            }`}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHero;

//  <div className="min-h-screen flex items-center justify-between pl-20 pr-20 p-8">
//    <div className="flex justify-start items-center">
//      {/* Main circular background */}
//      <div className="relative w-96 h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
//        {/* Main image */}
//        <div className="relative">
//          <img
//            src={image || "/api/placeholder/300/300"}
//            alt="hero-img"
//            className="w-72 h-72 lg:w-96 lg:h-96 object-cover rounded-2xl"
//          />

//          {/* Camera overlay */}
//          <input
//            type="file"
//            name=""
//            id="banner"
//            accept="image/*"
//            onChange={handleUpdate}
//            className="hidden"
//          />
//          <label
//            htmlFor="banner"
//            className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
//          >
//            <AiOutlineCamera className="text-xl text-gray-700" />
//          </label>
//        </div>
//      </div>
//    </div>

//    {/* Text editing section */}
//    <div className="flex flex-col space-y-6 max-w-2xl">
//      <div>
//        <textarea
//          value={title}
//          onChange={e => setTitle(e.target.value)}
//          placeholder="Improve Your Online Learning Experience Better Instantly"
//          className="w-full text-xl lg:text-4xl font-bold text-black dark:text-white bg-transparent border-none outline-none resize-none leading-tight"
//          rows={5}
//          style={{ lineHeight: "1.3" }}
//        />
//      </div>

//      <div>
//        <textarea
//          value={subTitle}
//          onChange={e => setSubTitle(e.target.value)}
//          placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
//          className="w-full text-md text-black dark:text-gray-300 bg-transparent border-none outline-none resize-none leading-relaxed"
//          rows={3}
//        />
//      </div>

//      {/* Update Button */}
//      <div className="pt-4">
//        <button
//          onClick={
//            data?.layout?.banner?.title !== title ||
//            data?.layout?.banner?.subTitle !== subTitle ||
//            data?.layout?.banner?.image?.url !== image
//              ? handleSubmit
//              : () => null
//          }
//          className={`px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 ${
//            data?.layout?.banner?.title !== title ||
//            data?.layout?.banner?.subTitle !== subTitle ||
//            data?.layout?.banner?.image?.url !== image
//              ? "!cursor-pointer !bg-gradient-to-r !from-blue-500 !to-purple-600"
//              : "!cursor-not-allowed"
//          }`}
//        >
//          Update
//        </button>
//      </div>
//    </div>
//  </div>;
