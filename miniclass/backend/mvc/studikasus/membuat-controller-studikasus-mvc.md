# Membuat Controller (`controllers/TaskController.php`)

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
