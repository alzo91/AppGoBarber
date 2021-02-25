import React from 'react';

import {useAuth} from '../../hooks/AuthContext';
import {Container, Button, ButtonText} from './styles';

const Dashboard: React.FC = () => {
  const {sigOut} = useAuth();
  return (
    <Container>
      <Button onPress={sigOut}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </Container>
  );
};

export default Dashboard;
