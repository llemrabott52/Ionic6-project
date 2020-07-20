import React, { useState } from 'react';
import { IonInput, IonButton } from '@ionic/react';
import './Login.css'

interface ContainerProps {
}

const Login: React.FC<ContainerProps> = ({}) => {
  const[username, setUsername]=useState('');
  const[password, setPassword]=useState('');
  function login(){
    if(username=="admin" && password=="admin"){
      window.location.href = '/home';
    }else alert("username or password incorrect");
  }

  return (
    <div className="container">
        Login Component
        <IonInput onIonChange={(e: any) => setUsername(e.target.value)} >username</IonInput>
        <IonInput type="password" onIonChange={(e: any) => setPassword(e.target.value)}>password</IonInput>
        <IonButton onClick={login} >Login</IonButton>
    </div>
  );
};

export default Login;
