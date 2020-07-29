import React, { Component } from 'react';
import './App.css';
import httpClient from 'react-http-client';



class App extends Component {
  async myfonction(){
    let httpHandler = require('react-http-client');
    let postResponse = await httpHandler.post(
    // url
      'https://us-central1-archivelogapp-1593534474479.cloudfunctions.net/app/api/connexion',
    // body
    {
      id: 'Bpm0318',
      password: '12345',
      tokenFirebase: 'ggggffhfkggkghj'
    }
    // headers if any
    );
    console.log(postResponse);
  }
 

  async myfonctionn(){
  let httpHandler = require('react-http-client');
  const getResponse = await httpHandler.get(
    'https://us-central1-archivelogapp-1593534474479.cloudfunctions.net/app/api/read/Bpm0318'
  );
  console.log(getResponse);
  }

 render(){
  return(
      <div>
        <button onClick={this.myfonctionn()}>singup</button>
      </div>
  );
}
}

export default App;
