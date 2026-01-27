# 📍 Dart Fundamental

## 1. Comments

Sebuah komentar akan dilewatkan ketika proses kompilasi, sehingga tidak akan memengaruhi alur program yang kita tulis. Komentar bisa digunakan sebagai dokumentasi yang menjelaskan kode yang kita tulis. Terdapat tiga jenis komentar yang bisa digunakan pada Dart. 

Pertama adalah single-line comment atau komentar satu baris yang diawali dengan tanda // dan berakhir pada akhir baris tersebut.
```dart
// Single line comment
```

Selanjutnya ada multi-line comment di mana kita bisa menuliskan beberapa baris komentar. Komentar ini dimulai dari tanda /* dan diakhiri dengan */.
```dart
/*
  multi
  line
  comment
 */
```

Kemudian terakhir adalah documentation comment. Komentar ini adalah single-line comment atau multi-line comment yang diawali dengan /// atau /**.
```dart
void main(List<String> arguments) {
  /// Mencetak Hello Dart! Dart is great. pada konsol
  print('Hello Dart! Dart is great.');
  /// Testing documentation comment with [].
}
```

## 2. Variables

Ketika menulis sebuah program, kita memberi tahu komputer cara memproses informasi seperti mencetak teks ke layar atau melakukan operasi perhitungan. Untuk lebih memudahkan penggunaan dan pemanggilan data ini maka kita bisa memanfaatkan variabel. Variabel bisa dibayangkan sebagai sebuah kotak atau wadah yang menyimpan nilai. Di dalam komputer variabel ini disimpan di dalam memori komputer. Setiap variabel memiliki nama yang dapat kita panggil dan gunakan.

Pada Dart kita mendefinisikan sebuah variabel dengan keyword "var".
```dart
var greetings = 'Hello Dart!';
```

## 3. Data Types

Dart memiliki banyak tipe data yang mewakili jenis data yang dapat kita gunakan dan bagaimana data tersebut dioperasikan. Dengan tipe data, komputer dapat menghindari operasi yang tidak mungkin serta bisa menghasilkan bug, misalnya seperti perkalian karakter alfabet atau mengubah angka menjadi kapital.
```dart
String greetings = 'Hello Dart!';
int myAge = 20;
double weight = 35.8;
bool isMale = true;
```
## 4. Operators

Istilah operator dipinjam dari matematika dengan pengertian yang sedikit berbeda. Pada Dart operator menginstruksikan komputer untuk melakukan operasi.

### Operator Aritmatika

Operator aritmatika digunakan untuk operasi seperti penjumlahan atau perkalian. Lihatlah contoh kode berikut:
```dart
void main() {
  print(5 + 2); // int add = 7
  print(5 - 2); // int subtract = 3
  print(5 * 2); // int multiply = 10
  print(5 / 2); // double divide = 2.5
  print(5 ~/ 2); // int intDivide = 2
  print(5 % 2); // int modulo = 1
}
```

### Operator Perbandingan

Dart juga mendukung operasi perbandingan untuk membandingkan nilai-nilai yang dijadikan sebagai operands. Berikut ini adalah contoh operator perbandingan pada Dart:
```dart
print(2 == 2); // Equal; see discussion below
print(2 != 3); // Not equal
print(3 > 2); // Greater than
print(2 < 3); // Less than
print(3 >= 3); // Greater than or equal to
print(2 <= 3); // Less than or equal to
```

### Operator Logika

Kita juga dapat menggabungkan ekspresi boolean atau membaliknya dengan operator logika. Operator ini meliputi:
```dart
||	OR
&&	AND
!	NOT
``` 

* Operator OR (||), operator yang akan mengembalikan nilai true jika salah satu ekspresi bernilai true.
* Operator AND (&&), operator yang akan mengembalikan nilai true jika semua ekspresi bernilai true.
* Operator NOT (!), operator yang melakukan negasi pada ekspresi yang diberikan.

