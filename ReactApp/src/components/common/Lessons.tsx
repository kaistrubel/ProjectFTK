import NoClasses from "./NoClasses";
import { Link } from 'react-router-dom';
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useMemo, useState } from "react";
import ILesson from "../../types/Lesson";
import LessonApi from "../../apis/lesson";
import Loading from "./Loading";
import { useLocalStorage } from "../localStorage";
import ClassApi from "../../apis/class";

const Lessons = (props: any) => {

  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [selectedunit, setSelectedUnit] = useLocalStorage<string>("selectedunit");

  useMemo(() => {
    props.selectedCourse?.courseSlug && LessonApi.getLessons(props.selectedCourse?.courseSlug)
    .then((response) => {
      setLessons(response.data)
      if(selectedunit == null)
      {
        response.data[0]?.unit && setSelectedUnit(response.data[0].unit) //need to update this to current unit based on userData store
      }
    })
    .catch((e: Error) => {
      console.log(e);
    });

    var showButton = document.getElementById('showCode');
    var codeDiv = document.getElementById('code');
    if(showButton && codeDiv)
    {
      showButton.hidden = false;
      codeDiv.hidden = true;
    }
  }, [props.selectedCourse]);

  function showCode()
  {
    ClassApi.getCodeForClass(props.selectedCourse?.id)
    .then((response) => {
      var showButton = document.getElementById('showCode');
      var codeDiv = document.getElementById('code');
      if(showButton && codeDiv)
      {
        showButton.hidden = true;
        codeDiv.textContent = response.data;
        codeDiv.hidden = false;
      }
    })
  }

  function isDone(lessonId: string)
  {
    var progress = props.user.progressList?.find((x: { lessonId: string; }) => x.lessonId == lessonId);
    if(progress)
    {
      if((lessonId == "e0de78ce-4fb7-4db5-993a-14d11868f489" && progress.level > 1) || (progress.level > 9))
      {
        return true;
      }
    }

    return false;
  }

  function isFutureLesson(prevLessonId: string|null)
  {
    if(prevLessonId == null || isDone(prevLessonId))
    {
      return false;
    }

    return true;
  }

    return(
      <>
        <div>
        {
          props.loading === false && props.user?.isTeacher && props.selectedCourse?.id
          ?
            <div className="float-right text-right pr-10">
              <div id="showCode">
                <button
                  onClick={showCode}
                  className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
                >
                  Show Code
                </button>
              </div>
              <div id="code" className="text-black bubble bubble--highlight" hidden></div>
            </div>
          : <></>
        }
          {
          props.loading === false && props.selectedCourse?.id
          ?
          <div className="grid pl-10 pb-8">
            <Listbox value={selectedunit} onChange={setSelectedUnit}>
              <div className="relative mt-1">
                <Listbox.Button className="relative bubble-dropdown bg-white py-2 pl-3 pr-10">
                  <span className="block pr-5"><strong>Unit: </strong> {selectedunit}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-40 overflow-auto bg-white py-1 dropdown">
                    { Array.from(lessons && lessons.sort(l=>l.order), l => l.unit).filter((item, i, ar) => ar.indexOf(item) === i).map((unit: string, Idx: number) => (
                      <Listbox.Option
                        key={unit}
                        className={({ active }) =>
                          `relative select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                          }`
                        }
                        value={unit}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {unit}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          : <></>
        }
        </div>
      {
        props.loading == true
        ? <Loading />
        :
        !props.selectedCourse?.id
        ? <NoClasses isTeacher={props.user.isTeacher}/>
        :
        <>


          {
          lessons == []
          ? <Loading />
          :
            lessons?.sort(l=>l.order).filter(l => l.unit == selectedunit)?.map((lesson: ILesson, idx: number) => (
            <div key={lesson.name} className="pl-10">
              <Link to= {selectedunit == "Blockly" ? "/blockly" : "/problem"}  onClick={() => {
                                            props.setLessonId(lesson.lessonId);
                                          }}>
                <button disabled={isFutureLesson(idx == 0 ? null : lessons[idx-1].lessonId)} className={"bubble bubble-card" + (isDone(lesson.lessonId) ? " bubble-green hover:bg-indigo-700 hover:text-white" : (isFutureLesson(idx == 0 ? null : lessons[idx-1].lessonId) ? " bubble-gray" : " hover:bg-indigo-700 hover:text-white"))}>
                    {lesson.name}
                </button>
              </Link>
            </div>
            ))
          }
        </>
      }
      </>
    );
};

export default Lessons;