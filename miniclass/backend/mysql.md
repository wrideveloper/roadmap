# Pengenalan MySQL

![img.png](assets/mysql.png)<br>
MySQL adalah sistem manajemen database relasional (RDBMS) open-source berbasis SQL yang bekerja dengan model
client-server. Kalau DBMS adalah sistem manajemen database secara umum, RDBMS merupakan software pengelolaan database
berdasarkan model relasional.

## Analogi SQL

Bayangkan sebuah perpustakaan besar yang memiliki berbagai koleksi buku dan ingin mengatur data dengan cara yang
efisien. Dalam perpustakaan ini, mereka menggunakan sistem basis data relasional untuk mengelola informasi tentang buku,
penulis, dan kategori buku. Berikut adalah beberapa analogi untuk konsep-konsep dalam basis data relasional:

1. **Tabel:** <br><br>
   ![img.png](assets/arsip.png)<br>
   Setiap jenis informasi diatur dalam sebuah tabel. Anggap tabel ini sebagai lemari arsip di perpustakaan, di mana
   setiap
   lemari berisi informasi tertentu.
   Misalnya, ada lemari arsip untuk "buku", satu lagi untuk "penulis", dan satu lagi untuk "kategori".
   Setiap lemari arsip memiliki banyak laci (baris), di mana setiap laci berisi informasi detail tentang satu item (
   misalnya, satu buku).<br>
2. **Baris (Row/Record):**<br><br>
   Setiap baris dalam tabel seperti satu kartu katalog di dalam laci.
   Misalnya, dalam tabel "buku", satu baris mungkin berisi informasi tentang buku "Harry Potter dan Batu Bertuah",
   seperti
   ID buku, judul, penulis, dan kategori.
   Setiap laci di lemari arsip "buku" diberi kode unik (`Primary Key`), seperti "B001" untuk buku pertama, "B002" untuk
   buku
   kedua, dan seterusnya.
   Primary Key ini seperti kode pengenal unik yang membantu pustakawan memastikan bahwa setiap buku memiliki identitas
   yang
   berbeda, sehingga tidak ada dua buku dengan kode yang sama.<br>
3. **Foreign Key:**<br><br>
   Misalkan ada lemari arsip "penulis" yang berisi data semua penulis. Di lemari arsip "buku", ada satu kolom yang
   berisi
   kode unik penulis (Foreign Key) yang terkait dengan lemari "penulis".
   Misalnya, di tabel "buku", Foreign Key ini menunjuk ke ID penulis di tabel "penulis" sehingga pustakawan tahu siapa
   penulis dari setiap buku.
   Jika suatu buku ditulis oleh penulis dengan ID "P123", maka kita bisa langsung mencari informasi penulis tersebut di
   lemari "penulis" yang memiliki ID yang sama.<br>
4. **Relasi (Hubungan antar-tabel):** <br><br>
   Hubungan antar-tabel seperti hubungan antar-lemari arsip.
   Sebagai contoh, tabel "buku" dan "penulis" memiliki relasi karena setiap buku memiliki seorang penulis, dan kita bisa
   menemukan data penulis tersebut di lemari arsip "penulis".
   Relasi ini memungkinkan pustakawan untuk menghubungkan informasi antar lemari tanpa harus menduplikasi data di
   masing-masing lemari.<br>
5. **NOT NULL:**<br><br>
   Beberapa kolom di dalam lemari arsip harus diisi dan tidak boleh kosong, seperti kolom judul buku pada lemari arsip "
   buku". Jika kolom tersebut kosong, pustakawan tidak bisa tahu buku mana yang dimaksud.
   Ini seperti aturan bahwa setiap kartu katalog harus memiliki judul buku yang terisi agar informasinya lengkap.<br>
6. **Index:** <br><br>
   Untuk mempercepat pencarian, pustakawan mungkin mengatur sistem indeks di lemari arsip.
   Misalnya, buku diurutkan berdasarkan judul atau kategori sehingga lebih mudah dicari tanpa harus memeriksa setiap
   kartu
   katalog satu per satu.<br>
7. **Auto Increment:**<br><br>
   Setiap kali buku baru ditambahkan, nomor urut secara otomatis diberikan oleh sistem (misalnya, B003 untuk buku
   ketiga)
   sehingga pustakawan tidak perlu menulis manual nomor urut tersebut.
   Ini seperti perpustakaan memiliki sistem pemberian nomor otomatis untuk setiap item baru.

## Konsep Relational Database

