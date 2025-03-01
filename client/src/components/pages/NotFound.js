import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 5rem 0;
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const NotFoundText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const NotFoundButton = styled(Link)`
  display: inline-block;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
    color: ${({ theme }) => theme.buttonText};
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundText>Страница не найдена</NotFoundText>
      <NotFoundButton to="/">Вернуться на главную</NotFoundButton>
    </NotFoundContainer>
  );
};

export default NotFound; 