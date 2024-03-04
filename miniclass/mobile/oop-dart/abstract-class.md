# 📍 Abstract Class

Sesuai namanya, abstract merupakan gambaran umum dari sebuah kelas. Ia tidak dapat direalisasikan dalam sebuah objek. Pada modul sebelumnya kita sudah mempunyai kelas `Animal`. Secara harfiah hewan merupakan sebuah sifat. Kita tidak tahu bagaimana objek hewan tersebut. Kita bisa melihat bentuk kucing, ikan, dan burung namun tidak untuk hewan. Maka dari itu konsep abstract class perlu diterapkan agar kelas `Animal` tidak dapat direalisasikan dalam bentuk objek namun tetap dapat menurunkan sifatnya kepada kelas turunannya.

Untuk menjadikan sebuah kelas menjadi abstract, kita hanya perlu menambah keyword `abstract` sebelum penulisan kelas:

```dart
abstract class Animal {
  String name;
  int age;
  double weight;
 
  // ...
}
```

Dengan begitu kelas `Animal` tidak dapat diinisialisasikan menjadi sebuah objek.

```dart
var dicodingCat = Animal('Gray', 2, 4.2); // Error: The class 'Animal' is abstract and can't be instantiated.
```