import { AceLanguageClient } from "ace-linters/build/ace-language-client";

//Ace Editor
let { editor } = editorManager;
let acodeEditor = editorManager;
import {
	ReconnectingWebSocket,
	formatUrl,
	unFormatUrl,
	getFolderName,
	getCodeLens,
} from "./utils.js";
import "ace-code";
export class Client {
	workSpaceFolderUri = null;
	languageProvider = null;

	constructor() {}

	async initialize() {
		getSocketForCommand: (command, args = []) => {
			let url = "auto/" + encodeURIComponent(command) + "?args=" + JSON.stringify(args);
			return new ReconnectingWebSocket(
				"ws://localhost:3030/" + url,
				null,
				false,
				true,
				5000,
				0,
			);
		};
		let url =
			"ws://localhost:3030/" +
			"auto/" +
			encodeURIComponent("typescript-language-server") +
			"?args=" +
			JSON.stringify(["--stdio"]);
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
				//capabilities: this.Capability,
				module: () => import("ace-linters/build/language-client"),
				modes: "typescript|js|ts|javascript",
				type: "socket",
				initializationOptions: {
					typescript: {
						tsdk: "/data/data/com.termux/files/usr/lib/node_modules/typescript/lib",
					},
				},
				socket: new WebSocket(url), //getSocketForCommand("typescript-language-server", ["--stdio"]),
			},
		];
		editor.setOptions({
			enableLiveAutocompletion: true,
			enableBasicAutocompletion: true,
		});
		editor.on("focus", async () => {
			const options = {
				workspacePath: this.getRootUri(),
			};
			console.log(options.workspacePath);
			this.languageProvider = AceLanguageClient.for(serverConfig, {
				workspacePath: this.getRootUri(),
			});
			this.languageProvider.changeWorkspaceFolder(this.getRootUri());
			const fileName = editorManager.activeFile?.name;
			if (fileName) {
				//const filePath = `${rootUri}/${fileName}`;
				const filePath = `${this.getRootUri()}/${fileName}`;
				this.languageProvider.setSessionFilePath(editor.session, filePath);
				console.log("Initialized for file:", filePath);
			}
			this.languageProvider.registerEditor(editor);
			this.languageProvider.$registerCompleters(editor);
		});
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
	getFileActivName() {
		const fileName = editorManager.activeFile?.name;
		return `${this.getRootUri()}/${fileName}`;
	}

	getRootUri() {
		if (editorManager.activeFile?.uri) {
			let openfolder = acode.require("openfolder");
			let folder = openfolder.find(editorManager.activeFile.uri);
			if (folder?.url) {
				//ini akan mereturn nilai contoh: file:///data/data/com.termux/files/home/Acode/PluginProject/ace-linters-test

				return formatUrl(folder.url, false);
			}
		}
		return null;
	}
}
