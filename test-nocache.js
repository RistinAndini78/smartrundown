const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBgqsxDktCkAtTF3fzhx61WiE-u9B1jr0c',
  projectId: 'smartdesigner-13d73'
};
const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/rundowns?key=${FIREBASE_CONFIG.apiKey}&nocache=123`;
fetch(url).then(r=>console.log(r.status, r.statusText)).catch(console.error);
