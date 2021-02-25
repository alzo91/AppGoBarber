import React from 'react';
import {RectButtonProperties} from 'react-native-gesture-handler';
import {Container, Label} from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
}
const Button: React.FC<ButtonProps> = ({children, ...rest}) => (
  <Container {...rest}>
    <Label>{children}</Label>
  </Container>
);

export default Button;
