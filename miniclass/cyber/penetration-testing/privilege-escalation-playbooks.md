# Privilege Escalation Playbooks

Privilege escalation adalah domain yang hampir selalu menjadi pembeda antara pentest dasar dan pentest yang lebih matang. Pengujian yang baik membutuhkan checklist, prioritas, dan disiplin dalam membaca bukti.

## Prinsip Umum

- enumeration selalu lebih penting daripada exploit spontan
- cari misconfiguration yang nyata lebih dulu
- dokumentasikan bukti sebelum mencoba perubahan besar
- bedakan jalur potensial dan jalur tervalidasi

## Linux Privilege Escalation Playbook

### Checklist Cepat

```bash
whoami
id
hostname
uname -a
sudo -l
env
find / -perm -4000 2>/dev/null
ps aux
crontab -l
ls -la /etc/cron*
```

### Area yang Wajib Dicek

- sudo rights
- SUID binaries
- cron jobs
- password reuse atau credential di config
- writable path yang sensitif
- kernel atau software version yang relevan

### Cara Berpikir

1. Cek privilege eksplisit seperti sudo.
2. Cek misconfiguration file atau service.
3. Cek credential yang tersimpan.
4. Baru pertimbangkan exploit yang lebih berat.

## Windows Privilege Escalation Playbook

### Checklist Cepat

```powershell
whoami /all
hostname
systeminfo
net user
net localgroup administrators
schtasks /query /fo LIST /v
sc query
wmic service get name,displayname,pathname,startmode
```

### Area yang Wajib Dicek

- unquoted service paths
- weak service permissions
- scheduled tasks
- token privileges
- credential artifacts
- local admin misconfiguration

## Manual vs Automated Enumeration

Tool otomatis boleh membantu, tetapi peserta tetap harus bisa menjelaskan:

- output mana yang relevan
- kenapa item tertentu dianggap menarik
- apa bukti yang mendukung jalur eskalasi

## Bukti yang Harus Disimpan

- current user
- group membership
- artefak konfigurasi yang relevan
- command output yang menunjukkan misconfiguration
- dampak setelah privilege berubah

## Contoh Struktur Catatan PrivEsc

```md
## Current Context
- user:
- groups:
- hostname:

## Candidate Path
- service / config:
- evidence:
- why interesting:

## Validation
- command:
- result:

## Impact
- apakah privilege berubah?
- data atau action apa yang menjadi mungkin?
```

## Quality Bar yang Lebih Tinggi

Untuk mendekati kursus level industri:

- peserta harus punya checklist yang konsisten
- peserta tidak boleh hanya berkata "linpeas menemukan ini"
- peserta harus bisa menjelaskan kenapa jalur tertentu valid

## Integrasi ke Roadmap

- minggu 5: tanamkan konsep validation-first
- minggu 8: gunakan playbook ini untuk local enumeration yang lebih rapi
- track lanjutan: tambahkan Linux dan Windows privesc lab terpisah
