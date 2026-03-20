import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger, createLogger } from '../lib/logger.js';

describe('Logger', () => {
  let logger: Logger;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new Logger();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('info', () => {
    it('メッセージをコンソールに出力する', () => {
      logger.info('Test message');
      expect(logSpy).toHaveBeenCalledWith('Test message');
    });
  });

  describe('warn', () => {
    it('警告アイコン付きでメッセージを出力する', () => {
      logger.warn('Warning message');
      expect(warnSpy).toHaveBeenCalledWith('⚠️  Warning message');
    });
  });

  describe('error', () => {
    it('エラーアイコン付きでメッセージを出力する', () => {
      logger.error('Error message');
      expect(errorSpy).toHaveBeenCalledWith('❌ Error message');
    });

    it('Error オブジェクトを受け取るとメッセージを出力する', () => {
      const testError = new Error('Test error');
      logger.error('Failed', testError);
      expect(errorSpy).toHaveBeenCalledWith('❌ Failed');
      expect(errorSpy).toHaveBeenCalledWith('   Test error');
    });
  });

  describe('success', () => {
    it('成功アイコン付きでメッセージを出力する', () => {
      logger.success('Operation completed');
      expect(logSpy).toHaveBeenCalledWith('✓ Operation completed');
    });
  });

  describe('generated', () => {
    it('ファイルパスをインデント付きで出力する', () => {
      logger.generated('/path/to/file.txt');
      expect(logSpy).toHaveBeenCalledWith('  Generated: /path/to/file.txt');
    });
  });

  describe('debug', () => {
    it('verbose が false のときは出力しない', () => {
      const silentLogger = new Logger({ verbose: false });
      silentLogger.debug('Debug message');
      expect(logSpy).not.toHaveBeenCalled();
    });

    it('verbose が true のときは出力する', () => {
      const verboseLogger = new Logger({ verbose: true });
      verboseLogger.debug('Debug message');
      expect(logSpy).toHaveBeenCalledWith('[DEBUG] Debug message', '');
    });
  });

  describe('start/end timing', () => {
    it('verbose mode で start/end を呼ぶと所要時間を出力する', () => {
      const verboseLogger = new Logger({ verbose: true });
      verboseLogger.start('operation');
      verboseLogger.end('operation');
      expect(logSpy).toHaveBeenCalledWith('⏱️  Starting: operation');
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/⏱️ {2}Completed: operation \(\d+ms\)/),
      );
    });

    it('silent mode で start/end は出力しない', () => {
      logger.start('operation');
      logger.end('operation');
      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});

describe('createLogger', () => {
  it('新しい Logger インスタンスを返す', () => {
    const newLogger = createLogger({ verbose: true });
    expect(newLogger instanceof Logger).toBe(true);
  });

  it('オプションを Logger に渡す', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const verboseLogger = createLogger({ verbose: true });
    verboseLogger.debug('Test');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
