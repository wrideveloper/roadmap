# 📍 Implicit Interface

Selain abstract class, cara lain yang bisa kita gunakan untuk menerapkan abstraksi dalam OOP adalah dengan interface. Interface atau antarmuka merupakan set instruksi yang bisa diimplementasi oleh objek. Secara umum, interface berfungsi sebagai penghubung antara sesuatu yang abstrak dengan sesuatu yang nyata.

Bayangkan remote TV atau tombol yang ada di HP Anda. Tombol-tombol ini bisa kita sebut sebagai interface. Kita tak perlu tahu dan peduli tentang bagaimana fungsi yang ada di dalamnya.

Dart tidak memiliki keyword atau syntax untuk mendeklarasikan interface seperti bahasa pemrograman OOP lainnya. Setiap class di dalam Dart dapat bertindak sebagai interface. Maka dari itu interface pada Dart dikenal sebagai **implicit interface**. Untuk mengimplementasikan interface, gunakan keyword `implements`. Kita bisa mengimplementasikan beberapa interface sekaligus pada satu kelas.

```dart
class ClassName implements InterfaceName
```

Setelah kelas mengimplementasikan interface, maka kelas tersebut wajib mengimplementasikan semua metode yang ada di dalam interface. Misalnya kita buat kelas baru bernama `Flyable` yang akan bertindak sebagai interface.

```dart
class Flyable {
  void fly() { }
}
```

Kita dapat membiarkan body dari method `fly()` tetap kosong karena fungsi implementasinya akan dilakukan oleh `class`. Selanjutnya buat kelas baru yang mengimplementasi interface `Flyable`.

```dart
class Bird extends Animal implements Flyable {
  String featherColor;
 
  Bird(String name, int age, double weight, this.featherColor) : super(name, age, weight);
 
}
```

Anda akan mendapati eror yang memberikan pesan “*Missing concrete implementation of Flyable.fly*”. Ini artinya kita harus mengimplementasi fungsi `fly` yang terdapat pada interface `Flyable`.

main.dart

```dart
void main() {
  var dicodingBird = Bird('Birdy', 2, 0.8, 'Gray');

  dicodingBird.fly();
  dicodingBird.eat();
}

/// Output:
/// Birdy is flying
/// Birdy is eating.
```

bird.dart

```dart
import 'animal.dart';
import 'flyable.dart';

class Bird extends Animal implements Flyable {
  String featherColor;

  Bird(String name, int age, double weight, this.featherColor)
      : super(name, age, weight);

  @override
  void fly() {
    print('$name is flying');
  }
}
```

flyable.dart

```dart
class Flyable {
  void fly() {}
}
```

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
}
```
Keyword atau anotasi `@override` menunjukkan fungsi tersebut mengesampingkan fungsi yang ada di interface atau kelas induknya, lalu menggunakan fungsi yang ada dalam kelas itu sendiri sebagai gantinya.