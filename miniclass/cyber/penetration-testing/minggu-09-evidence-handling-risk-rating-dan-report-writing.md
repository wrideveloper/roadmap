# Minggu 9: Evidence Handling, Risk Rating, dan Report Writing

Minggu ini peserta mengubah aktivitas teknis menjadi komunikasi yang dapat dipahami orang lain. Targetnya bukan menulis report yang panjang, tetapi menghasilkan finding yang jelas, punya bukti, dan cukup untuk ditindaklanjuti.

<div align="center">

![Struktur Report](/miniclass/cyber/assets/penetration-testing/report-structure.svg)

</div>

## Tujuan Pembelajaran

- Memahami elemen penting dari finding yang berguna
- Menulis title, description, impact, evidence, dan remediation yang jelas
- Mengenal severity model sederhana atau pengantar CVSS
- Membedakan executive summary dan technical findings

## Anatomy Finding yang Baik

Sebuah finding minimal memuat:

- judul yang spesifik
- aset atau endpoint yang terdampak
- deskripsi masalah
- evidence yang cukup
- langkah reproduksi
- impact
- remediation
- severity dan alasannya

## Evidence Handling

Evidence yang baik:

- menunjukkan fakta penting
- tidak berlebihan
- tidak memaparkan data sensitif yang tidak perlu
- cukup jelas untuk mendukung klaim

Contoh evidence:

- screenshot Burp request dan response
- output terminal yang relevan
- path atau parameter yang terbukti

## Risk Rating Basics

Untuk pemula, severity bisa ditentukan dengan tiga pertanyaan:

1. Seberapa besar dampaknya jika issue dimanfaatkan?
2. Seberapa mudah issue itu dieksploitasi?
3. Seberapa kuat buktinya?

## Executive Summary vs Technical Findings

| Executive Summary | Technical Findings |
| --- | --- |
| Ditujukan untuk pembaca non-teknis | Ditujukan untuk pembaca teknis |
| Ringkas dan fokus pada risiko utama | Detail dan bisa direproduksi |
| Tidak perlu semua langkah teknis | Harus punya langkah, evidence, dan remediation |

## Format Pengajaran Minggu 9

- `Teori`: review evidence, anatomy finding yang baik, dan dasar risk rating
- `Demo`: mentor menunjukkan cara menulis satu finding lengkap dari bukti teknis yang ada
- `Praktik`: peserta merapikan evidence, menulis finding draft, lalu merevisi hasilnya setelah review

## Praktikum Minggu 9

### Langkah Praktikum

1. Pilih dua finding dari praktikum sebelumnya.
2. Rapikan evidence.
3. Tulis ulang langkah reproduksi agar lebih jelas.
4. Tentukan severity sederhana.
5. Tambahkan remediation.
6. Minta peer review dari peserta lain.

## Checklist Peer Review

- Apakah judulnya jelas?
- Apakah claim didukung evidence?
- Apakah langkah reproduksi bisa diikuti?
- Apakah impact terlalu berlebihan?
- Apakah remediation cukup spesifik?

## Deliverables

- dua sampai tiga finding lengkap
- satu versi finding sebelum dan sesudah revisi

## Output yang Diharapkan

- Peserta mampu mengomunikasikan hasil teknis secara jelas
- Peserta memiliki draft finding yang siap dipakai pada capstone

## Kesalahan Umum

- Judul terlalu umum seperti "Website Vulnerable"
- Impact terlalu bombastis tanpa bukti
- Screenshot terlalu banyak tetapi tidak menjelaskan inti masalah
- Remediation terlalu generik seperti "please secure the system"

## Tips Mentor

- Pakai satu contoh finding buruk lalu perbaiki bersama di kelas
- Tekankan bahwa finding yang baik biasanya sederhana, jelas, dan jujur terhadap batas bukti
