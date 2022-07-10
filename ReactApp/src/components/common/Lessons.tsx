import NoClasses from "./NoClasses";
import { Link } from 'react-router-dom';
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useState } from "react";
import ILesson from "../../types/Lesson";
import LessonApi from "../../apis/lesson";
import Loading from "./Loading";

const Lessons = (props: any) => {

  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [selectedunit, setSelectedUnit] = useState<string>()

  useEffect(() => {
    <Loading />
    props.selectedCourse && LessonApi.getLessons(props.selectedCourse?.courseSlug)
    .then((response) => {
      setLessons(response.data)
      setSelectedUnit(response.data[0].unit) //need to update this to current unit based on userData store
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, [props.selectedCourse]);

    return(
      <>
        <div>
        {
          props?.selectedCourse
          ?
            <div className="float-right text-right sm:px-6">
              <Link to= {props.user?.isTeacher? "/createClass": "/joinClass"}>
                <button
                  type="submit"
                  className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
                >
                  {props.isTeacher? "Create" : "Add"} Class
                </button>
              </Link>
            </div>
          : <></>
        }
          {
          props?.selectedCourse && props.selectedCourse!= ""
          ?
          <div className="grid pl-10 py-10">
            <Listbox value={selectedunit} onChange={setSelectedUnit}>
              <div className="relative mt-1">
                <Listbox.Button className="relative cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate"><strong>Unit: </strong> {selectedunit}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
                  <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto bg-white py-1 sm:text-sm dropdown">
                    { Array.from(lessons && lessons.sort(l=>l.order), l => l.unit).filter((item, i, ar) => ar.indexOf(item) === i).map((unit: string, Idx: number) => (
                      <Listbox.Option
                        key={unit}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
        props.selectedCourse == null
        ? <Loading />
        :
        props.selectedCourse == ""
        ? <NoClasses isTeacher={props.user.isTeacher}/>
        :
        <>


          {
          lessons == []
          ? <Loading />
          :
            lessons?.sort(l=>l.order).filter(l => l.unit == selectedunit)?.map((lesson: ILesson) => (
            <div key={lesson.name} className="pl-10">
              <Link to= "/problem" onClick={() => {
                                            props.setVideoUrl(lesson.problems[0].videos[0].url);
                                            props.setProblemUrl(lesson.problems[0].url);
                                          }}>
                <div className="bubble bubble-card hover:bg-indigo-700 hover:text-white">
                    {lesson.name}
                </div>
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