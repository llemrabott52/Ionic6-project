import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonButton,
  IonImg,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, logIn, logInOutline, logOut } from 'ionicons/icons';
import './Menu.css';
import './buttonlogout.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

interface logoutinterface {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const logoutinterface: logoutinterface[] = [
   {
    title: 'logout',
    url: 'login',
    iosIcon: logOut,
    mdIcon: logOut,
  } 
];

const appPages: AppPage[] = [
  {
    title: 'infosLogs',
    url: '/pages/infosLogs',
    iosIcon: archiveOutline,
    mdIcon: archiveOutline,
  },
  {
    title: 'usrpasswd',
    url: '/pages/usrpasswd',
    iosIcon: logInOutline,
    mdIcon: logInOutline,
  },
/*    {
    title: 'logout',
    url: 'login',
    iosIcon: logOut,
    mdIcon: logOut,
  }  */
];

/* const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; */

const Menu: React.FC = () => {
  const location = useLocation();

   function logoutfunc() {
    localStorage.clear();
        window.location.href = '/';
    
  }

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>ArchiveLog</IonListHeader>
          <IonNote></IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );

          })}
          
          {logoutinterface.map((logoutinterface, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem onClick={logoutfunc} className={location.pathname === logoutinterface.url ? 'selected' : 'login'} routerLink={logoutinterface.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={logoutinterface.iosIcon} md={logoutinterface.mdIcon} />
                  <IonLabel>{logoutinterface.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
            
        </IonList>

     {/*    <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
        {/* <IonButton size='small' onClick={logoutfunc}><IonIcon ios="ios-add"/>logout</IonButton> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
