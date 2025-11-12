import Link from "next/link";
import React, { FC } from "react";

type Props = {};

const Footer: FC<Props> = ({}) => {
  return (
    <footer>
      <div className="border border-[#0000000e] dark:border-[#ffffff1e]">
        <br />
        <div className="w-[95%] 800px:w-full 800px:max-w-[85%] m-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 mb-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-[20px] font-[600] text-black dark:text-white">
                About
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={"/about"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/private-policy"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Private Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/faq"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-[20px] font-[600] text-black dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={"/courses"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/profile"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/course-dashboard"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Course Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-[20px] font-[600] text-black dark:text-white">
                Social Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={"/"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Youtube
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/"}
                    className="text-base text-black dark:text-gray-300 dark:hover:text-white"
                  >
                    Github
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[20px] font-[600] text-black dark:text-white pb-3">
                Contact Info
              </h3>
              <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
                Phone: +92 302 1234567
              </p>
              <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
                Address : Lahore, Pakistan
              </p>
              <p className="text-base text-black dark:text-gray-300 dark:hover:text-white pb-2">
                Mail Us: iamhassaans@gmail.com
              </p>
            </div>
          </div>
          <br />
          <p className="text-center text-black dark:text-white">
            Copyright &copy; {new Date().getFullYear()} Learnix. All Rights
            Reserved.
          </p>
        </div>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
