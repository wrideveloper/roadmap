# 🌐 Pengenalan HTML

<div align="center">

![HTML](/miniclass/backend/assets/html.png)

**HyperText Markup Language**

</div>

## 📚 Apa itu HTML?

**HTML (HyperText Markup Language)** adalah bahasa markup yang digunakan untuk membuat halaman website yang ditampilkan pada web browser.

:::tip 💡 Fun Fact
Sebagian besar halaman yang kamu temukan di internet menggunakan HTML!
:::

---

## ❓ Permasalahan

Website merupakan kumpulan dari beberapa halaman yang dapat diakses melalui internet. Setiap halaman terdiri dari beberapa bagian:

- 🎯 **Header** - Bagian atas halaman
- 📄 **Body** - Konten utama
- 📦 **Content** - Isi halaman
- 🔽 **Footer** - Bagian bawah halaman

Apabila bagian-bagian tersebut digabung, akan membentuk sebuah **struktur website yang utuh**.

:::info 💡 Langkah Pertama
Langkah pertama untuk membuat website adalah **menentukan struktur** dari website yang ingin kita buat.
:::

## 📖 Penjelasan HTML

Untuk membantu dalam menentukan struktur website, kita bisa menggunakan **HTML**.

**HTML (Hypertext Markup Language)** adalah bahasa markup yang digunakan untuk menentukan struktur website.

### ✨ Keunggulan HTML:

- ✅ Memiliki syntax yang jelas
- ✅ Mudah menentukan letak header, body, content, footer
- ✅ Standar industri untuk web development

## 🏗️ Struktur Dasar HTML

HTML memiliki 4 tag dasar yang perlu kita pahami:

### 1. Tag `<html>`

```html
<html></html>
```

:::info 📝 Fungsi
Tag pembuka dokumen HTML. **Semua kode HTML** harus dimasukkan dalam tag ini.
:::

### 2. Tag `<head>`

```html
<head></head>
```

:::info 📝 Fungsi
Ditulis di dalam tag `<html>`. Digunakan untuk menyimpan **informasi** dari website yang kita buat.
:::

### 3. Tag `<title>`

```html
<title></title>
```

:::info 📝 Fungsi
Ditulis di dalam tag `<head>`. Menampilkan **judul** website pada tab browser.
:::

### 4. Tag `<body>`

```html
<body></body>
```

:::info 📝 Fungsi
Ditulis di bawah tag `<head>`. Merupakan **badan dokumen** HTML yang berisi konten website.
:::

### 📐 Struktur Dasar Lengkap

Berikut struktur dasar HTML secara keseluruhan:

```html
<html>
<head>
    <title>Judul website</title>
</head>
<body>
    konten website
</body>
</html>
```

## 4. Contoh Kasus

Pada studi kasus kali ini, kita akan mencoba mengimplementasikan struktur dasar HTML diatas dengan membuat sebuah
website sederhana. Ikuti langkah berikut ini:

### 4.1. Membuat File HTML

Pertama, buatlah file HTML baru bernama `pengenalan.html`, perlu diingat bahwa semua file HTML harus berformat `.html`

### 4.2. Menulis Struktur Dasar HTML

Selanjutnya, kita perlu membuat struktur dasar HTML. Tulis kode program di bawah ini dalam file `pengenalan.html`

```html

<html>
<head>
    <title></title>
</head>

<body></body>
</html>
```

### 4.3. Menambahkan Judul Website

Tambahkan judul website di dalam tag `<title>` agar user tau tentang apa website yang kita buat

```html

<html>
<head>
    <title>Belajar HTML</title>
</head>

<body></body>
</html>
```

### 4.4. Menambahkan Konten Website

Untuk menambahkan konten dari website, kita perlu menuliskannya di dalam tag `<body>`.
Disini kita akan menggunakan tag `<h1>` untuk membuat heading dan tag `<p>` untuk membuat paragraf. Kalian bisa isi
kedua tag tersebut dengan kalimat seperti yang ada di bawah ini.

```html

<html>
<head>
    <title>Belajar HTML</title>
</head>
<body>
<h1>Apasih HTML itu??</h1>
<p>
    HyperText Markup Language atau yang lebih akrab dikenal HTML adalah bahasa
    pemrograman atau komputer yang digunakan untuk membuat suatu website.
    “HyperText” mengacu pada Hyperlink yang ada pada page HTML, sedangkan
    “Markup Language” melambangkan cara suatu Tags digunakan untuk
    mendefinisikan layout atau desain suatu page dan element-element
    didalamnya.
</p>
</body>
</html>
```

