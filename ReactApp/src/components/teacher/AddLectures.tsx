import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Button } from '@windmill/react-ui'
import { Tab, Dialog, Transition  } from '@headlessui/react'
import React, { Fragment, useState } from 'react';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/solid';
import LessonApi from '../../apis/lesson';
import { ILecture, IProblem } from '../../types/Lesson';
import IUser from '../../types/User';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function LectureTable(type: string, user: IUser, lessonId:string, level:number, videos: ILecture[], notes: ILecture[], problems: IProblem[])
{
  let [addModalIsOpen, setaddModalIsOpen] = useState(false)
  let [iframeModalIsOpen, setIframeModalIsOpen] = useState(false)
  let [frameUrl, setFrameUrl] = useState<string>("")

  let [url, setUrl] = useState<string>("")

  function addToLesson() {
    if(type == "Problem")
    {
      LessonApi.addProblem(lessonId, url, level)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
        else
        {
          setaddModalIsOpen(false);
          window.location.href = "/blockly";
        }
      })
    }
    else if(type == "Video")
    {
      LessonApi.addVideo(lessonId, url, level)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
        else
        {
          setaddModalIsOpen(false)
        }
      })
    }
    else
    {
      LessonApi.addNotes(lessonId, url, level)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
        else
        {
          setaddModalIsOpen(false);
        }
      })
    }
  }

  function removeFromLesson(deleteUrl: string) {

    if(window.confirm(`You are about to delete this ${type}. Are you sure? \n You will need to refresh for this to take effect`) != true)
    {
      return;
    }

    if(type == "Problem")
    {
      LessonApi.removeProblem(lessonId, deleteUrl)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
      })
    }
    else if(type == "Video")
    {
      LessonApi.removeVideo(lessonId, deleteUrl)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
      })
    }
    else
    {
      LessonApi.removeNotes(lessonId, deleteUrl)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
      })
    }
  }

  return(
    <>
      <div className='center pt-5'>
        <TableContainer className='w-full'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white text-sm'>
                    <TableCell>My {type}s</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell> 
                      <Button onClick={() => setaddModalIsOpen(true)} className="bg-white hover:bg-black hover:text-white float-right" layout="link" size="small" aria-label="Add">
                      <PlusCircleIcon className="w-5 h-5 pr-5" aria-hidden="true" /> Add a {type}
                      </Button>
                    </TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {type=="Problem" ? 
                  Array.from(problems ?? []).filter(x=>x.author == user.email).map((problem: IProblem, idx:number) => (
                    <TableRow key={problem.url} className='bg-zinc-900 text-white'>
                    <TableCell>
                      <button onClick={() => {
                        setFrameUrl(problem.url)
                        setIframeModalIsOpen(true)
                        }} className="text-md">{problem.url}</button>
                    </TableCell>
                    <TableCell>{problem.gain}</TableCell>
                    <TableCell>
                      <button onClick={() => removeFromLesson(problem.url)} className="float-right" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
                  : Array.from(type=="Video" ? videos ?? [] : notes ?? []).filter(x=>x.author == user.email).map((lecture: ILecture, idx:number) => (
                    <TableRow key={lecture.url} className='bg-zinc-900 text-white'>
                    <TableCell>
                      <button onClick={() => {
                        setFrameUrl(lecture.url)
                        setIframeModalIsOpen(true)
                        }} className="text-md">{lecture.url}</button>
                    </TableCell>
                    <TableCell>{lecture.gain}</TableCell>
                    <TableCell>
                      <button onClick={() => removeFromLesson(lecture.url)} className="float-right" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
      </div>

      <div className='center pt-10'>
        <TableContainer className='w-full'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white text-sm'>
                    <TableCell>Public {type}s</TableCell>
                    <TableCell>Rate</TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                {type=="Problem" ? 
                  Array.from(problems?? []).filter(x=>x.author != user.email).map((problem: IProblem, idx:number) => (
                    <TableRow key={problem.url} className='bg-zinc-900 text-white'>
                    <TableCell>
                      <button onClick={() => {
                        setFrameUrl(problem.url)
                        setIframeModalIsOpen(true)
                        }} className="text-md">{problem.url}</button>
                    </TableCell>
                    <TableCell>{problem.gain}</TableCell>
                    <TableCell>
                      <button onClick={() => void 0} className="float-right" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
                  :Array.from(type=="Video" ? videos ?? [] : notes ?? []).filter(x=>x.author != user.email).map((lecture: ILecture, idx:number) => (
                    <TableRow key={lecture.url} className='bg-zinc-900 text-white'>
                    <TableCell>
                      <button className="text-md">{lecture.url}</button>
                    </TableCell>
                    <TableCell>{lecture.gain}</TableCell>
                    <TableCell>
                      <button onClick={() => void 0} className="float-right" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
      </div>

      <Transition appear show={addModalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setaddModalIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Add a {type}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-gray-300">
                      {type != `Problem` ? 
                      `This ${type} lecture will be used for this this lesson for level ${level} and higher. Currently we only support ${type == `Video` ? `YouTube` : `Google Docs`}`
                      :`Please enter the url for the level ${level} problem.`}.
                    </p>
                  </div>

                  <div className="col-span-6 sm:col-span-3 pt-5">
                    <label htmlFor="period" className="block font-medium text-white">
                      {type} Url
                    </label>
                    <input
                      required
                      type="text"
                      name="period"
                      id="period"
                      autoComplete="period"
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                <div className="py-3 text-right">
                <button
                  onClick={() => addToLesson()}
                  type="submit"
                  className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
                >
                  Submit
                </button>
                </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={iframeModalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIframeModalIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-fit transform overflow-hidden rounded-2xl align-middle shadow-xl transition-all">
                  <iframe className='m-auto' id="iframe" src={frameUrl} title="Lecture" hidden></iframe>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const AddLectures = (props: any) => {

  const tabs = [`Video`,`Note`, `Problem`]
    return (
        <>
          <div className="w-3/4 m-auto px-2 py-16 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-zinc-900 p-1">
                {tabs.map(tab => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 leading-5',
                        selected
                          ? 'bg-white shadow'
                          : 'text-white hover:bg-white/[0.12]'
                      )
                    }
                  >
                    {tab}s
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
              {tabs.map(tab => (
                <Tab.Panel key={tab}>
                  {LectureTable(tab, props.user, props.lessonId, props.level, props.videos, props.notes, props.problems)}
                </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
  );
};

export default AddLectures;