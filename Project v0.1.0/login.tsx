import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import Container from '../components/Container';
import './login.css';
import { bus } from 'ionicons/icons';
import {loginUser} from '../firebaseConfig'

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonContent> 
        <Container />
        {/* <IonLoading message="loading" duration={0} animated={false} isOpen={true} /> */}
      </IonContent>
    </IonPage>
  );
};

export default Page;
