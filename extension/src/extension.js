const vscode = require('vscode');

var ws;
const extensionID = generateEID();
var appID;
var orange = vscode.window.createOutputChannel("Orange"); // Creates an output tab named orange
orange.show();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateEID() {
	const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
	let id = [];
	
	for (let i = 0; i < 8; i++) {
		// 65 = A, 90 = Z
		id.push(letters.charAt(Math.random * 25));
	}
	return id.toString();
}

function connect(ws) {
	try {
		ws = new WebSocket(`wss://sd-vm01.csc.ncsu.edu/server/extension/ws`);
		return ws;
	} catch (e) {
		orange.appendLine(e.message);
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
			orange.appendLine(msg);
			switch (msg.action) {
				case "hello":
					ws.send(JSON.stringify({action: "hello"}));
					break;
				case "registered1":
					orange.appendLine("Registered with server: " + msg.id);
					break;
				case "paired":
					orange.appendLine("Paired id: " + msg.id);
					appID = msg.id;
					break;
				case "keepalive":
					sleep(5000).then(() => {
						ws.send(JSON.stringify({ action: "keepalive" }));
					})
					break;
				default:
					orange.appendLine("WS: idk man\n" + msg);
					break;
			}
		});

		ws.send(JSON.stringify({action: "extensionId", eID: extensionID }));
	}

	


	// var lineNum = 0;
	// var lineNum2 = 0;
	// var words = new Map();
	// words.set(lineNum, "");

	// function lineCounter(line) {
	// 	for (let i = 0; i < line.length; i++) {
	// 		// orange.appendLine(line[i].range.end.line - line[i].range.start.line);
	// 		words.set(lineNum, words.get(lineNum) + line[i].text);
	// 		if (line[i].rangeLength > 1) {
	// 			lineNum2 += line[i].range.end.line - line[i].range.start.line;
	// 		}
	// 		if (line[i].text.includes("\n")) { ;
	// 			orange.appendLine(lineNum + " " + words.get(lineNum)); // Sends document changes to output window named "orange"
	// 			if (words.get(lineNum).length > 1) { lineNum++; }
	// 			words.set(lineNum, "");
	// 			ws.send(JSON.stringify({ action: "loc", count: lineNum}));
	// 		} else if (line[i].text === "") {
	// 			let deleteLine = false;
	// 			if (words.get(lineNum).length == 1) { deleteLine = true; }
	// 			words.set(lineNum, words.get(lineNum).substring(0, words.get(lineNum).length - 1));
	// 			if (deleteLine) { 
	// 				lineNum--;
	// 				orange.appendLine(lineNum + " " + line[i].text + " " + words.get(lineNum)); 
	// 			}
	// 		}
	// 		orange.appendLine("testing " + lineNum2 + " " + line[i].text + " " + line[i].rangeLength);
			// if (line[i].range.isSingleLine()) { orange.appendLine("asefef"); }
	// 	}

	// }


	// vscode.workspace.onDidChangeTextDocument(function(e) {
	// 	if (e.document.uri.path !== "extension-output-undefined_publisher.extension-#1-Orange")  {
	// 		lineCounter(e.contentChanges);
	// 		// lineNum2 = e.document.lineCount - vscode.window.activeTextEditor.document.lineCount;
	// 	}
	// });

	// var prevLineCount = 0;
	// vscode.workspace.onWillSaveTextDocument(function(e) {
	// 	prevLineCount = e.document.lineCount;
	// })
	
	var newLines;
	vscode.workspace.onDidSaveTextDocument(function(e) {
		newLines = vscode.window.activeTextEditor.document.lineCount;
		lineNum2 = newLines - currentLines;
		currentLines = newLines;
		orange.appendLine("Saving: " + lineNum2);
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