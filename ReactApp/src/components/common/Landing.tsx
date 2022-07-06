import SignUp from '../../components/common/SignUp';
import Lectures from '../../components/common/Lectures';


function Landing(props: any) {
  
  return (
    <>
    {
        props.user.isAuthenticated === false
        ? <SignUp />
        : <Lectures user={props.user} courses={props.courses} selectedCourse={props.selectedCourse} />
    }
    </>
  );
}

export default Landing;