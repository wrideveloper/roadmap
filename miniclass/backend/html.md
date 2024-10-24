# Pengenalan HTMl

HTML adalah singkatan dari Hypertext Markup Language, HTML merupakan salah satu bahasa pengkodean atau pemograman yang
digunakan untuk membuat halaman website yang ditampilkan pada web browser. Sebagian besar halaman yang kamu temukan pada
internet kebanyakan menggunakan Bahasa HTML.
<br><br>
![img.png](assets/html.png)<br>

# Pengenalan HTML

## 1. Permasalahan

Website merupakan kumpulan dari beberapa halaman yang dapat diakses melalui internet. Dimana pada masing - masing
halaman terdiri dari beberapa bagian seperti header, body, content, dan footer. Apabila bagian - bagian tersebut
digabung, akan membentuk sebuah struktur website yang utuh. Maka dari itu, langkah pertama untuk membuat website adalah
menentukan struktur dari website yang ingin kita buat.

## 2. Penjelasan HTML

Untuk membantu dalam menentukan struktur website, kita bisa menggunakan HTML. HTML (Hypertext Markup Language) adalah
satu dari banyak bahasa markup yang digunakan untuk menentukan struktur dari website yang akan kita buat. Di dalam HTML
terdapat syntax yang bisa digunakan untuk menjadi acuan dalam menentukan struktur website sehingga kita bisa menentukan
letak header, body, content, footer dengan mudah.

## 3. Penjelasan Struktur Dasar HTML

HTML memiliki 4 tag dasar yang perlu kita pahami, antara lain

### 3.1. Tag `<html>`

```html

<html></html>
```

Tag tersebut digunakan untuk mengawali dokumen HTML. Semua kode HTML yang akan dibuat harus dimasukkan dalam tag
tersebut.

### 3.2. Tag `<head>`

```html

<head></head>
```

Tag `<head>` ditulis di dalam tag `<html>`. Tag ini digunakan untuk menyimpan informasi dari website yang kita buat.

### 3.3. Tag `<title>`

```html
<title></title>
```

Tag `<title>` ditulis di dalam tag `<head>`. Tag `<title>` akan menampilkan judul dari website yang akan ditampilkan
pada tab browser.

### 3.4. Tag `<body>`

```html

<body></body>
```

Tag `<body>` ditulis di bawah tag head. Tag `<body>` merupakan tag pembuka dari badan dari dokumen HTML. Tag `<body>`
nantinya akan berisi konten dari website kita

### 3.5. Struktur Dasar Secara Keseluruhan

Berikut struktur dasar dari HTML secara keseluruhan

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

# Form

## 1 Permasalahan

Minimal sebelum masuk ke dalam Backend development, kita harus memahami form pada html. Pada topik ini akan dibahas
bagaimana cara membuat form menggunakan HTML.

## 2. Penjelasan Form

Form digunakan untuk menerima data dari inputan user, biasanya diterapkan pada form login, pendaftaran, transaksi, dan
sebagainya.

Form dalam web bisa disamakan dengan formulir di dunia nyata. Form dapat diisi, kemudian diproses menggunakan bahasa
pemrograman tertentu.

## 3. Membuat Form Pada Website

### 3.1. Tag Form

Form di HTML dapat kita buat dengan tag `<form>`.
nantinya semua tag input akan dimasukkan ke dalam tag ini

```html

<form>
    <!-- input form ada disini -->
</form>
```

Kode html diatas tidak akan menghasilkan apa-apa.
Karena kita belum membuat input-nya.

### 3.2. Tag Input

Agar web dapat menerima inputan dari user, maka kita perlu membuat beberapa input di dalam form yang dibuat. Untuk
membuat input kita bisa menggunakan tag `<input />`

```html

<form>
    <input type="text" name="username" placeholder="john doe"/>
</form>
```

Input memiliki beberapa attribut yang harus diberikan :

- `type` merupakan tipe dari input. Ada beberapa tipe input yang dapat digunakan, yaitu `text`, `number`, `submit`,
  `checkbox`, `radio`, `email`, `file`, `password`
- `name` merupakan nama dari input yang akan menjadi kunci dan variabel di dalam program.
- `placeholder` merupakan keterangan atau petunjuk yang mendeskripsikan nilai seperti apa yang harusnya diinputkan oleh
  user. Attribute ini hanya berguna apabila `type` dari input adalah `text`, `email`, dan `password`.

### 3.3. Tag Label

Tag `<label>` digunakan untuk memberikan label pada input yang sudah dibuat, sehingga user akan mengetahui data apa yang
harus diinputkan pada input tersebut, misalnya `username`

Untuk menerapkan label pada input, kita bisa memasukkan tag `<input>` kedalam tag `<label>`. Tujuannya agar ketika user
melakukan klik pada label, maka cursor akan otomatis fokus ke input yang ada di dalam label tersebut.

```html
<label>
    Username:
    <input type="text" name="username" placeholder="john doe"/>
</label>
```

### 4. Contoh Kasus Membuat Form Login

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
