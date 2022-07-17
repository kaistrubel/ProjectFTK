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
    changeCurrentLevel(currLevel+1)
    if(progress?.level < currLevel + 1 != false)
    {
      setProgress(new Progress(progress.lessonId, (currLevel + 1), "0"))
      UserApi.updateUserProgress(props.user.progressList, new Progress(progress.lessonId, (currLevel + 1), "0"))
    }
  }

  function setButtonListen()
  {
    var problem = document.getElementById('ProblemFrame') as HTMLIFrameElement;
    var doneButton = problem?.contentWindow?.document.getElementById('doneOk') as HTMLButtonElement;// ?? problem?.contentWindow?.document.getElementById('secondary') as HTMLButtonElement; <-first lesson only has 1, need to figure out
    doneButton.addEventListener("click", levelDone);

    var table = problem?.contentWindow?.document.getElementsByTagName('h1')[0] as HTMLElement;
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
      <li onClick={()=>{changeCurrentLevel(i)}} 
      key = {i}
      className= {(progress.level > i ? "active " : "") + (currLevel == i ? "current" : "") } 
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