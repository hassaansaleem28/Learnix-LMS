import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { format } from "timeago.js";
import { Elements } from "@stripe/react-stripe-js";
import CourseContentList from "./CourseContentList";
import CheckoutForm from "../Payment/CheckoutForm";
import { useLoadUserQuery } from "@/redux-toolkit/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  data: any;
  clientSecret: string;
  stripePromise: any;
  setOpen: (open: boolean) => void;
  setRoute: (route: any) => void;
};

const CourseDetails: FC<Props> = ({
  data,
  clientSecret,
  stripePromise,
  setRoute,
  setOpen: openAuthModal,
}) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const discountPercentage =
    ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercentage.toFixed(2);
  const isPurchased =
    user && user?.courses?.find((item: any) => item._id === data._id);
  const [open, setOpen] = useState(false);
  useEffect(
    function () {
      setUser(userData?.user);
    },
    [userData]
  );

  function handleOrder(e: any) {
    if (user) setOpen(true);
    else {
      setRoute("Login");
      openAuthModal(true);
    }
  }

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5 mb-12">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-600 text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white mb-2">
              What you will learn from this course ?
            </h1>
            <div className="">
              {data.benefits?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="w-full flex 800px:items-center py-2"
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white mb-2">
              What are the prerequisites for this course?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            {/* Course Description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center flex flex-col gap-4">
                <Ratings rating={data.ratings} />
                <div className="mb-2 800px:mb-[unset]">
                  <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                    {Number.isInteger(data?.ratings)
                      ? data?.ratings.toFixed(1)
                      : data?.ratings.toFixed(2)}{" "}
                    Course Ratings - {data?.reviews?.length} Reviews
                  </h5>
                </div>
                <br />
                {data?.reviews &&
                  [...data.reviews]
                    .reverse()
                    .map((item: any, index: number) => (
                      <div key={index} className="w-full pb-4">
                        <div className="flex">
                          <div className="w-[50px] h-[50px]">
                            <Image
                              src={
                                item?.user?.avatar
                                  ? item?.user?.avatar?.url
                                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                              }
                              width={50}
                              height={50}
                              alt="image"
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="hidden 800px:block pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                {item.user.name}
                              </h5>
                              <Ratings rating={item.rating} />
                            </div>
                            <p className="text-black dark:text-white">
                              {item.comment}
                            </p>
                            <small className="text-[#000000d1] dark:text-[#ffffff83]">
                              {format(item.createdAt)}
                            </small>
                          </div>
                          <div className="pl-2 flex 800px:hidden items-center">
                            <h5 className="text-[18px] pr-2 text-black dark:text-white">
                              {item.user.name}
                            </h5>
                            <Ratings rating={item.rating} />
                          </div>
                        </div>
                        {item.commentReplies.map((i: any, index: number) => (
                          <div
                            className="w-full flex 800px:ml-16 my-5"
                            key={index}
                          >
                            <div className="w-[50px] h-[50px]">
                              <Image
                                src={
                                  i.avatar
                                    ? i.avatar.url
                                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                                }
                                width={50}
                                height={50}
                                alt=""
                                className="w-[50px] h-[50px] rounded-full object-cover"
                              />
                            </div>
                            <div className="pl-2">
                              <div className="flex items-center">
                                <h5 className="text-[20px]">{i.user.name}</h5>
                                <VscVerifiedFilled className="text-[#04e129] ml-2 text-[20px]" />
                              </div>
                              <p>{i.reply}</p>
                              <small className="text-[#ffffff83]">
                                {format(i.createdAt)}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "FREE" : "$" + data.price}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  ${data.estimatedPrice}
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentagePrice}% OFF
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Go to Course
                  </Link>
                ) : (
                  <div
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    onClick={handleOrder}
                  >
                    Buy Now ${data.price}
                  </div>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                * Source Code Included
              </p>
              <p className="pb-1 text-black dark:text-white">
                * Life Time Access
              </p>
              <p className="pb-1 text-black dark:text-white">
                * Certificate of Completion
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                * 30 Days Money Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full p-10">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm setOpen={setOpen} data={data} user={user} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;
