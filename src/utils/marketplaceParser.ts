import yaml from 'js-yaml';
import { MarketplaceFile } from '../models/Marketplace';

export function parseMarketplace(raw: any, filename: string): MarketplaceFile {
	const data = raw as MarketplaceFile;
	if (!Array.isArray(data.plugins) && !Array.isArray(data.collections)) {
		throw new Error('Marketplace sem plugins');
	}
	return data;
}
