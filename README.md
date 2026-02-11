# 🚀 WhatsApp Termux Premium v1.0

Script WhatsApp berbasis CLI (Command Line Interface) yang ringan, cepat, dan dioptimalkan khusus untuk pengguna Termux. Memungkinkan Anda mengelola pesan WhatsApp langsung dari terminal dengan fitur manajemen sesi yang canggih.

## ✨ Fitur Unggulan

* **3 Metode Login Fleksibel:**
    1.  **Scan QR Code:** Login cepat menggunakan pemindaian kamera.
    2.  **Pairing Code:** Login hanya dengan nomor HP (Tanpa perlu scan kamera).
    3.  **Direct Login:** Masuk otomatis menggunakan sesi yang tersimpan (Tanpa login ulang).
* **Auto-Clear UI:** Tampilan bersih dan rapi. Layar otomatis dibersihkan setiap berpindah menu.
* **Bookmark System:** Simpan nomor-nomor penting Anda secara permanen. Tidak perlu mengetik nomor manual setiap saat.
* **Advanced Chat Management:**
    * Kirim pesan real-time.
    * Lihat riwayat pesan terbaru.
    * Edit pesan (Fix typo).
    * Tarik pesan (*Delete for everyone*).
* **Safety Reset:** Menu khusus untuk logout dan menghapus sesi akun secara bersih.

## 🛠️ Persyaratan Sistem (Termux)

Pastikan Anda menggunakan versi Termux terbaru dan sudah menginstal paket-paket berikut:

- Node.js
- Chromium Browser
- TUR Repo (Untuk Chromium terbaru)

## 📦 Langkah Instalasi

Buka Termux dan jalankan perintah di bawah ini secara berurutan:

```
# Update sistem
apt update && apt upgrade -y
```

# Instal Node.js dan library dasar
```
pkg install nodejs git -y
```

# Instal Repositori TUR dan Chromium (Penting untuk Termux)
```
pkg install tur-repo -y
pkg install chromium -y
```

# Clone atau download script ini
```
git clone https://github.com/Fitunnel/wa-termux
cd wa-termux
```

# Instal dependensi library
```
npm install whatsapp-web.js qrcode-terminal
```

# Jalankan 
```
chmod +x wa.sh
./wa.sh

```

### 🗑️ Cara Uninstall

Jika Anda ingin menghapus script dan seluruh dependensinya dari Termux, jalankan perintah berikut:

**Hapus folder proyek:**
   ```
   cd ~
   rm -rf wa-termux
   npm uninstall whatsapp-web.js qrcode-terminal
   ```
   ```
pkg uninstall nodejs chromium tur-repo -y
pkg autoremove
   ```
