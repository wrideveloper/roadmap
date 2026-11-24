# Chapter 4: Attack-Surface Mapping dan Service Enumeration

Materi ini diadaptasi dari **Miniclass Cyber - Attack-Surface Mapping and Service Enumeration**. Setelah menemukan host dan port pada [Chapter 3](/miniclass/cyber/penetration-testing/minggu-03-active-reconnaissance-dan-network-scanning), kita mencari tahu layanan apa yang berjalan, informasi apa yang terlihat, dan bagaimana satu temuan membantu menyelidiki layanan lain.

::: warning Batas latihan
Jalankan perintah hanya pada target lab yang diberikan mentor dan sesuai izin. Jangan mencoba kredensial, membaca berkas, atau memindai jaringan di luar cakupan lab. Unduh hanya berkas yang diperlukan sebagai bukti; jangan mengunggah atau mengubah data target.
:::

## Hasil belajar

Setelah chapter ini, peserta dapat:

- Membuat inventaris port, layanan, versi, dan hak akses yang terlihat.
- Melakukan enumerasi dasar FTP, SSH, DNS, SMB, SNMP, SMTP/POP3/IMAP, NFS, dan Rsync.
- Mencatat bukti serta menghubungkan petunjuk antar layanan menjadi peta attack surface.

## Alur kerja dan peta layanan

1. **Port scan:** gunakan hasil TCP dari Chapter 3, lalu periksa UDP untuk layanan seperti SNMP.
2. **Fingerprint:** catat nama layanan, versi, banner, dan hostname.
3. **Enumerasi:** periksa resource, kemampuan, serta akses yang memang diizinkan.
4. **Catat temuan:** simpan perintah, keluaran relevan, dan sumber tiap petunjuk.
5. **Chaining:** uji apakah petunjuk dari satu layanan menjelaskan layanan lain dalam scope.

| Port lab | Layanan | Fokus awal |
| --- | --- | --- |
| 21/tcp | FTP | Banner, anonymous, daftar file |
| 22/tcp | SSH | Versi, algoritma, metode autentikasi |
| 25/tcp | SMTP | Banner dan kemampuan EHLO |
| 53/udp dan tcp | DNS | Record, PTR, AXFR |
| 110/tcp, 143/tcp | POP3, IMAP | Kemampuan dan mailbox dengan kredensial lab |
| 139/tcp, 445/tcp | SMB | Share dan akses guest |
| 161/udp | SNMP | Community string dan informasi sistem |
| 111/tcp, 2049/tcp | RPC/NFS | Export dan izin mount |
| 873/tcp | Rsync daemon | Module dan izin baca |

Port adalah petunjuk, bukan bukti pasti jenis layanan. Verifikasi dengan `-sV` atau respons protokol. Contoh berikut memakai variabel `IP` dan zona DNS lab; ganti sesuai informasi dari mentor:

```bash
export IP=192.0.2.10
export ZONA=wri.local
nmap -sV -p21,22,25,53,110,111,139,143,445,873,2049 "$IP"
sudo nmap -sU -p53,161 "$IP"
```

Alamat `192.0.2.10` hanya contoh dokumentasi. Hasil UDP `open|filtered` belum memastikan layanan aktif; lanjutkan dengan query protokol.

## FTP: file dan akses anonymous

FTP memakai port kontrol 21/tcp dan koneksi data terpisah. Pada mode **active**, server menghubungi client untuk transfer data; pada mode **passive**, client menghubungi port data yang diberikan server. Di lab sumber, rentang passive adalah 30000–30009. FTP biasa mengirim kredensial dan isi tanpa enkripsi.

Periksa banner, izin anonymous, daftar direktori, lalu izin baca/tulis. Jangan menguji unggah dengan mengubah data lab tanpa instruksi mentor.

```bash
nmap -sV -p21 --script ftp-anon,ftp-syst "$IP"
curl --user anonymous: "ftp://$IP/"
ftp "$IP"
# Saat diminta: user anonymous, password kosong. Lalu: ls, cd <direktori>, get <file-bukti>, bye
```

