import { useMemo, useState } from "react";
import UserApi from "../../apis/user";
import { IPerson, Progress } from "../../types/User";

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [frameUrl, setFrameUrl] = useState<string>(props.problemUrl);
  const [user, setUser] = useState<IPerson>();
  const [progress, setProgress] = useState<Progress>();

  useMemo(() => {
    props.selectedCourse && UserApi.getUser()
    .then((response) => {
      setUser(response.data);
      setProgress(response.data.progress.find(x=>x.lessonId == props.selectedCourse.id));
      console.log("RESP" + progress)
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);

  function levelDone(e: Event)
  {

    console.log("Progress INIT:" + progress)
    if(user && progress)
    {
      progress.level += 1;
      UserApi.updateUserProgress(user, progress)
      console.log("HERE EXISTS: " + progress.level)
    }
    else if(user && props.selectedCourse?.id)
    {
      var newProg = new Progress(props.selectedCourse.id, 1, "0");
      console.log("HERE NEW: " + newProg.level)
      UserApi.updateUserProgress(user, newProg)
      setProgress(newProg)
    }
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