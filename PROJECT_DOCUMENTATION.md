# Dokumentasi Lengkap Project: SmartDesigner (SmartRundown)

## 1. Judul Project
**SmartDesigner (SmartRundown v2.0)**  
Aplikasi cerdas berbasis web dan desktop (Electron) untuk manajemen susunan acara (*rundown*) secara profesional, interaktif, dan kolaboratif.

---

## 2. Deskripsi Sistem
**Gambaran Umum Aplikasi:**  
SmartDesigner adalah platform sistem manajemen jadwal acara terintegrasi yang memfasilitasi pembuatan, pengelolaan, hingga eksekusi *rundown* acara. Platform ini dibagi untuk dua entitas utama: **Sahabat Kreatif (User/Event Organizer)** yang berfokus pada perancangan acara, dan **System Admin** yang memegang kendali sistem secara keseluruhan.

**Tujuan Sistem:**  
Menyediakan lingkungan kerja (*workspace*) terpusat agar tim penyelenggara acara (Wedding, Konser, Webinar, dll) dapat menyusun agenda dengan lebih terstruktur, minim kesalahan, dan efisien.

---

## 3. Latar Belakang
**Masalah yang Ingin Diselesaikan:**  
Secara tradisional, penyusunan *rundown* sering kali dilakukan secara manual menggunakan *spreadsheet* (seperti Excel) atau bahkan kertas cetak. Metode ini memiliki banyak kelemahan:
1. Rentan terhadap kesalahan sinkronisasi (miskomunikasi) saat terjadi perubahan mendadak di lapangan.
2. Sulit untuk memantau sisa durasi acara secara *real-time*.
3. Kolaborasi antar tim terhambat karena sulitnya *tracking* revisi dokumen.
Sistem ini dibangun untuk mendigitalisasi proses tersebut dengan membawa fitur *real-time*, akses tersentralisasi melalui *Cloud*, dan visualisasi jadwal acara yang interaktif.

---

## 4. Fitur Utama
1. **Sistem Autentikasi Multilevel (RBAC)**  
   - **User (Sahabat Kreatif):** Akses pembuatan dan manajemen *rundown* pribadi.  
   - **System Admin:** Akses tingkat dewa (root) untuk *monitoring* seluruh *rundown*, pengguna, sistem, dan keamanan.
2. **Interactive Rundown Editor**  
   Penyusunan jadwal menggunakan sistem kolom dinamis (Waktu, Aktivitas, Durasi, PIC, Keterangan).
3. **Smart Dashboard & Analytics**  
   Menyajikan statistik distribusi *rundown* (Aktif, Draft, Selesai) secara visual, baik untuk ringkasan *personal* (User) maupun *global* (Admin).
4. **Live Mode Event Execution**  
   Mode eksekusi langsung dengan jam/timer *real-time* yang dapat diikuti saat acara sedang berlangsung.
5. **Real-Time Collaboration & Notification**  
   Notifikasi sinkron (didukung *WebSocket*) dan fitur kolaborasi tim pada suatu proyek *rundown*.
6. **Export & Sharing Document**  
   Mendukung konversi dan ekspor *rundown* ke berbagai format digital (*Word, PDF*) yang rapi dan terstandarisasi.
7. **Template Management**  
   Sistem *template* untuk jenis acara yang repetitif sehingga mempercepat alur kerja (*workflow*) pembuatan acara baru.

---

## 5. Teknologi yang Digunakan
Berdasarkan `package.json` dan struktur proyek, teknologi yang terlibat adalah:

**Frontend (Client-Side):**
- **React (v19):** Library utama untuk membangun antarmuka pengguna UI.
- **TypeScript:** Digunakan untuk penulisan kode dengan *static typing* guna meminimalisir *bug*.
- **Vite:** *Build tool* dan *module bundler* super cepat pengganti Webpack.
- **Tailwind CSS (v4):** *Utility-first* *CSS framework* untuk gaya antarmuka yang modern, *responsive*, dan fleksibel.
- **Framer Motion (`motion/react`):** Sistem *engine* animasi deklaratif untuk membuat transisi aplikasi menjadi halus.
- **Lucide React:** Paket *iconography* modern untuk aset vektor (ikon UI).

**Backend & Database:**
- **Firebase (Auth & Firestore):** Digunakan sebagai pusat data Cloud. Komunikasi dilakukan menggunakan *REST API* langsung (tanpa SDK tebal) untuk mengoptimalkan performa (di `src/lib/firebase.ts`).
- **Node.js & Express:** (Pada `server.ts`) Digunakan sebagai *middleware* atau *development server*.
- **WebSocket (`ws`):** Menangani koneksi komunikasi *real-time* dua arah antara klien dan server.

**Desktop Environment:**
- **Electron:** Membawa aplikasi web ini agar dapat di-*build* dan dijalankan secara *native* sebagai aplikasi Desktop (Windows/Linux/Mac).

