import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { supabase } from './auth/session';
import useSession from './auth/useSession';
import Form from './components/Form';
import Grid from './components/Grid';
import GlobalStyle from './styles/global';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 8px 0;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const LogoutButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #e74c3c;
  color: #fff;
  cursor: pointer;
`;

function App() {
  const { session } = useSession();
  const [clients, setClients] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const user = session?.user || null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Desconectado');
    } catch (err) {
      toast.error('Erro ao desconectar');
    }
  };

  const getClients = async () => {
    try {
      const res = await axios.get('http://localhost:3001');
      setClients(res.data.sort((a, b) => (a.name > b.name ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getClients();
  }, [setClients]);

  if (!session) {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  link_text: 'Não tem uma conta? Cadastre-se',
                  email_input_placeholder: 'Seu endereço de e-mail',
                  password_input_placeholder: 'Sua senha',
                  social_provider_text: 'Entrar com {{provider}}'
                },
                sign_up: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  button_label: 'Cadastrar',
                  loading_button_label: 'Cadastrando...',
                  link_text: 'Já tem uma conta? Entrar',
                  email_input_placeholder: 'Seu endereço de e-mail',
                  password_input_placeholder: 'Sua senha',
                  social_provider_text: 'Cadastrar com {{provider}}'
                },
                forgotten_password: {
                  link_text: 'Esqueceu sua senha?',
                  button_label: 'Enviar link de recuperação',
                  email_label: 'E-mail',
                  email_input_placeholder: 'Seu endereço de e-mail'
                },
                magic_link: {
                  button_label: 'Enviar link mágico',
                  loading_button_label: 'Enviando link...',
                  email_input_placeholder: 'Seu endereço de e-mail'
                }
              }
            }}
          />
        </div>
        <GlobalStyle />
      </>
    );
  } else {
    return (
      <>
        <Header>
          <div />
          <UserInfo>
            <div>{user?.email}</div>
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          </UserInfo>
        </Header>
        <Container>
          <Title>Clientes</Title>
          <Form onEdit={onEdit} setOnEdit={setOnEdit} getClients={getClients} />
          <Grid clients={clients} setClients={setClients} setOnEdit={setOnEdit} />
        </Container>
        <ToastContainer autoClose={3000} position={toast.position} />
        <GlobalStyle />
      </>
    );
  }
}

export default App;
