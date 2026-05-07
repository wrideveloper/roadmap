# Studi Kasus 2: Restoran Gao Haiming

<img src="../../assets/gaohaiming.webp" style="border-radius: 10px;" alt="gao haiming" width=600></img>



**Konteks Cerita:** 
Kalian baru saja menerima kunci ruang server Pentium II dari Gao Haiming. Namun, sebelum kalian bisa mulai merapikan data restoran, Gao menahan kalian di ambang pintu.

"Tunggu sebentar," ucapnya dengan mata menyipit curiga. "Sistem digital ini... apakah pesaing bisnisku bisa dengan mudah melihatnya? Aku punya banyak musuh di luar sana. Sebelum kalian membangun sistem utamanya, buatkan aku sebuah gembok digital. Hanya orang-orang yang kuizinkan yang boleh masuk ke dalam sistem ini!"

Langkah pertama kalian untuk menyelamatkan perusahaan ini (dan diri kalian sendiri) adalah membangun sistem autentikasi yang solid. Gao Haiming tidak mentolerir celah keamanan sedikit pun.

---

## Misi Kalian (Backend RESTful API)

Buatkan kumpulan Endpoint API (tanpa antarmuka web/HTML) untuk mengelola data restoran berikut:

### 1. Manajemen Kategori Makanan (Tipe Makanan)
Sebelum memasukkan nama makanan, sistem (database) harus memiliki kategorinya terlebih dahulu (contoh: Takjil, Makanan Utama, Minuman, Pencuci Mulut).
*   **Create & Update:** Endpoint (API) untuk menambahkan kategori baru dan mengedit nama kategori yang sudah ada. Jangan lupa berikan validasi data masuk (Form Request).
*   **Read:** Endpoint untuk menampilkan daftar kategori yang tersedia dalam format JSON.
*   **Delete:** Endpoint untuk menghapus kategori. *(Pikirkan logikanya di level Database: bagaimana jika kategori dihapus tapi masih ada makanan di dalamnya? Atur Migration-nya agar jika kategori dihapus, makanan otomatis ikut terhapus).*

### 2. Manajemen Item Makanan (Menu Makanan)
Ini adalah data utama hidangan restoran. Setiap makanan wajib terhubung (berelasi *One-to-Many*) ke salah satu Kategori Makanan di atas.
*   **Input Fields Wajib:** Nama Makanan, Harga, Deskripsi Singkat, dan ID Kategori (sebagai *Foreign Key*).
*   **Create & Update:** Endpoint untuk menambah menu baru dan mengubah detail menu (misal: harga naik jelang lebaran). Pastikan divalidasi dengan Form Request.
*   **Read:** Endpoint untuk menampilkan daftar makanan. Gunakan **API Resource** agar output JSON-nya rapi. Pastikan JSON yang keluar juga menampilkan informasi asal kategorinya, bukan cuma ID kategorinya saja.
*   **Delete:** Endpoint untuk menghapus menu makanan yang sudah tidak dijual.

---

## Kondisi Keberhasilan (The Victory State)

*   Data makanan dan kategori harus benar-benar tersimpan dan bisa dimanipulasi melalui *request* HTTP (Postman/ThunderClient), mengubah data yang ada di Database (MySQL/SQLite).
*   Relasi antar tabel/koleksi di database (Kategori <--> Makanan) berjalan dengan baik.
*   Response API wajib berformat JSON yang terstruktur rapi.

