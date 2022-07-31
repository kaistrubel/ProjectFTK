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

const Dashboard = (props: any) => {

  const [analysis, setAnalysis] = useState<IStudentAnalysis[]>([]);
  const [statusData, setStatusData] = useState<number[]>();
  const [currentLabels, setCurrentLabels] = useState<string[]>();
  const [currentData, setCurrentData] = useState<number[]>();
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
        props.selectedCourse?.courseSlug && LessonApi.getStudentAnalysis(props.selectedCourse?.courseSlug, props.selectedCourse?.startDate, props.selectedCourse?.users)
        .then((response) => {
            setAnalysis(response.data)
            setStatusData([response.data.filter(x=>x.status == "Behind").length, response.data.filter(x=>x.status == "Warning").length, response.data.filter(x=>x.status == "OnTrack").length])
            setCurrentLabels(Object.keys(response.data.reduce((a, c) => (a[c.current] = (a[c.current] || 0) + 1, a), Object.create(null))))
            setCurrentData(Object.values(response.data.reduce((a, c) => (a[c.current] = (a[c.current] || 0) + 1, a), Object.create(null))))
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }, [props.selectedCourse])

    return (
        props.loading == true
        ? <Loading />
        :
      <>
      <div className="grid pt-10 gap-20 center">
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-xs bg-zinc-900">
            <p className=" center mb-4 font-semibold text-gray-800 dark:text-gray-300">Status</p>
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
        <div className="w-1/2 p-4 bg-white rounded-lg shadow-xs bg-zinc-900">
            <p className=" center mb-4 font-semibold text-gray-800 dark:text-gray-300">Current</p>
            <Bar data={{
                    labels: currentLabels,
                    datasets: [
                      {
                        backgroundColor: '#a434eb',
                        borderWidth: 2,
                        borderColor: '#fff',
                        data: currentData,
                      },
                    ],
            }} options={currentOptions}/>
        </div>
      </div>
      <div className='center pt-20'>
        <TableContainer className='w-3/4'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white text-sm'>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current</TableCell>
                    <TableCell>Time Spent</TableCell>
                    <TableCell></TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                {analysis.map((student: IStudentAnalysis) => (
                <TableRow key={student.name} className='bg-zinc-900 text-white'>
                    <TableCell>
                        <div className="flex items-center text-md">
                            <Avatar src={student.pictureUrl} alt={student.name} />
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
                        <span className="text-md">{student.current}</span>
                    </TableCell>
                    <TableCell>
                        <span className="text-md">{student.time}</span>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => removeStudent(student.email)} layout="link" size="small" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
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