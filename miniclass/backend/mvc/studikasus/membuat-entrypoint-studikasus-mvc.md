# Router/Entry Point (`index.php`)

File ini berfungsi sebagai titik masuk utama aplikasi kita. Ia akan menerima semua request dan mengarahkannya ke metode yang tepat di Controller berdasarkan URL.

```php
<?php
// index.php

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
