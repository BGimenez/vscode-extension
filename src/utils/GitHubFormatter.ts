export default class GitHubFormatter {
	//TODO: Nesse primeiro momento vamos deixar fixo o caminho do arquivo .cortex-plugin, em uma proxima feature ajustamos para buscar de outros repos, se necessário.
	static formatUrl(domain: string, owner: string, repo: string, path?: string): string {
		return `https://api.${domain}/repos/${owner}/${repo}/contents/${path !== undefined ? path : ''}`;
	}

	static getHeaders(token?: string): Record<string, string> {
		const headers: Record<string, string> = {
			'User-Agent': 'emr-developer-cortex-extension',
			'Accept': 'application/vnd.github.v3+json',
			'X-Requested-With': 'Cortex-Extension',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'en-US,en;q=0.9',
			'Cache-Control': 'no-cache',
			'Pragma': 'no-cache',
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-origin',
		};

		if (token) {
			headers['Authorization'] = `token ${token}`;
		}
		return headers;
	}
}