import * as vscode from 'vscode';
import MessageProvider from '../providers/StatusBarProvider';
import { ConfigService } from '../services/ConfigService';

export default interface CommandsAction {
    // addRepository(): void;
    // removeRepository(repositories: RepositoryConfig[]): void;
	manageConfiguration(): void;
	configureToken(): void;
    viewRepositories(): void;
}

//TODO: Talves esses comandos do vscode devem ser movidos para um arquivo separado
// para haver mais flexibilidade, pois no caso de uma CLI, por exemplo, não haverá inputbox
export class CommandsActionVsCode implements CommandsAction {
    constructor(private messageProvider: MessageProvider) { }

	async manageConfiguration() {
		const ide = await vscode.window.showInputBox({
			prompt: 'Enter IDE to configure (e.g., vscode, copilot, cursor)',
        	placeHolder: 'vscode | copilot | cursor | windsurf | claude',
			validateInput: (input) => {
				if (!input || !input.trim()) {
					return 'IDE is required.';
				}
				if (!['vscode', 'copilot', 'cursor', 'windsurf', 'claude'].includes(input.trim().toLowerCase())) {
					return 'Invalid IDE. Choose from: vscode, copilot, cursor, windsurf, claude.';
				}
				return null;
			}
		});
		if (!ide) {
			return;
    	}
		const installationScope = await vscode.window.showInputBox({
			prompt: 'Enter installation scope (Global or Workspace)',
        	placeHolder: 'Global | Workspace',
			validateInput: (input) => {
				if (!input || !input.trim()) {
					return 'Installation scope is required.';
				}
				if (!['global', 'workspace'].includes(input.trim().toLowerCase())) {
					return 'Invalid installation scope. Choose from: Global, Workspace.';
				}
				return null;
			}
		});
		if (!installationScope) {
			return;
    	}

		//Update configuration
		ConfigService.updateConfiguration(ide, installationScope);
	}

	async configureToken() {
		const repositories = ConfigService.getRepositories();
		const repoSelected = await vscode.window.showQuickPick(
			repositories.map((repo: any) => ({ label: `${repo.owner}/${repo.repo}`, source: repo })),
			{ placeHolder: 'Select a repository to configure token' }
		);
		if (!repoSelected) {
			return;
		}
		const token = await vscode.window.showInputBox({
			prompt: 'Enter GitHub Personal Access Token',
            placeHolder: 'ghp_xxxYourTokenxxx',
            validateInput: (input) => {
                if (!input || !input.trim()) {
                    return 'Token is required.';
                }
                return null;
            }
        });
		if (!token) {
			return;
		}
		const repoToUpdated = repoSelected.source;
		repoToUpdated.token = token.trim();
		await ConfigService.updateRepository(repoToUpdated);
		this.messageProvider.showInfo(`Token configured for ${repoSelected.label}.`);
	}

	viewRepositories() {
		const repositories = ConfigService.getRepositories();
		if (repositories.length === 0) {
			this.messageProvider.showInfo('No repositories configured.');
		} else {
			const repoList = repositories.map(r => `${r.owner}/${r.repo}`).join('\n');
			this.messageProvider.showInfo(`Configured Repositories:\n${repoList}`);
		}
	}

    // async addRepository() {
    //     const repository = await vscode.window.showInputBox({
    //         prompt: 'Enter GitHub repository (owner/repo or full URL)',
    //         placeHolder: 'https://github.com/owner/repo',
    //         validateInput: (input) => {
    //             if (!input || !input.trim()) {
    //                 return 'Repository is required.';
    //             }
    //             return null;
    //         }
    //     });
    //     if (!repository) {
    //         return;
    //     }

    //     const cleanInput = repository.trim();
    //     console.log('Parsing input: ', cleanInput);

    //     let domain: string = '';
    //     let owner: string = '';
    //     let repo: string = '';
    //     let isEnterprise: boolean = false;