## SSH: identitas dan metode login

SSH menyediakan login jarak jauh terenkripsi pada 22/tcp. Sebelum login, server dapat mengungkap banner versi dan host key. Metode seperti `password`, `publickey`, atau `keyboard-interactive` memberi petunjuk cara akun diautentikasi. Versi atau metode autentikasi sendiri belum membuktikan adanya celah.

```bash
nmap -sV -p22 --script ssh2-enum-algos,ssh-hostkey "$IP"
ssh -v -o PreferredAuthentications=none test@"$IP"
# Cari "Authentications that can continue" pada output SSH.
```

Gunakan akun `test` hanya sebagai contoh untuk membaca metode yang ditawarkan. Login dengan kredensial lab yang sah jika petunjuk dari layanan lain mengarah ke SSH.

## DNS: nama host dan zona

DNS memakai 53/udp untuk sebagian besar query dan 53/tcp antara lain untuk zone transfer. Record penting: `A`/`AAAA` untuk alamat, `CNAME` untuk alias, `MX` untuk mail server, `NS` untuk nameserver, `TXT` untuk teks, `PTR` untuk reverse lookup, dan `SOA` untuk otoritas zona. **AXFR** meminta isi zona penuh; keberhasilannya pada server yang tidak semestinya memberi akses merupakan temuan.

```bash
dig @"$IP" "$ZONA" NS
dig @"$IP" "$ZONA" SOA
dig @"$IP" "$ZONA" MX
dig @"$IP" "$ZONA" TXT
dig @"$IP" -x "$IP"
dig @"$IP" "$ZONA" AXFR
```

Tambahkan nama host yang ditemukan ke inventaris, lalu verifikasi apakah masih berada dalam scope. AXFR yang ditolak adalah perilaku normal.

## SMB: share dan izin guest

SMB berbagi file melalui 445/tcp; 139/tcp dipakai melalui NetBIOS. Periksa dialek SMB, daftar share, dan hak akses. `-N` pada `smbclient` mencoba tanpa password. Null session dan guest tidak selalu sama; bedakan hasilnya dari respons server.

```bash
nmap -p139,445 --script smb-os-discovery,smb-protocols,smb-enum-shares "$IP"
smbclient -L "//$IP/" -N
smbclient "//$IP/public" -N
# Di prompt smbclient: ls, get <file-bukti>, exit
```

Catat apakah share hanya terlihat, dapat dibaca, atau dapat ditulis. Jangan mencoba menulis untuk membuktikan izin tanpa arahan mentor.

## SNMP: informasi sistem melalui UDP

SNMP pada 161/udp digunakan untuk monitoring. SNMPv1/v2c memakai *community string* yang tidak terenkripsi; SNMPv3 dapat menyediakan autentikasi dan enkripsi. OID mengidentifikasi data dalam pohon MIB. `public` di bawah adalah nilai contoh dari lab, bukan nilai yang pasti berlaku pada target.

```bash
sudo nmap -sU -p161 --script snmp-info,snmp-sysdescr "$IP"
snmpwalk -v2c -c public "$IP" 1.3.6.1.2.1.1
snmpget -v2c -c public "$IP" 1.3.6.1.2.1.1.4.0
snmpwalk -v2c -c public "$IP" 1.3.6.1.2.1.25.4.2.1.2
```

| OID | Arti |
| --- | --- |
| `1.3.6.1.2.1.1.1.0` | Deskripsi sistem (`sysDescr`) |
| `1.3.6.1.2.1.1.4.0` | Kontak admin (`sysContact`) |
| `1.3.6.1.2.1.1.5.0` | Hostname (`sysName`) |
| `1.3.6.1.2.1.25.4.2.1.2` | Nama proses |
| `1.3.6.1.2.1.25.4.2.1.5` | Argumen proses; bisa berisi data sensitif |

Jangan menyalin nilai rahasia ke laporan terbuka. Simpan bukti seperlunya dan samarkan kredensial.

