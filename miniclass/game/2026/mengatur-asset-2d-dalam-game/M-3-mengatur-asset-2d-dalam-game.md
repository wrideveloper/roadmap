# Mengatur Komponen Sprite Renderer

![Enter image alt description](../../assets/M-3(2026)/YS3_Image_1.png)

# Perbedaan Pada Sprite Pixel dan non-Pixel

Dalam pengembangan game 2D di Unity, proses *exporting* dari software gambar (menyimpan sebagai `.PNG`) sebenarnya kurang lebih sama. Perbedaan krusialnya justru terletak pada **Import Settings** di dalam Unity itu sendiri setelah aset dimasukkan.

Unity secara default menganggap semua gambar yang masuk adalah gambar resolusi tinggi (non-pixel art) atau tekstur 3D. Jika pengaturan ini tidak diubah, asset pixel art akan terlihat *blurry* (buram) atau rusak.

## **Pengaturan Inspector Pixel dan Non-Pixel**

| Pengaturan Unity | Aset Pixel Art (Retro/Crisp) | Aset Non-Pixel Art (HD/Vector-style) |
|---|---|---|
| Filter Mode | Point (no filter) | Bilinear atau Trilinear |
| Compression | None | Normal Quality atau High Quality |
| Pixels Per Unit (PPU) | Harus konsisten (misal: 16, 32, 64) | Biasanya dibiarkan default (100) |

# 

# 

# Slicing dan Nine-Slice

![Enter image alt description](../../assets/M-3(2026)/Utb_Image_3.png)

Dalam pembuatan game (terutama 2D atau pixel art), gambar yang dimasukkan ke dalam mesin game (seperti Unity) sering kali tidak dimasukkan satu per satu, melainkan digabung dalam satu gambar besar. Inilah yang disebut **Sprite Sheet**.

Berikut adalah penjelasan mengapa gambar tersebut harus di-*slice*

### **1. Slicing (Memotong Lembaran Stiker)**

Bayangkan kamu membeli **satu lembar besar kertas stiker** yang berisi 10 gambar karakter yang sedang berlari dengan pose berbeda-beda.

Jika kamu ingin menempelkan satu pose saja ke bukumu, kamu tidak mungkin menempelkan seluruh lembaran besar itu sekaligus, kan? Kamu harus mengambil gunting dan **memotong (slicing)** stiker itu kotak-kotak agar setiap pose menjadi stiker individu.

Di *game engine*, prosesnya sama persis:

- Saat kamu memasukkan *sprite sheet* (lembaran stiker), mesin game melihatnya sebagai satu gambar raksasa.

- Kamu harus melakukan **Slice** agar mesin game tahu letak batas tiap-tiap gambar (misalnya memotongnya menjadi kotak berukuran 32x32 pixel).

- Setelah di-*slice*, barulah game bisa mengambil potongan pertama, lalu menggantinya dengan potongan kedua secara cepat untuk menciptakan **animasi berjalan**.

### **2. Nine-Slice (Jurus Anti-Melar untuk Tombol & UI)**

Jika *slicing* biasa digunakan untuk karakter dan animasi, **Nine-Slice** (potong sembilan) khusus digunakan untuk antarmuka pengguna (UI), seperti tombol menu, papan skor, atau kotak dialog (pop-up).

Bayangkan sebuah gambar kotak dialog yang memiliki bingkai hiasan cantik di keempat sudutnya.

- **Jika tanpa Nine-Slice (Scaling Biasa):** Saat kamu menarik kotak itu agar lebih panjang untuk menampung teks yang banyak, seluruh gambar akan ditarik paksa seperti karet gelang. Akibatnya, bingkai hiasan di sudutnya akan ikut melar, gepeng, memanjang, dan menjadi sangat jelek.

- **Dengan Nine-Slice:** Kamu memotong kotak dialog tersebut menjadi sebuah "papan tic-tac-toe" yang menghasilkan **9 bagian** (4 sudut, 4 sisi luar, dan 1 bagian tengah).

- Mesin game akan **mengunci ke-4 sudut** agar ukurannya tetap dan tidak boleh melar.

- Yang boleh melar atau berulang (*tiling*) hanyalah bagian sisi dan tengahnya saja.

