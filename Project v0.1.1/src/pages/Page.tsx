import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import Menu from '../components/Menu';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <Menu />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          
        </IonToolbar>
      </IonHeader>

      <IonContent>
      {/*   <IonHeader collapse="condense">
          <IonToolbar>
            
          </IonToolbar>
        </IonHeader> */}
        <ExploreContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
