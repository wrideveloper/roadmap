# Kenapa Container Ada

::: info Prasyarat Modul
Modul ini lanjutan dari System Design. Idealnya kamu sudah pernah menjalankan aplikasi backend sendiri, tahu cara install dependency, dan paham kenapa lingkungan development dan production bisa berbeda. Kalau belum, tidak masalah, kita mulai dari cerita.
:::

Ada satu kalimat yang hampir semua backend developer pernah ucapkan:<br> "it works on my machine."

<img src="/miniclass/backend/assets/docker/it-works-on-my-machine-programming-coding-unisex-graphic-t-shirt-707248.webp" width="480">

Kalimat itu bukan alasan. Itu gejala. Gejala bahwa yang rusak bukan kodemu, tapi perbedaan antara dua mesin yang seharusnya kembar. Dan perbedaan itulah alasan kenapa container ada.

---

## Masalah Sebenarnya

Kode kita tidak berubah. Yang berubah adalah **lingkungan tempat kode itu berjalan**. Ada beberapa hal yang sering luput:

- Versi runtime berbeda. Laptopmu Node 20, server masih Node 16.
- Dependency sistem berbeda. Di Ubuntu ada `libssl1.1`, di image baru cuma `libssl3`.
- Konfigurasi berbeda. Path file, user, permission, timezone, locale.
- Ada hal yang kamu install manual enam bulan lalu, lalu lupa. Di mesin lain hal itu tidak ada.

Dalam dunia backend, kondisi ini sering disebut **environment drift**: lingkungan yang seharusnya sama perlahan-lahan berbeda, sampai suatu hari aplikasi tidak mau jalan.

Ada dua cara lama untuk mengatasinya. Cara pertama, tulis dokumen instalasi sepanjang tiga halaman dan berdoa semua orang mengikutinya persis. Cara kedua, kirim seluruh laptopmu ke server. Cara pertama rapuh, cara kedua mahal.

Container adalah cara ketiga: **bungkus aplikasi beserta seluruh kebutuhannya menjadi satu unit yang bisa dipindah-pindah tanpa berubah perilaku**.

---

## Solusi Lama: Virtual Machine

Sebelum container populer, orang memakai **Virtual Machine (VM)**. Idenya sederhana: jalankan satu komputer virtual lengkap di dalam komputer fisik.

Di dalam VM ada hal-hal ini:

1. **Hypervisor** yang membagi resource fisik.
2. **Guest OS** lengkap, misalnya satu Ubuntu utuh dengan kernel-nya sendiri.
3. Baru di atasnya dependency aplikasi, runtime, dan aplikasimu.

<div align="center">

![Perbandingan machine virtualization dan container](/miniclass/backend/assets/docker/01-container-vs-vm.avif)

<sub>Machine Virtualization vs Containers</sub>

</div>

> Sumber gambar: NetApp, [Containers vs. Virtual Machines (VMs): What's the Difference?](https://www.netapp.com/blog/containers-vs-vms/)

VM bekerja, dan masih dipakai sampai sekarang untuk banyak kasus. Tapi ada harga yang dibayar:

- **Berat.** Setiap VM membawa OS sendiri, ukurannya bisa ratusan MB sampai beberapa GB.
- **Lambat start.** Booting OS butuh puluhan detik sampai menit.
- **Borong resource.** RAM dialokasikan untuk kernel tamu, bukan untuk aplikasimu.

Untuk satu aplikasi kecil, membawa satu OS penuh terasa berlebihan.

---

## Container: Isolasi Tanpa OS Baru

Container mengambil jalan berbeda. Dia **tidak** membawa OS sendiri. Container berbagi kernel dengan host, tapi proses di dalamnya diisolasi sedemikian rupa sehingga terlihat seperti punya mesin sendiri.

Analogi yang paling sering dipakai, dan menurutku paling pas: **VM itu seperti membangun rumah terpisah untuk setiap penghuni. Container itu seperti menyekat satu rumah besar menjadi kamar-kamar.** Setiap kamar punya pintu, kunci, dan aturannya sendiri, tapi pondasi dan instalasi listriknya sama.

Karena tidak membawa OS, container jadi:

- **Ringan.** Ukurannya bisa belasan MB, karena isinya cuma aplikasi dan dependency yang benar-benar dipakai.
- **Cepat start.** Biasanya di bawah satu detik, karena tinggal menjalankan proses, bukan booting OS.
- **Hemat resource.** Tidak ada kernel duplikat yang harus diberi RAM.

::: warning Satu Hal yang Sering Salah Paham
Container bukan VM kecil. Container adalah **proses biasa** di host yang diberi batas dan isolasi. Kalau kamu membuka daftar proses di host, proses di dalam container sebenarnya terlihat juga. Bedanya, proses itu tidak bisa melihat proses lain di luar container-nya.
:::

---

## Image dan Container: Class dan Object

Dua istilah ini akan kamu pakai setiap hari, jadi kita samakan dulu.

- **Image** adalah `blueprint`. Isinya file system, dependency, kode aplikasi, dan instruksi cara menjalankannya. Image bersifat read-only dan tidak berubah.
- **Container** adalah image yang sedang dijalankan. Satu image bisa dijalankan menjadi banyak container sekaligus.

Kalau kamu datang dari pemrograman berorientasi objek, ini persis hubungan **class dan object**. Class mendefinisikan bentuk, object adalah wujud nyata yang bisa kamu pakai. Kalau dari dunia desain, image itu master template, container itu hasil cetaknya.

> Analogi lain yang aku suka: image itu resep, container itu masakan. Resepnya bisa dipakai berkali-kali, dan setiap porsi masakan bisa dimakan atau dibuang tanpa mengubah resep.

---

## Kenapa Backend Butuh Ini

Bagi kita yang belajar backend, container memberi tiga keuntungan yang langsung terasa:

### 1. Lingkungan yang Konsisten

Aplikasi yang sama berjalan identik di laptopmu, di laptop temanmu, di CI/CD, dan di server produksi. Kalau ada bug, bug-nya bug aplikasi, bukan bug lingkungan.

### 2. Onboarding yang Cepat

Anggota tim baru tidak perlu install PHP, MySQL, Redis, dan Node satu per satu dengan versi yang harus cocok. Cukup jalankan satu perintah, dan seluruh stack hidup.

### 3. Fondasi untuk Scaling

Container adalah unit kecil yang mudah digandakan, dimatikan, dan dipindah. Ini yang membuat Horizontal Scaling di modul System Design jadi praktis. Orkestrator seperti Kubernetes pada dasarnya mengelola banyak container.

---

## Yang Akan Kita Pelajari

Modul ini dibagi dua bagian.

**Bagian pertama, praktik.** Kita install Docker, belajar memakai image dan container, menulis Dockerfile, menyusun banyak service dengan Compose, lalu mengatur data dan jaringan.

**Bagian kedua, isi perutnya.** Kita bongkar cara kerja container dari lapisan paling dasar: chroot, namespaces, dan cgroups. Setelah bagian ini, Docker tidak lagi terasa seperti sihir.

---

## Latihan

Sebelum lanjut, coba lakukan ini di catatanmu:

1. Tulis satu pengalaman ketika aplikasimu jalan di lokal tapi gagal di server. Apa penyebabnya?
2. Sebutkan tiga hal di lingkungan development-mu yang mungkin berbeda dengan server.
3. Jelaskan dengan bahasamu sendiri bedanya image dan container.
