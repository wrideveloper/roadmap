# Chapter 5: Web Requests, Burp Repeater, and Content Discovery

## 1. Pendahuluan

Aplikasi web adalah **attack surface** terbesar pada hampir setiap engagement penetration testing. Satu domain bisa mengekspos puluhan endpoint, form, API, panel admin, dan file yang tidak pernah ditautkan dari halaman mana pun. Chapter 4 berhenti pada pemetaan endpoint dan service; chapter ini masuk satu level lebih dalam: bagaimana sebuah **HTTP request** dibentuk, bagaimana ia ditangkap dan diubah, dan bagaimana resource tersembunyi ditemukan secara sistematis.

### 1.1 Tujuan Pembelajaran

- Mengidentifikasi komponen HTTP request: request line, header, dan body.
- Menjelaskan cara kerja web proxy dan mekanisme *intercept*.
- Mengonfigurasi Burp Suite, browser, dan sertifikat HTTPS untuk lab.
- Memakai **Repeater** untuk menguji satu request secara manual dan membandingkan response.
- Menjalankan `ffuf` dengan wordlist SecLists dan membaca hasilnya tanpa terjebak false positive.

### 1.2 Prasyarat

- Chapter 3 (Nmap dan service enumeration) dan Chapter 4 (enumeration & attack surface mapping).
- Burp Suite terpasang — lihat panduan instalasi di `tools-dan-lab-platform`.
- `ffuf` dan SecLists terpasang di mesin kerja.
- Browser dengan profil terpisah untuk lab.
- Akses ke lab yang disediakan pengajar.

### 1.3 Lingkungan Lab

Lab chapter ini menyediakan dua service pada satu host:

| Service    | URL                  | Fungsi                                                                   |
| ---------- | -------------------- | ------------------------------------------------------------------------ |
| `http101`  | `http://<IP>:8080`   | Demo struktur request, method, header, cookie, redirect, dan error       |
| `fuzzlab`  | `http://<IP>`        | Target directory, page, recursion, vhost, parameter, dan value fuzzing   |

`fuzzlab` memakai dua vhost: `academy.lab` dan `admin.academy.lab`. Tambahkan entri hosts berikut agar nama vhost resolve ke host lab:

```bash
echo "<IP> academy.lab admin.academy.lab" | sudo tee -a /etc/hosts
```

Verifikasi lab hidup sebelum mulai:

```bash
curl -si http://<IP>
```

Harapan: baris status `HTTP/1.1 200 OK`, isi `robots.txt` yang menyebut `/backup/`, dan kode `200` untuk `/blog/`.

::: warning
Ganti `<IP>` dengan alamat lab yang diberikan pengajar. Jangan pernah mengarahkan perintah chapter ini ke sistem publik tanpa izin tertulis — fuzzing dan intercept adalah aktivitas aktif yang dapat tercatat sebagai serangan.
:::

---

## 2. HTTP Request 101

### 2.1 HTTP dalam Satu Menit

**HTTP** adalah protokol request–response antara **client** (browser, `curl`, `ffuf`) dan **server**. Client mengirim request, server membalas response, lalu koneksi selesai atau dipakai ulang. HTTP bersifat **stateless**: server tidak mengingat request sebelumnya kecuali client mengirim penanda, biasanya cookie.

HTTP/1.1 merepresentasikan pesan sebagai teks yang bisa dibaca manusia. **HTTPS** adalah HTTP yang dibungkus **TLS** — isinya sama, hanya terenkripsi di jalur. **HTTP/2** mengubah framing menjadi biner dan memungkinkan multiplexing, tetapi komponen logisnya tetap sama: method, path, header, body, status code. Semua yang dipelajari di chapter ini berlaku pada ketiganya.

### 2.2 Anatomi HTTP Request

![http](/miniclass/cyber/assets/penetration-testing/http.png)

Satu request terdiri dari tiga bagian:

1. **Request line** — method, path, dan versi HTTP.
2. **Headers** — metadata berbentuk `Nama: nilai`, satu per baris.
3. **Body** — opsional; hanya ada pada method yang mengirim data.

| Bagian        | Contoh              | Fungsi                                              |
| ------------- | ------------------- | --------------------------------------------------- |
| Method        | `GET`               | Menentukan aksi yang diminta                        |
| Path          | `/api/users`        | Resource yang dituju                                |
| Query string  | `?id=1`             | Parameter tambahan di URL                           |
| HTTP version  | `HTTP/1.1`          | Versi protokol yang dipakai client                  |

Contoh request lengkap ke `http101`:

```http
GET /api/users?id=1 HTTP/1.1
Host: <IP>:8080
User-Agent: Mozilla/5.0
Accept: application/json
```

Baris kosong setelah header menandakan akhir header. Jika ada body, body dimulai setelah baris kosong tersebut:

```http
PUT /api/profile HTTP/1.1
Host: <IP>:8080
Content-Type: application/json
Content-Length: 29

{"name":"Budi","role":"user"}
```

### 2.3 HTTP Methods

