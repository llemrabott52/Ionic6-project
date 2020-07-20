import {
  IonList,
  IonMenu,
  IonNote,
  IonInput,
  IonTab,
  IonLabel,
} from '@ionic/react';
import { IonIcon, IonButton, IonContent } from '@ionic/react';
import { star, logIn, archive, logOut } from 'ionicons/icons';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Inbox',
    url: '/page/Inbox',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Outbox',
    url: '/page/Outbox',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  
];


const Menu: React.FC = () => {
  function logout(){
    console.log("logout succesed");
    window.location.href = '/';
  }
  function messages(){
    window.location.href = '/home';
  }
  function changepass(){
    window.location.href = '/changepass';
  }

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          
          <IonNote>ArchiveAppLog</IonNote>
          <br /><br />
          <IonList>
          <IonButton onClick={messages} size="default"  expand="full" color="light" slot="start" >
            <IonIcon slot="start" icon={archive} />Notifications list</IonButton>
          <br />
          <IonButton onClick={changepass} size="default"  expand="full" color="light" slot="start" >
          <IonIcon slot="start" icon={logIn} />change passwd
          </IonButton>
          <br />
          <IonButton size="default"  expand="full" color="light" slot="start" onClick={logout} >
          <IonIcon slot="start" icon={logOut} />Logout
          </IonButton>
          <br />
          </IonList>
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
