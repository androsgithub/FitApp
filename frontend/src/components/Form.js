import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Form = ({ onEdit, setOnEdit, getClients }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const client = ref.current;

      client.name.value = onEdit.name;
      client.email.value = onEdit.email;
      client.phone.value = onEdit.phone;
      client.address.value = onEdit.address;
      client.plan.value = onEdit.plan;
      client.goal.value = onEdit.goal;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const client = ref.current;

    if (
      !client.name.value ||
      !client.email.value ||
      !client.phone.value ||
      !client.address.value ||
      !client.plan.value ||
      !client.goal.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios.put("http://localhost:3001/" + onEdit.id, {
        name: client.name.value,
        email: client.email.value,
        phone: client.phone.value,
        address: client.address.value,
        plan: client.plan.value,
        goal: client.goal.value
      }).then(({ data }) => toast.success(data)).catch(({ data }) => toast.error(data));
    } else {
      await axios.post("http://localhost:3001", {
        name: client.name.value,
        email: client.email.value,
        phone: client.phone.value,
        address: client.address.value,
        plan: client.plan.value,
        goal: client.goal.value
      }).then(({ data }) => toast.success(data)).catch(({ data }) => toast.error(data));
    }

    client.name.value = "";
    client.email.value = "";
    client.phone.value = "";
    client.address.value = "";
    client.plan.value = "";
    client.goal.value = "";

    setOnEdit(null);
    getClients();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="name" />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <Input name="phone" />
      </InputArea>
      <InputArea>
        <Label>Endereço</Label>
        <Input name="address" />
      </InputArea>
      <InputArea>
        <Label>Plano</Label>
        <Input name="plan" />
      </InputArea>
      <InputArea>
        <Label>Objetivo</Label>
        <Input name="goal" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  )
};

export default Form;
