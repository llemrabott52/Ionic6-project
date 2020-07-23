import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from 'mobx-react'
import { Store } from './store';
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";

const store = new Store();

ReactDOM.render(<Provider store={store}> <App /></Provider>, document.getElementById("root"));

