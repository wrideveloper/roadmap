# Minggu 4: Enumeration & Attack Surface Mapping
## 1. Pendahuluan

**Enumeration** adalah proses **aktif** untuk mengekstrak informasi secara sistematis dari sistem target — berbeda dari passive recon, pada fase ini kita sudah melakukan interaksi langsung dengan target untuk mendapatkan data yang lebih konkret.

**Attack Surface Mapping** adalah proses memetakan seluruh titik masuk (entry point) yang berpotensi dapat dieksploitasi oleh attacker. Dua proses ini berjalan beriringan:

- Enumeration → mengumpulkan data teknis secara aktif
- Attack Surface Mapping → menganalisis dan memetakan data tersebut menjadi potensi kelemahan

---
## 2. Tujuan Enumeration & Attack Surface Mapping

### Tujuan Enumeration

- Mengidentifikasi port dan service yang berjalan pada target
- Menentukan versi software dan OS yang digunakan
- Menemukan endpoint, direktori, dan file tersembunyi
- Mengekstrak user, group, dan resource yang tersedia
- Memvalidasi hipotesis dari fase passive recon

### Tujuan Attack Surface Mapping

- Membuat inventaris lengkap seluruh entry point
- Menilai luas dan kompleksitas permukaan serangan
- Memprioritaskan area yang paling rentan untuk diuji
- Mendokumentasikan infrastruktur target secara visual

---
## 3. Konsep Attack Surface

Attack surface adalah **keseluruhan area di mana attacker dapat berinteraksi** dengan sistem target untuk mencoba mengeksploitasinya.

### Kategori Attack Surface

| Kategori | Contoh |
| --- | --- |
| **Network Attack Surface** | Port terbuka, service terekspos, firewall misconfiguration |
| **Web Attack Surface** | Endpoint API, form input, autentikasi, file upload |
| **Software Attack Surface** | Versi CMS, plugin, library outdated |
| **Human Attack Surface** | Akun karyawan, email pattern, social engineering vector |
| **Cloud Attack Surface** | S3 bucket publik, misconfigured IAM, exposed storage |

### Prinsip Dasar

```
Semakin besar attack surface → semakin tinggi potensi risiko
Semakin spesifik pemetaan → semakin efisien pengujian
```

---
## 4. Workflow Enumeration & Attack Surface Mapping

> ⚠️ Semua aktivitas pada fase ini adalah **active** — pastikan sudah ada izin tertulis (scope engagement) sebelum memulai.

---

### 4.1 Network Enumeration

**Tujuan:** Menemukan host aktif, port terbuka, dan service yang berjalan.

> 📌 **Teknik dan perintah Nmap** (host discovery, SYN scan, UDP scan, version detection, flag lengkap) sudah dibahas secara mendalam di **Minggu 3**. Gunakan cheat sheet dari minggu tersebut sebagai referensi utama.

Sebagai pengingat cepat, urutan scan standar yang digunakan dalam konteks enumeration ini adalah:

```bash
# 1. Host discovery
nmap -sn 192.168.1.0/24

# 2. Full port scan + service + version detection
sudo nmap -sS -sV -sC -p- <target>

# 3. UDP scan pada port populer
sudo nmap -sU --top-ports 100 <target>
```

Output yang perlu dicatat untuk Attack Surface Mapping:

```
PORT     STATE  SERVICE  VERSION
22/tcp   open   ssh      OpenSSH 8.2p1
80/tcp   open   http     Apache httpd 2.4.41
443/tcp  open   ssl/http nginx 1.18.0
3306/tcp open   mysql    MySQL 5.7.32
```

**Tools tambahan untuk network scanning skala besar:**

| Tool | Fungsi | Install |
| --- | --- | --- |
| **Masscan** | Port scanning ultra-cepat (internet-scale) | `sudo apt install masscan` |
| **Rustscan** | Fast port scanner (wrapper Nmap) | `cargo install rustscan` |
| **Fping** | Host discovery & ping sweep | `sudo apt install fping` |

---

### 4.2 Service Enumeration

Setelah mengetahui port yang terbuka, langkah selanjutnya adalah mengekstrak informasi detail dari setiap service.

