import { useMemo, useRef, useState } from "react";
import LessonApi from "../../apis/lesson";
import UserApi from "../../apis/user";
import { ILecture, IProblem } from "../../types/Lesson";
import {Progress } from "../../types/User";
import AddLectures from "../teacher/AddLectures";
import {ChevronDoubleRightIcon,ChevronDoubleLeftIcon } from '@heroicons/react/solid';

const OpenProblems = (props: any) => {

  const [isProbleminFrame, setisProbleminFrame] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [videoIdx, setVideoIdx] = useState<number>(0);
  const [notes, setNotes] = useState<ILecture[]>();
  const [videos, setVideos] = useState<ILecture[]>();
  const [problems, setProblems] = useState<IProblem[]>();
  const [problemUrl, setProblemUrl] = useState<string>();

  const [notesUrl, setNotesUrl] = useState<string>();
  const [notesIdx, setNotesIdx] = useState<number>(0)
  const notesViweed = useRef("");

  const [progress, setProgress] = useState<Progress>();
  const [currLevel, setCurrLevel] = useState<number>(1);
  const attempts = useRef(0);
  const videoPlayed = useRef("");

  const activeSeconds = useRef(0);
  const inactivetyCount = useRef(180);

  useMemo(() => {
  var userProg = props.user?.progressList?.find((x: { lessonId: string; }) => x.lessonId == props.lessonId);
  setProgress(userProg ?? new Progress(props.lessonId, 1, 0, 0))
  LessonApi.getLesson(props.lessonId)
    .then((response) => {
      var capLevel = Math.min(10, userProg?.level ?? 1);

      setCurrLevel(capLevel)

      setProblems(response.data.problems)
      setVideos(response.data.videos)
      setNotes(response.data.notes)
      setProblemUrl(response.data.problems[0].url + "?level=" + capLevel)
      setVideoUrl(response.data.videos[0].url)
      setVideoIdx(0);

      setNotesUrl(response.data.notes[0].url)
      setNotesIdx(0);

      activeSeconds.current = userProg?.activeSeconds ?? 0;
      attempts.current = userProg?.attempts ?? 0;
    })
    .catch((e: Error) => {
      console.log(e);
    });

    setInterval(() => {
      inactivetyCount.current--
      if(inactivetyCount.current > 0)
      {
        activeSeconds.current++
      }
    }, 2000);
  
    setInterval(() => {
      if(inactivetyCount.current > 0 && progress?.level)
      {
        UserApi.updateUserProgress(props.user.progressList, new Progress(props.lessonId, Math.max(currLevel, progress.level), activeSeconds.current, attempts.current))
      }
    }, 100000);
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
    if((progress && progress.level < currLevel + 1) != false)
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

    if(videoUrl && videoPlayed.current != "")
    {
      LessonApi.updateVideoData(props.lessonId, videoPlayed.current, true)
      videoPlayed.current = ""
    }
  }

  function resetHit()
  {
    ++attempts.current
    if(progress)
    {
      UserApi.updateUserProgress(props.user.progressList, new Progress(props.lessonId, Math.max(currLevel, progress.level), activeSeconds.current, attempts.current))
    }
    if(videoUrl && videoPlayed.current != "")
    {
      LessonApi.updateVideoData(props.lessonId, videoPlayed.current, false)
      videoPlayed.current = ""
    }
  }

  function resetTimer()
  {
    inactivetyCount.current = 120;
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
  }

  const renderProgress = () => {
    var list = [];
    var totLevels = 10;
    if(progress)
    {
      for (let i = 1; i <= totLevels; i++) {
        list.push(
        <li onClick={()=>{ i <= progress.level || props.user?.isTeacher === true ? changeCurrentLevel(i) : void 0}} 
        key = {i}
        className= {(props.user?.isTeacher === true ? "cursor-pointer " : "") + (progress.level > i ? "active cursor-pointer " : "") + (currLevel == i ? "current cursor-pointer" : progress.level == i ? " cursor-pointer" : (props.user?.isTeacher != true && i > progress.level) ? "next" : "") } 
        style = {{width: ((1/totLevels)*100) + "%"}}></li>
        );
      }
    }

    return list;
  }

  return (
    <>
      <div className="grid place-items-center pt-16">
        <div id="ProgressBar" className="progressbarparent pb-3">
          <ul className="progressbar place-items-center">
            { (props.lessonId != "fc6d7c75-b20a-4a88-a632-920395c3211e" && props.lessonId != "996f8891-1e82-42d4-9f0f-c3f92ddea9cc") ? renderProgress() : void 0}
          </ul>
        </div>
        
        <iframe id="ProblemFrame" src={problemUrl} title="Problem" onLoad={setButtonListen} ></iframe>
        
        <div id="VideoFrame" className="hidden" >
          <button onClick={() => {
            setVideoIdx(videoIdx-1) 
            setVideoUrl(videos && videos[videoIdx-1].url)}
            } className={"w-20 h-20 text-white float-left self-center hover:text-yellow-500 " + (videoIdx == 0 ? " invisible" : "")}><ChevronDoubleLeftIcon aria-hidden="true" /></button>
            <div onMouseEnter={() => videoPlayed.current = videoUrl ?? ""}>
              <iframe src={videoUrl} title="Video" className="center"></iframe>
            </div>
          <button onClick={() => {
            setVideoIdx(videoIdx+1) 
            setVideoUrl(videos && videos[videoIdx+1].url)}
            } className={"w-20 h-20 text-white float-right self-center hover:text-yellow-500" + (videoIdx == (videos && videos?.length-1) ? " invisible" : "")}><ChevronDoubleRightIcon aria-hidden="true" /></button>
        </div>

        <div id="NotesFrame" className="hidden" >
          <button onClick={() => {
            setNotesIdx(notesIdx-1) 
            setNotesUrl(notes && notes[notesIdx-1].url)}
            } className={"w-20 h-20 text-white float-left self-center hover:text-yellow-500 " + (notesIdx == 0 ? " invisible" : "")}><ChevronDoubleLeftIcon aria-hidden="true" /></button>
            <div onMouseEnter={() => notesViweed.current = notesUrl ?? ""}>
              <iframe src={notesUrl} title="Notes" className="center"></iframe>
            </div>
          <button onClick={() => {
            setNotesIdx(notesIdx+1) 
            setNotesUrl(notes && notes[notesIdx+1].url)}
            } className={"w-20 h-20 text-white float-right self-center hover:text-yellow-500" + (notesIdx == (notes && notes?.length-1) ? " invisible" : "")}><ChevronDoubleRightIcon aria-hidden="true" /></button>
        </div>
      
      </div>

      {props.user?.isTeacher != true ?
        <div className="flex center">
          <div className={videos && videos.length > 0 ? "px-4 text-center sm:px-6" : "hidden"}>
            <button
              onClick={() =>
              {
                var problemFrame = document.getElementById("ProblemFrame");
                var progressBar = document.getElementById("ProgressBar");
                var videoFrame = document.getElementById("VideoFrame");
                var notesFrame = document.getElementById("NotesFrame");

                if(problemFrame && videoFrame && progressBar && notesFrame)
                {
                  if(isProbleminFrame)
                  {
                    problemFrame.className = "hidden"
                    progressBar.className = "invisible"
                    videoFrame.className = "flex"
                  }
                  else
                  {
                    problemFrame.className = ""
                    progressBar.className = "progressbarparent pb-3";
                    videoFrame.className = "hidden"
                    notesFrame.className = "hidden"
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
          <div className={(isProbleminFrame && notes && notes.length > 0 ) ? "px-4 text-center sm:px-6" : "hidden"}>
            <button
              onClick={() =>
              {
                var problemFrame = document.getElementById("ProblemFrame");
                var progressBar = document.getElementById("ProgressBar");
                var notesFrame = document.getElementById("NotesFrame");
                if(problemFrame && notesFrame && progressBar)
                {
                  if(isProbleminFrame)
                  {
                    problemFrame.className = "hidden"
                    progressBar.className = "invisible"
                    notesFrame.className = "flex"
                  }
                  else
                  {
                    problemFrame.className = ""
                    progressBar.className = "progressbarparent pb-3";
                    notesFrame.className = "hidden"
                  }
                  setisProbleminFrame(!isProbleminFrame);
                }

              }}
              type="submit"
              className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
            >
              Show {isProbleminFrame? "Notes" : "Problem"}
            </button>
          </div>
        </div>
        :
        <AddLectures problems={problems} user={props.user} videos={videos} notes={notes} lessonId={props.lessonId} level={currLevel}/>
      }

    </>
  );
};

export default OpenProblems;