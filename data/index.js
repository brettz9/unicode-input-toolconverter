jml(
		<tabpanel id="conversion" flex="1">
			<hbox id="conversionhbox" flex="1">
				<vbox pack="start" id="conversion_buttons_persist" persist="width">
					<description class="dialogheader" value="&Reconvert.dialogheader.title;"/>
					<button align="left" id="b1" class="reconvert" oncommand="Unicodecharref.charref2unicode(event);">&charref2unicode.label;</button>
					<button align="left" id="b2" class="reconvert" oncommand="Unicodecharref.charref2htmlents(event);">&charref2htmlents.label;</button>
					<button align="left" id="b3" class="reconvert" oncommand="Unicodecharref.unicode2charrefDec(event);">&unicode2charrefDec.label;</button>
					<button align="left" id="b4" class="reconvert" oncommand="Unicodecharref.unicode2charrefHex(event);">&unicode2charrefHex.label;</button>
					<button align="left" id="b3b" class="reconvert" oncommand="Unicodecharref.unicode2charrefDecSurrogate(event);" tooltiptext="&unicode2charrefSurrogate.tooltip;">&unicode2charrefDecSurrogate.label;</button>
					<button align="left" id="b4b" class="reconvert" oncommand="Unicodecharref.unicode2charrefHexSurrogate(event);" tooltiptext="&unicode2charrefSurrogate.tooltip;">&unicode2charrefHexSurrogate.label;</button>

					<button align="left" id="b5" class="reconvert" oncommand="Unicodecharref.unicode2htmlents(event);">&unicode2htmlents.label;</button>
					<hbox>
                        <button  flex="1" align="left" id="b6" class="reconvert" oncommand="Unicodecharref.unicode2jsescape(event);">&unicode2JSEscape.label;</button>
                        <button  flex="1" align="left" id="b7" class="reconvert" oncommand="Unicodecharref.unicodeTo6Digit(event);">&unicodeTo6Digit.label;</button>
                    </hbox>
					<button align="left" id="b8" class="reconvert" oncommand="Unicodecharref.unicode2cssescape(event);">&unicode2CSSEscape.label;</button>

					<button align="left" id="b9" class="reconvert" oncommand="Unicodecharref.htmlents2charrefDec(event);">&htmlents2charrefDec.label;</button>
					<button align="left" id="b10" class="reconvert" oncommand="Unicodecharref.htmlents2charrefHex(event);">&htmlents2charrefHex.label;</button>
					<button align="left" id="b11" class="reconvert" oncommand="Unicodecharref.htmlents2unicode(event);">&htmlents2unicode.label;</button>
					<button align="left" id="b12" class="reconvert" oncommand="Unicodecharref.hex2dec(event);">&hex2dec.label;</button>
					<button align="left" id="b13" class="reconvert" oncommand="Unicodecharref.dec2hex(event);">&dec2hex.label;</button>
                    
                    <hbox>
                        <button align="left" id="b14" class="reconvert" flex="1" oncommand="Unicodecharref.jsescape2unicode(event);">&jsescape2unicode.label;</button>
                        <button align="left" id="b15" class="reconvert" flex="1" oncommand="Unicodecharref.sixDigit2Unicode(event);">&sixDigit2unicode.label;</button>
                    </hbox>
                    
                    <button align="left" id="b16" class="reconvert" oncommand="Unicodecharref.cssescape2unicode(event);">&cssescape2unicode.label;</button>    
                    <hbox>
                        <button align="left" id="b17" class="reconvert" flex="1" oncommand="Unicodecharref.unicode2CharDesc(event);">&unicode2CharDesc.label;</button>
                        <button align="left" id="b18" class="reconvert" flex="1" oncommand="Unicodecharref.charDesc2Unicode(event);">&charDesc2Unicode.label;</button>
                    </hbox>
                    <html:div>
                        <html:label for="encoding_from">&Convert_From_Encoding;</html:label>
                        <html:select id="encoding_from" class="reconvert" multiple="multiple">
                            <html:option>UTF-8</html:option>
                            <html:option>ISO-8859-1</html:option>
<html:option>Big5</html:option>
<html:option>Big5-HKSCS</html:option>
<html:option>EUC-JP</html:option>
<html:option>EUC-KR</html:option>
<html:option>GB2312</html:option>
<html:option>GEOSTD8</html:option>
<html:option>HZ-GB-2312</html:option>
<html:option>IBM850</html:option>
<html:option>IBM852</html:option>
<html:option>IBM855</html:option>
<html:option>IBM857</html:option>
<html:option>IBM862</html:option>
<html:option>IBM864</html:option>
<html:option>IBM864i</html:option>
<html:option>IBM866</html:option>
<html:option>ISO-2022-CN</html:option>
<html:option>ISO-2022-JP</html:option>
<html:option>ISO-2022-KR</html:option>
<html:option>ISO-8859-1</html:option>
<html:option>ISO-8859-10</html:option>
<html:option>ISO-8859-11</html:option>
<html:option>ISO-8859-13</html:option>
<html:option>ISO-8859-14</html:option>
<html:option>ISO-8859-15</html:option>
<html:option>ISO-8859-16</html:option>
<html:option>ISO-8859-2</html:option>
<html:option>ISO-8859-3</html:option>
<html:option>ISO-8859-4</html:option>
<html:option>ISO-8859-5</html:option>
<html:option>ISO-8859-6</html:option>
<html:option>ISO-8859-6-E</html:option>
<html:option>ISO-8859-6-I</html:option>
<html:option>ISO-8859-7</html:option>
<html:option>ISO-8859-8</html:option>
<html:option>ISO-8859-8-E</html:option>
<html:option>ISO-8859-8-I</html:option>
<html:option>ISO-8859-9</html:option>
<html:option>ISO-IR-111</html:option>
<html:option>KOI8-R</html:option>
<html:option>KOI8-U</html:option>
<html:option>Shift_JIS</html:option>
<html:option>T.61-8bit</html:option>
<html:option>TIS-620</html:option>
<html:option>UTF-16</html:option>
<html:option>UTF-16BE</html:option>
<html:option>UTF-16LE</html:option>
<html:option>UTF-32</html:option>
<html:option>UTF-32BE</html:option>
<html:option>UTF-32LE</html:option>
<html:option>UTF-7</html:option>
<html:option>UTF-8</html:option>
<html:option>VISCII</html:option>
<html:option>armscii-8</html:option>
<html:option>gb18030</html:option>
<html:option>us-ascii</html:option>
<html:option>windows-1250</html:option>
<html:option>windows-1251</html:option>
<html:option>windows-1252</html:option>
<html:option>windows-1253</html:option>
<html:option>windows-1254</html:option>
<html:option>windows-1255</html:option>
<html:option>windows-1256</html:option>
<html:option>windows-1257</html:option>
<html:option>windows-1258</html:option>
<html:option>windows-874</html:option>
<html:option>windows-936</html:option>
<html:option>x-euc-tw</html:option>
<html:option>x-gbk</html:option>
<html:option>x-imap4-modified-utf7</html:option>
<html:option>x-johab</html:option>
<html:option>x-mac-arabic</html:option>
<html:option>x-mac-ce</html:option>
<html:option>x-mac-croatian</html:option>
<html:option>x-mac-cyrillic</html:option>
<html:option>x-mac-devanagari</html:option>
<html:option>x-mac-farsi</html:option>
<html:option>x-mac-greek</html:option>
<html:option>x-mac-gujarati</html:option>
<html:option>x-mac-gurmukhi</html:option>
<html:option>x-mac-hebrew</html:option>
<html:option>x-mac-icelandic</html:option>
<html:option>x-mac-roman</html:option>
<html:option>x-mac-romanian</html:option>
<html:option>x-mac-turkish</html:option>
<html:option>x-user-defined</html:option>
<html:option>x-viet-tcvn5712</html:option>
<html:option>x-viet-vps</html:option>
<html:option>x-windows-949</html:option>
                        </html:select>
                        <html:label for="encoding_to">&Convert_To_Encoding;</html:label>
                        <html:select id="encoding_to" class="reconvert" multiple="multiple">
                            <html:option>UTF-8</html:option>
                            <html:option>ISO-8859-1</html:option>
<html:option>Big5</html:option>
<html:option>Big5-HKSCS</html:option>
<html:option>EUC-JP</html:option>
<html:option>EUC-KR</html:option>
<html:option>GB2312</html:option>
<html:option>GEOSTD8</html:option>
<html:option>HZ-GB-2312</html:option>
<html:option>IBM850</html:option>
<html:option>IBM852</html:option>
<html:option>IBM855</html:option>
<html:option>IBM857</html:option>
<html:option>IBM862</html:option>
<html:option>IBM864</html:option>
<html:option>IBM864i</html:option>
<html:option>IBM866</html:option>
<html:option>ISO-2022-CN</html:option>
<html:option>ISO-2022-JP</html:option>
<html:option>ISO-2022-KR</html:option>
<html:option>ISO-8859-1</html:option>
<html:option>ISO-8859-10</html:option>
<html:option>ISO-8859-11</html:option>
<html:option>ISO-8859-13</html:option>
<html:option>ISO-8859-14</html:option>
<html:option>ISO-8859-15</html:option>
<html:option>ISO-8859-16</html:option>
<html:option>ISO-8859-2</html:option>
<html:option>ISO-8859-3</html:option>
<html:option>ISO-8859-4</html:option>
<html:option>ISO-8859-5</html:option>
<html:option>ISO-8859-6</html:option>
<html:option>ISO-8859-6-E</html:option>
<html:option>ISO-8859-6-I</html:option>
<html:option>ISO-8859-7</html:option>
<html:option>ISO-8859-8</html:option>
<html:option>ISO-8859-8-E</html:option>
<html:option>ISO-8859-8-I</html:option>
<html:option>ISO-8859-9</html:option>
<html:option>ISO-IR-111</html:option>
<html:option>KOI8-R</html:option>
<html:option>KOI8-U</html:option>
<html:option>Shift_JIS</html:option>
<html:option>T.61-8bit</html:option>
<html:option>TIS-620</html:option>
<html:option>UTF-16</html:option>
<html:option>UTF-16BE</html:option>
<html:option>UTF-16LE</html:option>
<html:option>UTF-32</html:option>
<html:option>UTF-32BE</html:option>
<html:option>UTF-32LE</html:option>
<html:option>UTF-7</html:option>
<html:option>UTF-8</html:option>
<html:option>VISCII</html:option>
<html:option>armscii-8</html:option>
<html:option>gb18030</html:option>
<html:option>us-ascii</html:option>
<html:option>windows-1250</html:option>
<html:option>windows-1251</html:option>
<html:option>windows-1252</html:option>
<html:option>windows-1253</html:option>
<html:option>windows-1254</html:option>
<html:option>windows-1255</html:option>
<html:option>windows-1256</html:option>
<html:option>windows-1257</html:option>
<html:option>windows-1258</html:option>
<html:option>windows-874</html:option>
<html:option>windows-936</html:option>
<html:option>x-euc-tw</html:option>
<html:option>x-gbk</html:option>
<html:option>x-imap4-modified-utf7</html:option>
<html:option>x-johab</html:option>
<html:option>x-mac-arabic</html:option>
<html:option>x-mac-ce</html:option>
<html:option>x-mac-croatian</html:option>
<html:option>x-mac-cyrillic</html:option>
<html:option>x-mac-devanagari</html:option>
<html:option>x-mac-farsi</html:option>
<html:option>x-mac-greek</html:option>
<html:option>x-mac-gujarati</html:option>
<html:option>x-mac-gurmukhi</html:option>
<html:option>x-mac-hebrew</html:option>
<html:option>x-mac-icelandic</html:option>
<html:option>x-mac-roman</html:option>
<html:option>x-mac-romanian</html:option>
<html:option>x-mac-turkish</html:option>
<html:option>x-user-defined</html:option>
<html:option>x-viet-tcvn5712</html:option>
<html:option>x-viet-vps</html:option>
<html:option>x-windows-949</html:option>
                        </html:select>
                    </html:div>
				</vbox>
                <splitter/>
				<vbox flex="1" id="toconvert_persist" persist="width">
<!--				<description class="dialogheader" value="&uresults.value;"/> -->
					<label id="toconvert_persist_label" control="toconvert" value="&uresults.preconverted;" />
					<textbox flex="1" multiline="true" id="toconvert" value="&uresults.value;" persist="height"/>
					<splitter resizeafter="flex" resizebefore="flex" />
					<label control="converted" value="&uresults.converted;" />
					<textbox flex="1" id="converted" persist="height" cols="2" rows="5" value="&default.textbox.value;" multiline="true" />
					<hbox align="center" flex="1">
						<label value="&label.fontsize;"/>
						<button class="fontsize" label="+" oncommand="Unicodecharref.fsizetextbox(+1);"/>
						<button class="fontsize" label="-" oncommand="Unicodecharref.fsizetextbox(-1);"/>
						<description value="&#160;&#160;&#160;&#160;&#160;&#160;&#160;"/>
						<button label="&moveconvertedup.label;" oncommand="Unicodecharref.moveoutput('converted');"/>
					</hbox>
				</vbox>
			</hbox>
		</tabpanel>
		<tabpanel id="prefs" flex="1">
			<vbox align="center" flex="1">
				<description class="dialogheader" value="&Preferences.dialogheader.title;"/>
				<vbox class="boxed" id="DownloadButtonBox" tooltiptext="&Download_unihan_tooltip;">
					<button label="&DownloadUnihan;" oncommand="Unicodecharref.downloadUnihan()" />
				</vbox>
				<vbox class="boxed" id="DownloadProgressBox" hidden="true">
					<label id="progress_stat"/>
	                <progressmeter id="progress_element" mode="determined"/>
					<button id="closeDownloadProgressBox"
						hidden="true" label="&Close;" oncommand="Unicodecharref.closeDownloadProgressBox()" />
				</vbox>
				<vbox class="boxed" id="UnihanInstalled">
					<description>&UnihanInstalled;</description>
				</vbox>

				<vbox class="boxed">
					<label control="extensions.charrefunicode.initialTab">&initialTab.label;</label>
                    <menulist id="extensions.charrefunicode.initialTab" oncommand="Unicodecharref.setprefs(event);">
                        <menupopup>
                            <menuitem id="mi_charttab" value="charttab" label="&Charts.tab.label;" />
                            <menuitem id="mi_conversiontab" value="conversiontab" label="&Conversion.tab.label;" />
                            <menuitem id="mi_prefstab" value="prefstab" label="&Prefs.tab.label;" />
                            <menuitem id="mi_dtdtab" value="dtdtab" label="&DTD.tab.label;" />
                            <menuitem id="mi_notestab" value="notestab" label="&Notes.tab.label;" />
                            <menuitem id="mi_abouttab" value="abouttab" label="&About.tab.label;" />							
                        </menupopup>
                    </menulist>
				</vbox>

				
				<vbox class="boxed">
					<!-- Couldn't use oncommand with checkbox for some reason, so set both onclick and onkeypress -->
					<checkbox id="extensions.charrefunicode.asciiLt128" label="&Ascii.checkbox.label;" class="prefdescription" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
				</vbox>


				<!--<radiogroup onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;" id="extensions.charrefunicode.hexstyleLwr">
					<description value="&xstyle.description;" class="prefdescription topofpanel"/>
					<hbox>
						<radio label="x" id="_1-extensions.charrefunicode.hexstyleLwr" class="indentedradio"/>
						<radio label="X" id="_2-extensions.charrefunicode.hexstyleLwr"/>
					</hbox>
				</radiogroup>-->
				<vbox class="boxed">
					<checkbox id="extensions.charrefunicode.hexLettersUpper" label="&Hexletters.checkbox.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
				</vbox>
				<vbox class="boxedbottom">
					<checkbox id="extensions.charrefunicode.xhtmlentmode" label="&xhtmlentmode.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
				</vbox>
				<vbox class="boxedbottom">
					<checkbox id="extensions.charrefunicode.xmlentkeep" label="&xmlentmode.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
				</vbox>
				<vbox class="boxedbottom">
					<checkbox id="extensions.charrefunicode.ampkeep" label="&ampkeep.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
				</vbox>
				<vbox class="boxedbottom">
					<checkbox id="extensions.charrefunicode.ampspace" label="&ampspace.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
				</vbox>
				<vbox class="boxedbottom">
					<checkbox id="extensions.charrefunicode.showComplexWindow" label="&showComplexWindow.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);Unicodecharref.testIfComplexWindow();return false;" onkeypress="Unicodecharref.setprefs(event);Unicodecharref.testIfComplexWindow();return false;"/>
				</vbox>
                
                
				<vbox class="boxedbottom">
					<checkbox id="extensions.charrefunicode.cssUnambiguous" label="&cssUnambiguous.label;" class="prefdescription topofpanel" onclick="Unicodecharref.setprefs(event);return false;" onkeypress="Unicodecharref.setprefs(event);return false;"/>
                    <label control="CSSWhitespace">&CSSWhitespace.label;</label>
                    <menulist id="CSSWhitespace" oncommand="Unicodecharref.cssWhitespace(event);">
                        <menupopup>
                            <menuitem value="space" label="&CSS_space;" />
                            <menuitem value="rn" label="&CSS_rn;" />
                            <menuitem value="r" label="&CSS_r;" />
                            <menuitem value="n" label="&CSS_n;" />
                            <menuitem value="t" label="&CSS_t;" />
                            <menuitem value="f" label="&CSS_f;" />
                        </menupopup>
                    </menulist>
				</vbox>                
				<button id="resetdefaultbutton" label="&resettodefault.label;" oncommand="Unicodecharref.resetdefaults();"/>

			</vbox>
		</tabpanel>
);
