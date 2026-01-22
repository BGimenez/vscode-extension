export interface RepositoryConfig {
  domain: string;
  owner: string;
  repo: string;
  label: string;
  path: string;
  token?: string;
  isEnterprise?: boolean;
  baseUrl?: string;
  downloadPath?: string;
}

export interface ExtensionConfig {
  repositories: RepositoryConfig[];
  aiTool: 'vscode' | 'copilot' | 'cursor' | 'windsurf' | 'claude';
  installationScope: 'Global' | 'Workspace';
}
