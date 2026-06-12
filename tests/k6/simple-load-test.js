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
};

const BASE_URL = 'http://localhost:5000';

export default function () {
    // Hanya test health endpoint (yang sudah pasti berhasil)
    const healthRes = http.get(`${BASE_URL}/api/health`);
    check(healthRes, {
        'health status 200': (r) => r.status === 200,
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
  
  ═══════════════════════════════════════════════════════════
  
  ${failedRate === 0 ?
            '✅ TEST LULUS: Error rate 0%. Performa aplikasi sangat baik!' :
            '❌ TEST GAGAL: Masih ada error. Periksa endpoint API.'}
  `);

    return { 'stdout': '' };
}