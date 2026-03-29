# 📝Study Case: "Simple Task Tracker"

## Overview

<img src="/miniclass/backend/assets/mvc/studikasus1.png" style="background-color: white; border-radius: 20px;" alt="Task-Tracker-App" width=600></img>

Setelah memahami konsep teori dari mvc, saatnya kita mencobanya! Kita akan membangun sebuah **Simple Task Tracker**.

### Apa itu Simple Task Tracker?

Sederhananya, ini adalah aplikasi pelacak tugas atau daftar kerja (to-do list). Aplikasi ini dirancang untuk membantu siapa saja mencatat daftar pekerjaan yang harus diselesaikan serta menandai tugas-tugas yang telah berhasil dikerjakan agar tidak ada yang terlewat. Jika kamu pernah menggunakan layanan seperti [Notion](https://www.notion.com), [Google Tasks](https://tasks.google.com/tasks), atau [Trello](https://trello.com), maka kamu sudah memiliki gambaran tentang apa yang akan kita buat hari ini.

### Mengapa ini penting?

Membangun proyek ini akan melatih insting kamu dalam menerapkan pola MVC secara nyata. Nantinya kita akan belajar bagaimana memisahkan urusan data, logika kendali, dan tampilan layar dalam satu alur kerja yang rapi.

### Fitur Utama yang Akan Dibuat

1. **📑 View Tasks**: Melihat daftar apa saja yang harus dikerjakan.

2. **➕ Add Task**: Menambah catatan tugas baru ke dalam daftar.

### Struktur Data (Model)

- `id`: Integer

- `title`: String

- `status`: Boolean (completed/pending)

### Struktur Project

```rust
simple-task-tracker/
├── models/
│   └── TaskModel.php
├── controllers/
│   └── TaskController.php
├── views/
│   └── tasks.php
└── index.php
```

Kita Langsung Mulai saja!

## 🗂️ Membuat Model (`models/TaskModel.php`)

Model ini akan menangani data. Karena kita tidak menggunakan database nyata untuk kesederhanaan, kita akan menggunakan array statis untuk mensimulasikan data.

```php
<?php
// models/TaskModel.php

class TaskModel {

    // Fungsi untuk menginisialisasi data awal ke dalam session jika belum ada
    private static function initSession() {
        if (!isset($_SESSION['tasks'])) {
            $_SESSION['tasks'] = [
                ['id' => 1, 'title' => 'Setup Project PHP Murni', 'is_completed' => true],
                ['id' => 2, 'title' => 'Membuat Struktur MVC', 'is_completed' => false],
                ['id' => 3, 'title' => 'Belajar Routing Sederhana', 'is_completed' => false],
            ];
        }
    }

    // Mengambil semua data (Read)
    public static function all() {
        self::initSession(); // Pastikan session sudah terisi data awal
        return $_SESSION['tasks'];
    }

    // Menambahkan data baru (Create)
    public static function create($title) {
        self::initSession(); // Pastikan session siap

        $newTask = [
            'id' => count($_SESSION['tasks']) + 1,
            'title' => $title,
            'is_completed' => false
        ];
        
        // Menambahkan ke array session
        $_SESSION['tasks'][] = $newTask; 
        
        return $newTask;
    }
}
?>>
```

## 👮‍♂️ Membuat Controller (`controllers/TaskController.php`)

Controller ini akan menerima request, memanggil Model, dan mengirim data ke View.

```php
<?php
// controllers/TaskController.php

require_once 'models/TaskModel.php';

class TaskController {
    
    // Menampilkan daftar tugas
    public function index() {
        // 1. Meminta data ke Model
        $tasks = TaskModel::all();
        
        // 2. Mengirim data ke View
        require_once 'views/tasks.php';
    }

    // Menyimpan tugas baru
    public function store($request) {
        // Validasi sederhana
        if (isset($request['title']) && strlen($request['title']) >= 5) {
            $title = htmlspecialchars($request['title']); // Sanitasi input
            
            // Memerintah Model untuk menyimpan data
            TaskModel::create($title);
            
            // Redirect kembali ke halaman utama setelah menyimpan
            header("Location: index.php");
            exit();
        } else {
            // Tangani error validasi (misal: tampilkan pesan error)
            echo "Error: Judul tugas minimal 5 karakter.";
        }
    }
}
?>
```

## 📸 View (`views/tasks.php`)

View ini bertanggung jawab untuk menampilkan data yang dikirim dari Controller dalam bentuk HTML.

```php
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Simple Task Tracker</title>
</head>
<body>
    <h1>Daftar Tugas</h1>
    
    <ul>
        <?php foreach ($tasks as $task): ?>
            <li>
                <?php echo $task['title']; ?> 
                - <?php echo $task['is_completed'] ? 'Selesai' : 'Belum Selesai'; ?>
            </li>
        <?php endforeach; ?>
    </ul>

    <h2>Tambah Tugas Baru</h2>
    <form action="index.php?action=store" method="POST">
        <label for="title">Judul Tugas:</label>
        <input type="text" id="title" name="title" required>
        <button type="submit">Tambah</button>
    </form>
</body>
</html>
```

## 🔀 Router/Entry Point (`index.php`)

File ini berfungsi sebagai titik masuk utama aplikasi kita. Ia akan menerima semua request dan mengarahkannya ke metode yang tepat di Controller berdasarkan URL.

```php
<?php
// index.php

// Mulai Session di bagian paling atas
session_start();

require_once 'controllers/TaskController.php';

$controller = new TaskController();

// Routing sederhana berdasarkan query parameter 'action'
$action = isset($_GET['action']) ? $_GET['action'] : 'index';

switch ($action) {
    case 'index':
        // Jika tidak ada action atau action=index, tampilkan daftar tugas
        $controller->index();
        break;
    case 'store':
        // Jika action=store dan request adalah POST, simpan tugas baru
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->store($_POST);
        } else {
            echo "Invalid Request Method";
        }
        break;
    default:
        // Jika action tidak dikenal
        echo "404 Not Found";
        break;
}
?>
```

## Cara Menjalankan 🚀

1. Pastikan kamu telah menginstal PHP di komputer kamu.

2. Buka terminal/command prompt.

3. Arahkan ke folder simple-task-tracker.

4. Jalankan server bawaan PHP dengan perintah:

```Bash
php -S localhost:8000
```

Buka browser kamu dan kunjungi `http://localhost:8000`.
