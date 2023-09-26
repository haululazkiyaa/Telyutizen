import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  or,
  query,
  where,
} from "firebase/firestore";

import app from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);
export async function getData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function signIn(userData: { email: string }) {
  const q = query(
    collection(firestore, "user"),
    where("email", "==", userData.email)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data) {
    return data[0];
  } else {
    return null;
  }
}

export async function signUp(
  userData: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "user"),
    where("email", "==", userData.email)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback({
      status: false,
      message: "Email already exist",
    });
  } else {
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.role = "contributor";
    await addDoc(collection(firestore, "user"), userData)
      .then(() => {
        callback({
          status: true,
          message: "Register success",
        });
      })
      .catch((error) => {
        callback({
          status: false,
          message: error,
        });
      });
  }
}

export async function addData(
  appData: {
    appName: string;
    appLink: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "data"),
    or(
      where("appName", "==", appData.appName),
      where("appLink", "==", appData.appLink)
    )
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback({
      status: false,
      message: "Data already exist",
    });
  } else {
    await addDoc(collection(firestore, "data"), appData)
      .then(() => {
        callback({
          status: true,
          message: "Add data success",
        });
      })
      .catch((error) => {
        callback({
          status: false,
          message: error,
        });
      });
  }
}

export async function deleteData(
  appData: {
    id: string;
  },
  callback: Function
) {
  await deleteDoc(doc(firestore, "data", appData.id))
    .then(() => {
      callback({
        status: true,
        message: "Delete data success",
      });
    })
    .catch((error) => {
      callback({
        status: false,
        message: error,
      });
    });
}

export async function addHomework(
  homeworkData: {
    homeworkTitle: string;
    homeworkDeadline: Date;
    homeworkLink: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "homework"),
    or(
      where("appName", "==", homeworkData.homeworkTitle),
      where("appLink", "==", homeworkData.homeworkLink)
    )
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback({
      status: false,
      message: "Homework already exist",
    });
  } else {
    await addDoc(collection(firestore, "homework"), homeworkData)
      .then(() => {
        callback({
          status: true,
          message: "Add homework success",
        });
      })
      .catch((error) => {
        callback({
          status: false,
          message: error,
        });
      });
  }
}

export async function deleteHomework(
  homeworkData: {
    id: string;
  },
  callback: Function
) {
  await deleteDoc(doc(firestore, "homework", homeworkData.id))
    .then(() => {
      callback({
        status: true,
        message: "Delete homework success",
      });
    })
    .catch((error) => {
      callback({
        status: false,
        message: error,
      });
    });
}
