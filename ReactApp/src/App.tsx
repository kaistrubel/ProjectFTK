import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/common/Landing';
import JoinClass from './components/student/JoinClass';
import ClassApi from './apis/class';
import ICourse from './types/Course';
import CreateClass from './components/teacher/CreateClass';
import Navbar from './components/common/Navbar';
import { useState, useEffect, useLayoutEffect } from "react";
import UserApi from './apis/user';
import IUserInfo from './types/User';
import Problem from './components/student/Problem';

function App() {

  const initialUserState = {
    name: "",
    email: "",
    pictureUrl: "",
    roles: [""],
    isAuthenticated: false,
    isTeacher: false,
  };

  const [user, setUser] = useState<IUserInfo>(initialUserState);

  useLayoutEffect(() => {
    UserApi.get()
    .then((response) => {
      setUser(response.data);
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse>()

  const [problemUrl, setProblemUrl] = useState<string>();
  const [videoUrl, setVideoUrl] = useState<string>();

  useEffect(() => {
    ClassApi.getCurrentClasses()
    .then((response) => {
      setCourses(response.data);
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);

  return (
    <>
      { user.isAuthenticated != true &&
        <Navbar user={user} courses={courses} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
      }
      <Routes>
        <Route path="/" element={<Landing user={user} selectedCourse={selectedCourse} setProblemUrl={setProblemUrl} setVideoUrl={setVideoUrl}/>} />
        <Route path="/createClass" element={<CreateClass setCourses={setCourses} />} />
        <Route path="/joinClass" element={<JoinClass setCourses={setCourses} />} />
        <Route path="/problem" element={<Problem problemUrl={problemUrl} videoUrl={videoUrl} />} />
        </Routes>
    </>
  );
}

export default App;
