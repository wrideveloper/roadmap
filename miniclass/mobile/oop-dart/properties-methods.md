# 📍 Properties dan Methods

Kita telah mempelajari variabel untuk menyimpan nilai dan function untuk menuliskan set instruksi yang bisa digunakan kembali. Di dalam class, variabel dan fungsi ini dikenal dengan property dan method.

Seperti yang telah disebutkan pada materi Class, property merepresentasikan atribut pada sebuah objek sementara method menggambarkan perilaku dari objek.

Sama seperti variabel, kita mendeklarasikan property di dalam kelas dengan menentukan tipe datanya atau menginisialisasikan nilainya secara eksplisit.

```dart
class Animal {
  String _name = '';
  int _age = 0;
  double _weight = 0;
}
```

OOP memiliki konsep enkapsulasi di mana kita bisa menyembunyikan informasi di dalam objek sehingga status atau data di dalam objek tidak bisa diubah atau bahkan dilihat. Umumnya bahasa pemrograman memiliki visibility modifier untuk menentukan siapa saja yang bisa mengakses property atau method. Namun, Dart tidak memiliki keyword visibility modifier seperti private atau public. Bagaimana cara mengatasinya?

Jadikanlah class sebagai library lalu panggilah ia dengan keyword `import`. Untuk membuat class sebagai library Anda cukup membuat berkas baru, sehingga Anda akan memiliki 2 buah berkas:

animal.dart

```dart
class Animal {
  String name = '';
  int age = 0;
  double weight = 0;

  Animal(this.name, this.age, this.weight);

  void eat() {
    print('$name is eating.');
    weight = weight + 0.2;
  }

  void sleep() {
    print('$name is sleeping.');
  }

  void poop() {
    print('$name is pooping.');
    weight = weight - 0.1;
  }
}
```

main.dart

```dart
import 'animal.dart';

void main() {
  var dicodingCat = Animal('Gray', 2, 4.2);

  dicodingCat.eat();
  dicodingCat.poop();

  print(dicodingCat.weight);
}
```

Property yang private artinya hanya bisa diakses pada berkas atau library yang sama. Kita akan membutuhkan private property ini di saat kita tidak ingin objek diubah dari luar. Karena Dart tidak memiliki modifier private, sebagai gantinya kita perlu menambahkan underscore (`_`) sebelum nama property.

```dart
String _name = '';
int _age = 0;
double _weight = 0;
```

Setelah menambahkan underscore pada nama variabel, Anda akan mendapatkan eror di berkas `main.dart` ketika mengakses property `weight`. Apa pasal? Kini  `weight` bersifat private dan tidak bisa diakses dari luar berkasnya. Solusinya, Anda bisa menambahkan setter dan getter untuk mendapatkan nilai serta mengubahnya dari luar berkas. Jika menggunakan IntelliJ IDEA Anda bisa menggunakan shortcut Alt + Insert lalu pilih Getter and Setter.

```dart
// Setter
set name(String value) {
  _name = value;
}
 
// Getter
double get weight => _weight;
```

Selain dengan setter, Anda juga bisa mengubah nilai dengan property dari pemanggilan method. Pada contoh kelas hewan tentunya kita tidak bisa langsung mengubah nilai berat badan, namun kita bisa menambah dan mengubah nilainya melalui proses makan atau buang air besar (BAB).

```dart
void eat() {
  print('$_name is eating.');
  _weight = _weight + 0.2;
}
 
void poop() {
  print('$_name is pooping.');
  _weight = _weight - 0.1;
}
```

Sehingga, keseluruhan kode pada berkas `animal.dart` akan menjadi seperti berikut.

```dart
class Animal {
  String _name = '';
  int _age = 0;
  double _weight = 0;

  Animal(this._name, this._age, this._weight);

  // Setter
  set name(String value) {
    _name = value;
  }

  // Getter
  double get weight => _weight;
  int get age => _age;

  // Methods
  void eat() {
    print('$_name is eating.');
    _weight = _weight + 0.2;
  }

  void sleep() {
    print('$_name is sleeping.');
  }

  void poop() {
    print('$_name is pooping.');
    _weight = _weight - 0.1;
  }
}
```

Materi terkait Properties & Methods
* [Classes - Instance Variables](https://dart.dev/language/classes#instance-variables)
* [Classes - Implicit Interfaces](https://dart.dev/language/classes#implicit-interfaces)
* [Methods](https://dart.dev/language/methods)
