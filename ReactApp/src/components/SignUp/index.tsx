import teacherPng from '../../assets/images/teacher_signin.png'; 
import studentPng from '../../assets/images/student_signin.png'; 

const SignUp = () => (
    <div className="container py-16 flex items-start justify-between flex-col lg:flex-row" id="student">
      <div className="flex-1 w-full md:w-1/2 border-2 border-white">
        <img src={teacherPng} className="comic-border" alt="Teacher Signup" />
        <div className="bubble" style={{alignContent : "center"}}>
          Welcome to <strong>Project FTK.</strong>
        </div>
      </div>
      <div className="flex-1 w-full md:w-1/2 border-2 border-white">
        <img src={studentPng} className="comic-border" alt="Student Signup" />
      </div>
    </div>
);

export default SignUp;