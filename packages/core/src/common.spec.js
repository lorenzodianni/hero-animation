import * as common from './common';

describe('common', () => {

  describe('.css', () => {
    test('should be exported', () => {
      expect(common.css).toBeDefined();
    });

    test('should style an element', () => {
      expect(document.body.getAttribute('style')).toBeFalsy();
      common.css(document.body, {
        backgroundColor: 'red',
        margin: '10px',
      });
      expect(document.body.getAttribute('style')).toBe('background-color: red; margin: 10px;');
      document.body.removeAttribute('style');
    });
  });

  describe('.ensureFunction', () => {
    test('should be exported', () => {
      expect(common.ensureFunction()).toBeDefined();
    });

    test('should return always a function', () => {
      expect(typeof common.ensureFunction(null)).toBe('function');
      expect(typeof common.ensureFunction('test')).toBe('function');
      expect(typeof common.ensureFunction()).toBe('function');
      const ensureSum = common.ensureFunction((a, b) => a + b);
      expect(typeof ensureSum).toBe('function');
      expect(ensureSum(2, 3)).toBe(5);
    });
  });

});