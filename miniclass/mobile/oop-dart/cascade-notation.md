# 📍 Cascade Notation

Dart juga dilengkapi dengan cascade notation atau cascade operator. Operator ini memungkinkan kita untuk melakukan beberapa urutan operasi pada objek yang sama. Kita bisa mengakses property dari object dan menjalankan method di dalamnya bersamaan ketika kita menginstansiasi object. Cascade operator dituliskan dengan dua tanda titik (`..` atau `?..`).

Perhatikan contoh kode yang menggunakan cascade operator berikut:

```dart
void main() {
  var dicodingCat = Animal('', 2, 4.2)
    ..name = 'Gray'
    ..eat();
}
```

Apakah Anda mengerti maksud kode di atas? Kita menginstansiasi object Animal dengan constructor seperti biasa. Kemudian cascade operator yang mengikutinya akan melakukan operasi berdasarkan object yang dikembalikan oleh constructor. Contoh kode tersebut melakukan hal yang sama apabila kita menuliskan kode seperti ini:

```dart
var dicodingCat = Animal('', 2, 4.2);
dicodingCat.name = 'Gray';
dicodingCat.eat();
```

Cascade operator ini sering kali menghemat langkah dalam membuat variabel sementara, sehingga kode yang kita tulis menjadi lebih ringkas.

main.dart

```dart
import 'animal.dart';

void main() {
  var dicodingCat = Animal('', 2, 4.2)
    ..name = 'Gray'
    ..eat();
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

  void poop() {
    print('$name is pooping.');
    weight = weight - 0.1;
  }
}
```

Cascade notation juga akan sering kita temui pada [builder pattern](https://dev.to/inakiarroyo/the-builder-pattern-in-dart-efg) seperti ini:

```dart
final addressBook = (AddressBookBuilder()
      ..name = 'jenny'
      ..email = 'jenny@example.com'
      ..phone = '415-555-0100')
    .build();
```

Selain itu, apabila ingin eksplorasi lebih lanjut terkait Cascade Notation, kunjungilah tautan berikut.
* [Operator - Cascade Notation](https://dart.dev/language/operators#cascade-notation)