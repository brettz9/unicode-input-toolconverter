import {$} from '../vendor/jamilih/dist/jml-es.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';
import unicodecharref from './unicodecharref.js';

let charrefunicodeConverter, getPref, setPref;
export const shareVars = ({charrefunicodeConverter: _uc}) => {
  charrefunicodeConverter = _uc;
  ({getPref, setPref} = getUnicodeDefaults());
};

/**
 * @param {Event} e
 * @returns {Promise<void>}
 */
async function insertEntityFile (e) {
  const entFile = await fetch(
    '../download/entities/' + e.target.value + '.ent'
  );
  const data = await entFile.text();

  $('#DTDtextbox').value += '\n' + data;
  await registerDTD();
}

/**
 * @returns {Promise<{void}>}
 */
async function registerDTD () {
  // Cannot use back-reference inside char. class, so need to do twice
  const pattern = /<!ENTITY\s+([^'"\s]*)\s+(["'])(.*)\2\s*>/gu;

  const text = $('#DTDtextbox').value;
  await setPref('DTDtextbox', text);

  let result;

  // Reset in case charrefs or ents array deleted before and now want to
  //  go back to their original values.
  if (await getPref('appendtohtmldtd')) {
    charrefunicodeConverter.entities = [...unicodecharref.origents];
    charrefunicodeConverter.numericCharacterReferences = [
      ...unicodecharref.origcharrefs
    ];
  } else {
    charrefunicodeConverter.entities = [];
    charrefunicodeConverter.numericCharacterReferences = [];
  }

  // Start off blank in case items erased
  charrefunicodeConverter.newents = [...unicodecharref.orignewents];
  // Start off blank in case items erased
  charrefunicodeConverter.newcharrefs = [...unicodecharref.orignewcharrefs];

  const decreg = /^(?:&#|#)?(\d\d+);?$/u;
  // const decreg2 = /^(&#|#)([0-9]);?$/u;
  const hexreg = /^(?:&#|#|0|U|u)?(?:[xX+])([\da-fA-F]+);?$/u;

  while ((result = pattern.exec(text)) !== null) {
    let m = result[3];
    let addreg = true;
    if (decreg.test(m)) { // Dec
      m = m.replace(decreg, '$1');
      m = Number.parseInt(m);
    } else if (hexreg.test(m)) { // Hex
      m = m.replace(hexreg, '$1');
      m = Number.parseInt(m, 16);
    // Todo: Fix this so it can handle surrogate pairs
    // If replacing with Unicode sequence longer than one character, assume
    //  only wish to convert from entity (not from Unicode)
    } else if (m.length > 1) {
      addreg = false;
    } else {
      m = m.charCodeAt();
    }
    if (addreg) {
      // Used to ensure apos or amp is detected in same position
      charrefunicodeConverter.entities.unshift(result[1]);
      charrefunicodeConverter.numericCharacterReferences.unshift(m);
    // For translating entities into two-char+ Unicode, or hex or dec
    } else {
      charrefunicodeConverter.newents.push(result[1]);
      charrefunicodeConverter.newcharrefs.push(m); // Can be a string, etc.
    }
  }
}

/**
* @returns {void}
*/
function setupEntityEvents () {
  $('#insertEntityFile').addEventListener('change', async function (e) {
    await insertEntityFile(e);
  });
}

export {registerDTD, setupEntityEvents};