| Method    | Fungsi                                      | Idempotent | Contoh di `http101`                    |
| --------- | ------------------------------------------- | ---------- | -------------------------------------- |
| `GET`     | Mengambil resource                          | Ya         | `GET /api/users?id=1`                  |
| `POST`    | Mengirim data atau memicu proses            | Tidak      | `POST /login`                          |
| `PUT`     | Mengganti seluruh representasi resource     | Ya         | `PUT /api/profile`                     |
| `PATCH`   | Mengubah sebagian resource                  | Tidak      | `PATCH /api/profile` → `404` di lab    |
| `DELETE`  | Menghapus resource                          | Ya         | `DELETE /api/users?id=1` → `404`       |
| `HEAD`    | `GET` tanpa body response                   | Ya         | `HEAD /`                               |
| `OPTIONS` | Menanyakan method yang didukung             | Ya         | `OPTIONS /api/users` → `204` + `Allow` |

**Idempotent** berarti pengulangan request yang sama memberi efek akhir yang sama. Ini bukan jaminan keamanan, tetapi penting saat menguji: `POST /login` yang diulang bisa menambah percobaan login, sedangkan `PUT /api/profile` yang diulang tidak menggandakan resource.

`OPTIONS /api/users` pada lab membalas `204 No Content` dengan header `Allow: GET, OPTIONS`. Response ini membocorkan method yang didukung tanpa perlu menebak.

### 2.4 Headers

| Header           | Contoh                              | Fungsi                                        | Kenapa diuji                                              |
| ---------------- | ----------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| `Host`           | `<IP>:8080`                         | Memilih virtual host di server                | Vhost routing, cache poisoning, host header injection     |
| `User-Agent`     | `Mozilla/5.0`                       | Identitas client                              | Filter bot, akses konten khusus, deteksi tool             |
| `Accept`         | `application/json`                  | Format response yang diinginkan               | Content negotiation, error handling                       |
| `Content-Type`   | `application/json`                  | Format body yang dikirim                      | Parsing berbeda per tipe, bypass validasi                 |
| `Content-Length` | `29`                                | Panjang body dalam byte                       | Request smuggling, batas parser                           |
| `Cookie`         | `auth=demo-token`                   | Penanda sesi dari client                      | Session fixation, akses tanpa login                       |
| `Authorization`  | `Bearer <token>`                    | Kredensial untuk API                          | Token lemah, scope berlebih                               |
| `Referer`        | `http://<IP>/login`                 | Halaman asal request                          | CSRF check, logika redirect                               |
| `Origin`         | `http://<IP>`                       | Asal request untuk CORS                       | CORS misconfiguration                                     |

::: tip
Nama header **case-insensitive** (`content-type` sama dengan `Content-Type`), tetapi nilainya umumnya case-sensitive. Beberapa server juga menerima header duplikat dengan nilai berbeda — perilaku yang justru menarik untuk diuji.
:::

### 2.5 Body dan Content-Type

Body membawa data. Formatnya ditentukan header `Content-Type`. Tiga format yang paling sering ditemui:

**URL-encoded** — pasangan kunci-nilai dipisah `&`, karakter khusus di-encode:

```http
POST /login HTTP/1.1
Host: <IP>:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 33

username=budi&password=belajar123
```

**JSON** — struktur bersarang, dipakai banyak API:

```http
PUT /api/profile HTTP/1.1
Host: <IP>:8080
Content-Type: application/json
Content-Length: 44

{"name":"Budi","role":"admin","active":true}
```

**Multipart** — dipakai untuk unggah file; setiap bagian punya header sendiri dan dipisahkan **boundary**:

```http
POST /upload HTTP/1.1
Host: <IP>:8080
Content-Type: multipart/form-data; boundary=----lab

------lab
Content-Disposition: form-data; name="file"; filename="catatan.txt"
Content-Type: text/plain

isi file
------lab--
```

`Content-Length` harus cocok dengan jumlah byte body. Jika `Content-Type` tidak cocok dengan isi body, server bisa membalas `415 Unsupported Media Type`, gagal parsing, atau — pada implementasi longgar — memproses data dengan asumsi yang salah. Perbedaan cara parser membaca body inilah yang sering menjadi akar bug validasi.

### 2.6 Query, Body, dan Path Parameter

| Jenis    | Contoh                    | Terlihat di                                  | Kapan dipakai                                  |
| -------- | ------------------------- | -------------------------------------------- | ---------------------------------------------- |
| Query    | `/api/users?id=1`         | URL, log akses, history browser, proxy       | Filter, pencarian, parameter `GET`             |
| Body     | `username=budi&password=` | Proxy dan log aplikasi, tidak di URL         | Data sensitif, form submit, API `POST`/`PUT`   |
| Path     | `/api/users/12`           | URL, log, routing                            | Identitas resource yang hierarkis              |

Contoh gabungan: `/api/users/12?role=admin` — path menunjuk user 12, query menambahkan filter role.

Data di query string lebih mudah bocor lewat log, Referer, dan screenshot. Data di body tidak muncul di URL, tetapi tetap terlihat oleh proxy dan aplikasi. Tidak ada yang benar-benar tersembunyi dari tester yang menguasai salah satu titik tersebut.

