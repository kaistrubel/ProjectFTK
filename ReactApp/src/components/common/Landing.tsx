import SignUp from '../../components/common/SignUp';
import Lessons from './Lessons';


function Landing(props: any) {
  
  return (
    <>
    {
        props.user.isAuthenticated === false
        ? <SignUp />
        : <Lessons user={props.user} selectedCourse={props.selectedCourse} />
    }
    </>
  );
}

export default Landing;