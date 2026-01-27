# 🐘 Pengenalan PHP

<div align="center">

![PHP](/miniclass/backend/assets/php.png)

**PHP: Hypertext Preprocessor**

</div>

## 📚 Apa itu PHP?

**PHP (Hypertext Preprocessor)** adalah bahasa pemrograman **server-side** yang digunakan untuk mengembangkan aplikasi web dinamis dan interaktif.

### 📜 Sejarah Singkat:

- Awalnya: **"Personal Home Page"**
- Sekarang: **"Hypertext Preprocessor"**

:::info 💡 Server-Side
PHP dirancang untuk dijalankan di **server**, sehingga skrip PHP diproses oleh server dan hasilnya dikirimkan kepada pengguna dalam bentuk HTML.
:::

### 🎯 Kegunaan PHP:

- ✅ Website sederhana
- ✅ E-commerce
- ✅ Blog & CMS
- ✅ Media sosial
- ✅ Aplikasi web kompleks

---

## ⚡ Sintaks Dasar PHP

### 1. 📦 Variabel

**Variabel** adalah tempat penyimpanan data sementara di memori yang diberi nama. Di PHP, variabel diawali dengan simbol `$`.

#### 🏷️ Tipe Data

```php
<?php
// String
$name = "Andi";

// Integer
$age = 25;

// Boolean
$isStudent = true;

// Float
$height = 175.5;

// Array
$fruits = array("Apel", "Pisang", "Jeruk");

// Array Asosiatif
$person = array(
    "name" => "Andi",
    "age" => 25,
    "isStudent" => true
);

// Null
$nullValue = null;
?>
```

#### 💻 Contoh Penggunaan

```php
<?php
$name = "Andi";
$age = 25;
$isStudent = true;

echo "Nama: $name, Umur: $age, Mahasiswa: $isStudent";
?>
```

:::tip 💡 Penjelasan
- `$name` → Variabel string berisi "Andi"
- `$age` → Variabel integer berisi 25
- `$isStudent` → Variabel boolean berisi true
:::

---

### 2. 🔒 Konstanta

**Konstanta** adalah variabel yang nilainya **tidak dapat diubah** selama program berjalan.

#### A. Menggunakan `const`

```php
<?php
const APP_NAME = "Aplikasi Saya";
const PI = 3.14159;
const MAX_USERS = 100;

echo "Nama Aplikasi: " . APP_NAME . "<br>";
echo "Nilai Pi: " . PI . "<br>";
echo "Maksimal Pengguna: " . MAX_USERS;
?>
```

#### B. Menggunakan `define()`

```php
<?php
define("APP_NAME", "Aplikasi Saya");
define("PI", 3.14159);
define("MAX_USERS", 100);
?>
```

#### ⚖️ Perbedaan `const` vs `define()`

| `const` | `define()` |
|---------|-----------|
| ❌ Tidak bisa di dalam fungsi | ✅ Bisa di dalam fungsi |
| ❌ Tidak bisa di dalam kelas | ✅ Bisa di dalam kelas |
| ✅ Case-insensitive bisa diatur | ❌ Tidak bisa |

---

### 3. 🔀 Struktur Kondisi

Struktur `if` digunakan untuk menjalankan blok kode tertentu jika kondisi terpenuhi.

#### A. If Sederhana

```php
<?php
$age = 25;

if ($age >= 18) {
    echo "Anda sudah dewasa";
} else {
    echo "Anda masih anak-anak";
}
?>
```

#### B. If-ElseIf

```php
<?php
$score = 85;

if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {
    echo "B";
} elseif ($score >= 70) {
    echo "C";
} else {
    echo "D";
}
?>
```

#### C. Switch Case

```php
<?php
$day = "Senin";

switch ($day) {
    case "Senin":
        echo "Hari ini Senin";
        break;
    case "Selasa":
        echo "Hari ini Selasa";
        break;
    default:
        echo "Hari ini bukan Senin atau Selasa";
}
?>
```

#### D. Ternary Operator

```php
<?php
$age = 25;
$status = ($age >= 18) ? "Dewasa" : "Anak-anak";
echo $status;
?>
```

#### E. Nested If

```php
<?php
$age = 25;
$gender = "Pria";

if ($age >= 18) {
    if ($gender == "Pria") {
        echo "Anda adalah pria dewasa";
    } else {
        echo "Anda adalah wanita dewasa";
    }
} else {
    echo "Anda masih anak-anak";
}
?>
```

---

### 4. 🔄 Perulangan

Perulangan digunakan untuk menjalankan blok kode berulang kali.

#### A. For Loop

```php
<?php
for ($i = 0; $i < 5; $i++) {
    echo "Nomor: $i <br>";
}
?>
```

#### B. While Loop

```php
<?php
$i = 0;
while ($i < 5) {
    echo "Nomor: $i <br>";
    $i++;
}
?>
```

#### C. Foreach Loop

```php
<?php
$colors = array("Merah", "Hijau", "Biru");
foreach ($colors as $value) {
    echo "$value <br>";
}
?>
```

#### D. Do-While Loop

```php
<?php
$i = 0;
do {
    echo "Nomor: $i <br>";
    $i++;
} while ($i < 5);
?>
```

#### E. Nested Loop

```php
<?php
for ($i = 0; $i < 3; $i++) {
    for ($j = 0; $j < 3; $j++) {
        echo "($i, $j) <br>";
    }
}
?>
```

---

### 5. 🎯 Fungsi

**Fungsi** adalah blok kode yang dapat digunakan kembali di berbagai bagian program.

#### A. Fungsi Sederhana

```php
<?php
function sayHello() {
    echo "Hello, World!";
}

sayHello();
?>
```