### 2.7 Anatomi HTTP Response

```http
HTTP/1.1 200 OK
Server: nginx
Content-Type: application/json
Content-Length: 36
Set-Cookie: demo_session=lab-session; HttpOnly; Path=/

{"id":1,"name":"Budi","role":"user"}
```

Baris pertama adalah **status line**: versi HTTP, status code, dan reason phrase. Setelah header dan baris kosong, body berisi data.

| Class | Arti              | Contoh                                       |
| ----- | ----------------- | -------------------------------------------- |
| `1xx` | Informational     | `100 Continue`                               |
| `2xx` | Sukses            | `200 OK`, `201 Created`, `204 No Content`    |
| `3xx` | Redirect          | `301 Moved Permanently`, `302 Found`         |
| `4xx` | Kesalahan client  | `400`, `401`, `403`, `404`, `405`            |
| `5xx` | Kesalahan server  | `500 Internal Server Error`, `503`           |

Kode yang paling sering muncul saat fuzzing:

| Kode  | Arti                          | Implikasi saat fuzzing                                    |
| ----- | ----------------------------- | --------------------------------------------------------- |
| `200` | OK                            | Resource ada dan dapat diakses                            |
| `201` | Created                       | Request berhasil membuat resource                         |
| `204` | No Content                    | Berhasil, tanpa body — sering pada `OPTIONS`              |
| `301` | Moved Permanently             | Resource ada, pindah permanen — biasanya direktori        |
| `302` | Found                         | Resource ada, redirect sementara                          |
| `307` | Temporary Redirect            | Redirect yang mempertahankan method                       |
| `400` | Bad Request                   | Input ditolak; endpoint ada                               |
| `401` | Unauthorized                  | Endpoint ada, butuh autentikasi                           |
| `403` | Forbidden                     | Endpoint ada, tetapi ditolak                              |
| `404` | Not Found                     | Umumnya tidak ada — kecuali catch-all                     |
| `405` | Method Not Allowed            | Path ada, method salah                                    |
| `500` | Internal Server Error         | Endpoint ada; input memicu error tak tertangani           |
| `503` | Service Unavailable           | Server sibuk atau diblokir                                |

Saat fuzzing, `403` bukan berarti "tidak ada". Justru sebaliknya: server mengenali path tersebut dan menolak akses. `500` juga bukan "tidak ada" — sering menandakan input mencapai kode yang rapuh.

### 2.8 Cookie dan Session

Karena HTTP stateless, server menitipkan penanda sesi lewat header `Set-Cookie` pada response. Browser menyimpan cookie dan mengirimkannya kembali pada header `Cookie` di request berikutnya.

```http
HTTP/1.1 200 OK
Set-Cookie: demo_session=lab-session; HttpOnly; Path=/
```

Atribut cookie yang perlu diperhatikan:

| Atribut    | Arti                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `HttpOnly` | Cookie tidak dapat dibaca JavaScript — mengurangi dampak XSS          |
| `Secure`   | Cookie hanya dikirim melalui HTTPS                                    |
| `SameSite` | Membatasi pengiriman lintas situs — mitigasi CSRF                     |
| `Path`     | Cakupan path cookie                                                   |
| `Domain`   | Domain yang berhak menerima cookie                                    |

::: warning
Jangan menyalin token atau session asli ke laporan, screenshot, atau chat. Ganti dengan nilai dummy, dan catat hanya bukti yang diperlukan.
:::

### 2.9 Melihat Request Secara Langsung

**DevTools** — buka Developer Tools → tab **Network**, muat ulang halaman, pilih satu request, lalu periksa **Headers**, **Payload**, dan **Response**. Ini cara tercepat melihat request yang dihasilkan browser sendiri.

**`curl -v`** — menampilkan request dan response beserta detail koneksi:

```bash
curl -v http://<IP>:8080/
```

**`curl -i`** — hanya response, tetapi header ikut ditampilkan:

```bash
curl -i http://<IP>:8080/
```

**Request dengan body** — `POST /login` ke lab:

```bash
curl -i -X POST -d 'username=budi&password=belajar123' http://<IP>:8080/login
```

Harapan: `302 Found` dengan `Location: /profile` dan `Set-Cookie: auth=demo-token; HttpOnly; Path=/`.

Di sisi server, `journalctl -u <service>` dapat menunjukkan request yang datang jika pengajar mengaktifkan logging. Ini berguna untuk memastikan request yang terlihat di proxy benar-benar sampai ke target.

### 2.10 Kenapa Ini Penting untuk Pentest

Setiap bagian request adalah **input surface** yang bisa diuji:

| Bagian  | Contoh di lab                          | Yang diuji                                      |
| ------- | -------------------------------------- | ----------------------------------------------- |
| Method  | `GET` → `POST` pada endpoint yang sama | Kontrol akses per method, method override       |
| Path    | `/api/users/1` → `/api/users/2`        | IDOR, path traversal                            |
| Query   | `?id=1` → `?id=1'`                     | Injeksi, validasi tipe                         |
| Header  | `Host`, `X-Forwarded-For`              | Vhost routing, bypass IP allowlist              |
| Cookie  | `auth=demo-token` → nilai lain         | Session forgery, cookie tampering               |
| Body    | `role=user` → `role=admin`             | Mass assignment, validasi field                 |

