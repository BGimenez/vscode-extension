export interface RepositoryConfig {
  domain: string;
  owner: string;
  repo: string;
  label: string;
  token?: string;
  isEnterprise?: boolean;
  baseUrl?: string;
  downloadPath?: string;
}

export interface ExtensionConfig {
  repositories: RepositoryConfig[];
  defaultBasePath: string;
  defaultDownloadPath: string;
}
