'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ACCOUNT_DOC_ID = exports.ACCOUNT = exports.PROJECTLAYOUTS = exports.PROJECTS = exports.TASKLISTS = exports.TASKS = exports.AccountConfigFallback = undefined;
exports.getFirestore = getFirestore;
exports.getAuth = getAuth;
exports.setupFirebase = setupFirebase;

var _app = require('firebase/app');

var _app2 = _interopRequireDefault(_app);

require('firebase/firestore');

require('firebase/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = null;
var firestore = null;
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

        // Settings.
        var settings = { timestampsInSnapshots: true };
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

        _app2.default.initializeApp(config);

        firestore = _app2.default.firestore();
        auth = _app2.default.auth();

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
};var TASKS = exports.TASKS = "tasks";
var TASKLISTS = exports.TASKLISTS = "taskLists";
var PROJECTS = exports.PROJECTS = "projects";
var PROJECTLAYOUTS = exports.PROJECTLAYOUTS = "projectLayouts";
var ACCOUNT = exports.ACCOUNT = "account";
var ACCOUNT_DOC_ID = exports.ACCOUNT_DOC_ID = "primary";
