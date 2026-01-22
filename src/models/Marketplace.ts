export interface MarketplaceOwner {
  name: string;
  url?: string;
}

export interface MarketplaceSource {
  name: string;
  description?: string;
  version?: string;
  tags?: string[];
  author?: {
    name?: string;
  };
  source: string;
  license?: string;
}

export interface MarketplaceFile {
  name: string;
  owner?: MarketplaceOwner;
  plugins?: MarketplaceSource[];
  collections?: MarketplaceSource[];
}
