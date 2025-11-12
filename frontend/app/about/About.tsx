"use client";
import React from "react";
import { styles } from "../styles/style";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">Learnix?</span>
      </h1>
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-[Poppins]">
          Are you ready to take your engineering skills to the next level? Look
          no further than Learnix, the premium programming community dedicated
          to help the begineer developers to become better software engineers
          and reach their full potential.
          <br />
          <br />
          Learnix is more than just a learning platform. It’s a community-driven
          LMS built for aspiring developers who want to go beyond tutorials and
          start building real-world skills. Whether you are debugging your first
          app or deploying full-stack projects, Learnix gives you the tools,
          guidance, and support to level up.
          <br />
          <br />
          Beginner-friendly, industry-ready: Learnix bridges the gap between
          theory and practice with curated lessons, hands-on challenges, and
          expert insights.
          <br />
          <br />
          Built by engineers, for engineers: Every module is designed to reflect
          real-world workflows, not just textbook examples. Collaborate, grow,
          and get noticed: Join a vibrant community where feedback is
          constructive, mentorship is accessible, and your progress is visible.
          Your potential is limitless. Learnix is here to help you unlock it—one
          commit, one concept, one breakthrough at a time. Want me to tailor
          this for a landing page, pitch deck, or onboarding screen? I can adapt
          the tone and layout to fit any format.
          <br />
          <br />
          Your potential is limitless. Learnix is here to help you unlock it—one
          commit, one concept, one breakthrough at a time. Learnix is here to
          help you unlock it—one commit, one concept, one breakthrough at a
          time. Want me to tailor this for a landing page, pitch deck, or
          onboarding screen? I can adapt the tone and layout to fit any format.
        </p>
        <br />
        <span className="font-Cursive text-[22px]">Hassaan Saleem</span>
        <h5 className="text-[15px] font-[Poppins]">MERN Stack developer</h5>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
