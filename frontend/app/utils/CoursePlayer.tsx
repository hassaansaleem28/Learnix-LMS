import axios from "axios";
import React, { FC, useEffect, useState } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(
    function () {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URI}course/getVdoCipherOTP`, {
          videoId: videoUrl?.trim(),
        })
        .then(res =>
          setVideoData({
            otp: res.data.data.otp,
            playbackInfo: res.data.data.playbackInfo,
          })
        );
    },
    [videoUrl]
  );
  return (
    <div
      style={{ paddingTop: "56.25%", overflow: "hidden", position: "relative" }}
    >
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}&player=hiC4ITPh7jb1SUAX`}
          style={{
            border: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
{
  /* <div style="padding-top:56%;position:relative;">
  <iframe
    src="https://player.vdocipher.com/v2/?otp=20160313versASE3232uKbCTot1Crp4k7MlwRZRuz0klnCqlkFJUwmOJmbEHX3qm&playbackInfo=eyJ2aWRlb0lkIjoiZjQ0YmIwZWEyNTM4NDA5YmI1Mjk0MjU0ODk0ODA3Y2YifQ=="
    style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%;"
    allowFullScreen="true"
    allow="encrypted-media"
  ></iframe>
</div>; */
}