#### SSH Enumeration (Port 22)

SSH enumeration bertujuan untuk mengidentifikasi versi server SSH yang berjalan dan konfigurasi keamanannya. Dengan melakukan banner grabbing, kita bisa mengetahui apakah versi tersebut memiliki kerentanan (CVE) yang diketahui, sementara pengecekan algoritma membantu menentukan apakah ada metode enkripsi lemah yang bisa didekripsi atau dieksploitasi.

Selain itu, teknik ini digunakan untuk memvalidasi metode autentikasi yang diizinkan, seperti penggunaan password atau public key. Pada versi lama, terkadang kita bahkan bisa melakukan enumerasi username untuk memetakan akun pengguna yang valid di sistem target.

```bash
# Banner grabbing
nc -v <target> 22

# Cek algoritma yang didukung
nmap --script ssh2-enum-algos <target>

# Enumerasi user (jika versi lama)
nmap --script ssh-auth-methods --script-args="ssh.user=root" <target>
```

#### HTTP/HTTPS Enumeration (Port 80/443)

Enumerasi pada protokol web sangat krusial karena seringkali menjadi pintu masuk utama serangan. Proses ini fokus pada pengumpulan informasi dari header HTTP untuk mengidentifikasi jenis web server (seperti Apache atau Nginx), framework yang digunakan, serta kebijakan keamanan seperti Content Security Policy (CSP) atau cookie flags.

Analisis SSL/TLS juga dilakukan untuk memastikan enkripsi yang digunakan kuat dan sertifikatnya valid. Melalui fingerprinting teknologi web, kita dapat memetakan seluruh tumpukan teknologi (tech stack) yang digunakan aplikasi, yang nantinya sangat berguna dalam menentukan strategi eksploitasi yang spesifik.

```bash
# Header grabbing
curl -I http://<target>

# Web server fingerprinting
whatweb http://<target>

# SSL/TLS analysis
sslscan <target>
testssl.sh <target>
```

#### FTP Enumeration (Port 21)

FTP enumeration dilakukan untuk mencari akses yang tidak aman pada layanan pengiriman file. Salah satu fokus utamanya adalah memeriksa apakah fitur 'anonymous login' diaktifkan, yang memungkinkan siapa saja masuk tanpa kredensial dan berpotensi mengunduh file sensitif atau mengunggah file berbahaya ke server.

Melalui banner grabbing, kita juga bisa mengidentifikasi software FTP yang digunakan (seperti vsftpd atau ProFTPD). Informasi versi ini sangat penting untuk mencari exploit spesifik yang dapat menyebabkan kebocoran data atau bahkan eksekusi perintah jarak jauh (RCE).

```bash
# Cek anonymous login
nmap --script ftp-anon <target>

# Banner grabbing
nc -v <target> 21
```

#### SMB Enumeration (Port 445)

Protokol SMB seringkali menyimpan informasi yang sangat kaya mengenai struktur jaringan internal dan hak akses pengguna. Enumerasi SMB bertujuan untuk menemukan share folder yang terekspos, daftar pengguna sistem, serta informasi grup yang dapat memberikan gambaran tentang peran server tersebut di dalam domain atau workgroup.

Dengan alat seperti enum4linux atau script Nmap, kita bisa mendapatkan detail teknis seperti versi OS dan kebijakan password. Informasi ini sangat berharga dalam fase lateral movement, di mana penyerang mencoba berpindah dari satu mesin ke mesin lain di dalam jaringan.

```bash
# Cek share yang tersedia
smbclient -L //<target> -N

# Enumerasi user, group, share
enum4linux -a <target>

# Nmap SMB scripts
nmap --script smb-enum-shares,smb-enum-users <target>
```

#### SNMP Enumeration (Port 161/UDP)

SNMP seringkali menjadi 'tambang emas' informasi karena protokol ini dirancang untuk manajemen dan monitoring perangkat jaringan. Jika dikonfigurasi dengan community string yang lemah (seperti 'public'), penyerang dapat mengekstrak informasi detail mulai dari daftar software yang terinstal, tabel routing, hingga informasi hardware dan uptime sistem.