### 4.5. Simpan Perubahan

Simpan perubahan yang dilakukan kemudian buka file tersebut di web browser. Akan muncul website dengan judul "Belajar
Website" dengan konten yang sudah dibuat sebelumnya.

# 📝 HTML Form

## ❓ Permasalahan

Sebelum masuk ke Backend development, kita harus memahami **form pada HTML**. Pada topik ini akan dibahas bagaimana cara membuat form menggunakan HTML.

## 📖 Penjelasan Form

**Form** digunakan untuk menerima data dari inputan user, biasanya diterapkan pada:

- 🔐 Form login
- 📝 Form pendaftaran  
- 💳 Form transaksi
- 📧 Form kontak

:::tip 💡 Analogi
Form dalam web bisa disamakan dengan **formulir di dunia nyata**. Form dapat diisi, kemudian diproses menggunakan bahasa pemrograman tertentu.
:::

## 🏗️ Membuat Form Pada Website

### 1. Tag `<form>`

Form di HTML dapat kita buat dengan tag `<form>`. Semua tag input akan dimasukkan ke dalam tag ini.

```html
<form>
    <!-- input form ada disini -->
</form>
```

:::info 📝 Catatan
Kode di atas tidak akan menghasilkan apa-apa karena belum ada input-nya.
:::

### 2. Tag `<input>`

Agar web dapat menerima inputan dari user, kita perlu membuat input menggunakan tag `<input />`

```html
<form>
    <input type="text" name="username" placeholder="john doe"/>
</form>
```

#### 🔧 Atribut Input:

| Atribut | Deskripsi | Contoh |
|---------|-----------|--------|
| **type** | Tipe input | `text`, `number`, `email`, `password`, `checkbox`, `radio`, `file`, `submit` |
| **name** | Nama variabel input | `username`, `email`, `password` |
| **placeholder** | Petunjuk isi input | `"Masukkan username..."` |

:::warning ⚠️ Penting!
Atribut `placeholder` hanya berguna untuk tipe `text`, `email`, dan `password`.
:::

### 3. Tag `<label>`

Tag `<label>` digunakan untuk memberikan label pada input.

#### Keuntungan menggunakan `<label>`:
- ✅ User tahu data apa yang harus diinputkan
- ✅ Ketika user klik label, cursor otomatis fokus ke input

```html
<label>
    Username:
    <input type="text" name="username" placeholder="john doe"/>
</label>
```

## 💻 Contoh Kasus: Form Login

Agar lebih memahami cara membuat form pada HTML, kita akan membuat sebuah form login sederhana yang memiliki beberapa
input sebagai berikut :

- Input username atau email
- Input password
- Checkbox untuk remember me
- Tombol untuk login

### 4.1. Membuat Form dan Input

Langkah pertama yang akan dilakukan untuk membuat form login pada web, adalah dengan membuat inputnya menggunakan tag
`input` dengan `type` yang berbeda - beda sesuai kebutuhan. Jangan lupa untuk membungkus semua tag `input` tersebut
dengan tag `form`.

```html

<form>
    <input type="text" name="username" placeholder="john doe"/>
    <input type="password" name="password"/>
    <input type="checkbox" name="remember"/>
    <input type="submit" name="submit" value="Login"/>
</form>
```

### 4.2. Menerapkan Label

Agar user tau data apa yang perlu dimasukkan ke dalam form, maka kita perlu menerapkan label pada masing - masing input
yang sudah dibuat sebelumnya

```html

<form>
    <label>
        Username:
        <input type="text" name="username" placeholder="john doe"/>
    </label>

    <label>
        Password:
        <input type="password" name="password"/>
    </label>

    <label>
        <input type="checkbox" name="remember"/>
        Remember me
    </label>

    <input type="submit" name="submit" value="Login"/>
</form>
```

### 4.3. Hasil Akhir

Berikut hasil akhir dari contoh kasus form login yang kita buat, jangan lupa tambahkan struktur dasar HTML agar file
HTML kita valid

```html

<html>
<head>
    <title>Form Login</title>
</head>
<body>
<form>
    <label>
        Username:
        <input type="text" name="username" placeholder="john doe"/>
    </label>

    <label>
        Password:
        <input type="password" name="password"/>
    </label>

    <label>
        <input type="checkbox" name="remember"/>
        Remember me
    </label>

    <input type="submit" name="submit" value="Login"/>
</form>
</body>
</html>
```
