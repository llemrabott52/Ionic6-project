import React from 'react';
import './Home.css';

interface ContainerProps {
  name: string;
}

const Home: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <strong>Logs</strong>
    </div>
  );
};

export default Home;
