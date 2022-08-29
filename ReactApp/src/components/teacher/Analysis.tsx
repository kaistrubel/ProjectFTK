import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Avatar, Badge, TableFooter, Pagination, Button} from '@windmill/react-ui'
import { useMemo, useState } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import LessonApi from "../../apis/lesson";
import { IStudentAnalysis } from "../../types/User";
import Loading from '../common/Loading';
import { TrashIcon } from '@heroicons/react/solid';
import ClassApi from '../../apis/class';
import { useNavigate } from 'react-router-dom';
import NoClasses from '../common/NoClasses';

const Dashboard = (props: any) => {

  const [analysis, setAnalysis] = useState<IStudentAnalysis[]>([]);
  const [statusData, setStatusData] = useState<number[]>();
  const [lessonLabels, setLessonLabels] = useState<string[]>();
  const [lessonData, setLessonData] = useState<number[]>();
  const [labLabels, setLabLabels] = useState<string[]>();
  const [labData, setLabData] = useState<number[]>();
  const statusOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    }
  }

    const currentOptions = {
    plugins: {
      legend: {
        display: false
      },
    }
  }

  function removeStudent(studentEmail: string)
  {
    if(window.confirm(`Are you sure you want to remove ${studentEmail} from ${props.selectedCourse?.displayName}?`))
    {
      ClassApi.removeStudent(props.selectedCourse?.id, studentEmail)
      .then((response) => {
      if(response.status === 200){
        ClassApi.getCurrentClasses()
        .then((response) => {
          props.setSelectedCourse(response.data.filter(x=>x.id == props.selectedCourse?.id)[0])
        })
        .catch((e: Error) => {
          console.log(e);
        });
        }
      })
    }
  }

  useMemo(() => {
        props.selectedCourse?.courseSlug && LessonApi.getStudentAnalysis(props.selectedCourse?.courseSlug, props.selectedCourse?.users)
        .then((response) => {
          console.log(response.data)
            setAnalysis(response.data)
            setStatusData([response.data.filter(x=>x.status == "Behind").length, response.data.filter(x=>x.status == "Warning").length, response.data.filter(x=>x.status == "OnTrack").length])
            setLessonLabels(Object.keys(response.data.reduce((a, c) => (a[c.lesson] = (a[c.lesson] || 0) + 1, a), Object.create(null))))
            setLessonData(Object.values(response.data.reduce((a, c) => (a[c.lesson] = (a[c.lesson] || 0) + 1, a), Object.create(null))))
            setLabLabels(Object.keys(response.data.reduce((a, c) => (a[c.lab] = (a[c.lab] || 0) + 1, a), Object.create(null))))
            setLabData(Object.values(response.data.reduce((a, c) => (a[c.lab] = (a[c.lab] || 0) + 1, a), Object.create(null))))
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }, [props.selectedCourse])

    return (
      props.loading == true || props.selectedCourse?.id == null
      ? <Loading />
      :
      props.selectedCourse?.id == ""
      ? <NoClasses isTeacher={true}/>
      :
      <>
      <div className="grid pt-10 center">
      <div className="w-5/6 grid p-4 center bg-zinc-900">
      <div className="w-2/6 p-4 bg-white shadow-xs bg-zinc-900 border-r-2 border-white">
        <Doughnut data={{
            datasets: [
                {
                data: statusData,
                /**
                 * These colors come from Tailwind CSS palette
                 * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
                 */
                backgroundColor: ['#991b1b', '#f97316', '#166534'],
                label: 'Split',
                },
            ],
            labels: ['Behind', 'Warning', 'OnTrack'],
        }} options={statusOptions}/>
      
      
      </div>
      <div className="w-4/6 p-4 bg-white rounded-lg shadow-xs bg-zinc-900 h-full">
        <p className="font-semibold text-gray-800 dark:text-gray-300">Recs</p>
      </div>
      </div>
      </div>
      <div className="grid pt-10 gap-5 center">
        <div className="w-5/12 p-4 bg-white rounded-lg shadow-xs bg-zinc-900">
            <p className=" center mb-4 font-semibold text-gray-800 dark:text-gray-300">Lessons</p>
            <Bar data={{
                    labels: lessonLabels,
                    datasets: [
                      {
                        backgroundColor: '#550bb3',
                        borderWidth: 2,
                        borderColor: '#fff',
                        data: lessonData,
                      },
                    ],
            }} options={currentOptions}/>
        </div>
        <div className="w-5/12 p-4 bg-white rounded-lg shadow-xs bg-zinc-900">
            <p className=" center mb-4 font-semibold text-gray-800 dark:text-gray-300">Labs</p>
            <Bar data={{
                    labels: labLabels,
                    datasets: [
                      {
                        backgroundColor: '#3878a8',
                        borderWidth: 2,
                        borderColor: '#fff',
                        data: labData,
                      },
                    ],
            }} options={currentOptions}/>
        </div>
      </div>
      <div className='center py-10'>
        <TableContainer className='w-5/6'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white text-sm'>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current Lesson</TableCell>
                    <TableCell>Current Lab</TableCell>
                    <TableCell>Time Spent</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                {analysis.map((student: IStudentAnalysis) => (
                <TableRow key={student.name} className='bg-zinc-900 text-white'>
                    <TableCell>
                        <div className="flex items-center text-md">
                            <Avatar src={student.photoUrl} alt={student.name} />
                            <span className="font-semibold ml-2">{student.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge type="success" className={
                            student.status == "Behind" ? 'bg-red-800'
                            : student.status == "Warning" ? 'bg-orange-500'
                            : 'bg-green-800'
                        }>{student.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <span className="text-md">{student.lesson}</span>
                    </TableCell>
                    <TableCell>
                        <span className="text-md">{student.lab}</span>
                    </TableCell>
                    <TableCell>
                        <span className="text-md">{student.time}</span>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => removeStudent(student.email)} aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TableCell>
                </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
      </div>
      </>
  );
};

export default Dashboard;