---

## 6. Struktur Project
```text
e:\project\SmartDesigner\
├── package.json              # Dependensi dan script NPM
├── server.ts                 # Server express & websocket
├── index.html                # Entry file HTML utama 
├── src/
│   ├── App.tsx               # Root Component & State-based Router
│   ├── main.tsx              # React DOM render entry
│   ├── types.ts              # Definisi interface TypeScript global
│   ├── index.css             # Entri utama Tailwind dan CSS variabel
│   ├── lib/
│   │   └── firebase.ts       # Service layer untuk Firebase Auth & Firestore
│   └── components/
│       ├── Login.tsx                 # Autentikasi pengguna
│       ├── Dashboard.tsx             # Panel analitik & ringkasan
│       ├── Sidebar.tsx & TopBar.tsx  # Komponen navigasi UI
│       ├── RundownEditor.tsx         # Modul inti pengeditan tabel rundown
│       ├── RundownManagement.tsx     # (Admin) Pengawasan rundown global
│       ├── UserManagement.tsx        # (Admin) Pengaturan seluruh akun
│       ├── Templates.tsx             # Pemilihan template event
│       └── LiveMode.tsx              # Antarmuka monitoring real-time
```
**Fungsi Utama:**
- `src/components/`: Menampung seluruh modul UI dari aplikasi.
- `src/lib/`: Menampung logika eksternal dan perantara koneksi API pihak ketiga.
- `src/App.tsx`: Pusat kontrol yang mengatur lalu lintas halaman mana yang akan di-*render* (Router).

---

## 7. Arsitektur / Cara Kerja Sistem
Aplikasi ini berjalan menggunakan pendekatan **Client-Server** terdistribusi:
1. **Inisialisasi Web:** Aplikasi dimuat melalui Vite (atau Electron), lalu *state manager* lokal di `App.tsx` akan membaca status sesi (`localStorage`).
2. **Autentikasi (REST API):** Pengguna masuk via `Login.tsx`. Request dikirim melalui *Google Identity Toolkit API*. Jika sukses, *token* dan *localId* didapatkan.
3. **Database Pulling:** Komponen mengirim permintaan `GET/PATCH` ke *Google Firestore REST API* melalui layer perantara (`firebase.ts`).
4. **State Management & Routing:** Semua navigasi diatur tanpa memuat ulang browser (SPA / *Single Page Application*). Data pengguna dan *project* terpilih di-oper (*passing props*) antar komponen.
5. **Real-time Push Notification:** Di belakang layar, Web Client akan menyambungkan port `ws://localhost:3000`. Jika terjadi pembaruan (seperti peringatan sistem), *server* mem-push pesan langsung ke antarmuka aplikasi.

---

## 8. Penjelasan Komponen / Modul
- **`App.tsx` (Router Utama):** Pengontrol pusat. Menyimpan state *User Role* dan *Active Screen*. Bertugas menukar halaman (misal: dari `dashboard` beralih ke `editor`).
- **`Dashboard.tsx`:** Mengambil seluruh koleksi *rundown* dari Firestore. Memfilter berdasarkan *Author Email* apabila yang *login* adalah User, dan menampilkan kalkulasi statis data.
- **`firebase.ts`:** Menjadi *wrapper* dari fetch API bawaan peramban (*browser*). Secara asinkron mengurus operasi CRUD (Create, Read, Update, Delete) agar modul utama UI tidak bercampur dengan logika HTTP.
- **`RundownEditor.tsx`:** Modul paling vital. Berisi kerumitan *state* untuk menambahkan baris jadwal, menghitung selisih jam (*durasi*), serta mengamankan dan mempublikasikan data ke *Cloud*.

---

## 9. Alur Penggunaan (User Journey)
1. **Pendaftaran / Masuk (Login):**
   - Pengguna masuk ke sistem.
   - Sistem memverifikasi *Role* (Admin vs User biasa).
2. **Dashboard Overview:**
   - Masuk ke menu utama, pengguna melihat statistik performa acara yang ia kelola dan memilih opsi "Buat Rundown Baru".
3. **Inisialisasi Project:**
   - Pengguna mengetik nama acara, tanggal, dan memilih basis *Template* (misal: Pernikahan, Seminar).
4. **Penyusunan (Editor):**
   - Di halaman `RundownEditor`, pengguna mengisi detil jam demi jam, menambahkan tanggung jawab PIC, menentukan keterangan. Setiap perubahan dapat langsung disimpan ke Firestore (*Cloud Save*).
5. **Eksekusi & Export:**
   - Setelah jadwal selesai, pengguna bisa mencetak hasilnya ke PDF (melalui modul *Export*) atau langsung memutar *Live Mode* tepat di hari-H acara berlangsung.
