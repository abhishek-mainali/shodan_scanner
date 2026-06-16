export const mockScans = [
  {
    id: "scan_001",
    target: "192.168.1.1",
    type: "IP Lookup",
    status: "completed",
    timestamp: "2024-03-15 10:30:00",
    ports: [
      { port: 80, protocol: "tcp", service: "http", version: "Apache 2.4.41", state: "open" },
      { port: 443, protocol: "tcp", service: "https", version: "nginx 1.18.0", state: "open" },
      { port: 22, protocol: "tcp", service: "ssh", version: "OpenSSH 8.2p1", state: "open" }
    ],
    cves: [
      { id: "CVE-2021-41773", severity: "critical", score: 9.8, description: "Path traversal and remote code execution in Apache HTTP Server 2.4.49" },
      { id: "CVE-2020-14144", severity: "medium", score: 5.3, description: "OpenSSH through 8.3 allows an observable discrepancy between a valid and invalid user" }
    ],
    ssl: {
      issuer: "Let's Encrypt",
      subject: "CN=router.local",
      expiry: "2024-06-15",
      valid: true,
      fingerprint: "SHA-256: AB:CD:EF:..."
    },
    geo: {
      ip: "192.168.1.1",
      country: "Private",
      city: "Local Network",
      lat: 0,
      lng: 0,
      org: "Local ISP",
      asn: "AS0000",
      isp: "Local"
    }
  },
  {
    id: "scan_002",
    target: "8.8.8.8",
    type: "IP Lookup",
    status: "completed",
    timestamp: "2024-03-15 11:45:12",
    ports: [
      { port: 53, protocol: "udp", service: "dns", version: "Google DNS", state: "open" },
      { port: 443, protocol: "tcp", service: "https", version: "Google GFE", state: "open" }
    ],
    cves: [],
    ssl: {
      issuer: "Google Trust Services",
      subject: "CN=dns.google",
      expiry: "2024-09-12",
      valid: true,
      fingerprint: "SHA-256: 12:34:56:..."
    },
    geo: {
      ip: "8.8.8.8",
      country: "United States",
      city: "Mountain View",
      lat: 37.4223,
      lng: -122.0841,
      org: "Google LLC",
      asn: "AS15169",
      isp: "Google"
    }
  },
  {
    id: "scan_003",
    target: "example.com",
    type: "Domain",
    status: "running",
    timestamp: "2024-03-16 09:15:00",
    ports: [
      { port: 80, protocol: "tcp", service: "http", version: "unknown", state: "open" }
    ],
    cves: [],
    ssl: null,
    geo: {
      ip: "93.184.216.34",
      country: "United States",
      city: "Norwell",
      lat: 42.1508,
      lng: -70.8228,
      org: "EdgeCast Networks",
      asn: "AS15133",
      isp: "MCI Communications"
    }
  }
];

export const stats = [
  { label: "Total Scans", value: 128, trend: "+12%" },
  { label: "Open Ports Found", value: 412, trend: "+5%" },
  { label: "CVEs Detected", value: 24, trend: "-2%" },
  { label: "Hosts Scanned", value: 89, trend: "+8%" }
];