- Hasilnya? Tombol bisa diperpanjang atau diperlebar sesuka hati, tapi sudutnya tetap tajam dan rapi!

# Aturan Khusus Pixel Art

![Enter image alt description](../../assets/M-3(2026)/kgi_Image_4.png)

### **Tidak disarankan menggunakan Transform.Scale di Pixel Art, kenapa?**

**1. Menghindari "Mixels" (Mixed Pixels)** Ini adalah dosa terbesar dalam estetika pixel art. Dalam dunia game retro sejati, ukuran 1 "titik pixel" harus konsisten dan sama persis di seluruh benda di dalam game (karakter, tanah, musuh, peluru).

- Jika kamu menggunakan `Transform.Scale` menjadi `1.5` pada karakter utama, maka "titik-titik pixel" pembentuk karakter utama akan terlihat 50% lebih besar/bengkak daripada titik pixel pada tanah pijakannya.

- Estetika gamenya akan hancur dan terlihat murah karena ukuran pixelnya belang-belang (*mixel*).

**2. Mencegah Distorsi dan Jittering (Getar)** Layar monitormu terdiri dari pixel-pixel fisik yang absolut (tidak bisa dibelah). Jika kamu men-scale karakter pixel art sebesar `1.25x`, mesin game akan kebingungan saat harus menggambar "seperempat pixel". Akibatnya? Saat karaktermu bergerak, garis tepi gambarnya akan terlihat menebal, menipis secara acak, atau bergetar (*jittering*) karena sistem mencoba membulatkan posisi pecahan tersebut ke pixel layar terdekat.

**3. Merusak Perhitungan Pixel-Perfect Camera** Unity memiliki alat khusus bernama *Pixel Perfect Camera* agar game 2D retro terlihat renyah dan tajam. Kamera ini menggunakan patokan **PPU (Pixels Per Unit)** untuk mengunci pergerakan *sprite* tepat pada grid virtual. Mengubah `Transform.Scale` secara sembarangan akan mengacaukan kalkulasi matematika kamera ini.

Oleh karena itu, cara yang benar untuk membuat objek pixel art lebih besar/kecil di Unity adalah dengan mengubah angka **PPU**. Jika kamu ingin sebuah gambar terlihat setengah kali lebih kecil di dalam *scene*, kamu **menggandakan** nilai PPU-nya (karena artinya gambar tersebut kini dipadatkan ke dalam satu unit ruang).

# Tilemaps

![Enter image alt description](../../assets/M-3(2026)/jBg_Image_5.png)

Bayangkan Tilemap seperti **bermain Lego** atau **menggunakan stempel**. Daripada kamu menaruh gambar tanah, rumput, dan dinding satu per satu secara manual ke dalam layar, kamu membuat sebuah "Buku Stempel" (Tile Palette). Nanti, kamu tinggal memilih gambar tanah di buku itu, lalu men-stempelnya berkali-kali ke layar (Kanvas/Tilemap) untuk membentuk sebuah dunia.

Setelah mengatur inspector dan melakukan slicing, kalian bisa membuat tilemaps

### **Tahap 1: Membuat "Buku Stempel" (Tile Palette)**

Kita butuh wadah untuk menaruh potongan-potongan stempel tadi agar mudah dipilih.

1. Di menu atas Unity, klik **Window > 2D > Tile Palette**. Sebuah jendela baru akan muncul.

2. Di jendela Tile Palette, klik tulisan **Create New Palette**.

3. Beri nama (misalnya "Tanah dan Lingkungan"), lalu klik **Create**. Unity akan memintamu memilih folder untuk menyimpan file *Palette* ini (buat folder baru bernama "Tiles" agar rapi).

4. **Isi Tintanya:** Tarik gambar *sprite sheet* yang sudah kamu potong di Tahap 2 ke dalam jendela Tile Palette.

5. Unity akan memintamu lagi memilih folder. Kali ini, Unity sedang mengubah gambar biasa menjadi format "Tile" (stempel yang siap pakai). Simpan di folder yang sama.

### **Tahap 2: Menyiapkan "Kanvas" (Tilemap di Scene)**

