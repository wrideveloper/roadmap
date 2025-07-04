# 🎯 Final Code: App Functionality (CRUD)  

Berikut adalah kode akhir untuk **Halaman Home** yang menerapkan fungsionalitas **CRUD** (Create, Read/Retrieve, Update, Delete) pada Todo yang telah kita buat.

## 📃 **home_screen.dart**  
```dart
import 'package:flutter/material.dart';

import '../models/todo.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // List: sekumpulan todo yang akan ditampilkan
  final List<Todo> todoList = [
    Todo(
      completed: false,
      title: "Belajar",
      description: "Belajar Desain Flutter",
    ),
    Todo(
      completed: true,
      title: "Olahraga",
      description: "Lari pagi selama 30 menit",
    ),
    Todo(
      completed: false,
      title: "Makan Siang",
      description: "Makan siang sehat dengan sayuran",
    ),
    Todo(
      completed: true,
      title: "Bekerja",
      description: "Menyelesaikan project mobile app",
    ),
    Todo(
      completed: true,
      title: "Membaca Buku",
      description: "Membaca buku 'Clean Code'",
    ),
    Todo(
      completed: false,
      title: "Berkebun",
      description: "Menyiram tanaman di taman rumah",
    ),
    Todo(
      completed: true,
      title: "Belajar Bahasa",
      description: "Latihan percakapan bahasa Inggris",
    ),
  ];

  final TextEditingController titleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();

  // Fungsi: aksi untuk menghapus todo dari list
  // ↓ ↓ ↓ ↓ ↓ ↓
  void hapusTodo(Todo todo) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Konfirmasi Hapus"),
          icon: Icon(
            Icons.warning_rounded,
            color: Colors.red[400],
            size: 120,
          ),
          content: Text(
            "Apakah anda yakin untuk menghapus todo \"${todo.title}\" ",
            textAlign: TextAlign.center,
          ),
          actions: [
            TextButton(
              onPressed: () {
                // action jika tombol batal ditekan
                Navigator.pop(context);
              },
              child: const Text(
                "Batal",
                style: TextStyle(color: Colors.blueGrey),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                // action jika tombol komfirmasi hapus ditekan
                setState(() {
                  todoList.remove(todo);
                });
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
              ),
              child: const Text(
                "Hapus",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }

  // Fungsi: aksi untuk mengeatur checklis dari todo
  // ↓↓↓↓↓↓
  void checklisTodo(Todo todo) {
    Todo todoBaru = Todo(
      title: todo.title,
      description: todo.description,
      completed: !todo.completed,
    );

    int indexTodo = todoList.indexOf(todo);

    setState(() {
      todoList[indexTodo] = todoBaru;
    });
  }

  // Fungsi: aksi untuk menambahkan todo kedalam list
  // ↓↓↓↓↓↓
  void tambahTodo(Todo todo) {
    setState(() {
      todoList.add(todo);
    });
  }

  // Fungsi: aksi untuk memperbarui todo dari list
  // ↓↓↓↓↓↓
  void updateTodo(Todo currentTodo, Todo updatedTodo) {
    int indexTodo = todoList.indexOf(currentTodo);

    setState(() {
      todoList[indexTodo].title = updatedTodo.title;
      todoList[indexTodo].description = updatedTodo.description;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFececf4),
      // Widget: App bar untuk menampilkan ikon menu dan profil
      // ↓↓↓↓↓↓
      appBar: AppBar(
        backgroundColor: const Color(0xFFececf4),
        scrolledUnderElevation: 0,
        // METHOD 2 TO CREATE APPBAR:
        // title: SizedBox(
        //   child: Row(
        //     mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //     children: [
        //       const Icon(Icons.menu),
        //       Container(
        //         decoration: BoxDecoration(
        //           color: Colors.blue[100],
        //           borderRadius: BorderRadius.circular(30),
        //         ),
        //         padding: const EdgeInsets.all(10),
        //         child: const Icon(
        //           Icons.person,
        //           color: Colors.blue,
        //         ),
        //       ),
        //     ],
        //   ),
        // ),
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
      // ↓↓↓↓↓↓
      body: SizedBox(
        width: MediaQuery.sizeOf(context).width,
        height: MediaQuery.sizeOf(context).height,
        child: Column(
          children: [
            // Widget: untuk bagian search box
            // ↓↓↓↓↓↓
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
            // ↓↓↓↓↓↓
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.only(
                    top: 20, left: 20, right: 20, bottom: 50),
                itemCount: todoList.length + 1,
                itemBuilder: (context, index) {
                  // HINT:
                  if (index == 0) {
                    if (todoList.isEmpty) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          listViewTitle(),
                          const Text("Empty"),
                        ],
                      );
                    }
                    return listViewTitle();
                  } else {
                    final Todo todoItem = todoList[index - 1];
                    return cardItem(todoItem);
                  }
                },
              ),
            ),
          ],
        ),
      ),
      // Widget: floating button/tombol "tambah" di pojok kanan bawah
      // ↓↓↓↓↓↓
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue[300],
        onPressed: () async {
          showModal();
        },
        child: const Icon(
          Icons.add,
          color: Colors.white,
        ),
      ),
    );
  }

  // Fungsi: untuk menampilkan tulisan/judul "All ToDo's"
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
  // ↓↓↓↓↓↓
  Widget cardItem(Todo todoItem) {
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
            checklisTodo(todoItem);
          },
          onLongPress: () {
            showModal(todo: todoItem);
          },
          tileColor: Colors.white,
          leading: Icon(
            todoItem.completed
                ? Icons.check_box_rounded
                : Icons.check_box_outline_blank_rounded,
            color: Colors.blue,
          ),
          title: Text(todoItem.title),
          subtitle: Text(
            todoItem.description,
            style: const TextStyle(color: Colors.grey),
          ),
          trailing: IconButton(
            onPressed: () {
              hapusTodo(todoItem);
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

  // Fungsi: untuk menampilkan modal bottom
  // ↓↓↓↓↓↓
  void showModal({
    Todo? todo,
  }) async {
    if (todo != null) {
      titleController.text = todo.title;
      descriptionController.text = todo.description;
    }

    showModalBottomSheet(
      context: context,
      // isScrollControlled: true,
      builder: (context) {
        final keyboardBottomPadding = MediaQuery.of(context).viewInsets.bottom;

        return Padding(
          padding: EdgeInsets.only(
              left: 25, right: 25, bottom: 25 + keyboardBottomPadding),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Widget: label/tulisan "Todo Title" untuk TextField "Todo Title"
                // ↓↓↓↓↓↓
                const Padding(
                  padding: EdgeInsets.only(top: 33, bottom: 8),
                  child: Text(
                    "ToDo Title",
                  ),
                ),
                // Widget: TextField "Email"
                // ↓↓↓↓↓↓
                TextField(
                  controller: titleController,
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
                // Widget: label/tulisan "ToDo Description" untuk TextField "ToDo Description"
                // ↓↓↓↓↓↓
                const Padding(
                  padding: EdgeInsets.only(top: 33, bottom: 8),
                  child: Text(
                    "ToDo Description",
                  ),
                ),
                // Widget: TextField "ToDo Description"
                // ↓↓↓↓↓↓
                TextField(
                  controller: descriptionController,
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
                // Widget: untuk membuat button "Add Todo"
                // ↓↓↓↓↓↓
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
                    onPressed: () {
                      if (todo != null) {
                        // Dia akan mengupdate Todo
                        updateTodo(
                          todo,
                          Todo(
                            title: titleController.text,
                            description: descriptionController.text,
                            completed: false,
                          ),
                        );
                      } else {
                        // Dia akan menambahkan Todo baru
                        tambahTodo(
                          Todo(
                            title: titleController.text,
                            description: descriptionController.text,
                            completed: false,
                          ),
                        );
                      }

                      Navigator.pop(context);
                    },
                    child: const Text("Add ToDo"),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

```
