# Kenapa Kamu Harus Paham MVC? (The "Why")

Sebagai Backend Developer, temen-temen mungkin berpikir: "Kenapa gak langsung tulis query database di satu file aja sih? Kan lebih cepat?"

<img src="/miniclass/backend/assets/mvc/kenawhy.png" style="background-color: white; border-radius: 5px;" alt="Kenapa-mvc" width=600></img>

Ada beberapa alasan:

1. **Kode Lebih Rapi & Terstruktur (Clean Code) 🧹**
    Bayangkan jika mempunyai 1.000 baris kode dalam satu file. Dengan MVC, kode dipisah berdasarkan fungsinya. Bila ada masalah di database, cek Model. Kalau ada masalah di alur logika, cek Controller. Tidak perlu bongkar seluruh file!

2. **Kerja Tim Jadi Lebih Mudah (Collaboration) 🤝**
    Dalam tim besar, satu orang bisa fokus mengerjakan Logic (Controller), sementara yang lain fokus ke Database (Model) atau Tampilan (View) tanpa saling tabrakan (*conflict*).

3. **Mudah Dirawat dalam Jangka Panjang (Maintainability) 🛠️**
    Misalnya, 6 bulan lagi *lead programmer* meminta untuk mengganti database dari MySQL ke PostgreSQL. Karena sudah menerapkan MVC, cukup mengubah kodenya di bagian Model, sementara bagian Controller dan View tetap aman.

4. **Standar Industri & Framework Besar 🏗️**
    Hampir semua *framework* papan atas (Laravel, Django, Ruby on Rails, Spring, Express) menggunakan pola MVC. Jika sudah memahami konsep dasarnya, untuk berganti-ganti *framework* apapun akan sangat mudah di masa depan.

5. **Keamanan yang Lebih Terjamin (Security) 🛡️**
    Seperti analogi pelayan tadi, MVC memisahkan *user* dari data mentah. Kamu punya tempat khusus (Controller) untuk melakukan validasi dan filtrasi sebelum data benar-benar diproses oleh Model.

## 🆚 Sebelum vs Sesudah ada MVC 🤔

### Sebelum MVC ❌ (The "Spaghetti" Way) 🍝

```php
// tasks.php
$conn = mysqli_connect("localhost", "root", "", "db_task"); // Koneksi Database

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    // Validasi & Insert campur jadi satu
    if (!empty($title)) {
        mysqli_query($conn, "INSERT INTO tasks (title) VALUES ('$title')");
        echo "Tugas berhasil ditambah!";
    }
}

// Ambil data
$result = mysqli_query($conn, "SELECT * FROM tasks");
while ($row = mysqli_fetch_assoc($result)) {
    echo "<li>".$row['title']. "</li>"; // Tampilan HTML campur di sini
}
```

### ✅ Sesudah MVC (The "Clean" Way) ✨

#### 1. Model (TaskModel.php)

```php
class TaskModel {
    public static function all()
    {
        return DB::table('tasks')->get(); // Mengambil data
    }
}
```

#### 2. Controller (TaskController.php)

```php
class TaskController {
    public function index() {
        $tasks = Task::all(); // Panggil Model
        return response()->json($tasks); // Kirim ke View (JSON)
    }
}

```

#### 3. View/Response

```json
// Output yang diterima User
{
    "status": "success",
    "data": [
        {"id": 1, "title": "Belajar MVC"},
        {"id": 2, "title": "Praktek Laravel"}
    ]
}

```
