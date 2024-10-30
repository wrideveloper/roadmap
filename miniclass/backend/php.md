# Pengenalan PHP

![img.png](assets/php.png)<br>
PHP (Hypertext Preprocessor) adalah bahasa pemrograman server-side yang digunakan untuk mengembangkan aplikasi web
dinamis dan interaktif. PHP awalnya merupakan singkatan dari "Personal Home Page," namun seiring perkembangan dan
fungsinya yang semakin luas, nama ini berubah menjadi Hypertext Preprocessor. PHP dirancang untuk dijalankan di server (
server-side), sehingga skrip PHP diproses oleh server dan hasilnya dikirimkan kepada pengguna dalam bentuk HTML. PHP
sangat populer karena kemampuannya dalam membuat aplikasi web, mulai dari situs sederhana hingga aplikasi yang lebih
kompleks seperti e-commerce, blog, atau media sosial.

## Sintax Dasar PHP

1. Variabel
   Variabel adalah tempat penyimpanan data sementara di memori yang diberi nama, sehingga bisa digunakan dan diubah
   sepanjang program. Di PHP, variabel diawali dengan simbol $.

- Tipe Data

    ```php
    <?php
    $name = "Andi";      // Variabel string
    $age = 25;            // Variabel integer
    $isStudent = true;    // Variabel boolean
    $height = 175.5;      // Variabel float
    $fruits = array("Apel", "Pisang", "Jeruk"); // Variabel array
    $person = array("name" => "Andi", "age" => 25, "isStudent" => true); // Variabel array asosiatif
    $nullValue = null;    // Variabel null
    $noValue;             // Variabel tanpa nilai
    ```

   ```php
   <?php
   $name = "Andi";      // Variabel string
   $age = 25;            // Variabel integer
   $isStudent = true;    // Variabel boolean
   
   echo "Nama: $name, Umur: $age, Mahasiswa: $isStudent";
   ?>
   ```

  Dalam contoh ini:

        - `$name` adalah variabel string yang berisi "Andi".
        - `$age` adalah variabel integer yang berisi angka 25.
        - `$isStudent` adalah variabel boolean yang bernilai true.

- Const (Konstanta)

  Konstanta adalah variabel yang nilainya tidak dapat diubah selama program berjalan. Di PHP, konstanta didefinisikan
  menggunakan fungsi define() dan const.

- Const
   ```php
   <?php
    const APP_NAME = "Aplikasi Saya";  // Konstanta string
    const PI = 3.14159;                // Konstanta float
    const MAX_USERS = 100;             // Konstanta integer
    
    echo "Nama Aplikasi: " . APP_NAME . "<br>";
    echo "Nilai Pi: " . PI . "<br>";
    echo "Maksimal Pengguna: " . MAX_USERS;
   ?>
   ```

- define()
  ```php
    <?php
    define("APP_NAME", "Aplikasi Saya");  // Konstanta string
    define("PI", 3.14159);                // Konstanta float 
    ```

- Perbedaan Const dan Define
    - Const didefinisikan di luar fungsi, sedangkan define() dapat didefinisikan di dalam fungsi.
    - Const tidak dapat digunakan di dalam kelas, sedangkan define() dapat digunakan di dalam kelas.
    - Const dapat didefinisikan dengan case-insensitive, sedangkan define() tidak.

2. Struktur Kondisi if<br>
   Struktur if digunakan untuk menjalankan blok kode tertentu jika sebuah kondisi terpenuhi. Sintaks kondisi di php sama
   dengan bahasa pemrograman lainnya.

- Contoh if sederhana:
   ```php
    <?php
    $age = 25;
    if ($age >= 18) {
        echo "Anda sudah dewasa";
    } else {
        echo "Anda masih anak-anak";
    }
   ```

- Contoh if-elseif:<br>
  elseif digunakan untuk menambahkan kondisi tambahan setelah if. Jika kondisi if tidak terpenuhi, maka kondisi elseif
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
    ```

- Contoh Switch Case:

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
   ```

- Contoh Ternary Operator:

   ```php
    <?php
    $age = 25;
    $status = ($age >= 18) ? "Dewasa" : "Anak-anak";
    echo $status;
   ```

- Contoh Nested If:

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
   ```

- Contoh Nested Campuran :

    ```php
     <?php
     $age = 25;
     $gender = "Pria";
     if ($age >= 18) {
          ($gender == "Pria") ? echo "Anda adalah pria dewasa" : echo "Anda adalah wanita dewasa";
        } else {
            echo "Anda masih anak-anak";
    }
    ```

3. Perulangan <br>
   Perulangan digunakan untuk menjalankan blok kode tertentu berulang kali. Di PHP, terdapat tiga jenis perulangan yang
   sering digunakan: for, while, dan foreach.

- Contoh Perulangan For:

   ```php
    <?php
    for ($i = 0; $i < 5; $i++) {
        echo "Nomor: $i <br>";
    }
   ```

- Contoh Perulangan While:

   ```php
    <?php
    $i = 0;
    while ($i < 5) {
        echo "Nomor: $i <br>";
        $i++;
    }
   ```

- Contoh Perulangan Foreach:

   ```php
    <?php
    $colors = array("Merah", "Hijau", "Biru");
    foreach ($colors as $value) {
        echo "$value <br>";
    }
   ```

- Contoh Do-While:

   ```php
    <?php
    $i = 0;
    do {
        echo "Nomor: $i <br>";
        $i++;
    } while ($i < 5);
   ```

- Contoh Perulangan Nested:

   ```php
    <?php
    for ($i = 0; $i < 3; $i++) {
        for ($j = 0; $j < 3; $j++) {
            echo "($i, $j) <br>";
        }
    }
   ```

- Contoh Perulangan Nested Campuran:

    ```php
     <?php
     $colors = array("Merah", "Hijau", "Biru");
     foreach ($colors as $value) {
         for ($i = 0; $i < 3; $i++) {
             echo "$value <br>";
         }
     }
    ```

4. Fungsi <br>
   Fungsi adalah blok kode yang dapat digunakan kembali di berbagai bagian program. Di PHP, fungsi didefinisikan dengan
   kata kunci function, diikuti dengan nama fungsi dan parameter yang diterima.

- Contoh Fungsi Sederhana:

   ```php
    <?php
    function sayHello() {
        echo "Hello, World!";
    }
    sayHello();
   ```

- Contoh Fungsi dengan Parameter:

   ```php
    <?php
    function sayHello($name) {
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
