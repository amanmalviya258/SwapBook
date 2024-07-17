import React, { useState } from "react";

import AuthModals from "./AuthModals";
import { useModalStore } from "../store/useModalStore";

import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

import {
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  Stack,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useUploadFile, useDownloadURL } from "react-firebase-hooks/storage";
import { ref, getDownloadURL } from "firebase/storage";
import { storage, firestore } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";
import { useBooksStore, Book } from "../store/useBooksStore";
import { Link } from "react-router-dom";
import { FaCrosshairs } from "react-icons/fa";

const Navbar = () => {
  const { setOpen } = useModalStore();
  const { setBook } = useBooksStore();
  const [user, loading, error] = useAuthState(auth);

  const [signOut] = useSignOut(auth);
  const [uploadFile, uploading, snapshot] = useUploadFile();

  const [isbn, setIsbn] = useState("");
  const [images, setImages] = useState<File | null>(null);
  const [location, setLocation] = useState("");

  const { isOpen, onClose, onOpen } = useDisclosure();

  const logout = async () => {
    await signOut();
  };

  const setFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setImages(e.target.files[0]);
  };

  const getCurrentLocation = async () => {
    const success = async (pos: GeolocationPosition) => {
      try {
        const crd = pos.coords;

        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${crd.latitude}&lon=${crd.longitude}&appid=4e7484a149d26d11ab8954743cd85fc5`
        );
        const result = await response.json();

        setLocation(`${result[0].name}, ${result[0].state}`);
      } catch (error) {
        console.log(error);
      }
    };

    const error = (err: GeolocationPositionError) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  };

  const saveBook = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!images || !user) return;

    e.preventDefault();

    try {
      const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
      const details = await response.json();

      const imageRef = ref(storage, `images/${images.name + uuidv4()}`);
      await uploadFile(imageRef, images);

      const downloadUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(firestore, "books"), {
        name: details.title,
        imageUrl: downloadUrl,
        createdBy: user.uid,
        ISBN: isbn,
        location,
      });

      const book: Book = {
        id: docRef.id,
        name: details.title,
        createdBy: user.uid,
        imageUrl: downloadUrl,
        ISBN: isbn,
        location,
      };

      setBook(book);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <div className="flex justify-between items-center p-2 border-b">
        <div className="container flex justify-between w-full mx-auto items-center">
          <Link to="/">
            <div className="text-lg font-medium">SwapBooks</div>
          </Link>

          {user && (
            <div className="flex gap-2">
              <Link to="/my-books">
                <Button>My Books</Button>
              </Link>
              <Link to="/requests">
                <Button>Requests</Button>
              </Link>
            </div>
          )}
          <div className="flex gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" mr={10} onClick={onOpen}>
                  Add new book
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader textAlign="center">New book</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <form onSubmit={saveBook}>
                        <Stack>
                          <Input
                            placeholder="ISBN"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                          />
                          <Flex gap={2}>
                            <Input
                              placeholder="Location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                            <Button onClick={getCurrentLocation}>
                              <FaCrosshairs />
                            </Button>
                          </Flex>
                          <input
                            onChange={setFiles}
                            type="file"
                            className="border p-2 rounded"
                          />
                          <Button type="submit">Submit</Button>
                        </Stack>
                      </form>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Avatar src={user.photoURL!} />
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  ></MenuButton>
                  <MenuList>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ) : (
              <React.Fragment>
                <Button onClick={() => setOpen(true)}>Login</Button>
                <AuthModals />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
