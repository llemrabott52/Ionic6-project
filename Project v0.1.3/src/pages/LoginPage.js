import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { IonItem, IonLabel, IonButton, IonInput, IonToast, IonText } from "@ionic/react";
import BasicPage from "../components/BasicPage";
import { inject, observer } from "mobx-react";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showErrorToast: true, errMsg: "please login"};
    this.email = React.createRef();
    this.password = React.createRef();
    this.name=React.createRef();
    this.passwd=React.createRef();
  }
  componentDidMount() {}
  _doLogin = async history => {
    try {
      let name="llemrabott@gmail.com";
      let passwd="123456";
      debugger;
      if(this.email.current.value==name && this.password.current.value==passwd){
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
          <IonText color="danger" padding style={{ fontWeight: "50" }}>
            {initializationError && initializationError.message}
          </IonText>
          <BasicPage title="Login Page" hasMenu="true" renderContent={history => {
              return (
                <>
                  <IonItem>
                    <IonLabel position="floating">Email Address</IonLabel>
                    <IonInput type="email" ref={this.email} name="email" />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput type="password" ref={this.password} name="password"/>
                  </IonItem>
                  <div style={{ padding: 10, paddingTop: 20 }}>
                    <IonButton expand="full" style={{ margin: 14 }} onClick={e => {
                       if (!e.currentTarget) { return;} e.preventDefault(); this._doLogin(history);}}>
                      {isAuth ? "Logged In" : "Login"}
                    </IonButton>
                    <IonButton expand="full" style={{ margin: 14 }} onClick={e => { e.preventDefault(); history.push("/register");}}>
                      Create Account
                    </IonButton>
                  </div>
                </>
              );
            }}
          />
          <IonToast color="danger" isOpen={this.state.showErrorToast} onDidDismiss={() => 
               this.setState(() => ({ showErrorToast: false }) )}
               message={this.state.errMsg} duration={500}/>
        </>
      );
    }
  }
}

export default inject("store")(observer(LoginPage));
