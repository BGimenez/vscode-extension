import yaml from 'js-yaml';
import { MarketplaceFile } from '../models/Marketplace';

export function parseMarketplace(raw: string, filename: string): MarketplaceFile {
  const isJson = filename.toLowerCase().endsWith('.json');
  const parsed = isJson ? JSON.parse(raw) : yaml.load(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Marketplace inválido');
  }
  const data = parsed as MarketplaceFile;
  if (!Array.isArray(data.plugins)) {
    throw new Error('Marketplace sem plugins');
  }
  return data;
}