1. **Primary Key**:<br>
   ![img.png](assets/pk.png)<br>
    - Primary Key adalah kolom atau kombinasi kolom yang memiliki nilai unik untuk setiap baris di dalam tabel. Primary
      Key
      memastikan bahwa setiap record (baris) dapat diidentifikasi secara unik.
    - Sifat Primary Key:
        - Unik: Setiap nilai dalam kolom Primary Key harus berbeda.
        - Tidak Boleh Null (`NOT NULL`): Kolom Primary Key harus selalu memiliki nilai, tidak boleh kosong.
    - Contoh: Dalam tabel users, kolom `user_id` mungkin dijadikan Primary Key karena bisa membedakan setiap pengguna
      dengan
      nilai uniknya.
2. **Foreign Key:**<br>
   <img src="assets/fk.png"/>
    - Foreign Key adalah kolom atau kumpulan kolom di satu tabel yang merujuk ke Primary Key di tabel lain. Foreign Key
      digunakan untuk membuat hubungan antara dua tabel.
    - Foreign Key membantu menjaga integritas data dengan memastikan bahwa nilai di kolom tersebut selalu ada di tabel
      lain yang dirujuk.
    - Contoh: Dalam tabel `orders`, kolom `user_id` bisa menjadi Foreign Key yang merujuk ke kolom `user_id` pada tabel
      `users`. Dengan demikian, setiap pesanan di tabel `orders` terkait dengan pengguna di tabel `users`.
3. **NOT NULL:**<br>
    - `NOT NULL` adalah `constraint` atau batasan yang digunakan pada kolom untuk memastikan kolom tersebut tidak
      memiliki
      nilai kosong atau `NULL`.
    - Ini berguna untuk kolom yang harus selalu memiliki nilai, misalnya kolom nama pada tabel `products` yang harus
      berisi nama produk.
    - Contoh: `product_name VARCHAR(255) NOT NULL` berarti kolom `product_name` harus selalu diisi.
4. **UNIQUE**:<br>
    - `UNIQUE` adalah constraint yang memastikan bahwa semua nilai di dalam kolom tertentu unik dan tidak ada yang
      duplikat, tetapi berbeda dari Primary Key.
    - Satu tabel dapat memiliki beberapa kolom dengan UNIQUE constraint, tetapi hanya satu Primary Key.'
    - Contoh: Kolom email pada tabel users mungkin diberi `UNIQUE` `constraint` untuk memastikan setiap pengguna
      memiliki
      alamat email yang berbeda.
5. **DEFAULT**: <br>
    - DEFAULT adalah nilai standar yang secara otomatis akan diisi pada kolom jika tidak ada nilai yang diberikan saat
      memasukkan data.
    - Contoh: `status VARCHAR(10) DEFAULT 'active'` berarti jika status tidak ditentukan, maka nilai active akan
      digunakan.
6. **CHECK**: <br>
    - CHECK adalah constraint yang menentukan kondisi tertentu yang harus dipenuhi oleh nilai kolom.
    - Contoh: `age INT CHECK (age >= 18)` berarti nilai `age` harus `18` atau lebih besar.
7. **INDEX**: <br>
    - Index adalah struktur data yang digunakan untuk mempercepat pencarian data di dalam tabel.
    - Index membuat proses pencarian data lebih cepat, tetapi juga membutuhkan lebih banyak ruang penyimpanan dan
      memperlambat proses penambahan, penghapusan, dan pembaruan data.
    - Contoh: Jika sering mencari data berdasarkan kolom `user_id`, maka membuat index pada kolom tersebut akan
      mempercepat
      proses pencarian.
8. **Auto Increment**: <br>
    - Auto Increment adalah fitur yang digunakan untuk membuat kolom yang secara otomatis meningkat setiap kali baris
      baru
      ditambahkan ke tabel.
    - Contoh: Kolom `user_id` yang diatur sebagai `AUTO_INCREMENT` akan secara otomatis meningkat setiap kali pengguna
      baru
      ditambahkan ke tabel.
    - Auto Increment biasanya digunakan untuk membuat Primary Key yang unik.

## Tipe Data MySQL

MySQL memiliki berbagai tipe data yang digunakan untuk menyimpan data dalam tabel. Tipe data ini dibagi menjadi beberapa
kategori, seperti tipe data numerik, string (teks), dan tanggal/waktu. Berikut adalah penjelasan singkat tentang
masing-masing tipe data.

