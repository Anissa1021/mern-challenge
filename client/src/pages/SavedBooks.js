import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import {useMutation, useQuery} from '@apollo/react-hooks';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';


const StarBooks = () => {
  const { loading, data} = useQuery(GET_ME);
  const userData = data?.me || [];
  const [removeBook, {error}] = useMutation(REMOVE_BOOK);
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      const response = await deleteBook(bookId, token);
      const {data} = await removeBook({
        variables: { bookId }
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return <h2>...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Saved books</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.StarBooks.length
            ? `Viewing ${userData.StarBooks.length} saved ${userData.StarBooks.length === 1 ? 'book' : 'books'}:` : 'No saved books!'}
        </h2>
        <CardColumns>
          {userData.StarBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>Delete Book</Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default StarBooks;
