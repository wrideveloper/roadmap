# Namespaces

::: info Prasyarat Modul
Kamu sudah paham chroot dan batasannya. Sekarang kita tambal kekurangan pertama: isolasi proses, network, dan hostname.
:::

chroot hanya menyelesaikan satu hal: file system. Proses di dalamnya masih terlihat dari host, masih memakai network yang sama, dan masih bisa mengubah hostname bersama.

**Namespace** menyelesaikan sisanya. Ini adalah salah satu fitur kernel Linux yang paling penting untuk container, dan kabar baiknya, kamu bisa memakainya tanpa Docker sama sekali.

---

## Konsep: Satu Resource, Banyak Pandangan

Normalnya, semua proses di Linux berbagi resource global yang sama:

- daftar proses
- network interface
- hostname
- mount point
- antrean IPC
- user dan group ID

Namespace membungkus resource itu sehingga sekelompok proses punya **pandangan sendiri**. Proses di namespace A tidak melihat proses di namespace B, walaupun keduanya berjalan di kernel yang sama.

Contoh sesi terminalnya seperti ini. Di host ada 247 proses. Setelah masuk PID namespace baru, yang terlihat tinggal dua:

```zsh
kamu@laptop:~$ ps -ef | wc -l
247

kamu@laptop:~$ sudo unshare --pid --fork --mount-proc /bin/sh
root@laptop:/# ps -ef
UID    PID   PPID  CMD
root     1      0  /bin/sh
root     7      1  ps -ef
root@laptop:/# exit
kamu@laptop:~$
```

Perhatikan perubahan prompt dari `kamu@laptop` menjadi `root@laptop`, dan PID shell yang menjadi `1`. Dari dalam sini, 245 proses host tidak ada.

Analoginya seperti gedung kantor dengan beberapa perusahaan. Semua memakai listrik dan gedung yang sama, tapi setiap perusahaan punya daftar karyawan, nomor telepon, dan papan nama sendiri.

---

## Jenis Namespace

Linux punya beberapa jenis namespace. Yang paling relevan untuk container:

| Namespace | Flag | Mengisolasi |
| :--- | :--- | :--- |
| PID | `--pid` | Daftar proses dan nomor PID |
| NET | `--net` | Network interface, routing, port |
| MNT | `--mount` | Mount point dan file system tree |
| UTS | `--uts` | Hostname dan domain name |
| IPC | `--ipc` | Shared memory dan message queue |
| USER | `--user` | User ID dan group ID |
| CGROUP | `--cgroup` | Pandangan terhadap cgroup |
| TIME | `--time` | Jam sistem dan monotonic clock |

Kita akan mencoba empat yang paling sering dipakai: PID, UTS, NET, dan USER.

::: tip Namespace Bukan Hak Akses
Namespace mengisolasi **pandangan**, bukan memberi atau mencabut izin. Kalau sebuah proses punya hak root di host, dia tetap punya hak root di dalam namespace, kecuali kamu memakai user namespace.
:::

---

## Percobaan 1: PID Namespace

Jalankan:

```bash
sudo unshare --pid --fork --mount-proc /bin/sh
```

Penjelasannya:

- `--pid` membuat PID namespace baru.
- `--fork` memastikan shell baru benar-benar menjadi proses pertama di namespace itu.
- `--mount-proc` memasang `/proc` baru supaya `ps` membaca daftar proses namespace ini, bukan host.

Di dalam shell baru, jalankan:

```bash
ps -ef
```

Kamu hanya akan melihat dua atau tiga proses: shell itu sendiri dan `ps`. Proses lain di host tidak terlihat. Padahal host bisa punya ratusan proses.

Cek PID dirimu:

```bash
echo $$
```

Biasanya hasilnya `1` atau angka kecil. Di host, shell itu punya PID yang jauh lebih besar. Nomor yang sama menunjuk ke proses yang berbeda di namespace yang berbeda.

Keluar dengan `exit`. Setelah keluar, `ps -ef` di host kembali menampilkan semua proses.

---

## Percobaan 2: UTS Namespace

