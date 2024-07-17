import React, { useState, useEffect } from "react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";

import { firestore, auth } from "../firebase/firebase";
import {
  getDocs,
  query,
  where,
  collection,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

type Request = {
  id: string;
  name: string;
  from: string;
  email: string;
  status: boolean;
  location: string;
  swappedBook: string;
};

const Requests = () => {
  const [user] = useAuthState(auth);
  const [request, setRequest] = useState<Request[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchRequest = async () => {
      const q = query(
        collection(firestore, "requests"),
        where("bookOwner", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (snapshot) => {
        const data = snapshot.data();

        const bookDoc = await getDoc(doc(firestore, "books", data.bookId));
        const book = bookDoc.data();

        setRequest((prev) => [
          ...prev,
          {
            id: snapshot.id,
            name: book?.name,
            from: data.from,
            email: data.email,
            status: data.status,
            location: book?.location,
            swappedBook: data.swappedBook,
          },
        ]);
      });
    };

    fetchRequest();
  }, [user]);

  return (
    <div className="container mx-auto mt-10">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>From</Th>
              <Th>Email</Th>
              <Th>Location</Th>
              <Th>Offered Book</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {request.map((r) => (
              <Tr>
                <Td>{r.name}</Td>
                <Td>{r.from}</Td>
                <Td>{r.status && r.email}</Td>
                <Td>{r.location}</Td>
                <Td>{r.swappedBook}</Td>
                <Td>
                  <Button
                    onClick={async () => {
                      try {
                        await updateDoc(doc(firestore, "requests", r.id), {
                          status: true,
                        });
                        setRequest((prev) => {
                          return prev.map((req) => {
                            if (req.id === r.id) {
                              return {
                                ...req,
                                status: true,
                              } as Request;
                            }
                            return req;
                          });
                        });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    Accept
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Requests;
