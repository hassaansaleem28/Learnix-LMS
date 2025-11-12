import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux-toolkit/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isLoading: isUpdating, isSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any>([]);

  useEffect(
    function () {
      if (data) {
        setCategories(data.layout.categories);
      }
      if (isSuccess) {
        refetch();
        toast.success("Categories Updated!");
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
  function handleCategoriesAdd(id: any, value: string) {
    setCategories((prevCate: any) =>
      prevCate.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  }
  function newCategoriesHandler() {
    if (categories[categories.length - 1].title === "") {
      toast.error("Categories title can' t be empty!");
    } else {
      setCategories((prevCate: any) => [...prevCate, { title: "" }]);
    }
  }
  function areCategoriesUnchanges(
    originalCategories: any[],
    newCategories: any[]
  ) {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  }
  function isAnyCategoryTitleEmpty(categories: any[]) {
    return categories.some(q => q.title === "");
  }
  async function editCategoriesHandler() {
    if (
      !areCategoriesUnchanges(data.layout.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((item: any, index: number) => {
              return (
                <div className="p-3" key={index}>
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                      value={item.title}
                      onChange={e =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Enter category title..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setCategories((prevCate: any) =>
                          prevCate.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`py-2 px-8 text-[1.3rem] font-[500] dark:text-white text-black bg-[#cccccc34] ${
              areCategoriesUnchanges(data.layout.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanges(data.layout.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
