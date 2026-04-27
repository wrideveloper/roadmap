# Studi Kasus 2: API Controller & Best Practice

Nah, database dan model kita sudah siap. Tapi, aplikasi Frontend atau Mobile nggak bisa ngobrol langsung sama database kita. Mereka butuh "pintu masuk" bernama **Endpoint (Routing & Controller)**.

Di materi kali ini, kita nggak cuma bikin CRUD biasa. Kita akan langsung belajar standar industri (*Best Practice*) di Laravel, yaitu menggunakan **Form Request** (untuk validasi keamanan) dan **API Resource** (untuk memoles bentuk data JSON biar rapi).

## 1. Merapikan Bentuk Data (API Resource)

Pernah nggak sih lihat API yang ngeluarin data kotor banget? Tanggal dibuatnya (`created_at`) bentuknya aneh, trus *password* atau data sensitif malah ikut bocor? 

**API Resource** bertugas sebagai "saringan" sebelum data model kita dikirim ke luar sebagai JSON. 

Bikin filenya dulu:
```bash
php artisan make:resource CategoryResource
```

Buka `app/Http/Resources/CategoryResource.php`, dan atur bentuk datanya di fungsi `toArray`:

```php
public function toArray(Request $request): array
{
    return [
        'id'          => $this->id,
        'nama'        => $this->name, // Bisa kita ganti labelnya jadi bahasa Indonesia!
        'deskripsi'   => $this->description,
        'dibuat_pada' => $this->created_at->format('d M Y'),
    ];
}
```
*Keren kan? Kita bebas mendandani bentuk JSON-nya tanpa merusak data asli di database.*

## 2. Satpam Keamanan: Form Request

Sebelum nge-save data ke database, kita WAJIB banget ngecek data yang dikirim user. Gimana kalau harganya minus? Atau nama makanannya dikosongin? Jangan sampai database kita meledak karena *error*.

Kita pakai **Form Request** agar logika *pengecekan* terpisah dari Controller:

```bash
php artisan make:request StoreCategoryRequest
```

Buka `app/Http/Requests/StoreCategoryRequest.php`:

```php
// 1. Ubah return false menjadi true agar rute ini bisa diakses
public function authorize(): bool
{
    return true; 
}

// 2. Tulis aturan mainnya di sini
public function rules(): array
{
    return [
        // Wajib diisi, harus teks, max 100 huruf, dan ga boleh kembar di tabel food_categories
        'name'        => ['required', 'string', 'max:100', 'unique:food_categories,name'],
        'description' => ['nullable', 'string', 'max:255'],
    ];
}
```

> [!TIP]
> Kalau *Client* ngirim data yang melanggar aturan di atas, Laravel otomatis mencegatnya dan mengembalikan JSON dengan **HTTP Status 422 Unprocessable Entity** beserta detail errornya. Keren kan?

## 3. Meracik Controller

Udah ada "saringan" data dan "satpam" validasi, sekarang kita satukan semuanya di Controller! Bikin Controllernya pakai flag `--api`:

```bash
php artisan make:controller Api/CategoryController --api
```

Buka `app/Http/Controllers/Api/CategoryController.php` dan buat logika CRUD-nya:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest; // Import satpam kita
use App\Http\Resources\CategoryResource;    // Import saringan kita
use App\Models\FoodCategory;

class CategoryController extends Controller
{
    // GET: Ambil semua data
    public function index()
    {
        $categories = FoodCategory::latest()->get();
        // Kirim pakai saringan (Collection untuk banyak data)
        return CategoryResource::collection($categories);
    }

    // POST: Simpan data baru
    // Langsung inject StoreCategoryRequest di sini, otomatis tervalidasi!
    public function store(StoreCategoryRequest $request)
    {
        // $request->validated() cuma ngambil data yang bersih dan aman
        $category = FoodCategory::create($request->validated());

        return response()->json([
            'message' => 'Kategori berhasil dibuat.',
            'data'    => new CategoryResource($category),
        ], 201); // 201 = Created
    }

    // GET: Ambil 1 data spesifik (Route Model Binding)
    public function show(FoodCategory $category)
    {
        return new CategoryResource($category);
    }

    // DELETE: Hapus data
    public function destroy(FoodCategory $category)
    {
        $category->delete(); // Ingat, efek cascadeOnDelete bikin menu makanannya juga ikut hangus

        return response()->json([
            'message' => 'Kategori dan menu di dalamnya berhasil dihapus.',
        ]);
    }
}
```

## 4. Buka Pintu Rute (Routing)

Terakhir, kita daftarkan Controller kita ini ke dunia luar agar bisa dipanggil URL-nya. Buka `routes/api.php` dan tambahkan:

```php
use App\Http\Controllers\Api\CategoryController;

// Rute ajaib apiResource otomatis membuat 5 endpoint sekaligus (index, store, show, update, destroy)
Route::apiResource('categories', CategoryController::class);
```

## Uji Coba Waktunya!

Pastikan server menyala (`php artisan serve`). Buka **Postman** atau **ThunderClient**:

1. **Uji Validasi (POST):**
   * Buat request `POST` ke `http://localhost:8000/api/categories`.
   * Di tab *Headers*, pastikan ada `Accept: application/json`.
   * Tekan *Send* tanpa ngisi apa-apa. Liat keajaiban status **422** dan pesan error dari Laravel!
2. **Uji Simpan (POST):**
   * Di tab *Body*, pilih `raw` lalu `JSON`. Isi dengan `{"name": "Minuman Dingin"}`. *Send!*
3. **Uji Tampil (GET):**
   * Ubah method jadi `GET`, tembak URL yang sama. Kamu akan lihat format tanggal dibuatnya sesuai yang kita atur di Resource tadi.

Selamat! Kamu baru saja mengimplementasikan standar backend profesional. Untuk tugas (*challenge*), coba kamu kerjakan proses CRUD yang sama untuk tabel **FoodItem** ya!
