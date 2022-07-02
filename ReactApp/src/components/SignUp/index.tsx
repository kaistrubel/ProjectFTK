import IUserInfo from '../../types/User';
import { useState, useEffect } from "react";
import UserService from '../../apis/user';

const SignUp = () => {
  const initialUserState = {
    name: "",
    email: "",
    pictureUrl: "",
    roles: [""],
    isAuthenticated: false,
  };

  const [user, setUser] = useState<IUserInfo>(initialUserState);


  useEffect(() => {
    UserService.get()
    .then((response) => {
      setUser(response.data);
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);

  if(user.isAuthenticated == true)
  {
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          Welcome to <strong>Project FTK.</strong>
          <p> Is this {user.name}?</p>
        </div>
        <div className="row-span-4">
              <a
                className="bubble bubble--highlight"
                href="https://projectftk.com/Auth/GoogleSignOut"
              >SignOut</a>
            </div>
      </div>
  );
  }
  else
  {
    return (
      <div className="grid place-items-center pt-16">
        <div className="bubble bubble-header">
          Welcome to <strong>Project FTK.</strong>
        </div>
        <div className="container flex items-start justify-between flex-col lg:flex-row" id="signup">
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/teacher_signin.png')] comic-border bg-cover h-96 w-384">
          <div className="grid grid-rows-5 place-items-center">
            <div className="row-span-1 title">Teachers</div>
            <div className="row-span-4">
              <a
                className="bubble bubble--highlight"
                href="https://projectftk.com/Auth/GoogleLogin?isTeacher=true"
              >Sign in with Google</a>
            </div>
          </div>

          </div>
          <div className="flex-1 w-full lg:w-1/2 bg-[url('assets/images/student_signin.png')] comic-border bg-cover h-96 w-384">
            <div className="grid grid-rows-5 place-items-center">
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
  }

};
export default SignUp;