/*
Copyright 2007, 2008, 2009 Brett Zamir
    This file is part of Unicode Input Tool/Converter.

    Unicode Input Tool/Converter is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Unicode Input Tool/Converter is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with Unicode Input Tool/Converter.  If not, see <http://www.gnu.org/licenses/>.
*/

		if (canreturn) { // Return if Unihan database not supported but already did query on regular Unicode
                    return;
                }

                // Fix: Currently only need for Hangul and that should be in database, or have derivation formula applied
                var path = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile).path;
		var datapath = path+'/extensions/charrefunicode@brett.zamir/data/';
		var url = "file:///"+datapath+file;
		var request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			try {
				if (request.readyState == 4) { // If request finished
					if (request.status == 200 || request.status == 0) { // If successful
						// alert(request.responseText); // Display response
						var result;
						var plainfound = false;

						if (this.UnihanType) {
							while ((result = pattern.exec(request.responseText)) != null) {
								if (result != null && result[1] != undefined) {
									if (result[2] != undefined) {
										result[1] = result[2];
									}
									if (result[3] != undefined) {
										result[1] += ' '+result[3];
									}
									if (!plainfound) {
										document.getElementById('displayUnicodeDesc').value = kent+"U+"+khextemp+s.getString('colon')+' '+result[1];
									}
									else {
										document.getElementById('displayUnicodeDesc').value += '; '+result[1];
									}
									plainfound = true;
								}
							}
						}
						else {
							result = pattern.exec(request.responseText);
							if (result != null && result[1] != undefined) {
								if (result[2] != undefined) {
									result[1] = result[2];
								}
								if (result[3] != undefined) {
									result[1] += ' '+result[3];
								}
								if (!plainfound) {
									document.getElementById('displayUnicodeDesc').value = kent+"U+"+khextemp+s.getString('colon')+' '+result[1];
								}
								else {
									document.getElementById('displayUnicodeDesc').value += '; '+result[1];
								}
								plainfound = true;
							}
                                                        else if (surrogate) {
                                                                document.getElementById('displayUnicodeDesc').value = kent+"U+"+khextemp+s.getString('colon')+' '+surrogate;
                                                                plainfound = true; // ?
                                                        }
                                                        else if (privateuse) {
                                                                document.getElementById('displayUnicodeDesc').value = kent+"U+"+khextemp+s.getString('colon')+' '+s.getString('Private_use_character');
                                                                plainfound = true; // ?
                                                        }
                                                        else if ( // Catch noncharacters
                                                              (kdectemp >= 0xFDD0 && kdectemp <= 0xFDEF) ||
                                                              (kdectemp >= 0xFFFE && kdectemp <= 0xFFFF) ||
                                                              (kdectemp >= 0x1FFFE && kdectemp <= 0x1FFFF) ||
                                                              (kdectemp >= 0x2FFFE && kdectemp <= 0x2FFFF) ||
                                                              (kdectemp >= 0x3FFFE && kdectemp <= 0x3FFFF) ||
                                                              (kdectemp >= 0x4FFFE && kdectemp <= 0x4FFFF) ||
                                                              (kdectemp >= 0x5FFFE && kdectemp <= 0x5FFFF) ||
                                                              (kdectemp >= 0x6FFFE && kdectemp <= 0x6FFFF) ||
                                                              (kdectemp >= 0x7FFFE && kdectemp <= 0x7FFFF) ||
                                                              (kdectemp >= 0x8FFFE && kdectemp <= 0x8FFFF) ||
                                                              (kdectemp >= 0x9FFFE && kdectemp <= 0x9FFFF) ||
                                                              (kdectemp >= 0xAFFFE && kdectemp <= 0xAFFFF) ||
                                                              (kdectemp >= 0xBFFFE && kdectemp <= 0xBFFFF) ||
                                                              (kdectemp >= 0xCFFFE && kdectemp <= 0xCFFFF) ||
                                                              (kdectemp >= 0xDFFFE && kdectemp <= 0xDFFFF) ||
                                                              (kdectemp >= 0xEFFFE && kdectemp <= 0xEFFFF) ||
                                                              (kdectemp >= 0xFFFFE && kdectemp <= 0xFFFFF) ||
                                                              (kdectemp >= 0x10FFFE && kdectemp <= 0x10FFFF)
                                                              ) {
                                                                  document.getElementById('displayUnicodeDesc').value = kent+"U+"+khextemp+s.getString('colon')+' '+s.getString('Noncharacter');
                                                                  plainfound = true; // ?
                                                        }
						}
						if (!plainfound && hangul) {
							var pattern_hangul = new RegExp("^([\\dA-F]{4,5})\\.\\.([\\dA-F]{4,5})\\s*;\\s*(.*)$", "mg");

							var temphangul, ii=0;

							var found = false;

							while ((temphangul = pattern_hangul.exec(request.responseText)) != null) {
								//alert(temphangul.source);
								if ((kdectemp >= parseInt("0x"+temphangul[1], 16)) && (kdectemp <= parseInt("0x"+temphangul[2], 16))) {
									document.getElementById('displayUnicodeDesc').value= kent+"U+"+khextemp+s.getString('colon')+' '+temphangul[3];
									found = true;
									break;
								}
							}

							if (!found) {
								document.getElementById('displayUnicodeDesc').value= "U+"+khextemp+s.getString('colon')+' '+s.getString('Not_found_hangul');
							}
						}
						else if (!plainfound) {
							var notfoundval = "U+"+khextemp+s.getString('colon')+' '+s.getString('Not_found');
							//var rangestr = '-'+Number(kdectemp).toString(16).toUpperCase(); // I thought section 4.8 of http://www.unicode.org/versions/Unicode5.0.0/ch04.pdf might recommend this, but this seems to be only for ideographs
							document.getElementById('displayUnicodeDesc').value = notfoundval;
							// document.getElementById('displayUnicodeDesc').value = tn+rangestr;
						}
					}
					else {
						document.getElementById('displayUnicodeDesc').value= s.getString('Request_status')+request.status;
					}
				}
				else if (request.readyState == 3) {
					document.getElementById('displayUnicodeDesc').value= s.getString('retrieving_description');
//					alert("rs:"+request.readyState);
				}
			}
			catch (e) {
				// Was getting document is null error
//				document.getElementById('displayUnicodeDesc').value= e+e.description;
			}
		}
		request.open("GET", url);
		request.overrideMimeType('text/plain');
		request.send(null);
