import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Avatar, Badge, TableFooter, Pagination, Button} from '@windmill/react-ui'
import { Tab } from '@headlessui/react'
import { useState } from 'react';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function LectureTable(type: string)
{
  return(
    <>
      <div className='center pt-20'>
        <TableContainer className='w-full'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white text-sm'>
                    <TableCell>My {type}s</TableCell>
                    <TableCell> 
                      <Button onClick={() => void 0} className="bg-white hover:bg-black hover:text-white float-right" layout="link" size="small" aria-label="Add">
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
    </>
  );
};

const AddLectures = () => {

  const tabs = [`Problems`,`Videos`, `Notes`]

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
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  {LectureTable("Problem")}
                </Tab.Panel>
                <Tab.Panel>{LectureTable("Video")}</Tab.Panel>
                <Tab.Panel>{LectureTable("Note")}</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
  );
};

export default AddLectures;