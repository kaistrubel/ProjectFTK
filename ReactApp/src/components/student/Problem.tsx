import { useState } from "react";

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [frameUrl, setFrameUrl] = useState<string>(props.problemUrl);

    return (
      <>
        <div className="grid place-items-center pt-16">
          <iframe src={frameUrl} title="Problem"></iframe>
        </div>

        <div className="px-4 text-center sm:px-6">
          <button
            onClick={() =>
            {
              setFrameUrl(frameUrl === props.videoUrl ? props.problemUrl : props.videoUrl)
              setisProbleminFrame(!setisProbleminFrame)
            }}
            type="submit"
            className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
          >
            Show {isProbleminFrame? "Video" : "Problem"}
          </button>
        </div>
      </>
  );
};

export default OpenProblems;