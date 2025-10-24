# 🎯 Kode Akhir: Hello World  

Berikut adalah kode akhir dari aplikasi "Hello World" yang telah kita buat.  

## 📃 **main.dart**  
```dart 
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text("Hello World"),
        ),
      ),
    );
  }
}
```

---

