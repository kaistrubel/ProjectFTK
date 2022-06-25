import teacherPng from '../../assets/images/teacher_signin.png'; 
import studentPng from '../../assets/images/student_signin.png'; 

const SignUp = () => (
    <div className="grid place-items-center">
      <div className="bubble bubble-header">
        Welcome to <strong>Project FTK.</strong>
      </div>
      <div className="container py-16 flex items-start justify-between flex-col lg:flex-row" id="student">
        <div className="flex-1 w-full md:w-1/2">
          <img src={teacherPng} className="comic-border object-cover h-96 w-192" alt="Teacher Signup" />
        </div>
        <div className="flex-1 w-full md:w-1/2">
          <img src={studentPng} className="comic-border comic-border-no-left object-cover h-96 w-192" alt="Student Signup" />
        </div>
      </div>
    </div>
);

export default SignUp;