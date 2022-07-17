import { useMemo, useState } from "react";
import LessonApi from "../../apis/lesson";
import UserApi from "../../apis/user";
import { IProblem } from "../../types/Lesson";
import IUser, {Progress } from "../../types/User";

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [frameUrl, setFrameUrl] = useState<string>();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [problem, setProblem] = useState<IProblem>();
  const [problemUrl, setProblemUrl] = useState<string>();

  const [progress, setProgress] = useState<Progress>(props.user.progressList?.find((x: { lessonId: string; }) => x.lessonId == props.lessonId) ?? new Progress(props.lessonId, 1, "0"));
  let [currLevel, setCurrLevel] = useState<number>(1);

  useMemo(() => {
    LessonApi.getProblems(props.lessonId)
    .then((response) => {
      setCurrLevel(progress.level)

      setProblem(response.data[0])
      setFrameUrl(response.data[0].url + "?level=" + progress.level)
      setProblemUrl(response.data[0].url + "?level=" + progress.level)
      setVideoUrl(response.data[0].videos[0].url)
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, [props.lessonId]);

  function levelDone(e: Event)
  {
    if(props.lessonId == "e0de78ce-4fb7-4db5-993a-14d11868f489")
    {
    var problemFrame = document.getElementById('ProblemFrame') as HTMLIFrameElement;
    var msgDiv = problemFrame?.contentWindow?.document.getElementById('answerMessage') as HTMLDivElement;
    if(msgDiv.children[0].innerHTML.includes("Perfect!"))
    {
      window.location.href = "/"
    }
    return;
    }

    changeCurrentLevel(currLevel+1)
    if(progress?.level < currLevel + 1 != false)
    {
      setProgress(new Progress(progress.lessonId, (currLevel + 1), "0"))
      UserApi.updateUserProgress(props.user.progressList, new Progress(progress.lessonId, (currLevel + 1), "0"))
    }

    if((currLevel + 1 ) > 10)
    {
      window.location.href = "/"
    }
  }

  function setButtonListen()
  {
    var problemFrame = document.getElementById('ProblemFrame') as HTMLIFrameElement;

    if(props.lessonId != "e0de78ce-4fb7-4db5-993a-14d11868f489" && props.lessonId != "1335fe1a-c5ff-499c-b070-896c3ea3aaab")
    {
      var doneButton = problemFrame?.contentWindow?.document.getElementById('doneOk') as HTMLButtonElement;// ?? problem?.contentWindow?.document.getElementById('secondary') as HTMLButtonElement; <-first lesson only has 1, need to figure out
      doneButton.addEventListener("click", levelDone);
    }
    else if(props.lessonId == "e0de78ce-4fb7-4db5-993a-14d11868f489")
    {
      var donediv = problemFrame?.contentWindow?.document.getElementById('answers') as HTMLDivElement;// ?? problem?.contentWindow?.document.getElementById('secondary') as HTMLButtonElement; <-first lesson only has 1, need to figure out
      var doneButton = donediv.getElementsByClassName('secondary')[0] as HTMLButtonElement;
      doneButton.addEventListener("click", levelDone);
    }

    var table = problemFrame?.contentWindow?.document.getElementsByTagName('h1')[0] as HTMLElement;
    table.hidden = true;
  }

  function changeCurrentLevel(lvl: number)
  {
    setCurrLevel(lvl)
    problem && setFrameUrl(problem.url + "?level=" + lvl)
    problem && setProblemUrl(problem.url + "?level=" + lvl)
    problem && setVideoUrl(problem.videos[0].url)
  }

  const renderProgress = () => {
    var list = [];
    var totLevels = 10;
    for (let i = 1; i <= totLevels; i++) {
      list.push(
      <li onClick={()=>{ i <= progress.level ? changeCurrentLevel(i) : void 0}} 
      key = {i}
      className= {(progress.level > i ? "active cursor-pointer " : "") + (currLevel == i ? "current cursor-pointer" : progress.level == i ? "currentmax cursor-pointer" : "") } 
      style = {{width: ((1/totLevels)*100) + "%"}}></li>
      );
    }
    return list;
  }

    return (
      <>
        <div className="grid place-items-center pt-16">
          <div className="progressbarparent pb-3">
            <ul className="progressbar place-items-center">
              {renderProgress()}
            </ul>
          </div>
          <iframe id="ProblemFrame" src={frameUrl} title="Problem" onLoad={setButtonListen}></iframe>
        </div>

        <div className="px-4 text-center sm:px-6">
          <button
            onClick={() =>
            {
              setFrameUrl(frameUrl === videoUrl ? problemUrl : videoUrl)
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