import ClassApi from "../../apis/class";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const JoinClass = () => {
  
  const navigate = useNavigate();

  const [teacherEmail, setTeacherEmail] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleJoinClass = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    ClassApi.joinClass(teacherEmail, code)
    .then((response) => {
      if(response.status != 200){
        window.confirm('An Error Occured')
      }
      else
      {
        navigate('/');
      }

    })
    .catch((e: Error) => {
      console.log(e)
      window.confirm('An Error Occured')
    });
  }

    return (
      <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 space-y-6 sm:p-6">
                  <div className = "bubble bubble-header bubble-align-start">
                    Join a class
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="teacherEmail" className="block text-sm font-medium text-white">
                        Teacher's Email
                      </label>
                      <input
                        required
                        type="text"
                        name="teacherEmail"
                        id="teacherEmail"
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="code" className="block text-sm font-medium text-white">
                        Code
                      </label>
                      <input
                        required
                        type="text"
                        name="code"
                        id="code"
                        onChange={(e) => setCode(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  <div className="px-4 py-3 text-right sm:px-6">
                  <button
                    onClick={handleJoinClass}
                    type="submit"
                    className="text-black bubble bubble--highlight hover:bg-indigo-700 hover:text-white"
                  >
                    Submit
                  </button>
                </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinClass;