import { describe, it, expect } from 'vitest';
import {
  getFirewallDomainsForStack,
  STACK_FIREWALL_DOMAINS,
  GITHUB_FIREWALL_DOMAINS,
  OS_FIREWALL_DOMAINS,
  CONTAINER_FIREWALL_DOMAINS,
  COMMON_FIREWALL_DOMAINS,
} from '../lib/firewall-domains.js';
import { STACK_DEFINITIONS } from '../lib/stacks.js';

describe('firewall-domains', () => {
  describe('getFirewallDomainsForStack', () => {
    it('nextjs スタックは共通ドメインを含む', () => {
      const domains = getFirewallDomainsForStack('nextjs');
      expect(domains).toContain('github.com');
      expect(domains).toContain('registry.npmjs.org');
    });

    it('rails スタックは rubygems.org を含む', () => {
      const domains = getFirewallDomainsForStack('rails');
      expect(domains).toContain('rubygems.org');
    });

    it('sinatra スタックは rubygems.org を含む', () => {
      const domains = getFirewallDomainsForStack('sinatra');
      expect(domains).toContain('rubygems.org');
    });

    it('unknown スタックはエラーなく共通ドメインのみを返す', () => {
      const domains = getFirewallDomainsForStack('unknown-stack');
      expect(domains).toContain('github.com');
      expect(domains).toContain('registry.npmjs.org');
      expect(domains.length).toBeGreaterThan(0);
    });

    it('返り値に重複がない', () => {
      const domains = getFirewallDomainsForStack('rails');
      const uniqueDomains = new Set(domains);
      expect(domains.length).toBe(uniqueDomains.size);
    });
  });

  describe('STACK_FIREWALL_DOMAINS 一貫性', () => {
    it('全キーが STACK_DEFINITIONS の id に含まれる', () => {
      const stackIds = new Set(
        STACK_DEFINITIONS.map((s) => s.id.replace(/_/g, '-')),
      );
      for (const key of Object.keys(STACK_FIREWALL_DOMAINS)) {
        const normalizedKey = key.replace(/_/g, '-');
        expect(stackIds.has(normalizedKey) || key === 'monorepo').toBe(true);
      }
    });
  });

  describe('ドメイン定数の構成', () => {
    it('GITHUB_FIREWALL_DOMAINS は空でない', () => {
      expect(GITHUB_FIREWALL_DOMAINS.length).toBeGreaterThan(0);
    });

    it('OS_FIREWALL_DOMAINS は空でない', () => {
      expect(OS_FIREWALL_DOMAINS.length).toBeGreaterThan(0);
    });

    it('CONTAINER_FIREWALL_DOMAINS は空でない', () => {
      expect(CONTAINER_FIREWALL_DOMAINS.length).toBeGreaterThan(0);
    });

    it('COMMON_FIREWALL_DOMAINS は空でない', () => {
      expect(COMMON_FIREWALL_DOMAINS.length).toBeGreaterThan(0);
    });
  });
});
