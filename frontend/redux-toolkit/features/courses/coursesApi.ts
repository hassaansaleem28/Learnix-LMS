import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createCourse: builder.mutation({
      query: data => ({
        url: "course/create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "course/get-all-courses-admin",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: id => ({
        url: `course/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `course/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getUserCourses: builder.query({
      query: () => ({
        url: "course/get-all-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseDetails: builder.query({
      query: id => ({
        url: `course/get-single-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query: id => ({
        url: `course/get-course-by-user/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "course/add-question",
        method: "PUT",
        body: { question, courseId, contentId },
        credentials: "include" as const,
      }),
    }),
    addReplyToQuestion: builder.mutation({
      query: ({ reply, courseId, contentId, questionId }) => ({
        url: "course/add-reply",
        method: "PUT",
        body: { reply, courseId, contentId, questionId },
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ id, review, rating }) => ({
        url: `course/add-review/${id}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include" as const,
      }),
    }),
    addReplyToReview: builder.mutation({
      query: ({ reply, courseId, reviewId }) => ({
        url: "course/add-reply-to-review",
        method: "PUT",
        body: { reply, courseId, reviewId },
        credentials: "include" as const,
      }),
    }),
  }),
});
export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useGetCourseContentQuery,
  useEditCourseMutation,
  useGetUserCoursesQuery,
  useAddNewQuestionMutation,
  useAddReplyToQuestionMutation,
  useAddReplyToReviewMutation,
  useGetCourseDetailsQuery,
  useAddReviewInCourseMutation,
} = courseApi;