Chapter 6 memetakan surface ini ke kategori **OWASP Top 10**. Untuk sekarang, cukup satu prinsip: **setiap bagian request yang dapat diubah adalah hipotesis yang dapat diuji**.

---

## 3. Web Proxy dan Burp Suite

### 3.1 Apa Itu Web Proxy

**Web proxy** adalah perantara yang menerima request dari client, meneruskannya ke server, lalu mengembalikan response. Karena semua traffic melewatinya, proxy dapat mencatat, menahan, dan mengubah isi request maupun response.

```text
Browser  →  Proxy (127.0.0.1:8080)  →  Target (<IP>)
         ←                          ←
```

*Intercept* terjadi karena browser memang dikonfigurasi memakai proxy — bukan karena traffic "dicuri". Pada lab, Anda mengendalikan kedua sisi: browser dan proxy berjalan di mesin Anda, target ada di host lab.

### 3.2 Forward Proxy vs Reverse Proxy

| Jenis             | Posisi                          | Siapa mengonfigurasi | Contoh                                  |
| ----------------- | ------------------------------- | -------------------- | --------------------------------------- |
| **Forward proxy** | Di depan client                 | Client/tester        | Burp Suite, proxy perusahaan            |
| **Reverse proxy** | Di depan server, menghadap client | Pemilik server     | WAF, load balancer, CDN                 |

Burp adalah **forward proxy**: Anda yang mengarahkan browser ke listener Burp. WAF dan load balancer adalah **reverse proxy**: client tidak tahu mereka ada.

### 3.3 Alur Intercept

1. Browser mengirim request ke listener Burp (`127.0.0.1:8080`), bukan langsung ke target.
2. Burp membaca request dan, jika **Intercept** aktif, menahannya.
3. Tester memeriksa method, path, header, cookie, dan body.
4. Tester dapat mengubah isi request, lalu memilih **Forward** atau **Drop**.
5. Burp meneruskan request ke target dan menerima response.
6. Request dan response tercatat di **HTTP history** meskipun tidak ditahan.

Untuk target **HTTPS**, browser mengirim `CONNECT <host>:443` ke proxy. Burp membuka koneksi ke target, membuat sertifikat untuk host tersebut, dan melakukan TLS termination di kedua sisi. Karena itu browser harus mempercayai **CA certificate** Burp — jika tidak, akan muncul peringatan sertifikat (lihat 3.6).

### 3.4 Burp Suite: Edisi dan Komponen

| Komponen          | Fungsi                                                         |
| ----------------- | -------------------------------------------------------------- |
| **Proxy**         | Menangkap dan memodifikasi traffic HTTP/HTTPS                  |
| **Repeater**      | Mengirim ulang satu request manual dengan perubahan terkontrol |
| **Intruder**      | Mengotomatisasi banyak variasi request                         |
| **Decoder**       | Encode/decode Base64, URL, hex, dan lainnya                    |
| **Comparer**      | Membandingkan dua response atau payload                        |
| **Logger**        | Mencatat traffic di luar scope proxy                           |
| **Target/Site map** | Memetakan host, path, dan parameter yang ditemukan           |
| **Scanner**       | Pemindaian otomatis (Professional)                             |

| Fitur              | Community                         | Professional                    |
| ------------------ | --------------------------------- | ------------------------------- |
| Proxy, Repeater    | Tersedia                          | Tersedia                        |
| Intruder           | Dibatasi/diperlambat              | Penuh                           |
| Scanner otomatis   | Tidak ada                         | Ada                             |
| API dan ekstensi   | Terbatas                          | Penuh                           |

Chapter ini hanya memakai **Proxy** dan **Repeater**. Intruder dibahas di Chapter 6; untuk fuzzing skala besar, `ffuf` di bagian 4 lebih tepat.

### 3.5 Menghubungkan Burp ke Browser

**Opsi A — Burp browser.** Buka `Proxy > Intercept`, klik **Open browser**. Browser bawaan Burp sudah dikonfigurasi ke listener dan sudah mempercayai CA Burp. Ini opsi tercepat untuk lab.

**Opsi B — browser eksternal + FoxyProxy.** Pasang ekstensi FoxyProxy, tambahkan proxy `127.0.0.1:8080` untuk HTTP dan HTTPS, lalu aktifkan hanya saat menguji target lab. Jangan biarkan proxy aktif untuk seluruh traffic harian.

Pastikan listener berjalan di `Proxy > Proxy settings > Proxy listeners` dengan alamat `127.0.0.1:8080`.

Verifikasi: buka `http://<IP>:8080/` di browser, lalu periksa `Proxy > HTTP history`. Request `GET /` harus muncul dengan status `200`.

![burp-home](/miniclass/cyber/assets/penetration-testing/burp-home.png)

### 3.6 Proxying HTTPS

