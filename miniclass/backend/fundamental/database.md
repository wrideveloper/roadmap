# 💾 Pengenalan Database

<div align="center">

![Database](/miniclass/backend/assets/db.png)

</div>

## 📚 Apa itu Database?

**Database** atau **basis data** adalah kumpulan data yang dikelola sedemikian rupa berdasarkan ketentuan tertentu yang saling berhubungan sehingga mudah dalam pengelolaannya.

### ✅ Kemudahan yang Diperoleh:

| Fungsi | Deskripsi |
|--------|----------|
| 🔍 **Mencari** | Kemudahan dalam mencari informasi |
| 💾 **Menyimpan** | Menyimpan informasi dengan terstruktur |
| 🗑️ **Menghapus** | Menghapus informasi yang tidak diperlukan |

:::info 💡 Definisi Lain
Database adalah sistem yang berfungsi untuk mengumpulkan file, tabel, atau arsip yang terhubung dan disimpan dalam berbagai media elektronik.
:::

## 📦 Jenis-jenis Database

<div align="center">

![Tipe Database](/miniclass/backend/assets/a.png)

</div>

### 1. 📋 Relational Database (SQL)

<div align="center">

![SQL Database](/miniclass/backend/assets/sql.png)

</div>

:::tip 💡 Relational Database
Database relasional menggunakan **model data relasional** dengan tabel untuk menyimpan data dan relasi antar tabel untuk menghubungkan data.
:::

**Contoh Database Relasional:**
- 🐬 MySQL
- 🐘 PostgreSQL
- 🔴 Oracle Database
- 🔵 Microsoft SQL Server

### 2. 🍃 NoSQL Database

<div align="center">

![NoSQL Database](/miniclass/backend/assets/nosql.png)

</div>

:::tip 💡 NoSQL Database
NoSQL adalah database yang **tidak menggunakan model data relasional**. NoSQL menggunakan model data yang lebih fleksibel seperti dokumen, grafik, key-value, dan lainnya.
:::

**Contoh Database NoSQL:**
- 🌿 MongoDB (Document-based)
- 📄 CouchDB (Document-based)
- 📊 Cassandra (Column-based)
- ⚡ Redis (Key-Value)

## ⚔️ Perbedaan Sintaks SQL vs NoSQL

<div align="center">

![Sintaks Comparison](/miniclass/backend/assets/sintaksSql.png)

*Perbandingan sintaks SQL dan NoSQL (MongoDB)*

</div>

### 📥 Insert a New Book Record

| SQL | NoSQL (MongoDB) |
|-----|----------------|
| `INSERT INTO` untuk memasukkan data baru | `db.book.insert()` untuk menambahkan dokumen |
| Kolom: ISBN, title, author | Field: ISBN, title, author |

:::info 📝 Catatan
Baik SQL maupun NoSQL menggunakan field yang sama (ISBN, title, author), namun dengan sintaks yang berbeda.
:::

### 🔄 Update a Book Record

| SQL | NoSQL (MongoDB) |
|-----|----------------|
| `UPDATE` untuk memperbarui data | `db.book.update()` untuk memperbarui dokumen |
| Langsung set nilai baru | Menggunakan operator `$set` |

**Contoh:**
- **SQL**: Mengubah kolom `price` menjadi 19.99
- **MongoDB**: Menggunakan `$set` untuk menentukan perubahan nilai `price` menjadi 19.99

### 🔍 Return All Book Titles Over $10

| SQL | NoSQL (MongoDB) |
|-----|----------------|
| `SELECT` untuk mengambil data | `db.book.find()` untuk query dokumen |
| `WHERE price > 10` untuk filter | `{price: {$gt: 10}}` untuk filter |

**MongoDB Options:**
```javascript
{ _id: 0, title: 1 }
```
- `_id: 0` = Tidak menampilkan field _id
- `title: 1` = Hanya menampilkan field title
