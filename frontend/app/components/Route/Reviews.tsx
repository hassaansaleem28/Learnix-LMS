import { styles } from "@/app/styles/style";
import Image from "next/image";
import React, { FC } from "react";
import ReviewCard from "../Reviews/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Gene Bates",
    avatar: "https://i.pravatar.cc/150?img=1",
    profession: "Student | Cambridge University",
    ratings: 4,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Yuri Boyka",
    avatar: "https://i.pravatar.cc/150?img=2",
    profession: "Student | Colorado University",
    ratings: 5,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. fqnfq qnqf!!Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Denis Joshua",
    avatar: "https://i.pravatar.cc/150?img=3",
    profession: "Student | Virtual University",
    comment:
      "Lorem ipsum dolor sit amet!Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ed do eiusmod tempor incididunt ut labore et dolore magna aliqua.ed do eiusmod tempor!!",
    ratings: 4,
  },
  {
    name: "Gene Bates",
    avatar: "https://i.pravatar.cc/150?img=1",
    profession: "Student | Cambridge University",
    ratings: 4,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Yuri Boyka",
    avatar: "https://i.pravatar.cc/150?img=2",
    profession: "Student | Colorado University",
    ratings: 5,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. fqnfq qnqf!!Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Ali Hanzla",
    avatar: "https://i.pravatar.cc/150?img=3",
    profession: "Full Stack Developer | Velrico Technologies",
    comment:
      "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet!Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.ed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ratings: 4,
  },
];

const Reviews: FC<Props> = ({}) => {
  return (
    <div className="w-[90%] 800px:w-[85%] mx-auto my-20">
      <div className="w-full 800px:flex items-center mb-16">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assets/banner-img-1.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students Are
            <span className="text-gradient"> Our Strength</span>
            <br /> See What They Say About Us
          </h3>
          <br />
          <p className={`${styles.label}`}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            ipsa asperiores, alias sint vel, corrupti doloremque iste tempora,
            soluta consectetur aliquid! Reiciendis quos eos in numquam nemo
            quibusdam incidunt dignissimos.
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid md:grid-cols-2 gap-[25px] grid-cols-1 md:gap-[25px] xl:grid-cols-2 xl:gap-[25px] border-0">
        {reviews &&
          reviews.map((item, index) => <ReviewCard key={index} item={item} />)}
      </div>
    </div>
  );
};

export default Reviews;
