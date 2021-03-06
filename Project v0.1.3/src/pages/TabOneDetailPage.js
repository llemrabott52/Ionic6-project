import React from "react";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import BasicPage from "../components/BasicPage";
import { inject } from "mobx-react";

const TabOneDetailPage = (props) => {
  let { store, match} = props
  let value = store.itemByKey(match.params.id);

  return (
    <BasicPage title="Page One Detail" backAction={(e, history) => {}} renderContent={history => {
        return (
          <>
            <IonItem lines="none">
              <IonLabel>In Tab One Detail Page</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel text-wrap>
                <IonText color="primary"> <h3>{value.content.subject}</h3> </IonText>
                <p>{value.content.body}</p>
                <IonText color="secondary"> <p>{value.content.dueDate}</p> </IonText>
              </IonLabel>
            </IonItem>
          </>
        );}}/>
  );
};

export default inject("store")(TabOneDetailPage);