Proses enumerasi ini membantu penyerang memahami kondisi internal target secara mendalam tanpa harus masuk ke dalam sistem terlebih dahulu. Data yang didapat dari SNMP seringkali memberikan petunjuk krusial mengenai titik lemah infrastruktur yang tidak terlihat dari luar.

```bash
# Enumerasi dengan community string default
snmpwalk -v2c -c public <target>

# Brute force community string
onesixtyone -c /usr/share/seclists/Discovery/SNMP/snmp.txt <target>
```

**Tools Service Enumeration:**

| Tool | Target Service | Perintah Dasar |
| --- | --- | --- |
| **Netcat** | Semua port | `nc -v <target> <port>` |
| **WhatWeb** | HTTP | `whatweb <url>` |
| **SSLScan** | HTTPS/TLS | `sslscan <target>` |
| **Enum4linux** | SMB/Samba | `enum4linux -a <target>` |
| **SNMPWalk** | SNMP | `snmpwalk -v2c -c public <target>` |
| **Nikto** | HTTP | `nikto -h <url>` |

---

### 4.3 Web Enumeration

Fase ini berfokus pada pengujian aplikasi web secara lebih mendalam.

#### Directory & File Bruteforcing

```bash
# Gobuster — directory brute force
gobuster dir -u http://<target> -w /usr/share/wordlists/dirb/common.txt

# Gobuster dengan ekstensi file
gobuster dir -u http://<target> \
  -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
  -x php,html,txt,bak,zip

# Feroxbuster — recursive brute force
feroxbuster -u http://<target> -w /usr/share/wordlists/dirb/common.txt

# FFuf — flexible fuzzer
ffuf -u http://<target>/FUZZ -w /usr/share/wordlists/dirb/common.txt
```

#### Subdomain Enumeration (Active)

```bash
# Gobuster — subdomain mode
gobuster dns -d target.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# FFuf — vhost fuzzing
ffuf -u http://<target>/ -H "Host: FUZZ.target.com" \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# Amass — comprehensive subdomain enumeration
amass enum -d target.com
```

#### Web Technology Fingerprinting

```bash
# WhatWeb
whatweb -v http://<target>

# Wappalyzer (CLI)
wappalyzer http://<target>

# Curl untuk melihat response headers
curl -I -L http://<target>
```

#### API Endpoint Discovery

```bash
# Cari endpoint API dengan wordlist khusus
gobuster dir -u http://<target>/api \
  -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt

# FFuf untuk parameter fuzzing
ffuf -u http://<target>/api/v1/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt
```

**Tools Web Enumeration:**

| Tool | Fungsi | Install |
| --- | --- | --- |
| **Gobuster** | Directory, DNS, VHost brute force | `sudo apt install gobuster` |
| **FFuf** | Fast web fuzzer | `sudo apt install ffuf` |
| **Feroxbuster** | Recursive directory brute force | `sudo apt install feroxbuster` |
| **Dirb** | Directory brute force (klasik) | `sudo apt install dirb` |
| **WhatWeb** | Web technology fingerprinting | `sudo apt install whatweb` |
| **Nikto** | Web vulnerability scanner | `sudo apt install nikto` |
| **Amass** | Subdomain enumeration | `sudo apt install amass` |

---

### 4.4 DNS Enumeration (Active)

```bash
# Query DNS records
dig A target.com
dig MX target.com
dig TXT target.com
dig NS target.com
dig ANY target.com

# Zone transfer (jika server tidak dikonfigurasi dengan benar)
dig axfr target.com @ns1.target.com

# Reverse DNS lookup
dig -x <IP>

# DNSRecon — comprehensive DNS enumeration
dnsrecon -d target.com -t std
dnsrecon -d target.com -t axfr

# Fierce — DNS reconnaissance
fierce --domain target.com
```

**Tools DNS Enumeration:**

| Tool | Fungsi |
| --- | --- |
| **Dig** | Query DNS manual | 
| **DNSRecon** | Automated DNS enumeration |
| **Fierce** | DNS recon & subdomain discovery |
| **Host** | Simple DNS lookup |
| **DNSEnum** | Comprehensive DNS info gathering |

---

### 4.5 OS & Version Fingerprinting

