<script setup>
import { ref } from 'vue';

const activeStep = ref(0);

const steps = [
  {
    step: 1,
    tab: 'Request',
    title: 'HTTP Request',
    actor: 'Client / Postman',
    action: 'POST /api/absensi',
    desc: 'Client (Postman) melakukan hit ke endpoint POST http://localhost:8000/api/absensi dengan membawa header Content-Type: application/json dan payload body JSON.',
    sample: '{\n  "nama": "Farhan Kurniawan",\n  "nim": "244107020001",\n  "status": "Hadir",\n  "tanggal": "2026-11-08"\n}'
  },
  {
    step: 2,
    tab: 'Router',
    title: 'Routing & Method Check',
    actor: 'Router (index.php)',
    action: 'Match: POST /api/absensi',
    desc: 'Router memeriksa $_SERVER[\'REQUEST_METHOD\'] (POST) dan URI (/api/absensi). Karena cocok dengan rute terdaftar, router memanggil fungsi createAbsensi().',
    sample: 'post(\'/api/absensi\', \'createAbsensi\');'
  },
  {
    step: 3,
    tab: 'Handler',
    title: 'Handler Logic (createAbsensi)',
    actor: 'Handler (absensi.php)',
    action: 'Eksekusi Handler',
    desc: 'Alur masuk ke fungsi pengolah data (handler). Di sini payload JSON dari client dibaca dan divalidasi kelengkapannya sebelum diolah lebih lanjut.',
    sample: 'function createAbsensi(): void {\n    // 1. Tangkap payload JSON dari client\n    // 2. Validasi data (apakah ada yang kosong/null?)\n    // 3. Jika valid, siapkan untuk simpan ke database...\n}'
  },
  {
    step: 4,
    tab: 'Database',
    title: 'Database Execution',
    actor: 'MySQL Database',
    action: 'Komunikasi ke Database',
    desc: 'Backend berbicara ke server database melalui perantara koneksi (PDO). Query disiapkan (prepare) lalu dieksekusi bersama datanya (execute).',
    sample: '// Backend mengirim perintah lewat koneksi database (PDO)\n$stmt = $pdo->prepare("INSERT INTO tb_absensi (nama, status) VALUES (:nama, :status)");\n$stmt->execute($data);'
  },
  {
    step: 5,
    tab: 'Response',
    title: 'HTTP Response JSON',
    actor: 'Server Output',
    action: 'Status: 201 Created',
    desc: 'Server mengembalikan status HTTP 201 Created dan membungkus hasil operasi ke format JSON string seragam untuk dikirim balik ke client.',
    sample: '{\n  "status": "success",\n  "message": "Data absensi berhasil ditambahkan.",\n  "data": {\n    "id": 1,\n    "nama": "Farhan Kurniawan",\n    "status": "Hadir"\n  }\n}'
  }
];
</script>

<template>
  <div class="lifecycle-container">
    <!-- Banner Simulasi Endpoint -->
    <div class="simulation-banner">
      <span class="sim-label">Contoh Hit:</span>
      <span class="method-tag">POST</span>
      <code class="url-tag">http://localhost:8000/api/absensi</code>
    </div>

    <!-- 5 Tab Langkah -->
    <div class="timeline-bar">
      <div 
        v-for="(s, index) in steps" 
        :key="index"
        :class="['step-node', { active: activeStep === index }]"
        @click="activeStep = index"
      >
        <div class="step-num">Step {{ s.step }}</div>
        <div class="step-label">{{ s.tab }}</div>
      </div>
    </div>

    <!-- Detail Card -->
    <div class="detail-card">
      <div class="card-header">
        <div class="title-group">
          <div class="step-title">
            <span>{{ steps[activeStep].step }}. {{ steps[activeStep].title }}</span>
          </div>
          <div class="action-tag">
            <code>{{ steps[activeStep].action }}</code>
          </div>
        </div>
        <div class="actor-pill">
          {{ steps[activeStep].actor }}
        </div>
      </div>

      <div class="step-desc">
        {{ steps[activeStep].desc }}
      </div>

      <div class="code-preview">
        <div class="code-header">Contoh / Data:</div>
        <pre class="snippet-box"><code>{{ steps[activeStep].sample }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lifecycle-container {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  padding: 16px;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.simulation-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 14px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 12.5px;
  flex-wrap: wrap;
}

.sim-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.method-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  background: #10b981;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.url-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
}

.timeline-bar {
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .timeline-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.step-node {
  box-sizing: border-box;
  min-width: 0;
  padding: 8px 6px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  user-select: none;
}

.step-node:hover {
  border-color: #f97316;
  transform: translateY(-1px);
}

.step-node.active {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.08);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.25);
}

.step-num {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #f97316;
  margin-bottom: 2px;
}

.step-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.25;
  white-space: normal;
  word-break: break-word;
}

.detail-card {
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.action-tag code {
  font-size: 11.5px;
  font-family: var(--vp-font-family-mono);
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-alt);
  color: #f97316;
  border: 1px solid var(--vp-c-divider);
}

.actor-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(249, 115, 22, 0.12);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.25);
  white-space: nowrap;
}

.step-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 14px;
}

.code-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.code-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  letter-spacing: 0.5px;
}

.snippet-box {
  margin: 0;
  padding: 12px 14px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  overflow-x: auto;
}
</style>
