import {
  composeHangul, getJamoForIndex, decomposeHangul, getHangulName
} from '../../browser_action/unicode/hangul.js';

describe('Hangul', function () {
  describe('composeHangul', function () {
    it('composeHangul on empty string returns empty string', function () {
      expect(composeHangul('')).to.equal('');
    });
  });

  describe('getJamoForIndex', function () {
    it('getJamoForIndex throws with bad type', function () {
      expect(() => {
        getJamoForIndex();
      }).to.throw('Unexpected type passed to getJamoCodePointForName');
    });
  });

  describe('decomposeHangul', function () {
    it('Decomposes Hangul', function () {
      expect(decomposeHangul(0xAC01)).to.deep.equal([
        'ᄀ', 'ᅡ', 'ᆨ'
      ]);

      expect(decomposeHangul(0x100)).to.equal('Ā');
    });
  });

  describe('getHangulName', function () {
    it('throws if not a Hangul syllable', function () {
      expect(() => {
        getHangulName(100);
      }).to.throw('Not a hangul syllable 100');

      expect(() => {
        getHangulName(0xAC00 + 11172 + 1);
      }).to.throw('Not a hangul syllable 55205');
    });
  });
});
