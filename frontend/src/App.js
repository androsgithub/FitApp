import GlobalStyle from "./styles/global";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "./components/Form";
import Grid from "./components/Grid";
import { useEffect, useState } from "react";
import axios from "axios";

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

function App() {
  const [clients, setClients] = useState([]);
  const [onEdit, setOnEdit] =  useState(null);

  const getClients = async () => {
    try {
      const res = await axios.get("http://localhost:3001");
      setClients(res.data.sort((a, b) => (a.name > b.name ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getClients();
  }, [setClients]);

  return (
    <>
      <Container>
        <Title>Clientes</Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getClients={getClients} />
        <Grid clients={clients} setClients={setClients} setOnEdit={setOnEdit}/>
      </Container>
      <ToastContainer autoClose={3000} position={toast.position}/>
      <GlobalStyle />
    </>
  );
}

export default App;
