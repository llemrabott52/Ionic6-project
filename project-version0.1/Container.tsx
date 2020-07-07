import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Container.css';
import { IonInput, IonButton, IonImg, IonRouterLink } from '@ionic/react';
import {
  IonItemDivider,
  IonItem
} from '@ionic/react';

interface ContainerProps {
  name: string;
}

const Container: React.FC = () => {
  const[username, setUsername] = useState('')
  const[password, setPassword] = useState('')
  
  function login() {
    if(username == "root" && password =="rootroot"){
      window.location.href = '/pages/page';
    }else console.log("incorrect passwd")
  }
  
  
  return (
    <div className="container">
      <img width="25%" src="./assets/user.png"></img>
      <div className="logger">
      {/* <IonInput placeholder="username">username</IonInput>
      <IonInput placeholder="password">passwd</IonInput> */}
            <IonInput type="text" placeholder="enter username" onIonChange={(e: any) => setUsername(e.target.value)}> username </IonInput>
            <IonInput type="password"  placeholder="Enter password" onIonChange={(e: any) => setPassword(e.target.value)}>password</IonInput>
      <br /><IonButton onClick={login} slot='end' shape="round" fill="outline" color="success">Enter</IonButton>
      </div>
    </div>

  );
};

export default Container;