## Mail: SMTP, POP3, dan IMAP

SMTP (25/tcp) mengirim email; POP3 (110/tcp) dan IMAP (143/tcp) membaca mailbox. POP3 terutama berfokus pada pengambilan pesan, sedangkan IMAP mendukung folder dan sinkronisasi di server. Port 465/587, 995, dan 993 umum dipakai untuk varian dengan TLS atau STARTTLS. Jangan mengirim password pada koneksi teks biasa kecuali lab secara eksplisit menyiapkan skenario tersebut.

Mulai dari banner dan kemampuan protokol tanpa login:

```bash
nmap -sV -p25,110,143 --script smtp-commands,pop3-capabilities,imap-capabilities "$IP"
nc -nv "$IP" 25
# Ketik satu per satu setelah terhubung: EHLO lab.local, lalu QUIT
```

`VRFY` dan `EXPN` dapat mengungkap akun atau daftar anggota jika server mengizinkan. Jika mentor memberikan kredensial lab, POP3 mendukung `USER`, `PASS`, `LIST`, `RETR 1`; IMAP mendukung `a1 LOGIN`, `a2 SELECT INBOX`, `a3 FETCH 1 BODY[]`, dan `a4 LOGOUT`. Gunakan koneksi TLS bila tersedia. Catat hanya pesan yang relevan dengan latihan.

## NFS: export file Unix/Linux

NFS melayani file pada 2049/tcp, sementara `rpcbind` pada 111/tcp menunjukkan layanan RPC terkait. `showmount` menampilkan export pada konfigurasi yang mendukungnya. Opsi `ro`/`rw` mengatur baca/tulis; `root_squash` membatasi root dari client, sedangkan `no_root_squash` memberi risiko tinggi.

```bash
rpcinfo -p "$IP"
showmount -e "$IP"
nmap -p111,2049 --script rpcinfo,nfs-showmount,nfs-ls "$IP"
# Jika export lab mengizinkan mount:
sudo mkdir -p /mnt/wri-nfs
sudo mount -t nfs -o ro "$IP:/srv/nfs/public" /mnt/wri-nfs
ls -la /mnt/wri-nfs
sudo umount /mnt/wri-nfs
```

Path export di atas hanya contoh. Gunakan path dari `showmount` dan selalu mount baca saja untuk inspeksi.

## Rsync: module backup

Rsync dapat berjalan lewat SSH atau sebagai daemon pada 873/tcp. Mode daemon membagikan direktori sebagai **module**; nama module mungkin terlihat tanpa login. Periksa daftar dan isi secara `--list-only` sebelum mengambil berkas. Mode daemon tidak otomatis terenkripsi.

```bash
nmap -p873 --script rsync-list-modules "$IP"
rsync --list-only "rsync://$IP/"
rsync --list-only "rsync://$IP/public/"
# Jika perlu bukti tertentu dan diizinkan:
rsync "rsync://$IP/public/<file-bukti>" ./
```

Module yang tidak terlihat belum tentu tidak ada: pengaturan `list = no` dapat menyembunyikannya. Akses baca tidak membuktikan akses tulis.

## Menghubungkan temuan dan mencatat bukti

Di lab sumber, contoh alurnya adalah **SNMP → POP3/IMAP → SSH**: informasi dari SNMP memberi petunjuk tentang mailbox, lalu isi email memberi petunjuk akses berikutnya. Setiap langkah harus diverifikasi secara terpisah. Jangan menyimpulkan suatu akun atau password valid hanya dari kemiripan string.

Gunakan tabel kerja berikut untuk peta attack surface:

| Host/port | Service dan versi | Temuan serta bukti | Akses yang terverifikasi | Langkah berikutnya |
| --- | --- | --- | --- | --- |
| `192.0.2.10:21` | FTP, versi dari `-sV` | Anonymous diizinkan; daftar direktori | Baca saja, jika terbukti | Periksa file relevan |
| `192.0.2.10:161/udp` | SNMPv2c | `sysContact` atau proses mengungkap petunjuk | Query read-only | Cocokkan dengan mail |

