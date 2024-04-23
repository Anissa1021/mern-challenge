import React, { useState } from 'react';
import { Form, Alert, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/react-hooks';
import { createUser } from '../utils/API';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [addUser] = useMutation(ADD_USER);
  const [showAlert, setShowAlert] = useState(false);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
      try {
        const { data } = await addUser({
          variables: { ...userFormData}
        });
        Auth.login(data.addUser.token)
      } catch (e) {
        console.error(e);
        setShowAlert(true);
      }
      setUserFormData({
      username: '', email: '', password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control type='text' placeholder='Your username' name='username' onChange={handleInputChange} value={userFormData.username} required/>
          <Form.Control.Feedback type='invalid'>Username</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control type='email' placeholder='email' name='email' onChange={handleInputChange} value={userFormData.email} required/>
          <Form.Control.Feedback type='invalid'>Email</Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control type='password' placeholder='password' name='password' onChange={handleInputChange} value={userFormData.password} required/>
          <Form.Control.Feedback type='invalid'>Password</Form.Control.Feedback>
        </Form.Group>
        <Button disabled={!(userFormData.username && userFormData.email && userFormData.password)} type='submit' variant='success'>Submit</Button>
      </Form>
    </>
  );
};

export default SignupForm;
