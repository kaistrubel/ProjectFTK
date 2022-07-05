import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/common/Landing';
import JoinClass from './components/student/JoinClass';
import ClassApi from './apis/class';
import ICourse from './types/Course';
import CreateClass from './components/teacher/CreateClass';
import Navbar from './components/common/Navbar';
import { useState, useEffect } from "react";
import UserApi from './apis/user';
import IUserInfo from './types/User';

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

  useEffect(() => {
    UserApi.get()
    .then((response) => {
      setUser(response.data);
    })
    .catch((e: Error) => {
      console.log(e);
    });
  }, []);

  const [courses, setCourses] = useState<ICourse[]>([]);

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
      <Navbar user={user} courses={courses}/>
      <Routes>
        <Route path="/" element={<Landing user={user} courses={courses}/>} />
        <Route path="/createClass" element={<CreateClass />} />
        <Route path="/joinClass" element={<JoinClass />} />
      </Routes>
    </>
  );
}

export default App;