## Panduan membaca hasil enumerasi

Temuan yang baik menjawab **apa yang terlihat, bagaimana kita mengetahuinya, dan apa langkah berikutnya**. Contoh: “FTP mengizinkan login anonymous; `ftp-anon` dan login manual mengonfirmasi daftar folder `pub`; periksa file dokumentasi di sana.” Hindari kalimat “FTP rentan” jika hanya port 21 terbuka.

| Hasil | Makna yang dapat disimpulkan | Hal yang belum terbukti |
| --- | --- | --- |
| Port TCP `open` | Ada proses yang menerima koneksi | Versi dan hak aksesnya |
| UDP `open\|filtered` | Nmap tidak mendapat penolakan pasti | Layanan benar-benar aktif |
| Banner versi | Server mengaku menjalankan versi tertentu | Versi itu pasti rentan |
| Share/module terlihat | Nama resource dapat diketahui | Isinya dapat dibaca atau ditulis |
| Login anonymous berhasil | Akses tanpa akun diterima | Seluruh direktori dapat diakses |
| AXFR mengembalikan record | Server memberikan isi zona | Semua host di zona termasuk scope |

### Urutan pemeriksaan per layanan

Untuk setiap port yang relevan, ikuti urutan ini:

1. Simpan hasil scan dan waktu pengambilan.
2. Ambil banner atau respons awal; catat hostname dan versi jika ada.
3. Jalankan query yang paling ringan, misalnya daftar share atau record.
4. Periksa izin akses secara baca saja dan hanya pada resource lab.
5. Bandingkan hasil dengan layanan lain. Nama host dari DNS dapat menjelaskan server mail; nama user dari SMB dapat membantu memahami petunjuk pada mailbox.
6. Catat hasil negatif juga, misalnya “AXFR ditolak” atau “share memerlukan autentikasi”. Ini mencegah pengulangan kerja.

Jangan menganggap satu output tool sebagai kebenaran final. Tool dapat salah mengenali service, mengabaikan konfigurasi tertentu, atau menerima respons yang tidak lengkap. Verifikasi temuan penting dengan metode kedua yang masih dalam scope.

## Pendalaman per layanan

### FTP: mode data, daftar file, dan izin

Perintah ke port 21 memakai **control connection**. Perintah `LIST` atau unduhan file membutuhkan **data connection** tambahan. Jika login berhasil tetapi `ls` macet, kemungkinan masalahnya ada pada port passive yang diblokir, bukan pada kredensial. Server dapat memilih port passive secara dinamis; lab pada slide memakai 30000–30009.

| Pertanyaan | Bukti yang dicari |
| --- | --- |
| Apakah anonymous aktif? | Respons `ftp-anon` atau sesi login yang berhasil |
| Folder apa yang terlihat? | Output `ls` berikut path saat itu |
| File mana yang relevan? | Nama, lokasi, dan isi seperlunya |
| Apakah ada izin tulis? | Informasi permission, tanpa mencoba upload |

Hindari `wget -m` pada lab yang besar: perintah itu mengunduh seluruh isi FTP dan dapat mengambil data di luar kebutuhan latihan. Mulai dari daftar folder dan ambil satu file yang memang menjadi bukti.

### SSH: banner, host key, dan autentikasi

Koneksi SSH berlangsung melalui pembukaan TCP, pertukaran banner, negosiasi algoritma dan host key, lalu autentikasi user. `ssh2-enum-algos` menunjukkan algoritma yang ditawarkan server; `ssh-hostkey` menunjukkan fingerprint kunci host. Fingerprint berguna untuk memastikan kita kembali ke server yang sama pada langkah berikutnya.

Jika `ssh -v` menampilkan `Authentications that can continue: publickey,password`, itu berarti server mengizinkan kedua metode tersebut. Output ini **tidak** menunjukkan bahwa user `test` ada atau password tertentu valid. CVE juga harus dicocokkan dengan versi, konfigurasi, dan bukti lain pada chapter penilaian kerentanan.

