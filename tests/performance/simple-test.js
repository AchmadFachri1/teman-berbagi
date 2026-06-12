import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        load_test: {
            executor: 'constant-vus',
            vus: 50,
            duration: '1m',
            startTime: '0s',
        },
        stress_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 100 },
                { duration: '30s', target: 200 },
                { duration: '30s', target: 200 },
            ],
            startTime: '1m30s',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.1'],
    },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
    let success = true;

    // Hanya test register (endpoint yang pasti ada)
    const uniqueId = `${__VU}_${Date.now()}_${__ITER}`;
    const registerPayload = JSON.stringify({
        username: `user_${uniqueId}`,
        email: `user_${uniqueId}@test.com`,
        tanggalLahir: '1990-01-01',
        password: 'password123',
    });

    const registerRes = http.post(`${BASE_URL}/api/auth/register`, registerPayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    const registerSuccess = check(registerRes, {
        'register status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    });

    if (!registerSuccess) success = false;

    // Test login untuk user yang sudah ada
    const loginPayload = JSON.stringify({
        identifier: `user_${uniqueId}@test.com`,
        password: 'password123',
    });

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
        'login status is 200': (r) => r.status === 200,
    });

    sleep(1);
}

export function handleSummary(data) {
    const failedRate = data.metrics.http_req_failed?.values.rate || 0;

    console.log(`
  ═══════════════════════════════════════════════════════════
                    PERFORMANCE TEST SUMMARY
  ═══════════════════════════════════════════════════════════
  
  📊 LOAD TEST (50 VU)
  ───────────────────────────────────────────────────────────
  Total Requests     : ${data.metrics.http_reqs?.values.count || 0}
  P95 Response Time  : ${data.metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 'N/A'} ms
  Error Rate         : ${(failedRate * 100).toFixed(2)}%
  Throughput         : ${data.metrics.http_reqs?.values.rate?.toFixed(2) || 'N/A'} req/s
  
  📈 STRESS TEST (200 VU)
  ───────────────────────────────────────────────────────────
  P95 Response Time  : ${data.metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 'N/A'} ms
  Error Rate         : ${(failedRate * 100).toFixed(2)}%
  
  ═══════════════════════════════════════════════════════════
  
  ${failedRate > 0.05 ?
            '⚠️  REKOMENDASI: Error rate di atas 5%. Periksa endpoint API dan koneksi database.' :
            '✅ SEMUA BAIK: Error rate di bawah 5%. Performa aplikasi baik.'}
  `);

    return { 'stdout': '' };
}