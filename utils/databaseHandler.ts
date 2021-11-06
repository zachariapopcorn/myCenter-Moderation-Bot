import admin = require('firebase-admin');

require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.project_id,
        clientEmail: process.env.client_email,
        privateKey: process.env.private_key
    })
});

const db = admin.firestore();

export let rawDatabase = db

export async function get(collection : string, document : string, key : string) {
    let generalData
    try {
        generalData = await db.collection(collection).doc(document).get();
    } catch(e) {
        throw e;
    }
    return generalData.get(key);
}

export async function set(collection : string, document : string, newData : any) {
    try {
        await db.collection(collection).doc(document).set(newData)
    } catch(e) {
        throw e;
    }
}

export async function create(collection : string, newDocument: string, newData: any) {
    try {
        await db.collection(collection).doc(newDocument).create(newData);
    } catch(e) {
        throw e;
    }
}

export async function del(collection : string, document: string) {
    try {
        await db.collection(collection).doc(document).delete();
    } catch(e) {
        throw e;
    }
}