Materi terkait Operators
* [Operators](https://dart.dev/language/operators)

## 5. Exceptions

Sebuah aplikasi yang sudah berjalan mungkin mengalami eror dan crash. Kondisi eror pada saat aplikasi berjalan (runtime) ini dikenal dengan exception. Ketika exception terjadi aplikasi akan dihentikan dan program setelahnya juga tidak akan dieksekusi.

Untuk menangani exception, mari gunakan "try" dan "catch". Pindahkan kode yang berpeluang menimbulkan exception ke dalam blok "try".
```dart
void main() {
  try {
    var a = 7;
    var b = 0;
    print(a ~/ b);
  } catch (e) {
    print('Exception happened: $e');
  }
}
``` 

### Finally

Selain try, on, dan catch, ada satu blok lagi yang ada dalam mekanisme exception handling, yaitu "finally". Blok finally akan tetap dijalankan tanpa peduli apa pun hasil yang terjadi pada blok try-catch.
```dart
void main() {
  try {
    var a = 7;
    var b = 0;
    print(a ~/ b);
  } catch (e, s) {
    print('Exception happened: $e');
    print('Stack trace: $s');
  } finally {
    print('This line still executed');
  }
}
``` 

Materi terkait Exceptions
* [Exceptions](https://dart.dev/language/error-handling)

## 6. Functions

Functions pada Dart digunakan untuk menghasilkan output berdasarkan input tertentu yang diberikan, selain itu juga sebagai blok kode atau prosedur yang dapat digunakan kembali.

Untuk mendeklarasikan fungsi, caranya sama dengan penulisan fungsi main() yaitu dengan menentukan tipe nilai balik atau return value lalu nama fungsi dan parameter inputnya.
```dart
returnType functionName(type param1, type param2, ...) {
  return result;
}
``` 

Setiap fungsi Dart selalu mengembalikan nilai. Namun ada satu tipe data khusus yang bisa kita lihat pada fungsi main yaitu return type void. Keyword void berarti fungsi tersebut tidak menghasilkan output atau nilai kembali. Biasanya fungsi seperti ini digunakan untuk kumpulan instruksi atau prosedur yang berulang dan sering digunakan.
```dart
void main() {
  greet();
}

void greet() {
  print('Hello!');
}
```     

### Function Parameters
Pada beberapa kasus fungsi bisa memerlukan input data untuk diproses. Input data ini kita kenal sebagai parameter. Untuk menambahkan parameter ke dalam fungsi, kita bisa memasukkannya ke dalam tanda kurung. Sebuah fungsi bisa menerima nol, satu, atau beberapa parameter.
```dart
void main() {
  greet('Budi', 2017);
}

void greet(String name, int bornYear) {
  var age = 2023 - bornYear;
  print('Halo $name! Tahun ini Anda berusia $age tahun');
}
``` 

Sebuah fungsi juga bisa menghasilkan output atau mengembalikan nilai. Fungsi yang mengembalikan nilai ditandai dengan definisi return type selain void dan memiliki keyword "return". Contohnya seperti berikut.
```dart
void main() {
  var firstNumber = 7;
  var secondNumber = 10;
  print(
      'Rata-rata dari $firstNumber & $secondNumber adalah ${average(firstNumber, secondNumber)}');
}
``` 

Jika fungsi hanya memiliki satu baris kode atau instruksi di dalamnya, maka bisa disingkat dengan anotasi =>. Ini juga dikenal dengan nama arrow syntax.
```dart
double average(num num1, num num2) => (num1 + num2) / 2;
void greeting() => print('Hello');
``` 

### Optional Parameters

Dart mendukung optional parameter, di mana kita tidak wajib mengisi parameter yang diminta oleh fungsi. Untuk bisa membuat parameter menjadi opsional, kita perlu memasukkannya ke dalam kurung siku seperti contoh berikut:
```dart
void greetNewUser([String name, int age, bool isVerified])
``` 

Setiap parameter yang tidak dimasukkan akan memiliki nilai null. Namun sejak versi 2.12, Dart memiliki fitur null safety di mana suatu variabel secara default tidak bisa memiliki nilai null. Solusinya, kita bisa menambahkan tanda tanya (?) setelah tipe data supaya bisa menyimpan nilai null atau memberikan nilai parameter default. Nilai ini akan digunakan jika kita tidak memasukkan parameternya.
```dart
void greetNewUser([String? name, int? age, bool isVerified = false]) {}
``` 

Dengan cara ini, urutan parameter masih perlu diperhatikan sehingga jika kita hanya ingin mengisi parameter terakhir, kita perlu mengisi parameter sebelumnya dengan null. Untuk mengatasi masalah di tersebut kita bisa memanfaatkan named optional parameters. Pada opsi ini kita menggunakan kurung kurawal pada parameter.
```dart
void greetNewUser({String? name, int? age, bool? isVerified})
``` 

Kita bisa memanggil fungsi seperti berikut:
```dart
greetNewUser(name: 'Widy', age: 20, isVerified: true);
greetNewUser(name: 'Widy', age: 20);
greetNewUser(age: 20);
greetNewUser(isVerified: true);
``` 

Perhatikan bahwa parameter ini bersifat opsional dan secara default akan bernilai null. Untuk memenuhi null safety, Anda bisa menggunakan cara seperti sebelumnya, atau menandai parameter wajib diisi dengan keyword required.
```dart
void greetNewUser({required String name, required int age, bool isVerified = false}) {}
``` 

Materi terkait Functions
* [Functions](https://dart.dev/language/functions)

## 7. Variable Scope
Setiap variabel memiliki scope atau lingkupnya masing-masing. Sebuah variabel dianggap satu lingkup selama masih berada di satu blok kurung kurawal yang sama. Lingkup ini menentukan bagian kode mana yang dapat membaca dan menggunakan variabel tersebut.

Program di bawah ini adalah salah satu contoh kesalahan dalam memanggil variabel. Ia memanggil variabel discountApplied, tetapi proses deklarasinya terjadi pada perintah berikutnya. Hal ini harus dihindari karena pemanggilan variabel dapat dilakukan setelah proses deklarasi terjadi.
```dart
var price = 300000;

void main() {
  var discount = checkDiscount(price);
  print('You need to pay: ${price - discount}');
}

num checkDiscount(num price) {
  num discount = 0;
  if (!discountApplied) {            // pemanggilan variabel yang salah sehingga terjadi error
    if (price >= 100000) {
      discount = 10 / 100 * price;
      var discountApplied = true;    // proses deklarasi seharusnya terjadi sebelum pemanggilan variabel
    }
  }

  return discount;
}
``` 

## 8. Constants & Final

Constants adalah hal baru yang akan kita pelajari dan berguna untuk menyimpan nilai yang tidak akan berubah selama program berjalan.

Salah satu contoh paling mudah yang bisa kita ambil adalah nilai pi = 3.14. Untuk mendefinisikan variabel konstan, gunakanlah keyword "const".
```dart
const num pi = 3.14;

void main() {
  var radius = 7;
  print(
      'Luas lingkaran dengan radius $radius = ${calculateCircleArea(radius)}');
}

num calculateCircleArea(num radius) => pi * radius * radius;
``` 

Variabel yang dideklarasikan sebagai "const" bersifat compile-time constants, artinya nilai tersebut harus sudah diketahui sebelum program dijalankan. Sedangkan "final", nilainya masih bisa diinisialisasi ketika runtime atau ketika aplikasi berjalan. Sebagai contoh kode berikut:
```dart
void main() {
  final firstName = "Achmad";
  final lastName = "Ilham";

  //lastName = 'Angga';       // tidak bisa dilakukan pengubahan nilai

  print('Hello $firstName $lastName');
}
``` 

Kita masih bisa menerima input dan menyimpannya pada variabel firstName dan lastName, namun nilai variabel tersebut tidak bisa diubah setelah diinisialisasi. Variabel yang nilainya tidak bisa berubah dikenal dengan "immutable variable".

## 9. Null Safety

Seperti yang telah kita bahas sebelumnya, variabel digunakan untuk menyimpan nilai. Variabel String digunakan untuk menyimpan teks, num digunakan untuk menyimpan angka, dsb. Namun, kenyataannya suatu variabel juga bisa tidak memiliki nilai. Nilai “tidak ada” pada Dart ini dikenal dengan nilai null. Nilai null bisa terjadi karena kita belum menginisialisasi nilai atau memang secara eksplisit menentukan nilai null pada variabel.

Bayangkan ada teman yang ingin mentraktir makanan favorit Anda, tetapi karena Anda tidak memiliki makanan favorit, maka ia akan bingung. Begitu pula dengan komputer. Jika nilai variabel null atau “tidak ada”, maka komputer juga akan bingung hingga bisa menyebabkan crash pada program.

Namun, nilai null tidak sepenuhnya buruk. Akan tetap ada kasus tertentu di mana kita membutuhkan nilai null. Contohnya seperti variabel favoriteFood di atas karena tidak semua orang memiliki makanan favorit.
```dart
int age = null;               // Compile error
String? favoriteFood = null; 
``` 

Tanda tanya (?) di atas menunjukkan bahwa variabel "favoriteFood" boleh memiliki nilai null (nullable). Sementara variabel "age" harus memiliki nilai angka dan tidak boleh null (non-nullable).

Materi terkait Null Safety
* [Null Safety](https://dart.dev/null-safety)
