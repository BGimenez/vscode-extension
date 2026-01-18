import * as vscode from 'vscode';
import { ConfigService } from '../services/ConfigService';
import { GitHubService, GitHubFileEntry } from '../services/GitHubService';
import { RepositoryNode } from '../models/Repository';
import { MarketplacePlugin } from '../models/Marketplace';

type ItemType = 'repository' | 'folder' | 'file' | 'plugin';

export interface TreeNode {
  type: ItemType;
  label: string;
  path?: string;
  repository?: RepositoryNode;
  plugin?: MarketplacePlugin;
}

export default interface InterfaceProvider {
  refresh(): void;
}

export class GitHubTreeProvider implements vscode.TreeDataProvider<TreeNode>, InterfaceProvider {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined | null | void> =
    new vscode.EventEmitter<TreeNode | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(
    private readonly configService: ConfigService,
    private readonly gitHubService: GitHubService
  ) { }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeNode): vscode.TreeItem {
    const collapsibleState =
      element.type === 'file' ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed;
    const item = new vscode.TreeItem(element.label, collapsibleState);
    item.contextValue = element.type;

    if (element.type === 'file' && element.repository && element.path) {
      item.command = {
        command: 'githubMarkdownViewer.previewFile',
        title: 'Pré-visualizar',
        arguments: [element.repository, element.path],
      };
    }

    return item;
  }

  async getChildren(element?: TreeNode): Promise<TreeNode[]> {
    if (!element) {
      return this.getRepositories();
    }

    switch (element.type) {
      case 'repository':
        return this.getRepositoryChildren(element.repository!);
      case 'folder':
        return this.getFolderChildren(element.repository!, element.path!);
      case 'plugin':
        return this.getPluginChildren(element.repository!, element.plugin!);
      default:
        return [];
    }
  }

  private async getRepositories(): Promise<TreeNode[]> {
    const config = this.configService.getConfig();
    return config.repositories.map((repo) => ({
      type: 'repository',
      label: `${repo.owner}/${repo.repo}`,
      repository: {
        owner: repo.owner,
        repo: repo.repo,
        token: repo.token,
        basePath: repo.basePath ?? config.defaultBasePath,
        downloadPath: repo.downloadPath ?? config.defaultDownloadPath,
      },
    }));
  }

  private async getRepositoryChildren(repository: RepositoryNode): Promise<TreeNode[]> {
    const basePath = repository.basePath ?? '';
    const children: TreeNode[] = [];

    try {
      const folders = await this.gitHubService.listFolders(repository, basePath);
      children.push(
        ...folders.map((folder) => ({
          type: 'folder' as const,
          label: folder.name,
          path: folder.path,
          repository,
        }))
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(`Erro ao listar pastas: ${error.message ?? error}`);
    }

    try {
      const marketplace = await this.gitHubService.findMarketplace(repository, basePath);
      if (marketplace && marketplace.plugins?.length) {
        children.push({
          type: 'folder',
          label: 'plugins',
          path: `${basePath}/plugins`,
          repository,
        });
      }
    } catch (error: any) {
      // silêncio para marketplace inexistente
    }

    return children;
  }

  private async getFolderChildren(repository: RepositoryNode, folderPath: string): Promise<TreeNode[]> {
    const nodes: TreeNode[] = [];

    try {
      const files = await this.gitHubService.listMarkdownFiles(repository, folderPath);
      nodes.push(
        ...files.map((file) => ({
          type: 'file' as const,
          label: file.name,
          path: file.path,
          repository,
        }))
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(`Erro ao listar arquivos: ${error.message ?? error}`);
    }

    try {
      const entries = await this.gitHubService.listDirectory(repository, folderPath);
      const foldersOnly = entries.filter((entry) => entry.type === 'dir');
      nodes.push(
        ...foldersOnly.map((folder: GitHubFileEntry) => ({
          type: 'folder' as const,
          label: folder.name,
          path: folder.path,
          repository,
        }))
      );
    } catch (error: any) {
      // já tratado acima para markdown
    }

    if (folderPath.endsWith('/plugins')) {
      const basePath = folderPath.replace(/\/plugins$/, '');
      try {
        const marketplace = await this.gitHubService.findMarketplace(repository, basePath);
        if (marketplace?.plugins?.length) {
          nodes.push(
            ...marketplace.plugins.map((plugin) => ({
              type: 'plugin' as const,
              label: plugin.name,
              path: plugin.source,
              repository,
              plugin,
            }))
          );
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(`Erro ao carregar marketplace: ${error.message ?? error}`);
      }
    }

    return nodes;
  }

  private async getPluginChildren(repository: RepositoryNode, plugin: MarketplacePlugin): Promise<TreeNode[]> {
    // Plugins não têm filhos adicionais; apenas ação de download.
    return [];
  }
}
