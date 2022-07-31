import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Avatar, Badge, TableFooter, Pagination, Button} from '@windmill/react-ui'
import { Tab } from '@headlessui/react'
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid';

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
                    <TableCell>My {type}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className='bg-zinc-900 text-white'>
                    <TableCell>
                      <span className="text-md">URL</span>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => void 0} className="float-right" layout="link" size="small" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
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
                    <TableCell>Public {type}</TableCell>
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
              <Tab.List className="flex space-x-1 rounded-xl bg-black p-1">
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
                  {LectureTable("Problems")}
                </Tab.Panel>
                <Tab.Panel>{LectureTable("Videos")}</Tab.Panel>
                <Tab.Panel>{LectureTable("Notes")}</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
  );
};

export default AddLectures;