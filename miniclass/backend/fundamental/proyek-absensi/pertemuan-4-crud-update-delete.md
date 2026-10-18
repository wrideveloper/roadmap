# ✏️ Pertemuan 4: CRUD 2 — UPDATE, Form Update, & DELETE

**Tema:** UPDATE, Form Update, & DELETE Data Absensi

:::info 📝 Prasyarat
Read & Create dari [Pertemuan 3](./pertemuan-3-crud-read-create) sudah berfungsi — tabel menampilkan data dan form tambah menyimpan data baru.
:::

## 1. UPDATE — Update Data Absensi

Logika backend untuk mengubah data memakai query `UPDATE ... WHERE id = ...`, dengan ID ditangkap dari URL via `$_GET['id']`:

```php
<?php
include 'koneksi.php';

$id = $_GET['id'];

if (isset($_POST['update'])) {
    $nama    = $_POST['nama'];
    $nim     = $_POST['nim'];
    $status  = $_POST['status'];
    $tanggal = $_POST['tanggal'];

    $query = "UPDATE tb_absensi
              SET nama='$nama', nim='$nim', status='$status', tanggal='$tanggal'
              WHERE id='$id'";
    mysqli_query($koneksi, $query);
    header("Location: index.php");
}
?>
```

| Bagian | Fungsi |
|--------|--------|
| `$_GET['id']` | Menangkap ID dari URL (`edit.php?id=3`) |
| `SET ...` | Kolom-kolom yang ditimpa dengan data baru dari form |
| `WHERE id='$id'` | Membatasi update **hanya pada satu baris** — tanpa ini semua data berubah |
| `header("Location: index.php")` | Redirect kembali ke daftar setelah update berhasil |

## 2. Template Form Update (`edit.php`)

Buat halaman form edit terpisah. Data lama ditarik dulu dari database, lalu dimasukkan ke atribut `value="..."` agar form terisi otomatis (*pre-filled*):

```php
<?php
include 'koneksi.php';

$id = $_GET['id'];
$data_query = mysqli_query($koneksi, "SELECT * FROM tb_absensi WHERE id = '$id'");
$data = mysqli_fetch_assoc($data_query);
?>

<form action="" method="POST">
    <label>
        Nama Mahasiswa:
        <input type="text" name="nama" value="<?= $data['nama']; ?>" required>
    </label>

    <label>
        NIM:
        <input type="text" name="nim" value="<?= $data['nim']; ?>" required>
    </label>

    <label>
        Status:
        <select name="status" required>
            <option value="Hadir" <?= $data['status'] == 'Hadir' ? 'selected' : ''; ?>>Hadir</option>
            <option value="Izin" <?= $data['status'] == 'Izin' ? 'selected' : ''; ?>>Izin</option>
            <option value="Sakit" <?= $data['status'] == 'Sakit' ? 'selected' : ''; ?>>Sakit</option>
            <option value="Alpa" <?= $data['status'] == 'Alpa' ? 'selected' : ''; ?>>Alpa</option>
        </select>
    </label>

    <label>
        Tanggal:
        <input type="date" name="tanggal" value="<?= $data['tanggal']; ?>" required>
    </label>

    <button type="submit" name="update">Update Data</button>
    <a href="index.php">Batal</a>
</form>
```

Alurnya: **GET** (`?id=...` → tampilkan data lama di form) lalu **POST** (tombol update → tulis data baru ke database). Contoh di atas disederhanakan dari `edit.php` di proyek sumber.

Dari tabel daftar, tiap baris diberi tautan edit yang menyertakan ID:

```html
<a href="edit.php?id=<?= $row['id']; ?>">Edit</a>
```

## 3. DELETE — Delete Data Absensi

Buat tautan/tombol hapus yang menyertakan ID data (`hapus.php?id=...`), dengan konfirmasi JavaScript agar tidak terhapus tidak sengaja:

```html
<a href="hapus.php?id=<?= $row['id']; ?>"
   onclick="return confirm('Hapus data ini?');">Hapus</a>
```

File `hapus.php` — hapus lalu redirect otomatis:

```php
<?php
include 'koneksi.php';

$id = $_GET['id'];
mysqli_query($koneksi, "DELETE FROM tb_absensi WHERE id = '$id'");

header("Location: index.php");
?>
```

:::warning ⚠️ Konfirmasi bukan pengaman
`confirm()` hanya mencegah klik tidak sengaja. Pengaman sesungguhnya (cek ID valid, pastikan baris ada sebelum hapus) ada di versi API modern — lihat [Kode Lengkap & PDO API](./kode-absensi).
:::

## ✅ Checklist Pertemuan 4 (dan Akhir Proyek)

- [ ] Tautan edit membuka form yang sudah terisi data lama (`value="..."`)
- [ ] Update menulis ke database via `UPDATE ... WHERE id` lalu redirect
- [ ] Tautan hapus meminta konfirmasi `confirm()` sebelum menghapus
- [ ] Delete via `DELETE ... WHERE id` lalu redirect
- [ ] CRUD penuh (Create–Read–Update–Delete) berjalan end-to-end di `db_absensi`

## ➡️ Lanjut

[Kode Lengkap & PDO API](./kode-absensi) — bedah kode sumber asli dan perbandingan mysqli vs PDO sebagai langkah lanjutan.
