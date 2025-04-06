import React from 'react'
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { MdEmail, MdLock, MdOutlinePermIdentity } from 'react-icons/md'
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { useNavigate  } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import {Column, Container, Title, Wrapper, TitleLogin, SubtitleLogin, LoginText, ContaText} from './styles';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('email não é valido').required('Campo Obrigatório'),
  senha: yup.string().min(3, 'No minimo 3 caracteres').required('Campo Obrigatório'),
}).required();

const Register = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors  } } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
});

const onSubmit = async (formData) => {
  try{
    const check = await api.get(`/users?email=${formData.email}`);
    console.log(formData); // dentro do onSubmit


    if (check.data.length > 0) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

      const response = await api.post('/users', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });
  
      // Supondo que a API retorne sucesso com status 201
      if (response.status === 201 || response.data) {
        alert('Conta criada com sucesso!');
        navigate('/login'); // Redireciona para a tela de login após o cadastro
      } else {
        alert('Erro ao criar conta');
      }
  }catch(e){
    alert('Houve um erro, tente novamente')
  }
};


  return (
    <>
      <Header />
      <Container>
        <Column>
        <Title>A plataforma para você aprender com experts, 
          dominar as principais tecnologias e entrar mais 
          rápido nas empresas mais desejadas.</Title>
        </Column>
        <Column>
          <Wrapper>
            <TitleLogin>Comece agora grátis</TitleLogin>
            <SubtitleLogin>Crie sua conta e make the change._</SubtitleLogin>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input placeholder="Nome completo" leftIcon={<MdOutlinePermIdentity />} name="nome" control={control} errorMessage={errors?.nome?.message}/>
              <Input placeholder="E-mail" leftIcon={<MdEmail />} name="email"  control={control} errorMessage={errors?.email?.message}/>
              <Input type="password" placeholder="Senha" leftIcon={<MdLock />}  name="senha" control={control} errorMessage={errors?.senha?.message}/>
              <Button title="Criar minha conta" variant="secondary" type="submit"/>
            </form>
            <SubtitleLogin>Ao clicar em "criar minha conta grátis", declaro que aceito as Políticas de Privacidade e os Termos de Uso da DIO.</SubtitleLogin>
            <ContaText>Já tenho conta. <LoginText onClick={() => navigate('/login')}>Fazer login</LoginText></ContaText>
          </Wrapper>
        </Column>
      </Container>
    </>
  )
}

export {Register}