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
        <TableContainer>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Current</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time Spent</TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                {analysis.map((student: IStudentAnalysis) => (
                <TableRow>
                    <TableCell>
                        <div className="flex items-center text-sm">
                            <Avatar src={student.pictureUrl} alt={student.name} />
                            <span className="font-semibold ml-2">{student.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge type="success">{student.status}</Badge>
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
            <TableFooter>
                <Pagination totalResults={10} resultsPerPage={4} onChange={() => {}} label="Table navigation" />
            </TableFooter>
        </TableContainer>
      </>
  );
};

export default Analysis;