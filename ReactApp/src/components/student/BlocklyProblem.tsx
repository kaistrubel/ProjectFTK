import { useMemo, useRef, useState } from "react";
import LessonApi from "../../apis/lesson";
import UserApi from "../../apis/user";
import { ILecture, IProblem } from "../../types/Lesson";
import {Progress } from "../../types/User";
import AddLectures from "../teacher/AddLectures";

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [notes, setNotes] = useState<ILecture[]>();
  const [videos, setVideos] = useState<ILecture[]>();
  const [problems, setProblems] = useState<IProblem[]>();
  const [problemUrl, setProblemUrl] = useState<string>();

  const [progress, setProgress] = useState<Progress>(new Progress(props.lessonId, 1, 0, 0));
  const [currLevel, setCurrLevel] = useState<number>(1);
  const attempts = useRef(0);

  const activeSeconds = useRef(0);
  const inactivetyCount = useRef(180);

  useMemo(() => {
  var userProg = props.user?.progressList?.find((x: { lessonId: string; }) => x.lessonId == props.lessonId);
  userProg && setProgress(userProg)
  
  LessonApi.getLesson(props.lessonId)
    .then((response) => {
      
      var capLevel = Math.min(10, userProg?.level ?? 1);

      setCurrLevel(capLevel)

      setProblems(response.data.problems)
      setVideos(response.data.videos)
      setNotes(response.data.notes)
      setProblemUrl(response.data.problems[0].url + "?level=" + capLevel)
      setVideoUrl(response.data.videos[0].url)

      activeSeconds.current = userProg?.activeSeconds ?? 0;
      attempts.current = userProg?.attempts ?? 0;
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, [props.lessonId, props.user]);

  function levelDone(e: Event)
  {
    var finsihedLesson = false;

    if(props.lessonId == "fc6d7c75-b20a-4a88-a632-920395c3211e")
    {
      var problemFrame = document.getElementById('ProblemFrame') as HTMLIFrameElement;
      var msgDiv = problemFrame?.contentWindow?.document.getElementById('answerMessage') as HTMLDivElement;
      if(msgDiv.children[0].innerHTML.includes("Perfect!"))
      {
        finsihedLesson = true;
      }
      else
      {
        resetHit();
        return;
      }
    }

    if((currLevel + 1 ) > 10)
    {
      finsihedLesson = true;
    }

    ++attempts.current
    changeCurrentLevel(currLevel+1)
    if((progress?.level < currLevel + 1) != false)
    {
      setProgress(new Progress(props.lessonId, (currLevel + 1), activeSeconds.current, attempts.current))
      UserApi.updateUserProgress(props.user.progressList, new Progress(props.lessonId, (currLevel + 1), activeSeconds.current, attempts.current))
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

  function resetHit()
  {
    ++attempts.current
    UserApi.updateUserProgress(props.user.progressList, new Progress(props.lessonId, currLevel, activeSeconds.current, attempts.current))
  }

  var intervalId = window.setInterval(function(){
    --inactivetyCount.current
    if(inactivetyCount.current > 0)
    {
      ++activeSeconds.current
    }
  }, 1000);

  var intervalId = window.setInterval(function(){
    if(inactivetyCount.current > 0)
    {
      UserApi.updateUserProgress(props.user.progressList, new Progress(props.lessonId, currLevel, activeSeconds.current, attempts.current))
    }
  }, 180000);

  function resetTimer()
  {
    inactivetyCount.current = 180;
  }

  function setButtonListen()
  {
    var problemFrame = document.getElementById('ProblemFrame') as HTMLIFrameElement;
    if(problemFrame?.contentWindow?.document)
    {
      problemFrame.contentWindow.document.onclick = resetTimer;
    }

    if(props.lessonId != "fc6d7c75-b20a-4a88-a632-920395c3211e" && props.lessonId != "996f8891-1e82-42d4-9f0f-c3f92ddea9cc")
    {
      var doneButton = problemFrame?.contentWindow?.document.getElementById('doneOk') as HTMLButtonElement;
      doneButton.addEventListener("click", levelDone);

      var resetButton = problemFrame?.contentWindow?.document.getElementById('resetButton') as HTMLButtonElement;
      resetButton.addEventListener("click", resetHit);
    }
    else if(props.lessonId == "fc6d7c75-b20a-4a88-a632-920395c3211e")
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
    problems && setProblemUrl(problems[0].url + "?level=" + capLevel)
    videos && setVideoUrl(videos[0].url)
  }

  const renderProgress = () => {
    var list = [];
    var totLevels = 10;
    for (let i = 1; i <= totLevels; i++) {
      list.push(
      <li onClick={()=>{ i <= progress.level || props.user?.isTeacher === true ? changeCurrentLevel(i) : void 0}} 
      key = {i}
      className= {(props.user?.isTeacher === true ? "cursor-pointer " : "") + (progress.level > i ? "active cursor-pointer " : "") + (currLevel == i ? "current cursor-pointer" : progress.level == i ? "currentmax cursor-pointer" : "") } 
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
            { (props.lessonId != "fc6d7c75-b20a-4a88-a632-920395c3211e" && props.lessonId != "996f8891-1e82-42d4-9f0f-c3f92ddea9cc") ? renderProgress() : void 0}
          </ul>
        </div>
        <iframe id="ProblemFrame" src={problemUrl} title="Problem" onLoad={setButtonListen} ></iframe>
        <iframe id="VideoFrame" className="hidden" src={videoUrl} title="Video" hidden></iframe>
      </div>

      {props.user?.isTeacher != true ? 
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
        :
        <AddLectures problems={problems} user={props.user} videos={videos} notes={notes} lessonId={props.lessonId} level={currLevel}/>
      }

    </>
  );
};

export default OpenProblems;