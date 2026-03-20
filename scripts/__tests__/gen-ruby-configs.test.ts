import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ROOT } from '../lib/utils.js';
import { TEMPLATES_DIR } from '../lib/stacks.js';

const td = TEMPLATES_DIR;
const RSPEC_REQUIRES: Record<string, string[]> = {
  [`${td}/rails`]: ['rails_helper'],
  [`${td}/rails-api`]: ['rails_helper', 'swagger_helper'],
  [`${td}/sinatra`]: ['spec_helper'],
};

describe('gen-ruby-configs 生成ファイル検証', () => {
  describe('.rspec ファイル', () => {
    it('各 Ruby テンプレートに .rspec が存在する', () => {
      for (const dir of Object.keys(RSPEC_REQUIRES)) {
        const rspecPath = join(ROOT, dir, '.rspec');
        expect(existsSync(rspecPath)).toBe(true);
      }
    });

    it('rails/.rspec が rails_helper を require している', () => {
      const rspecPath = join(ROOT, `${td}/rails`, '.rspec');
      const content = readFileSync(rspecPath, 'utf8');
      expect(content).toContain('--require rails_helper');
    });

    it('rails-api/.rspec が rails_helper と swagger_helper を require している', () => {
      const rspecPath = join(ROOT, `${td}/rails-api`, '.rspec');
      const content = readFileSync(rspecPath, 'utf8');
      expect(content).toContain('--require rails_helper');
      expect(content).toContain('--require swagger_helper');
    });

    it('sinatra/.rspec が spec_helper を require している', () => {
      const rspecPath = join(ROOT, `${td}/sinatra`, '.rspec');
      const content = readFileSync(rspecPath, 'utf8');
      expect(content).toContain('--require spec_helper');
    });
  });

  describe('.rubocop.yml ファイル', () => {
    it('rails-api/.rubocop.yml が shared の設定と一致する', () => {
      const generatedPath = join(ROOT, `${td}/rails-api`, '.rubocop.yml');
      const sharedPath = join(
        ROOT,
        'shared',
        'lint-format',
        'rubocop',
        'rubocop.rails_api.yml',
      );
      if (existsSync(generatedPath) && existsSync(sharedPath)) {
        const generated = readFileSync(generatedPath, 'utf8');
        const shared = readFileSync(sharedPath, 'utf8');
        // rails-api は deepMerge をスキップしているので、内容が一致するはず
        expect(generated).toBe(shared);
      }
    });

    it('rails/.rubocop.yml と rails-api/.rubocop.yml が異なる内容', () => {
      const railsPath = join(ROOT, `${td}/rails`, '.rubocop.yml');
      const railsApiPath = join(ROOT, `${td}/rails-api`, '.rubocop.yml');
      if (existsSync(railsPath) && existsSync(railsApiPath)) {
        const rails = readFileSync(railsPath, 'utf8');
        const railsApi = readFileSync(railsApiPath, 'utf8');
        expect(rails).not.toBe(railsApi);
      }
    });
  });
});
