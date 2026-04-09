# Apa itu Laravel?

<img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" style="border-radius: 20px;" alt="gambar-logo-laravel" width=256></img>

Laravel adalah sebuah framework php yang sudah menyiapkan alat-alat siap pakai. Laravel diciptakan agar programmer tidak perlu menulis kode berulang kali dari nol. Hasilnya: pembuatan website jauh lebih cepat, susunan kodenya sangat rapi, dan sistemnya berstandar industri.

## Mengenal Web Framework

Sebelum kita membahas Laravel lebih jauh, mari kita pahami terlebih dahulu apa itu **Web Framework**.

Secara sederhana, **Web Framework** adalah sebuah kerangka kerja perangkat lunak yang berisi kumpulan pustaka (*library*), alat bantu, dan aturan main yang sudah distandarisasi untuk membantu developer membangun aplikasi web.

Bayangkan kamu sedang merakit sebuah *game engine* atau mengembangkan program langsung ke sistem (*bare-metal*). Jika semuanya dilakukan dari nol, kamu harus memikirkan alokasi memori, manajemen *routing*, hingga memvalidasi input satu per satu. Proses ini tentu memakan waktu dan rentan terhadap *bug*.

Hal yang sama berlaku di pengembangan web. Jika menggunakan PHP murni (*native*), kamu harus menulis ulang kode untuk mengamankan *form*, menghubungkan *database*, dan mengatur rute URL dari awal setiap kali membuat proyek baru. Web framework hadir untuk menyelesaikan masalah ini dengan menyediakan fondasi yang sudah jadi. Developer tidak perlu lagi "menemukan kembali roda" (*reinventing the wheel*) dan bisa langsung fokus membangun fitur atau logika bisnis dari aplikasi tersebut.

### Mengapa Kita Membutuhkan Web Framework?

1. **Efisiensi Waktu:** Fitur-fitur esensial dasar seperti otentikasi (login/register), manajemen *database*, dan *routing* sudah tersedia dan siap pakai.
2. **Struktur Kode yang Rapi:** Framework memaksa kita untuk menulis kode dengan pola arsitektur tertentu (seperti MVC: *Model-View-Controller*). Hal ini membuat proyek lebih mudah dipelihara dan dikembangkan oleh banyak orang sekaligus dalam sebuah tim.
3. **Keamanan Ekstra:** Celah keamanan web yang umum, seperti injeksi SQL atau serangan XSS (*Cross-Site Scripting*), biasanya sudah ditangkal secara otomatis oleh sistem perlindungan bawaan framework.

Dengan fondasi kerangka kerja ini, pengembangan aplikasi tingkat industri menjadi jauh lebih terukur. Sekarang, mari kita berkenalan dengan salah satu framework PHP paling populer saat ini: **Laravel**.

## Sejarah Singkat Laravel: Lahir dari Sebuah Kebutuhan

Laravel diciptakan oleh **Taylor Otwell** dan pertama kali dirilis pada bulan Juni **2011**. Pada masa itu, framework PHP yang paling mendominasi adalah CodeIgniter. Meskipun populer, Taylor merasa CodeIgniter saat itu memiliki banyak keterbatasan. CodeIgniter tidak memiliki fitur bawaan untuk kebutuhan esensial yang kompleks, seperti sistem autentikasi (login/register) dan otorisasi yang aman.

Berangkat dari rasa frustrasi tersebut, Taylor membangun Laravel agar developer PHP bisa memiliki alat kerja yang modern, elegan, dan kaya fitur langsung dari "dalam kotaknya" (*out of the box*). Sejak saat itu, ekosistem Laravel berkembang pesat dan menjadi standar industri untuk pengembangan PHP modern.

## Inspirasi Besar dari Ruby on Rails

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Ruby_On_Rails_Logo.svg/960px-Ruby_On_Rails_Logo.svg.png" style="border-radius: 20px;" alt="gambar-logo-laravel" width=400></img>

Jika kamu membedah struktur dan cara kerja Laravel, Kamu akan menemukan banyak kemiripan dengan framework legendaris dari bahasa pemrograman Ruby, yaitu [**Ruby on Rails**](https://rubyonrails.org) (sering disebut Rails). Taylor Otwell secara terbuka mengakui bahwa Rails adalah salah satu inspirasi terbesar dalam mendesain Laravel.

Beberapa kesamaan filosofi mereka antara lain:

* [**Convention over Configuration (Konvensi di atas Konfigurasi)**](https://en.wikipedia.org/wiki/Convention_over_configuration): Keduanya memiliki aturan baku tentang struktur folder, penamaan file, dan nama tabel database. Selama kamu mengikuti "aturan main" ini, kamu tidak perlu menulis kode konfigurasi yang panjang lebar. Framework akan otomatis mengerti maksud Kamu.
* **Developer Happiness**: Sintaks kode Laravel dirancang agar sangat ekspresif, indah dibaca, dan terasa seperti membaca kalimat bahasa Inggris. Tujuannya agar *programmer* senang dan nyaman saat menulis kode.
* [ORM (Object-Relational Mapping)](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping): Rails terkenal dengan *ActiveRecord*-nya, sementara Laravel memiliki **Eloquent** (yang akan kita bahas nanti). Keduanya membuat interaksi dengan database menjadi sangat intuitif berbasis *Object-Oriented*, tanpa harus selalu menulis *query* SQL manual.

## Memahami Arsitektur "Monolith"

<figure>
  <img src="https://media.geeksforgeeks.org/wp-content/uploads/20240405152350/Monolithic-Architecture.webp" style="border-radius: 5px;" alt="gambar-logo-laravel" width=600></img>
<figcaption style="font-size: 12px;">ilustrasi diambil dari <a href="https://www.geeksforgeeks.org/system-design/monolithic-architecture-system-design">geeksforgeeks.org</a></figcaption>
</figure>

Satu konsep fundamental yang perlu dipahami tentang Laravel adalah pendekatannya yang secara default menggunakan arsitektur **Monolith** (Monolitik).

### Apa itu struktur Monolith?

Bayangkan sebuah aplikasi di mana **semua komponennya**—mulai dari antarmuka pengguna (tampilan HTML/CSS/JS), logika bisnis (*Controller*), sistem rute (*Routing*), hingga interaksi database (*Model*)—dibangun, dibungkus, dan dijalankan di dalam **satu wadah kode sumber (codebase) yang sama**.

Arsitektur ini sangat berbeda dengan tren *Microservices* modern (seperti yang sering dipakai oleh perusahaan raksasa), di mana bagian *frontend* (misal: React/Vue) dan *backend* (API) dipisah menjadi dua aplikasi atau *server* yang sama sekali berbeda.

### Mengapa Monolith itu bagus?

Jangan menganggap Monolith sebagai teknologi kuno. Untuk mayoritas proyek, arsitektur Monolith justru sangat diunggulkan karena:

1. **Mudah Dikelola:** Sangat cocok untuk *solo developer* atau tim kecil karena kamu hanya perlu fokus pada satu proyek (tidak perlu mengatur komunikasi antar-server).
2. **Proses Deploy Sederhana:** Mengunggah aplikasi ke *server* jauh lebih praktis dibandingkan mendeploy puluhan *microservice*.
3. **Kinerja yang Cepat untuk Proyek Standar:** Karena semua berjalan di satu tempat, tidak ada latensi jaringan antar-komponen internal.

Dengan Laravel, Kamu bisa membangun sebuah *Full-Stack Web Application* yang tangguh hanya dari satu tempat kerja.
