"use client";

import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div>
      <div
        className={`w-[95%] 800px:w-[92%] m-auto py-2 dark:text-white text-black px-3`}
      >
        <h1
          className={`${styles.title} !text-[2.2rem] !text-center pt-2 mb-10`}
        >
          Platform Term and Conditions
        </h1>

        <ul style={{ listStyle: "unset", marginLeft: "15px" }}>
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            At Learnix, we’re committed to creating a safe, respectful, and
            empowering environment for aspiring developers. Our policies are
            designed to ensure fairness, protect intellectual property, and
            foster meaningful learning experiences.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            By using our platform, you agree to uphold a code of conduct that
            values integrity, inclusivity, and constructive collaboration.
            Harassment, discrimination, or plagiarism of any kind will not be
            tolerated. All course materials and resources provided on Learnix
            are intended for personal educational use only and may not be
            redistributed or repurposed without permission.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            We take privacy seriously—your personal data is collected minimally
            and never shared with third parties without your consent. Users are
            expected to engage honestly with assessments and refrain from any
            form of cheating or impersonation.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Any misuse of the platform, including attempts to exploit or disrupt
            its functionality, may result in account suspension. Learnix
            reserves the right to revoke access or certification in cases of
            misconduct. By participating in this community, you help maintain a
            space where aspiring developers can learn, grow, and thrive
            together.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            At Learnix, we’re committed to creating a safe, respectful, and
            empowering environment for aspiring developers. Our policies are
            designed to ensure fairness, protect intellectual property, and
            foster meaningful learning experiences.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Learnix reserves the right to revoke access or certification in
            cases of misconduct. By participating in this community, you help
            maintain a space where aspiring developers can learn, grow, and
            thrive together.
          </p>
          <br />
          <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
            Harassment, discrimination, or plagiarism of any kind will not be
            tolerated. All course materials and resources provided on Learnix
            are intended for personal educational use only and may not be
            redistributed or repurposed without permission.By participating in
            this community, you help maintain a space where aspiring developers
            can learn, grow, and thrive together.
          </p>
          <br />
        </ul>
      </div>
    </div>
  );
};

export default Policy;
