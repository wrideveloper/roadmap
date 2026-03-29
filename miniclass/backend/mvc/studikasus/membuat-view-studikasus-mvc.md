# View (`views/tasks.php`)

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
