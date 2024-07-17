import { useEffect } from "react";

import BookCard from "../components/BookCard";

import { useBooksStore, Book } from "../store/useBooksStore";
import { getDocs, query, collection } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const Dashboard = () => {
  const { books, updateBooks } = useBooksStore();

  useEffect(() => {
    const getBooks = async () => {
      const books: Book[] = [];

      const q = query(collection(firestore, "books"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id } as Book);
      });

      updateBooks(books);
    };

    getBooks();
  }, []);

  return (
    <div className="container mx-auto mt-10 flex gap-6">
      {books.map((book) => (
        <BookCard name={book.name} ISBN={book.ISBN} id={book.id} />
      ))}
    </div>
  );
};

export default Dashboard;
