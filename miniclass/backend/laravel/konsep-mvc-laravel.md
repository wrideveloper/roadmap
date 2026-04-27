# Memahami Konsep MVC di Laravel

Sebelumnya di bab Fundamental, kita sudah belajar konsep MVC (*Model-View-Controller*) secara teori. Nah, sekarang kita akan melihat bagaimana sih wujud asli MVC itu di dalam kerangka kerja Laravel dan seperti apa bentuk kodenya.

Buat kalian yang masih awam, tenang saja! Kita akan pakai **analogi restoran** lagi biar gampang dipahami.

Di Laravel, alur MVC sebenarnya ketambahan satu komponen penting di depan, yaitu **Router** (Jalur). Jadi alurnya kira-kira seperti ini: `Route -> Controller -> Model -> View`.

Mari kita bedah satu per satu perannya!

## 1. Route (Sang Resepsionis)
Setiap kali kamu mengetikkan URL di browser (misal: `www.webkita.com/menu`), yang pertama kali menyambut permintaan itu adalah **Route**.

Tugas Route sangat sederhana: **Mengarahkan tamu ke meja yang benar**. 
Di Laravel, Route akan melihat URL yang diminta, lalu mengopernya ke Controller yang bertugas menangani URL tersebut.

*   *Analogi:* Resepsionis restoran yang mencatat tamu datang mau pesan makan (URL `/pesan`) atau cuma mau lihat-lihat daftar menu (URL `/menu`), lalu memanggil pelayan yang tepat.

**Bentuk Kodenya di Laravel (biasanya di file `routes/web.php`):**
```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;

// Kalau ada tamu yang buka URL "/menu"
// Tolong panggilkan MenuController, lalu jalankan fungsi "index"
Route::get('/menu', [MenuController::class, 'index']);
```

## 2. Controller (Sang Pelayan / Manajer)
Ini dia **otak utama** dari alur kerjamu. Controller adalah tempat di mana kamu menulis logika (kode PHP) aplikasi. 

Tugas Controller:
1. Menerima request dari Route.
2. Meminta data ke Model (kalau butuh ambil/simpan data).
3. Mengirimkan hasil akhirnya ke View (kalau web biasa) atau langsung dikirim sebagai JSON (kalau API).

*   *Analogi:* Pelayan yang mencatat pesananmu, jalan ke dapur buat minta koki masak (Model), lalu nganterin makanannya ke mejamu (View).

**Bentuk Kodenya di Laravel (di folder `app/Http/Controllers/`):**
```php
<?php
namespace App\Http\Controllers;

use App\Models\Menu; // Import si Koki (Model)
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Fungsi index yang tadi dipanggil oleh Route
    public function index()
    {
        // 1. Minta ke dapur (Model) untuk ngambil semua menu makanan
        $dataMenu = Menu::all();

        // 2. Kirim data makanannya ke meja tamu (View bernama "daftar-menu")
        return view('daftar-menu', [
            'menus' => $dataMenu
        ]);
    }
}
```

## 3. Model (Sang Koki & Gudang Bahan)
**Model** adalah representasi dari tabel di databasemu. Di sinilah letak kehebatan Laravel yang bernama **Eloquent ORM**.

Dulu, kalau kita mau ambil data dari database, kita harus nulis *query* SQL manual yang panjang dan ribet seperti:
```sql
SELECT * FROM menus WHERE status = 'tersedia';
```

Di Laravel, Model mengubah tabel database menjadi bentuk *Object* PHP. Kodenya jadi sangat *bahasa manusia*.

Tugas Model: Ngobrol langsung dengan Database. Entah itu nyari data, nyimpen data baru, atau ngehapus data. Controller **dilarang keras** nulis *query* SQL manual. Kalau butuh data, Controller tinggal nyuruh Model.

*   *Analogi:* Koki di dapur yang tahu persis letak bahan makanan di kulkas (Database). Si pelayan (Controller) nggak perlu tahu kulkasnya di mana, pokoknya dia tinggal minta "Tolong bikinin Nasi Goreng 1".

**Bentuk Kodenya di Laravel (di folder `app/Models/`):**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Koki spesialis tabel "menus" di database
class Menu extends Model
{
    // Cukup sesimpel ini! 
    // Laravel otomatis tahu kalau class "Menu" ini 
    // terhubung dengan tabel "menus" di database.
    
    // Nanti Controller tinggal manggil: Menu::all() atau Menu::create(...)
}
```

## 4. View (Piring & Tata Letak)
Ini adalah antarmuka (UI) yang dilihat oleh *user*. Di Laravel, View menggunakan mesin pembuat *template* yang sangat canggih bernama **Blade** (file berekstensi `.blade.php`).

Tugas View hanya satu: **Menampilkan data**. Di dalam View tidak boleh ada logika perhitungan berat atau nyari data ke database. View cuma menerima "makanan matang" dari Controller lalu menyajikannya dengan cantik pakai HTML/CSS.

*   *Analogi:* Piring saji yang sudah dihias cantik (HTML/CSS) untuk meletakkan makanan (Data) sebelum dihidangkan ke tamu.

**Bentuk Kodenya di Laravel (di folder `resources/views/`):**
```html
<!-- Nama file: daftar-menu.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <title>Daftar Menu Restoran</title>
</head>
<body>
    <h1>Menu Hari Ini</h1>
    
    <ul>
        <!-- Looping data "menus" yang dikirim oleh Controller tadi -->
        @foreach($menus as $menu)
            <li>
                <h3>{{ $menu->nama_makanan }}</h3>
                <p>Harga: Rp {{ $menu->harga }}</p>
            </li>
        @endforeach
    </ul>
</body>
</html>
```

---

## Kesimpulan Alur Kerjanya

1. Tamu (User) ngetik URL `/menu`.
2. **Route** nerima URL itu, lalu manggil `MenuController` fungsi `index`.
3. `MenuController` mikir: *"Oh, dia butuh daftar menu. Aku harus minta ke dapur nih."*
4. `MenuController` manggil **Model** `Menu` dengan kode `Menu::all()`.
5. **Model** lari ke database, ngambil semua data menu, lalu ngasih datanya kembali ke Controller.
6. `MenuController` nerima data tersebut, lalu manggil **View** `daftar-menu.blade.php` sambil nitipin datanya.
7. **View** menyusun data tersebut ke dalam desain HTML yang rapi, lalu menampilkannya di layar HP/Laptop user!

Gimana? Kebayang kan seberapa rapinya kodingan kita kalau pakai standar MVC ini?

Nah, di materi studi kasus selanjutnya, kita akan mempraktekkan langsung cara membuat **Model** dan menyusun *Database*!
