# 🔧 Dasar Unity
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Unity_2021.svg/320px-Unity_2021.svg.png" style="background: white; padding:2rem" />

Unity adalah mesin permainan lintas platform yang dikembangkan oleh Unity Technologies, pertama kali diumumkan dan diluncurkan pada bulan Juni 2005 di Apple Inc. Apple Worldwide Developers Conference sebagai mesin permainan eksklusif Mac OS X Pada 2018, mesin telah diperpanjang untuk mendukung lebih dari 25 platform[^1].

Mesin ini dapat digunakan untuk membuat permainan tiga dimensi, dua dimensi, realitas virtual (VR), dan augmented reality, serta Simulasi dan pengalaman lainnya. Mesin ini telah diadopsi oleh industri di luar permainan video, seperti Film, Otomotif, Arsitektur, Teknik, dan Konstruksi.

[^1]:https://id.wikipedia.org/wiki/Unity_(mesin_permainan)

## Antarmuka
<img src="https://docs.unity3d.com/2022.3/Documentation/uploads/Main/using-editor-window.png">

- ***(A)*** **Toolbar** - Menyediakan akses ke akun Unity dan layanan Unity Cloud. Terdapat juga kontrol untuk Play mode; histori Undo; Unity Search; menu Visibility Layer; dan Editor Layout.
<!-- - The Toolbar provides access to your Unity Account and Unity Cloud Services. It also contains controls for Play mode; Undo history; Unity Search; a layer visibility menu; and the Editor layout menu. -->
- ***(B)*** **Hierarchy Window** - Menyediakan akses ke semua [GameObject](#game-object) di [Scene](#scene) dengan menyusunnya dalam hierarki. Hierarki (*hierarchy*) menunjukkan struktur hubungan antara *GameObject* satu dengan yang lain.
<!-- - The Hierarchy window is a hierarchical text representation of every GameObject in the Scene. Each item in the Scene has an entry in the hierarchy, so the two windows are inherently linked. The hierarchy reveals the structure of how GameObjects attach to each other. -->
- ***(C)***  **Game View** - Menunjukkan simulasi game kita melalui GameObject *Camera*. Simulasi dimulai ketika kamu menekan tombol *Play*.
<!-- - The Game view simulates what your final rendered game will look like through your Scene Cameras. When you click the Play button, the simulation begins. -->
- ***(D)*** **Scene View** - Menunjukkan Scene dan memungkinkan kita untuk mengedit Scene tersebut. *Scene View* dapat menampilkan 3D atau 2D perspektif, bergantung pada jenis *Project* yang kita kerjakan.
<!-- - The Scene view allows you to visually navigate and edit your Scene. The Scene view can display a 3D or 2D perspective, depending on the type of Project you are working on. -->
- ***(E)*** **Overlays** - Menyediakan alat untuk memanipulasi Scene view dan GameObjects yang ada di dalamnya.
<!-- - Overlays contain the basic tools for manipulating the Scene view and the GameObjects within it. You can also add custom Overlays to improve your workflow. -->
- ***(F)*** **Inspector Window** - Menunjukkan semua properti GameObject yang dipilih. Properti bisa berbeda untuk tiap-tiap tipe GameObject. Layout dan konten Inspector window berubah setiap kali kita memilih GameObject yang berbeda. ^1212
<!-- - The Inspector window allows you to view and edit all the properties of the currently selected GameObject. Because different types of GameObjects have different sets of properties, the layout and contents of the Inspector window change each time you select a different GameObject. -->
- ***(G)*** **Project Window** - Menunjukkan semua *Asset* yang tersedia untuk digunakan dalam Project kita. Ketika kita mengimpor *Asset* ke dalam Project kita, mereka akan muncul di sini.
<!-- - The Project window displays your library of Assets that are available to use in your Project. When you import Assets into your Project, they appear here. -->
- ***(H)*** **Status Bar** - Menunjukkan notifikasi tentang semua proses Unity dan akses cepat untuk alat dan pengaturan yang berkaitan.
<!-- - The status bar provides notifications about various Unity processes, and quick access to related tools and settings. -->

Referensi[^5].

## Unsur Dasar Unity
### Game Object
Semua objek dalam game kita adalah GameObject, seperti karakter, item, cahaya, dan *special effect*. Namun, GameObject tidak bisa melakukan apa-apa sendiri; kita perlu memberikan properti sebelum GameObject bisa menjadi karakter, lingkungan, atau *special effect*.

Untuk memberikan sebuah GameObject bisa menjadi cahaya, pohon, atau kamera, kita harus menambahkan [Component](#component) ke GameObject tersebut. Kita dapat menambahkan satu atau lebih Component tergantung GameObject seperti apa yang ingin kita buat. Salah satu contohnya adalah kita dapat menambahkan Component *SpriteRenderer* ke dalam GameObject dari seorang karakter[^2].

<img src="https://docs.unity3d.com/530/Documentation/uploads/Main/GameObjectCubeExample.png" height="300rem">

### Component
Kita dapat menggunakan berbagai macam Component untuk mengubah atau menambah fungsionalitas suatu GameObject. Untuk menambahkan Component, kita dapat menggunakan [Inspector Window](#antarmuka).

<img src="https://docs.unity3d.com/510/Documentation/uploads/Main/GameObject-maincamera.png" height="300rem">

### Script.
Selain Component, kita dapat menambahkan [Script](#script) untuk mengubah fungsionalitas suatu GameObject[^3].

Untuk membuat Component dari Script, kita perlu menulis script dan kemudian menambahkannya ke GameObject. Script yang ditambahkan ke GameObject akan muncul di [Inspector Window](#antarmuka) karena Unity Editor menganggapnya seperti Component *built-in*[^4].

<img src="/miniclass/game/assets/image.png" height="300rem">

### Scene
*Scene* adalah tempat di mana semua objek GameObject berada. Scene adalah Asset yang berisi semua bagian game kita, seperti karakter, lingkungan, dan *special effect*. Scene dapat disebut juga dengan *World* atau *Level*. Segala perubahan yang kita lakukan terhadap GameObject di dalam Scene akan disimpan ke dalam file Asset dari Scene tersebut. Scene memungkinkan kita membuat macam-macam level dengan pengaturan GameObject; karakter, item, rintangan, dan UI yang berbeda. 

<img src="https://unity-connect-prd.storage.googleapis.com/20210901/videos/5b2b7a04-c9f6-4f6a-8cd2-79c3a246c493_Editor_FrameSelect_v2/poster/origin/thumb1.png" height="300rem">

### Prefab
Prefab memungkinkan kita untuk membuat, mengatur, dan menyimpan sebuah GameObjecr beserta semua Component, nilai properti, dan child GameObject sebagai Asset. Dengan menjadikan suatu GameObject sebagai Asset, kita dapat menggunakannya di banyak Scene yang berbeda. Prefab juga berfungsi sebagai template atau *blueprint* untuk menciptakan instance GameObject di dalam Scene.

<img src="https://unity-connect-prd.storage.googleapis.com/20190603/learn/images/0c825ac5-5d17-45d7-9d0f-ed1764b1ad2d_prefabs___01.png">

[^5]:https://docs.unity3d.com/2022.3/Documentation/Manual/UsingTheEditor.html
[^2]:https://docs.unity3d.com/2022.3/Documentation/Manual/GameObjects.html
[^3]:https://docs.unity3d.com/2022.3/Documentation/Manual/UsingComponents.html
[^4]:https://docs.unity3d.com/2022.3/Documentation/Manual/CreatingComponents.html
