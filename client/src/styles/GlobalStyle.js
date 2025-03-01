import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.textPrimary};
    min-height: 100vh;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.accent};
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.primary};
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.buttonText};
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background: ${({ theme }) => theme.primaryHover};
    }

    &:disabled {
      background: ${({ theme }) => theme.disabled};
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
    }
  }

  .alert {
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    
    &.alert-success {
      background-color: ${({ theme }) => theme.success};
      color: ${({ theme }) => theme.successText};
    }
    
    &.alert-danger {
      background-color: ${({ theme }) => theme.danger};
      color: ${({ theme }) => theme.dangerText};
    }
  }

  .btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    
    &.btn-primary {
      background-color: ${({ theme }) => theme.primary};
      color: ${({ theme }) => theme.buttonText};
      
      &:hover {
        background-color: ${({ theme }) => theme.primaryHover};
      }
    }
    
    &.btn-secondary {
      background-color: ${({ theme }) => theme.secondary};
      color: ${({ theme }) => theme.buttonText};
      
      &:hover {
        background-color: ${({ theme }) => theme.secondaryHover};
      }
    }
    
    &.btn-danger {
      background-color: ${({ theme }) => theme.danger};
      color: ${({ theme }) => theme.buttonText};
      
      &:hover {
        background-color: ${({ theme }) => theme.dangerHover};
      }
    }
    
    &.btn-block {
      display: block;
      width: 100%;
    }
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-text {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textMuted};
  }

  .text-center {
    text-align: center;
  }

  .my-1 {
    margin: 1rem 0;
  }

  .my-2 {
    margin: 2rem 0;
  }

  .mt-1 {
    margin-top: 1rem;
  }

  .mb-1 {
    margin-bottom: 1rem;
  }

  .p-1 {
    padding: 1rem;
  }

  .py-1 {
    padding: 1rem 0;
  }

  .p-2 {
    padding: 2rem;
  }
`;

export default GlobalStyle; 