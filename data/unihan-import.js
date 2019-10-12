// Not fully reimplemented (see `uksort`, test, etc.)
// Setup to overcome restriction on file:// URLS in Firefox (Chrome, Opera disallow, but works in Safari)
function $ (sel) {
  return document.querySelector(sel);
}
function addScript (files, checkVars, cb, checkback) {
  if (typeof files === 'string') {
    files = [files];
    checkVars = [checkVars];
  }
  let baseURL;
  for (let i = 0, filelen = files.length; i < filelen; i++) {
    const file = files[i];
    baseURL = location.href.substring(0, location.href.lastIndexOf('/') + 1);
    const script = document.createElement('script');
    script.src = baseURL + file;
    $('head').append(script);
  }
  const interval = setInterval(() => {
    for (let j = 0, cvl = checkVars.length; j < cvl; j++) {
      if (typeof window[checkVars[j]] === 'undefined') {
        return;
      }
      checkVars.splice(j, 1);
    }
    clearInterval(interval);
    cb(baseURL);
  }, checkback || 100);
}

addScript(['file_get_and_ksort.min.js', 'import-helpers.js'], ['file_get_contents', '$'], async function (baseURL) {
  const fields = ['code_pt', 'kAccountingNumeric', 'kBigFive', 'kCCCII', 'kCNS1986', 'kCNS1992', 'kCangjie', 'kCantonese',
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
    'kTaiwanTelegraph', 'kTang', 'kTotalStrokes', 'kTraditionalVariant', 'kVietnamese', 'kXHC1983', 'kXerox', 'kZVariant'];
  baseURL += 'unihan/';
  let scriptFileAsStr = (await Promise.all([
    'Unihan_DictionaryIndices.txt',
    'Unihan_DictionaryLikeData.txt',
    'Unihan_IRGSources.txt',
    'Unihan_NumericValues.txt',
    'Unihan_OtherMappings.txt',
    'Unihan_RadicalStrokeCounts.txt',
    'Unihan_Readings.txt',
    'Unihan_Variants.txt'
  ].map((file) => {
    return fetch(baseURL + file);
  }))).join('');

  let line;
  const obj = {}, lineRegex = /^U\+([\da-fA-F]{4,6})\t(\w+?)\t(.*)$/gm;
  while ((line = (lineRegex).exec(scriptFileAsStr)) !== null) {
    const cdpt = line[1], col = line[2], value = line[3];
    if (!obj[cdpt]) {
      obj[cdpt] = [];
      fields.forEach(function (value, idx) {
        obj[cdpt][idx] = '';
      });
      obj[cdpt][0] = cdpt;
    }
    const pos = fields.indexOf(col);
    if (pos === -1) {
      $('#errors').value += 'Not present: ' + col + '\n';
    }
    obj[cdpt][pos] = value;
  }
  uksort(obj, function (k1, k2) {
    return parseInt(k1, 16) > parseInt(k2, 16);
  });
  // Works but FF crashes with this--Chrome is ok
  scriptFileAsStr = '';
  Object.values(obj).forEach((val) => {
    // $('#results').value += JSON.stringify(val).slice(1, -1) + '\n';
    scriptFileAsStr += JSON.stringify(val).slice(1, -1) + '\n';
  });
  $('#results').value = scriptFileAsStr;
  // $('#results').value = JSON.stringify(obj);
});
