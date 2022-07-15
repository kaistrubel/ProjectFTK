import SignUp from '../../components/common/SignUp';
import Lessons from './Lessons';
import Loading from './Loading';


function Landing(props: any) {
  
  return (
    <>
    {
        props.user?.isAuthenticated == false
        ? <SignUp />
        : <Lessons user={props.user} selectedCourse={props.selectedCourse} setLessonId={props.setLessonId} />
    }
    </>
  );
}

export default Landing;