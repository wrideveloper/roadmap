# 🎯 Kode Akhir: Home Styling  

Berikut adalah kode akhir dari UI "Login Screen" dan "Home Screen" yang telah kita buat di section styling Home.  

## 📃 **login_screen.dart**  
```dart
import 'package:flutter/material.dart';

import 'home_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.only(top: 0, left: 24, right: 24),
        height: MediaQuery.sizeOf(context).height,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 4,
              child: Align(
                alignment: Alignment.bottomLeft,
                child: Text(
                  "Sign in to your Account",
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            Text(
              "Enter your email and password to log in",
              style: TextStyle(
                fontSize: 16,
              ),
            ),
            const Padding(
              padding: EdgeInsets.only(top: 33, bottom: 8),
              child: Text(
                "Email",
              ),
            ),
            // Widget: TextField "Email"
            // ↓ ↓ ↓ ↓ ↓ ↓
            TextField(
              decoration: InputDecoration(
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  borderSide: const BorderSide(
                    color: Colors.black,
                  ),
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
            ),
            // Widget: label/tulisan Password untuk TextField "Password"
            // ↓ ↓ ↓ ↓ ↓ ↓
            const Padding(
              padding: EdgeInsets.only(top: 16, bottom: 8),
              child: Text("Password"),
            ),
            // Widget: TextField "Password"
            // ↓ ↓ ↓ ↓ ↓ ↓
            TextField(
              obscureText: true,
              obscuringCharacter: '*',
              decoration: InputDecoration(
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  borderSide: const BorderSide(
                    color: Colors.black,
                  ),
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
            ),
            // Widget: text/tulisan "Forgot Password?"
            // ↓ ↓ ↓ ↓ ↓ ↓
            const Align(
              alignment: Alignment.centerRight,
              child: Padding(
                padding: EdgeInsets.only(top: 16 + 8),
                child: Text(
                  "Forgot Password?",
                  textAlign: TextAlign.right,
                  style: TextStyle(
                      color: Colors.blue, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            // Widget: untuk membuat button Login
            // ↓ ↓ ↓ ↓ ↓ ↓
            Container(
              height: 82,
              width: double.maxFinite,
              padding: const EdgeInsets.only(top: 24),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  backgroundColor: Colors.blue,
                ),
                // Fungsi: aksi dari tombol yang telah dipencet
                // ↓↓↓↓↓↓
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const HomeScreen(),
                    ),
                  );
                },
                child: const Text("Login"),
              ),
            ),
            // Widget: text/tulisan "Or"
            // ↓ ↓ ↓ ↓ ↓ ↓
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Align(
                alignment: Alignment.center,
                child: Text(
                  "Or",
                  style: TextStyle(color: Colors.grey),
                ),
              ),
            ),
            // Widget: untuk membuat tombol "Continue with Google"
            // ↓ ↓ ↓ ↓ ↓ ↓
            SizedBox(
              height: 57,
              width: double.maxFinite,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(
                    color: Color.fromARGB(255, 238, 231, 231),
                  ),
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  backgroundColor: Colors.transparent,
                ),
                onPressed: () {},
                icon: Image.asset('assets/icons/google.png'),
                label: const Text("Continue with Google"),
              ),
            ),
            // Widget: untuk membuat tulisan "Don't have an account?..."
            // ↓ ↓ ↓ ↓ ↓ ↓
            Expanded(
              flex: 3,
              child: Align(
                alignment: Alignment.center,
                child: RichText(
                  textAlign: TextAlign.center,
                  text: const TextSpan(
                    text: "Don't have an account?",
                    style: TextStyle(color: Colors.black),
                    children: [
                      WidgetSpan(
                        child: Padding(
                          padding: EdgeInsets.only(left: 5),
                        ),
                      ),
                      TextSpan(
                        text: 'Sign Up',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

```

---

## 📃 **home_screen.dart**  
```dart
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  // Fungsi: untuk menampilkan tulisan/judul "All ToDo's"
  // ↓ ↓ ↓ ↓ ↓ ↓
  Widget listViewTitle() {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      width: double.maxFinite,
      child: const Text(
        "All ToDo's",
        style: TextStyle(
          fontSize: 30,
          fontWeight: FontWeight.bold,
        ),
        textAlign: TextAlign.left,
      ),
    );
  }

  // Fungsi: untuk menampilkan satu buah todo
  // ↓ ↓ ↓ ↓ ↓ ↓
  Widget cardItem(int todoIndex) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Material(
        color: Colors.transparent,
        child: ListTile(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          contentPadding:
              const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
          onTap: () {
            // perintah checklist/uncheck
          },
          onLongPress: () {
            // perintah untuk update
          },
          tileColor: Colors.white,
          leading: Icon(
            Icons.check_box_rounded,
            color: Colors.blue,
          ),
          title: Text("Judul Todo ke $todoIndex"),
          subtitle: Text(
            "Deskripsi Todo ke $todoIndex",
            style: const TextStyle(color: Colors.grey),
          ),
          trailing: IconButton(
            onPressed: () {
              // perintah hapus
            },
            icon: Icon(
              Icons.delete,
              color: Colors.red[300],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFececf4),
      // Widget: App bar untuk menampilkan ikon menu dan profil
      // ↓ ↓ ↓ ↓ ↓ ↓
      appBar: AppBar(
        backgroundColor: const Color(0xFFececf4),
        scrolledUnderElevation: 0,
        leading: const Icon(Icons.menu),
        actions: [
          Container(
            decoration: BoxDecoration(
              color: Colors.blue[100],
              borderRadius: BorderRadius.circular(30),
            ),
            padding: const EdgeInsets.all(10),
            child: const Icon(
              Icons.person,
              color: Colors.blue,
            ),
          ),
        ],
        actionsPadding: const EdgeInsets.only(right: 20),
      ),
      // Widget: isi dari halaman seperti search, dan list todo,
      // ↓ ↓ ↓ ↓ ↓ ↓
      body: SizedBox(
        width: MediaQuery.sizeOf(context).width,
        height: MediaQuery.sizeOf(context).height,
        child: Column(
          children: [
            // Widget: untuk bagian search box
            // ↓ ↓ ↓ ↓ ↓ ↓
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(25),
                color: Colors.white,
              ),
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              padding: const EdgeInsets.only(top: 5, left: 5, right: 5),
              child: const TextField(
                decoration: InputDecoration(
                  contentPadding: EdgeInsets.only(top: 12, right: 20),
                  prefixIcon: Icon(Icons.search),
                  border: InputBorder.none,
                  hintText: "Search",
                ),
              ),
            ),
            // Widget: list dari todo
            // ↓ ↓ ↓ ↓ ↓ ↓
            Expanded(
              child: SizedBox(
                child: ListView.builder(
                  padding: const EdgeInsets.only(
                      top: 20, left: 20, right: 20, bottom: 50),
                  itemCount: 50,
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      return listViewTitle();
                    } else {
                      return cardItem(index);
                    }
                  },
                ),
              ),
            ),
          ],
        ),
      ),
      // Widget: floating button/tombol "tambah" di pojok kanan bawah
      // ↓ ↓ ↓ ↓ ↓ ↓
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue[300],
        onPressed: () {
          // perintah untuk membuat todo baru
        },
        child: Icon(
          Icons.add,
          color: Colors.white,
        ),
      ),
    );
  }
}

```

---