# Studi Kasus 2: Relasi Database (Migration & Model)

Studi Kasus 1 kemarin terlalu gampang ya? Kita cuma bikin satu tabel `tasks` yang berdiri sendiri. 

Di dunia nyata, aplikasi hampir selalu butuh tabel yang saling terhubung (berelasi). Di studi kasus kedua ini, kita akan membuat **Sistem Manajemen Menu Restoran**.

Kita butuh 2 tabel yang berelasi:
1. **Kategori Makanan** (Tipe: Makanan Utama, Takjil, Minuman, dll).
2. **Item Makanan** (Nasi Goreng, Es Teh, dll).

**Aturan Mainnya:** Setiap *Item Makanan* WAJIB menempel ke salah satu *Kategori Makanan*. Ini yang kita sebut dengan relasi *One-to-Many* (Satu kategori punya banyak makanan).

## 1. Membuat Migration & Model Kategori

Buka terminalmu dan jalankan *command* pamungkas kita untuk bikin Model sekaligus file Migration-nya:

```bash
php artisan make:model FoodCategory -m
```

Buka file migration yang baru saja dibuat di folder `database/migrations/xxxx_create_food_categories_table.php`, dan ubah method `up()` menjadi:

```php
public function up(): void
{
    Schema::create('food_categories', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique(); // Nama kategori ga boleh kembar
        $table->string('description')->nullable(); // Boleh kosong
        $table->timestamps();
    });
}
```

Buka juga modelnya di `app/Models/FoodCategory.php` dan tambahkan aturan siapa saja yang boleh diisi (*Mass Assignment*):

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// Import HasMany
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodCategory extends Model
{
    protected $fillable = ['name', 'description'];

    // Mendaftarkan relasi: 1 Kategori punya BANYAK FoodItem
    public function foodItems(): HasMany
    {
        return $this->hasMany(FoodItem::class, 'food_category_id');
    }
}
```

## 2. Membuat Migration & Model Item Makanan

Sekarang untuk menu makanannya:

```bash
php artisan make:model FoodItem -m
```

Di file migration `xxxx_create_food_items_table.php`, kita akan mengenalkan fitur **Foreign Key** dan **Cascade Delete**:

```php
public function up(): void
{
    Schema::create('food_items', function (Blueprint $table) {
        $table->id();
        
        // Ini adalah KUNCI RELASI-nya (Foreign Key)
        $table->foreignId('food_category_id')
              ->constrained('food_categories')
              ->cascadeOnDelete(); 
              
        $table->string('name');
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2); // Angka desimal untuk harga
        $table->timestamps();
    });
}
```

> [!TIP]
> **Apa itu `cascadeOnDelete()`?**
> Bayangkan kategori "Takjil" dihapus oleh Admin. Terus nasib menu "Kolak Pisang" dan "Es Buah" yang ada di dalam kategori Takjil gimana dong? Kalau dibiarkan, mereka jadi "anak yatim" (data gantung). Dengan `cascadeOnDelete()`, kalau "Takjil" dihapus, maka "Kolak" dan "Es Buah" akan **otomatis ikut musnah** terhapus dari database!

Jangan lupa buka modelnya di `app/Models/FoodItem.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
// Import BelongsTo
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoodItem extends Model
{
    protected $fillable = [
        'food_category_id',
        'name',
        'description',
        'price',
    ];

    // Mendaftarkan relasi: 1 FoodItem MILIK 1 FoodCategory
    public function category(): BelongsTo
    {
        return $this->belongsTo(FoodCategory::class, 'food_category_id');
    }
}
```

## 3. Eksekusi Migration!

Pondasi database kita sudah kokoh. Saatnya mengirim struktur ini ke database beneran (MySQL/SQLite). Jalankan:

```bash
php artisan migrate
```

Mantap! Meja kerjanya (Database & Model) sudah beres. Di chapter selanjutnya, kita akan buka "pintunya" dengan membuat API Controller biar Frontend bisa mulai mengelola data makanan ini.
