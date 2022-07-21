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
        <h1>ello world</h1>
      </>
  );
};

export default Analysis;