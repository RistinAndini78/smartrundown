# Dokumen Teknis - Smart Designer Rundown

## 1. Deskripsi Aplikasi & Latar Belakang
**Smart Designer Rundown** adalah platform manajemen jadwal acara (rundown) kolaboratif yang dirancang untuk membantu organizer acara (Wedding, Konser, Webinar) menyusun jadwal secara presisi. Latar belakang pemilihan tema ini adalah untuk mendigitalisasi proses penyusunan rundown yang biasanya masih manual (menggunakan Excel/Kertas) menjadi platform real-time yang mendukung kolaborasi tim.

## 2. Arsitektur Sistem
Aplikasi ini menggunakan arsitektur **Client-Server** dengan pembagian sebagai berikut:
- **Backend**: Node.js dengan Express.js sebagai mediator, `ws` sebagai WebSocket provider, dan **Firebase (Firestore)** sebagai Database Utama.
- **Frontend**: React (Vite) dengan Tailwind CSS untuk styling dan Framer Motion untuk animasi.
- **Desktop Wrapper**: Electron untuk menjalankan aplikasi di platform Windows/Linux.

### Alur Data:
1. Client (Web/Desktop) melakukan autentikasi ke REST API.
2. Client membuka koneksi WebSocket untuk menerima notifikasi real-time.
3. Data rundown dikelola melalui REST API dan disinkronkan secara visual di UI.

## 3. Teknologi & Framework
- **Frontend**: React 19, Lucide React (Icons), Framer Motion (Animations).
- **Backend**: Node.js, Express, WebSocket (ws).
- **Desktop**: Electron.
- **Styling**: Tailwind CSS (Modern Aesthetics).
- **Runtime**: TSX (TypeScript Execution).

## 4. Platform-Specific Features
Aplikasi ini diimplementasikan untuk dua platform utama dengan fitur unik di masing-masingnya:

### A. Web Platform (Browser)
- **Progressive Web App (PWA)**: Aplikasi dapat di-install langsung dari browser ke smartphone atau desktop dan mendukung akses offline dasar.
- **Drag & Drop UI**: Fitur penyusunan ulang jadwal menggunakan interaksi drag-and-drop yang intuitif di browser.

### B. Desktop Platform (Windows/Linux)
- **Native File System Access**: Pengguna dapat menyimpan file rundown langsung ke direktori lokal komputer (Save Dialog native).
- **System Tray Integration**: Aplikasi dapat berjalan di latar belakang dan diakses cepat melalui tray icon di taskbar.
- **Global Keyboard Shortcuts**: Akses cepat ke fungsi utama melalui tombol keyboard.

## 5. Pembagian Tugas Tim (Simulasi)
- **Backend**: Node.js dengan Express.js sebagai REST API server, `ws` sebagai WebSocket provider, dan **Firebase** sebagai Cloud Database & Authentication.
...
- **Backend Developer**: Membangun REST API, WebSocket server, dan integrasi **Firebase Cloud Integration**.
- **Frontend Developer**: Mendesain UI/UX yang premium, integrasi API Firebase, dan sistem animasi.
- **DevOps/Integration**: Konfigurasi Electron untuk desktop, setup PWA, dan manajemen environment.

---
*Dibuat untuk memenuhi Ketentuan Teknis Proyek Pengembangan Aplikasi Multiplatform.*
