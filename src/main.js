import plugin from "../plugin.json";
import { LanguageProvider } from "ace-linters";
let appSettings = acode.require("settings");
let { editor } = editorManager;
import { folderPath } from "./utils/pathFolder";

class AcodePlugin {
	$folders;
	defaultSettings = {
		Functionality: {
			functionality: {
				completion: {
					overwriteCompleters: true,
					lspCompleterOptions: {
						triggerCharacters: {
							add: ["."],
						},
					},
				},
			},
		},

		LanguageFeatures: {
			features: {
				completion: true,
				completionResolve: true,
				diagnostics: true,
				format: true,
				hover: true,
				documentHighlight: true,
				signatureHelp: true,
			},
		},
		

		setGlobalOptions: {
			javascript: {},
			typescript: {
				compilerOptions: {
					allowJs: true,
					checkJs: true,
					target: 99,
					jsx: 1,
				},
			},
		},
	};

	async init($page, cacheFile, cacheFileUrl) {
		this.MyWorker();
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			enableSnippets: true,
		});
	}

	MyWorker() {
		let acodePathDirectory = new folderPath();
		let worker = new Worker(new URL("./webworker.js", import.meta.url), {
			type: "module",
		});

		let languageProvider = LanguageProvider.create(
			worker,
			this.getSettings.Functionality || this.defaultSettings.Functionality,
		);

		languageProvider.configureServiceFeatures(
			"html",
			this.getSettings.LanguageFeatures || this.defaultSettings.LanguageFeatures,
		);

		languageProvider.configureServiceFeatures(
			"css",
			this.getSettings.LanguageFeatures || this.defaultSettings.LanguageFeatures,
		);

		languageProvider.configureServiceFeatures(
			"typescript",
			this.getSettings.LanguageFeatures || this.defaultSettings.LanguageFeatures,
		);
		languageProvider.setGlobalOptions(
			"typescript",
			this.getSettings.setGlobalOptions || this.defaultSettings.setGlobalOptions.typescript,
		);
		languageProvider.configureServiceFeatures(
			"javascript",
			this.getSettings.LanguageFeatures || this.defaultSettings.LanguageFeatures,
		);

		languageProvider.setGlobalOptions(
			"javascript",
			this.getSettings.setGlobalOptions || this.defaultSettings.setGlobalOptions.javascript,
		);

		languageProvider.registerEditor(editor, {
			filePath: acodePathDirectory.getDirectoryFilePath(),
			joinWorkspaceURI: true,
		});

		editor.on("changeSession", () => {
			const currentEditor = editorManager.editor;
			const sessionUri = acodePathDirectory.getDirectoryFilePath();

			if (!sessionUri) {
				console.warn("[LSP] Skipping re-registration: no session URI available.");
				return;
			}

			console.log("[LSP] Session changed. Re-registering editor with URI:", sessionUri);
			languageProvider.registerEditor(currentEditor, {
				filePath: sessionUri,
				joinWorkspaceURI: false,
			});
		});
		return languageProvider;
	}
	pesan(msg) {
		console.log(msg);
	}

	infoUI(pesan) {
		window.toast(pesan, 2000);
	}
	activePath() {
		return editorManager.activeFile?.uri.split("::")[1];
	}

	get getSettings() {
		// UPDATE SETTING SAAT RESTART ACODE
		if (!window.acode) return this.defaultSettings;
		let value = appSettings.value[plugin.id];
		if (!value) {
			//Menjadikan Method defaultSettings sebagai nilai Default
			value = appSettings.value[plugin.id] = this.defaultSettings;
			appSettings.update();
		}
		return value;
	}
	get setMenuLayout() {
		return [
			{
				key: "ip",
				text: "IP Local",
				info: "Set Local IP",
				value: this.getSettings.ip || "127.0.0.1",
				prompt: "Enter IP Local",
				promptType: "string",
			},

			{
				key: "port",
				text: "Port IP",
				info: "Set Port IP",
				value: this.getSettings.port || 8080,
				prompt: "Enter Port",
				promptType: "string",
			},
			{
				key: "completer",
				text: "Completer",
				info: "Completer",
				value: this.getSettings.port || 8080,
				prompt: "Enter Port",
				promptType: "number",
			},
		];
	}

	async onSettingsChange(key, value) {
		this.defaultSettings[key] = value;
		appSettings.value[plugin.id][key] = value;
		appSettings.update();
	}
	async destroy() {
		if (appSettings.value[plugin.id]) {
			delete appSettings.value[plugin.id];
			appSettings.update();
		}
	}
}

if (window.acode) {
	const acodePlugin = new AcodePlugin();
	acode.setPluginInit(
		plugin.id,
		async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
			if (!baseUrl.endsWith("/")) {
				baseUrl += "/";
			}
			acodePlugin.baseUrl = baseUrl;
			await acodePlugin.init($page, cacheFile, cacheFileUrl);
		},
		{ list: acodePlugin.setMenuLayout, cb: acodePlugin.onSettingsChange },
	);

	acode.setPluginUnmount(plugin.id, () => {
		acodePlugin.destroy();
	});
}
