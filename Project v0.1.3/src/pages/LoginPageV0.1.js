import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { IonToolbar, IonHeader, IonItem, IonLabel, IonButton, IonInput, IonToast, IonText } from "@ionic/react";
import BasicPage from "../components/BasicPage";
import { inject, observer } from "mobx-react";
import httpClient from 'react-http-client';


class LoginPage extends Component {
  userData;

  /* async myfonction(){
    let httpHandler = require('react-http-client');
    let postResponse = await httpHandler.post(
      'https://us-central1-archivelogapp-1593534474479.cloudfunctions.net/app/api/connexion',
    {
      id: 'Bpm0318',
      password: '12345',
      tokenFirebase: 'ggggffhfkggkghj'
    });
  }

 async myfonctionn(){
  let httpHandler = require('react-http-client');
  const getResponse = await httpHandler.get(
    'https://us-central1-archivelogapp-1593534474479.cloudfunctions.net/app/api/read/Bpm0318'
  );}
 */
  constructor(props) {
    super(props);
    this.state = { showErrorToast: true, errMsg: "please login"};
    this.email = React.createRef();
    this.password = React.createRef();
  }

  
  _doLogin = async history => {
    try {
      let httpHandler = require('react-http-client');
      let postResponse = await httpHandler.post(
      'https://us-central1-archivelogapp-1593534474479.cloudfunctions.net/app/api/connexion',
      {
      id: 'Bpm0318',
      password: '12345',
      tokenFirebase: 'ggggffhfkggkghj'
      });
      debugger;
      if(this.email.current.value==postResponse.emailFirebase && this.password.current.value==postResponse.passwdFirebase){
          let r = await this.props.store.doLogin(this.email.current.value, this.password.current.value);
          if (r.code) {
          throw r;
          }
      } 
    } catch (e) {
      this.setState(() => ({ showErrorToast: true, errMsg: e.message }));
    }
  };

  render() {
    let { isAuth, initializationError, activeUser } = this.props.store;
    if (activeUser) {
      return <Redirect to="/home" />;
    } else {
      return (
        <>
          {/* <IonText color="danger" padding style={{ fontWeight: "50" }}>
            {initializationError && initializationError.message}
          </IonText> */}
          <BasicPage title="Login Page" hasMenu="true" renderContent={history => {
              return (
                <>
                <br />
                {/* <div className="ion-text-center">
                  <br />
                  <IonHeader mode="ios">
                    <IonToolbar>
                      <img width="25%" src="../assets/icon/user.png"></img> 
                    </IonToolbar> 
                  </IonHeader>
                  <h1 style={{ fontFamily: "Gill Sans MT" }}> SignIn</h1>
                </div> */}
                <form onSubmit={this.onSubmit}>
                  <IonItem>
                    <IonLabel position="floating">Email Address</IonLabel>
                    <IonInput type="email" ref={this.email} name="email" onChange={this.onChangeEmail}/>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput type="password" ref={this.password} name="password" onChange={this.onChangePassword}/>
                  </IonItem>
                  <div style={{ padding: 10, paddingTop: 20 }}>
                    <IonButton expand="full" style={{ margin: 14 }} onClick={e => {
                       if (!e.currentTarget) { return;} e.preventDefault(); this._doLogin(history);}}>
                      {isAuth ? "Logged In" : "Login"}
                    </IonButton>
                    {/* <IonButton expand="full" style={{ margin: 14 }} onClick={e => { e.preventDefault(); history.push("/register");}}>
                      Create Account
                    </IonButton> */}
                  </div>
                </form>
                </>
              );
            }}
          />
        {/*   <IonToast color="danger" isOpen={this.state.showErrorToast} onDidDismiss={() => 
               this.setState(() => ({ showErrorToast: false }) )}
               message={this.state.errMsg} duration={500}/> */}
        </>
      );
    }
  }
}

export default inject("store")(observer(LoginPage));
