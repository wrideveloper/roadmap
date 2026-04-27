# Studi Kasus 1

## "Simple Task Tracker"

Studi Case Kali ini masi sama dengan case yang lalu namun dengan technology yang berbeda yaitu Laravel 


### Struktur Data (Model)

- `id`: Integer

- `title`: String

- `status`: Boolean (completed/pending)


## Migrasi Database

Pertama tama, kita perlu membuat tabel untuk menyimpan data tugas. Kita bisa menggunakan perintah `php artisan make:migration` untuk membuat file migrasi. 

```bash
php artisan make:migration create_tasks_table
```

kemudian kita akan membuka file migrasi tersebut dan menambahkan kode berikut:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->boolean('status')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
```


## Migrasi Ke Database

```bash
php artisan migrate
```

## Sekarang Waktunya Membuat Model

```bash
php artisan make:model Task
```

## <a href="https://imgflip.com/i/aq8xbt"><img src="https://i.imgflip.com/aq8xbt.jpg" title="made at imgflip.com"/></a><div><a href="https://imgflip.com/memegenerator"></a></div>