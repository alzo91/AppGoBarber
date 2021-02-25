/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef} from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountText,
} from './styles';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import {useAuth} from '../../hooks/AuthContext';
interface FormCredentials {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const inputPasswordRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const {signIn} = useAuth();
  const handleSignIn = useCallback(
    async (data: FormCredentials) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'Senha no minimo de 6 caracteres'),
        });
        await schema.validate(data, {abortEarly: false});
        await signIn({email: data.email, password: data.password});
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao realizar o login!',
        );
        /* addToast({ title: 'Erro na autenticação', description:Ocorreu um erro ao realizar login, cheque as credenciais!',
          type: 'error',
        });*/
      }
    },
    [formRef, signIn],
  );

  const handleSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        enabled
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1}}>
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça o seu Logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn} style={{width: '100%'}}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={inputPasswordRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
              />

              <Button onPress={handleSubmit}>Entrar</Button>
            </Form>
            <ForgotPassword onPress={() => navigation.navigate('Forgot')}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountText>Criar uma conta</CreateAccountText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
