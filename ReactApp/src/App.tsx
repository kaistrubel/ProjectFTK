import React from 'react';
import './App.css';
import Comic from './components/Comic';
import SignUp from './components/SignUp';
import IUserInfo from './types/User';
import UserService from './apis/user';
import { useState, useEffect } from "react";

function App() {

  const initialUserState = {
    name: "",
    email: "",
    pictureUrl: "",
    roles: [""],
    IsAuthenticated: false,
  };
  
  let [user, setUser] = useState<IUserInfo>(initialUserState);

  const getUserInfo = () => {
    UserService.get()
      .then((response: any) => {
        setUser(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  useEffect(() => {
  });

  console.log(user)
  if(user.IsAuthenticated)
  {
    return (
      <Comic />
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
