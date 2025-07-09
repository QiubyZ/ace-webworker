// Di dalam plugin Acode kamu (misalnya, main.js atau index.js)
import plugin from "../plugin.json";
//import { Client } from "./client.js";
//import { AceLanguageClient } from "ace-linters/build/ace-language-client";
import { LanguageProvider } from "ace-linters";
let appSettings = acode.require("settings");
let { editor } = editorManager;
ace.require("ace/ext/language_tools");
class AcodePlugin {
	$folders;
	defaultSettings = {
		port: 4040,
		ip: "ws://localhost",
	};
	async init($page, cacheFile, cacheFileUrl) {
		//new Client().initialize();
		// 		const editor = ace.edit("root", {
		// 			enableBasicAutocompletion: true,
		// 			enableLiveAutocompletion: true,
		// 			enableSnippets: true,
		// 			fontSize: "14px",
		// 		});
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
		});
		let test = this.MyWorker();
		// 		editor.commands.on("afterExec", function (e) {
		// 			if (e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) {
		// 				editor.execCommand("startAutocomplete");
		// 			}
		// 		});
		// 		let completer = editor.completers.find((el) => el.id === "lspCompleters");
		// 		completer.triggerCharacters = [".", "<"];
		// 		console.log(completer);
	}
	MyWorker() {
		let worker = new Worker(new URL("./webworker.js", import.meta.url), {
			type: "module",
		})
		
		let test = LanguageProvider.create(worker, {
			functionality: {
				completion: {
					overwriteCompleters: false,
					lspCompleterOptions: {
						triggerCharacters: {
							add: [".", "<"],
						},
					},
				},
			},
		});
		
		test.configureServiceFeatures("", {
			features: {
				completion: true,
				completionResolve: true,
				diagnostics: true,
				format: true,
				hover: true,
				documentHighlight: true,
				signatureHelp: true,
			},
		});
		test.registerEditor(editor);
		worker.addEventListener("message", (result) => {
			console.log(result.data);
			console.log(editor.completers.splice(1,2))
		});
		
		//test.doHover(editor.session, editor.getCursorPosition());
		//test.setSessionFilePath(editor.session, {});
		return test; //manager;
	}
	pesan(msg) {
		console.log(msg);
	}

	infoUI(pesan) {
		window.toast(pesan, 2000);
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
				value: this.getSettings.ip,
				prompt: "Enter IP Local",
				promptType: "string",
			},

			{
				key: "port",
				text: "Port IP",
				info: "Set Port IP",
				value: this.getSettings.port,
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
