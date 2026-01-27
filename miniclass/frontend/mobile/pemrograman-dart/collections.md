# 📍 Collections

## 1. List

List sesuai namanya dapat menampung banyak data ke dalam satu objek. Dalam kehidupan sehari-hari kita menggunakan list untuk menyimpan daftar belanja, nomor telepon, dsb. Begitu pula dengan Dart kita bisa menyimpan bermacam-macam tipe data seperti string, number, dan boolean. Cara penulisannya pun sangat mudah. Perhatikan saja contoh berikut:

```dart
List<int> numberList = [1, 2, 3, 4, 5];
```

Kode di atas adalah contoh dari satu objek List yang berisi kumpulan data dengan tipe integer. Karena kompiler bisa mengetahui tipe data yang ada dalam sebuah objek List, maka tak perlu kita menuliskannya secara eksplisit.

```dart
var numberList = [1, 2, 3, 4, 5];
var stringList = ['Hello', 'WRI', 'Dart'];
```

Sesuai contoh di atas, kita mendefinisikan tipe data yang bisa dimasukkan ke dalam List di dalam tanda kurung siku (`[ ]`). Sama seperti variabel, jika kita tidak mendefinisikan nilai secara eksplisit ke dalam List, maka List akan menyimpan tipe dynamic atau bisa menyimpan semua tipe data.

```dart
void main() {
  List dynamicList = [1, 'WRI', true];
  print(dynamicList.runtimeType);
}

/// Output:
/// List<dynamic>
```

Ketika bermain dengan sebuah List, tentunya ada saat di mana kita ingin mengakses posisi tertentu dari List tersebut. Untuk melakukannya, kita bisa menggunakan fungsi indexing seperti berikut:

```dart
void main() {
  List dynamicList = [1, 'WRI', true];
  print(dynamicList[1]);
}
 
// Output: WRI
```

Perhatikan kode di atas. Fungsi indexing ditandai dengan tanda `[ ]`. Jika Anda mengira bahwa konsol akan menampilkan angka 1, tebakan Anda kurang tepat. Dalam sebuah List, indeks dimulai dari 0. Maka ketika kita akan mengakses data pada `dynamicList` yang berada pada indeks ke-1, artinya data tersebut merupakan data pada posisi ke-2. Jadi data yang akan ditampilkan pada konsol adalah WRI.

Lalu apa yang akan terjadi jika kita berusaha menampilkan item dari List yang berada di luar dari ukuran List tersebut? Sebagai contoh, Anda ingin mengakses indeks ke-3 dari `dynamicList`:

```dart
print(dynamicList[3]);
```

Hasilnya adalah eror! Kompiler akan memberitahukan bahwa perintah itu tidak bisa dijalankan. Berikut pesan eror yang akan muncul:

_Unhandled exception:_
_RangeError (index): Invalid value: Not in range 0..2, inclusive: 3_

Pesan di atas memberitahu kita bahwa List telah diakses dengan indeks ilegal. Ini akan terjadi jika indeks yang kita inginkan negatif atau lebih besar dari atau sama dengan ukuran List tersebut.

Masih ingat looping? Untuk menampilkan seluruh item dari list kita bisa memanfaatkan looping. Contohnya perhatikan kode berikut:

```dart
void main() {
  List<String> stringList = ["Hello", "WRI", "Dart"];
  for (int i = 0; i < stringList.length; i++) {
    print(stringList[i]);
  }
}
 
// Output:
// Hello
// WRI
// Dart
```

Pada kode di atas kita memanfaatkan perulangan sebanyak jumlah data di dalam list untuk mencetak data yang ada di dalam list. Banyaknya data di dalam list bisa kita panggil melalui properti `.length`.

Selain itu kita juga bisa menggunakan fungsi `foreach` untuk menampilkan data di dalam list.

```dart
void main() {
  List<String> stringList = ["Hello", "WRI", "Dart"];

  stringList.forEach((s) => print(s));
}
```

Mekanisme di atas dikenal sebagai **lambda** atau **anonymous function**. Kita akan mempelajarinya lebih dalam pada modul yang akan datang.

Sejauh ini kita baru belajar menginisialisasikan dan mengakses data dari sebuah List. Pastinya Anda bertanya, “Bagaimana kita memanipulasi data pada List tersebut?” Nah, untuk menambahkan data ke dalam list, kita bisa menggunakan fungsi `add()`.

```dart
void main() {
  List<String> stringList = ["Hello", "WRI", "Dart"];

  // Menambahkan data di akhir list.
  stringList.add('Flutter');

  print(stringList);
}

/// Output:
/// [Hello, WRI, Dart, Flutter]
```

Lalu bagaimana jika kita ingin menambahkan data namun tidak di akhir List? Jawabannya adalah dengan fungsi `insert`. Di dalam fungsi insert kita perlu memasukkan 2 parameter, yaitu indeks list dan data yang akan dimasukkan.

```dart
void main() {
  List<String> stringList = ["Hello", "WRI", "Dart", "Flutter"];
  // Menambahkan data di indeks ke-0.
  stringList.insert(0, 'Programming');
  print(stringList);
}
 
/// Output:
/// [Programming, Hello, WRI, Dart, Flutter]
```

Untuk mengubah nilai di dalam list, kita bisa langsung menginisialisasikan nilai baru sesuai indeks yang diinginkan.

```dart
stringList[1] = 'Application';
```

Sedangkan untuk menghapus data terdapat beberapa fungsi remove yang bisa kita gunakan, antara lain:

