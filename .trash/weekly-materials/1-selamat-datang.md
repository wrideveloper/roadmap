---
marp: true
theme: uncover
class: invert
headingDivider: "2"
---

# Selamat Datang di Game Development
![](https://ichef.bbci.co.uk/news/480/cpsprodpb/3002/live/9a436380-435a-11ef-b362-7fae70c22de6.jpg.webp)

## Apa Itu?
> **Game Development** adalah aktivitas pengembangan permainan yang meliputi perencanaan, perancangan, pembuatan, dan perilisan suatu permainan.

Jadi intinya, gamedev itu adalah kegiatan membuat game dari perencanaan sampai keadaan game dapat dimainkan oleh player.
## Tapi ... Apa Itu Game?
>Gak usah panjang lebar, Game adalah PERMAINAN

Game adalah permainan; dan orang yang membuat permainan—apa pun jenisnya—adalah game developer.

## Game Bukan Cuma Digital?
![bg opacity:.5](https://i0.wp.com/dungeonsanddragonsfan.com/wp-content/uploads/2024/04/dnd-new-players-handbook-2024-may-14.png?resize=800%2C450&ssl=1)

---
![bg right](https://letsplayindonesia.com/wp-content/uploads/2024/12/IMG_1026-scaled-e1734441799729.jpg)

Game juga bisa dibuat dalam media tradisional, seperti kartu atau papan.
Bahkan, bisa juga dibuat tanpa media apa pun (misalnya permainan petak umpet).
## Industri Game di Indonesia

![bg opacity:.5](miniclass/game/assets/WhatsApp%20Image%202025-06-03%20at%2011.57.41_30b71af9.jpg)

---

![bg right](https://allcorrectgames.com/wp-content/uploads/2024/05/Indonesias-Largest-Gaming-Companies.png)

*Perpres Nomor 19 Tahun 2024* menandakan komitmen pemerintah untuk mendukung percepatan industri game. 

>\**di kiri ada contoh studio game lokal*\*

---

![bg opacity:.2](miniclass/game/assets/WhatsApp%20Image%202025-06-03%20at%2012.39.52_cc486ae7.jpg)

Banyak program nasional yang digelar atau didukung oleh pemerintah, di antaranya yakni:
- Talent Scouting Academy: GameFest
- Indonesia Game Developer Exchange: Bootcamp
- GameSeed
- GooglePlay X Unity Game Developer Training
- dan masih banyak lagi

###### \**coba cari lagi sendiri*\*

## Game Engine
>In the beginning there was nothing, which exploded. Then I booted up the engine.

---

>*Loh heh, memangnya kita anak mesin?*

***Game engine* adalah *framework* yang menenagai pembuatan game. Dari render grafik sampai simulasi fisika, game engine lah yang mengatur[^2].** 

>*Studio film dengan set, lampu, dan kamera yang sudah ada di dalamnya, lalu kita bawakan naskah dan aktor (aset dan logika).*

---

Bikin game sebenarnya tidak perlu game engine, tetapi kita harus menyiapkan banyak pengaturan untuk merender grafik sampai akses storage untuk audio dan gambar. 

>*ribet deh kalau enggak.*

---

### Game Engine Ada Banyak

---

![bg left](https://www.vanas.ca/images/blog/best-video-game-engines-vanas.jpg)

Dependensi node banyak? Game engine gak kalah banyaknya.
- Godot
- Unity
- Unreal Engine
- Construct
- GameMaker
- Love2D
- Twine
- *bikin sendiri*

---

### Harus Pilih yang Mana?
![bg opacity:.5](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGxQzpuCX4ZLArfMu0o-WzWia-t7h29mmhLg&s)

---

Jawaban 1:
**bebas.**

Jawaban 2:
**cari yang komunitasnya besar**
agar mudah cari tutorial dan diskusi.

>Unity, Unreal Engine, dan Godot
<br>

Jawaban 3:
**ngikut kemampuan device**

>Godot

## Role dan Talent
>Seperti film, game melibatkan banyak ahli lintas bidang.

---

### Role dalam Game Development
>*Game itu bikinnya susah btw*

**Mirip di web development, game development ada banyak role yang diperlukan.**

**Dalam game development, kebutuhan skill developer jauh lebih beragam. Ada programmer (teknis), artist (art), producer (manajemen), musik, dst.**

---

>Tapi yang paling penting itu ada tiga:
>- Designer
>- Programmer
>- Artist

---

### Game Designer
>ini beda sama UI/UX atau graphic designer, ya ges ya

---

Orang yang merancang konsep, mekanisme, dan pengalaman bermain dari sebuah video game. Mereka bertanggung jawab untuk menciptakan struktur, aturan, dan gameplay yang menarik dan menyenangkan bagi pemain[^1].

---

![bg left](https://www.nme.com/wp-content/uploads/2020/09/Super-Mario-Bros.jpg)

- Kenapa Mario makan jamur jadi kuat?
- Kenapa Mario menyerang musuh dengan melompat lalu menindih?
- Kenapa Mario jalannya ke kanan-kiri?

Itu semua keputusan *game designer*. 

---

![bg right](https://supercell.com/images/18a9078361acbe63c736e523e183ee30/SUP3533_ClashonPC_October_2023_1920x1080.webp)

- Kenapa goblin bakal nyerang bangunan selain pertahanan? 
- Kenapa PEKKA kelemahannya adalah Tesla Tower?

Designer bertanggung jawab membuat game seru dan seimbang dengan menetapkan aturan seperti di atas.

---

Game Designer merancang aturan main (skill, health, ATK speed, dsb.), mekanisme (bisa lompat, bisa tembak, bisa melee, dst.), genre (RPG, FPS, open-world), dan lain-lain untuk menciptakan rancangan game yang seru bagi target audiensinya.

Rancangan ini ditulis di dalam dokumen bernama *Game Design Document* untuk jadi acuan developer lain saat implementasi.

## Game Programmer
>kalau gak ada ini, game design-nya cuma jadi angan-angan

---

Orang mengimplementasikan rancangan atau konsep menjadi program yang bisa dimainkan. Mereka membuat ide pada dokumen menjadi kenyataan[^1].

---

![bg left](https://assets.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/indizone/2021/06/03/EnsMVYy/riot-games-konfirmasi-valorant-bakal-hadir-di-platform-mobile-kapan58.jpg)

*Designer* bilang akurasi tembakan harus jelek kalau player bergerak? Berarti *programmer* harus bikin kode *if-else* yang bisa menerapkan aturan itu. 

---

![bg right](https://forum-cfx-re.akamaized.net/original/5X/2/6/e/9/26e96d819e46d9b5e38e54c110a850fa0d06a7b2.jpeg)

- Ada sistem wanted? Programmer harus bisa bikin *trigger* kondisi kapan bintang bisa naik. 
- Pada setiap level, berapa kekuatan dan jumlah polisi yang mengejar? Programmer harus bisa bikin konfigurasi ini.

---

![bg opacity:.5](https://i.imgflip.com/27q03d.jpg?a485784)

> “If debugging is the process of removing software bugs, then programming must be the process of putting them in.”  
> — _Edsger W. Dijkstra_

**Kalau mau jadi ini, jangan malas debugging :)**

## Game Artist
>kalau gak ada ini, masih bisa bikin game stickman :)

---

Peran yang menentukan impresi awal game kita.

 Orang yang bertanggung jawab atas aspek visual dari video game, seperti desain karakter, lingkungan, skema warna, dan animasi[^1].

---

![bg left](https://preview.redd.it/say-what-you-want-about-the-game-but-mgsv-had-the-most-v0-npfrhsg2zdac1.jpg?width=640&crop=smart&auto=webp&s=a98898221ada7e4286facef490dec16dbcc5fc5a)

Seperti *game designer*, *game artist* harus mendokumentasikan ketetapan rancangannya dalam dokumen: *Art Design Document*.

Isinya bisa meliputi desain karakter, skema warna, gaya gambar dan animasi, dan sebagainya.

---

![bg right](miniclass/game/assets/WhatsApp%20Image%202025-06-03%20at%2021.14.28_13563f2f.jpg)

Artist bukan cuma menggambar di bidang dua dimensi.

Artis juga membuat model 3D bahkan desain icon sampai UI.

---

![bg left](https://assetstorev1-prd-cdn.unity3d.com/key-image/ddd6059d-a54e-4353-bb25-1d22cf4cc641.jpg)

*Artist* juga berkoordinasi dengan *programmer* mengenai *import* dan *layout* aset di game engine.

## Kesimpulan
>Game development bukan cuma soal bikin game, tapi menciptakan pengalaman bermain yang menyenangkan dan bermakna melalui kolaborasi antara ide, teknologi, dan seni.

[^1]: https://www.futurelearn.com/info/courses/how-to-start-your-career-in-games-development/0/steps/57132
[^2]: https://www.arm.com/glossary/gaming-engines#:~:text=A%20gaming%20engine%20is%20a%20software%20development,games%20across%20a%20variety%20of%20programming%20languages.&text=Early%20video%20games%20were%20developed%20with%20their,engines%2C%20each%20specifically%20designed%20for%20one%20game.