import React from 'react';
import Navbar from '../../components/common/Navbar';
import SignUp from '../../components/common/SignUp';
import IUserInfo from '../../types/User';
import { useState, useEffect } from "react";
import UserApi from '../../apis/user';
import Lectures from '../../components/common/Lectures';
import ClassApi from '../../apis/class';
import ICourse from '../../types/Course';
import CreateClass from '../../components/teacher/CreateClass';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Landing() {

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
    {
        user.isAuthenticated == false
        ? <SignUp />
        :
        <>
        <Navbar user={user} courses={courses}/>
        <Lectures user={user} courses={courses} />
        </>
    }
    </>
  );
}

export default Landing;