```dart
void main() {
  List<String> stringList = [
    "Programming",
    "Hello",
    "WRI",
    "Dart",
    "Flutter"
  ];

  // Menghapus list dengan nilai Programming
   stringList.remove('Programming');

  // Menghapus list pada index ke-1
  // stringList.removeAt(1);

  // Menghapus data list terakhir
  // stringList.removeLast();

  // Menghapus list mulai index ke-0 sampai ke-1 (indeks 2 masih dipertahankan)
  // stringList.removeRange(0,2);

  print(stringList);
}
```

### Spread Operator

Dart memiliki fitur menarik untuk menambahkan banyak nilai ke dalam List dengan cara yang singkat, yaitu spread operator.

Sesuai namanya “spread”, fitur ini digunakan untuk menyebarkan nilai di dalam collections menjadi beberapa elemen. Spread operator dituliskan dengan tiga titik (`...`). Mari kita lihat contoh kode berikut:

```dart
void main() {
  var favorites = ['Seafood', 'Salad', 'Nugget', 'Soup'];
  var others = ['Cake', 'Pie', 'Donut'];
  var allFavorites = [favorites, others];
  print(allFavorites);
}
 
/// Output:
/// [[Seafood, Salad, Nugget, Soup], [Cake, Pie, Donut]]
```

Nilai List tidak akan tergabung. Alih-alih menggabungkan nilainya, variabel allFavorites menjadi List yang menampung dua List di dalamnya. Nah, dengan spread operator kita dapat menggabungkan kedua List di atas:

```dart
void main() {
  var favorites = ['Seafood', 'Salad', 'Nugget', 'Soup'];
  var others = ['Cake', 'Pie', 'Donut'];
  var allFavorites = [...favorites, ...others];
  print(allFavorites);
}

/// Output:
/// [Seafood, Salad, Nugget, Soup, Cake, Pie, Donut]
```

Yup, dengan spread operator kita dapat memasukkan masing-masing elemen di dalam List ke dalam List lainnya.

Untuk mengatasi List yang bisa bernilai null, kita dapat menggunakan null-aware spread operator (`...?`) seperti berikut:

```dart
void main() {
  List<dynamic>? list;
  List<dynamic>? list2 = [0, ...?list];
  print(list2);
}
 
/// Output:
/// [0]
```

Materi terkait List
* [List](https://dart.dev/language/collections#lists)

## 2. Set

Selanjutnya kita akan membahas jenis collection yang kedua, yaitu Set. Set merupakan sebuah collection yang hanya dapat menyimpan nilai yang unik. Ini akan berguna ketika Anda tidak ingin ada data yang sama alias duplikasi dalam sebuah collection. Kita bisa mendeklarasikan Set dengan beberapa cara berikut:

```dart
void main() {
  Set<int> anotherSet = new Set.from([1, 4, 6, 4, 1]);

  print(anotherSet);
}

/// Output:
/// {1, 4, 6}
```

Secara otomatis Set akan membuang angka yang sama, sehingga hasilnya adalah {1, 4, 6}.

Untuk menambahkan data ke dalam Set kita dapat memanfaatkan fungsi `add()` atau `addAll()`.

```dart
void main() {
  var numberSet = {1, 4, 6};

  // Menambahkan data ke dalam Set.
  numberSet.add(6);
  numberSet.addAll({2, 2, 3});

  print(numberSet);
}

/// Output:
/// {1, 4, 6, 2, 3}
```

Materi terkait Sets
* [Sets](https://dart.dev/language/collections#sets)

## 3. Map

Collection ketiga adalah Map, yakni sebuah collection yang dapat menyimpan data dengan format key-value. Perhatikan contoh berikut:

```dart
var capital = {
  'Jakarta': 'Indonesia',
  'London': 'England',
  'Tokyo': 'Japan'
};
```

String yang berada pada sebelah kiri titik dua (:) adalah sebuah key, sedangkan yang di sebelah kanan merupakan value-nya. Lalu untuk mengakses nilai dari Map tersebut, kita bisa menggunakan key yang sudah dimasukkan. Misalnya, kita bisa menggunakan key “Jakarta” untuk mendapatkan value “Indonesia”:

```dart
void main() {
  var capital = {
    'Jakarta': 'Indonesia',
    'London': 'England',
    'Tokyo': 'Japan',
  };

  print(capital['Jakarta']);
}

/// Output:
/// Indonesia
```

Kita dapat menampilkan key apa saja yang ada di dalam Map dengan menggunakan property `keys`. Sedangkan untuk mengetahui nilai apa saja yang ada di dalam Map kita bisa menggunakan property `values`.

```dart
void main() {
  var capital = {
    'Jakarta': 'Indonesia',
    'London': 'England',
    'Tokyo': 'Japan',
  };

  var mapKeys = capital.keys;
  print("mapKeys: $mapKeys");

  var mapValues = capital.values;
  print("mapValues: $mapValues");
}

/// Output:
/// mapKeys = (Jakarta, London, Tokyo)
/// mapValues = (Indonesia, England, Japan)
```

Untuk menambahkan key-value baru ke dalam Map, kita bisa melakukannya dengan cara berikut:

```dart
void main() {
  var capital = {
    'Jakarta': 'Indonesia',
    'London': 'England',
    'Tokyo': 'Japan',
  };

  capital['New Delhi'] = 'India';

  print(capital);
}

/// Output:
/// {Jakarta: Indonesia, London: England, Tokyo: Japan, New Delhi: India}
```

Materi terkait Maps
* [Maps](https://dart.dev/language/collections#maps)