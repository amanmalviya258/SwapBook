import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import MyBooks from "./pages/MyBooks";
import BookDetails from "./pages/BookDetails";

import Requests from "./pages/Requests";

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/:bookId" element={<BookDetails />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
