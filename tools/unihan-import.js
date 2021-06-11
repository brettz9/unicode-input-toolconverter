import fs from 'fs/promises';

import download from 'download';
import extract from 'extract-zip';
import fetch from 'file-fetch';

const args = process.argv.slice(2);

const targetDir = `${process.cwd()}/data/unihan`;
const unihanZip = `${targetDir}/Unihan.zip`;
const targetJSONUnihan = `${targetDir}/unihan.json`;

if (args.includes('download')) {
  await download(
    'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip', targetDir
  );
}

if (args.includes('extract') || args.includes('download')) {
  await extract(unihanZip, {dir: targetDir});
  await fs.unlink(unihanZip);
}

addScript(targetDir);

/**
 * @param {string} baseURL
 * @returns {Promise<void>}
 */
async function addScript (baseURL) {
  /* eslint-disable max-len -- Long */
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
    'kTaiwanTelegraph', 'kTang', 'kTotalStrokes', 'kTraditionalVariant', 'kVietnamese', 'kXHC1983', 'kXerox', 'kZVariant',
    'kUnihanCore2020', 'kIRG_UKSource', 'kIRG_SSource', 'kTGH', 'kKoreanName', 'kJa', 'kJoyoKanji', 'kKoreanEducationHanja',
    'kJinmeiyoKanji', 'kTGHZ2013', 'kSpoofingVariant'];
  /* eslint-enable max-len -- Long */
  const scriptFileAsStr = (await Promise.all([
    'Unihan_DictionaryIndices.txt',
    'Unihan_DictionaryLikeData.txt',
    'Unihan_IRGSources.txt',
    'Unihan_NumericValues.txt',
    'Unihan_OtherMappings.txt',
    'Unihan_RadicalStrokeCounts.txt',
    'Unihan_Readings.txt',
    'Unihan_Variants.txt'
  ].map(async (file) => {
    const fileObj = await fetch(`${baseURL}/${file}`);
    return await fileObj.text();
  }))).join('');

  const notPresent = {};
  let line;
  const obj = {};
  const lineRegex = /^U\+(?<cdpt>[\da-fA-F]{4,6})\t(?<col>\w+?)\t(?<value>.*)$/gum;
  while ((line = (lineRegex).exec(scriptFileAsStr)) !== null) {
    const {cdpt, col, value} = line.groups;
    if (!obj[cdpt]) {
      obj[cdpt] = [];
      fields.forEach(function (val, idx) {
        obj[cdpt][idx] = '';
      });
      obj[cdpt][0] = cdpt;
    }
    const pos = fields.indexOf(col);
    if (pos === -1) {
      if (!notPresent[col]) {
        // eslint-disable-next-line no-console -- CLI
        console.error(`Not present: ${col}\n`);
        notPresent[col] = 1;
      }
      continue;
    }
    obj[cdpt][pos] = value;
  }

  await fs.writeFile(targetJSONUnihan, JSON.stringify(obj));
}