### DNS: dari satu record ke peta host

Mulai dari `NS` dan `SOA` agar tahu server otoritatif zona. Setelah itu cek `A`, `AAAA`, `MX`, `CNAME`, dan `TXT`. `PTR` memberi nama dari alamat IP, tetapi pengelolaan reverse zone terpisah dari forward zone sehingga keduanya bisa berbeda.

Contoh cara membaca hubungan antar-record:

```text
wri.local             MX     mail.wri.local
mail.wri.local        A      192.0.2.10
ftp.wri.local         CNAME  mail.wri.local
```

Dari sini ada tiga nama yang perlu dicatat, tetapi hanya satu alamat IP yang terlihat. Periksa apakah nama dan alamat tersebut masuk scope sebelum melanjutkan. `TXT` kadang memuat petunjuk konfigurasi; jangan langsung memperlakukan setiap string sebagai kredensial.

AXFR bekerja lewat TCP/53. Jika query `dig @"$IP" "$ZONA" AXFR` gagal, bedakan `REFUSED`, `Transfer failed`, dan koneksi TCP yang tidak tersedia. Ketiganya berbeda penyebabnya dan tidak otomatis merupakan kelemahan.

### SMB: daftar share versus izin efektif

SMB1 merupakan dialek lama yang sebaiknya tidak dipakai; SMB2/SMB3 lebih baru. Hasil `smb-protocols` menunjukkan dialek yang didukung, bukan memastikan server memakai semuanya untuk setiap koneksi. `smbclient -L` hanya menguji apakah daftar share dapat dilihat. Untuk mengetahui akses efektif, buka satu share yang memang termasuk lab dan lihat apakah perintah `ls` berhasil.

`ADMIN$` dan `IPC$` adalah share administratif/khusus; keberadaannya tidak berarti dapat dibaca guest. Catat izin per share secara terpisah. Jika mendapat `NT_STATUS_ACCESS_DENIED`, simpan sebagai hasil, jangan menebak atau memaksa password.

### SNMP: OID dan kualitas informasi

OID sistem (`1.3.6.1.2.1.1`) biasanya memberi deskripsi OS, uptime, kontak, hostname, dan lokasi. OID Host Resources dapat memberi daftar proses atau software. Nilai `sysContact` dan `sysLocation` diisi manual sehingga mungkin usang; cocokkan dengan sumber lain. Argumen proses perlu diperlakukan sebagai data sensitif karena bisa berisi rahasia.

Pada SNMPv1/v2c, community string berfungsi sebagai rahasia bersama. Komunitas `public` yang berhasil dibaca menunjukkan akses baca pada OID yang tersedia, bukan akses tulis. SNMPv3 dapat memerlukan user dan pengaturan autentikasi/enkripsi; contoh `snmpwalk -v2c` memang tidak berlaku untuk konfigurasi itu.

### Mail: perintah protokol dan keamanan koneksi

`EHLO` meminta daftar kemampuan SMTP, termasuk kemungkinan `STARTTLS`. `VRFY` dan `EXPN` bisa dinonaktifkan; respons gagal tidak membuktikan user tidak ada. POP3 memakai `STAT` untuk jumlah/ukuran pesan, `LIST` untuk daftar, dan `RETR n` untuk membaca pesan. IMAP memakai tag pada tiap perintah, misalnya `a1`, `a2`, sehingga respons dapat dicocokkan dengan permintaan.

Jika target menawarkan STARTTLS atau port TLS, gunakan kanal terenkripsi saat memasukkan kredensial lab. Sesi `nc` plaintext pada materi ini hanya untuk banner dan kemampuan yang tidak memerlukan login. Catat header serta isi pesan yang relevan saja, dengan password atau token disamarkan pada laporan.

### NFS: memahami hasil export

