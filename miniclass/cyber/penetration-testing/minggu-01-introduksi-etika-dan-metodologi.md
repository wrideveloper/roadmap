# Minggu 1: Introduksi, Etika, dan Metodologi Pentest

## Apa Itu Penetration Testing

Penetration testing adalah proses pengujian keamanan yang terstruktur untuk mencari, memvalidasi, dan menjelaskan kelemahan pada sistem yang memang diizinkan untuk diuji. Fokus utamanya bukan sekadar **berhasil hack**, tetapi membuktikan risiko secara bertanggung jawab dan menjelaskan dampaknya.

## Tipe-Tipe Penetration Testing

Tidak ada satu cara tunggal untuk mengelompokkan penetration testing. Dalam praktiknya, tipe pentest biasanya dibedakan berdasarkan **informasi awal yang diberikan ke tester**, **posisi akses tester**, dan **jenis target yang diuji**.

### Berdasarkan Informasi Awal

| Tipe      | Deskripsi                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| Black Box | Tester hampir tidak diberi informasi awal tentang target dan harus membangun konteks dari nol                   |
| Gray Box  | Tester diberi sebagian informasi, misalnya low-privileged account, diagram sederhana, atau daftar aset tertentu |
| White Box | Tester diberi informasi yang luas seperti source code, konfigurasi, arsitektur, atau kredensial tertentu        |

### Berdasarkan Posisi Akses

| Tipe             | Deskripsi                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| External Pentest | Simulasi serangan dari luar organisasi, biasanya berfokus pada internet-facing assets                                 |
| Internal Pentest | Simulasi serangan dari dalam network, misalnya setelah attacker mendapatkan foothold atau berada di jaringan internal |

### Berdasarkan Jenis Target

| Tipe                       | Deskripsi                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Network Pentest            | Menguji host, service, segmentasi network, dan kontrol akses pada infrastruktur                             |
| Web Application Pentest    | Menguji web application, authentication flow, session handling, input validation, dan business logic        |
| API Pentest                | Menguji API endpoint, authorization, authentication, input handling, dan trust boundary antar-service       |
| Mobile Application Pentest | Menguji mobile app, local storage, komunikasi ke backend, dan kontrol keamanan pada platform mobile         |
| Wireless Pentest           | Menguji wireless network, authentication mechanism, encryption, dan exposure dari access point              |
| Cloud Pentest              | Menguji cloud assets, identity misconfiguration, storage exposure, dan kontrol akses pada environment cloud |

## Yang Bukan Penetration Testing

| Aktivitas                   | Kenapa Berbeda                                                             |
| --------------------------- | -------------------------------------------------------------------------- |
| CTF                         | Bersifat game atau challenge, bukan simulasi engagement nyata              |
| Vulnerability assessment    | Biasanya berhenti pada identifikasi, belum selalu sampai validasi mendalam |
| Bug bounty                  | Memiliki aturan program dan target yang spesifik                           |
| Random scanning di internet | Tidak legal jika tanpa izin                                                |

## Tahapan Penetration Testing

<div align="center">

![Workflow Pentest](/miniclass/cyber/assets/penetration-testing/0-PT-Process.png)

</div>

Cara paling efektif untuk melihat pentest adalah sebagai kumpulan tahap yang saling terhubung. Untuk roadmap ini, tahap intinya adalah:

| Tahap                    | Deskripsi                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Pre-Engagement           | Edukasi client, penyelarasan tujuan, scope, NDA, estimasi waktu, dan Rules of Engagement                |
| Information Gathering    | Mengumpulkan informasi tentang target, teknologi, software, hardware, dan area yang mungkin dapat diuji |
| Vulnerability Assessment | Menganalisis hasil information gathering untuk mencari kelemahan dan attack vector potensial            |
| Exploitation             | Menguji dan mengeksekusi serangan secara terkontrol untuk memperoleh initial access                     |
| Post-Exploitation        | Menjaga konteks akses, memahami impact, melakukan local enumeration, dan mencari data sensitif          |
| Lateral Movement         | Bergerak ke host lain dalam jaringan internal jika scope mengizinkan dan ada jalur yang valid           |
| Proof of Concept         | Mendokumentasikan langkah eksploitasi secara runtut agar client paham bagaimana weakness bisa dirangkai |
| Post-Engagement          | Cleanup, final reporting, walkthrough hasil, dan pengarsipan data sesuai kewajiban kontraktual          |

