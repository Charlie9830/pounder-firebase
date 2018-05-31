import Firebase from 'firebase';
require('firebase/firestore');
var firestore = null;
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
        return Firebase.auth();
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

        Firebase.initializeApp(config);
        firestore = Firebase.firestore();
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

        Firebase.initializeApp(config);
        firestore = Firebase.firestore();
        firestore.enablePersistence();
        isSetup = true;
    }
}

// Firestore Collection Paths.
export const TASKS = "tasks";
export const TASKLISTS = "taskLists";
export const PROJECTS = "projects";
export const PROJECTLAYOUTS = "projectLayouts";
export const ACCOUNT = "account";