#### B. Fungsi dengan Parameter

```php
<?php
function sayHello($name) {
    echo "Hello, $name!";
}

sayHello("Andi");
?>
```

#### C. Fungsi dengan Return Value

```php
<?php
function add($a, $b) {
    return $a + $b;
}

$result = add(5, 3);
echo "Hasil: $result";
?>
```

:::tip 💡 Best Practice
Gunakan fungsi untuk kode yang sering digunakan agar lebih efisien dan mudah di-maintain!
:::
        echo "Hello, $name!";
    }
    sayHello("Andi");
   ```

- Contoh Fungsi dengan Nilai Kembali:

   ```php
    <?php
    function add($a, $b): int {
        return $a + $b;
    }
    $result = add(5, 3);
    echo $result;
   ```

- Contoh Fungsi dengan Nilai Kembali dan Parameter:

   ```php
    <?php
    function add($a, $b): int {
        return $a + $b;
    }
    $result = add(5, 3);
    echo $result;
   ```

5. Array<br>
   Array adalah struktur data yang digunakan untuk menyimpan beberapa nilai dalam satu variabel. Di PHP, terdapat dua
   jenis array: array numerik dan array asosiatif.

- Cara membuat Array di php bisa menggunakan cara berikut :

    ```php
    <?php
    $fruits = array("Apel", "Pisang", "Jeruk");
    $person = array("name" => "Andi", "age" => 25, "isStudent" => true);
    $students = [
    ["name" => "Andi", "age" => 21],
    ["name" => "Budi", "age" => 22],
    ];
    ```
  Perbedaanya adalah pada cara penulisan, jika menggunakan array() maka harus menggunakan tanda kurung kurawal,
  sedangkan jika menggunakan [] maka tidak perlu menggunakan tanda kurung kurawal.

- Contoh Array Numerik:

   ```php
    <?php
    $fruits = array("Apel", "Pisang", "Jeruk");
    echo $fruits[0]; // Output: Apel
   ```

- Contoh Array Asosiatif:

   ```php
    <?php
    $person = array("name" => "Andi", "age" => 25, "isStudent" => true);
    echo $person["name"]; // Output: Andi
   ```

- Contoh Array Multi-Dimensi:

   ```php
    <?php
    $students = [
    ["name" => "Andi", "age" => 21],
    ["name" => "Budi", "age" => 22],
    ];
    echo $students[0]["name"]; // Output: Andi
   ```

6. Include dan Require <br>
   Include dan require digunakan untuk memasukkan file eksternal ke dalam skrip PHP. Perbedaan utama antara include dan
   require adalah jika file yang dimasukkan tidak ditemukan, include akan menghasilkan peringatan, sedangkan require
   akan menghasilkan fatal error.

- Contoh Include:

   ```php
    <?php
    include "header.php";
    echo "Hello, World!";
    include "footer.php";
   ```

- Contoh Require:

   ```php
    <?php
    require "header.php";
    echo "Hello, World!";
    require "footer.php";
   ```

7. Enumerasi<br>
   Enum (Enumeration) di PHP adalah fitur yang diperkenalkan pada PHP 8.1 untuk mendefinisikan sekumpulan nilai tetap
   yang bersifat konstan. Enum memungkinkan kita untuk membuat tipe data khusus dengan serangkaian nilai yang telah
   ditentukan, sehingga dapat membantu meningkatkan ketepatan tipe data dan mengurangi kesalahan dalam pengkodean.

- Contoh Enum :

    ```php
    <?php
    enum OrderStatus {
        case Pending;
        case Confirmed;
        case Canceled;
    } 
    ```
  Dalam konteks pemrograman, Enum berguna untuk membuat data yang hanya memiliki beberapa nilai yang valid. Sebagai
  contoh, dalam sistem status pemesanan, kita mungkin ingin status tersebut hanya memiliki nilai seperti Pending,
  Confirmed, dan Canceled. Dengan menggunakan Enum, kita dapat memastikan bahwa status pemesanan hanya memiliki nilai
  yang valid.

- Contoh Penggunaan Enum :

    ```php
    <?php
    enum OrderStatus {
        case Pending;
        case Confirmed;
        case Canceled;
    }
    $status = OrderStatus::Confirmed;
    echo $status;
    ```

- Contoh Enum Backed :
  PHP juga mendukung Backed Enum, yaitu enum yang memiliki nilai scalar (string atau integer) yang terkait dengan setiap
  kasus. Fitur ini berguna ketika kita perlu menyimpan nilai enum ke database atau berinteraksi dengan API yang
  mengharuskan format tertentu.

    ```php
    <?php
    enum OrderStatus: int {
        case Pending = 1;
        case Confirmed = 2;
        case Canceled = 3;
    }
    $status = OrderStatus::Confirmed;
    echo $status->value;
    ```

8. Exception Handling<br>
   Exception Handling adalah teknik yang digunakan untuk menangani kesalahan atau kondisi yang tidak terduga yang
   terjadi selama eksekusi program. Di PHP, kita dapat menggunakan blok try-catch untuk menangkap dan menangani
   pengecualian.

- Contoh Exception Handling:

   ```php
    <?php
    try {
        $result = 10 / 0;
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
   ```

- Contoh Exception Handling dengan Multiple Catch:

   ```php
    <?php
    try {
        $result = 10 / 0;
    } catch (DivisionByZeroError $e) {
        echo "Error: Division by zero";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
   ```

- Contoh Exception Handling dengan Finally:

   ```php
    <?php
    try {
        $result = 10 / 0;
    } catch (DivisionByZeroError $e) {
        echo "Error: Division by zero";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    } finally {
        echo "Finally block";
    }
   ```
