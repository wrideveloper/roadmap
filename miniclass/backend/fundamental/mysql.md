# 🐬 Pengenalan MySQL

<div align="center">

![MySQL](/miniclass/backend/assets/mysql.png)

</div>

## 📚 Apa itu MySQL?

**MySQL** adalah sistem manajemen database relasional (**RDBMS**) open-source berbasis SQL yang bekerja dengan model **client-server**.

:::info 💡 DBMS vs RDBMS
- **DBMS** = Sistem manajemen database secara umum
- **RDBMS** = Software pengelolaan database berdasarkan **model relasional**
:::

## 📚 Analogi SQL: Perpustakaan Digital

:::tip 🏛️ Bayangkan Sebuah Perpustakaan...
Bayangkan sebuah perpustakaan besar yang memiliki berbagai koleksi buku dan ingin mengatur data dengan cara yang efisien. Dalam perpustakaan ini, mereka menggunakan sistem basis data relasional untuk mengelola informasi tentang buku, penulis, dan kategori buku.
:::

### 1. 📋 Tabel (Tables)

<div align="center">

![Arsip](/miniclass/backend/assets/arsip.png)

</div>

Setiap jenis informasi diatur dalam sebuah **tabel**. Anggap tabel ini sebagai **lemari arsip** di perpustakaan:

- 📂 Lemari untuk **"buku"**
- ✍️ Lemari untuk **"penulis"**
- 🏷️ Lemari untuk **"kategori"**

Setiap lemari arsip memiliki banyak laci (baris), di mana setiap laci berisi informasi detail tentang satu item.

### 2. 📋 Baris (Row/Record)

Setiap **baris** dalam tabel seperti satu kartu katalog di dalam laci.

**Contoh:**
- Dalam tabel "buku", satu baris berisi: ID buku, judul, penulis, dan kategori
- Misalnya: `B001` | "Harry Potter" | "J.K. Rowling" | "Fantasy"

Setiap laci diberi kode unik (`Primary Key`): B001, B002, B003, dst.

### 3. 🔑 Primary Key

**Primary Key** adalah kode pengenal unik yang membantu pustakawan memastikan setiap buku memiliki identitas berbeda.

:::warning ⚠️ Penting!
Tidak ada dua buku dengan kode yang sama!
:::

### 4. 🔗 Foreign Key

Misalkan ada lemari arsip "penulis" yang berisi data semua penulis. Di lemari arsip "buku", ada satu kolom yang berisi kode unik penulis (**Foreign Key**).

**Contoh:**
- Buku dengan ID `B001` ditulis oleh penulis dengan ID `P123`
- Kita bisa langsung mencari informasi penulis di lemari "penulis"

### 5. 🔗 Relasi (Hubungan antar-tabel)

Hubungan antar-tabel seperti hubungan antar-lemari arsip. Ini memungkinkan pustakawan menghubungkan informasi tanpa menduplikasi data.

### 6. ⚠️ NOT NULL

Beberapa kolom **harus diisi** dan tidak boleh kosong, seperti kolom judul buku. Jika kosong, pustakawan tidak tahu buku mana yang dimaksud.

### 7. 🔍 Index

Untuk mempercepat pencarian, pustakawan mengatur sistem indeks. Buku diurutkan berdasarkan judul atau kategori sehingga lebih mudah dicari.

### 8. ⚡ Auto Increment

Setiap kali buku baru ditambahkan, nomor urut secara otomatis diberikan (B003, B004, dst.) tanpa perlu menulis manual.

## 🎯 Konsep Relational Database

### 1. 🔑 Primary Key

<div align="center">

![Primary Key](/miniclass/backend/assets/pk.png)

</div>

**Primary Key** adalah kolom atau kombinasi kolom yang memiliki nilai **unik** untuk setiap baris di dalam tabel.

#### ✨ Sifat Primary Key:

| Sifat | Deskripsi |
|-------|----------|
| ✅ **Unik** | Setiap nilai harus berbeda |
| ⚠️ **NOT NULL** | Harus selalu memiliki nilai |
| 🎯 **Identifier** | Mengidentifikasi record secara unik |

:::tip 💡 Contoh
Dalam tabel `users`, kolom `user_id` dijadikan Primary Key karena bisa membedakan setiap pengguna dengan nilai uniknya.
:::

### 2. 🔗 Foreign Key

<div align="center">

![Foreign Key](/miniclass/backend/assets/fk.png)

</div>

**Foreign Key** adalah kolom di satu tabel yang merujuk ke Primary Key di tabel lain.

#### 🎯 Fungsi Foreign Key:

- 🔗 Membuat **hubungan** antara dua tabel
- 🔒 Menjaga **integritas data**
- ✅ Memastikan nilai selalu ada di tabel yang dirujuk

:::tip 💡 Contoh
Dalam tabel `orders`, kolom `user_id` menjadi Foreign Key yang merujuk ke `user_id` pada tabel `users`. Setiap pesanan terkait dengan pengguna tertentu.
:::

