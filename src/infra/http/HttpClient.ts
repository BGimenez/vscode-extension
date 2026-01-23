import axios from 'axios';
import GitHubFormatter from '../../utils/GitHubFormatter';

export default interface HttpClient {
	get(domain: string, owner: string, repo: string, path?: string, token?: string): Promise<any>;
	getByUrl(url: string, token?: string): Promise<any>;
}

export class AxiosAdapter implements HttpClient {
	private axiosConfig: any;
	constructor() {
		this.axiosConfig = {
			timeout: 10000,
		};
	}

	async get(domain: string, owner: string, repo: string, path?: string, token?: string): Promise<any> {
		const url = GitHubFormatter.formatUrl(domain, owner, repo, path);
		console.log('Fetching URL:', url, token);
		const headers = GitHubFormatter.getHeaders(token);
		console.log('Using headers:', headers);
		this.axiosConfig.headers = headers;
		this.axiosConfig.withCredentials = !!token;
		try {
			const response = await axios.get(url, this.axiosConfig);
			console.log('Received response:', response.data);
			return response.data;
		} catch (error) {
			console.error(`Error fetching URL: ${url}`, error);
			throw error;
		}
	}

	async getByUrl(url: string, token?: string): Promise<any> {
		const headers = GitHubFormatter.getHeaders(token);
		this.axiosConfig.headers = headers;
		this.axiosConfig.withCredentials = !!token;
		try {
			const response = await axios.get(url, this.axiosConfig);
			return response.data;
		} catch (error) {
			console.error(`Error fetching URL: ${url}`, error);
			throw error;
		}
	}
}