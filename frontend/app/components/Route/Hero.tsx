"use client";

import { useGetHeroDataQuery } from "@/redux-toolkit/features/layout/layoutApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type Props = {};

const Hero: FC<Props> = () => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch() {
    if (search === "") return;
    else router.push(`/courses?title=${search}`);
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-[95%] 800px:w-[92%] mx-auto relative z-10">
            <div className="flex flex-col-reverse 1000px:flex-row items-center justify-between min-h-screen py-8 1000px:py-0">
              <div className="w-full 1000px:w-[60%] flex flex-col items-center 1000px:items-start justify-center text-center 1000px:text-left 1000px:mt-0">
                <h2 className="text-gray-900 dark:text-white text-[28px] 400px:text-[32px] 800px:text-[40px] 1000px:text-[50px] 1200px:text-[60px] 1300px:text-[70px] font-bold font-Josefin leading-tight px-3 w-full 1000px:px-0 1100px:w-[85%] 1200px:w-[80%] 1300px:w-[75%]">
                  {data?.layout?.banner?.title}
                </h2>
                <br className="hidden 800px:block" />
                <p className="text-gray-600 dark:text-gray-300 font-Josefin font-normal text-[16px] 800px:text-[18px] leading-relaxed px-3 1000px:px-0 w-full 1000px:w-[85%] 1200px:w-[75%] mt-4 1000px:mt-0">
                  {data?.layout?.banner?.subTitle}
                </p>
                <br className="hidden 800px:block" />
                <br className="hidden 800px:block" />
                <div className="w-[90%] 800px:w-[85%] 1000px:w-[80%] 1200px:w-[75%] 1300px:w-[70%] h-[50px] bg-transparent relative mt-6 1000px:mt-0">
                  <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search Courses..."
                    className="bg-white/90 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-[5px] p-3 pr-[60px] w-full h-full outline-none text-gray-900 dark:text-white text-[16px] 800px:text-[18px] 1000px:text-[20px] font-Josefin placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-lg"
                  />
                  <div
                    className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 rounded-r-[5px] transition-all duration-300"
                    onClick={handleSearch}
                  >
                    <BiSearch className="text-white" size={24} />
                  </div>
                </div>

                <br className="hidden 800px:block" />
                <br className="hidden 800px:block" />

                <div className="w-[90%] 800px:w-[85%] 1000px:w-[80%] 1200px:w-[75%] flex flex-col 400px:flex-row items-center justify-center 1000px:justify-start mt-6 1000px:mt-0">
                  <div className="flex items-center mr-3">
                    <Image
                      src={require("../../../public/assets/client-1.jpg")}
                      alt=""
                      className="rounded-full"
                    />
                    <Image
                      src={require("../../../public/assets/client-2.jpg")}
                      alt=""
                      className="rounded-full ml-[-20px]"
                    />
                    <Image
                      src={require("../../../public/assets/client-3.jpg")}
                      alt=""
                      className="rounded-full ml-[-20px]"
                    />
                  </div>
                  <p className="font-Josefin text-gray-600 dark:text-gray-300 400px:pl-3 1000px:pl-4 text-[14px] 800px:text-[16px] 1000px:text-[18px] font-normal text-center 400px:text-left">
                    500K+ People already trusted us!{" "}
                    <Link
                      href="/courses"
                      className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300 font-semibold ml-2"
                    >
                      View Courses
                    </Link>
                  </p>
                </div>
              </div>
              <div className="w-full 1000px:w-[40%] flex items-center justify-center 1000px:justify-end relative">
                <div className="relative hero_animation w-[280px] h-[280px] 400px:w-[320px] 400px:h-[320px] 800px:w-[400px] 800px:h-[400px] 1100px:w-[450px] 1100px:h-[450px] 1200px:w-[500px] 1200px:h-[500px] 1300px:w-[550px] 1300px:h-[550px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-[#4338ca] dark:via-[#6366f1] dark:to-[#3730a3] rounded-full shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Image
                      src={data?.layout?.banner?.image?.url}
                      width={400}
                      height={400}
                      alt="Learning illustration"
                      className="object-contain w-[85%] h-[85%] relative z-20"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
