import {$} from '../vendor/jamilih/dist/jml-es.js';
import CharrefunicodeConsts from './unicode/CharrefunicodeConsts.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';
import Unicodecharref from './uresults.js';

let charrefunicodeConverter, getPref, setPref;
export const shareVars = ({charrefunicodeConverter: _uc}) => {
  charrefunicodeConverter = _uc;
  ({getPref, setPref} = getUnicodeDefaults());
};

async function insertEntityFile (e) {
  const entFile = await fetch('../data/entities/' + e.target.value + '.ent');
  const data = await entFile.text();

  $('#DTDtextbox').value += '\n' + data;
  registerDTD();
}

async function registerDTD () {
  // Cannot use back-reference inside char. class, so need to do twice
  const pattern = /<!ENTITY\s+([^'"\s]*)\s+(["'])(.*)\2\s*>/g;

  const text = $('#DTDtextbox').value;
  setPref('DTDtextbox', text);

  let result;

  // Reset in case charrefs or ents array deleted before and now want to go back to their original values.
  if (await getPref('appendtohtmldtd')) {
    CharrefunicodeConsts.Entities = [...Unicodecharref.origents];
    CharrefunicodeConsts.NumericCharacterReferences = [...Unicodecharref.origcharrefs];
  } else {
    CharrefunicodeConsts.Entities = [];
    CharrefunicodeConsts.NumericCharacterReferences = [];
  }

  charrefunicodeConverter.newents = [...Unicodecharref.orignewents]; // Start off blank in case items erased
  charrefunicodeConverter.newcharrefs = [...Unicodecharref.orignewcharrefs]; // Start off blank in case items erased

  const decreg = /^(&#|#)?(\d\d+);?$/;
  // const decreg2 = /^(&#|#)([0-9]);?$/;
  const hexreg = /^(&#|#|0|U|u)?([xX+])([\da-fA-F]+);?$/;

  while ((result = pattern.exec(text)) !== null) {
    let m = result[3];
    let addreg = true;
    if (decreg.test(m)) { // Dec
      m = m.replace(decreg, '$2');
      m = Number.parseInt(m);
    } else if (hexreg.test(m)) { // Hex
      m = m.replace(hexreg, '$2');
      m = Number.parseInt(m, 16);
    // Todo: Fix this so it can handle surrogate pairs
    } else if (m.length > 1) { // If replacing with Unicode sequence longer than one character, assume only wish to convert from entity (not from Unicode)
      addreg = false;
    } else {
      m = m.charCodeAt();
    }
    if (addreg) {
      charrefunicodeConverter.shiftcount += 1; // Used to ensure apos or amp is detected in same position
      CharrefunicodeConsts.Entities.unshift(result[1]);
      CharrefunicodeConsts.NumericCharacterReferences.unshift(m);
    } else { // For translating entities into two-char+ Unicode, or hex or dec
      charrefunicodeConverter.newents.push(result[1]);
      charrefunicodeConverter.newcharrefs.push(m); // Can be a string, etc.
    }
  }
}

export {insertEntityFile, registerDTD};