:::info Sifat Iteratif
Tahapan pentest saling bergantung dan sering berulang. Misalnya setelah exploitation, tester bisa kembali melakukan information gathering dari sisi internal, lalu melakukan post-exploitation, lalu lateral movement, lalu kembali mengumpulkan bukti tambahan. Jadi, yang penting bukan mengikuti lingkaran secara kaku, tetapi memahami fungsi tiap tahap dan kapan tahap itu relevan dipakai.
:::

### Pre-Engagement

Di tahap ini semua batas engagement harus jelas sejak awal. Hal yang biasanya dibicarakan meliputi:

- Non-Disclosure Agreement
- Goals
- Scope
- Time Estimation
- Rules of Engagement

Rules of Engagement mengatur batasan engagement, misalnya:

- Tidak boleh melakukan denial of service
- Tidak boleh membuat persistence
- Tidak boleh pivot ke sistem lain
- Hanya boleh mengambil Proof of Concept (PoC) secukupnya

### Information Gathering

Tahap ini menjelaskan bagaimana kita memperoleh informasi yang dibutuhkan dari berbagai sumber. Tujuannya adalah memahami organisasi target, software, hardware, dan petunjuk awal lain yang dapat membuka peluang foothold.

### Vulnerability Assessment

Setelah informasi terkumpul, kita menganalisis hasil tersebut untuk mencari vulnerability yang diketahui, versi software yang rentan, dan fitur yang mencurigakan. Tahap ini dapat dilakukan secara manual maupun dengan bantuan automation, tetapi hasilnya tetap harus dipahami, bukan sekadar diterima mentah.

### Exploitation

Di tahap exploitation, kita menggunakan hasil analisis untuk menguji attack vector yang paling masuk akal. Tujuannya adalah mendapatkan initial access secara terkendali, aman, dan tetap berada dalam batas yang telah disepakati.

### Post-Exploitation

Setelah berhasil mendapatkan akses, fokus berpindah ke pemahaman dampak. Kita memeriksa host dari dalam, mencoba privilege escalation bila aman dan relevan, serta mencari data sensitif atau kredensial yang menunjukkan tingkat risiko sebenarnya.

### Lateral Movement

Jika scope mengizinkan, kita dapat bergerak ke host lain dengan memanfaatkan informasi yang ditemukan pada mesin yang telah dieksploitasi. Tahap ini sering berjalan berulang bersama post-exploitation sampai objective tercapai.

### Proof of Concept

Proof of Concept menjelaskan langkah demi langkah bagaimana beberapa kelemahan dapat dirangkai menjadi compromise atau akses tertentu. Dokumentasi yang baik membantu client memprioritaskan remediation karena mereka bisa melihat hubungan antar weakness secara jelas.

### Post-Engagement

Tahap terakhir berisi pembersihan jejak pada host yang diuji, penyusunan deliverable teknis dan manajerial, report walkthrough, serta penyimpanan evidence sesuai kebijakan dan kontrak.

## Contoh Penerapan pada Target Website

Berikut contoh bagaimana delapan tahap tadi bisa dipakai saat menguji website:

| Tahap                       | Deskripsi                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1. Pre-Engagement           | Menetapkan assessment objective, dokumen izin, dan menjawab pertanyaan awal sebelum pengujian dimulai                         |
| 2. Information Gathering    | Mengidentifikasi teknologi yang dipakai website dan memahami bagaimana aplikasi berjalan                                      |
| 3. Vulnerability Assessment | Mencari vulnerability yang diketahui dan fitur yang dapat memicu perilaku tak diinginkan                                      |
| 4. Exploitation             | Menyiapkan tool, exploit code, dan environment untuk memvalidasi vulnerability yang ditemukan                                 |
| 5. Post-Exploitation        | Mengumpulkan informasi dari sisi host yang berhasil diakses dan menilai peluang privilege escalation atau akses data sensitif |
| 6. Lateral Movement         | Jika ada server lain dalam scope, mencoba berpindah menggunakan informasi yang sudah diperoleh                                |
| 7. Proof of Concept         | Menyusun PoC yang menunjukkan vulnerability benar-benar ada dan dapat dirangkai                                               |
| 8. Post-Engagement          | Menyelesaikan laporan formal, melakukan walkthrough, dan mendukung proses remediasi                                           |

## Praktik

- Selesaikan setup environment merujuk pada [Tools dan Lab Platform](/miniclass/cyber/penetration-testing/tools-dan-lab-platform).
- Test environment dengan mengerjakan [Starting Point HTB](https://app.hackthebox.com/starting-point?tab=1)

## Homework

- Menyelesaikan prerequisite Linux dan networking bila belum selesai