UTS mengisolasi hostname. Jalankan:

```bash
sudo unshare --uts /bin/sh
```

Di dalam:

```bash
hostname
hostname kotak-belajar
hostname
```

Sekarang buka terminal lain di host, dan jalankan `hostname`. Hostname host tidak berubah. Kamu baru saja mengganti nama "komputer" versi namespace itu saja.

---

## Percobaan 3: NET Namespace

NET namespace memberi network stack sendiri: interface, routing table, dan port.

```bash
sudo unshare --net /bin/sh
```

Di dalam, coba:

```bash
ip link
ip addr
```

Kamu hanya akan melihat interface `lo` (loopback), dan biasanya statusnya `DOWN`. Tidak ada `eth0`, tidak ada IP dari router. Namespace ini benar-benar terputus dari jaringan sampai kamu menghubungkannya sendiri.

```bash
ip link set lo up
ip addr
```

Sekarang loopback hidup, tapi tetap tidak ada akses ke internet.

::: tip Inilah Kenapa Docker Butuh veth
Docker tidak membiarkan namespace network terputus. Dia membuat pasangan interface **veth** yang menghubungkan namespace container ke bridge di host. Kita tidak akan membangun itu manual di modul ini, tapi sekarang kamu tahu kenapa container punya IP sendiri.
:::

---

## Percobaan 4: USER Namespace

USER namespace memetakan user di dalam namespace ke user lain di host. Ini memungkinkan proses terlihat seperti root di dalam, tapi bukan root di host.

```bash
unshare --user --map-root-user /bin/sh
```

Perhatikan, tanpa `sudo`. Di dalam:

```bash
id
```

Hasilnya biasanya `uid=0(root) gid=0(root)`. Tapi kalau kamu membuat file di folder yang bisa ditulis, file itu di host tetap milik user aslimu, bukan root.

Ini fitur keamanan yang penting. Container modern memakai user namespace supaya proses di dalam tidak benar-benar root di host.

---

## Melihat Namespace yang Ada

Untuk melihat namespace milik proses tertentu:

```bash
ls -l /proc/<pid>/ns
```

Setiap entri adalah symlink ke namespace yang dipakai proses itu. Angka di dalam kurung siku adalah ID namespace. Proses yang berbagi namespace akan menunjukkan ID yang sama.

Untuk melihat semua namespace di sistem:

```bash
sudo lsns
```

Untuk masuk ke namespace proses lain:

```bash
sudo nsenter --target <pid> --pid --net --mount /bin/sh
```

`nsenter` adalah alat yang sangat berguna saat debugging container. Kalau `docker exec` tidak bisa dipakai, `nsenter` bisa menjadi jalan masuk.

---

## Hubungan dengan Docker

Saat kamu menjalankan container, Docker pada dasarnya melakukan ini:

1. Membuat sekumpulan namespace baru untuk proses container.
2. Menyiapkan root file system dari image.
3. Menjalankan proses utama di dalam namespace tersebut.

Itu sebabnya proses di container punya PID `1`, punya hostname sendiri, punya network sendiri, dan tidak melihat proses host.

::: warning Satu Container Satu Proses Utama
Karena PID namespace, proses pertama di container menjadi PID 1. Proses ini punya tanggung jawab khusus, misalnya menerima sinyal dan membersihkan child process. Itu sebabnya menjalankan banyak service di satu container dianggap praktik yang kurang baik.
:::

---

## Latihan

1. Jalankan PID namespace dengan `unshare`, lalu bandingkan `ps -ef` di dalam dan di luar.
2. Ganti hostname di UTS namespace, lalu buktikan host tidak berubah.
3. Di NET namespace, coba `ping 1.1.1.1`. Jelaskan kenapa gagal.
4. Jalankan USER namespace, lalu buat file di `/tmp` dari dalam. Cek pemilik file itu di host.
5. Tantangan: jalankan `lsns`, pilih satu PID container yang sedang berjalan, lalu gunakan `nsenter` untuk masuk ke network namespace-nya dan jalankan `ip addr`.
