# ReconX Security Nexus — OSINT & Reconnaissance Suite 🛡️📡

<div align="center">
  <img src="https://img.shields.io/badge/ReconX-v2.0.0-06b6d4?style=for-the-badge&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Security-Hardened-red?style=for-the-badge&logo=google-cloud-security&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=pwa&logoColor=white" />
</div>

---

**ReconX** is a military-grade, multi-user cybersecurity reconnaissance platform designed for automated external asset intelligence. It transforms raw Shodan data into tactical insights, providing a centralized "Ops Center" for security researchers and SOC analysts.

[**Explore Wiki**](https://github.com/your-username/reconx/wiki) • [**Report Bug**](https://github.com/your-username/reconx/issues) • [**Request Feature**](https://github.com/your-username/reconx/issues)

---

## ✨ Primary Capabilities

### 🛡️ Tactical Intelligence Pipeline
- **7-Stage Recon**: Automated processing of Host, DNS, SSL, CVE, Geo-location, ASN, and Tech-Stack fingerprinting.
- **Vulnerability Nexus**: Real-time CVE prioritization and risk scoring based on live exploit intelligence.
- **Intel Enrichment**: Native hooks for **AbuseIPDB**, **VirusTotal**, and advanced WHOIS registry lookups.

### 📊 Operations Center v2
- **Live Activity Maps**: GitHub-style heatmap visualization of mission frequency and operational tempo.
- **Widget-Based HUD**: Fully draggable and customizable dashboard widgets powered by `react-grid-layout`.
- **Global Search**: High-speed spotlight search (`Ctrl + K`) across all historical scan data and findings.

### 🔗 Collaboration & Reporting
- **Client Briefing Portals**: Secure, tokenized, and professional-themed portals for sharing filtered findings with stakeholders.
- **Automated Export**: One-click PDF generation with corporate branding and executive summaries.
- **Team RBAC**: Granular role-based access (ADMIN, ANALYST, VIEWER) with comprehensive audit logging.

---

## 🛠️ Tactical Setup

### 1. Requirements
| Component | Requirement |
| :--- | :--- |
| **Node.js** | version 20.x or higher |
| **Shodan API** | Membership/Small-Business Tier (for full DNS/CIDR scope) |
| **Storage** | 500MB (for local intelligence JSON persistence) |

### 2. Quick-Start Initiation
```bash
# Clone the repository
git clone https://github.com/your-username/reconx.git && cd reconx

# Install tactical dependencies
npm install

# Initialize environment
cp .env.example .env

# Bootstrap initial Administrator account
node init-admin.cjs
```

### 3. Execution
```bash
# Launch full-stack environment
npm run dev:all
```

---

## 🏗️ Architecture Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Express.js, Puppeteer (PDF Engine), Node-Cron (Alerting).
- **Security**: JWT & Refresh Tokens, Bcrypt (Password Hashing), Helmet, Morgan.
- **Deployment**: Multistage Dockerfile & NGINX Reverse Proxy.

---

## ⚖️ Operational Policy

> [!WARNING]  
> **DISCLAIMER**: This platform is designed for authorized security research and defensive posture management. Scanning targets without explicit authorization is illegal and unethical. The developers assume no responsibility for misuse.

---

<p align="center">
  <i>Developed for the next generation of Cyber Intelligence Operators.</i><br>
  <b>ReconX Security Platform</b>
</p>