Langkah untuk target HTTPS (lab chapter ini seluruhnya HTTP, tetapi kemampuan ini dibutuhkan pada target lain):

1. Dengan proxy aktif, buka `http://burp`.
2. Unduh **CA certificate** (`cacert.der`).
3. Impor ke trust store browser. Firefox: **Settings → Privacy & Security → Certificates → View Certificates → Authorities → Import**. Chrome mengikuti trust store sistem operasi.
4. Restart browser.
5. Buka target HTTPS dan pastikan tidak ada peringatan sertifikat.

::: warning
CA Burp memungkinkan siapa pun yang memegang sertifikatnya mengintersepsi TLS dari browser tersebut. Pasang hanya di profil browser khusus lab, dan hapus setelah selesai. Jangan pernah memasangnya di browser harian.
:::

### 3.7 HTTP History dan Scope

Tab **HTTP history** menampilkan kolom method, URL, status code, panjang response, dan MIME type. Gunakan filter untuk menyaring berdasarkan host, status, atau ekstensi. Klik kanan sebuah request → **Add to scope** agar hanya target lab yang dianggap in-scope.

Scope bukan formalitas. Fuzzing atau intercept di luar scope bisa mengenai sistem pihak ketiga dan melanggar aturan engagement. Sebelum menjalankan tool otomatis, pastikan host target sudah masuk scope dan daftar host di luar scope sudah dikecualikan.

### 3.8 Repeater: Tutorial

![burp-repeater](/miniclass/cyber/assets/penetration-testing/burp-repeater.png)

**Repeater** mengirim ulang satu request secara manual. Setiap perubahan kecil diikuti satu response baru, sehingga tester dapat membandingkan perilaku server tanpa noise dari request lain.

1. Tangkap request lewat **Intercept** atau pilih dari **HTTP history**.
2. Klik kanan → **Send to Repeater** (atau `Ctrl+R`).
3. Buka tab **Repeater**. Panel kiri berisi request yang dapat diedit, panel kanan berisi response. Tombol **Send** mengirim ulang. Tab response: **Raw**, **Headers**, **Render**.
4. Ubah satu hal terkontrol. Pada `POST /login` ke `http://<IP>:8080`, ganti `username=budi` menjadi `username=admin`.
5. Klik **Send**, lalu bandingkan status code, length, waktu, header, dan body dengan response asli. Harapan: `401`.
6. Kembalikan body menjadi `username=budi&password=belajar123`, klik **Send** lagi. Harapan: `302` dengan `Location: /profile` dan `Set-Cookie`.
7. Duplikasi tab untuk menyimpan request asli sebagai pembanding, dan simpan request menarik sebagai bukti temuan.

| Tool       | Kegunaan                                              | Skala                          |
| ---------- | ----------------------------------------------------- | ------------------------------ |
| Repeater   | Satu request, perubahan manual, analisis mendalam     | Satu per satu                  |
| Intruder   | Payload set otomatis pada posisi tertentu             | Puluhan–ribuan (Chapter 6)     |
| `ffuf`     | Fuzzing wordlist pada path, parameter, dan nilai      | Ribuan–jutaan                  |

::: tip
Duplikasi tab Repeater sebelum mengubah request asli. Dengan begitu Anda selalu punya baseline yang bisa dikirim ulang saat hasil percobaan membingungkan.
:::

---

## 4. Content Discovery

### 4.1 Apa Itu Content Discovery

**Content discovery** adalah proses menemukan resource yang tidak ditautkan dari UI: direktori, file backup, panel admin, endpoint API, dan parameter tersembunyi. Resource seperti ini tidak muncul di navigasi, tetapi sering menjadi jalan masuk yang paling mudah.

Contoh pada `fuzzlab`:

- `/blog/` — direktori yang ditautkan dari halaman utama.
- `/backup/` — disebut di `robots.txt`, tidak ditautkan.
- `/admin/admin.php` — panel admin pada vhost terpisah.
- `/robots.txt` — memberi petunjuk path yang "disembunyikan".

### 4.2 Manual vs Automated

Sebelum menjalankan tool, lakukan penemuan manual. Murah, tidak berisik, dan sering memberi konteks yang tidak bisa diberikan wordlist.

| Sumber                        | Yang dicari                                             |
| ----------------------------- | ------------------------------------------------------- |
| `robots.txt`                  | Path yang dilarang diindeks — sering justru menarik     |
| `sitemap.xml`                 | Daftar URL yang pemilik ingin diindeks                  |
| Favicon dan asset statis      | Framework, tema, dan versi                              |
| Response header               | `Server`, `X-Powered-By`, `X-Generator`                 |
| Source HTML dan JavaScript    | Endpoint API, komentar, path internal                   |
| Dokumentasi framework         | Path admin dan file default                             |
| Google dorking, Wayback, GitHub | Halaman lama, file bocor, kredensial (Chapter 2)      |

Penemuan manual tidak lengkap, tetapi hasilnya bernilai tinggi: satu path menarik dari `robots.txt` bisa mengarahkan seluruh strategi fuzzing berikutnya.

### 4.3 Apa Itu Fuzzing

