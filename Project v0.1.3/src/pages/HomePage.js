import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {IonTitle, IonMenuButton ,IonPage, IonContent, IonHeader, IonButtons, IonToolbar, IonButton} from "@ionic/react";
import { inject, observer } from "mobx-react";
import TabContainer from "../components/TabContainer";
import Home from '../components/Home/Home';
import Menu from '../components/Menu/Menu';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onListPage: true
    };
  }

  _addItem = _value => {
    debugger;
    this.setState(() => ({ showAddItemModal: _value }));
  };

  _changedTabs = e => {
    if (e.currentTarget.attributes.tab.value === "tab1") {
      this.setState(() => ({ onListPage: true }));
    } else {
      this.setState(() => ({ onListPage: false }));
    }
  };

  render() {
    let { onListPage } = this.state;
    return (
<IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            {onListPage ? (
              <IonButtons slot="end">
                
              </IonButtons>
            ) : null}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <TabContainer
            history={this.props.history}
            changedTabs={e => this._changedTabs(e)}
            addItem={this._addItem}
            showAddItemModal={this.state.showAddItemModal}
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default withRouter(inject("store")(observer(HomePage)));
