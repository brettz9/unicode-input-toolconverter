// The known, stable column order historically used to build
//   `download/unihan/unihan.json`. `parseUnihanFromTextFileStrings` below
//   auto-appends any newly encountered field (e.g., from a Unihan standard
//   update) after this base order, keeping existing field positions stable
//   across re-downloads while never silently dropping new data. The
//   resulting order is returned so callers (see `tools/unihan-import.js`)
//   can persist it for `browser_action/unicodecharref.js`'s display code,
//   which must stay in sync since it reads values by position.
/* eslint-disable @stylistic/max-len -- Long */
const baseFields = ['code_pt', 'kAccountingNumeric', 'kAlternateTotalStrokes', 'kBigFive', 'kCCCII', 'kCNS1986', 'kCNS1992', 'kCangjie', 'kCantonese',
  'kCheungBauer', 'kCheungBauerIndex', 'kCihaiT', 'kCompatibilityVariant', 'kCowles', 'kDaeJaweon',
  'kDefinition', 'kEACC', 'kFenn', 'kFennIndex', 'kFourCornerCode', 'kFrequency', 'kGB0', 'kGB1', 'kGB3',
  'kGB5', 'kGB7', 'kGB8', 'kGSR', 'kGradeLevel', 'kHDZRadBreak', 'kHKGlyph', 'kHKSCS', 'kHanYu', 'kHangul',
  'kHanyuPinlu', 'kHanyuPinyin', 'kIBMJapan', 'kIICore', 'kIRGDaeJaweon', 'kIRGDaiKanwaZiten',
  'kIRGHanyuDaZidian', 'kIRGKangXi', 'kIRG_GSource', 'kIRG_HSource', 'kIRG_JSource', 'kIRG_KPSource',
  'kIRG_KSource', 'kIRG_MSource', 'kIRG_TSource', 'kIRG_USource', 'kIRG_VSource', 'kJIS0213', 'kJapaneseKun',
  'kJapaneseOn', 'kJis0', 'kJis1', 'kKPS0', 'kKPS1', 'kKSC0', 'kKSC1', 'kKangXi', 'kKarlgren', 'kKorean', 'kLau',
  'kMainlandTelegraph', 'kMandarin', 'kMatthews', 'kMeyerWempe', 'kMorohashi', 'kNelson', 'kOtherNumeric',
  'kPhonetic', 'kPrimaryNumeric', 'kPseudoGB1', 'kRSAdobe_Japan1_6', 'kRSJapanese', 'kRSKanWa', 'kRSKangXi',
  'kRSKorean', 'kRSUnicode', 'kSBGY', 'kSemanticVariant', 'kSimplifiedVariant', 'kSpecializedSemanticVariant',
  'kTaiwanTelegraph', 'kTang', 'kTotalStrokes', 'kTraditionalVariant', 'kVietnamese', 'kXHC1983', 'kXerox', 'kZVariant',
  'kUnihanCore2020', 'kIRG_UKSource', 'kIRG_SSource', 'kTGH', 'kKoreanName', 'kJa', 'kJoyoKanji', 'kKoreanEducationHanja',
  'kJinmeiyoKanji', 'kTGHZ2013', 'kSpoofingVariant', 'kStrange',
  'kSMSZD2003Index', 'kMojiJoho', 'kVietnameseNumeric', 'kZhuangNumeric', 'kTayNumeric',
  'kJapanese', 'kFanqie', 'kSMSZD2003Readings', 'kZhuang', 'kJapaneseOldVariant', 'kJapaneseNewVariant'];
/* eslint-enable @stylistic/max-len -- Long */

/**
 * @param {string[]} scriptFileAsStrings
 * @returns {{rows: string[][], fields: string[]}} `fields` includes the
 *   leading `code_pt` entry; each `rows[n][0]` is the code point.
 */
function parseUnihanFromTextFileStrings (scriptFileAsStrings) {
  const scriptFileAsStr = scriptFileAsStrings.join('');
  const lineRegex = /^U\+(?<cdpt>[\da-fA-F]{4,6})\t(?<col>\w+?)\t(?<value>.*)$/gvm;

  // Pass 1: discover the full field set before populating any rows, so
  //   every row ends up uniformly sized regardless of when a given field
  //   is first encountered.
  const knownFields = new Set(baseFields);
  const fields = [...baseFields];
  let line;
  while ((line = lineRegex.exec(scriptFileAsStr)) !== null) {
    const {col} = /** @type {{col: string}} */ (line.groups);
    if (!knownFields.has(col)) {
      knownFields.add(col);
      fields.push(col);
    }
  }
  const fieldPositions = new Map(fields.map((field, idx) => [field, idx]));

  // Pass 2: populate rows now that `fields` (and thus each row's length)
  //   is final.
  /** @type {Record<string, string[]>} */
  const obj = {};
  lineRegex.lastIndex = 0;
  while ((line = lineRegex.exec(scriptFileAsStr)) !== null) {
    // eslint-disable-next-line @stylistic/max-len -- Long
    const {cdpt, col, value} = /** @type {{cdpt: string, col: string, value: string}} */ (
      line.groups
    );
    if (!Object.hasOwn(obj, cdpt)) {
      obj[cdpt] = [];
      fields.forEach(function (val, idx) {
        obj[cdpt][idx] = '';
      });
      obj[cdpt][0] = cdpt;
    }
    obj[cdpt][/** @type {number} */ (fieldPositions.get(col))] = value;
  }

  return {rows: Object.values(obj), fields};
}

export default parseUnihanFromTextFileStrings;
