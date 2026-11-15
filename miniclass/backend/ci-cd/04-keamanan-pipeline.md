# Pipeline Itu Target Serangan: Kunci Server Jangan Jadi Kunci Rumah

::: info **Prasyarat Modul**
Kamu sudah paham alur *pipeline* dari Halaman 1 dan strategi *deploy* dari Halaman 2. Halaman ini relatif pendek, tapi isinya yang bikin lab di Halaman 6 aman saat dijalankan di server beneran.
:::

Sekarang coba kita balik sudut pandangnya. Selama ini *pipeline* kita anggap sebagai asisten yang membantu pekerjaan kita.

Bagi penyerang, *pipeline* adalah **jalan tol langsung ke produksi**: satu titik yang memegang kunci SSH server, token *registry*, sekaligus hak penuh untuk mengganti kode yang sedang berjalan. Kalau *pipeline* sampai dibajak, penyerang tidak perlu capek-capek menjebol server satu per satu.

<img src="https://images.squarespace-cdn.com/content/v1/54dc6222e4b033be8f10b195/1465155083859-DG1CWJ72T1JVLDBJXMYU/image-asset.png?format=500w" width="480" />

## Action yang Tag-nya Dipindahkan

Pada **14 Maret 2025**, penyerang menyisipkan *commit* berbahaya ke `tj-actions/changed-files`, salah satu GitHub Action yang sangat populer, lalu memindahkan beberapa *tag* versi agar menunjuk ke *commit* jahat tersebut.