```bash
# OS detection dengan Nmap
nmap -O <target>

# Aggressive scan (OS + version + scripts)
nmap -A <target>

# Banner grabbing manual
nc -v <target> 80
HEAD / HTTP/1.0

# Metasploit auxiliary scanner
use auxiliary/scanner/portscan/tcp
```

**Yang dianalisis:**

- Nama dan versi OS
- Patch level (apakah sudah diupdate?)
- Service version yang berpotensi vulnerable
- TTL value (indikasi OS dari network level)

---

### 4.6 OSINT Aktif (Validasi Hipotesis)

Berbeda dari passive OSINT di minggu 2, pada fase ini kita memvalidasi temuan dengan interaksi langsung.

```bash
# Cek email dengan SMTP enumeration
smtp-user-enum -M VRFY -U users.txt -t <target>

# Whois lookup untuk verifikasi kepemilikan IP
whois <IP>

# Shodan CLI — cari informasi host dari perspektif publik
shodan host <IP>
```

---
## 5. Attack Surface Mapping

Setelah data terkumpul melalui enumeration, langkah selanjutnya adalah memetakan seluruh temuan ke dalam attack surface map.

### 5.1 Komponen Attack Surface Map

Sebuah attack surface map yang baik harus mencakup:

```
Attack Surface Map
├── Network Layer
│   ├── Open Ports
│   ├── Exposed Services
│   └── Network Segmentation
├── Web Application Layer
│   ├── Public Endpoints
│   ├── Authentication Points
│   ├── File Upload Points
│   ├── API Endpoints
│   └── Admin Panels
├── Software Layer
│   ├── CMS & Version
│   ├── Frameworks & Libraries
│   └── Outdated Components
└── Infrastructure Layer
    ├── Cloud Services
    ├── CDN
    └── Third-party Integrations
```

### 5.2 Format Tabel Attack Surface

Gunakan tabel berikut untuk mendokumentasikan setiap entry point:

| Entry Point | Type | Location | Technology | Risk Level | Notes |
| --- | --- | --- | --- | --- | --- |
| Port 22/SSH | Network | 192.168.1.10 | OpenSSH 7.4 | High | Versi lama, CVE tersedia |
| /admin | Web | http://target.com/admin | WordPress | High | Admin panel terekspos |
| /api/v1/users | API | http://target.com | REST API | Medium | Butuh auth, belum divalidasi |
| Port 8080 | Network | 192.168.1.10 | Tomcat 9.0 | Medium | Dev server terekspos |
| dev.target.com | Subdomain | DNS | Unknown | Medium | Subdomain dev terekspos |

### 5.3 Risk Level Classification

| Level | Kriteria |
| --- | --- |
| **Critical** | Langsung dapat dieksploitasi tanpa autentikasi |
| **High** | Berpotensi memberikan akses signifikan |
| **Medium** | Memerlukan kondisi tertentu untuk dieksploitasi |
| **Low** | Dampak terbatas atau memerlukan banyak prasyarat |
| **Informational** | Tidak langsung berbahaya namun perlu dicatat |

### 5.4 Entry Point Categories

**Authentication Entry Points:**
- Login form
- Admin panel
- API key/token authentication
- OAuth endpoints
- Password reset mechanism

**Data Input Entry Points:**
- Form fields (search, register, contact)
- File upload
- URL parameters
- HTTP headers
- Cookies

**Infrastructure Entry Points:**
- Exposed management ports (SSH, RDP, Telnet)
- Database ports (MySQL, PostgreSQL, MongoDB)
- Cache services (Redis, Memcached)
- Message brokers (RabbitMQ, Kafka)

---
## 6. Tools Lengkap

### 6.1 Network Scanning

> 📌 Referensi lengkap flag dan teknik Nmap tersedia di **Minggu 3 — Cheat Sheet Nmap**. Tabel berikut hanya mencantumkan tools di luar Nmap yang relevan untuk fase enumeration ini.

