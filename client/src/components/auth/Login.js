import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { login } from '../../actions/auth';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${props => props.theme.backgroundLight};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.textPrimary};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.textPrimary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.accent + '33'};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.accentDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.accentLight};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RegisterLink = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  color: ${props => props.theme.textSecondary};
  
  a {
    color: ${props => props.theme.accent};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = ({ login, isAuthenticated, setAlert }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlert('Пожалуйста, заполните все поля', 'danger');
      return;
    }
    
    setIsLoading(true);
    console.log('Попытка входа с email:', email);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Ошибка при входе:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Редирект, если пользователь авторизован
  if (isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return (
    <LoginContainer>
      <Title>Вход в аккаунт</Title>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'} 
          {isLoading && <LoadingSpinner />}
        </SubmitButton>
      </Form>
      <RegisterLink>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </RegisterLink>
    </LoginContainer>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login); 