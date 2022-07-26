import {TableContainer,Table,TableHeader,TableBody,TableRow,TableCell, Avatar, Badge, TableFooter, Pagination} from '@windmill/react-ui'
import { useMemo, useState } from "react";
import LessonApi from "../../apis/lesson";
import { IStudentAnalysis } from "../../types/User";

const Analysis = (props: any) => {

  const [analysis, setAnalysis] = useState<IStudentAnalysis[]>([]);
  
  useMemo(() => {
        props.selectedCourse?.courseSlug && LessonApi.getStudentAnalysis(props.selectedCourse?.courseSlug, props.selectedCourse?.startDate, props.selectedCourse?.users)
        .then((response) => {
            setAnalysis(response.data)
            console.log(response.data)
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }, [])

    return (
      <>
      <div className='center pt-20'>
        <TableContainer className='w-3/4'>
            <Table>
                <TableHeader>
                <TableRow className='bg-zinc-900 text-white'>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current</TableCell>
                    <TableCell>Time Spent</TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                {analysis.map((student: IStudentAnalysis) => (
                <TableRow className='bg-zinc-900 text-white'>
                    <TableCell>
                        <div className="flex items-center text-sm">
                            <Avatar src={student.pictureUrl} alt={student.name} />
                            <span className="font-semibold ml-2">{student.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge type="success" className={
                            student.status == "Behind" ? 'bg-red-800'
                            : student.status == "Warning" ? 'bg-orange-700'
                            : 'bg-green-800'
                        }>{student.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <span className="text-sm">{student.current}</span>
                    </TableCell>
                    <TableCell>
                        <span className="text-sm">{student.time}</span>
                    </TableCell>
                </TableRow>
                ))}
                </TableBody>
            </Table>
            <TableFooter className='text-white'>
                <Pagination totalResults={analysis.length} resultsPerPage={10} onChange={() => {}} label="Table navigation" />
            </TableFooter>
        </TableContainer>
      </div>
      </>
  );
};

export default Analysis;