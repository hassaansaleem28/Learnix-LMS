import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import avatarIcon from "../../../public/assets/avatar.jpg";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "@/app/styles/style";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "../../../redux-toolkit/features/user/userApi";
import { useLoadUserQuery } from "../../../redux-toolkit/features/api/apiSlice";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user?.name);
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });
  const [updateAvatar, { isSuccess, error, isLoading: isAvatarUpdating }] =
    useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: Error, isLoading }] =
    useEditProfileMutation();

  async function imageHandler(e: any) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  }
  useEffect(
    function () {
      if (isSuccess || success) {
        setLoadUser(true);
        toast.success("Profile Updated!");
      }
      if (error || Error) {
        console.error(error);
      }
    },
    [isSuccess, error, success, Error]
  );
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (name !== "") {
      await editProfile({ name: name });
    }
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          {isAvatarUpdating ? (
            <Loader />
          ) : (
            <Image
              src={
                user.avatar || avatar ? user?.avatar?.url || avatar : avatarIcon
              }
              alt=""
              width={120}
              height={120}
              className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
            />
          )}
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image.jpeg, image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2">Email address</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={user?.email}
              />
            </div>
            <input
              type="submit"
              value={`${isLoading ? "Updating..." : "Update"}`}
              required
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
