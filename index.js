'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AccountConfigFallback = undefined;
exports.getFirestore = getFirestore;
exports.getAuth = getAuth;
exports.getFunctions = getFunctions;
exports.setupFirebase = setupFirebase;
exports.setUserUid = setUserUid;
exports.getUserUid = getUserUid;

var _app = require('firebase/app');

var _app2 = _interopRequireDefault(_app);

require('firebase/firestore');

require('firebase/auth');

require('firebase/functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = null;
var firestore = null;
var functions = null;
var isSetup = false;

// Exports
function getFirestore() {
    if (isSetup === false) {
        throw "Firestore has not been Setup yet. Call setupFirestore() with either development or production mode first";
    } else {
        return firestore;
    }
}

function getAuth() {
    if (isSetup === false) {
        throw "Firebase has not been Setup yet. Call setupFirestore() with either development or production mode first";
    } else {
        return auth;
    }
}

function getFunctions() {
    if (isSetup === false) {
        throw "Firebase has not been Setup yet. Call setupFirestore() with either development or production mode first";
    } else {
        return functions;
    }
}

function setupFirebase(mode) {
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

        _app2.default.initializeApp(config);

        firestore = _app2.default.firestore();
        auth = _app2.default.auth();
        functions = _app2.default.functions();

        // Settings.
        var settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        firestore.enablePersistence();

        isSetup = true;
    }

    if (mode === "production") {
        // Production DB 2.
        var config = {
            apiKey: "AIzaSyCXdE8p5AXpaqQ_RhcJp8TUwHOqSYPcYnU",
            authDomain: "pounder-production2.firebaseapp.com",
            databaseURL: "https://pounder-production2.firebaseio.com",
            projectId: "pounder-production2",
            storageBucket: "pounder-production2.appspot.com",
            messagingSenderId: "553455457889"
        };

        _app2.default.initializeApp(config);

        firestore = _app2.default.firestore();
        auth = _app2.default.auth();
        functions = _app2.default.functions();

        // Settings.
        var _settings = { timestampsInSnapshots: true };
        firestore.settings(_settings);
        firestore.enablePersistence();

        isSetup = true;
    }
}

// Account Config Fallback Value.
var AccountConfigFallback = exports.AccountConfigFallback = {
    favouriteProjectId: -1

    // Firestore Collection Paths.
};var userUid = "";

function setUserUid(uid) {
    userUid = uid;
}

function getUserUid() {
    return userUid;
}
