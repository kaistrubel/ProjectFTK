import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Button } from '@windmill/react-ui'
import { Tab, Dialog, Transition  } from '@headlessui/react'
import { Fragment, useState } from 'react';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/solid';
import LessonApi from '../../apis/lesson';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function LectureTable(type: string, lessonId:string, level:number)
{
  let [isOpen, setIsOpen] = useState(false)
  let [url, setUrl] = useState<string>("")

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const addToLesson = (type:string) => {
    if(type == "Problem")
    {
      LessonApi.addProblem(lessonId, url, level)
      .then((response) => 
      {
        if(response.status !== 200){
          window.confirm('An Error Occured')
        }
        else
        {
          closeModal();
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
          window.confirm('An Error Occured')
        }
        else
        {
          closeModal();
        }
      })
    }
    else
    {
      LessonApi.addNotes(lessonId, url, level)
      .then((response) => 
      {
        if(response.status !== 200){
          window.confirm('An Error Occured')
        }
        else
        {
          closeModal();
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
                    <TableCell> 
                      <Button onClick={openModal} className="bg-white hover:bg-black hover:text-white float-right" layout="link" size="small" aria-label="Add">
                      <PlusCircleIcon className="w-5 h-5 pr-5" aria-hidden="true" /> Add a {type}
                      </Button>
                    </TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className='bg-zinc-900 text-white'>
                    <TableCell>
                      <span className="text-md">URL</span>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => void 0} className="float-right" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TableCell>
                  </TableRow>
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
                </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className='bg-zinc-900 text-white'>
                    <TableCell>
                      <span className="text-md">URL</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    <p className="text-sm text-gray-300">
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
                  onClick={() => addToLesson(type)}
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
                <Tab.Panel>
                  {LectureTable(tab, props.lessonId, props.level)}
                </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
  );
};

export default AddLectures;