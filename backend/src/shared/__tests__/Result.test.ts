import { describe, it, expect } from 'vitest';
import { Result } from '../Result';

describe('Result', () => {
  describe('static methods', () => {
    it('okメソッドで成功結果を作成できること', () => {
      const result = Result.ok<number, Error>(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });

    it('errメソッドでエラー結果を作成できること', () => {
      const error = new Error('test error');
      const result = Result.err<number, Error>(error);
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
    });
  });

  describe('unwrap methods', () => {
    it('unwrapメソッドはOk結果から値を取り出せること', () => {
      const result = Result.ok<number, Error>(42);
      expect(result.unwrap()).toBe(42);
    });

    it('unwrapメソッドはErr結果でエラーをスローすること', () => {
      const error = new Error('test error');
      const result = Result.err<number, Error>(error);
      expect(() => result.unwrap()).toThrow('test error');
    });

    it('unwrapOrメソッドはOk結果から値を取り出せること', () => {
      const result = Result.ok<number, Error>(42);
      expect(result.unwrapOr(0)).toBe(42);
    });

    it('unwrapOrメソッドはErr結果でデフォルト値を返すこと', () => {
      const result = Result.err<number, Error>(new Error('test error'));
      expect(result.unwrapOr(0)).toBe(0);
    });

    it('unwrapErrメソッドはErr結果からエラーを取り出せること', () => {
      const error = new Error('test error');
      const result = Result.err<number, Error>(error);
      expect(result.unwrapErr()).toBe(error);
    });

    it('unwrapErrメソッドはOk結果でエラーをスローすること', () => {
      const result = Result.ok<number, Error>(42);
      expect(() => result.unwrapErr()).toThrow('Called unwrapErr on Ok value');
    });
  });

  describe('transformation methods', () => {
    it('mapメソッドでOk値を変換できること', () => {
      const result = Result.ok<number, Error>(42)
        .map(x => x.toString());
      expect(result.unwrap()).toBe('42');
    });

    it('mapメソッドはErr値を変換しないこと', () => {
      const error = new Error('test error');
      const result = Result.err<number, Error>(error)
        .map(x => x.toString());
      expect(result.unwrapErr()).toBe(error);
    });

    it('mapErrメソッドでErr値を変換できること', () => {
      const result = Result.err<number, string>('error')
        .mapErr(e => new Error(e));
      expect(result.unwrapErr()).toBeInstanceOf(Error);
      expect(result.unwrapErr().message).toBe('error');
    });

    it('mapErrメソッドはOk値を変換しないこと', () => {
      const result = Result.ok<number, string>(42)
        .mapErr(e => new Error(e));
      expect(result.unwrap()).toBe(42);
    });

    it('andThenメソッドでOk結果を連鎖できること', () => {
      const result = Result.ok<number, Error>(42)
        .andThen(x => Result.ok(x.toString()));
      expect(result.unwrap()).toBe('42');
    });

    it('andThenメソッドはErr結果を連鎖しないこと', () => {
      const error = new Error('test error');
      const result = Result.err<number, Error>(error)
        .andThen(x => Result.ok(x.toString()));
      expect(result.unwrapErr()).toBe(error);
    });

    it('andThenメソッドは連鎖中のエラーを伝播すること', () => {
      const result = Result.ok<number, Error>(42)
        .andThen(() => Result.err(new Error('chain error')));
      expect(result.unwrapErr().message).toBe('chain error');
    });
  });
});