Tinta sudah siap, sekarang kita pasang kanvas kosongnya di dalam game.

1. Di jendela **Hierarchy** (daftar objek di sebelah kiri), klik kanan pada area kosong.

2. Pilih **2D Object > Tilemap > Rectangular**.

3. Perhatikan di Hierarchy, Unity secara otomatis membuat objek bernama **Grid**, dan di dalamnya ada "anak" bernama **Tilemap**.

- *Grid* adalah penggaris virtualnya, sedangkan *Tilemap* adalah kertas kanvasnya.

### **Tahap 3: Waktunya Menggambar!**

Ini bagian yang paling menyenangkan:

1. Klik objek **Tilemap** di Hierarchy agar aktif.

2. Buka kembali jendela **Tile Palette**.

3. Pastikan alat **Paintbrush (Ikon Kuas)** di bagian atas Tile Palette sedang aktif.

4. Klik salah satu gambar tanah di Tile Palette (kotak tanahnya akan tersorot).

5. Arahkan kursormu ke layar permainan (**Scene View**), klik dan tahan mouse, lalu sapukan! Tanah akan langsung tergambar mengikuti garis *grid* dengan rapi.

# Implementasi UI

**Topik Utama:** Pipeline Aset Visual, Standardisasi Resolusi, dan Integrasi UI Scripting.

# Cara Menata UI yang Baik dan Benar (Insyaallah) 

## Setup Workspace

1. Buat scene baru di Unity kamu, caranya ? klik kanan di folder scenes -> create -> scenes

![Enter image alt description](../../assets/M-3(2026)/lk4_Image_6.png)

2. Lalu kita butuh aset untuk mulai implementasi UI. Ini adalah resource utama kalian. Export jadi PNG. Untuk ukuran button biasanya aku pake 64 x 64, dan ukuran icon 32 x 32.

![Enter image alt description](../../assets/M-3(2026)/Sgm_Image_7.png)

3. Back to unity. Buat folder baru di unity. Biar apa? Biar rapi cuy

![Enter image alt description](../../assets/M-3(2026)/Kut_Image_8.png)

![Enter image alt description](../../assets/M-3(2026)/22o_Image_9.png)

4. Dah masukin asset UI kalian di folder UI. Jadikan single karena mereka sendirian. Bukan animasi

![Enter image alt description](../../assets/M-3(2026)/4Rb_Image_10.png)

5. Lalu untuk button kita akan melakukan slicing. Caranya klik button

![Enter image alt description](../../assets/M-3(2026)/sm0_Image_11.png)

6. Terus di inspector tekan sprite editor

![Enter image alt description](../../assets/M-3(2026)/XVC_Image_12.png)

7. Nanti muncul seperti ini

![Enter image alt description](../../assets/M-3(2026)/28s_Image_13.png)

8. Border nya set seperti ini ½ dari tinggi / panjang PNG

![Enter image alt description](../../assets/M-3(2026)/HMs_Image_14.png)

9. Kalo sudah pencet apply

![Enter image alt description](../../assets/M-3(2026)/1Zj_Image_15.png)

10. Oke sekarang buat game object baru untuk wadah kita menata UI. Klik kanan di scene -> UI (Canvas) -> Canvas

![Enter image alt description](../../assets/M-3(2026)/tMQ_Image_16.png)

11. Setelah itu akan muncul Canvas

![Enter image alt description](../../assets/M-3(2026)/WeQ_Image_17.png)

12. Lihat di inspector ganti scale mode menjadi scale with screen size dan ubah reference solution nya menjadi 1920 x 1080

![Enter image alt description](../../assets/M-3(2026)/S3c_Image_18.png)

![Enter image alt description](../../assets/M-3(2026)/VhU_Image_19.png)

13. Di dalam canvas_template buat empty game object bernama container

![Enter image alt description](../../assets/M-3(2026)/D6D_Image_20.png)

14. Lihat lagi di inspector ubah anchor preset nya menjadi stretch

Tips : biar langsung berubah tekan shift + alt

![Enter image alt description](../../assets/M-3(2026)/YmW_Image_21.png)

15. Boleh ditambahkan padding dengan edit Left Right Top Bottom di container