Menurut laporan [*BleepingComputer*](https://www.bleepingcomputer.com/news/security/supply-chain-attack-on-popular-github-action-exposes-ci-cd-secrets/amp/), insiden yang tercatat sebagai **CVE-2025-30066** ini berdampak cukup luas:

* Kode berbahaya tersebut melakukan dump memori *runner* yang berisi *secret* *workflow* langsung ke dalam *log*.
* Di repositori publik, *secret* itu terpampang nyata di *log* dalam format *base64* yang di-*encode* dua kali.
* Action ini dipakai oleh sekitar **23.000 repositori** (angka ini adalah jumlah pengguna, bukan jumlah yang terbukti terdampak).

**Bagian paling mengerikan:** file *workflow* yang menulis `uses: tj-actions/changed-files@v35` tidak berubah satu huruf pun. *Tag* `v35`-nya yang diam-diam digeser menunjuk ke kode lain.

::: info **Ingat prinsip di Halaman 1** 
*Tag* itu cuma penunjuk, sedangkan *commit SHA* adalah isinya. Ceritanya persis sama dengan jebakan tag `:latest` pada Docker.
:::


## Lima Kebiasaan yang Bikin Pipeline Sulit Dibajak

### 1. Pin Action ke Commit SHA Lengkap

Panduan [*Secure Use*](https://docs.github.com/en/actions/reference/security/secure-use) dari GitHub menyarankan untuk menyematkan (*pin*) *action* ke **commit SHA lengkap**, karena *tag* bisa dipindahkan atau dihapus kalau akun pemilik repositori *action* dibajak. Tambahkan komentar versi di sampingnya supaya tetap terbaca manusia:

```yaml
- uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
```

### 2. Beri `GITHUB_TOKEN` Hak Seminimal Mungkin

Selalu tulis blok `permissions:` di *workflow* dan berikan izin seperlunya saja. Panduan [*secure use*](https://docs.github.com/en/actions/reference/security/secure-use) menyarankan agar izin *default* `GITHUB_TOKEN` diatur ke *read-only*, lalu izin tulis ditambahkan khusus per *job* yang memang butuh:

```yaml
permissions:
  contents: read      # cukup untuk checkout kode
  packages: write     # hanya aktifkan di job yang push image
```

::: warning **Catatan** 
Saat blok `permissions` ditetapkan secara eksplisit, izin lain yang tidak disebut umumnya otomatis menjadi `none`.
:::

### 3. Rahasia Hanya di Tempat yang Perlu

*Secret* untuk *deploy* ke produksi tidak boleh ikut bocor ke *job* `test`. Gunakan fitur **Environments** di GitHub:

* Kunci *secret* khusus ke satu *environment* (misalnya `production`).
* Aktifkan persetujuan manusia (*required reviewers*) sebelum *job* di *environment* tersebut berjalan, sehingga *pull request* dari orang luar tidak akan pernah bisa menyentuhnya.

### 4. Jangan Percaya Teks dari Luar

Judul PR, nama *branch*, dan isi *issue* bisa dikarang bebas oleh penyerang. Kalau kamu menempelkan ekspresi konteks seperti `github.event.pull_request.title` langsung ke blok `run:`, teks tersebut bisa berubah menjadi perintah *shell* (*script injection*).

* Selipkan dulu lewat variabel `env:`, lalu panggil di dalam tanda kutip seperti `"$TITLE"`:

```yaml
# ❌ Berbahaya: input luar langsung dieksekusi oleh shell
- run: echo "${{ github.event.pull_request.title }}"

# ✅ Aman: tampung di environment variable terlebih dahulu
- env:
    TITLE: ${{ github.event.pull_request.title }}
  run: echo "$TITLE"
```
::: danger **Peringatan**
Hati-hati juga memakai *trigger* `pull_request_target`, karena *workflow* akan berjalan dengan hak akses yang jauh lebih besar dibanding `pull_request` biasa.
:::


### 5. Utamakan Kredensial Berumur Pendek

GitHub menyediakan **OIDC**: *runner* bisa meminta token sementara dengan izin `id-token: write`, sehingga kamu tidak perlu menyimpan kunci permanen penyedia *cloud* di dalam *secret*.

Sayangnya, server pribadi tidak mendukung OIDC bawaan seperti penyedia *cloud* besar, jadi untuk server sendiri, kita pakai pendekatan berbeda di bawah ini.

## Server Pribadi: Satu Pintu, Dua Cara Membukanya

Ini inti masalah pengamanan server pribadi: *pipeline* harus bisa melakukan *deploy*, tapi **tidak boleh** bisa mengakses file atau perintah sembarangan di server.

Solusinya bukan *"kasih akses server ke pipeline lalu berdoa semoga aman"*. Solusinya adalah membuat **satu pintu kecil** yang cuma mau menerima **tiga perintah** saja:

1. `deploy <image@sha256:...>`

2. `rollback`

3. `status`

Perintah apa pun di luar ketiga daftar itu langsung ditolak mentah-mentah. Pintu ini bisa dibuat lewat dua cara:

| Pintu | Cara Kerja | Kelebihan | Kekurangan | 
| ----- | ----- | ----- | ----- | 
| **SSH dengan kunci terbatas** | Di `authorized_keys`, satu kunci dipaksa menjalankan satu skrip saja. | Teruji puluhan tahun, tidak perlu menulis kode server HTTP baru. | Server harus bisa dijangkau *runner* lewat port SSH. | 
| **Webhook** | *Pipeline* mengirim `POST` ke URL rahasia, server menjalankan skrip yang sudah ditetapkan. | Tidak butuh SSH. Lewat *tunnel*, server tidak perlu membuka port; cukup `curl`. | *Endpoint* terbuka ke publik, dan kamu bertanggung jawab atas kode penerimanya. | 

### Pintu 1: SSH dengan Kunci yang Cuma Bisa Satu Hal

Menurut *man page* `sshd`, satu kunci publik di dalam file `authorized_keys` bisa dikunci mati agar hanya bisa mengeksekusi satu skrip tertentu:

```text
restrict,command="/opt/deployer/run.sh" ssh-ed25519 AAAA... github-actions-deployer
```

* **`command="..."`**: Perintah apa pun yang dikirim klien akan diabaikan; server hanya menjalankan skrip tersebut. Perintah asli dari klien disimpan di variabel `SSH_ORIGINAL_COMMAND` agar skrip bisa memvalidasinya.

* **`restrict`**: Mematikan seluruh fitur tambahan sekaligus (*port forwarding*, *agent forwarding*, X11, dan alokasi PTY), serta otomatis mewarisi pembatasan keamanan baru di versi OpenSSH mendatang.

* **`from="..."`**: Sebenarnya bisa membatasi alamat IP asal, tapi kurang cocok untuk *GitHub-hosted runner* karena rentang IP-nya terus berubah-ubah.

### Pintu 2: Webhook

Webhook adalah URL khusus yang akan memicu aksi di server saat dipanggil. Pola ini dipakai luas oleh platform modern: **Render** memperingatkan bahwa URL *deploy hook* adalah rahasia (*"Your deploy hook URL is a secret!"*), sementara **Vercel** membuat URL unik yang menerima `POST` tanpa *header* autentikasi dan meminta kita memperlakukannya layaknya *password* atau token. Artinya, **URL itu sendiri adalah kunci pintunya**.

Ada dua cara menjaga pintu webhook:

| Cara | Bagaimana | Kelemahan | 
| ----- | ----- | ----- | 
| **URL rahasia** *(Render, Vercel, sehooks)* | Token acak panjang ditempel di URL: `POST /webhook/<token>` | Siapa pun yang pernah melihat URL bisa memicu *deploy*, dan URL gampang bocor ke *log*. | 
| **Tanda tangan HMAC** *(GitHub)* | Pengirim menghitung HMAC dari isi *request* memakai *secret* bersama dan mengirimnya di *header* (`X-Hub-Signature-256`). | Lebih rumit di sisi pengirim dan penerima. Dokumentasi GitHub juga belum membahas *replay attack*, jadi kita harus menambah proteksi *timestamp* dan *nonce* sendiri. | 

Dokumentasi GitHub juga menekankan dua kebiasaan penting saat memvalidasi webhook: gunakan perbandingan ***constant-time*** (jangan pakai operator `==` biasa agar terhindar dari *timing attack*), dan gunakan *secret* acak berentropi tinggi.


## Lima Aturan yang Sama untuk Kedua Pintu

Mau pakai SSH maupun webhook, terapkan lima aturan pengaman ini di sisi server:

1. **Pemanggil memilih isi, bukan perintah.** Skrip eksekusi sudah tertanam tetap di server; pemanggil hanya boleh mengirimkan satu kalimat parameter pendek.

2. **Identitas datang dari server.** Nama peserta/layanan ditentukan server berdasarkan *hook* atau kunci SSH yang dipakai, bukan dari isi *payload* yang dikirim pemanggil.

3. **Isi *request* tidak dipercaya.** Terima karakter yang aman saja, batasi hanya pada tiga perintah yang diizinkan, dan pastikan format *image* cocok dengan pola `<prefix-peserta>@sha256:<64-karakter-hex>`.

4. **Tidak pernah lewat *shell*.** Jangan pernah menyusun input dari *request* menjadi gabungan *string* perintah *shell* (hindari risiko *command injection*).

5. **Batasi kerusakan (*blast radius*).** Jalankan *container* sebagai *non-root*, *filesystem* *read-only*, `cap-drop ALL`, batasi kuota memori/CPU/proses, dan putus akses jaringan keluar jika tidak perlu.

## Jebakan Terbesar: Docker

Menurut dokumentasi keamanan resmi Docker, hanya pengguna yang benar-benar tepercaya yang boleh mengendalikan daemon Docker, karena daemon ini bisa diminta memasang (*mount*) direktori *host* mana pun ke dalam *container*.

Praktisnya: **akun yang bisa menjalankan perintah `docker` sama saja dengan `root` di mesin tersebut.** Karena itu, jangan pernah me-*mount* `/var/run/docker.sock` ke dalam *container* yang menjalankan kode orang lain atau *pipeline* yang tidak sepenuhnya terisolasi.

## Dua Arah: Push dan Pull

Baik SSH maupun webhook sama-sama menganut **model *push***: *pipeline* mendorong perintah ke server, sehingga server wajib membuka pintu masuk yang bisa diketuk dari luar.

Kebalikannya adalah **model *pull***: sebuah agen di dalam server yang aktif menarik sendiri konfigurasi keadaan yang diinginkan. Prinsip ketiga **OpenGitOps** berbunyi: *"Software agents automatically pull the desired state declarations from the source."*

| Model | Siapa yang Memulai? | Pintu Masuk ke Server | Risiko Utama | 
| ----- | ----- | ----- | ----- | 
| **Push** | *Pipeline* | **Ada** (SSH atau Webhook) | Kunci SSH atau URL webhook bocor, sehingga pihak lain bisa memicu *deploy*. | 
| **Pull** | Agen di dalam server | **Tidak ada** (server yang menelepon keluar) | Agen memercayai sumber yang ditariknya; jika salah konfigurasi, agen akan menerapkan apa saja. | 

Di lab modul ini kita memakai model **push** karena alurnya paling lugas dan mudah diamati hasilnya. Model **pull** dikenalkan di sini supaya kamu tahu bahwa *"tidak membuka pintu masuk sama sekali"* juga merupakan pilihan arsitektur yang nyata.

## Tabel Jebakan

| Gejala | Penyebab | Cek | 
| ----- | ----- | ----- | 
| *Secret* muncul di *log* CI | Perintah `echo` atau mode *debug* mencetak isi variabel | Cari baris `echo $SECRET` dan matikan `set -x` di *job* sensitif. | 
| *Workflow* dari *fork* bisa mengakses *secret* | *Trigger* *workflow* terlalu longgar | Periksa penggunaan `pull_request_target` di file YAML. | 
| Satu kunci SSH bisa *login* penuh ke server | `authorized_keys` belum diberi `command=` dan `restrict` | Coba jalankan `ssh deployer@server ls /` dari komputermu. | 
| *Action* tiba-tiba berubah perilaku | Di-*pin* ke *tag*, bukan *commit SHA* | Cari baris `uses:` yang masih berakhiran `@v1` atau `@main`. | 
| *Image* produksi tidak jelas asal-usulnya | *Deploy* memakai tag `:latest` | Ubah konfigurasi *deploy* agar selalu memakai *digest* (`@sha256:...`). | 
| Token webhook bocor di *log* *proxy* atau aplikasi | URL diperlakukan seperti teks biasa, termasuk saat memakai `curl -v` | Cari kata `webhook` di semua *log*; samarkan *path* di *proxy* dan hindari `curl -v` di *workflow*. | 
| Webhook merespons `202` tapi versi tidak berubah | Kode `202` hanya tanda *request* diterima; skrip bisa menolak di belakang layar | Tambahkan langkah verifikasi yang menunggu versi baru aktif, lalu cek *log* skrip. | 
| Siapa pun yang tahu URL bisa memicu *deploy* | URL webhook diperlakukan setara dengan *password* | Terapkan satu token per orang, simpan di *secret*, dan segera *revoke* jika bocor. | 

## Latihan

1. Buka salah satu repositori *open-source* populer di GitHub, lalu periksa file *workflow* CI/CD-nya: apakah *action* yang dipakai sudah di-*pin* ke **commit SHA**? Apakah sudah ada blok `permissions:`?

2. Mengapa kunci SSH yang dibatasi dengan opsi `command=` jauh lebih aman dibandingkan kunci SSH biasa, padahal keduanya sama-sama menggunakan autentikasi kunci publik?

3. Jelaskan dengan bahasamu sendiri: mengapa me-*mount* `/var/run/docker.sock` ke dalam *container* sama bahayanya dengan memberikan akses `root` penuh pada mesin *host*?

4. **Tantangan:** Rancang daftar **tiga perintah** spesifik yang boleh diterima oleh skrip *deployer*-mu, serta **tiga perintah** berbahaya yang wajib langsung ditolak.

## Referensi

* [BleepingComputer: *Supply chain attack on `tj-actions/changed-files`* (Maret 2025)](https://www.bleepingcomputer.com/news/security/supply-chain-attack-on-popular-github-action-exposes-ci-cd-secrets/amp/)
* [GitHub Docs: *Secure use reference*](https://docs.github.com/en/actions/reference/security/secure-use)
* [GitHub Docs: *Controlling permissions for `GITHUB_TOKEN`*](https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token)
* [GitHub Docs: *OpenID Connect*](https://docs.github.com/en/actions/concepts/security/openid-connect)
* [GitHub Docs: *Deployments and environments*](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
* [OpenBSD `sshd(8)`: *AUTHORIZED_KEYS FILE FORMAT*](https://man.openbsd.org/sshd.8)
* [Docker Docs: *Engine security*](https://docs.docker.com/engine/security/)