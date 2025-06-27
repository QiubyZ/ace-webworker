import { AceLanguageClient } from "ace-linters/build/ace-language-client";
let { editor } = editorManager;
import {
	ReconnectingWebSocket,
	formatUrl,
	unFormatUrl,
	getFolderName,
	getCodeLens,
} from "./utils.js";

export class Client {
	workSpaceFolderUri = null;
	languageProvider = null;

	constructor() {
	    
	}

	async initialize() {
	    
		const serverConfig = [
			{
				features: {
					completion: true,
					completionResolve: true,
					diagnostics: true,
					format: true,
					hover: true,
					documentHighlight: true,
					signatureHelp: true,
				},
				capabilities: this.Capability,
				module: () => import("ace-linters/build/language-client"),
				modes: "typescript|js|ts|javascript",
				type: "socket",
				initializationOptions: {
					typescript: {
						tsdk: "/data/data/com.termux/files/usr/lib/node_modules/typescript/lib",
					},
				},
				socket: new WebSocket("ws://127.0.0.1:3030/typescript"),
			},
		];

		editor.setOptions({
			enableLiveAutocompletion: true,
			enableBasicAutocompletion: true,
		});

		// Setup listeners
		this.setupEventListeners(serverConfig);

		// Initialize on first focus
		editor.on("focus", this.handleEditorFocus);
		
	}

	setupEventListeners(serverConfig) {
		editorManager.on("add-folder", this.handleAddFolder);
		editorManager.on("switch-file", this.handleSwitchFile);

		// Save reference to reuse in dispose
		this.serverConfig = serverConfig;
	}

	dispose() {
		editor.off("focus", this.handleEditorFocus);
		editorManager.off("add-folder", this.handleAddFolder);
		editorManager.off("switch-file", this.handleSwitchFile);

		if (this.languageProvider) {
			this.languageProvider.dispose?.();
			this.languageProvider = null;
		}
	}

	handleEditorFocus = async () => {
		const rootUri = this.getRootUri();
		if (!rootUri || this.workSpaceFolderUri === rootUri) return;

		this.workSpaceFolderUri = rootUri;
		this.debouncedInitialize(rootUri);
	};

	handleAddFolder = () => {
		const rootUri = this.getRootUri();
		if (this.languageProvider && rootUri) {
			this.languageProvider.changeWorkspaceFolder(rootUri);
			console.log("Add Folder -> Workspace updated to:", rootUri);
		}
	};

	handleSwitchFile = () => {
		const rootUri = this.getRootUri();
		const fileName = editorManager.activeFile?.name;

		if (this.languageProvider && rootUri) {
			this.languageProvider.changeWorkspaceFolder(rootUri);
			if (fileName) {
				const filePath = `${rootUri}/${fileName}`;
				this.languageProvider.setSessionFilePath(editor.session, filePath);
				console.log("Switching file to", filePath);
			}
		}
	};

	debounce(fn, delay) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn.apply(this, args), delay);
		};
	}

	async initializeLanguageProvider(rootUri) {
		if (this.languageProvider) {
			this.languageProvider.dispose?.();
			this.languageProvider = null;
		}

		const options = {
			workspacePath: rootUri,
		};

		try {
			this.languageProvider = AceLanguageClient.for(this.serverConfig, options);
			await this.languageProvider.registerEditor(editor);
			await this.languageProvider.$registerCompleters(editor);

			const fileName = editorManager.activeFile?.name;
			if (fileName) {
				const filePath = `${rootUri}/${fileName}`;
				this.languageProvider.setSessionFilePath(editor.session, filePath);
				console.log("Initialized for file:", filePath);
			}
		} catch (error) {
			console.error("Failed to initialize language provider", error);
		}
	}

	getRootUri() {
		if (editorManager.activeFile?.uri) {
			let openfolder = acode.require("openfolder");
			let folder = openfolder.find(editorManager.activeFile.uri);
			if (folder?.url) {
				//ini akan mereturn nilai contoh: file:///data/data/com.termux/files/home/Acode/PluginProject/ace-linters-test/client.js

				return formatUrl(folder.url, false);
			}
		}
		return null;
	}
	get Capability() {
		return {
			textDocument: {
				diagnostic: {
					dynamicRegistration: true,
					relatedDocumentSupport: true,
				},
				publishDiagnostics: {
					relatedInformation: true,
					versionSupport: false,
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
			window: {
				showDocument: {
					support: true,
				},
			},
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
}
