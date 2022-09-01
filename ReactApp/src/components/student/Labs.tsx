import NoClasses from "../common/NoClasses";
import { Link } from 'react-router-dom';
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useMemo, useState } from "react";
import {ILessonInfo} from "../../types/Lesson";
import Loading from "../common/Loading";
import { useLocalStorage } from "../localStorage";
import { ILab } from "../../types/Lab";
import LabApi from "../../apis/lab";

const Labs = (props: any) => {

  const [labs, setLabs] = useState<ILab[]>([]);
  const [selectedunit, setSelectedUnit] = useLocalStorage<string>("selectedunit");

  useMemo(() => {
    props.selectedCourse?.courseSlug && LabApi.getLabInfo(props.selectedCourse?.courseSlug)
    .then((response) => {
      setLabs(response.data)
      if(props.selectedLab == null)
      {
        response.data[0] && props.setSelectedLab(response.data[0]) //need to update this to current unit based on userData store
      }
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, [props.selectedCourse]);

  function isDone(labName: string)
  {
    var progress = props.user.labProgList?.find((x: { name: string; }) => x.name == labName);
    if(progress?.submissions?.length == labs.find(x=>x.name == labName)?.submissions.length)
    {
        return true;
    }
    return false;
  }

  function isFutureLesson(prevLabName: string|null)
  {
    if(prevLabName == null || isDone(prevLabName) || props.user?.isTeacher)
    {
      return false;
    }

    return true;
  }

    return(
      <>
        <div>
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
                    { Array.from(labs && labs.sort(l=>l.order), l => l.unit).filter((item, i, ar) => ar.indexOf(item) === i).map((unit: string, Idx: number) => (
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
        props.loading == true || props.selectedCourse?.id == null
        ? <Loading />
        :
        props.selectedCourse?.id == ""
        ? <NoClasses isTeacher={props.user.isTeacher}/>
        :
        <>
          {
          labs === undefined || labs.length == 0
          ? <Loading />
          :
            labs?.sort(l=>l.order).filter(l => l.unit == selectedunit)?.map((lab: ILab, idx: number) => (
            <div key={lab.name} className="pl-10">
              <Link to= {"/lab"}  onClick={() => {
                                            props.setSelectedLab(lab);
                                          }}>
                <button disabled={isFutureLesson(idx == 0 ? null : labs[idx-1].name)} className={"bubble bubble-card" + (isDone(lab.name) ? " bubble-green hover:bg-indigo-700 hover:text-white" : (isFutureLesson(idx == 0 ? null : labs[idx-1].name) ? " bubble-gray" : " hover:bg-indigo-700 hover:text-white"))}>
                    {lab.name}
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

export default Labs;