import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const RegisterTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.text};
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = ({ register, isAuthenticated, setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Пароли не совпадают', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  // Redirect if registered
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <RegisterContainer>
      <RegisterTitle>Регистрация</RegisterTitle>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Label htmlFor="name">Имя</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password2">Подтверждение пароля</Label>
          <Input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Зарегистрироваться</SubmitButton>
      </Form>
      <LoginLink>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  setAlert: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register, setAlert })(Register); 