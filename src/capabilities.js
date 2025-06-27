Capability() {
	return {
		textDocument: {
			diagnostic: {
				dynamicRegistration: true,
				relatedDocumentSupport: true,
			},
			publishDiagnostics: {
				relatedInformation: true,
				versionSupport: false,
				// tagSupport: {
				// 	valueSet: [lsp.DiagnosticTag.Unnecessary, lsp.DiagnosticTag.Deprecated],
				// },
			},
			hover: {
				dynamicRegistration: true,
				contentFormat: ["markdown", "plaintext"],
			},
			synchronization: {
				dynamicRegistration: true,
				willSave: false,
				didSave: false,
				willSaveWaitUntil: false,
			},
			formatting: {
				dynamicRegistration: true,
			},
			completion: {
				dynamicRegistration: true,
				completionItem: {
					snippetSupport: true,
					commitCharactersSupport: false,
					documentationFormat: ["markdown", "plaintext"],
					deprecatedSupport: false,
					preselectSupport: false,
				},
				contextSupport: false,
			},
			signatureHelp: {
				signatureInformation: {
					documentationFormat: ["markdown", "plaintext"],
					activeParameterSupport: true,
				},
			},
			documentHighlight: {
				dynamicRegistration: true,
			},
			semanticTokens: {
				multilineTokenSupport: false,
				overlappingTokenSupport: false,
				tokenTypes: [],
				tokenModifiers: [],
				formats: ["relative"],
				requests: {
					full: {
						delta: false,
					},
					range: true,
				},
				augmentsSyntaxTokens: true,
			},
			codeAction: {
				dynamicRegistration: true,
			},
			inlineCompletion: {
				dynamicRegistration: true,
			},
		},
		// 		window: {
		// 			showDocument: {
		// 				support: true,
		// 			},
		// 		},
		workspace: {
			didChangeConfiguration: {
				dynamicRegistration: true,
			},
			executeCommand: {
				dynamicRegistration: true,
			},
			applyEdit: true,
			workspaceEdit: {
				failureHandling: "abort",
				normalizesLineEndings: false,
				documentChanges: false,
			},
		},
	};
}
