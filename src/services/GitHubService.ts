import axios from 'axios';
import { RepositoryNode } from '../models/Repository';
import { MarketplaceFile } from '../models/Marketplace';
import { parseMarketplace } from '../utils/marketplaceParser';
import HttpClient from '../infra/http/HttpClient';

export interface GitHubFileEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}

//TODO: Migrar para usar axios  ou fetch ao inves de Octokit
export class GitHubService {

	constructor(readonly httpClient: HttpClient){}

	async listSources(node: RepositoryNode): Promise<GitHubFileEntry[]> {
		const response = await this.httpClient.get(node.domain, node.owner, node.repo, node.path, node.token);
		if (!Array.isArray(response) || response.length === 0) {
			return [];
		}

		console.log('Repository contents response:', response);
		
		const marketplaceFile = response.find((item) => item.type === 'file' && item.name === 'marketplace.json');
		console.log('Marketplace file found:', marketplaceFile);
		
		if (!marketplaceFile || !marketplaceFile.download_url) {
			return [];
		}

		const marketplaceResponse = await this.httpClient.getByUrl(marketplaceFile.download_url, node.token);
		console.log('Marketplace file response:', marketplaceResponse);
		if (!marketplaceResponse) {
			return [];
		}
		const marketplace: MarketplaceFile = parseMarketplace(marketplaceResponse, 'marketplace.json');
		console.log('Parsed marketplace:', marketplace);
		const collections = marketplace.collections?.map(collection => ({
															name: collection.name,
															path: collection.source,
															type: 'dir',
														}) as GitHubFileEntry) ?? [];
		const plugins = marketplace.plugins?.map(plugin => ({
															name: plugin.name,
															path: plugin.source,
															type: 'dir',
														}) as GitHubFileEntry) ?? [];
		console.log('Marketplace collections and plugins:', { collections, plugins });
		return [...collections, ...plugins];
	}


//   async checkRepositoryPlugins(repository: RepositoryNode): Promise<boolean> {
//     const client = this.getClient(repository.token);
//     const url = this.formatUrl(repository.domain, repository.owner, repository.repo);
//     const headers: Record<string, string> = {
//       'User-Agent': 'Cortex',
//       'Accept': 'application/vnd.github.v3+json',
//     };
//     if (repository.isEnterprise) {
//       headers['Authorization'] = `token ${repository.token}`;
//     }
//     const response = await client.get(url, { headers });
//     if (response.status === 200) {
//       return true;
//     }
//     return false;
//   }


  

//   async listMarkdownFiles(node: RepositoryNode, path: string): Promise<GitHubFileEntry[]> {
//     const client = this.getClient(node.token);
//     const response = await client.repos.getContent({
//       owner: node.owner,
//       repo: node.repo,
//       path,
//     });
//     if (Array.isArray(response.data)) {
//       return response.data
//         .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.md'))
//         .map((item) => ({
//           name: item.name,
//           path: item.path,
//           type: 'file' as const,
//           download_url: item.download_url ?? undefined,
//         }));
//     }
//     return [];
//   }

//   async getFileContent(node: RepositoryNode, path: string): Promise<string> {
//     const client = this.getClient(node.token);
//     const response = await client.repos.getContent({
//       owner: node.owner,
//       repo: node.repo,
//       path,
//       mediaType: {
//         format: 'raw',
//       },
//     });
//     if (typeof response.data === 'string') {
//       return response.data;
//     }
//     if ('content' in response.data && typeof response.data.content === 'string') {
//       const encoding = response.data.encoding as BufferEncoding ?? 'base64';
//       const buffer = Buffer.from(response.data.content, encoding);
//       return buffer.toString('utf-8');
//     }
//     return '';
//   }

//   async findMarketplace(node: RepositoryNode, basePath: string): Promise<MarketplaceFile | undefined> {
//     const candidates = ['marketplace.yml', 'marketplace.yaml', 'marketplace.json'];
//     for (const file of candidates) {
//       try {
//         const content = await this.getFileContent(node, `${basePath}/${file}`);
//         return parseMarketplace(content, file);
//       } catch (error: any) {
//         if (error.status === 404) {
//           continue;
//         }
//         throw error;
//       }
//     }
//     return undefined;
//   }

//   async downloadFile(node: RepositoryNode, path: string): Promise<Buffer> {
//     const client = this.getClient(node.token);
//     const response = await client.repos.getContent({
//       owner: node.owner,
//       repo: node.repo,
//       path,
//       mediaType: { format: 'raw' },
//     });
//     if (typeof response.data === 'string') {
//       return Buffer.from(response.data);
//     }
//     if ('content' in response.data && typeof response.data.content === 'string') {
//       const encoding = response.data.encoding as BufferEncoding ?? 'base64';
//       return Buffer.from(response.data.content, encoding);
//     }
//     return Buffer.from([]);
//   }

//   async listDirectory(node: RepositoryNode, path: string): Promise<GitHubFileEntry[]> {
//     const client = this.getClient(node.token);
//     const response = await client.repos.getContent({
//       owner: node.owner,
//       repo: node.repo,
//       path,
//     });
//     if (Array.isArray(response.data)) {
//       return response.data.map((item) => ({
//         name: item.name,
//         path: item.path,
//         type: item.type === 'dir' ? 'dir' : 'file',
//         download_url: item.download_url ?? undefined,
//       }));
//     }
//     return [];
//   }

//   async downloadFolder(
//     node: RepositoryNode,
//     folderPath: string,
//     currentPath = ''
//   ): Promise<Array<{ relativePath: string; content: Buffer }>> {
//     const entries = await this.listDirectory(node, folderPath);
//     const results: Array<{ relativePath: string; content: Buffer }> = [];
//     for (const entry of entries) {
//       const nestedPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
//       if (entry.type === 'dir') {
//         const child = await this.downloadFolder(node, `${folderPath}/${entry.name}`, nestedPath);
//         results.push(...child);
//       } else {
//         const content = await this.downloadFile(node, entry.path);
//         results.push({ relativePath: nestedPath, content });
//       }
//     }
//     return results;
//   }
}
