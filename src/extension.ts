import * as vscode from 'vscode';
import { GitHubTreeProvider } from './providers/GitHubTreeProvider';
import { ConfigService } from './services/ConfigService';
import { GitHubService } from './services/GitHubService';
import { FileService } from './services/FileService';
import { registerCommands } from './commands';
// import { StatusBarService } from './providers/StatusBarProvider';
import { AxiosAdapter } from './infra/http/HttpClient';
import { StatusBarVsCodeProvider } from './providers/StatusBarProvider';
import { CommandsActionVsCode } from './commands/CommandsAction';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const httpClient = new AxiosAdapter();
	const statusBarService = new StatusBarVsCodeProvider();
	const commandsAction = new CommandsActionVsCode(statusBarService)
	const gitHubService = new GitHubService(httpClient);
	// const fileService = new FileService();
	const treeDataProvider = new GitHubTreeProvider(gitHubService);
	console.log('INICIALIZANDO EXTENSÃO EMR Developer Cortex Viewer');
	await ConfigService.initializeConfig();

  const configChangeListener = ConfigService.onConfigurationChanged(context, () => {
    treeDataProvider.refresh();
  })


  const treeView = vscode.window.createTreeView('emrDeveloperCortexViewer', {
    treeDataProvider,
    showCollapseAll: true,
  });

  // treeView.onDidChangeSelection(async (event) => {
  // 	if (event.selection.length > 0) {
  // 		const selectedItem = event.selection[0];
  // 		if (selectedItem.type === 'file') {
  // 			await previewMarkdownFile(selectedItem, gitHubService, context);
  // 		}
  // 	}
  // });

  context.subscriptions.push(treeView);

  registerCommands(context, commandsAction, treeDataProvider);

  context.subscriptions.push(
    configChangeListener,
    // vscode.commands.registerCommand('emrDeveloperCortexViewer.refresh', () => treeDataProvider.refresh())
  );
}

export function deactivate(): void {
  // noop
}