**Fuzzing** adalah mengirim variasi input ke sebuah interface, lalu mempelajari response untuk menemukan input yang menghasilkan perilaku berbeda.

Dalam content discovery, fuzzing biasanya berarti **fuzzing wordlist**: satu kata dari daftar dimasukkan ke posisi tertentu, satu request per kata. Ini deterministik dan dapat diulang — berbeda dari brute force acak yang tidak menjamin cakupan.

Sinyal yang dibaca dari setiap response:

- **Status code** — `200`, `301`, `403`, dan seterusnya.
- **Ukuran response** — panjang body dalam byte.
- **Jumlah kata dan baris** — membantu membedakan halaman error yang seragam.
- **Waktu response** — endpoint berat atau proses backend.
- **Redirect** — tujuan `Location`.
- **Pesan error** — membocorkan parser, framework, atau validasi.

### 4.4 Wordlist dan SecLists

![SecLists](/miniclass/cyber/assets/penetration-testing/SecLists.png)

**SecLists** adalah kumpulan wordlist untuk security testing. Pasang lewat paket distribusi atau clone repositori:

```bash
sudo apt install seclists
# alternatif
git clone https://github.com/danielmiessler/SecLists
```

| Kebutuhan              | Path                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| Direktori umum         | `Discovery/Web-Content/directory-list-2.3-small.txt`              |
| File dan path umum     | `Discovery/Web-Content/common.txt`                                |
| Ekstensi file          | `Discovery/Web-Content/web-extensions.txt`                        |
| Nama parameter         | `Discovery/Web-Content/burp-parameter-names.txt`                  |
| Subdomain/vhost        | `Discovery/DNS/subdomains-top1million-5000.txt`                   |

::: info
Pada PwnBox HTB, SecLists tersedia di `/opt/useful/seclists/`. Sesuaikan path pada perintah jika instalasi Anda berbeda — kesalahan path wordlist adalah penyebab kegagalan `ffuf` yang paling umum.
:::

Pilih wordlist sesuai teknologi target. Untuk aplikasi PHP, wordlist direktori umum ditambah `web-extensions.txt` lebih berguna daripada wordlist khusus CMS. Untuk API, `burp-parameter-names.txt` lebih relevan daripada daftar nama file.

### 4.5 ffuf 101

`ffuf` (Fuzz Faster U Fool) adalah fuzzer web berbasis Go: cepat, satu binary, dan mudah dipadukan dengan pipeline shell.

```bash
sudo apt install ffuf
ffuf -h
```

| Flag                | Fungsi                                                        |
| ------------------- | ------------------------------------------------------------- |
| `-u`                | URL target, memuat keyword `FUZZ`                             |
| `-w`                | Path wordlist, opsional `:KEYWORD`                            |
| `:FUZZ`             | Menamai keyword yang diganti isi wordlist                     |
| `-X`                | HTTP method                                                   |
| `-d`                | Body request                                                  |
| `-H`                | Header tambahan, format `"Nama: Value"`                       |
| `-b`                | Cookie                                                        |
| `-mc`               | Matcher status code                                           |
| `-ms`               | Matcher ukuran response                                       |
| `-mw`               | Matcher jumlah kata                                           |
| `-ml`               | Matcher jumlah baris                                          |
| `-mr`               | Matcher regex pada body                                       |
| `-fc`               | Filter status code                                            |
| `-fs`               | Filter ukuran response                                        |
| `-fw`               | Filter jumlah kata                                            |
| `-fl`               | Filter jumlah baris                                           |
| `-fr`               | Filter regex pada body                                        |
| `-e`                | Daftar ekstensi, memperluas `FUZZ`                            |
| `-recursion`        | Fuzzing rekursif pada hasil yang ditemukan                    |
| `-recursion-depth`  | Kedalaman rekursi maksimum                                    |
| `-ic`               | Abaikan baris komentar pada wordlist                          |
| `-t`                | Jumlah thread (default 40)                                    |
| `-o`                | Simpan output ke file                                         |
| `-v`                | Verbose — tampilkan URL lengkap setiap match                  |
| `-c`                | Warna output                                                  |

`FUZZ` adalah keyword default. Jika wordlist memakai nama lain, tulis `wordlist.txt:NAMA` lalu pakai `NAMA` di URL, body, atau header.

### 4.6 Directory Fuzzing

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/FUZZ -ic
```

`-ic` menghapus baris komentar (`# ...`) yang banyak terdapat di wordlist SecLists. Tanpa `-ic`, ffuf tetap mengirim path yang tidak valid dan hasilnya menjadi noise.

Contoh output ringkas:

```text
blog                    [Status: 301, Size: 0, Words: 1, Lines: 1]
backup                  [Status: 301, Size: 0, Words: 1, Lines: 1]
```

| Status | Arti saat directory fuzzing                              |
| ------ | -------------------------------------------------------- |
| `301`  | Direktori ada; redirect ke versi dengan trailing slash   |
| `200`  | Halaman atau file ada                                    |
| `403`  | Ada, tetapi akses ditolak                                |
| `401`  | Ada, tetapi butuh autentikasi                            |

