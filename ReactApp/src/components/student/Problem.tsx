import { useState } from "react";
import { IPerson } from "../../types/User";

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [frameUrl, setFrameUrl] = useState<string>(props.problemUrl);
  const [level, setLevel] = useState<number>();

  function levelDone(e: Event)
  {
    e.preventDefault();
    console.log("DONEEE");
  }

  function setButtonListen()
  {
    var problem = document.getElementById('ProblemFrame') as HTMLIFrameElement;
    var doneButton = problem?.contentWindow?.document.getElementById('doneOk') as HTMLButtonElement;
    doneButton.addEventListener("click", levelDone);
  }

    return (
      <>
        <div className="grid place-items-center pt-16">
          <iframe id="ProblemFrame" src={frameUrl} title="Problem" onLoad={setButtonListen}></iframe>
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