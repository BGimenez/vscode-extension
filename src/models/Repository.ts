export interface RepositoryNode {
  domain: string;
  owner: string;
  repo: string;
  basePath?: string;
  downloadPath?: string;
  token?: string;
}
