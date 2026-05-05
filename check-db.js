const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBgqsxDktCkAtTF3fzhx61WiE-u9B1jr0c',
  projectId: 'smartdesigner-13d73'
};
const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users?key=${FIREBASE_CONFIG.apiKey}`;
fetch(url).then(r=>r.json()).then(d=>console.log(JSON.stringify(d, null, 2)));
