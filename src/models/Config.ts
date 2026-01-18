export interface RepositoryConfig {
  owner: string;
  repo: string;
  label: string;
  token?: string;
  basePath?: string;
  downloadPath?: string;
}

export interface ExtensionConfig {
  repositories: RepositoryConfig[];
  defaultBasePath: string;
  defaultDownloadPath: string;
}
