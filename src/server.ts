import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Completion item provider for {{functionName}} and {{componentName}}
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('component-rt', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const line = document.lineAt(position).text;
            const openingBrackets = line.indexOf('{{');
            const closingBrackets = line.indexOf('}}', openingBrackets);

            // If inside {{ }}
            if (openingBrackets >= 0 && closingBrackets > position.character) {
                const functionNameCompletion = new vscode.CompletionItem('functionName', vscode.CompletionItemKind.Variable);
                const componentNameCompletion = new vscode.CompletionItem('componentName', vscode.CompletionItemKind.Variable);
                return [functionNameCompletion, componentNameCompletion];
            }

            return undefined;
        }
    }));

    // Create a diagnostics collection for errors
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('component-rt');
    context.subscriptions.push(diagnosticCollection);

    // Trigger diagnostics when the document is opened or edited
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(checkDiagnostics),
        vscode.workspace.onDidChangeTextDocument(e => checkDiagnostics(e.document)),
        vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri))
    );

    function checkDiagnostics(document: vscode.TextDocument) {
        if (document.languageId !== 'component-rt') {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];

        // Scan through the document for invalid content inside {{ }}
        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text;
            const regex = /{{(.*?)}}/g;
            let match;

            // For each {{...}} pair found
            while ((match = regex.exec(lineText)) !== null) {
                const innerText = match[1].trim();

                // Check if the innerText is not 'functionName' or 'componentName'
                if (!/^functionName$|^componentName$/.test(innerText)) {
                    const startPos = new vscode.Position(i, match.index);
                    const endPos = new vscode.Position(i, match.index + match[0].length);
                    const range = new vscode.Range(startPos, endPos);

                    // Create a diagnostic error
                    const diagnostic = new vscode.Diagnostic(
                        range,
                        `Invalid name "${innerText}" inside {{}}. Only 'functionName' and 'componentName' are allowed.`,
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostics.push(diagnostic);
                }
            }
        }

        // Set diagnostics for the current document
        diagnosticCollection.set(document.uri, diagnostics);
    }
}

export function deactivate() { }
