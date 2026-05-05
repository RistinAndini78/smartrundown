const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBgqsxDktCkAtTF3fzhx61WiE-u9B1jr0c",
  projectId: "smartdesigner-13d73"
};

async function createAdmin() {
  const email = "admin@smartdesigner.com";
  const password = "adminpassword123";

  // 1. Create User in Auth
  const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`;
  const authRes = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  
  const authData = await authRes.json();
  
  if (!authRes.ok) {
    if (authData.error.message === 'EMAIL_EXISTS') {
      console.log('Admin user already exists in auth. Let us sign in to get localId.');
      const loginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
         await saveFirestore(loginData.localId, email);
      } else {
         console.error('Login failed', loginData);
      }
      return;
    }
    console.error('Auth Error:', authData);
    return;
  }

  await saveFirestore(authData.localId, email);
}

async function saveFirestore(localId, email) {
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${localId}?key=${FIREBASE_CONFIG.apiKey}`;
  
  const fields = {
    name: { stringValue: "System Admin" },
    email: { stringValue: email },
    role: { stringValue: "admin" }
  };

  const dbRes = await fetch(firestoreUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  
  const dbData = await dbRes.json();
  if (!dbRes.ok) {
    console.error('Firestore Error:', dbData);
  } else {
    console.log('Admin account created/updated successfully!');
    console.log('Email:', email);
    console.log('Password: adminpassword123');
  }
}

createAdmin();
