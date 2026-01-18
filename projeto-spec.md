Você é um desenvolvedor de software experiente especializado em planejamento e desenvolvimento de extensões para IDEs e editores de código.

Seu objetivo é desenvolver uma extensão para o editor de código Visual Studio Code que permita ao usuário ver uma lista, em formato Tree View na primary sidebar, pre-visualizar e baixar os arquivos, de extensão `.md`, de um repositório do GitHub (publico ou privado) para o workspace do usuário ou para uma pasta específica.

# Funcionalidades
1. Listar os arquivos do repositório em formato Tree View na primary sidebar.
2. Permitir ao usuário selecionar um arquivo para pré-visualização.
3. Permitir ao usuário selecionar um arquivo para download.
4. Permitir ao usuário informar, atraves de um `command`, o repositório que deseja listar. Porém, a extensão terá um repositório padrão pré-configurado.
5. Permitir ao usuário informar, atraves de um `command`, a pasta que deseja listar. Porém, a extensão terá uma pasta padrão pré-configurada.
6. Permitir ao usuário informar, atraves de um `command`, o diretório de download. Porém, a extensão terá um diretório de download padrão pré-configurado.
7. Permitir ao usuário informar, atraves de um `command`, o token de autenticação do GitHub para repositórios privados.
8. Permitir ao usuário salvar as configurações realizadas.

# Regras críticas
- DEVE funcionar para a IDE Visual Studio Code e seus forks como: cursor e windsurf.
- DEVE funcionar para repositórios públicos e privados do GitHub.
- DEVE apresentar os arquivos em formato Tree View na primary sidebar.
- Para os repositórios privados, DEVE ser necessário informar o token de autenticação do GitHub.
- Para as configurações realizadas, DEVE ser possível salvar as configurações e carregar as configurações salvas.

# Comportamentos
1. Ao acessar a extensão, deve-se mostrar uma lista de repositórios do GitHub que o usuário pode selecionar.
    1.1. Essa lista deve ser carregada conforme repositórios configurados préviamente, através dos `commands` do VSCode.
2. Ao selecionar um repositório, deve-se mostrar uma lista de pastas do repositório.
    2.1. Essa lista deve ser carregada a partir de uma pasta específica como `<raiz do repositorio>/eng`
    2.2. Deve-se apresentar as pastas contidas apenas na pasta especificada.
3. Ao selecionar uma pasta, deve-se mostrar uma lista de arquivos, com a extensão `.md`, do repositório.
    3.1. Ao passar o mouse sobre o arquivo listado, deve-se apresentar 2 icones com as seguintes ações:
        3.1.1. "previsualizar" - ao clicar no icone de previsualizar, deve-se mostrar o conteúdo do arquivo em uma aba de pré-visualização.
        3.1.2. "baixar" - ao clicar no icone de baixar, deve-se perguntar ao usuário se ele deseja baixar no diretório do workspace atual ou em uma pasta específica.
4. Se na pasta do repositório houver um arquivo com o nome `marketplace.yml`, `marketplace.yaml` ou `marketplace.json`, deve-se apresentar, na lista de pastas conforme item 2, uma pasta chamada `plugins` que deve conter os plugins listados nesse arquivo onde o nome do plugin deve ser o contido em `plugins.name`.
    4.1. Ao passar o mouse sobre um plugin, deve-se mostrar 1 icone com a seguinte ação:
        4.1.1. "baixar" - ao clicar no icone de baixar, deve-se perguntar ao usuário se ele deseja baixar no diretório do workspace atual ou em uma pasta específica.
            4.1.1.1. essa ação deverá baixar todos os arquivos e conteúdos listados nos campo `contents` do plugin.
    4.2. A estrutura do arquivo deverá ser a seguinte:
        ```json
		{
			"name": "emr-developer-cortex", //nome do repositorio
			"owner": { //dados do responsável e url do repositório
				"name": "Philips EMR Team",
				"url": "https://github.com/philips-internal"
			},
			"plugins": [ //lista de plugins
				{
				"name": "azure", //nome do plugin
				"description": "Azure DevOps integration - work items and pipelines management", //breve descrição
				"version": "1.0.0", //versão
				"tags": [ //tags para consulta
					"azure-devops",
					"work-items",
					"pipelines",
					"enterprise"
				],
				"author": { //criador
					"name": "Philips EMR Team"
				},
				"source": "./plugins/azure", //caminho da pasta do repositório contendo os arquivos do plugin
				"license": "MIT" //dados da licença
				},
				...
			]
		}
        ``` 

# Tecnologias
- O projeto deve ser feito em NODE com TYPESCRIPT
- Para implementar o padrão de visualização no formato Tree View, deve-se utilizar a interface TreeDataProvider da API do Vscode (https://code.visualstudio.com/api/extension-guides/tree-view)
- Procure algum icone que melhor se encaixe nos processos

# Conhecimento
- Utilize o context7 MCP para consultar documentações e libs para a criação da extesão
- Acesse a pagina `https://code.visualstudio.com/api` e suas subpaginas para documentação da api do vscode

---

# V2 - features

1. quando carregar o repositório, verificar se os arquivos local (global ou workspace) tem alguma atualização, se tiver pedir para atualizar.