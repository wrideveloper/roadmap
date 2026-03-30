# Apa itu MVC?

<img src="https://miro.medium.com/v2/resize:fit:1400/0*DxAonfN3QtNnLrEE.png" style="background-color: white; border-radius: 20px;" alt="gambar-mvc-1" width=600></img>

Di dunia Backend Developer, MVC adalah Pemisahan Kekuasaan (*Separation of Concerns*).

1. **Model (The Data Logic):** Jantung dari aplikasi. Ia tidak peduli bagaimana data ditampilkan, ia hanya peduli pada validasi, interaksi database, dan *business rules*.
2. **View (The Presentation):** Wajah dari aplikasi. Hanya bertugas menampilkan apa yang dikirim oleh Controller. Di era modern, View seringkali berupa JSON (untuk API).
3. **Controller (The Brain/Traffic Cop):** Jembatan utama. Ia menerima *request* dari *user*, memanggil Model untuk ambil data, lalu memutuskan View mana yang harus dikirim balik.

## Alur Kerja MVC (The Lifecycle)

<img src="/miniclass/backend/assets/mvc/alur-kerja-mvc.png" style="background-color: white; border-radius: 20px;" alt="Task-Tracker-App" width=600></img>

<br>

1. **User Request:** User menekan tombol di frontend/web dan memanggil URL (misal: `GET /tasks`).
2. **Controller (The Gatekeeper):**
    * Menerima *request* tersebut.
    * **Validasi:** Cek dulu, datanya benar tidak? Usernya punya akses tidak? (Ini langkah krusial agar aplikasi aman).
3. **Model (The Worker):**
    * Controller bilang ke Model: "Eh Model, ambilin daftar tugas dong" atau "Simpan data baru ini ya".
    * Model melakukan tugas beratnya (interaksi ke database).
4. **Controller (The Final Touch):**
    * Controller kasih datanya kembali ke Model.
    * Controller membungkus data tersebut (bisa jadi dalam bentuk JSON atau dilempar ke file Blade/HTML).
5. **View (The Result):** User menerima jawaban (Response) yang sudah cantik dan bisa dibaca di layar mereka.

## Analogi Cepat

Bayangkan MVC adalah sebuah Restoran:

* **Model:** Koki di dapur (mengolah bahan makanan).
* **View:** Piring sajian yang sampai ke meja pelanggan.
* **Controller:** Pelayan (mengambil pesanan, lapor ke koki, mengantar piring).
