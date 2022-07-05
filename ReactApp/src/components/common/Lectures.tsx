import { useEffect, useState } from "react";
import ClassApi from "../../apis/class";
import ICourse from "../../types/Course";
import IUserInfo from "../../types/User";
import NoClasses from "./NoClasses";

const Lectures = (props: any) => {

  const [course, setCourse] = useState<ICourse[]>([]);

  useEffect(() => {
    ClassApi.getCurrentClasses()
    .then((response) => {
      setCourse(response.data);
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);
  
  if(course.length == 0)
  {
    return(
      <NoClasses isTeacher={props.user.isTeacher}/>
    );
  }
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          This view to be used as cards showing lectures to click into.
        </div>
      </div>
  );
};

export default Lectures;