/**
 * Kelas untuk mengelola path folder dan file dalam workspace.
 */
export class folderPath {
	/**
	 * Mendapatkan konteks file yang sedang aktif (URI dan folder workspace).
	 * @returns {Object|undefined} Objek berisi `uri` (URI file aktif) dan `folderUrl` (URL folder workspace), atau `undefined` jika tidak ada file aktif.
	 * @example
	 * const context = getFileContext();
	 * console.log(context.uri); // "file:///path/to/file.js"
	 * console.log(context.folderUrl); // "file:///path/to/workspace"
	 */
	#getFileContext() {
		const openfolder = acode.require("openfolder");
		const uri = editorManager.activeFile?.uri;
		if (!uri) {
			console.warn("[LSP] No active file URI found.");
			return;
		}

		const folder = openfolder.find(uri);
		const folderUrl = folder?.url;
		return { uri, folderUrl };
	}

	/**
	 * Mendapatkan path lengkap direktori file yang sedang aktif.
	 * @returns {string} Path lengkap file (tanpa skema URI).
	 * @example
	 * const filePath = getDirectoryFilePath();
	 * console.log(filePath); // "/home/user/project/file.js"
	 */
	getDirectoryFilePath() {
		const full_pathFile_directory = this.#getFileContext()?.uri.split("::")[1];
		console.log("File Path: ", full_pathFile_directory);
		return full_pathFile_directory;
	}

	/**
	 * Mendapatkan path direktori workspace (folder root proyek).
	 * @returns {string} Path lengkap workspace (tanpa skema URI).
	 * @example
	 * const workspacePath = getWorkSpaceFolderDirectory();
	 * console.log(workspacePath); // "/home/user/project"
	 */
	getWorkSpaceFolderDirectory() {
		const workspaceFolder = this.#getFileContext()?.folderUrl.split("::")[1];
		console.log("WorkSpacePath: ", workspaceFolder);
		return workspaceFolder;
	}
}
