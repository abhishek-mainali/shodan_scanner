/**
 * ReconX Risk Score Algorithm
 * Calculates 0-100 score based on CVEs, ports, and SSL state.
 */

const calculateRiskScore = (scan) => {
  let score = 0;
  const cves = scan.cves || [];
  const ports = scan.ports || [];
  const ssl = scan.ssl;

  // 1. CVE Impact
  const criticalCount = cves.filter(c => c.severity === 'CRITICAL').length;
  const highCount = cves.filter(c => c.severity === 'HIGH').length;
  const mediumCount = cves.filter(c => c.severity === 'MEDIUM').length;

  score += Math.min(criticalCount * 20, 60);
  score += Math.min(highCount * 10, 40);
  score += Math.min(mediumCount * 5, 20);

  // 2. Network Exposure
  if (ports.length > 20) score += 10;
  
  // Non-standard check (e.g. SSH on non-22)
  const sshOnNonStandard = ports.some(p => p.service === 'ssh' && p.port !== 22);
  if (sshOnNonStandard) score += 5;

  // 3. SSL Integrity
  if (ssl) {
    if (!ssl.valid) {
      score += 15;
    } else {
      const expiryDate = new Date(ssl.expiry);
      const daysToExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
      if (daysToExpiry < 30) score += 5;
    }
  }

  // 4. Bonus for Clean Targets
  if (cves.length === 0) score -= 10;

  // Clamp 0-100
  const finalScore = Math.max(0, Math.min(100, score));

  let label = 'LOW';
  if (finalScore > 75) label = 'CRITICAL';
  else if (finalScore > 50) label = 'HIGH';
  else if (finalScore > 25) label = 'MEDIUM';

  return { score: finalScore, label };
};

module.exports = calculateRiskScore;
