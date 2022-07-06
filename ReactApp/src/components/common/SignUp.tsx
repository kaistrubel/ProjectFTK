const SignUp = () => {
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          Welcome to <strong>Project FTK.</strong>
        </div>
        <div className="container flex items-start justify-between flex-col lg:flex-row signup" id="signup">
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/teacher_signin.png')] comic-border bg-auto">
          <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
            <div className="relative title">Teachers</div>
            <div className="relative -bottom-40">
              <a
                className="bubble bubble--highlight"
                href="https://projectftk.com/Auth/GoogleLogin?isTeacher=true"
              >Sign in with Google</a>
            </div>
          </div>

          </div>
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/student_signin.png')] comic-border bg-auto">
            <div className="grid grid-rows-[100px_minmax(200px,_1fr)_100px] place-items-center">
              <div className="relative title">Students</div>
              <div className="relative -bottom-40">
                  <a
                    className="bubble bubble--highlight"
                    href="https://projectftk.com/Auth/GoogleLogin"
                  >Sign in with Google</a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignUp;