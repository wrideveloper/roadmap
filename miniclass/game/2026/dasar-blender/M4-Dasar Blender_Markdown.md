### **BAB 1: 3D DALAM GAME**

Penerapan pemodelan tiga dimensi dalam industri permainan diklasifikasikan sebagai elemen fundamental yang berperan sebagai pendukung visual dan performa teknis sebuah perangkat lunak interaktif. Dalam konteks ini, *3D Modelling* bukan sekadar representasi artistik, melainkan sebuah rekayasa aset digital yang harus memenuhi spesifikasi teknis yang ketat (*Technical Requirement*). Proses ini mencakup konversi ide visual menjadi objek tiga dimensi yang mampu berinteraksi dengan sistem fisik, pencahayaan, dan logika permainan di dalam *game engine*.

Penggunaan teknologi 3D menjadi sangat krusial karena mampu menghadirkan imersivity dan realisme visual melalui kedalaman ruang serta perspektif yang akurat. Selain itu, aset 3D menawarkan fleksibilitas animasi yang memungkinkan objek diamati dari segala sudut pandang dalam ruang koordinat kompleks tanpa memerlukan penggambaran ulang secara manual. Dari sisi efisiensi produksi, aset 3D bersifat adaptif karena dapat dimodifikasi secara instan dan digunakan kembali untuk berbagai kebutuhan promosi tanpa menurunkan kualitas orisinalnya. Terakhir, kemampuan aset 3D untuk merespons sistem pencahayaan dinamis dan simulasi fisik membuat 3D semakin banyak digunakan.

### **BAB 2: FUNDAMENTAL DAN SPESIFIKASI GEOMETRI**

Dasar-dasar ruang virtual dan optimasi struktur objek. Fokus pembelajaran mencakup:

- **Efisiensi Topologi:** Teknik penyusunan *quad-based geometry* untuk menjamin deformasi yang akurat pada saat proses animasi dan meminimalisir kesalahan artefak pada permukaan objek.

- **Manajemen Budget Poligon:** Strategi penyeimbangan antara kualitas visual (resolusi tinggi) dan efisiensi performa (perhitungan per frame), yang merupakan kompetensi krusial bagi seorang *3D Generalist*.

- **Koordinat Global dan Lokal:** Pemahaman mendalam mengenai orientasi objek pada sumbu X, Y, dan Z untuk sinkronisasi aset pada tahap integrasi ke dalam sistem mesin gim.

### **BAB 3: ALUR KERJA DAN METODOLOGI PRODUKSI**

Implementasi pembelajaran dilakukan melalui pendekatan prosedural yang selaras dengan standar studio pengembangan gim profesional:

1. **Block-out & Prototyping:** Validasi proporsi dan skala aset terhadap lingkungan permainan.

2. **High-Poly Detail Sculpting:** Penambahan detail mikro untuk kebutuhan ekstraksi data visual (*normal map baking*).

3. **Retopology & UV Layout:** Transformasi model kompleks menjadi model rendah poligon yang optimal tanpa kehilangan detail esensial.

4. **Texturing berbasis PBR (Physically Based Rendering):** Penerapan material yang merespons pencahayaan secara realistis sesuai dengan hukum fisika cahaya.

### **BAB 4: Export 3D Blender**

Dalam melakukan export asset 3D dari Blender, ada beberapa tahapan yang harus diperhatikan untuk menghindari masalah pada saat import ke dalam Unity

1. **Pengecekan Sebelum Export**

Sebelum melakukan proses ekspor, seorang *3D Modeller* wajib melakukan validasi teknis untuk memastikan aset tidak mengalami deformasi atau kesalahan logika saat diimpor ke *game engine*. Tahap pertama adalah **Apply Transformation**, di mana nilai *Location*, *Rotation*, dan *Scale* harus dikembalikan ke titik dasar (0 untuk lokasi/rotasi, dan 1.0 untuk skala). Kegagalan dalam tahap ini sering menyebabkan ukuran objek menjadi tidak konsisten atau rotasi yang tidak beraturan di lingkungan tujuan. Selain itu, pemeriksaan **Orientation of Normals** sangat krusial; seluruh *face* atau bidang harus menghadap ke arah luar untuk menghindari masalah *backface culling* yang menyebabkan bagian objek terlihat transparan.

2. **Optimasi Geometri dan UV**

Langkah berikutnya adalah memastikan bahwa data geometri telah dioptimasi. Hal ini meliputi penghapusan data yang tidak diperlukan seperti *unused materials*, *hidden objects*, atau *double vertices* melalui fitur *Merge by Distance*. Peserta juga harus memastikan bahwa **UV Layout** telah terkunci dan tidak ada *overlapping* pada bagian yang membutuhkan tekstur unik. Jika model ditujukan untuk gim, penggunaan *triangulate modifier* terkadang disarankan untuk memastikan *engine* membaca topologi dengan cara yang sama seperti Blender, meskipun sebagian besar *engine* modern kini dapat melakukan konversi secara otomatis.

3. **Konfigurasi Format Export FBX**

Format `.FBX` merupakan standar industri yang paling umum digunakan karena kemampuannya menyimpan data mesh, material, dan animasi secara sekaligus. Saat mengakses menu *File > Export > FBX*, terdapat beberapa parameter kritis yang harus diatur dalam panel *operator presets*:

- **Selected Objects:** Selalu aktifkan opsi ini agar hanya objek yang dipilih yang diekspor, menghindari masuknya lampu atau kamera ke dalam *engine*.

- **Scale:** Pastikan skala diatur ke *All Local* atau *FBX All* untuk sinkronisasi sistem metrik.

- **Axis Orientation:** Ini adalah bagian terpenting karena perbedaan standar sumbu. Blender menggunakan **Z-Up**, sementara banyak *engine* (seperti Unity) menggunakan **Y-Up**. Pengaturan yang benar pada kolom *Forward* dan *Up* akan mencegah objek tergeletak miring saat diimpor.

- **Manajemen Material dan Tekstur**

Dalam prosedur formal, material yang diekspor dari Blender seringkali hanya membawa data dasar seperti nama material dan penempatan tekstur. Untuk memastikan tekstur terbawa dalam file (terutama pada format `.GLTF` atau `.FBX`), peserta dapat mengubah pengaturan *Path Mode* menjadi Copy dan mengaktifkan ikon *Embed Textures*. Namun, dalam alur kerja profesional, praktisi biasanya lebih memilih untuk mengekspor mesh secara terpisah dan menyusun ulang material secara prosedural di dalam *game engine* untuk mendapatkan kontrol penuh terhadap *shader* dan performa.

- **Troubleshooting**

Tahap validasi di dalam perangkat lunak tujuan. pemeriksaan apakah skala objek sudah sesuai dengan karakter referensi (misal: tinggi pintu standar adalah 2 meter). Jika ditemukan masalah seperti bayangan yang aneh (*shading artifacts*), hal tersebut biasanya berkaitan dengan *Custom Split Normals Data* yang perlu dibersihkan di dalam tab *Object Data Properties* di Blender sebelum diekspor ulang. Pemahaman mendalam tentang siklus ekspor-impor ini akan menjamin efisiensi kerja dan mengurangi frekuensi revisi teknis dalam tim pengembangan.
