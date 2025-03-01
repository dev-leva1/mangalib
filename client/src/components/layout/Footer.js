import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.textLight};
  padding: 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Copyright = styled.p`
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  color: ${props => props.theme.textLight};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© {year} MangaLib. Все права защищены.</Copyright>
        <FooterLinks>
          <FooterLink href="#">О нас</FooterLink>
          <FooterLink href="#">Контакты</FooterLink>
          <FooterLink href="#">Правила</FooterLink>
          <FooterLink href="#">Политика конфиденциальности</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 