`rpcinfo -p` menunjukkan service RPC yang terdaftar. `showmount -e` menunjukkan path export dan host/subnet yang diizinkan pada konfigurasi yang mendukung protokol mount tersebut. Pada beberapa konfigurasi NFSv4, hasil `showmount` tidak lengkap; ini bukan bukti bahwa tidak ada export.

Opsi `ro` berarti server menolak penulisan, sedangkan `rw` mengizinkan penulisan menurut aturan export. `root_squash` menurunkan identitas root client; `no_root_squash` memberi root client hak yang jauh lebih besar dan perlu dicatat sebagai risiko konfigurasi. Mount lokal dengan `-o ro` mengurangi peluang perubahan tidak sengaja, tetapi tetap patuhi izin pada server.

### Rsync: module, daftar, dan unduhan

Rsync daemon merespons pada 873/tcp dan menyediakan module seperti `public` atau `backup`. `rsync --list-only rsync://host/` meminta nama module yang boleh ditampilkan. `list = no` menyembunyikan module dari daftar, tetapi module itu bisa tetap diakses oleh pihak yang tahu namanya jika izin mengizinkan. `auth users` mengatur autentikasi module; `read only = yes` mengatur penulisan.

Gunakan `--list-only` pada module terlebih dahulu. Jika harus mengambil satu file bukti, tulis path file secara spesifik. Mengunduh seluruh backup berisiko mengambil data berlebihan dan membuat hasil latihan sulit ditinjau.

## Menyusun peta attack surface

Peta dapat berupa tabel atau diagram. **Node** adalah host, service, akun, share, atau file penting. **Hubungan** menjelaskan petunjuk yang terverifikasi: DNS menunjuk ke host, SNMP menyebut nama user, mailbox memuat informasi SSH, atau SMB share berisi konfigurasi aplikasi. Tulis bukti pada setiap hubungan, bukan sekadar dugaan.

```text
Target lab 192.0.2.10
├─ 53/tcp DNS → record MX: mail.wri.local
├─ 161/udp SNMP → petunjuk akun mailbox
├─ 110/tcp POP3 → pesan terkait akses SSH
└─ 22/tcp SSH → login hanya dengan kredensial lab yang sah
```

Prioritaskan pemeriksaan berdasarkan paparan dan nilai informasi, bukan hanya nomor port. Misalnya, share guest yang berisi file konfigurasi lebih relevan untuk ditinjau daripada banner SSH yang tidak mengungkap apa pun selain versi. Kategori prioritas sementara: **tinggi** bila akses tanpa autentikasi membuka data sensitif; **sedang** bila metadata internal terekspos; **rendah** bila hanya banner umum terlihat. Penilaian risiko final memerlukan dampak dan konteks pada chapter berikutnya.

### Format catatan praktikum

Untuk setiap temuan, isi lima bagian berikut:

```text
Waktu dan target: <waktu, IP, port, scope>
Perintah: <perintah persis yang dijalankan>
Bukti: <cuplikan output relevan; rahasia disamarkan>
Kesimpulan: <apa yang benar-benar terbukti>
Langkah berikutnya: <pemeriksaan aman yang masuk scope>
```

Kesalahan yang sering terjadi adalah berhenti setelah port scan, melewatkan UDP/161, menganggap versi software sebagai bukti kerentanan, mengira daftar share berarti izin baca, dan menyalin data sensitif lengkap ke laporan. Periksa kembali setiap kesimpulan terhadap output yang disimpan.

## Praktikum: 10 flag

Enumerasi target hands-on yang diberikan mentor. Kumpulkan flag `WRI{...}` dari FTP, SSH, SMTP, DNS (AXFR), SMB, SNMP, POP3, IMAP, NFS, dan Rsync. Untuk setiap flag, tulis layanan asal, perintah yang dipakai, petunjuk yang membawamu ke sana, serta bukti singkat. Bonus: gambarkan rantai petunjuk yang berakhir pada login SSH sebagai user lain. Gunakan hanya target lab; jangan mengakses jaringan lain.
