# Mengenal Eloquent ORM di Laravel

Di bab Konsep MVC sebelumnya, kita sempat menyinggung sedikit tentang peran **Model** sebagai koki yang berinteraksi dengan database. Di Laravel, "koki" ini punya alat masak super canggih yang bernama **Eloquent ORM**.

Tapi, sebelum kita memuja-muja Eloquent, kita harus tahu dulu apa masalah yang dia selesaikan.

## Mimpi Buruk Query Manual (Tanpa ORM)

Dulu, sebelum framework modern populer, developer (atau kalau di miniclass kita sebutnya aliran "PHP Native") harus nulis instruksi database (SQL) secara manual di dalam kodenya.

Bayangkan kamu disuruh membuat fitur CRUD (Create, Read, Update, Delete) untuk data Siswa. Kodenya akan terlihat seperti ini:

```php
// CONTOH TANPA ORM (RAW SQL)

// 1. Mengambil semua data siswa yang aktif
$sql = "SELECT * FROM students WHERE status = 'aktif'";
$result = mysqli_query($conn, $sql);

// 2. Menambah siswa baru
$sql_insert = "INSERT INTO students (nama, kelas, status) VALUES ('Budi', '12A', 'aktif')";
mysqli_query($conn, $sql_insert);

// 3. Mengupdate data siswa
$sql_update = "UPDATE students SET kelas = '12B' WHERE nama = 'Budi'";
mysqli_query($conn, $sql_update);
```

**Kekurangannya apa?**
1. **Rawan Typo:** Kurang spasi atau kutip sedikit saja di syntax SQL, aplikasi langsung *error*.
2. **Tidak Aman:** Sangat rentan terhadap serangan *SQL Injection* kalau tidak hati-hati memvalidasi input *user*.
3. **Membosankan:** Kamu harus mengulang-ulang nulis `SELECT`, `INSERT`, `UPDATE` di ratusan fitur berbeda.

## Solusi: ORM (Object-Relational Mapping)

Lalu datanglah konsep **ORM**. ORM adalah sebuah teknik yang menjembatani tabel di database dengan *Class* (Object) di bahasa pemrograman. 

**Intinya:** Tabel database diubah jadi *Object PHP*. Jadi, kamu nggak perlu nulis bahasa SQL lagi. Kamu cukup panggil fungsi-fungsi PHP, dan ORM-lah yang akan otomatis menerjemahkannya jadi bahasa SQL ke database.

Di Laravel, sistem ORM bawaannya bernama **Eloquent**.

Mari kita bandingkan kodingan "Mimpi Buruk" di atas dengan menggunakan Eloquent ORM:

```php
// CONTOH DENGAN ELOQUENT ORM (LARAVEL)

// 1. Mengambil semua data siswa yang aktif
$students = Student::where('status', 'aktif')->get();

// 2. Menambah siswa baru
Student::create([
    'nama' => 'Budi',
    'kelas' => '12A',
    'status' => 'aktif'
]);

// 3. Mengupdate data siswa
$budi = Student::where('nama', 'Budi')->first();
$budi->update(['kelas' => '12B']);
```

Jauh lebih bersih dan seperti bahasa manusia, kan?

## Keuntungan Pakai Eloquent ORM

1. **Kode Lebih Bersih & Mudah Dibaca:** Teman setimmu yang nggak terlalu jago SQL pun pasti paham maksud kode `Student::create(...)`.
2. **Otomatis Aman:** Eloquent otomatis membersihkan input dari user sebelum dimasukkan ke database (mencegah *SQL Injection*).
3. **Pindah Database Jadi Gampang:** Misal hari ini perusahaanmu pakai database MySQL, lalu besok mau ganti pakai PostgreSQL. Kalau pakai Raw SQL, kamu harus ngecek ulang satu-satu kodenya karena syntax SQL tiap database kadang beda. Dengan Eloquent, kamu **cukup ganti konfigurasi database**. Kodingan PHP-mu *nggak perlu ada yang diubah sama sekali*!

Jadi, sebelum nanti kita terjun ke Studi Kasus bikin tabel database, ingatlah: di Laravel, kita akan menggunakan *Eloquent ORM* untuk berbicara dengan database, bukan ngoding SQL manual.