### 3. ⚠️ NOT NULL

**NOT NULL** adalah constraint untuk memastikan kolom tidak memiliki nilai kosong.

```sql
product_name VARCHAR(255) NOT NULL
```

:::info 📝 Penjelasan
Kolom `product_name` **harus selalu diisi**. Berguna untuk kolom yang wajib ada nilainya.
:::

### 4. ✨ UNIQUE

**UNIQUE** memastikan semua nilai di kolom tertentu unik dan tidak ada duplikat.

#### Perbedaan dengan Primary Key:

| Primary Key | UNIQUE |
|-------------|--------|
| ✅ Hanya satu per tabel | ✅ Bisa banyak per tabel |
| ⚠️ Tidak boleh NULL | ✅ Boleh NULL (sekali) |

:::tip 💡 Contoh
Kolom `email` pada tabel `users` diberi UNIQUE constraint untuk memastikan setiap pengguna memiliki email yang berbeda.
:::

### 5. 🎯 DEFAULT

**DEFAULT** adalah nilai standar yang otomatis diisi jika tidak ada nilai yang diberikan.

```sql
status VARCHAR(10) DEFAULT 'active'
```

:::info 📝 Penjelasan
Jika `status` tidak ditentukan, maka nilai `active` akan digunakan secara otomatis.
:::
### 6. ✔️ CHECK

**CHECK** adalah constraint yang menentukan kondisi tertentu yang harus dipenuhi.

```sql
age INT CHECK (age >= 18)
```

:::info 📝 Penjelasan
Nilai `age` harus **18 atau lebih besar**.
:::

### 7. 🔍 INDEX

**INDEX** adalah struktur data yang digunakan untuk **mempercepat pencarian** data di dalam tabel.

#### ⚖️ Trade-off:

| Keuntungan | Kerugian |
|-----------|----------|
| ⚡ Pencarian lebih cepat | 📈 Butuh lebih banyak storage |
| 🚀 Query lebih efisien | 🐌 Memperlambat INSERT/UPDATE/DELETE |

:::tip 💡 Best Practice
Buat index pada kolom yang **sering digunakan untuk pencarian**, seperti `user_id` atau `email`.
:::

### 8. ⚡ Auto Increment

**Auto Increment** membuat kolom yang secara otomatis meningkat setiap kali baris baru ditambahkan.

```sql
user_id INT AUTO_INCREMENT PRIMARY KEY
```

#### ✨ Kegunaan:

- 🎯 Membuat Primary Key yang unik
- ⚡ Otomatis tanpa input manual
- 🔢 Selalu berurutan (1, 2, 3, ...)

:::tip 💡 Contoh
Kolom `user_id` akan otomatis: 1, 2, 3, 4, ... setiap kali user baru ditambahkan.
:::

## 📊 Tipe Data MySQL

MySQL memiliki berbagai tipe data yang dibagi menjadi beberapa kategori.

### 1. 🔢 Tipe Data Numerik

| Tipe | Deskripsi | Rentang |
|------|-----------|---------|
| **TINYINT** | Bilangan bulat kecil | -128 hingga 127 (atau 0-255 unsigned) |
| **SMALLINT** | Bilangan bulat menengah | -32,768 hingga 32,767 |
| **MEDIUMINT** | Bilangan bulat medium | -8,388,608 hingga 8,388,607 |
| **INT** | Bilangan bulat umum | -2,147,483,648 hingga 2,147,483,647 |
| **BIGINT** | Bilangan bulat besar | -9,223... hingga 9,223... |
| **FLOAT** | Desimal presisi rendah | Untuk angka dengan skala kecil |
| **DOUBLE** | Desimal presisi tinggi | Lebih presisi dari FLOAT |
| **DECIMAL(M,D)** | Desimal presisi tetap | M = total digit, D = digit desimal |

### 2. 📝 Tipe Data String (Teks)

| Tipe | Deskripsi | Kapasitas |
|------|-----------|-----------|
| **CHAR(M)** | String panjang tetap | M karakter |
| **VARCHAR(M)** | String panjang variabel | Hingga M karakter |
| **TEXT** | Teks panjang | Hingga 65,535 karakter |
| **BLOB** | Data biner | Hingga 65,535 byte |
| **ENUM** | Nilai dari daftar | 'value1', 'value2', ... |
| **SET** | Satu atau lebih nilai | 'value1', 'value2', ... |
| **TINYTEXT / MEDIUMTEXT / LONGTEXT** | Teks dengan ukuran berbeda | Lebih besar dari TEXT |

### 3. 📅 Tipe Data Tanggal/Waktu

