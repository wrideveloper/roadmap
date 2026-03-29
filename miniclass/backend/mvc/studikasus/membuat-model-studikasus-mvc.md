# Membuat Model (`models/TaskModel.php`)

Model ini akan menangani data. Karena kita tidak menggunakan database nyata untuk kesederhanaan, kita akan menggunakan array statis untuk mensimulasikan data.

```php
<?php
// models/TaskModel.php

class TaskModel {
    // Simulasi data (Mock Data)
    private static $tasks = [
        ['id' => 1, 'title' => 'Setup Project PHP Murni', 'is_completed' => true],
        ['id' => 2, 'title' => 'Membuat Struktur MVC', 'is_completed' => false],
        ['id' => 3, 'title' => 'Belajar Routing Sederhana', 'is_completed' => false],
    ];

    // Mengambil semua data
    public static function all() {
        return self::$tasks;
    }

    // Menambahkan data baru
    public static function create($title) {
        $newTask = [
            'id' => count(self::$tasks) + 1,
            'title' => $title,
            'is_completed' => false
        ];
        
        self::$tasks[] = $newTask; // Menambahkan ke array simulasi
        return $newTask;
    }
}
?>
```
