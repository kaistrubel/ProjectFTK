import teacherPng from '../../assets/images/teacher_signin.png'; 
import studentPng from '../../assets/images/student_signin.png';

const SignUp = () => (
    <div className="grid place-items-center pt-16">
      <div className="bubble bubble-header">
        Welcome to <strong>Project FTK.</strong>
      </div>
      <div className="container flex items-start justify-between flex-col lg:flex-row" id="signup">
        <div className="flex-1 w-full lg:w-1/2">
          <div className="grid place-items-center">
            <div className="bubble">
              Teachers
            </div>
          <img src={teacherPng} className="comic-border object-cover h-96 w-192" style={{zIndex:-10}} alt="Teacher Signup" />
          <a
              className="bubble bubble--highlight"
              href="https://projectftk.com/Auth/GoogleLogin?isTeacher=true"
            >Sign in with Google</a>
          </div>
        </div>
        <div className="flex-1 w-full lg:w-1/2">
          <div className="grid place-items-center">
            <div className="bubble">
              Students
            </div>
            <img src={studentPng} className="comic-border object-cover h-96 w-192" style={{zIndex:-10}} alt="Student Signup" />
            <a
              className="bubble bubble--highlight"
              href="https://projectftk.com/Auth/GoogleLogin"
            >Sign in with Google</a>
          </div>
        </div>
      </div>
    </div>
);

export default SignUp;