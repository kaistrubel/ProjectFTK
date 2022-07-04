import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import IUserInfo from './types/User';
import { useState, useEffect } from "react";
import UserService from './apis/user';

function App() {

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
  
  if(user.isAuthenticated)
  {
    return (
      <Navbar pictureUrl={user.pictureUrl} />
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
