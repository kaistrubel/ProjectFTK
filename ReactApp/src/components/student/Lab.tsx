import { Fragment, useMemo, useState } from "react";
import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Button } from '@windmill/react-ui'
import {Dialog, Transition  } from '@headlessui/react'
import UserApi from "../../apis/user";
import {LabProg} from "../../types/User";
import {PlusCircleIcon, XCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';

const Lab = (props: any) => {

  let [modalIsOpen, setModalIsOpen] = useState(false)
  let [iframeModalIsOpen, setIframeModalIsOpen] = useState(false)
  let [frameUrl, setFrameUrl] = useState<string>("")
  let [frameLoaded, setFrameLoaded] = useState<boolean>(false)
  let [url, setUrl] = useState<string>("")
  const [manualUrl, setManualUrl] = useState<string>();
  const [submissionName, setSubmissionName] = useState<string>();
  const [submissionIdx, setSubmissionIdx] = useState<number>(0);
  const [labProg, setLabProg] = useState<LabProg>();

  function addOrUpdateSubmission(state: string) {
    props.user?.labProgList && labProg && UserApi.updateUserLabProg(props.user.labProgList, labProg.name, submissionIdx, url, state)
      .then((response) => 
      {
        if(response.status !== 200){
          window.alert('An Error Occured')
        }
        else
        {
          setModalIsOpen(false);
          window.location.href = "/lab";
        }
      })
    }

  useMemo(() => {
  var userProg = props.user?.labProgList?.find((x: { name: string; }) => x.name == props.selectedLab.name);
  console.log(props.user)
  setLabProg(userProg ?? new LabProg(props.selectedLab.name, []))
  setManualUrl(props.selectedLab.manualUrl)

  }, [props.selectedLab, props.user]);

  return (
    <>
      <div className="grid place-items-center pt-16 pb-10">
        <iframe id="LabManual" src={manualUrl} title="LabManual" ></iframe>
      </div>
      {Array.from(props.selectedLab.submissions as string[] ?? []).map((submission:string, idx: number) => (
      <div key={submission} className='center pt-5'>
        <TableContainer className='w-3/4'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white text-sm'>
                    <TableCell>{submission}</TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className='bg-zinc-900 text-white'>
                    { labProg?.submissions && labProg?.submissions?.length > idx ?
                    <TableCell>
                    <button onClick={() => {
                        setFrameUrl(labProg?.submissions[idx].url)
                        setIframeModalIsOpen(true)
                        }} className="text-md hover:text-blue-500">{labProg?.submissions[idx].url}
                    </button>
                    {labProg.submissions[idx].state == "NeedsGrading" ? 
                    <button onClick={() => {
                        setSubmissionIdx(idx)
                        setSubmissionName(submission)
                        setModalIsOpen(true)
                        }} className="pl-1 align-middle text-orange-500" aria-label="Edit">
                        <ExclamationCircleIcon className="w-5 h-5 float-left" aria-hidden="true" /> (waiting to be graded)
                    </button>
                    :
                    <button onClick={() => {
                        setSubmissionIdx(idx)
                        setSubmissionName(submission)
                        setModalIsOpen(true)
                        }} className="pl-1 align-middle text-red-500" aria-label="Edit">
                        <XCircleIcon className="w-5 h-5 float-left" aria-hidden="true" /> (needs to be fixed)
                    </button>
                    }
                    </TableCell>
                    :
                    <TableCell> 
                      <Button onClick={() => {
                        setSubmissionIdx(idx)
                        setSubmissionName(submission)
                        setModalIsOpen(true)
                        }} className="bg-white hover:bg-black hover:text-white float-left" layout="link" size="small" aria-label="Add">
                      <PlusCircleIcon className="w-5 h-5 pr-5" aria-hidden="true" /> Add Submission
                      </Button>
                    </TableCell>
                    }
                  </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
      </div>
      ))}

    <Transition appear show={modalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setModalIsOpen(false)}>
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
                    {submissionName}
                  </Dialog.Title>
                  <div className="col-span-6 sm:col-span-3 pt-5">
                    <label htmlFor="url" className="block font-medium text-white">
                      MakeCode Url
                    </label>
                    <input
                      required
                      type="text"
                      name="url"
                      id="url"
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                <div className="py-3 text-right">
                <button
                  onClick={() => addOrUpdateSubmission("NeedsGraded")}
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
        <Dialog as="div" className="relative z-10" onClose={() => 
            {
                setIframeModalIsOpen(false)
                setFrameLoaded(false)
            }}>
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
                  <iframe className='m-auto' src={frameUrl} title="Lecture" hidden onLoad={() => setFrameLoaded(true)}></iframe>
                  {props.user?.isTeacher && frameLoaded ?
                    <div className="h-16 flex pt-2 gap-2">
                        <div className="w-1/2 bg-green-500 center cursor-pointer" onClick={() => alert('here')}><CheckCircleIcon className="w-10 h-10" aria-hidden="true" /></div>
                        <div className="w-1/2 bg-red-500 center cursor-pointer" onClick={() => alert('here')}><XCircleIcon className="w-10 h-10" aria-hidden="true" /></div>
                    </div>
                    :
                    <></>
                  }

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
    </Transition>
    </>
  );
};

export default Lab;