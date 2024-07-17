import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { firestore, auth } from "../firebase/firebase";
import {
  getDoc,
  doc,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Book } from "../store/useBooksStore";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

const BookDetails = () => {
  const params = useParams();
  const [book, setBook] = useState<Book>();
  const [myBooks, setMyBooks] = useState<Book[]>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [user] = useAuthState(auth);

  const deleteBook = async () => {
    try {
      await deleteDoc(doc(firestore, "books", book?.id!));

      console.log("Book was deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const sendRequest = async (swappedBook: Book) => {
    try {
      await addDoc(collection(firestore, "requests"), {
        from: user?.displayName,
        email: user?.email,
        bookId: book?.id,
        bookOwner: book?.createdBy,
        status: false,
        location: book?.location,
        swappedBook: swappedBook.name,
      });

      console.log("Sent the request");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMyBooks = async () => {
      if (!user) return;

      const q = query(
        collection(firestore, "books"),
        where("createdBy", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const books: Book[] = [];

      querySnapshot.forEach((doc) => {
        books.push(doc.data() as Book);
      });

      setMyBooks(books);
    };

    const getBookDetails = async () => {
      const docSnapshot = await getDoc(doc(firestore, "books", params.bookId!));

      const book = { ...docSnapshot.data(), id: docSnapshot.id } as Book;
      setBook(book);

      const response = await fetch(
        `https://openlibrary.org/isbn/${book.ISBN}.json`
      );
      const result = await response.json();

      console.log(result);
    };

    getBookDetails();
    getMyBooks();
  }, [user]);

  return (
    <div className="container mx-auto">
      <div className="max-w-[200px] mt-10">
        <img
          src={`https://covers.openlibrary.org/b/isbn/${book?.ISBN}-L.jpg`}
          className="w-full"
        />
      </div>
      <div className="text-3xl font-medium mt-2">{book?.name}</div>
      <div className="text-lg font-medium border-b mt-2">Book Images</div>
      <div className="max-w-[200px]">
        <img src={book?.imageUrl} />
      </div>
      <div>{book?.location}</div>
      {user && user.uid == book?.createdBy && (
        <Button colorScheme="red" onClick={deleteBook}>
          Delete
        </Button>
      )}
      {user && user.uid !== book?.createdBy && (
        <React.Fragment>
          <Button colorScheme="green" onClick={onOpen}>
            Request
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Choose a book to swap</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div className="flex flex-col gap-2">
                  {myBooks?.map((book) => (
                    <div className="p-2 rounded border flex justify-between items-center">
                      <div className="text-lg font-medium">{book.name}</div>
                      <Button
                        onClick={() => {
                          sendRequest(book);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </React.Fragment>
      )}
    </div>
  );
};

export default BookDetails;
