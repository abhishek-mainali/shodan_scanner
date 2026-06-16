import { useState, useCallback, useRef } from 'react';
import shodanService from '../services/shodan';

export const useShodan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const abortControllerRef = useRef(null);

  const saveToHistory = (result) => {
    try {
      const history = JSON.parse(localStorage.getItem('reconx_history') || '[]');
      const newEntry = {
        id: result.id,
        target: result.target,
        type: result.type,
        timestamp: result.timestamp,
        summary: {
          ports: result.ports?.length || 0,
          cves: result.cves?.length || 0,
          risk: result.cves?.some(c => c.severity === 'CRITICAL') ? 'critical' : 
                result.cves?.some(c => c.severity === 'HIGH') ? 'high' : 'low'
        }
      };
      
      const updatedHistory = [newEntry, ...history.filter(h => h.id !== result.id)].slice(0, 20);
      localStorage.setItem('reconx_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const cancelScan = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const scan = useCallback(async (target) => {
    setLoading(true);
    setError(null);
    setData(null);
    setProgress({ step: 'Initializing Scan...', percent: 5 });
    
    abortControllerRef.current = new AbortController();

    try {
      // Step 1: Detect & Validate
      setProgress({ step: 'Validating Target...', percent: 10 });
      const { type, data: rawData } = await shodanService.resolveTarget(target);

      if (type === 'cidr') {
        setProgress({ step: 'Scanning Network Range...', percent: 50 });
        const normalizedItems = shodanService.normalizeData(rawData, 'cidr');
        setData(normalizedItems); // Note: CIDR returns array, but ResultsPage expects single. For now we handle single.
        setProgress({ step: 'Scan Complete', percent: 100 });
        setLoading(false);
        return normalizedItems[0];
      }

      // Step 2 & 3: Resolve & Fetch Host
      setProgress({ step: 'Requesting Intelligence...', percent: 45 });
      let normalized = shodanService.normalizeData(rawData, type);

      // Step 4: Parallel Fetch (SSL, CVEs)
      const ip = normalized.id;
      setProgress({ step: 'Analyzing Vulnerabilities & SSL...', percent: 65 });
      
      const [sslResult, cveResult] = await Promise.allSettled([
        shodanService.fetchSSL(ip),
        shodanService.fetchCVEs(ip)
      ]);

      if (sslResult.status === 'fulfilled') normalized.ssl = sslResult.value;
      if (cveResult.status === 'fulfilled') normalized.cves = cveResult.value;

      // Step 5: Geo/ASN (Already in host response, but we finalize)
      setProgress({ step: 'Mapping Infrastructure...', percent: 85 });
      
      // Step 6: Finalize
      normalized.timestamp = new Date().toISOString();
      
      // Step 7: Enrichment
      setProgress({ step: 'Enriching with Threat Intel...', percent: 95 });
      try {
        const { data: intel } = await axios.get(`http://localhost:3001/api/intel/reputation?ip=${normalized.id}`);
        normalized.intel = intel;
      } catch (e) {
        console.warn("Intel enrichment failed", e);
      }

      setProgress({ step: 'Scan Complete', percent: 100 });
      
      setData(normalized);

      saveToHistory(normalized);
      setLoading(false);
      return normalized;

    } catch (err) {
      if (err.name === 'AbortError') {
        setError({ message: 'Scan cancelled by user' });
      } else {
        setError({ message: err.message || 'Mission failed: Network error', target });
      }
      setLoading(false);
      throw err;
    }
  }, []);

  return { scan, data, loading, error, progress, cancelScan };
};
