import SignUp from '../../components/common/SignUp';
import Lessons from './Lessons';


function Landing(props: any) {
  
  return (
    <>
    {
        props.user.isAuthenticated === false
        ? <SignUp />
        : <Lessons user={props.user} selectedCourse={props.selectedCourse} setProblemUrl={props.setProblemUrl} setVideoUrl={props.setVideoUrl} />
    }
    </>
  );
}

export default Landing;