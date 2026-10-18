# 📝 Pertemuan 3: CRUD 1 — Template FE & Proses READ-CREATE

**Tema:** Template FE & Proses READ-CREATE Data Absensi

<div align="center">

![HTML](/miniclass/backend/assets/html.png)

</div>

:::info 📝 Prasyarat
Tabel `tb_absensi` sudah ada ([Pertemuan 1](./pertemuan-1-database-ddl)) dan file `koneksi.php` sudah terhubung ([Pertemuan 2](./pertemuan-2-php-dml-koneksi)). Dasar form HTML ada di [Pengenalan HTML](/miniclass/backend/fundamental/html).
:::

## 1. Template FE Form Input Absensi

Buat struktur HTML dasar berisi form input untuk data mahasiswa (nama, NIM, status kehadiran, tanggal). Perhatikan atribut `action` dan `method="POST"`:

```html
<form action="" method="POST">
    <label>
        Nama Mahasiswa:
        <input type="text" name="nama" required>
    </label>

    <label>
        NIM:
        <input type="text" name="nim" required>
    </label>

    <label>
        Status:
        <select name="status" required>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpa">Alpa</option>
        </select>
    </label>

    <label>
        Tanggal:
        <input type="date" name="tanggal" required>
    </label>

    <input type="submit" name="simpan" value="Simpan">
</form>
```

| Atribut | Fungsi |
|---------|--------|
| `action=""` | Data dikirim ke halaman yang sama (diproses PHP di atas form) |
| `method="POST"` | Data dikirim via body request — cocok untuk create/update |
| `name="..."` | Nama variabel yang dibaca PHP lewat `$_POST['nama']`, dst. |

Proses sisi servernya (CREATE) — tangkap `$_POST` lalu `INSERT`:

```php
<?php
include 'koneksi.php';

if (isset($_POST['simpan'])) {
    $nama    = $_POST['nama'];
    $nim     = $_POST['nim'];
    $status  = $_POST['status'];
    $tanggal = $_POST['tanggal'];

    $query = "INSERT INTO tb_absensi (nama, nim, status, tanggal)
              VALUES ('$nama', '$nim', '$status', '$tanggal')";
    mysqli_query($koneksi, $query);
    header("Location: index.php");
}
?>
```

## 2. READ — GET Data Absensi (Backend)

Ambil seluruh data dari database dengan `SELECT *`, plus tangkap parameter filter jika ada:

```php
<?php
include 'koneksi.php';

$query = "SELECT * FROM tb_absensi ORDER BY id DESC";
$data_query = mysqli_query($koneksi, $query);
?>
```

## 3. Template FE Tabel Absensi

Buat elemen tabel HTML (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`), lalu tampilkan data secara dinamis dengan perulangan `while`:

```php
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>NIM</th>
            <th>Status</th>
            <th>Tanggal</th>
        </tr>
    </thead>
    <tbody>
        <?php while ($row = mysqli_fetch_assoc($data_query)) : ?>
        <tr>
            <td><?= $row['id']; ?></td>
            <td><?= $row['nama']; ?></td>
            <td><?= $row['nim']; ?></td>
            <td><?= $row['status']; ?></td>
            <td><?= $row['tanggal']; ?></td>
        </tr>
        <?php endwhile; ?>
    </tbody>
</table>
```

Pola kuncinya: **satu query → satu loop → satu `<tr>` per baris data**. Fungsi `mysqli_fetch_assoc()` mengambil satu baris sebagai array asosiatif (`$row['nama']`, dst.) sampai data habis.

## 4. Pendalaman: Layout Form & Validasi Klien

Sesi latihan: rapikan tata letak form dan manfaatkan validasi sisi klien dengan atribut `required` — browser menolak submit jika ada field kosong, tanpa perlu JavaScript tambahan.

```html
<input type="text" name="nama" required>
<input type="date" name="tanggal" required>
```

:::tip 💡 Dua lapis validasi
`required` hanya validasi di browser (bisa dilewati). Validasi sesungguhnya tetap di server (cek `$_POST` tidak kosong sebelum `INSERT`). Versi API modern di proyek ini memvalidasi ketat di server — lihat [Kode Lengkap & PDO API](./kode-absensi).
:::

## 5. Integrasi READ + Tabel (Studi Kasus)

Gabungkan bagian 2 dan 3: hasil `SELECT` langsung tampil rapi di tabel HTML yang telah dibuat. Pastikan struktur tabel responsif dan mudah dibaca sebelum masuk ke tahap edit data (Pertemuan 4).

## ✅ Checklist Pertemuan 3

- [ ] Form input (nama, NIM, status, tanggal) dengan `action` + `method="POST"` berfungsi
- [ ] Data baru tersimpan via `INSERT` dan halaman redirect setelah simpan
- [ ] Tabel menampilkan seluruh data via `SELECT` + `while` loop
- [ ] Semua input memakai `required`

## ➡️ Lanjut

[Pertemuan 4: CRUD 2 — Update & Delete](./pertemuan-4-crud-update-delete) — form edit pre-filled, `UPDATE ... WHERE id`, dan hapus dengan konfirmasi.
