import api from './api';

export const shodanService = {
  resolveTarget: async (input) => {
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(input)) {
      return { type: 'ip', data: await shodanService.fetchHost(input) };
    } else if (input.includes('/')) {
      return { type: 'cidr', data: await shodanService.fetchNetwork(input) };
    } else {
      return { type: 'domain', data: await shodanService.fetchDNS(input) };
    }
  },

  fetchHost: async (ip) => {
    try {
      const { data } = await api.get(`/api/shodan/host/${ip}`);
      return data;
    } catch (err) {
      throw { message: err.response?.data?.error || "Host lookup failed", code: err.response?.status };
    }
  },

  fetchDNS: async (domain) => {
    try {
      const { data } = await api.get(`/api/shodan/dns/resolve`, { params: { hostnames: domain } });
      return data;
    } catch (err) {
      throw { message: err.response?.data?.error || "DNS resolution failed", code: err.response?.status };
    }
  },

  fetchNetwork: async (cidr) => {
    try {
      const { data } = await api.get(`/api/shodan/network`, { params: { cidr } });
      return data;
    } catch (err) {
      throw { message: err.response?.data?.error || "Network scan failed", code: err.response?.status };
    }
  },

  fetchSSL: async (ip) => {
    try {
      const { data } = await api.get(`/api/shodan/ssl`, { params: { ip } });
      return data;
    } catch (err) {
      return null; // SSL is optional
    }
  },

  fetchCVEs: async (ip) => {
    try {
      const { data } = await api.get(`/api/shodan/cve`, { params: { ip } });
      return data;
    } catch (err) {
      return []; // CVEs are optional
    }
  },


  normalizeData: (raw, type) => {
    if (type === 'cidr') {
      return raw.map(m => ({
        id: m.ip_str,
        target: m.ip_str,
        type: 'IP',
        status: 'completed',
        timestamp: new Date().toISOString(),
        ports: m.ports.map(p => ({ port: p })),
        geo: { ip: m.ip_str, country: m.location.country_name, city: m.location.city }
      }));
    }

    // Standard Shodan Host normalization
    return {
      id: raw.ip_str || raw.ip,
      target: raw.ip_str,
      type: type === 'domain' ? 'Domain' : 'IP Lookup',
      status: 'completed',
      timestamp: new Date().toISOString(),
      ports: (raw.ports || []).map(port => {
        const banner = (raw.data || []).find(d => d.port === port);
        return {
          port,
          protocol: banner?.transport || 'tcp',
          service: banner?.service || banner?.product || 'unknown',
          version: banner?.version || 'unknown',
          state: 'open'
        };
      }),
      cves: [], // Will be merged from parallel fetch
      ssl: null, // Will be merged
      geo: {
        ip: raw.ip_str,
        country: raw.country_name,
        city: raw.city,
        lat: raw.latitude,
        lng: raw.longitude,
        org: raw.org,
        asn: raw.asn,
        isp: raw.isp
      }
    };
  }
};

export default shodanService;