![Enter image alt description](../../assets/M-3(2026)/yyd_Image_22.png)

## Komponen Minimal

Sebelum itu ada beberapa component yang memudahkan kita untuk mengatur UI

1. Content size fitter digunakan agar otomatis fit dengan game object

Kalo ga pake kita harus stretch manual cuy

|  |  |
|---|---|
|  |  |

2. Horizontal layout group ya sesuai namanya nata object biar otomatis horizontal gausah nata2 in satu2 

![Enter image alt description](../../assets/M-3(2026)/0C2_Image_23.png)

3. Vertical layout group nata object otomatis horizontal

![Enter image alt description](../../assets/M-3(2026)/19i_Image_24.png)

## Menata Time

1. Duplikat canvas template dan rename jadi canvas_main_menu

![Enter image alt description](../../assets/M-3(2026)/qdO_Image_25.png)

2. Di dalam container buat canvas (ui) -> button

![Enter image alt description](../../assets/M-3(2026)/WEH_Image_26.png)

3. Di inspector ganti ke sprite button yang kita punya

![Enter image alt description](../../assets/M-3(2026)/Ef3_Image_27.png)

4. Nah button kita akan terlihat seperti ini

![Enter image alt description](../../assets/M-3(2026)/B24_Image_28.png)

5. Untuk mengganti teks klik teks pada hirarki button_play

![Enter image alt description](../../assets/M-3(2026)/z82_Image_29.png)

6. Lalu ganti teks nya , kalian juga bisa mengatur besar kecil teks, dll

![Enter image alt description](../../assets/M-3(2026)/1JI_Image_30.png)

7. Untuk mengganti warna klik button_play dan mengganti warna nya di color

![Enter image alt description](../../assets/M-3(2026)/jt6_Image_31.png)

8. Tadaa button nya sumdah

![Enter image alt description](../../assets/M-3(2026)/zbR_Image_32.png)

**Kita lanjut membuat button setting di bawahnya play. ****Ingat tadi kita punya component vertical layout group.**

9. Pertama tama kita buat parent dulu di button_play , namain dengan button_grid

![Enter image alt description](../../assets/M-3(2026)/i8T_Image_33.png)

10. Di button_grid tambahkan component vertical alyout group uncheck semuanya

![Enter image alt description](../../assets/M-3(2026)/sdK_Image_34.png)

11. Tambahkan juga content size fitter dan ubah menjadi preferred size

![Enter image alt description](../../assets/M-3(2026)/RG1_Image_35.png)

12. Lalu yaudah tinggal di copy aja

![Enter image alt description](../../assets/M-3(2026)/Drk_Image_37.png)

13. Nah coba atur agar jadi seperti ini

![Enter image alt description](../../assets/M-3(2026)/eRX_Image_39.png)

## Sambungkan ke Scene GamePlay

1. Add scene UI dan game play. Drag scene gameplay ke hierarchy

![Enter image alt description](../../assets/M-3(2026)/2AF_Image_40.png)

2. FIle -. Build profile -> scene list -> add open scene

![Enter image alt description](../../assets/M-3(2026)/UQf_Image_42.png)

3. Create empty game dan namai dengan game manager ini kaya folder gitu , semua game manager taruh situ

![Enter image alt description](../../assets/M-3(2026)/f9m_Image_43.png)

4. Crate empty di dalam game manager namai dengan button_manager atau terserahlah dan new script

![Enter image alt description](../../assets/M-3(2026)/mXQ_Image_45.png)

5. Nih script buat button play

```
using UnityEngine;
using UnityEngine.SceneManagement;

public class buttonManager : MonoBehaviour
{
  public void Play()
    {
        SceneManager.LoadScene("Part 3");
    }
}
```
6. Oke sekarang ke button_play lagi lalu tambah on clik

![Enter image alt description](../../assets/M-3(2026)/p3d_Image_46.png)

![Enter image alt description](../../assets/M-3(2026)/Sj3_Image_47.png)

7. Drag game object button manager ke none (object)

![Enter image alt description](../../assets/M-3(2026)/YRw_Image_48.png)

8. Lalu buttonmanager -> play

![Enter image alt description](../../assets/M-3(2026)/vSF_Image_49.png)

# 
