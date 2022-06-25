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
          <img src={teacherPng} className="comic-border object-cover h-96 w-192" alt="Teacher Signup" />
          <button type="button" className="bubble bubble--highlight" >
              Sign in with Google
            </button>
          </div>
        </div>
        <div className="flex-1 w-full lg:w-1/2">
          <div className="grid place-items-center">
            <div className="bubble">
              Students
            </div>
            <img src={studentPng} className="comic-border object-cover h-96 w-192" alt="Student Signup" />
            <button type="button" className="bubble bubble--highlight" >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
);

export default SignUp;