| Tool | Fungsi Utama | Perintah Contoh |
| --- | --- | --- |
| **Masscan** | Ultra-fast port scanner | `masscan -p1-65535 <target> --rate=1000` |
| **Rustscan** | Fast scanner + Nmap integration | `rustscan -a <target> -- -sC -sV` |
| **Netcat** | Manual banner grabbing | `nc -v <target> <port>` |
| **Zmap** | Internet-wide scanning | `zmap -p 80 -o results.txt` |

### 6.2 Web Enumeration

| Tool | Fungsi Utama | Perintah Contoh |
| --- | --- | --- |
| **Gobuster** | Dir/file/DNS/vhost brute force | `gobuster dir -u <url> -w wordlist.txt` |
| **FFuf** | Flexible web fuzzer | `ffuf -u <url>/FUZZ -w wordlist.txt` |
| **Feroxbuster** | Recursive directory brute force | `feroxbuster -u <url>` |
| **Dirb** | Directory brute force | `dirb <url>` |
| **Dirsearch** | Web path discovery | `dirsearch -u <url>` |
| **Nikto** | Web vulnerability scanner | `nikto -h <url>` |
| **WhatWeb** | Technology fingerprinting | `whatweb -v <url>` |
| **Wfuzz** | Web fuzzer | `wfuzz -u <url>/FUZZ -w wordlist.txt` |

### 6.3 DNS & Subdomain

| Tool | Fungsi Utama | Perintah Contoh |
| --- | --- | --- |
| **Amass** | Comprehensive subdomain enum | `amass enum -d target.com` |
| **DNSRecon** | DNS record enumeration | `dnsrecon -d target.com` |
| **Fierce** | DNS recon & subdomain | `fierce --domain target.com` |
| **Dig** | Manual DNS query | `dig ANY target.com` |
| **Subfinder** | Passive subdomain discovery | `subfinder -d target.com` |
| **Assetfinder** | Fast asset discovery | `assetfinder target.com` |

### 6.4 Service-Specific

| Tool | Target | Perintah Contoh |
| --- | --- | --- |
| **Enum4linux** | SMB/Windows | `enum4linux -a <target>` |
| **SMBMap** | SMB shares | `smbmap -H <target>` |
| **SNMPWalk** | SNMP | `snmpwalk -v2c -c public <target>` |
| **SSLScan** | SSL/TLS | `sslscan <target>` |
| **TestSSL** | SSL/TLS analysis | `testssl.sh <target>` |
| **SMTP-user-enum** | SMTP | `smtp-user-enum -M VRFY -U users.txt -t <target>` |

### 6.5 Wordlists

Wordlist adalah komponen kunci dalam enumeration. Gunakan dari **SecLists**:

```bash
# Install SecLists
sudo apt install seclists
# atau
git clone https://github.com/danielmiessler/SecLists

# Lokasi umum
/usr/share/seclists/Discovery/Web-Content/common.txt
/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
/usr/share/wordlists/dirb/common.txt
/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

---
## 7. Nmap Scripting Engine (NSE)

> 📌 Pengenalan NSE dan kategori script sudah dibahas di **Minggu 3 — Further Nmap**. Bagian ini fokus pada penggunaan NSE spesifik untuk keperluan enumeration service.

### Contoh NSE untuk Service Enumeration

```bash
# HTTP enumeration
nmap --script http-enum <target>

# SMB vulnerability check
nmap --script smb-vuln-* <target>

# FTP anonymous check
nmap --script ftp-anon <target>

# SSL certificate info
nmap --script ssl-cert <target>

