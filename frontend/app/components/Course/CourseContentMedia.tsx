import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import {
  useAddNewQuestionMutation,
  useAddReplyToQuestionMutation,
  useAddReplyToReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux-toolkit/features/courses/coursesApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import { io } from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = io(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  userData: any;
  refetch: any;
  setActiveVideo: (activeVideo: number) => void;
};

const CourseContentMedia = ({
  data,
  id,
  refetch,
  activeVideo,
  userData,
  setActiveVideo,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reply, setReply] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const [addNewQuestion, { isSuccess, error, isLoading }] =
    useAddNewQuestionMutation();
  const [
    addReplyToQuestion,
    { isSuccess: isReplySuccess, error: replyError, isLoading: isAddingReply },
  ] = useAddReplyToQuestionMutation();
  const [
    addReviewInCourse,
    { isSuccess: reviewSuccess, error: reviewError, isLoading: addingReview },
  ] = useAddReviewInCourseMutation();
  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true }
  );
  const [
    addReplyToReview,
    {
      isLoading: replying,
      error: reviewReplyError,
      isSuccess: reviewReplySuccess,
    },
  ] = useAddReplyToReviewMutation();

  const course = courseData?.course;

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === userData._id
  );

  // ---------- Handlers ----------
  function handleQuestion() {
    if (!question.trim()) return toast.error("Question can't be empty!");
    addNewQuestion({
      question,
      courseId: id,
      contentId: data[activeVideo]._id,
    });
  }

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();

      toast.success("Question added Successfully!");
      socketId.emit("notification", {
        title: `New Question Received!`,
        message: `You have a new question in ${data[activeVideo]?.title}`,
        userId: userData._id,
      });
    }
    if (isReplySuccess) {
      setReply("");
      refetch();
      toast.success("Reply added Successfully!");
      if (userData.role !== "admin") {
        socketId.emit("notification", {
          title: `New Reply Received!`,
          message: `You have a new question reply in question ${data[activeVideo].title}`,
          userId: userData._id,
        });
      }
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      socketId.emit("notification", {
        title: `New Review!`,
        message: `You have a new review in ${data[activeVideo].title} in ${course.name}`,
        userId: userData._id,
      });
      toast.success("Thanks for your feedback. Review Added!");
    }
    if (reviewReplySuccess) {
      setReply("");
      setActiveReplyId(null);
      courseRefetch();
      toast.success("Replied to the Review successful!");
    }

    // handle errors
    const handleError = (err: any) => {
      if (err && "data" in err) toast.error(err.data.message);
    };

    handleError(error);
    handleError(replyError);
    handleError(reviewReplyError);
    handleError(reviewError);
  }, [
    isSuccess,
    error,
    isReplySuccess,
    replyError,
    reviewReplyError,
    reviewReplySuccess,
    reviewError,
    reviewSuccess,
  ]);

  function handleAnswerSubmit() {
    if (!reply.trim()) return toast.error("Reply to Question can't be empty!");
    addReplyToQuestion({
      reply,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId,
    });
  }

  async function handleReviewSubmit() {
    if (!review.trim()) return toast.error("Review can't be empty!");
    addReviewInCourse({ id, review, rating });
  }

  function handleReplySubmit(reviewId: string) {
    if (replying) return;
    if (!reply.trim()) return toast.error("Reply to Review can't be empty!");
    addReplyToReview({ reply, courseId: id, reviewId });
  }

  // ---------- JSX ----------
  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />

      {/* Video Navigation */}
      <div className="w-full flex items-center justify-between my-6">
        <div
          className={`${
            styles.button
          } text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" /> Prev Lesson
        </div>
        <div
          className={`${
            styles.button
          } text-white !w-[unset] !min-h-[40px] !py-[unset] ${
            data &&
            data.length - 1 === activeVideo &&
            "!cursor-no-drop opacity-[0.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Next Lesson <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>

      {/* Tabs */}
      <h1 className="pt-2 dark:text-white text-black text-[25px] font-[600]">
        {data[activeVideo].title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-inner rounded">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px] cursor-pointer ${
              activeBar === index
                ? "text-red-500"
                : "dark:text-white text-black"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />

      {/* Overview */}
      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>
      )}

      {/* Resources */}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Q&A Section */}
      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={
                userData.avatar
                  ? userData.avatar?.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt="image"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              cols={40}
              rows={5}
              placeholder="Ask a Question"
              className="outline-none bg-transparent ml-3 border border-[#000000c2] dark:border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] dark:text-white text-[black] font-[Poppins]"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <button
              className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5`}
              onClick={isLoading ? () => {} : handleQuestion}
              disabled={isLoading}
            >
              {isLoading ? "Wait..." : "Submit"}
            </button>
          </div>
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <QuestionReply
            data={data}
            activeVideo={activeVideo}
            answer={reply}
            setAnswer={setReply}
            handleAnswerSubmit={handleAnswerSubmit}
            user={userData}
            isAddingReply={isAddingReply}
            setQuestionId={setQuestionId}
          />
        </>
      )}

      {/* Reviews Section */}
      {activeBar === 3 && (
        <div className="w-full">
          {!isReviewExists && (
            <>
              <div className="w-full flex">
                <Image
                  src={
                    userData.avatar
                      ? userData.avatar?.url
                      : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                  }
                  width={50}
                  height={50}
                  alt="image"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                    Give a rating <span className="text-red-500">*</span>
                  </h5>
                  <div className="flex w-full ml-2 pb-3 my-2">
                    {[1, 2, 3, 4, 5].map(i =>
                      rating >= i ? (
                        <AiFillStar
                          key={i}
                          className="mr-1 cursor-pointer"
                          color="rgb(246,186,0)"
                          size={25}
                          onClick={() => setRating(i)}
                        />
                      ) : (
                        <AiOutlineStar
                          key={i}
                          className="mr-1 cursor-pointer"
                          color="rgb(246,186,0)"
                          size={25}
                          onClick={() => setRating(i)}
                        />
                      )
                    )}
                  </div>
                  <textarea
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    cols={40}
                    rows={5}
                    placeholder="Write a Review"
                    className="outline-none border bg-transparent 800px:ml-3 dark:border-[#ffffff57] border-[#000000be] w-[95%] 800px:w-full p-2 rounded dark:text-white text-[black] text-[18px] font-[Poppins]"
                  ></textarea>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2`}
                  onClick={addingReview ? () => {} : handleReviewSubmit}
                  disabled={addingReview}
                >
                  {addingReview ? "Wait..." : "Submit"}
                </button>
              </div>
            </>
          )}
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div className="w-full">
            {(course?.reviews && [...course.reviews].reverse())?.map(
              (item: any, index: number) => (
                <div
                  className="w-full my-5 dark:text-white text-black"
                  key={index}
                >
                  <div className="w-full flex">
                    <div>
                      <Image
                        src={
                          item.user.avatar
                            ? item.user.avatar?.url
                            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                        }
                        width={50}
                        height={50}
                        alt="image"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-2">
                      <h1 className="text-[18px]">{item.user.name}</h1>
                      <Ratings rating={item.rating} />
                      <p>{item.comment}</p>
                      <small className="dark:text-[#ffffff83] text-[#000000d0]">
                        {format(item.createdAt)}
                      </small>
                    </div>
                  </div>

                  {userData.role === "admin" &&
                    item.commentReplies.length === 0 && (
                      <span
                        className={`${styles.label} !ml-14 mt-2 cursor-pointer hover:text-[#fffefe] transition-all`}
                        onClick={() => {
                          setActiveReplyId(
                            activeReplyId === item._id ? null : item._id
                          );
                          setReply("");
                        }}
                      >
                        Add reply
                      </span>
                    )}

                  {activeReplyId === item._id && (
                    <div className="w-full flex relative">
                      <input
                        type="text"
                        placeholder="Your reply"
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#000] dark:border-[#fff] p-[5px] w-[95%]"
                      />
                      <button
                        type="submit"
                        className="absolute right-0 bottom-1"
                        onClick={() => handleReplySubmit(item._id)}
                        disabled={replying}
                      >
                        {replying ? "Wait..." : "Submit"}
                      </button>
                    </div>
                  )}

                  {item?.commentReplies?.map((replyItem: any, i: number) => (
                    <div className="w-full flex 800px:ml-16 my-5" key={i}>
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            replyItem.user.avatar
                              ? replyItem.user.avatar?.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt="image"
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{replyItem.user.name}</h5>
                          {replyItem?.user?.role === "admin" && (
                            <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                          )}
                        </div>
                        <p>{replyItem.reply}</p>
                        <small className="dark:text-[#ffffff83] text-[#000000c5]">
                          {format(replyItem.createdAt)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function QuestionReply({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  isAddingReply,
  user,
  setQuestionId,
}: any) {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo]?.questions.map((item: any, index: number) => (
          <QuestionItem
            key={index}
            item={item}
            isAddingReply={isAddingReply}
            data={data}
            activeVideo={activeVideo}
            setQuestionId={setQuestionId}
            answer={answer}
            setAnswer={setAnswer}
            handleAnswerSubmit={handleAnswerSubmit}
          />
        ))}
      </div>
    </>
  );
}

function QuestionItem({
  item,
  data,
  activeVideo,
  answer,
  isAddingReply,
  setQuestionId,
  setAnswer,
  handleAnswerSubmit,
}: any) {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <Image
              src={
                item.user.avatar
                  ? item.user.avatar?.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt="image"
              className="w-[50px] h-[50px] rounded-full object-cover  "
            />
          </div>
          <div className="pl-3">
            <h5 className="text-[20px] dark:text-white text-[black]">
              {item?.user.name}
            </h5>
            <p className=" dark:text-white text-[black] font-[500]">
              {item?.question}
            </p>
            <small className="dark:text-[#ffffff83] text-[#000000d4]">
              {!item.createdAt ? "" : format(item?.createdAt)}
            </small>
          </div>
        </div>
        <div className="w-full flex">
          <span
            className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
            onClick={() => {
              setReplyActive(!replyActive), setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className="dark:text-[#ffffff83] cursor-pointer text-[#000000b8]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer dark:text-[#ffffff83] text-[#000000b8]">
            {item.questionReplies.length}
          </span>
        </div>
        {replyActive && (
          <>
            {item.questionReplies.map((item: any, index: number) => (
              <div
                key={index}
                className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
              >
                <div>
                  <Image
                    src={
                      item.user.avatar
                        ? item.user.avatar?.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={50}
                    height={50}
                    alt="image"
                    className="w-[50px] h-[50px] rounded-full object-cover  "
                  />
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item.user.name}</h5>
                    {item?.user?.role === "admin" && (
                      <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                    )}
                  </div>
                  <p>{item.reply}</p>
                  <small className="dark:text-[#ffffff83] text-[#000000d3]">
                    {format(item.createdAt)}
                  </small>
                </div>
              </div>
            ))}
            <>
              <div className="w-full flex relative dark:text-white text-black">
                <input
                  type="text"
                  placeholder="Your reply"
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%]"
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-1"
                  onClick={isAddingReply ? null : handleAnswerSubmit}
                  disabled={answer === "" || isAddingReply}
                >
                  {isAddingReply ? "Wait..." : "Add"}
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
}

export default CourseContentMedia;
{
  /* <div className="w-[50px] h-[50px]">
  <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
    <h1 className="uppercase text-[18px]">{item?.user.name.slice(0, 2)}</h1>
  </div>
</div>; */
}
