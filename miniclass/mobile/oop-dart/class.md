# 📍 Class

Salah satu fitur utama dari OOP adalah fitur seperti class. Class merupakan sebuah blueprint untuk membuat objek. Di dalam kelas ini kita mendefinisikan sifat (attribute) dan perilaku (behaviour) dari objek yang akan dibuat. Sebagai contoh kelas Animal memiliki atribut berupa nama, berat, dan umur, dll. Kemudian perilakunya adalah makan, tidur, dsb.

Setiap kelas memiliki attribute dan behaviour. Pada Dart kita mendefinisikan attribute dengan variabel, sedangkan behaviour sering direpresentasikan sebagai function.

Untuk mendefinisikan kelas dalam Dart, cukup gunakan keyword `class` diikuti dengan nama kelas yang akan dibuat.

```dart
class Animal {
}
```

Kemudian kita bisa menambahkan variabel dan fungsi pada kelas tersebut.

```dart
class Animal {
  String name;
  int age;
  double weight;
 
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

Kemudian untuk membuat sebuah objek dari suatu class, gunakan sintaks berikut:

```dart
var nameOfObject = NameOfClass(property1, property2);
```

Sebuah objek sama seperti variabel, artinya kita bisa menggunakan `var` untuk menginisialisasikan sebuah objek. Objek yang disimpan ke dalam variabel ini juga dikenal dengan instance atau instance of a class. Instance ini menyimpan reference atau alamat memori dari objek. Proses membuat variabel instance seperti di atas disebut instansiasi (instantiation).

```dart
var dicodingCat = Animal('Gray', 2, 4.2);
```

Kita menggunakan nama kelas serta diikuti dengan tanda kurung. Di dalam tanda kurung ini kita bisa memasukkan parameter untuk menginisialisasi nilai di dalam objek. Tanda kurung ini merupakan sebuah constructor yang akan kita pelajari pada materi selanjutnya.

Setelah objek terbuat kita bisa menjalankan fungsi atau menampilkan nilai dari property yang ada di dalamnya.

```dart
void main() {
  var dicodingCat = Animal('Gray', 2, 4.2);

  dicodingCat.eat();
  dicodingCat.poop();

  print(dicodingCat.weight);
}

class Animal {
  String name;
  int age;
  double weight;

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

Ketika program di atas dijalankan, konsol akan menampilkan hasil sebagai berikut:

```dart
Gray is eating.
Gray is pooping.
4.300000000000001
```

Materi terkait Class
* [Introduction - Classes](https://dart.dev/language#classes)
* [Classes](https://dart.dev/language/classes)

