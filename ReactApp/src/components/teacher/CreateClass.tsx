import { useMemo, useState } from "react";
import ClassApi from "../../apis/class";
import ISubject from "../../types/Subject";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";

const CreateClass = (props: any) => {

  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedPeriod, setSelectedPeriod] = React.useState("");

  useMemo(() => {
    ClassApi.getSupportedSubjects()
    .then((response) => {
      setSubjects(response.data);
      setSelectedSubject(response.data[0].subjectSlug)
      setSelectedCourse(response.data[0].courses[0].courseSlug)
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);

  const handleCreateClass = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    ClassApi.createClass(selectedCourse, selectedPeriod)
    .then((response) => {
      if(response.status !== 200){
        window.alert('An Error Occured')
      }
      else
      {
        ClassApi.getCurrentClasses()
        .then((response) => {
          props.setCourses(response.data);
          props.setSelectedCourse(response.data[0])
        })
        .catch((e: Error) => {
          console.log(e);
        });
        navigate('/');
      }

    })
    .catch((e: Error) => {
      console.log(e)
      window.alert('An Error Occured')
    });
  }

    return (
      props.loading == true
      ? <Loading />
      :
      <>
      <div className="center">
        <div className="grid w-96">
          <form>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 space-y-6 sm:p-6">
                <div className = "bubble bubble-header bubble-align-start">
                  Create a class
                </div>
                <div className="grid grid-cols-3 gap-6">
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="subject" className="block font-medium text-white">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      autoComplete="subject-name"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {subjects.map((subject) => 
                        <option key={subject.subjectSlug} value={subject.subjectSlug}>{subject.displayName}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="classSlug" className="block font-medium text-white">
                      Class
                    </label>
                    <select
                      id="classSlug"
                      name="classSlug"
                      autoComplete="class-name"
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {subjects.find((x) => x.subjectSlug === selectedSubject)?.courses.map((course) => 
                        <option key={course.courseSlug} value={course.courseSlug}>{course.displayName}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="period" className="block font-medium text-white">
                      Period
                    </label>
                    <input
                      required
                      type="text"
                      name="period"
                      id="period"
                      autoComplete="period"
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                <div className="py-3 text-right">
                <button
                  onClick={handleCreateClass}
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
    </>
  );
};

export default CreateClass;