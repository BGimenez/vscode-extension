import axios from 'axios';
import { AxiosAdapter } from '../src/infra/http/HttpClient';

axios.defaults.validateStatus = function () {
	return true;
}

test('deve fazer uma requisição GET com sucesso para GitHub.com', async () => {
	const domain = 'github.com';
	const owner = 'github';
	const repo = 'awesome-copilot';
	const httpClient = new AxiosAdapter();
	const result = await httpClient.get(domain, owner, repo);
	expect(result).toBeDefined();
});

test('deve retornar o arquivo json', async () => {
	const domain = 'github.com';
	const owner = 'philips-internal';
	const repo = 'emr-developer-cortex';
	const path = '.cortex-plugin';
	const token = process.env.GH_TOKEN;
	const httpClient = new AxiosAdapter();
	const result = await httpClient.get(domain, owner, repo, path, token);
	expect(result).toBeDefined();
	expect(result[0].name).toBe('marketplace.json');
	expect(result[0].path).toBe('.cortex-plugin/marketplace.json');
	expect(result[0].type).toBe('file');
});

test('deve lançar um erro ao fazer uma requisição GET para um repositório inexistente', async () => {
	const domain = 'github.com';
	const owner = 'repositorio-inexistente';
	const repo = 'nao-existe';
	const httpClient = new AxiosAdapter();
	const result = await httpClient.get(domain, owner, repo);
	expect(result).toBeDefined();
	expect(result.status).toBe('404');
	expect(result.message).toBe('Not Found');
});

test('deve retornar um status 404 quando o repositório for privado e o token não for informado', async () => {
	const domain = 'github.com';
	const owner = 'philips-internal';
	const repo = 'emr-developer-cortex';
	const path = '.cortex-plugin';
	const httpClient = new AxiosAdapter();
	const result = await httpClient.get(domain, owner, repo, path);
	expect(result).toBeDefined();
	expect(result.status).toBe('404');
	expect(result.message).toBe('Not Found');
});