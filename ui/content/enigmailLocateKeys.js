/*global Components: false*/
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint no-invalid-this: 0 */

"use strict";

const Cu = Components.utils;
const Ci = Components.interfaces;
const Cc = Components.classes;

Cu.import("resource://enigmail/core.jsm"); /*global EnigmailCore: false */
Cu.import("resource://enigmail/log.jsm"); /*global EnigmailLog: false */
Cu.import("resource://enigmail/locale.jsm"); /*global EnigmailLocale: false */
Cu.import("resource://enigmail/keyserver.jsm"); /*global EnigmailKeyServer: false */
Cu.import("resource://enigmail/errorHandling.jsm"); /*global EnigmailErrorHandling: false */
Cu.import("resource://enigmail/webKey.jsm"); /*global EnigmailWks: false */
Cu.import("resource://enigmail/data.jsm"); /*global EnigmailData: false */
Cu.import("resource://enigmail/dialog.jsm"); /*global EnigmailDialog: false */
Cu.import("resource://enigmail/gpgAgent.jsm"); /*global EnigmailGpgAgent: false */
Cu.import("resource://enigmail/execution.jsm"); /*global EnigmailExecution: false */
Cu.import("resource://enigmail/keyRing.jsm"); /*global EnigmailKeyRing: false */
Cu.import("resource://enigmail/keyEditor.jsm"); /*global EnigmailKeyEditor: false */

function onLoad() {
	try {
		document.getElementById("dialog.status2").value = "Locating Keys...";
		var progressDlg = document.getElementById("dialog.progress");
		progressDlg.setAttribute("mode", "undetermined");

		var inArg = window.arguments[0].toAddr.toString();
		EnigmailLog.DEBUG("enigmailLocateKeys.js: to: " + inArg + "\n");

		var keys = EnigmailKeyRing.getKeysByUserId(inArg);

		for(var i = 0; i < keys.length; i += 1) {
			EnigmailLog.DEBUG(keys[i].fpr);
		}

		if (keys.length === 0) {
			let listener = EnigmailExecution.newSimpleListener(null, function(ret) {
				EnigmailLog.DEBUG(listener.stdoutData);
				EnigmailLog.DEBUG(listener.stderrData);
				if (ret === 0) {
					EnigmailKeyRing.clearCache();
				}
				progressDlg.setAttribute("value", 100);
				progressDlg.setAttribute("mode", "normal");
				window.close();
			});
			let proc = EnigmailExecution.execStart(EnigmailGpgAgent.agentPath, [
				"--verbose",
				"--auto-key-locate", "wkd,keyserver",
				"--locate-keys"].concat(inArg.split(",")), false, window, listener, {
					value: null
				});
		} else {
			progressDlg.setAttribute("value", 100);
			progressDlg.setAttribute("mode", "normal");
			window.close();
		}
	}
  catch (ex) {
    EnigmailLog.DEBUG(ex);
  }
}
function onAccept() {}
