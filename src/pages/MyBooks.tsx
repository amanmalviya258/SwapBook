import React, { useEffect } from "react";

import { firestore, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useBooksStore, Book } from "../store/useBooksStore";
import BookCard from "../components/BookCard";
import { useAuthState } from "react-firebase-hooks/auth";

const MyBooks = () => {
  const { userBooks, updateUserBooks } = useBooksStore();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUserBooks = async () => {
      if (!user) return;

      const books: Book[] = [];

      const q = query(
        collection(firestore, "books"),
        where("createdBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id } as Book);
      });

      updateUserBooks(books);
    };

    getUserBooks();
  }, [user]);

  return (
    <div className="container mx-auto">
      <div className="text-3xl font-medium mt-2">My Books</div>
      <div className="flex gap-6 mt-2">
        {userBooks.map((book) => (
          <BookCard
            ISBN={book.ISBN}
            name={book.name}
            key={book.id}
            id={book.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MyBooks;
