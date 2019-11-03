import {$} from '../vendor/jamilih/dist/jml-es.js';

// UI Bridges
export const convertEncoding = (out) => {
  const from = $('#encoding_from').value,
    to = $('#encoding_to').value,
    toconvert = out;

  if (!from || !to) {
    return;
  }

  const Components = 'todo';
  const Cc = Components.classes,
    Ci = Components.interfaces;
  const cnv = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
  cnv.charset = from; // The charset to use
  const os = cnv.convertToInputStream(toconvert);

  const replacementChar = Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER; // Fix: could customize
  const is = Cc['@mozilla.org/intl/converter-input-stream;1'].createInstance(Ci.nsIConverterInputStream);
  is.init(os, to, 1024, replacementChar);
  const str = {};
  let output = '';
  while (is.readString(4096, str) !== 0) {
    output += str.value;
  }
  os.close();
  $('#converted').value = output;
  /*
  const cv = Cc['@mozilla.org/intl/scriptableunicodeconverter'].getService(Ci.nsIScriptableUnicodeConverter);
  cv.charset = to;
  const unicode_str = cv.ConvertToUnicode(toconvert);
  cv.charset = from;
  $('#converted').value = cv.ConvertFromUnicode(unicode_str);
  */
};
