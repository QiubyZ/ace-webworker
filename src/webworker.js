import { ServiceManager } from "ace-linters/build/service-manager";

let manager = new ServiceManager(self);
manager.registerService("html", {
	features: {
		completion: true,
		completionResolve: true,
		diagnostics: true,
		format: true,
		hover: true,
		documentHighlight: true,
		signatureHelp: true,
	},
	//module: () => import("./Service/Html/htmlService.js"),
	module: () => import("ace-linters/build/html-service"),
	className: "HtmlService",
	modes: "html",
});

manager.registerService("css", {
	features: { signatureHelp: true },
	module: () => import("ace-linters/build/css-service"),
	className: "CssService",
	modes: "css",
});

manager.registerService("less", {
	
	module: () => import("ace-linters/build/css-service"),
	className: "CssService",
	modes: "less",
});
manager.registerService("scss", {

	module: () => import("ace-linters/build/css-service"),
	className: "CssService",
	modes: "scss",
});
manager.registerService("json", {
	
	module: () => import("ace-linters/build/json-service"),
	className: "JsonService",
	modes: "json",
});
manager.registerService("json5", {
	
	module: () => import("ace-linters/build/json-service"),
	className: "JsonService",
	modes: "json5",
});

manager.registerService("yaml", {
	
	module: () => import("ace-linters/build/yaml-service"),
	className: "YamlService",
	modes: "yaml",
});

manager.registerService("xml", {
	module: () => import("ace-linters/build/xml-service"),
	className: "XmlService",
	modes: "xml",
});
manager.registerService("php", {
	module: () => import("ace-linters/build/php-service"),
	className: "PhpService",
	modes: "php",
});
manager.registerService("javascript", {
	initializationOptions: {
		preferences: {
			providePrefixAndSuffixTextForRename: true,
			allowRenameOfImportPath: true,
			includeCompletionsForModuleExports: true,
			includeCompletionsWithInsertText: true,
			includeCompletionsWithSnippetText: true,
			includeAutomaticOptionalChainCompletions: true,
			includeInlayEnumValueHints: true,
			includeInlayFunctionParameterTypeHints: true,
			includeInlayParameterNameHints: "all",
			includeInlayVariableTypeHints: true,
			useLabelDetailsInCompletionEntries: true,
			disableSuggestions: false,
			displayPartsForJSDoc: true,
		},
		watchOptions: {
			watchFile: "DynamicPriorityPolling",
			watchDirectory: "Recursive",
		},
		typescript: {
			tsdk: "/data/data/com.termux/files/usr/lib/node_modules/typescript/lib",
		},
	},
	module: () => import("ace-linters/build/javascript-service"),
	className: "JavascriptService",
	modes: "javascript",
});

manager.registerService("typescript", {
	module: () => import("ace-linters/build/typescript-service"),
	className: "TypescriptService",
	modes: "typescript|javascript|tsx",
	initializationOptions: {
		preferences: {
			providePrefixAndSuffixTextForRename: true,
			allowRenameOfImportPath: true,
			includeCompletionsForModuleExports: true,
			includeCompletionsWithInsertText: true,
			includeCompletionsWithSnippetText: true,
			includeAutomaticOptionalChainCompletions: true,
			includeInlayEnumValueHints: true,
			includeInlayFunctionParameterTypeHints: true,
			includeInlayParameterNameHints: "all",
			includeInlayVariableTypeHints: true,
			useLabelDetailsInCompletionEntries: true,
			disableSuggestions: false,
			displayPartsForJSDoc: true,
		},
		watchOptions: {
			watchFile: "DynamicPriorityPolling",
			watchDirectory: "Recursive",
		},
		typescript: {
			tsdk: "/data/data/com.termux/files/usr/lib/node_modules/typescript/lib",
		},
	},
});

// manager.registerServer("java", {
// 	module: () => import("ace-linters/build/language-client"),
// 	modes: "java",
// 	type: "socket",
// 	socket: new WebSocket("ws://127.0.0.1:2080/java"),
// });
// manager.registerServer("javascript", {
// 	module: () => import("ace-linters/build/language-client"),

