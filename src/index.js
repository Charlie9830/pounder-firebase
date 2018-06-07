import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
let auth = null;
let firestore = null;
var isSetup = false;


// Exports
export function getFirestore() {
    if (isSetup === false) {
        throw "Firestore has not been Setup yet. Call setupFirestore() with either development or production mode first";
    }

    else {
        return firestore;
    }
}

export function getAuth() {
    if (isSetup === false) {
        throw "Firebase has not been Setup yet. Call setupFirestore() with either development or production mode first"
    }

    else {
        return auth;
    }
}

export function setupFirebase(mode) {
    if (mode === "development") {
        // Development Database.
        var config = {
            apiKey: "AIzaSyBjzZE8FZ0lBvUIj52R_10eHm70aKsT0Hw",
            authDomain: "halo-todo.firebaseapp.com",
            databaseURL: "https://halo-todo.firebaseio.com",
            projectId: "halo-todo",
            storageBucket: "halo-todo.appspot.com",
            messagingSenderId: "801359392837"
        };

        firebase.initializeApp(config);

        firestore = firebase.firestore();
        auth = firebase.auth();

        // Settings.
        const settings = { timestampsInSnapshots: true};
        firestore.settings(settings);
        firestore.enablePersistence();

        isSetup = true;
    }

    if (mode === "production") {
        // Production DB
        var config = {
            apiKey: "AIzaSyC73TEUhmgaV2h4Ml3hF4VAYnm9oUCapFM",
            authDomain: "pounder-production.firebaseapp.com",
            databaseURL: "https://pounder-production.firebaseio.com",
            projectId: "pounder-production",
            storageBucket: "",
            messagingSenderId: "759706234917"
        };

        firebase.initializeApp(config);

        firestore = firebase.firestore();
        auth = firebase.auth();

        // Settings.
        const settings = { timestampsInSnapshots: true};
        firestore.settings(settings);
        firestore.enablePersistence();

        isSetup = true;
    }
}

// Account Config Fallback Value.
export const AccountConfigFallback = {
    favouriteProjectId: -1,
}

// Firestore Collection Paths.
export const TASKS = "tasks";
export const TASKLISTS = "taskLists";
export const PROJECTS = "projects";
export const PROJECTLAYOUTS = "projectLayouts";
export const ACCOUNT = "account";
export const ACCOUNT_DOC_ID = "primary";