/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useCallback} from 'react';
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
import api from '../../services/api';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'Senha no minimo de 6 caracteres'),
        });
        await schema.validate(data, {abortEarly: false});
        await api.post('/users', data);
        Alert.alert(
          'Cadastro Realizado com Sucesso',
          'Você já pode realizar login',
        );
        navigation.goBack();
      } catch (err) {
        // console.log(JSON.stringify(err));
        // formRef.current?.setErrors({ name: 'nome obrigatorio' });
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert('Erro ao Cadastrar', 'Ocorreu um erro ao cadastrar!');
        /* addToast({ title: 'Erro na criação de usuário', description: 'Ocorreu um erro ao realizar cadastro',
          type: 'error',  }); */
      }
    },
    [formRef, navigation],
  );

  const handleSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, [formRef]);

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
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp} style={{width: '100%'}}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                keyboardAppearance="dark"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                keyboardAppearance="dark"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                keyboardAppearance="dark"
                textContentType="newPassword"
                onEndEditing={handleSubmit}
              />
              <Button onPress={handleSubmit}>Cadastrar</Button>
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
