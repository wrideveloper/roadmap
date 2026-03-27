# Assessment, Deliverables, dan Next Step

Halaman ini merangkum model penilaian ringan, artefak yang disarankan untuk dijaga peserta, dan arah belajar setelah miniclass selesai.

<div align="center">

![Struktur Report](/miniclass/cyber/assets/penetration-testing/report-structure.svg)

</div>

## Assessment Suggestion

| Komponen | Bobot |
| --- | --- |
| Partisipasi dan kehadiran | 20% |
| Penyelesaian prerequisite | 20% |
| Dokumentasi praktikum atau tugas refleksi | 25% |
| Short finding write-ups | 15% |
| Final capstone report dan presentation | 20% |

## Kenapa Penilaiannya Dibagi Seperti Ini

- Peserta pemula tidak selalu akan berhasil melakukan validasi teknis setiap minggu
- Kualitas proses, pemahaman workflow, dan kemampuan menulis temuan tetap penting
- Dokumentasi dan refleksi membantu mentor melihat perkembangan reasoning peserta

## Recommended Deliverables

- Personal pentest notebook atau catatan praktikum opsional
- Command log bila dibutuhkan untuk reproduksi
- Folder screenshot dan evidence bila relevan dengan tugas atau finding
- Draft finding
- Final mini-report

## Rubrik Sederhana untuk Finding Draft

| Aspek | Pertanyaan Penilai |
| --- | --- |
| Kejelasan judul | Apakah judul langsung menunjukkan inti masalah? |
| Kualitas evidence | Apakah screenshot atau output cukup mendukung klaim? |
| Dampak | Apakah impact dijelaskan tanpa berlebihan? |
| Reproduksi | Apakah langkah reproduksi cukup jelas? |
| Remediasi | Apakah saran perbaikan masuk akal dan dapat ditindaklanjuti? |

## Contoh Severity Model Sederhana

| Severity | Karakteristik |
| --- | --- |
| Critical | Dampak sangat besar, eksploitasi mudah, dan bisa menyebabkan full compromise |
| High | Dampak tinggi atau membuka jalur serangan signifikan |
| Medium | Isu nyata, tetapi butuh syarat tambahan atau dampaknya terbatas |
| Low | Risiko kecil, tetapi tetap perlu dicatat |
| Informational | Tidak langsung berbahaya, tetapi berguna untuk konteks keamanan |

## Template Finding Singkat

```md
# Judul Finding

## Affected Asset
- IP / URL:
- Service / endpoint:

## Description
Jelaskan apa masalahnya secara ringkas.

## Evidence
- Screenshot atau output penting
- Fakta yang mendukung klaim

## Steps to Reproduce
1. Langkah pertama
2. Langkah kedua
3. Hasil yang terlihat

## Impact
Jelaskan konsekuensi jika isu ini disalahgunakan.

## Remediation
Saran perbaikan yang spesifik dan realistis.

## Severity
Medium / High / dst, beserta alasan singkat.
```

## Ekspektasi Setelah 10 Minggu

Peserta belum menjadi pentester profesional, tetapi diharapkan sudah mampu:

- Mengikuti workflow pentest level beginner
- Bekerja aman di legal lab environment
- Menggunakan tool entry-level dengan benar
- Menulis laporan dasar yang tetap berguna
- Melanjutkan pembelajaran secara mandiri ke level berikutnya

## Teaching Notes untuk Mentor

- Susun tiap sesi dengan pola teori, demo, lalu praktik
- Jangan berasumsi peserta sudah nyaman dengan command line
- Tunjukkan demo end-to-end sebelum meminta praktik mandiri
- Jaga setiap minggu tetap fokus pada satu konsep utama
- Dahulukan reasoning manual sebelum automation
- Gunakan checklist dan template agar output peserta konsisten

## Next Step yang Disarankan

Setelah jalur ini selesai, materi lanjutan dapat diarahkan ke:

- Active Directory basics
- Wireless security fundamentals
- Web exploitation lebih mendalam
- Privilege escalation lebih lanjut
- Scripting for pentesters
- Intro to red team operations

## Final Deliverables

Pada akhir miniclass, peserta yang menyelesaikan capstone minimal memiliki:

- satu ringkasan scope
- satu attack surface summary
- satu sampai dua finding yang tervalidasi
- satu mini-report yang rapi
- satu presentasi singkat
