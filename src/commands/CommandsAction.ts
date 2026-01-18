import { RepositoryConfig } from '../models/Config';
import MessageService from '../providers/StatusBarProvider';
import * as vscode from 'vscode';
import { ConfigService } from '../services/ConfigService';

export default interface CommandsAction {
    addRepository(): void;
    removeRepository(repositories: RepositoryConfig[]): void;
    viewRepositories(repositories: RepositoryConfig[]): void;
}

export class CommandsActionVsCode implements CommandsAction {
    constructor(private messageService: MessageService) { }

    async addRepository() {
        const repository = await vscode.window.showInputBox({
            prompt: 'Enter GitHub repository (owner/repo or full URL)',
            placeHolder: 'https://github.com/owner/repo',
            validateInput: (input) => {
                if (!input || !input.trim()) {
                    return 'Repository is required.';
                }
                return null;
            }
        });
        if (!repository) {
            return;
        }

        const cleanInput = repository.trim();
        console.log('Parsing input: ', cleanInput);

        try {
            if (cleanInput.startsWith('http')) {
                const urlMatch = cleanInput.match(/^https?:\/\/([^\/]+)\/([^\/]+)\/([^\/]+)(?:\/.*)?$/);
                console.log('URL match result: ', urlMatch);
                if (!urlMatch) {
                    throw new Error('Invalid repository URL.');
                }
                const [domain, owner, repo] = urlMatch;
                console.log(`Parsed URL - Domain: ${domain}, Owner: ${owner}, Repo: ${repo}`);
            }
        }

        const repositories = ConfigService.getRepositories();
        repositories.push({ owner: 'owner', repo: 'repo' });
        await ConfigService.setRepositories(repositories);
        this.messageService.showInfo('Repository added.');
    }

    async removeRepository(repositories: RepositoryConfig[]) {
        if (repositories.length === 1) {
            this.messageService.showWarning('At least one repository is required.');
            return;
        }

        const toRemove = await vscode.window.showQuickPick(
            repositories.map((repo: any) => ({ label: `${repo.owner}/${repo.repo}`, source: repo })),
            { placeHolder: 'Select a repository to remove' }
        );
        if (!toRemove) {
            return;
        }
        const repoUpdated = repositories.filter(repo => `${repo.owner}/${repo.repo}` !== toRemove.label);
        await ConfigService.setRepositories(repoUpdated);
        this.messageService.showInfo(`Repository ${toRemove.label} removed.`);

    }

    viewRepositories(repositories: RepositoryConfig[]) {
        if (repositories.length === 0) {
            this.messageService.showInfo('No repositories configured.');
        } else {
            const repoList = repositories.map(r => `${r.owner}/${r.repo}`).join('\n');
            this.messageService.showInfo(`Configured Repositories:\n${repoList}`);
        }
    }
}