// 	modes: "javascript|typescript|js|jsx",
// 	type: "socket", // "socket|worker"
// 	socket: new WebSocket("ws://127.0.0.1:2080/typescript"),
// 	initializationOptions: {
// 		preferences: {
// 			providePrefixAndSuffixTextForRename: true,
// 			allowRenameOfImportPath: true,
// 			includeCompletionsForModuleExports: true,
// 			includeCompletionsWithInsertText: true,
// 			includeCompletionsWithSnippetText: true,
// 			includeAutomaticOptionalChainCompletions: true,
// 			includeInlayEnumValueHints: true,
// 			includeInlayFunctionParameterTypeHints: true,
// 			includeInlayParameterNameHints: "all",
// 			includeInlayVariableTypeHints: true,
// 			useLabelDetailsInCompletionEntries: true,
// 			disableSuggestions: false,
// 			displayPartsForJSDoc: true,
// 		},
// 		watchOptions: {
// 			watchFile: "DynamicPriorityPolling",
// 			watchDirectory: "Recursive",
// 		},
// 		typescript: {
// 			tsdk: "/data/data/com.termux/files/usr/lib/node_modules/typescript/lib",
// 		},
// 	},
// }
// );

// manager.registerService("lua", {
// 	features: {

// 		completion: true,
// 		completionResolve: true,
// 		diagnostics: true,
// 		format: true,
// 		hover: true,
// 		documentHighlight: true,
// 		signatureHelp: true,
// 	},
// 	module: () => import("ace-lua-linter/build/"),
// 	className: "AceLuaLinter",
// 	modes: "lua",
// });
// manager.registerService("python", {
// 	features: {
// 		completion: true,
// 		completionResolve: true,
// 		diagnostics: true,
// 		format: true,
// 		hover: true,
// 		documentHighlight: true,
// 		signatureHelp: true,
// 	},
// 	module: () => import("ace-python-ruff-linter/build/python-service"),
// 	className: "PythonService",
// 	modes: "python",
// });
/*manager.registerServer("pythonls", {
    module: () => import("ace-linters/build/language-client"),
    modes: "python",
    type: "socket",
    socket: new WebSocket("ws://127.0.0.1:3030/python")
});

manager.registerServer("svelte", {
    module: () => import("ace-linters/build/language-client"),
    modes: "html",
    type: "socket",
    socket: new WebSocket("ws://127.0.0.1:3030/svelte")
});

manager.registerServer("astro", {
    module: () => import("ace-linters/build/language-client"),
    modes: "astro",
    type: "socket",
    socket: new WebSocket("ws://127.0.0.1:3030/astro"),
    initializationOptions: {
        typescript: {
            tsdk: "node_modules/typescript/lib", //path to typescript server
        }
    }
});

manager.registerServer("go", {
    module: () => import("ace-linters/build/language-client"),
    modes: "golang",
    type: "socket",
    socket: new WebSocket("ws://127.0.0.1:3030/go")
});*/

// manager.registerService("mysql", {
// 	module: () => import("ace-sql-linter/build/mysql-service"),
// 	className: "MySQLService",
// 	modes: "mysql",
// });

// manager.registerService("clang", {
// 	module: () => import("ace-clang-linter/build/ace-clang-linter"),
// 	className: "AceClangLinter",
// 	modes: "c_cpp",
// });

// manager.registerService("zig", {
// 	module: () => import("ace-zig-linter/build/ace-zig-linter"),
// 	className: "AceZigLinter",
// 	modes: "zig",
// });

// manager.registerService("dart", {
// 	module: () => import("ace-dart-linter/build/ace-dart-linter"),
// 	className: "AceDartLinter",
// 	modes: "dart",
// });

// manager.registerService("golang", {
// 	module: () => import("ace-linters/build/");
// 	className: "AceGoLinter",
// 	modes: "go",
// });
