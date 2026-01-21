import * as vscode from 'vscode';
import { GitHubService } from '../services/GitHubService';
import { FileService } from '../services/FileService';
import CommandsAction from './CommandsAction';
import InterfaceProvider from '../providers/GitHubTreeProvider';

export function registerCommands(
	context: vscode.ExtensionContext,
	commandsAction: CommandsAction,
	provider: InterfaceProvider
): void {
  //Register manage repositories command (UI entry point)
  context.subscriptions.push(
	vscode.commands.registerCommand('cortex.manageConfiguration', async () => commandsAction.manageConfiguration()),
	vscode.commands.registerCommand('cortex.configureToken', async () => commandsAction.configureToken()),
	vscode.commands.registerCommand('cortex.viewRepositories', async () => commandsAction.viewRepositories()),
	vscode.commands.registerCommand('cortex.refresh', () => provider.refresh()),
  );

//     //TODO: Ajustar as rotinas de download para baixar nas pastas corretas de acordo com o tipo, ex.: "*.agents.md" deve baixar na pasta "agents", "*.prompts.md" deve baixar na pasta "prompts", etc. 
//     // e na pasta da ferramenta de IA padrão configurada: copilot, vscode, cursor, windsurf, claude, etc.
//     vscode.commands.registerCommand(
//       'githubMarkdownViewer.downloadFile',
//       async (repository: RepositoryNode, filePath: string) => {
//         const target = await pickDownloadTarget(repository.downloadPath ?? './downloads');
//         if (!target) {
//           return;
//         }
//         const buffer = await gitHubService.downloadFile(repository, filePath);
//         fileService.writeFile(target, filePath.split('/').pop() ?? 'file.md', buffer);
//         vscode.window.showInformationMessage('Arquivo baixado.');
//       }
//     )
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       'githubMarkdownViewer.downloadPlugin',
//       async (repository: RepositoryNode, pluginPath: string) => {
//         const target = await pickDownloadTarget(repository.downloadPath ?? './downloads');
//         if (!target) {
//           return;
//         }
//         const files = await gitHubService.downloadFolder(repository, pluginPath);
//         for (const file of files) {
//           fileService.writeFile(target, file.relativePath, file.content);
//         }
//         vscode.window.showInformationMessage('Plugin baixado.');
//       }
//     )
//   );

//   const manageRepositoriesCommand = vscode.commands.registerCommand('cortex.manageRepositories', async () => {
//     let repositories = ConfigService.getRepositories();
//     while (true) {
//       const pick = await vscode.window.showQuickPick([
//         { label: 'Add Repository', description: 'Add a new public repository' },
//         { label: 'Remove Repository', description: 'Remove an existing repository from settings' },
//         // { label: 'Reset to Default', description: 'Restore default repositories' },
//         { label: 'View Repositories', description: 'View repositories configured in settings' },
//         { label: 'Done', description: 'Exit repository management' }
//       ], { placeHolder: 'Manage Cortex Repositories' });

//       if (!pick || pick.label === 'Done') {
//         break;
//       }

//       switch (pick.label) {
//         case 'Add Repository':
//           await commandsAction.addRepository();
//           break;
//         case 'Remove Repository':
//           await commandsAction.removeRepository(repositories);
//           provider.refresh();
//           break;
//         case 'View Repositories':
//           await commandsAction.viewRepositories(repositories);
//           break;
//         // case 'Reset to Default':
//         // 	await ConfigService.setRepositories(context, DEFAULT_REPO);
//         // 	vscode.window.showInformationMessage('Repositories reset to default.');
//         // 	break;
//         default: break;
//       }
//     };
//   });




//   context.subscriptions.push(
//     //TODO: ajustar o diretorio padrão para "Configuração global ou workspace"
//     vscode.commands.registerCommand('githubMarkdownViewer.configureRepository', async () => {
//       const repoInput = await vscode.window.showInputBox({
//         prompt: 'URL ou owner/repo (ex: https://github.com/owner/repo ou owner/repo)',
//         placeHolder: 'philips-internal/emr-developer-cortex'
//       });

//       if (!repoInput) {
//         return;
//       }

//       const parsed = parseRepositoryInput(repoInput);
//       if (!parsed) {
//         vscode.window.showErrorMessage('Formato inválido. Use: https://github.com/owner/repo ou owner/repo');
//         return;
//       }

//       const { owner, repo } = parsed;

//       const basePath = await vscode.window.showInputBox({
//         prompt: 'Pasta base (ex: eng)',
//         value: configService.getConfig().defaultBasePath,
//       });

//       const downloadPathType = await vscode.window.showQuickPick(
//         ['Workspace', 'Global'],
//         {
//           placeHolder: 'Escolha onde os arquivos serão baixados por padrão',
//           title: 'Tipo de diretório de download'
//         }
//       );

//       const downloadPath = downloadPathType === 'Global' ? 'global' : 'workspace';

//       const token = await vscode.window.showInputBox({
//         prompt: 'Token GitHub (opcional para público)',
//         password: true,
//       });

//       const config = configService.getConfig();
//       const newRepositories = config.repositories.filter(
//         (r) => !(r.owner === owner && r.repo === repo)
//       );
//       newRepositories.push({
//         owner,
//         repo,
//         basePath: basePath ?? config.defaultBasePath,
//         downloadPath: downloadPath ?? config.defaultDownloadPath,
//         token: token ?? undefined,
//       });
//       await configService.saveRepositories(newRepositories);
//       if (token) {
//         await configService.saveToken(owner, repo, token);
//       }
//       vscode.window.showInformationMessage('Repositório configurado.');
//     })
//   );

//   context.subscriptions.push(
//     //TODO: Alterar para selecionar a ferramenta de IA padrão: copilot, vscode, cursor, windsurf, claude, etc
//     vscode.commands.registerCommand('githubMarkdownViewer.configureBasePath', async () => {
//       const basePath = await vscode.window.showInputBox({
//         prompt: 'Pasta base padrão',
//         value: configService.getConfig().defaultBasePath,
//       });
//       if (basePath) {
//         await configService.saveDefaultBasePath(basePath);
//         vscode.window.showInformationMessage('Pasta base atualizada.');
//       }
//     })
//   );

//   context.subscriptions.push(
//     //TODO: Ajustar o diretorio padrão para "Configuração global ou workspace"
//     vscode.commands.registerCommand('githubMarkdownViewer.configureDownloadPath', async () => {
//       const downloadPathType = await vscode.window.showQuickPick(
//         ['Workspace', 'Global'],
//         {
//           placeHolder: 'Escolha onde os arquivos serão baixados por padrão',
//           title: 'Tipo de diretório de download'
//         }
//       );

//       if (!downloadPathType) {
//         return;
//       }

//       const downloadPath = downloadPathType === 'Global' ? 'global' : 'workspace';
//       await configService.saveDefaultDownloadPath(downloadPath);
//       vscode.window.showInformationMessage(`Diretório de download atualizado para: ${downloadPathType}`);
//     })
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand('githubMarkdownViewer.configureToken', async () => {
//       //TODO: Ajustar para apresentar uma lista de repositórios já configurados para selecionar o repositório
//       const owner = await vscode.window.showInputBox({ prompt: 'Owner do repositório' });
//       const repo = await vscode.window.showInputBox({ prompt: 'Nome do repositório' });
//       const token = await vscode.window.showInputBox({
//         prompt: 'Token GitHub',
//         password: true,
//       });
//       if (owner && repo && token) {
//         await configService.saveToken(owner, repo, token);
//         vscode.window.showInformationMessage('Token salvo.');
//       }
//     })
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       'githubMarkdownViewer.previewFile',
//       async (repository: RepositoryNode, filePath: string) => {
//         const content = await gitHubService.getFileContent(repository, filePath);
//         const document = await vscode.workspace.openTextDocument({
//           content,
//           language: 'markdown',
//         });
//         await vscode.window.showTextDocument(document, { preview: true });
//       }
//     )
//   );

//   context.subscriptions.push(
//     //TODO: Ajustar as rotinas de download para baixar nas pastas corretas de acordo com o tipo, ex.: "*.agents.md" deve baixar na pasta "agents", "*.prompts.md" deve baixar na pasta "prompts", etc. 
//     // e na pasta da ferramenta de IA padrão configurada: copilot, vscode, cursor, windsurf, claude, etc.
//     vscode.commands.registerCommand(
//       'githubMarkdownViewer.downloadFile',
//       async (repository: RepositoryNode, filePath: string) => {
//         const target = await pickDownloadTarget(repository.downloadPath ?? './downloads');
//         if (!target) {
//           return;
//         }
//         const buffer = await gitHubService.downloadFile(repository, filePath);
//         fileService.writeFile(target, filePath.split('/').pop() ?? 'file.md', buffer);
//         vscode.window.showInformationMessage('Arquivo baixado.');
//       }
//     )
//   );

//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       'githubMarkdownViewer.downloadPlugin',
//       async (repository: RepositoryNode, pluginPath: string) => {
//         const target = await pickDownloadTarget(repository.downloadPath ?? './downloads');
//         if (!target) {
//           return;
//         }
//         const files = await gitHubService.downloadFolder(repository, pluginPath);
//         for (const file of files) {
//           fileService.writeFile(target, file.relativePath, file.content);
//         }
//         vscode.window.showInformationMessage('Plugin baixado.');
//       }
//     )
//   );
}

async function pickDownloadTarget(defaultPath: string): Promise<string | undefined> {
  // Se já foi configurado como 'workspace' ou 'global', usa a configuração
  if (defaultPath === 'workspace') {
    const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (workspace) {
      return workspace;
    }
  }

  if (defaultPath === 'global') {
    // Retorna o diretório global do VSCode/Cursor/Windsurf
    // Para VSCode: %APPDATA%\Code\User ou ~/.config/Code/User
    const globalStoragePath = vscode.env.appRoot;
    return globalStoragePath;
  }

  // Se não está configurado, pergunta ao usuário
  const choice = await vscode.window.showQuickPick(
    ['Workspace', 'Global', 'Diretório específico'],
    { placeHolder: 'Escolha o local de download' }
  );

  if (!choice) {
    return undefined;
  }

  if (choice === 'Workspace') {
    const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    return workspace ?? defaultPath;
  }

  if (choice === 'Global') {
    return vscode.env.appRoot;
  }

  const uri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectMany: false,
    canSelectFolders: true,
    openLabel: 'Selecionar diretório de download',
  });

  if (uri && uri[0]) {
    return uri[0].fsPath;
  }

  return defaultPath;
}

function parseRepositoryInput(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();

  // Tenta extrair de uma URL do GitHub
  const urlMatch = trimmed.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(\.git)?$/);
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2]
    };
  }

  // Tenta extrair do formato owner/repo
  const shortMatch = trimmed.match(/^([^\/]+)\/([^\/]+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2]
    };
  }

  return null;
}