    //     try {
    //         if (cleanInput.startsWith('http')) {
    //             const urlMatch = cleanInput.match(/^https?:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)(?:\/.*)?$/);
    //             console.log('URL match result: ', urlMatch);
    //             if (!urlMatch) {
    //                 throw new Error('Invalid repository URL.');
    //             }
    //             [domain, owner, repo] = urlMatch;
    //             console.log(`Parsed URL - Domain: ${domain}, Owner: ${owner}, Repo: ${repo}`);
    //             if (domain !== 'github.com') {
    //                 isEnterprise = true;
    //             }
    //         } else if (cleanInput.includes('/')) {
    //             [owner, repo] = cleanInput.split('/').filter(p => p.trim());
    //             console.log(`Parsed input - Owner: ${owner}, Repo: ${repo}`);
    //         } else {
    //             throw new Error('Invalid repository format.');
    //         }
    //     } catch (error) {
    //         console.log('URL parsing error: ', error)
    //     }


    //     if (!owner || !repo) {
    //         this.messageProvider.showError(`Invalid repository format.Use owner/repo or full URL. Parsed: owner="${owner}", repo="${repo}"`);
    //         return;
    //     }

    //     //check for existing repository
    //     const repositories = ConfigService.getRepositories();
    //     if (repositories.some(r => r.owner === owner && r.repo === repo)) {
    //         this.messageProvider.showWarning(`Repository ${owner}/${repo} already exists.`);
    //         return;
    //     }

    //     if (isEnterprise) {
    //         this.messageProvider.showInfo(`🔐 Enterprise GitHub Detected: ${owner}/${repo}\n\nPlease ensure you have configured your Personal Access Token using "Configure Enterprise Token" command.`);
    //     }

    //     //Check if repository has plugins configurated
    //     try {
    //         console.log('Checking repository plugins...');
    //         const exists = await GitHubService.checkRepositoryPlugins(domain, owner, repo, isEnterprise);

    //         if (!exists) {
    //             throw new Error(`Repository ${owner}/${repo} does not have plugins configurated.`);
    //         }

    //         await ConfigService.setRepository({
    //             domain: domain || 'github.com',
    //             owner,
    //             repo: repo.trim().replace(/\.git$/, ''),
    //             label: `${owner}/${repo}`,
    //             isEnterprise,
    //         });

    //         console.log('New repository added');
    //         this.messageProvider.showInfo(`✅ Repository ${owner}/${repo} added.`);
    //     } catch (error: any) {
    //         const errorMessage = (error && error.message) || error;
    //         const statusCode = error.response?.status;
    //         const responseData = error.response?.data;

    //         console.log('Error checking repository plugins: ', { statusCode, responseData, errorMessage });

    //         if (isEnterprise && (statusCode === 401 || errorMessage.includes('401') || errorMessage.includes('Unauthorized'))) {
    //             const choice = await vscode.window.showErrorMessage(
    //                 `🔐 Authentication Required (401)\n\nFailed to access ${domain}/${owner}/${repo}.\n\nPlease configure your Personal Access Token using "Configure Enterprise Token" command.`,
    //                 'Configure Enterprise Token',
    //                 'Retry',
    //                 'Cancel');
    //             if (choice === 'Configure Enterprise Token') {
    //                 vscode.commands.executeCommand('cortex.configureEnterpriseToken');
    //             } else if (choice === 'Retry') {
    //                 return;
    //             }
    //         } else {
    //             this.messageProvider.showError(`❌ Error adding repository ${owner}/${repo}: ${error.message}`);
    //         }
    //     }
    // }

    // async removeRepository(repositories: RepositoryConfig[]) {
    //     if (repositories.length === 1) {
    //         this.messageProvider.showWarning('At least one repository is required.');
    //         return;
    //     }

    //     const toRemove = await vscode.window.showQuickPick(
    //         repositories.map((repo: any) => ({ label: `${repo.owner}/${repo.repo}`, source: repo })),
    //         { placeHolder: 'Select a repository to remove' }
    //     );
    //     if (!toRemove) {
    //         return;
    //     }
    //     const repoUpdated = repositories.filter(repo => `${repo.owner}/${repo.repo}` !== toRemove.label);
    //     await ConfigService.setRepositories(repoUpdated);
    //     this.messageProvider.showInfo(`Repository ${toRemove.label} removed.`);

    // }

    // viewRepositories(repositories: RepositoryConfig[]) {
    //     if (repositories.length === 0) {
    //         this.messageProvider.showInfo('No repositories configured.');
    //     } else {
    //         const repoList = repositories.map(r => `${r.owner}/${r.repo}`).join('\n');
    //         this.messageProvider.showInfo(`Configured Repositories:\n${repoList}`);
    //     }
    // }
}