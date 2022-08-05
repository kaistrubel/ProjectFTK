import { useNavigate } from 'react-router-dom';
import SignUp from '../../components/common/SignUp';

function Landing(props: any) {
  const navigate = useNavigate();
  
  return (
    <>
    {
        props.user?.isAuthenticated != true
        ? <SignUp />
        : props.user?.isTeacher
        ? navigate('/dashboard')
        : navigate('/lessons')
    }
    </>
  );
}

export default Landing;