1. Tipe Data Numerik
    - TINYINT: Bilangan bulat kecil, dengan rentang dari -128 hingga 127 (atau 0 hingga 255 jika unsigned).
    - SMALLINT: Bilangan bulat lebih besar dari TINYINT, dengan rentang -32,768 hingga 32,767 (atau 0 hingga 65,535 jika
      unsigned).
    - MEDIUMINT: Bilangan bulat medium, dengan rentang -8,388,608 hingga 8,388,607 (atau 0 hingga 16,777,215 jika
      unsigned).
    - INT (INTEGER): Bilangan bulat umum, dengan rentang -2,147,483,648 hingga 2,147,483,647 (atau 0 hingga
      4,294,967,295
      jika unsigned).
    - BIGINT: Bilangan bulat besar, dengan rentang -9,223,372,036,854,775,808 hingga 9,223,372,036,854,775,807 (atau 0
      hingga 18,446,744,073,709,551,615 jika unsigned).
    - FLOAT: Bilangan desimal dengan presisi rendah, biasanya digunakan untuk angka dengan skala kecil.
    - DOUBLE: Bilangan desimal dengan presisi lebih tinggi dibandingkan FLOAT.
    - DECIMAL (M, D): Tipe data desimal yang digunakan untuk menyimpan angka dengan presisi tetap, di mana M adalah
      jumlah
      digit, dan D adalah jumlah digit desimal.
2. Tipe Data String (Teks)
    - CHAR (M): Tipe data string dengan panjang tetap M, di mana M adalah jumlah karakter.
    - VARCHAR (M): Tipe data string dengan panjang variabel hingga M karakter.
    - TEXT: Tipe data string yang dapat menyimpan teks panjang hingga 65,535 karakter.
    - BLOB: Tipe data biner yang dapat menyimpan data biner hingga 65,535 byte.
    - ENUM ('value1', 'value2', ...): Tipe data string yang hanya dapat memiliki nilai dari daftar nilai yang
      ditentukan.
    - SET ('value1', 'value2', ...): Tipe data string yang dapat memiliki satu atau lebih nilai dari daftar nilai yang
      ditentukan.
    - TINYTEXT, MEDIUMTEXT, LONGTEXT: Tipe data string yang dapat menyimpan teks dengan panjang yang lebih besar dari
      TEXT.
3. Tipe Data Tanggal/Waktu
    - DATE: Tipe data tanggal dalam format 'YYYY-MM-DD'.
    - TIME: Tipe data waktu dalam format 'HH:MM:SS'.
    - DATETIME: Tipe data yang menggabungkan tanggal dan waktu dalam format 'YYYY-MM-DD HH:MM:SS'.
    - TIMESTAMP: Tipe data yang merepresentasikan waktu dalam format 'YYYY-MM-DD HH:MM:SS', tetapi disimpan dalam
      UTC
      (Coordinated Universal Time).
    - YEAR: Tipe data tahun dalam format 'YYYY'.
4. Tipe Data JSON
    - JSON: Tipe data JSON yang digunakan untuk menyimpan data dalam format JSON.

## Sintaks Dasar MySQL

- **SHOW DATABASES**: Menampilkan daftar database yang ada.<br>
  ```mysql-sql
    SHOW DATABASES;
  ```
- **SHOW TABLES**: Menampilkan daftar tabel dalam database.<br>

   ```mysql-sql
   USE nama_database;
   SHOW TABLES;
   ```

- **CREATE DATABASE**: Membuat database baru.

   ```mysql-sql
   CREATE DATABASE nama_database;
   ```

- **DROP DATABASE**: Menghapus database.

    ```mysql-sql
    DROP DATABASE nama_database;
    ```
- **USE DATABASE**: Menggunakan database.

   ```mysql-sql
   USE nama_database;
   ```
- **CREATE TABLE**: Membuat tabel baru.

   ```mysql-sql
   CREATE TABLE nama_tabel (
       kolom1 Tipe_Data,
       kolom2 Tipe_Data,
       ...
   );
   ```
- **DROP TABLE**: Menghapus tabel.

   ```mysql-sql
   DROP TABLE nama_tabel;
   ```
- **INSERT INTO**: Menambahkan data ke tabel.

   ```mysql-sql
   INSERT INTO nama_tabel (kolom1, kolom2, ...)
   VALUES (nilai1, nilai2, ...);
   ```
- **SELECT**: Menampilkan data dari tabel.

   ```mysql-sql
   SELECT kolom1, kolom2, ...
   FROM nama_tabel;
   ```
- **UPDATE**: Memperbarui data dalam tabel.

   ```mysql-sql
   UPDATE nama_tabel
   SET kolom1 = nilai1, kolom2 = nilai2, ...
   WHERE kondisi;
   ```
- **DELETE**: Menghapus data dari tabel.

   ```mysql-sql
   DELETE FROM nama_tabel
   WHERE kondisi;
   ```
- **ALTER TABLE**: Mengubah tabel.

   ```mysql-sql
   ALTER TABLE nama_tabel
   ADD kolom Tipe_Data;
   ```
- **CREATE INDEX**: Membuat indeks pada tabel.

   ```mysql-sql
   CREATE INDEX nama_index
   ON nama_tabel (kolom);
   ```
- **DROP INDEX**: Menghapus indeks pada tabel.

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