
const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const provider = new SessionWebviewViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(provider.viewType, provider));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

class SessionWebviewViewProvider {
	constructor(extensionUri) {
		this.extensionUri = extensionUri;
		this.viewType = 'pair-programming-extension';
	}
	resolveWebviewView(view, context, token) {
		this.view = view;
		view.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this.extensionUri,
			]
		}
		view.webview.html = this._getHtmlForWebview(view.webview);
	}

	_getHtmlForWebview(view) {
        return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Pair Programming Tool</title>
		</head>
		<body>
			<div id="root">
				<h1>Hello World</h1>
			</div>
		</body>
		</html>`;
	}
}