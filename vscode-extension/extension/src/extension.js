const vscode = require('vscode');

// runs when extension starts
function activate(context) {
	const provider = new SessionWebviewViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(provider.viewType, provider));
}

// runs when extension deactivates
function deactivate() {}

module.exports = {
	activate,
	deactivate
}; 

class SessionWebviewViewProvider {
	// Construct the class
	constructor(extensionUri) {
		this.extensionUri = extensionUri;
		this.viewType = 'pair-programming-extension';
	}
	// Called when we open the webview
	resolveWebviewView(view) {
		this.view = view;
		view.webview.options = {
			// needed to use our index.js script
			enableScripts: true,
			// our extension path
			localResourceRoots: [
				this.extensionUri,
			]
		};
		// we need the HTML to put our React app in the panel
		view.webview.html = this.getWebViewContent(this.view);
	}

	// Render webview using the HTML that would be in a React index.html file
	getWebViewContent() {	
        return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Pair Programming Tool</title>
		</head>
		<body>
			<div id="root">
			</div>
			<script src="http://localhost:8080${'/index.js'}"></script>
		</body>
		</html>`;
	}
}