# MySQL enumeration
nmap --script mysql-info,mysql-enum <target>
```

---
## 8. Kesalahan Umum dalam Enumeration

- **Terlalu agresif di awal** — scan dengan rate tinggi dapat memicu IDS/IPS dan alert tim keamanan target
- **Tidak mencatat command yang dijalankan** — reproducibility sangat penting dalam pentest profesional
- **Hanya scan port TCP** — banyak service berjalan di UDP (DNS, SNMP, TFTP)
- **Skip versi verification** — versi software sangat krusial untuk mencari CVE yang relevan
- **Tidak melakukan rekursif** — direktori yang ditemukan harus di-enumerate ulang
- **Mengabaikan non-standard port** — attacker sering menaruh service di port tidak umum
- **Wordlist tidak tepat** — pilih wordlist sesuai teknologi target (WordPress, PHP, Java, dll)

---
## 9. Prinsip Penting

**Enumeration = Ketelitian, bukan kecepatan.**

Beberapa prinsip yang harus selalu diikuti:

1. **Catat semua perintah** yang dijalankan, bukan hanya hasilnya
2. **Verifikasi setiap temuan** — false positive sering terjadi pada automated tools
3. **Kontekstualisasi hasil** — sebuah temuan baru bermakna jika dipahami dalam konteks sistem target
4. **Iteratif** — temuan baru membuka jalur enumeration baru yang harus diikuti
5. **Jaga scope** — jangan keluar dari batas engagement yang telah disepakati

---
## 10. Lab TryHackMe

Gunakan lab berikut untuk mempraktikkan materi minggu ini secara langsung:

### 10.1 Fundamental Enumeration

| Room | Topik | Link | Difficulty |
| --- | --- | --- | --- |
| **Network Services** | SMB, Telnet, FTP, NFS enumeration | [tryhackme.com/room/networkservices](https://tryhackme.com/room/networkservices) | Easy |
| **Network Services 2** | SMTP, MySQL enumeration | [tryhackme.com/room/networkservices2](https://tryhackme.com/room/networkservices2) | Easy |
| **Nmap** | Nmap fundamentals & NSE | [tryhackme.com/room/furthernmap](https://tryhackme.com/room/furthernmap) | Easy |
| **Nmap Live Host Discovery** | Host discovery techniques | [tryhackme.com/room/nmaplayerhost](https://tryhackme.com/room/nmaplayerhost) | Easy |

### 10.2 Web Enumeration

| Room | Topik | Link | Difficulty |
| --- | --- | --- | --- |
| **Web Enumeration** | Gobuster, Nikto, WhatWeb | [tryhackme.com/room/webenumerationv2](https://tryhackme.com/room/webenumerationv2) | Easy |
| **Content Discovery** | Manual & automated content discovery | [tryhackme.com/room/contentdiscovery](https://tryhackme.com/room/contentdiscovery) | Easy |
| **Subdomain Enumeration** | Passive & active subdomain discovery | [tryhackme.com/room/subdomainenumeration](https://tryhackme.com/room/subdomainenumeration) | Easy |
| **DNS in Detail** | DNS records & enumeration | [tryhackme.com/room/dnsindetail](https://tryhackme.com/room/dnsindetail) | Easy |

### 10.3 Attack Surface & Practical

| Room | Topik | Link | Difficulty |
| --- | --- | --- | --- |
| **Passive Reconnaissance** | Kombinasi passive & awal active recon | [tryhackme.com/room/passiverecon](https://tryhackme.com/room/passiverecon) | Easy |
| **Active Reconnaissance** | Traceroute, Ping, Nmap, Telnet | [tryhackme.com/room/activerecon](https://tryhackme.com/room/activerecon) | Easy |
| **Bounty Hunter** | Real-world web enumeration practice | [tryhackme.com/room/cowboyhacker](https://tryhackme.com/room/cowboyhacker) | Easy |
| **Basic Pentesting** | Full enumeration → exploitation flow | [tryhackme.com/room/basicpentestingjt](https://tryhackme.com/room/basicpentestingjt) | Easy |
| **Lookup** | Enumeration practice end-to-end | [tryhackme.com/room/lookup](https://tryhackme.com/room/lookup) | Easy |

### 10.4 Urutan Lab yang Disarankan

```
1. DNS in Detail          → Pahami DNS sebagai fondasi
2. Passive Reconnaissance → Review dari minggu lalu + transisi ke active
3. Nmap (Further Nmap)    → Kuasai tool utama network enum
4. Active Reconnaissance  → Praktik teknik active recon dasar
5. Network Services       → Enum service per protokol (SMB, FTP, Telnet)
6. Network Services 2     → Lanjutan (SMTP, MySQL)
7. Web Enumeration        → Tools web enum (Gobuster, Nikto)
8. Content Discovery      → Teknik web content discovery
9. Subdomain Enumeration  → DNS brute force & passive enum
10. Basic Pentesting      → Integrasi semua teknik
```