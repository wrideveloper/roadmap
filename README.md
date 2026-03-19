# Roadmap Workshop Riset Informatika

Repository ini berisi roadmap pembelajaran yang digunakan pada miniclass Workshop Riset Informatika.
Roadmap ini dibuat untuk memudahkan peserta serta mentor dalam memahami materi yang akan dipelajari.

## Panduan Kontribusi Materi

### Prerequisite (prasyarat)

Sebelum kita bisa melakukan local development kita memerlukan JavaScript runtime diantaranya adalah(salah satu saja):

#### Bun

Windows:

powershell

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

MacOS & Linux:

```bash
curl -fsSL https://bun.com/install | bash
```

Package Manager:

npm:

```
npm install -g bun # the last `npm` command you'll ever need
```

untuk instalasi detail bisa lihat [link](https://bun.com/docs/installation)

#### NodeJS + pnpm

- Instalasi NodeJS bisa lihat dari [link](https://nodejs.org/en/download)

- pnpm

Windows:

powershell

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

MacOS & Linux (POSIX systems):

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

atau

```bash
wget -qO- https://get.pnpm.io/install.sh | sh -
```

detail instalasi pnpm bisa lihat [link](https://pnpm.io/installation)

### Local Development cycle

1\. clone / Fork Repository ini (agar bisa membuat PR(Pull Request) disarankan melakukan fork)

```bash
git clone https://github.com/wrideveloper/roadmap.git
cd roadmap
```

2\. install dependencies

bun (disarankan)

```bash
bun install
```

atau pnpm:

```bash
pnpm install
```

3\. mulai local development

bun

```
bun run docs:dev
```

pnpm

```
pnpm run docs:dev
```

buka browser dan buka localhost URL yang diberikan pada terminal (biasanya `http://localhost:3000` or `http://localhost:5173`)

### 1. Struktur Folder Materi

Setiap miniclass memiliki folder tersendiri di dalam direktori `miniclass/`. Berikut adalah struktur folder untuk masing-masing miniclass:

```
miniclass/
├── backend/           # Materi Backend Development
├── frontend/
│   ├── web/          # Materi Web Development
│   └── mobile/       # Materi Mobile Development
├── game/             # Materi Game Development
├── ui-ux/            # Materi UI/UX Design
└── cyber/            # Materi Cyber Security
```

### 2. Menambahkan Materi Baru

#### Aturan Penamaan Folder

- **Buat 1 folder untuk 1 pertemuan/topik materi**
- Gunakan nama folder yang deskriptif dan menggunakan format kebab-case
- Contoh: `pengenalan-html`, `express-js`, `flutter-widgets`

#### Lokasi Penyimpanan Materi

**Untuk Backend, Game, UI/UX, dan Cyber:**

```
miniclass/{nama-miniclass}/{topik}/
└── nama-materi.md
```

Contoh:

```
miniclass/backend/fundamental/
├── pendahuluan.md
├── database.md
└── mysql.md
```

**Untuk Frontend:**

```
miniclass/frontend/{web|mobile}/{topik}/
└── nama-materi.md
```

Contoh:

```
miniclass/frontend/web/html/
├── pengenalan-html.md
└── semantic-html.md

miniclass/frontend/mobile/widget-flutter/
└── widget.md
```

### 3. Penyimpanan Assets

#### Untuk Backend, Game, UI/UX, dan Cyber

Simpan assets di folder `assets/` pada **root folder miniclass**:

```
miniclass/{nama-miniclass}/assets/
└── {nama-topik}/
    ├── gambar1.png
    └── gambar2.jpg
```

Contoh:

```
miniclass/backend/assets/
└── database/
    ├── erd-diagram.png
    └── sql-query.png
```

#### Untuk Frontend (Web & Mobile)

Simpan assets di folder `assets/` pada **masing-masing peminatan**:

```
miniclass/frontend/{web|mobile}/assets/
└── {nama-topik}/
    ├── gambar1.png
    └── gambar2.jpg
```

Contoh:

```
miniclass/frontend/web/assets/
└── html/
    ├── html-structure.png
    └── html-tags.png

miniclass/frontend/mobile/assets/
└── flutter-widgets/
    ├── widget-tree.png
    └── stateless-vs-stateful.png
```

### 4. Menambahkan Sidebar

Setelah membuat materi, Anda perlu menambahkan link materi ke sidebar agar dapat diakses.

#### Lokasi File Sidebar

File konfigurasi sidebar berada di direktori `.vitepress/sidebars/`:

```
.vitepress/sidebars/
├── backend.ts           # Sidebar Backend
├── frontend-web.ts      # Sidebar Frontend Web
├── frontend-mobile.ts   # Sidebar Frontend Mobile
├── game.ts             # Sidebar Game Development
├── ui-ux.ts            # Sidebar UI/UX Design
└── cyber.ts            # Sidebar Cyber Security
```

#### Format Penambahan Sidebar

Buka file sidebar yang sesuai, lalu tambahkan entry baru dengan format:

```typescript
{
  text: "Nama Topik",
  collapsed: false, // atau true jika ingin collapsed default
  items: [
    {
      text: "Judul Materi",
      link: "/miniclass/{miniclass}/{topik}/{nama-file}"
    }
  ]
}
```

#### Contoh Penambahan Sidebar

**Untuk Backend** (edit `.vitepress/sidebars/backend.ts`):

```typescript
{
  text: "Fundamental",
  collapsed: false,
  items: [
    {
      text: "Pendahuluan",
      link: "/miniclass/backend/fundamental/pendahuluan"
    },
    {
      text: "Database",
      link: "/miniclass/backend/fundamental/database"
    }
  ]
}
```

**Untuk Frontend Web** (edit `.vitepress/sidebars/frontend-web.ts`):

```typescript
{
  text: "HTML",
  collapsed: false,
  items: [
    {
      text: "Pengenalan HTML",
      link: "/miniclass/frontend/web/html/pengenalan-html"
    }
  ]
}
```

**Untuk Frontend Mobile** (edit `.vitepress/sidebars/frontend-mobile.ts`):

```typescript
{
  text: "Flutter Widgets",
  collapsed: false,
  items: [
    {
      text: "Pengenalan Widget",
      link: "/miniclass/frontend/mobile/widget-flutter/widget"
    }
  ]
}
```

### 5. Checklist Kontribusi

Sebelum membuat Pull Request, pastikan:

- [ ] Materi disimpan di folder yang sesuai dengan miniclass
- [ ] Setiap pertemuan/topik memiliki folder tersendiri
- [ ] Assets disimpan di lokasi yang benar (root miniclass atau web/mobile untuk frontend)
- [ ] Sidebar sudah diupdate di file `.vitepress/sidebars/{nama-miniclass}.ts`
- [ ] Link pada sidebar sudah ditest dan berfungsi
- [ ] File markdown mengikuti format dan style guide yang ada
