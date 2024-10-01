import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB1GBR68w62vPcG36YVT26jccz58JP8Pl4",
    authDomain: "nucleo3proyecto.firebaseapp.com",
    databaseURL: "https://nucleo3proyecto-default-rtdb.firebaseio.com",
    projectId: "nucleo3proyecto",
    storageBucket: "nucleo3proyecto.appspot.com",
    messagingSenderId: "142506263083",
    appId: "1:142506263083:web:2d30fc2a6776177b74a06e"
  };

  const firebase = initializeApp(firebaseConfig);

  export const auth = getAuth(firebase);
  export const dbRealTime = getDatabase(firebase);