::: warning
Nilai `Size` pada contoh bergantung pada build lab. Ukur baseline sendiri (4.9) sebelum memakai `-fs`. Jangan menyalin angka contoh ke target lain.
:::

`-t 200` mempercepat pemindaian tetapi membebani target, mudah memicu rate limit, dan berisiko DoS pada service yang rapuh. Default `40` sudah cukup agresif untuk lab. Untuk target produksi, turunkan dan tambahkan delay.

### 4.7 Page dan Extension Fuzzing

Fuzzing ekstensi pada nama file yang hampir selalu ada:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/web-extensions.txt:FUZZ \
  -u http://<IP>/blog/indexFUZZ -ic
```

`index.*` dipilih karena banyak server menyajikan `index` dengan ekstensi tertentu. `web-extensions.txt` sudah memuat titik (`.php`, `.html`), sehingga `indexFUZZ` menjadi `index.php`.

Hasil `200` pada satu ekstensi menunjukkan teknologi server — misalnya `.php` pada `fuzzlab`. Setelah itu, fuzz nama file dengan ekstensi tersebut:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/blog/FUZZ.php -ic
```

Pendekatan dua tahap ini jauh lebih efisien daripada menebak kombinasi nama dan ekstensi sekaligus.

### 4.8 Recursive Fuzzing

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/FUZZ -recursion -recursion-depth 1 -e .php -v -ic
```

`-recursion-depth 1` berarti ffuf hanya masuk satu level ke dalam direktori yang ditemukan. Setiap level menambah jumlah request secara eksponensial: satu direktori baru berarti seluruh wordlist dijalankan ulang di dalamnya.

Strategi yang lebih terkendali: recursion dangkal untuk menemukan direktori menarik, lalu fuzz manual direktori tersebut dengan wordlist yang lebih spesifik.

::: warning
Recursive fuzzing bisa memakan waktu lama dan membebani target. Jalankan hanya pada lab, pantau jumlah request, dan hentikan jika target mulai membalas `429` atau `503`.
:::

### 4.9 Filtering Results

Matcher menentukan response yang **ditampilkan**; filter menentukan response yang **dibuang**.

| Matcher | Berdasarkan          | Filter | Berdasarkan          |
| ------- | -------------------- | ------ | -------------------- |
| `-mc`   | Status code          | `-fc`  | Status code          |
| `-ms`   | Ukuran response      | `-fs`  | Ukuran response      |
| `-mw`   | Jumlah kata          | `-fw`  | Jumlah kata          |
| `-ml`   | Jumlah baris         | `-fl`  | Jumlah baris         |
| `-mr`   | Regex pada body      | `-fr`  | Regex pada body      |

Default matcher ffuf adalah sekumpulan status code. Pada versi yang dipakai chapter ini: `200-299,301,302,307,401,403,405,500`. Selalu verifikasi lewat `ffuf -h` karena daftar ini dapat berubah antar versi.

Kunci filtering adalah **baseline**. Kirim path acak yang dijamin tidak ada, lalu catat ukurannya:

```bash
curl -s -o /dev/null -w '%{size_download}\n' http://<IP>/tidak-ada-12345
```

Jika hasilnya `900`, artinya server memakai catch-all: semua path tak dikenal membalas `200` dengan body seragam 900 byte. Tanpa filter, seluruh wordlist akan tampak "ditemukan".

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/FUZZ -fs 900 -ic
```

Baseline lain pada lab ini: parameter `GET` yang tidak dikenal membalas 160 byte, dan `POST id` dengan nilai bukan `7` membalas 180 byte. Angka tersebut dipakai sebagai `-fs` pada 4.11 dan 4.12 — sesuaikan dengan baseline lab Anda.

### 4.10 Subdomain dan Vhost Fuzzing

**Subdomain** membutuhkan record DNS publik:

```bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \
  -u http://FUZZ.academy.lab/ -ic
```

Pada lab lokal, cara ini tidak bekerja karena tidak ada DNS publik untuk `*.academy.lab`. Yang tersedia adalah **vhost**: satu IP, banyak site, dibedakan oleh header `Host`.

```bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \
  -u http://<IP>/ -H 'Host: FUZZ.academy.lab' -fs 900 -ic
```

Contoh output:

```text
admin                   [Status: 200, Size: 120, Words: 1, Lines: 1]
```

Vhost fuzzing rawan false positive: catch-all membalas `200` untuk host apa pun. Karena itu `-fs 900` wajib — hanya response dengan ukuran berbeda yang menarik. Angka `Size` pada contoh mengikuti build lab; yang menentukan adalah perbedaannya dari catch-all, bukan nilai absolutnya. Setelah menemukan `admin`, tambahkan ke `/etc/hosts`:

```bash
echo "<IP> admin.academy.lab" | sudo tee -a /etc/hosts
```

Konsep DNS dan enumerasi subdomain dibahas di Chapter 3–4; bagian ini hanya menerapkannya pada header `Host`.

### 4.11 Parameter Fuzzing

Endpoint bisa menerima parameter yang tidak terlihat di UI. Fuzzing **GET** menebak nama parameter pada query string:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ \
  -u 'http://admin.academy.lab/admin/admin.php?FUZZ=key' -fs 160 -ic
