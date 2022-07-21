import { useMemo, useState } from "react";
import LessonApi from "../../apis/lesson";
import { IStudentAnalysis } from "../../types/User";

const Analysis = (props: any) => {

  const [analysis, setAnalysis] = useState<IStudentAnalysis[]>([]);
  
  useMemo(() => {
        props.selectedCourse?.courseSlug && LessonApi.getStudentAnalysis(props.selectedCourse?.courseSlug, props.selectedCourse?.startDate, props.selectedCourse.students)
        .then((response) => {
            setAnalysis(response.data)
            console.log(response.data[0].name)
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }, [])

    return (
      <>

      </>
  );
};

export default Analysis;