/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef} from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import * as Yup from 'yup';
import {
  Container,
  Title,
  CreateAccountButton,
  CreateAccountText,
} from './styles';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

interface FormCredentials {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const handleForgot = useCallback(
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
        // await signIn({email: data.email, password: data.password});
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
    [formRef],
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
              <Title>Recuperar senha</Title>
            </View>
            <Form ref={formRef} onSubmit={handleForgot} style={{width: '100%'}}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardAppearance="dark"
                keyboardType="email-address"
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
              />

              <Button onPress={handleSubmit}>Recuperar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <CreateAccountText>Voltar para Logon</CreateAccountText>
      </CreateAccountButton>
    </>
  );
};

export default SignUp;
