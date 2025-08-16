import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyC2snnjbF15MxlH3q_eG5ANAiJspmy204c",
  authDomain: "frontend-c7455.firebaseapp.com",
  projectId: "frontend-c7455",
  storageBucket: "frontend-c7455.firebasestorage.app",
  messagingSenderId: "253547256848",
  appId: "1:253547256848:android:de7516d2296e12ee3cbe95"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent(appName, () => App);
