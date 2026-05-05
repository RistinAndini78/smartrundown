// src/lib/firebase.ts

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBgqsxDktCkAtTF3fzhx61WiE-u9B1jr0c",
  authDomain: "smartdesigner-13d73.firebaseapp.com",
  projectId: "smartdesigner-13d73",
  storageBucket: "smartdesigner-13d73.firebasestorage.app",
  messagingSenderId: "85216444341",
  appId: "1:85216444341:web:65ff04c556fbe983bba3fc",
};

export async function firebaseRegister(email: string, password: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_CONFIG.apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message);
  return data;
}

export async function firebaseLogin(email: string, password: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error.message);
  return data;
}

/**
 * Robust Save Function
 */
export async function firestoreSave(collection: string, documentId: string, data: any) {
  // Gunakan PATCH dengan updateMask untuk memastikan data terkirim dengan benar
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/${collection}/${documentId}?key=${FIREBASE_CONFIG.apiKey}`;
  
  const fields: any = {};
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      fields[key] = { stringValue: String(data[key]) };
    }
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Firestore Save Error:', errorData);
    throw new Error(errorData.error?.message || 'Gagal menyimpan ke Firestore');
  }
  
  return response.json();
}

/**
 * Get Single Doc Function
 */
export async function firestoreGetDoc(collection: string, documentId: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/${collection}/${documentId}?key=${FIREBASE_CONFIG.apiKey}`;
  const response = await fetch(url);
  const doc = await response.json();
  
  if (!response.ok) return null;

  const obj: any = { id: doc.name.split('/').pop() };
  for (const key in doc.fields) {
    const fieldData = doc.fields[key];
    obj[key] = fieldData.stringValue || fieldData.integerValue || fieldData.doubleValue || '';
  }
  return obj;
}

/**
 * Robust Get Docs Function
 */
export async function firestoreGetDocs(collection: string) {
  // Hapus parameter nocache karena Firestore REST API menolak query parameter yang tidak dikenal (400 Bad Request)
  // Sebagai gantinya, gunakan fetch options cache: 'no-store'
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/${collection}?key=${FIREBASE_CONFIG.apiKey}`;
  
  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();
  
  if (!response.ok) {
    console.error('Firestore Fetch Error:', data);
    return [];
  }

  if (!data.documents) return [];

  return data.documents.map((doc: any) => {
    const obj: any = { id: doc.name.split('/').pop() };
    for (const key in doc.fields) {
      // Handle data Firestore yang dibungkus stringValue
      const fieldData = doc.fields[key];
      obj[key] = fieldData.stringValue || fieldData.integerValue || fieldData.doubleValue || '';
    }
    return obj;
  });
}

/**
 * Delete Document Function
 */
export async function firestoreDelete(collection: string, documentId: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/${collection}/${documentId}?key=${FIREBASE_CONFIG.apiKey}`;
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Gagal menghapus dari Firestore');
  }
  return true;
}
