﻿import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/common/Landing';
import JoinClass from './components/student/JoinClass';
import ClassApi from './apis/class';
import ICourse from './types/Course';
import CreateClass from './components/teacher/CreateClass';
import Navbar from './components/common/Navbar';
import { useState, useMemo, useEffect } from "react";
import UserApi from './apis/user';
import IUser, { Progress } from './types/User';
import { useLocalStorage } from './components/localStorage';
import BlocklyProblem from './components/student/BlocklyProblem';

function App() {
  const [user, setUser] = useState<IUser>();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useLocalStorage<ICourse>("selectedCourse")
  const [loading, setLoading] = useState<boolean>(true)

  const [lessonId, setLessonId] = useLocalStorage<string>("lessonId");

  useMemo(() => {
    UserApi.currentUser()
    .then((response) => {
      setUser(response.data);
    })
    .catch((e: Error) => {
      console.log(e);
    });

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
      { user?.isAuthenticated &&
        <Navbar user={user} courses={courses} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} setLoading={setLoading}/>
      }
      <Routes>
        <Route path="/" element={<Landing user={user} selectedCourse={selectedCourse} setLessonId={setLessonId} loading={loading} />} />
        <Route path="/createClass" element={<CreateClass setCourses={setCourses} loading={loading} />} />
        <Route path="/joinClass" element={<JoinClass setCourses={setCourses} loading={loading} />} />
        <Route path="/blockly" element={<BlocklyProblem user={user} lessonId={lessonId}/>} />
        </Routes>
    </>
  );
}

export default App;
