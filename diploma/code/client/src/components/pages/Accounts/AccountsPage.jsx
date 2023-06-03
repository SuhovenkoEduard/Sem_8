import React, { useState } from "react";
import { PageContainer } from "../../layout";
import { useGeneralDataHook } from "../../../hooks/useGeneralDataHook";
import { firebaseRepositories } from "../../../firestore/data/repositories";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Role } from "../../../firestore/types/collections.types";
import { AccountModal, UsersView } from "./elements";
import { useGeneralModalHandlers } from "../../../hooks/useGeneralModalHandlers";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase_config";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";

const adminFirebaseApp = initializeApp(firebaseConfig, "admin-console");
const adminAuth = getAuth(adminFirebaseApp);

export const AccountsPage = () => {
  const [isAccountUpdateLoading, setIsAccountUpdateLoading] = useState(false);
  const [isUsersLoading, users, refreshUsers] = useGeneralDataHook(async () => {
    return firebaseRepositories.users.getDocs();
  }, []);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAccountModalOpened, openAccountModal, closeAccountModal] =
    useGeneralModalHandlers({
      onOpen: (role, user = null) => {
        setSelectedAccount(user);
        setSelectedRole(role);
      },
      onClose: () => {
        setSelectedAccount(null);
        setSelectedRole(null);
      },
    });

  const updateAccount = async (updatedAccount, existingAccount = null) => {
    try {
      setIsAccountUpdateLoading(true);

      const userCredential = Boolean(existingAccount)
        ? await signInWithEmailAndPassword(
            adminAuth,
            existingAccount.email,
            existingAccount.password
          )
        : await createUserWithEmailAndPassword(
            adminAuth,
            updatedAccount.email,
            updatedAccount.password
          );

      if (existingAccount) {
        await updateEmail(userCredential.user, updatedAccount.email);
        await updatePassword(userCredential.user, updatedAccount.password);
      }

      await firebaseRepositories.users.updateDoc({
        ...updatedAccount,
        docId: userCredential.user.uid,
      });
      await adminAuth.signOut();
      await refreshUsers();
    } catch (e) {
      console.log(e);
    } finally {
      setIsAccountUpdateLoading(false);
    }
  };

  const deleteAccount = async (account) => {
    try {
      setIsAccountUpdateLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        adminAuth,
        selectedAccount.email,
        selectedAccount.password
      );

      // todo side effects, update connected users (reviews, relativePatient, relative, patient, doctor)
      // await deleteUser(userCredential.user);
      // await firebaseRepositories.users.deleteDocById(account.docId)

      await adminAuth.signOut();
      await refreshUsers();
    } catch (e) {
      console.log(e);
    } finally {
      setIsAccountUpdateLoading(false);
    }
  };

  return (
    <PageContainer
      style={{
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        minHeight: "calc(100vh - 60px)",
        width: "100%",
      }}
    >
      {isUsersLoading || isAccountUpdateLoading ? (
        <LoadingSpinner />
      ) : (
        users && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
              width: "100%",
            }}
          >
            {[Role.PATIENT, Role.DOCTOR, Role.RELATIVE, Role.ADMIN].map(
              (role) => (
                <UsersView
                  key={role}
                  role={role}
                  users={users.filter((user) => user.role === role)}
                  editAccount={openAccountModal}
                  deleteAccount={deleteAccount}
                />
              )
            )}
          </div>
        )
      )}
      {selectedRole && (
        <AccountModal
          isOpen={isAccountModalOpened}
          onClose={closeAccountModal}
          submitAccount={updateAccount}
          selectedAccount={selectedAccount}
          role={selectedRole}
        />
      )}
    </PageContainer>
  );
};
