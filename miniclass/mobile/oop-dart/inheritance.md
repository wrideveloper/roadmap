# 📍 Inheritance

Beberapa objek bisa memiliki beberapa karakteristik atau perilaku yang sama, namun sebenarnya mereka bukanlah objek yang sama. Di sini hadirlah peran inheritance atau pewarisan. Apa definisi keduanya? Inheritance adalah kemampuan suatu program untuk membuat kelas baru dari kelas yang ada. Konsep inheritance ini bisa dibayangkan layaknya seorang anak mewarisi sifat dari orang tuanya. Di dalam OOP kelas yang menurunkan sifat disebut sebagai kelas induk (parent class/superclass) sementara kelas yang mewarisi kelas induknya disebut sebagai kelas anak (child class/subclass).

Yuk kembali lagi pada contoh objek kucing. Selain kucing ada jenis hewan lain yang bersifat sama. Misalnya ikan dan burung juga memiliki nama, berat, dan umur. Selain itu mereka juga melakukan aktivitas seperti makan dan tidur. Yang membedakan objek tersebut adalah cara mereka bernafas dan bergerak. Untuk lebih memahami, perhatikanlah tabel kelas berikut:

| Cat    | Fish | Bird |
| -------- | ------- | ---- |
| + name  | + name    | + name |
| + weight | + weight  | + weight |
| + age    | + age    | + age |
| + furColor | + skinColor | + featherColor |
| - eat() | - eat() | - eat() |
| - sleep() | - sleep() | - sleep()
| - poop() | - poop() | - poop() |
| - walk() | - swim() | - fly() |

Bisa kita lihat pada tabel di atas bahwa objek `Cat`, `Fish`, dan `Bird` memiliki beberapa property dan method yang sama seperti `name`, `weight`, `age`, `eat()`, dan `sleep()`.

Dibandingkan membuat 3 kelas dan menuliskan ulang properti yang sama, kita bisa memanfaatkan teknik inheritance dengan mengelompokkan properti dan fungsi yang sama. Caranya buat sebuah kelas baru yang nantinya akan diturunkan sifatnya.

Sebuah class `Animal` yang memiliki karakteristik memiliki `name`, `weight` dan `age` serta dapat `eat()`, `sleep()`, dan `poop()`. Dapat diturunkan menjadi
| Cat    | Fish | Bird |
| -------- | ------- | ---- |
| + furColor | + skinColor    | + featherColor |
| - walk() | - swim()  | - fly() |

Setelah membuat kelas `Animal`, kita dapat membuat kelas lainnya lalu melakukan extends ke kelas induknya. Untuk menerapkan inheritance gunakan keyword `extends` seperti contoh berikut:

```dart
class ChildClass extends ParentClass {
 
}
```

Dengan begitu kita bisa membuat kelas `Cat` mewarisi kelas `Animal`.

cat.dart

```dart
class Cat extends Animal {
  final String furColor;
 
  Cat(String name, int age, double weight, String furColor)
      : this.furColor = furColor,
        super(name, age, weight);
 
  void walk() {
    print('$name is walking');
  }
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

Karena kelas `Cat` adalah turunan dari kelas `Animal`, maka kita bisa mengakses sifat dan perilaku dari `Animal` melalui kelas `Cat`.

main.dart

```dart
import 'cat.dart';

void main() {
  var dicodingCat = Cat('Grayson', 2, 2.2, 'Gray');

  dicodingCat.walk();
  dicodingCat.eat();

  print(dicodingCat.weight);
}

/// Output:
/// Grayson is walking
/// Grayson is eating.
/// 2.4000000000000004
```

## Inheritance constructor

Karena kelas `Animal` memiliki constructor untuk menginisialisasi properti di dalamnya, maka semua kelas turunannya juga perlu mengimplementasikan constructor tersebut. Oleh sebab itu ketika membuat kelas `Cat` tanpa mendefinisikan constructor kita akan mendapatkan eror. IntelliJ IDEA akan memberikan saran untuk membuat constructor.

```dart
Cat(String name, int age, double weight) : super(name, age, weight);
```

Keyword `super` di atas akan diarahkan ke constructor dari kelas `Animal`.

Jika ingin menginisialisasikan nilai `furColor` melalui constructor, maka kita bisa menambahkan parameter di dalam constructor.

```dart
Cat(String name, int age, double weight, String furColor) : this.furColor = furColor, super(name, age, weight);
```

Atau, kita bisa meringkasnya seperti yang telah kita pelajari pada materi constructor.

```dart
Cat(String name, int age, double weight, this.furColor) : super(name, age, weight);
```