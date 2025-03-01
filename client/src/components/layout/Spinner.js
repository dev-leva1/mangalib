import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${props => props.fullPage ? '80vh' : '100%'};
`;

const SpinnerElement = styled.div`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border: 5px solid ${props => props.theme.background};
  border-top: 5px solid ${props => props.theme.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = ({ fullPage = true, size }) => {
  return (
    <SpinnerContainer fullPage={fullPage}>
      <SpinnerElement size={size} />
    </SpinnerContainer>
  );
};

export default Spinner; 