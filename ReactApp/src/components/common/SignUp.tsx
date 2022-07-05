const SignUp = () => {
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          Welcome to <strong>Project FTK.</strong>
        </div>
        <div className="container flex items-start justify-between flex-col lg:flex-row signup" id="signup">
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/teacher_signin.png')] comic-border bg-contain lg:h-96">
          <div className="grid grid-rows-[100px_minmax(300px,_1fr)_100px] place-items-center">
            <div className="title">Teachers</div>
            <div className="row-span-4">
              <a
                className="bubble bubble--highlight"
                href="https://projectftk.com/Auth/GoogleLogin?isTeacher=true"
              >Sign in with Google</a>
            </div>
          </div>

          </div>
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/student_signin.png')] comic-border bg-contain lg:h-96">
            <div className="grid grid-rows-[100px_minmax(300px,_1fr)_100px] place-items-center">
              <div className="row-span-1 title">Students</div>
              <div className="row-span-4 ...">
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