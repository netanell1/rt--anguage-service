import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const serverModule = context.asAbsolutePath(
		vscode.Uri.joinPath(context.extensionUri, 'dist', 'server.js').fsPath
	);

	// Register completion item provider for component-rt.template
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('component-rt', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const completionItems = [
					new vscode.CompletionItem('functionName', vscode.CompletionItemKind.Variable),
					new vscode.CompletionItem('componentName', vscode.CompletionItemKind.Variable),
					new vscode.CompletionItem('styleFileName', vscode.CompletionItemKind.Variable)
				];
				return completionItems;
			}
		}, '{{') // Trigger on typing {{
	);

	// Register completion item provider for style-rt.template
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('style-rt', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const completionItems = [
					new vscode.CompletionItem('className', vscode.CompletionItemKind.Variable),
					new vscode.CompletionItem('idName', vscode.CompletionItemKind.Variable)
				];
				return completionItems;
			}
		}, '{{') // Trigger on typing {{
	);

	// Diagnostic collection for both languages
	const diagnosticCollection = vscode.languages.createDiagnosticCollection('template-diagnostics');
	context.subscriptions.push(diagnosticCollection);

	// Register listeners for text changes to check for errors
	const openListener = vscode.workspace.onDidOpenTextDocument(doc => checkDiagnostics(doc, diagnosticCollection));
	const changeListener = vscode.workspace.onDidChangeTextDocument(e => checkDiagnostics(e.document, diagnosticCollection));
	const closeListener = vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri));

	context.subscriptions.push(openListener, changeListener, closeListener);

	// Function to check and set diagnostics
	function checkDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
		const languageId = document.languageId;
		if (languageId !== 'component-rt' && languageId !== 'style-rt') {
			return;
		}

		const diagnostics: vscode.Diagnostic[] = [];
		const regex = /{{(.*?)}}/g;

		// Iterate through each line in the document
		for (let i = 0; i < document.lineCount; i++) {
			const lineText = document.lineAt(i).text;
			let match;

			// Find all {{ }} patterns in the line
			while ((match = regex.exec(lineText)) !== null) {
				const innerText = match[1].trim();
				let allowedNames;
				allowedNames = ['functionName', 'componentName', 'styleFileName'];


				// Validate if the text inside {{ }} is one of the allowed names
				if (!allowedNames.includes(innerText)) {
					const startPos = new vscode.Position(i, match.index);
					const endPos = new vscode.Position(i, match.index + match[0].length);
					const range = new vscode.Range(startPos, endPos);

					// Create a diagnostic error if the innerText is not valid
					const diagnostic = new vscode.Diagnostic(
						range,
						`Invalid name "${innerText}" inside {{}}. Only ${allowedNames.join(', ')} are allowed.`,
						vscode.DiagnosticSeverity.Error
					);
					diagnostics.push(diagnostic);
				}
			}
		}

		// Set diagnostics for the document
		collection.set(document.uri, diagnostics);
	}
}

export function deactivate() { }
