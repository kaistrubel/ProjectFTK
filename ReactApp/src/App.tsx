import React from 'react';
import './App.css';
import Navbar from './components/common/Navbar';
import SignUp from './components/common/SignUp';
import IUserInfo from './types/User';
import { useState, useEffect } from "react";
import UserApi from './apis/user';
import Lectures from './components/common/Lectures';

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
  
  if(user.isAuthenticated)
  {
    return (
      <>
        <Navbar user={user} />
        <Lectures user={user} />
      </>
    );
  }
  else
  {
    return (
      <SignUp />
    );
  }
}

export default App;
