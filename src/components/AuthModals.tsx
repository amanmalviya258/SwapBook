import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import OAuthButtons from "./OAuthButtons";

import { useModalStore } from "../store/useModalStore";

const AuthModal: React.FC = () => {
  const { setOpen, open, view } = useModalStore();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {view === "login" && "Login"}
            {view === "signup" && "Sign Up"}
            {view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              {view === "login" || view === "signup" ? (
                <React.Fragment>
                  <OAuthButtons />
                </React.Fragment>
              ) : (
                <div></div>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default AuthModal;
