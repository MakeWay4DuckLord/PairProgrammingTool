const vscode = require('vscode');
const axios = require('axios');

var ws;
const extensionID = generateEID();
var appID;
var lineNum;
// var orange = vscode.window.createOutputChannel("Orange"); // Creates an output tab named orange
// orange.show();

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
		// orange.appendLine(e.message);
	}
}

var currentLines;
// runs when extension starts
function activate(context) {
	const provider = new SessionWebviewViewProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(provider.viewType, provider));

	currentLines = vscode.window.activeTextEditor.document.lineCount;

	ws = connect(ws);

	ws.onopen = () => {

		ws.addEventListener("message", (event) => {
			let msg = JSON.parse(event.data);
			// orange.appendLine(msg);
			switch (msg.action) {
				case "hello":
					ws.send(JSON.stringify({action: "hello"}));
					ws.send(JSON.stringify({action: "extensionId", eID: extensionID }));
					break;
				case "registered1":
					// orange.appendLine("Registered with server: " + msg.id);
					sleep(5000).then(() => {
						ws.send(JSON.stringify({ action: "keepalive" }));
					})
					break;
				case "paired":
					// orange.appendLine("Paired id: " + msg.id);
					appID = msg.id;
					break;
				case "keepalive":
					sleep(5000).then(() => {
						ws.send(JSON.stringify({ action: "keepalive", eid: extensionID}));
					})
					break;
				default:
					// orange.appendLine("WS: idk man\n" + msg);
					break;
			}
		});

	}
	
	var newLines;
	vscode.workspace.onDidSaveTextDocument(function(e) {
		newLines = vscode.window.activeTextEditor.document.lineCount;
		lineNum += newLines - currentLines;
		currentLines = newLines;
		// axios.put(`https://sd-vm01.csc.ncsu.edu/server/api/users/${appID}/linesOfCode/${lineNum}`);
		// orange.appendLine("Saving: " + lineNum);
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