| Tipe | Format | Deskripsi |
|------|--------|-----------|
| **DATE** | 'YYYY-MM-DD' | Tanggal |
| **TIME** | 'HH:MM:SS' | Waktu |
| **DATETIME** | 'YYYY-MM-DD HH:MM:SS' | Tanggal dan waktu |
| **TIMESTAMP** | 'YYYY-MM-DD HH:MM:SS' | Disimpan dalam UTC |
| **YEAR** | 'YYYY' | Tahun |

### 4. 📦 Tipe Data JSON

| Tipe | Deskripsi |
|------|-----------|
| **JSON** | Menyimpan data dalam format JSON |

## ⚡ Sintaks Dasar MySQL

### 🗄️ Database Commands

#### SHOW DATABASES
Menampilkan daftar database yang ada.

```sql
SHOW DATABASES;
```

#### CREATE DATABASE
Membuat database baru.

```sql
CREATE DATABASE nama_database;
```

#### DROP DATABASE
Menghapus database.

```sql
DROP DATABASE nama_database;
```

#### USE DATABASE
Menggunakan database.

```sql
USE nama_database;
```

### 📋 Table Commands

#### SHOW TABLES
Menampilkan daftar tabel dalam database.

```sql
USE nama_database;
SHOW TABLES;
```

#### CREATE TABLE
Membuat tabel baru.

```sql
CREATE TABLE nama_tabel (
    kolom1 Tipe_Data,
    kolom2 Tipe_Data,
    PRIMARY KEY (kolom1)
);
```

#### DROP TABLE
Menghapus tabel.

```sql
DROP TABLE nama_tabel;
```

#### ALTER TABLE
Mengubah struktur tabel.

```sql
ALTER TABLE nama_tabel
ADD kolom_baru Tipe_Data;
```

### 📝 Data Manipulation Commands

#### INSERT INTO
Menambahkan data ke tabel.

```sql
INSERT INTO nama_tabel (kolom1, kolom2)
VALUES (nilai1, nilai2);
```

#### SELECT
Menampilkan data dari tabel.

```sql
SELECT kolom1, kolom2
FROM nama_tabel;
```

#### UPDATE
Memperbarui data dalam tabel.

```sql
UPDATE nama_tabel
SET kolom1 = nilai1
WHERE kondisi;
```

#### DELETE
Menghapus data dari tabel.

```sql
DELETE FROM nama_tabel
WHERE kondisi;
```

### 🔍 Index Commands

#### CREATE INDEX
Membuat indeks pada tabel.

```sql
CREATE INDEX nama_index
ON nama_tabel (kolom);
```

#### DROP INDEX
Menghapus indeks pada tabel.

```sql
DROP INDEX nama_index
ON nama_tabel;
```

:::warning ⚠️ Perhatian!
Gunakan `WHERE` pada `UPDATE` dan `DELETE` untuk menghindari perubahan/penghapusan seluruh data!
:::

   ```mysql-sql
   DROP INDEX nama_index
   ON nama_tabel;
   ```

- **Create with Adding Primary Key and Foreign Key**:
   ```mysql-sql
   CREATE TABLE nama_tabel (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nama VARCHAR(255) NOT NULL,
       user_id INT,
       FOREIGN KEY (user_id) REFERENCES users(user_id)
   );
   ```
- **Create with Adding Unique and Default**:
   ```mysql-sql
   CREATE TABLE nama_tabel (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) UNIQUE,
       status VARCHAR(10) DEFAULT 'active'
   );
   ```

- **Create with Adding Check**:
   ```mysql-sql
   CREATE TABLE nama_tabel (
       id INT AUTO_INCREMENT PRIMARY KEY,
       age INT CHECK (age >= 18)
   );
   ```
- **Create with Adding Index**:
   ```mysql-sql
   CREATE TABLE nama_tabel (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT,
       INDEX (user_id)
   );
   ```

- **Create with Adding Auto Increment**:
   ```mysql-sql
   CREATE TABLE nama_tabel (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nama VARCHAR(255) NOT NULL
   );
   ```

- **Create with Adding Date and Time**:
   ```mysql-sql
   CREATE TABLE nama_tabel (
       id INT AUTO_INCREMENT PRIMARY KEY,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

- **Create with Adding JSON**:
   ```mysql-sql
    CREATE TABLE nama_tabel (
         id INT AUTO_INCREMENT PRIMARY KEY,
         data JSON
    );
   ```

- **Alter Table to add Primary key or Foreign key**:

   ```mysql-sql
   ALTER TABLE nama_tabel
   ADD PRIMARY KEY (kolom),
   ADD FOREIGN KEY (kolom) REFERENCES nama_tabel_referensi(kolom_referensi);
   ```

- **Select Specific resource**:

   ```mysql-sql
   SELECT kolom1, kolom2, ...
   FROM nama_tabel
   WHERE kondisi;
   ```
  
- **Order By**
   
   ```mysql-sql
   SELECT kolom1, kolom2, ...
   FROM nama_tabel
   ORDER BY kolom ASC/DESC;
   ```