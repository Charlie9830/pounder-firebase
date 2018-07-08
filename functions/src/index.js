    /* *************************************************
    |   BEWARE! Make sure you keep an eye on the       |
    |    webpack output Build size when you are        |
    |    importing here. You may have to update the    |
    |    webpack config externals regex to exclude     |
    |    large modules.                                |
    |                                                  |
    | **************************************************
    */
import { DirectoryStore, InviteStore, MemberStore } from 'pounder-stores';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Reference Paths.
export const DIRECTORY = "directory";
export const USERS = "users";
export const TASKS = "tasks";
export const TASKLISTS = "taskLists";
export const PROJECTS = "projects";
export const PROJECTLAYOUTS = "projectLayouts";
export const ACCOUNT = "account";
export const ACCOUNT_DOC_ID = "primary";
export const INVITES = 'invites';
export const REMOTES = 'remotes';
export const REMOTE_IDS = 'remoteIds';
export const MEMBERS = 'members';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://halo-todo.firebaseio.com'
});

exports.addUserToDirectory = functions.auth.user().onCreate((user) => {
    admin.firestore().collection(DIRECTORY).doc(user.email).set(Object.assign({}, new DirectoryStore(
        user.email.toLowerCase(),
        user.displayName,
        user.uid))).then(() => {
        // Complete.
    })
})

exports.removeUserFromDirectory = functions.auth.user().onDelete((user) => {
    admin.firestore().collection(DIRECTORY).doc(user.email).delete().then(() => {
        // Complete.
    })
})

exports.getRemoteUserData = functions.https.onCall((data, context) => {
    var targetEmail = data.targetEmail;

    // Check if the user Exists.
    return admin.firestore().collection(DIRECTORY).doc(targetEmail).get().then(doc => {
        if (doc.exists) {
            // User has been Found.
            return {
                status: 'user found',
                userData: doc.data(), 
            }
        }

        else {
            // User doesn't exist.
            return { 
                status: 'user not found',
                userData: {},
            }
        }
    })
})

exports.sendProjectInvite = functions.https.onCall((data, context) => {
    var projectName = data.projectName;
    var sourceEmail = data.sourceEmail;
    var sourceDisplayName = data.sourceDisplayName;
    var projectId = data.projectId;
    var targetUserId = data.targetUserId;
    var targetDisplayName = data.targetDisplayName;
    var targetEmail = data.targetEmail;
    var sourceUserId = context.auth.uid;
    var role = data.role;

    var invite = new InviteStore(projectName, targetUserId, sourceUserId, sourceEmail, sourceDisplayName, projectId, role);

    var inviteRef = admin.firestore().collection(USERS).doc(targetUserId).collection(INVITES).doc(projectId);
    return inviteRef.set(Object.assign({}, invite)).then(() => {
        // Invite Sent. Add User to members collection of Target Project.
        var newMember = new MemberStore(targetUserId, projectId, targetDisplayName, targetEmail, 'pending', role);
        var newMemberRef = admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).doc(targetUserId);

        return newMemberRef.set(Object.assign({}, newMember)).then(() => {
            return { status: 'complete' }
        }).catch(error => {
            return {
                status: 'error',
                error: 'Error while setting user into members: ' + error.message,
            }
        })

    }).catch(error => {
        return {
            status: 'error',
            error: error.message
        }
    })
})

exports.kickUserFromProject = functions.https.onCall((data, context) => {
    var projectId = data.projectId;
    var userId = data.userId;

    var batch = admin.firestore().batch();
    batch.delete(admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).doc(userId));
    batch.delete(admin.firestore().collection(USERS).doc(userId).collection(REMOTE_IDS).doc(projectId));
    batch.delete(admin.firestore().collection(USERS).doc(userId).collection(INVITES).doc(projectId));

    return batch.commit().then( () => {
        return { status: 'complete' }
    }).catch(error => {
        return {
            status: 'error',
            message: 'Error occured while Kicking user: ' + error.message
        }
    })
})

exports.kickAllUsersFromProject = functions.https.onCall((data, context) => {
    var projectId = data.projectId;
    return admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).get().then(snapshot => {
        if (snapshot.empty !== true) {
            // Build a Batch.
            var batch = admin.firestore().batch();
            snapshot.forEach(doc => {
                batch.delete(admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).doc(doc.id));
                batch.delete(admin.firestore().collection(USERS).doc(doc.id).collection(REMOTE_IDS).doc(projectId));
                batch.delete(admin.firestore().collection(USERS).doc(doc.id).collection(INVITES).doc(projectId));
            })

            // Commit.
            return batch.commit().then(() => {
                return { status: 'complete' }
            }).catch(error => {
                return {
                    status: 'error',
                    message: 'Error occured while Kicking user: ' + error.message
                }
            })
        }

        else {
            return { 
                status: 'error',
                message: 'Project has no contributors to kick.' }
        }
    })

    var batch = admin.firestore().batch();
    batch.delete(admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).doc(userId));
    batch.delete(admin.firestore().collection(USERS).doc(userId).collection(REMOTE_IDS).doc(projectId));
    batch.delete(admin.firestore().collection(USERS).doc(userId).collection(INVITES).doc(projectId));

    
})

exports.acceptProjectInvite = functions.https.onCall((data,context) => {
    var projectId = data.projectId;
    var userId = context.auth.uid;

    var batch = admin.firestore().batch();
    var memberRef = admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).doc(userId);
    batch.update(memberRef, {status: 'added' });
    
    var remoteIdsRef = admin.firestore().collection(USERS).doc(userId).collection(REMOTE_IDS).doc(projectId);
    batch.set(remoteIdsRef, {projectId: projectId} );

    return batch.commit().then( () => {
        return { status: 'complete' }
    }).catch(error => {
        return {
            status: 'error',
            message: 'Error occured accepting project invite. ' + error.message,
        }
    })
})

exports.denyProjectInvite = functions.https.onCall((data, context) => {
    var projectId = data.projectId;
    var userId = context.auth.uid;

    var memberRef = admin.firestore().collection(REMOTES).doc(projectId).collection(MEMBERS).doc(userId);

    return memberRef.update({ status: "rejected invite" }).then( () => {
        return { status: 'complete' };
    }).catch( error => {
        return {
            status: 'error',
            message: 'Error occured whilst denying project invite.' + error.message,
        }
    })
})

exports.removeRemoteProject = functions.https.onCall((data, context) => {
    var projectId = data.projectId;
    var userId = context.auth.uid;

    // Build Updates.
    var batch = admin.firestore().batch();
    batch.delete(admin.firestore().collection(REMOTES).doc(projectId));
    batch.delete(admin.firestore().collection(USERS).doc(userId).collection(REMOTE_IDS).doc(projectId));

    // Execute the Batch.
    return batch.commit().then(() => {
        return { status: 'complete' }
    }).catch(error => {
        return { 
        status: 'error',
        message: error.message
    }
    })
})


