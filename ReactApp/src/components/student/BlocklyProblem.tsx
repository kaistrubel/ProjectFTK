import { useMemo, useState } from "react";
import LessonApi from "../../apis/lesson";
import UserApi from "../../apis/user";
import { IProblem } from "../../types/Lesson";
import {Progress } from "../../types/User";

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [problem, setProblem] = useState<IProblem>();
  const [problemUrl, setProblemUrl] = useState<string>();

  const [progress, setProgress] = useState<Progress>(new Progress(props.lessonId, 1, "0", 0));
  const [currLevel, setCurrLevel] = useState<number>(1);
  const [attempts, setAttempts] = useState<number>(0);

  useMemo(() => {
  var userProg = props.user?.progressList?.find((x: { lessonId: string; }) => x.lessonId == props.lessonId);
  userProg && setProgress(userProg)
  
  LessonApi.getProblems(props.lessonId)
    .then((response) => {
      
      var capLevel = Math.min(10, userProg.level);

      setCurrLevel(capLevel)

      setProblem(response.data[0])
      setProblemUrl(response.data[0].url + "?level=" + capLevel)
      setVideoUrl(response.data[0].videos[0].url)

      setAttempts(progress.attempts)
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, [props.lessonId, props.user]);

  function levelDone(e: Event)
  {
    var finsihedLesson = false;

    if(props.lessonId == "e0de78ce-4fb7-4db5-993a-14d11868f489")
    {
      var problemFrame = document.getElementById('ProblemFrame') as HTMLIFrameElement;
      var msgDiv = problemFrame?.contentWindow?.document.getElementById('answerMessage') as HTMLDivElement;
      if(msgDiv.children[0].innerHTML.includes("Perfect!"))
      {
        finsihedLesson = true;
      }
      else
      {
        //update similar to reset hit for intro here
      }
    }

    if((currLevel + 1 ) > 10)
    {
      finsihedLesson = true;
    }

    changeCurrentLevel(currLevel+1)
    setAttempts(attempts+1)
    if((progress?.level < currLevel + 1) != false)
    {
      setProgress(new Progress(progress.lessonId, (currLevel + 1), "0", (attempts + 1)))
      console.log(attempts)
      UserApi.updateUserProgress(props.user.progressList, new Progress(progress.lessonId, (currLevel + 1), "0", (attempts + 1)))
      .then(() => 
      {
        if(finsihedLesson)
        {
          window.location.href = "/";
          return;
        }
      })
    }
  }

  function resetHit(e: Event)
  {
    console.log(attempts)
    setAttempts((attempts + 1))
    UserApi.updateUserProgress(props.user.progressList, new Progress(progress.lessonId, currLevel, "0", (attempts + 1)))
  }

  function setButtonListen()
  {
    var problemFrame = document.getElementById('ProblemFrame') as HTMLIFrameElement;

    if(props.lessonId != "e0de78ce-4fb7-4db5-993a-14d11868f489" && props.lessonId != "1335fe1a-c5ff-499c-b070-896c3ea3aaab")
    {
      var doneButton = problemFrame?.contentWindow?.document.getElementById('doneOk') as HTMLButtonElement;
      doneButton.addEventListener("click", levelDone);

      var resetButton = problemFrame?.contentWindow?.document.getElementById('resetButton') as HTMLButtonElement;
      resetButton.addEventListener("click", resetHit);
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
    var capLevel = Math.min(10, lvl);

    setCurrLevel(capLevel)
    problem && setProblemUrl(problem.url + "?level=" + capLevel)
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
            { (props.lessonId != "e0de78ce-4fb7-4db5-993a-14d11868f489" && props.lessonId != "1335fe1a-c5ff-499c-b070-896c3ea3aaab") ? renderProgress() : void 0}
          </ul>
        </div>
        <iframe id="ProblemFrame" src={problemUrl} title="Problem" onLoad={setButtonListen}></iframe>
        <iframe id="VideoFrame" className="hidden" src={videoUrl} title="Video" hidden></iframe>
      </div>

      <div className="px-4 text-center sm:px-6">
        <button
          onClick={() =>
          {
            var problemFrame = document.getElementById("ProblemFrame");
            var videoFrame = document.getElementById("VideoFrame");
            if(problemFrame && videoFrame)
            {
              if(isProbleminFrame)
              {
                problemFrame.className = "hidden"
                videoFrame.className = ""
              }
              else
              {
                problemFrame.className = ""
                videoFrame.className = "hidden"
              }
              setisProbleminFrame(!isProbleminFrame);
            }

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