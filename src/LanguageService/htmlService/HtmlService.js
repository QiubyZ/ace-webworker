import HtmlService from "ace-linters/build/html-service";
import * as lsp from "vscode-languageserver-protocol";

export class CustomHtmlService extends HtmlService {
	constructor(mode) {
		super(mode);
	}

	serviceCapabilities = {
		completionProvider: {
			triggerCharacters: ["<", ".", "(", '"', "'", "=", ":", "@", "*"], // Tambahkan trigger chars untuk JS
			resolveProvider: true,
		},
		diagnosticProvider: {
			interFileDependencies: true,
			workspaceDiagnostics: true,
		},
		documentRangeFormattingProvider: true,
		documentFormattingProvider: true,
		documentHighlightProvider: true,
		hoverProvider: true,
		// Tambahkan capability untuk JavaScript
		textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
		signatureHelpProvider: {
			triggerCharacters: ["(", ","],
		},
		definitionProvider: true,
		referencesProvider: true,
	};
}
