import { GitHubService, GitHubFileEntry } from '../src/services/GitHubService';
import HttpClient from '../src/infra/http/HttpClient';
import { RepositoryNode } from '../src/models/Repository';

describe('GitHubService', () => {
  let gitHubService: GitHubService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    // Cria um mock do HttpClient
    mockHttpClient = {
      get: jest.fn(),
      getByUrl: jest.fn(),
    } as jest.Mocked<HttpClient>;

    // Instancia o GitHubService com o mock
    gitHubService = new GitHubService(mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listSources', () => {
    it('deve retornar apenas diretórios listados no arquivo de configuração do repositório', async () => {
      // Arrange
      const repositoryNode: RepositoryNode = {
        domain: 'https://api.github.com',
        owner: 'test-owner',
        repo: 'test-repo',
        label: 'Test Repository',
        path: '.cortex-plugin',
        token: 'test-token',
      };

      const mockResponse = [
        {
          name: 'marketplace.json',
          path: '.cortex-plugin/marketplace.json',
          url: 'https://api.github.com/repos/test-owner/test-repo/contents/.cortex-plugin/marketplace.json?ref=main',
          html_url: 'https://github.com/test-owner/test-repo/blob/main/.cortex-plugin/marketplace.json',
          download_url: 'https://raw.githubusercontent.com/test-owner/test-repo/main/.cortex-plugin/marketplace.json',
          type: 'file',
        }
      ];

      const mockMarketplaceContent = {
        collections: [
          { name: 'Azure Collection', source: 'collections/azure' },
          { name: 'AWS Collection', source: 'collections/aws' }
        ],
        plugins: [
          { name: 'GitHub Plugin', source: 'plugins/github' }
        ]
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);
      mockHttpClient.getByUrl = jest.fn().mockResolvedValue(JSON.stringify(mockMarketplaceContent));

      // Act
      const result = await gitHubService.listSources(repositoryNode);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        repositoryNode.domain,
        repositoryNode.owner,
        repositoryNode.repo,
        repositoryNode.path,
        repositoryNode.token
      );
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.getByUrl).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/test-owner/test-repo/main/.cortex-plugin/marketplace.json',
        'test-token'
      );
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        {
          name: 'Azure Collection',
          path: 'collections/azure',
          type: 'dir',
        },
        {
          name: 'AWS Collection',
          path: 'collections/aws',
          type: 'dir',
        },
        {
          name: 'GitHub Plugin',
          path: 'plugins/github',
          type: 'dir',
        },
      ]);
		
    });

    it('deve retornar array vazio quando não houver marketplace.json', async () => {
      // Arrange
      const repositoryNode: RepositoryNode = {
        domain: 'https://api.github.com',
        owner: 'test-owner',
        repo: 'test-repo',
        label: 'Test Repository',
        path: '.cortex-plugin',
        token: 'test-token',
      };

      const mockResponse = [
        {
          name: 'file1.ts',
          path: '.cortex-plugin/file1.ts',
          url: 'https://api.github.com/repos/test-owner/test-repo/contents/.cortex-plugin/file1.ts',
          html_url: 'https://github.com/test-owner/test-repo/blob/main/.cortex-plugin/file1.ts',
          download_url: 'https://raw.githubusercontent.com/test-owner/test-repo/main/.cortex-plugin/file1.ts',
          type: 'file',
        },
        {
          name: 'file2.json',
          path: '.cortex-plugin/file2.json',
          url: 'https://api.github.com/repos/test-owner/test-repo/contents/.cortex-plugin/file2.json',
          html_url: 'https://github.com/test-owner/test-repo/blob/main/.cortex-plugin/file2.json',
          download_url: 'https://raw.githubusercontent.com/test-owner/test-repo/main/.cortex-plugin/file2.json',
          type: 'file',
        },
      ];

      mockHttpClient.get.mockResolvedValue(mockResponse);

      // Act
      const result = await gitHubService.listSources(repositoryNode);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando a resposta não for um array', async () => {
      // Arrange
      const repositoryNode: RepositoryNode = {
        domain: 'https://api.github.com',
        owner: 'test-owner',
        repo: 'test-repo',
        label: 'Test Repository',
        path: 'src',
        token: 'test-token',
      };

      const mockResponse = {
        name: 'file1.ts',
        path: 'src/file1.ts',
        type: 'file',
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      // Act
      const result = await gitHubService.listSources(repositoryNode);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando a resposta for um array vazio', async () => {
      // Arrange
      const repositoryNode: RepositoryNode = {
        domain: 'https://api.github.com',
        owner: 'test-owner',
        repo: 'test-repo',
        label: 'Test Repository',
        path: '.cortex-plugin',
        token: 'test-token',
      };

      const mockResponse: any[] = [];

      mockHttpClient.get.mockResolvedValue(mockResponse);

      // Act
      const result = await gitHubService.listSources(repositoryNode);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('deve retornar array vazio quando getByUrl retornar vazio', async () => {
      // Arrange
      const repositoryNode: RepositoryNode = {
        domain: 'https://api.github.com',
        owner: 'test-owner',
        repo: 'test-repo',
        label: 'Test Repository',
        path: '.cortex-plugin',
        token: 'test-token',
      };

      const mockResponse = [
        {
          name: 'marketplace.json',
          path: '.cortex-plugin/marketplace.json',
          download_url: 'https://raw.githubusercontent.com/test-owner/test-repo/main/.cortex-plugin/marketplace.json',
          type: 'file',
        }
      ];

      mockHttpClient.get.mockResolvedValue(mockResponse);
      mockHttpClient.getByUrl = jest.fn().mockResolvedValue(null);

      // Act
      const result = await gitHubService.listSources(repositoryNode);

      // Assert
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
