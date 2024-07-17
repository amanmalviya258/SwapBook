import { create } from "zustand";

export type Book = {
  id: string;
  name: string;
  imageUrl: string;
  createdBy: string;
  ISBN: string;
  location: string;
};

type BooksStoreType = {
  books: Book[];
  userBooks: Book[];
  setBook: (book: Book) => void;
  updateBooks: (books: Book[]) => void;
  updateUserBooks: (books: Book[]) => void;
};

const useBooksStore = create<BooksStoreType>((set) => ({
  books: [
    {
      id: "1",
      name: "Normal People",
      ISBN: "978-0735211292",
      imageUrl: "url",
      createdBy: "author",
      location: "Bhopal, Madhya Pradesh",
    },
  ],
  userBooks: [],
  setBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBooks: (books) => set(() => ({ books })),
  updateUserBooks: (books) => set(() => ({ userBooks: books })),
}));

export { useBooksStore };
