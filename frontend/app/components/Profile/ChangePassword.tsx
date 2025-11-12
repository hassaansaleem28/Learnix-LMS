"use client";

import { useUpdatePasswordMutation } from "../../../redux-toolkit/features/user/userApi";
import { styles } from "../../styles/style";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [updatePassword, { isSuccess, error, isLoading }] =
    useUpdatePasswordMutation();
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password Updated!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error.data as {
          success?: boolean;
          message?: string;
        };
        toast.error(errorData?.message || "Login failed");
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          className="flex flex-col items-center"
          onSubmit={passwordChangeHandler}
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block ">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block ">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block ">Confirm new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#37a39a] text-center rounded-[3px] mt-8 cursor-pointer`}
              required
              value={`${isLoading ? "Updating..." : "Update"}`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