```

Contoh output:

```text
key                     [Status: 200, Size: 140, Words: 1, Lines: 1]
```

Untuk **POST**, tentukan method, body, dan `Content-Type`. Tanpa `-X POST`, ffuf mengirim `GET`; tanpa `Content-Type`, server bisa menolak atau salah mem-parse body:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ \
  -u http://admin.academy.lab/admin/admin.php -X POST -d 'FUZZ=key' \
  -H 'Content-Type: application/x-www-form-urlencoded' -fs 160 -ic
```

Verifikasi parameter yang ditemukan secara manual:

```bash
curl -i 'http://admin.academy.lab/admin/admin.php?key=lab'
curl -i http://admin.academy.lab/admin/admin.php -X POST -d 'id=1' \
  -H 'Content-Type: application/x-www-form-urlencoded'
```

`key` membalas `deprecated`; `id` membalas `Invalid id!` untuk nilai selain `7`. Keduanya membuktikan parameter benar-benar diproses, bukan sekadar halaman statis.

### 4.12 Value Fuzzing

Setelah nama parameter ditemukan, tebak nilainya. Buat wordlist angka, selalu mulai dari file kosong agar isi lama tidak terduplikasi saat perintah dijalankan ulang:

```bash
rm -f ids.txt
for i in $(seq 1 1000); do echo $i >> ids.txt; done
```

Jalankan fuzzing pada parameter `id`:

```bash
ffuf -w ids.txt:FUZZ -u http://admin.academy.lab/admin/admin.php -X POST -d 'id=FUZZ' \
  -H 'Content-Type: application/x-www-form-urlencoded' -fs 180
```

Contoh output:

```text
7                       [Status: 200, Size: 220, Words: 1, Lines: 1]
```

Verifikasi dengan `curl`:

```bash
curl -i http://admin.academy.lab/admin/admin.php -X POST -d 'id=7' \
  -H 'Content-Type: application/x-www-form-urlencoded'
```

Response berisi `flag{content_discovery_lab}`. Nilai `220` dan isi flag bergantung pada build lab; yang penting adalah polanya: **nama parameter dulu, nilai kemudian**.

### 4.13 Cheat Sheet

```bash
# 1. Directory
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/FUZZ -ic

# 2. Ekstensi pada nama file umum
ffuf -w /usr/share/seclists/Discovery/Web-Content/web-extensions.txt:FUZZ \
  -u http://<IP>/blog/indexFUZZ -ic

# 3. Nama file dengan ekstensi yang ditemukan
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/blog/FUZZ.php -ic

# 4. Recursive (dangkal)
ffuf -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ \
  -u http://<IP>/FUZZ -recursion -recursion-depth 1 -e .php -v -ic

# 5. Vhost dengan filter catch-all
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt:FUZZ \
  -u http://<IP>/ -H 'Host: FUZZ.academy.lab' -fs 900 -ic

# 6. Parameter GET
ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ \
  -u 'http://admin.academy.lab/admin/admin.php?FUZZ=key' -fs 160 -ic

# 7. Parameter POST
ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt:FUZZ \
  -u http://admin.academy.lab/admin/admin.php -X POST -d 'FUZZ=key' \
  -H 'Content-Type: application/x-www-form-urlencoded' -fs 160 -ic

# 8. Value fuzzing
ffuf -w ids.txt:FUZZ -u http://admin.academy.lab/admin/admin.php -X POST -d 'id=FUZZ' \
  -H 'Content-Type: application/x-www-form-urlencoded' -fs 180
```


## 6. Hands-on

Latihan pada lab chapter:

1. **Repeater.** Tangkap `POST /login` ke `http://<IP>:8080` di Burp, kirim ke Repeater, ubah `username` menjadi `admin`, catat status code dan length. Kembalikan ke `username=budi&password=belajar123`, kirim lagi, lalu salin nilai `Set-Cookie` yang diterima.
2. **Directory dan recursion.** Jalankan directory fuzzing dan recursive fuzzing pada `http://<IP>`. Verifikasi minimal dua temuan secara manual dengan `curl`, dan jelaskan mengapa masing-masing temuan layak dilaporkan.
3. **Rantai content discovery.** Mulai dari vhost fuzzing pada `http://<IP>` dengan `Host: FUZZ.academy.lab`, lanjut ke parameter fuzzing `GET` dan `POST` pada vhost admin, lalu value fuzzing sampai menemukan flag. Catat setiap perintah dan baseline yang dipakai.

---

## 7. Referensi

- PortSwigger, *Burp Suite documentation* — https://portswigger.net/burp/documentation
- MDN Web Docs, *HTTP* — https://developer.mozilla.org/en-US/docs/Web/HTTP
- Daniel Miessler, *SecLists* — https://github.com/danielmiessler/SecLists
- ffuf, *Fast web fuzzer* — https://github.com/ffuf/ffuf
- Hack The Box Academy, *Attacking Web Applications with Ffuf* (CPTS module 15) — https://academy.hackthebox.com/module/details/54
