import * as vscode from 'vscode';
import { RepositoryConfig } from '../models/Config';

const GLOBAL_KEY = 'cortex.sources';
const REPO_KEY = 'cortex.repositories';
const DEFAULT_REPO: RepositoryConfig[] = [{
  domain: 'github.com',
  owner: 'philips-internal',
  repo: 'emr-developer-cortex',
  label: 'EMR Developer Cortex',
}];
//TODO: Essa classe deverá ser responsável por gerenciar as configurações dos repositorios
// e outras configurações da extensão como: token de autenticação, etc.
export class ConfigService {
  //   private readonly configuration: vscode.WorkspaceConfiguration;
  //   private readonly secrets: vscode.SecretStorage;

  //   constructor(secrets: vscode.SecretStorage) {
  //     this.configuration = vscode.workspace.getConfiguration(CONFIG_KEY);
  //     this.secrets = secrets;
  //   }

  // static async initializeConfig(context: vscode.ExtensionContext): Promise<void> {
  static async initializeConfig(): Promise<void> {
    // const repositories = this.getRepositories(context);
    const repositories = this.getRepositories();
    console.log('Loaded repositories:', repositories.map(r => `${r.owner}/${r.repo}`).join(', '));
  }

  /**
   * Get repositories and sources from VS Code settings, then fallback to global state
   */
  // static getRepositories(context: vscode.ExtensionContext): RepositoryConfig[] {
  static getRepositories(): RepositoryConfig[] {
    const configuration = vscode.workspace.getConfiguration();
    const repositories = configuration.get<RepositoryConfig[]>(REPO_KEY, []);
    if (repositories && Array.isArray(repositories) && repositories.length > 0) {
      // context.globalState.update(GLOBAL_KEY, repositories);
      return repositories;
    }

    // const globalRepos = context.globalState.get<RepositoryConfig[]>(GLOBAL_KEY, []);
    // if (globalRepos && Array.isArray(globalRepos) && globalRepos.length > 0) {
    //   this.syncConfigToSettings(globalRepos);
    //   return globalRepos;
    // }

    this.syncConfigToSettings(DEFAULT_REPO);
    // context.globalState.update(GLOBAL_KEY, DEFAULT_REPO);
    return this.getDefaultRepositories();
  }

  /**
   * Set repository in both global and VS Code settings
   * @param context VSCode context
   * @param repositories RepositoryConfig[]
   */
  // static async setRepositories(context: vscode.ExtensionContext, repositories: RepositoryConfig[]): Promise<void> {
  static async setRepository(repository: RepositoryConfig): Promise<void> {
    // await context.globalState.update(GLOBAL_KEY, repositories);
    const repositories = this.getRepositories();
    await this.syncConfigToSettings([
      ...repositories,
      repository
    ]);
  }

  /**
   * Get default repositories
   * @returns RepositoryConfig[]
   */
  static getDefaultRepositories(): RepositoryConfig[] {
    return DEFAULT_REPO;
  }

  /**
   * Sync configuration to VS Code settings
   * @param repositories RepositoryConfig[]
   */
  private static async syncConfigToSettings(repositories: RepositoryConfig[]): Promise<void> {
    try {
      const configuration = vscode.workspace.getConfiguration();
      await configuration.update(REPO_KEY, repositories, vscode.ConfigurationTarget.Global);
    } catch (error) {
      console.error('Failed to sync configuration to settings:', error);
    }
  }

  /**
   * Listen for configuration changes and sync repositories
   * @param context VS Code context
   * @param callback Function callback
   * @returns 
   */
  static onConfigurationChanged(context: vscode.ExtensionContext, callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration(REPO_KEY)) {
        // const repositories = this.getRepositories(context);
        const repositories = this.getRepositories();
        console.log('Configuration changed, updated repositories:', repositories.map(r => `${r.owner}/${r.repo}`).join(', '));

        if (callback) {
          callback();
        }
      }
    });
  }

  //   async saveRepositories(repositories: RepositoryConfig[]): Promise<void> {
  //     await this.configuration.update('repositories', repositories, vscode.ConfigurationTarget.Global);
  //   }

  //   async saveDefaultBasePath(basePath: string): Promise<void> {
  //     await this.configuration.update('defaultBasePath', basePath, vscode.ConfigurationTarget.Global);
  //   }

  //   async saveDefaultDownloadPath(downloadPath: string): Promise<void> {
  //     await this.configuration.update('defaultDownloadPath', downloadPath, vscode.ConfigurationTarget.Global);
  //   }

  //   async saveToken(owner: string, repo: string, token: string): Promise<void> {
  //     await this.secrets.store(this.secretKey(owner, repo), token);
  //   }

  //   async getToken(owner: string, repo: string): Promise<string | undefined> {
  //     return this.secrets.get(this.secretKey(owner, repo));
  //   }

  //   private secretKey(owner: string, repo: string): string {
  //     return `${CONFIG_KEY}.${owner}.${repo}.token`;
  //   }
}
