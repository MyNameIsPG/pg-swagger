import * as vscode from 'vscode';
import { getSwaggerPath } from './api'
import { smallTurnHump } from './util'

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('pg-swagger.swagger', () => {
		vscode.window.showInputBox({
			password: false, // 输入内容是否是密码
			ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
			placeHolder: '', // 在输入框内的提示信息
			value: 'http://172.18.1.116:10010/api/auth/v2/api-docs',
			prompt: 'swagger：地址：http://172.18.1.116:10010/api/auth/v2/api-docs', // 在输入框下方的提示信息
		}).then(async (url) => {
			const res = await getSwaggerPath(url as string)
			if (res.status === 200) {
				generate(res.data)
			} else {
				vscode.window.showErrorMessage("数据请求失败，请校验路径是否存在")
			}
		});
	});
	context.subscriptions.push(disposable);
}

function generate(data: any) {
	let path = "";
	const list = data.paths;
	for (const key in list) {
		for (const key1 in list[key]) {
			let api_name = smallTurnHump(data.basePath ? data.basePath : "" + key);
			let isThereAParameter = key.match(/{([^}]*)}/);
			if (isThereAParameter) {
				let str = key.slice(0, isThereAParameter.index);
				path += `<div style="font-size: 16px; line-height: 22px;">
					<div>/** ${list[key][key1]["summary"]} */</div>
					<div>export const ${api_name} = ${isThereAParameter[1]} => request("${data.basePath ? data.basePath : ""}${str}" + ${isThereAParameter[1]}, null, "${key1.toUpperCase()}")</div>
					<br>
				</div>`;
			} else {
				path += `<div style="font-size: 16px; line-height: 22px;">
					<div>/** ${list[key][key1]["summary"]} */</div>
					<div>export const ${api_name} = data => request("${data.basePath ? data.basePath : ""}${key}", data, "${key1.toUpperCase()}")</div>
					<br>
				</div>`;
			}
		}
	}

	const panel = vscode.window.createWebviewPanel(
		'swaggerApi',
		"swagger_api",
		vscode.ViewColumn.One,
		{
			enableScripts: false, // 启用JS，默认禁用
			retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
		}
	)

	panel.webview.html = getWebviewContent(path);
}

function getWebviewContent(content: string) {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
	</head>
	<body>
			${content}
	</body>
	</html>`;
}