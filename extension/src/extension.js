const vscode = require('vscode');

var ws;
const extensionID = generateEID();
var appID;
var lineNum;
var active;
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
		ws = new WebSocket(`ws://localhost/server/extension/ws`);
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

	if (vscode.window.activeTextEditor) {
		currentLines = vscode.window.activeTextEditor.document.lineCount;
	} else {
		currentLines = 0;
	}

	ws = connect(ws);

	ws.onopen = () => {
		ws.addEventListener("message", (event) => {
			let msg = JSON.parse(event.data);
			// orange.appendLine(msg);
			switch (msg.action) {
				case "hello":
					ws.send(JSON.stringify({action: "hello"}));
					ws.send(JSON.stringify({action: "extensionId", eid: extensionID }));
					break;
				case "registered":
					// orange.appendLine("Registered with server: " + msg.id);
					sleep(10000).then(() => {
						ws.send(JSON.stringify({ action: "keepalive" }));
					})
					break;
				case "paired":
					// orange.appendLine("Paired id: " + msg.id);
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
				case "close":
					if (vscode.window.activeTextEditor) {
						newLines = vscode.window.activeTextEditor.document.lineCount;
						lineNum += newLines - currentLines;
						currentLines = newLines;
						if (appID && active) {
							ws.send(JSON.stringify({action: "loc", id: appID, count: lineNum}));
							active = false;
							appID = null;
						}
					}
				case "keepalive":
					sleep(10000).then(() => {
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
		if (appID && active) {
			ws.send(JSON.stringify({action: "loc", id: appID, count: lineNum}));
		}
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