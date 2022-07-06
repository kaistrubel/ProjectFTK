import { useEffect, useState } from "react";
import ClassApi from "../../apis/class";
import ISubject from "../../types/subject";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const CreateClass = () => {

  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedPeriod, setSelectedPeriod] = React.useState("");

  useEffect(() => {
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
                    Create a class
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="subject" className="block text-sm font-medium text-white">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        autoComplete="subject-name"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {subjects.map((subject) => 
                          <option key={subject.subjectSlug} value={subject.subjectSlug}>{subject.displayName}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="classSlug" className="block text-sm font-medium text-white">
                        Class
                      </label>
                      <select
                        id="classSlug"
                        name="classSlug"
                        autoComplete="class-name"
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {subjects.find((x) => x.subjectSlug == selectedSubject)?.courses.map((course) => 
                          <option key={course.courseSlug} value={course.courseSlug}>{course.displayName}</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="period" className="block text-sm font-medium text-white">
                        Period
                      </label>
                      <input
                        required
                        type="text"
                        name="period"
                        id="period"
                        autoComplete="period"
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  <div className="px-4 py-3 text-right sm:px-6">
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
      </div>
    </>
  );
};

export default CreateClass;