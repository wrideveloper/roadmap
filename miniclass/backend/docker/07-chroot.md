# chroot

::: info Prasyarat Modul
Bagian ini membongkar isi perut container. Kamu tidak perlu menghafal semua perintah kernel, tapi kamu perlu nyaman memakai terminal Linux. Kalau memakai macOS, jalankan latihan di dalam container Linux atau di WSL.
:::

Sampai sini kita sudah memakai Docker seperti alat jadi. Tinggal `docker run`, dan container muncul. Sekarang kita mulai membongkar: sebenarnya apa yang dilakukan Docker ke sistem operasi?

Jawaban singkatnya: Docker tidak membuat mesin baru. Dia memakai fitur-fitur yang sudah lama ada di kernel Linux. Fitur pertama yang perlu kamu kenal adalah **chroot**.

---

## Masalah: File System Global

Di Linux, setiap proses melihat satu file system yang sama. Kalau kamu menjalankan `ls /`, kamu melihat isi root file system komputer. Semua program melihat root yang sama.

Bayangkan kamu ingin menjalankan dua aplikasi yang sama-sama butuh `/usr/lib/libfoo.so`, tapi versinya berbeda. Di satu sistem, keduanya akan berebut file yang sama.

**chroot** memberi jalan keluar: kita bisa mengubah apa yang dianggap sebagai `/` oleh sebuah proses dan semua anak prosesnya.

Setelah `chroot`, proses itu tidak bisa melihat file di luar direktori yang kita tentukan. Dari sudut pandangnya, direktori itu adalah seluruh dunia.

---

## Mencoba chroot

Kita akan membuat root file system mini dari image Alpine, lalu masuk ke dalamnya dengan chroot.

Pertama, siapkan image dan ekspor isinya:

```bash
mkdir -p rootfs

docker create --name alpine-root alpine:3.20
docker export alpine-root | tar -x -C rootfs
docker rm alpine-root
```

Sekarang `rootfs/` berisi file system Alpine yang lengkap, tapi tanpa kernel. Kernel tetap milik host.

Masuk ke dalamnya:

```bash
sudo chroot rootfs /bin/sh
```

Coba perintah berikut di dalam:

```bash
ls /
cat /etc/os-release
```

Kamu akan melihat struktur direktori Alpine, bukan struktur laptopmu. Kamu sekarang berada di dalam "dunia" yang berbeda, padahal tidak ada VM yang dijalankan.

Untuk keluar:

```bash
exit
```

::: warning Butuh Root
`chroot` hanya bisa dijalankan oleh root. Ini masuk akal, karena kalau semua user bisa mengubah root file system, isolasi keamanan akan kacau.
:::

---

## Apa yang Sebenarnya Terjadi

Secara teknis, `chroot` mengubah satu atribut pada proses, yaitu **root directory** di `task_struct` kernel. Setelah diubah, setiap path absolut yang dibuka proses itu akan dihitung relatif terhadap root baru.

<div align="center">

![Isolasi root file system dengan chroot](/miniclass/backend/assets/docker/chroot-root.png)

<sub>chroot mengganti root file system proses, tapi kernel dan resource tetap dipakai bersama</sub>

</div>

Yang penting dipahami: **kernel tidak berubah**. Proses masih memakai kernel yang sama dengan host. Yang berubah hanya cara kernel menerjemahkan path untuk proses tersebut.

---

## Batas chroot

`chroot` adalah fondasi, tapi dia bukan container. Ada beberapa hal yang tidak dia tangani.

### 1. Proses Lain Masih Terlihat

Jalankan chroot di satu terminal, lalu di terminal lain jalankan:

```bash
ps aux | grep sh
```

Proses `sh` di dalam chroot tetap terlihat di host. chroot tidak menyembunyikan daftar proses.

### 2. Network Masih Sama

Proses di dalam chroot memakai network interface yang sama dengan host. Kalau host punya IP `192.168.1.10`, proses di chroot juga memakai IP itu. Tidak ada network terpisah.

### 3. Resource Tidak Dibatasi

Proses di dalam chroot bisa memakai seluruh CPU dan RAM yang tersedia. Tidak ada batas. Kalau ada bug memory leak, seluruh host bisa kehabisan memori.

### 4. Root Bisa Keluar

Ini yang paling penting. Proses dengan hak root di dalam chroot masih bisa keluar, misalnya dengan memanfaatkan deskriptor direktori yang terbuka atau membuat device node. chroot bukan tembok keamanan yang kuat.

::: warning chroot Bukan Sandbox
Karena alasan di atas, jangan pernah menganggap chroot sebagai alat keamanan. Untuk isolasi yang serius, kamu butuh namespaces dan cgroups, dan itulah yang dilakukan container modern.
:::

---

## Kenapa chroot Penting untuk Container

Meskipun terbatas, chroot memberi ide dasar yang dipakai semua container: **memberi proses sudut pandang file system sendiri**.

Saat kamu menjalankan `docker run alpine`, Docker menyiapkan root file system dari image Alpine, lalu memastikan proses `sh` melihat root itu. Mekanismenya lebih canggih daripada `chroot` biasa, tapi idenya sama.

---

## Latihan

1. Buat rootfs Alpine seperti contoh di atas. Masuk dengan chroot, lalu jalankan `ls /`, `cat /etc/os-release`, dan `apk --version`.
2. Di dalam chroot, coba akses file di luar, misalnya `cat /home/kamu/file.txt`. Jelaskan hasilnya.
3. Buka terminal kedua di host, jalankan `ps aux`, dan cari proses di dalam chroot. Apakah terlihat?
4. Coba jalankan program yang tidak ada di rootfs, misalnya `python3 --version`. Jelaskan kenapa gagal.
5. Tantangan: jelaskan dengan bahasamu sendiri kenapa chroot saja tidak cukup untuk membuat container.
