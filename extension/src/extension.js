const vscode = require('vscode');

var ws;
const extensionID = generateEID();
var appID;
var lineNum = 0;
var active;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateEID() {
	const letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
	let id = "";
	for (let i = 0; i < 8; i++) {
		id += letters.charAt(Math.random() * 25);
	}
	return id;
}

function connect(ws) {
	try {
		ws = new WebSocket(`wss://sd-vm01.csc.ncsu.edu/server/extension/ws`);
		return ws;
	} catch (e) {
	}
}

var currentLines;
// runs when extension starts
function activate(context) {
	const provider = new SessionWebviewViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(provider.viewType, provider));

	if (vscode.window.activeTextEditor) {
		currentLines = vscode.window.activeTextEditor.document.lineCount;
	} else {
		currentLines = 0;
	}

	ws = connect(ws);

	ws.onopen = () => {
		ws.addEventListener("message", (event) => {
			let msg = JSON.parse(event.data);
			switch (msg.action) {
				case "hello":
					ws.send(JSON.stringify({action: "hello"}));
					ws.send(JSON.stringify({action: "extensionId", eid: extensionID }));
					break;
				case "registered":
					sleep(10000).then(() => {
						ws.send(JSON.stringify({ action: "keepalive" }));
					})
					break;
				case "paired":
					if (!appID) {
						lineNum = 0;
						if (vscode.window.activeTextEditor) {
							currentLines = vscode.window.activeTextEditor.document.lineCount;
						} else {
							currentLines = 0;
						}
					}
					appID = msg.id;
					break;
				case "start":
					if (!active) {
						lineNum = 0;
						if (vscode.window.activeTextEditor) {
							currentLines = vscode.window.activeTextEditor.document.lineCount;
						} else {
							currentLines = 0;
						}
					}
					active = true;
					break;
				case "close":
					if (vscode.window.activeTextEditor) {
						newLines = vscode.window.activeTextEditor.document.lineCount;
						lineNum += newLines - currentLines;
						currentLines = newLines;
						if (appID && active) {
							ws.send(JSON.stringify({action: "loc", id: appID, count: lineNum}));
							active = false;
							appID = null;
							ws.send(JSON.stringify({action: "extensionId", eid: extensionID }));
						}
					}
					break;
				case "keepalive":
					sleep(10000).then(() => {
						ws.send(JSON.stringify({ action: "keepalive", eid: extensionID}));
					})
					break;
				default:
					break;
			}
		});

	}
	
	var newLines;
	// vscode.workspace.onDidSaveTextDocument(function(e) {
	vscode.workspace.onDidChangeTextDocument(function(e) {
		if (e.document.uri.path !== "extension-output-undefined_publisher.extension-#1-Orange")  {
			newLines = vscode.window.activeTextEditor.document.lineCount;
			lineNum += newLines - currentLines;
			currentLines = newLines;
			if (appID && active) {
				ws.send(JSON.stringify({action: "loc", id: appID, count: lineNum}));
			}
		}
		
	})

	vscode.window.onDidChangeActiveTextEditor(function(e) {
		orange.appendLine("changed");
		currentLines = vscode.window.activeTextEditor.document.lineCount;
	})
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
			<script> const extensionID = "${extensionID}"; </script>
		</head>
		<body>
			<div id="root">
			</div>
			<script src="http://localhost:8080${'/index.js'}"></script>
		</body>
		</html>`;
	}
}