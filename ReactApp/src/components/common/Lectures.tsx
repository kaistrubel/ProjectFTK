import NoClasses from "./NoClasses";
import { Link } from 'react-router-dom';

const Lectures = (props: any) => {
    return(
      <>
        <div className="px-4 text-right sm:px-6">
          <Link to= {props.user.isTeacher? "/createClass": "/joinClass"} replace={true}>
            <button
              type="submit"
              className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
            >
              {props.isTeacher? "Create" : "Add"} Class
            </button>
          </Link>
        </div>
      {
        props.courses.length === 0
        ? <NoClasses isTeacher={props.user.isTeacher}/>
        : 
        <div className="grid place-items-center pt-16">
          <div className="bubble bubble-header">
          In Development. Going to see lectures for {props.selectedCourse?.displayName}
          </div>
        </div>
      }
      </>
    );
};

export default Lectures;