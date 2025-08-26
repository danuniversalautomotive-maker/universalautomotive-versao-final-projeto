# Maeztraio Filter Generator

App feito para gerar um filtro a partir de especificações de produto

---

## Configuração

---

1. Crie uma nova branch e mude o `vendor` do `manifest.json` para ser igual ao nome do account da loja que você está instalando o app. Lembrando que a branch deve ter o mesmo nome que o `vendor` da sua loja também.

2. Importe o app nas dependências do seu app no `manifest.json`, assim como o seguinte exemplo:

```json
  "dependencies": {
    "maeztraio.filter-generator": "0.x"
  }
```

3. Coloque o app `maeztraio.filter-generator` dentro de quelquer bloco, row ou col, ou page na seção de `children`, semelhante a seguinte estrutura de blocos:

```json
"store.{pagename}": {
  "blocks": [ ],
  "children": [ "react-app-template"],
},
"flex-layout.row#search-with-filter-content": {
    "children": ["filter-generator"],
    "props": {
      "blockClass": "search-with-filter-content"
    }
  }
```

---

## Propriedades

---

Necessario para o uso do app algumas alterações tanto de código a fim de trazer a especificação necessária, quanto de uso do back end para trazer os facets via query.

https://bitbucket.org/maeztra/insulfim.filter-generator-backend/src/main/

crie uma branch no app de backend para sua loja , e chame ele no manifest aqui como no exemplo abaixo

ps: lembrar de pedir autorização via form para usar o app de back end >>> https://docs.google.com/forms/d/e/1FAIpQLSfhuhFxvezMhPEoFlN9yFEkUifGQlGP4HmJQgx6GP32WZchBw/viewform

```json
 "dependencies": {
    "vtex.store-components": "3.x",
    "vtex.styleguide": "9.x",
    "vtex.css-handles": "0.x",
    "insulfilm.filter-generator-api-category-tree": "0.x"
  },
```

---

## Como funciona o App

---

O app funciona atraves do uso da api de inteligent search, ele lista todos os facets, e vai filtrando conforme a necessidade do usuario, no caso aqui, foi feito para filtrar
por montadora, modelo e grau de escurecimento.
Quem for usar, precisa somente mudar os nomes dos values, para que não haja erro na aplicação.

---

## Pacotes globais necessários

---

```
   yarn global add vtex
   yarn global add gulp
   yarn global add concurrently
```

## Inicializando o Projeto

---

> **Observação: Este projeto utiliza VTEX IO** > **Observação: Siga estes passos para inicializar o projeto**

1. Verificar se esta logado na VTEX do seu cliente
   - `vtex whoami`
     - `info: Logged into {{accountClient}} as yourUser@maeztra.com at production workspace master`
2. Instalar os pacotes do node
   - `yarn`

### Isso aparecerá em sua tela

---

```
$ yarn
yarn install v1.22.11
[1/4] Resolving packages...
success Already up-to-date.
$ gulp css
[16:36:56] Requiring external module babel-register
[16:36:56] Using gulpfile ~\Documents\Maeztra\accountname.store-theme\gulpfile.babel.js
[16:36:56] Starting 'css'...
[16:36:56] Finished 'css' after 325 ms
Done in 26.05s.
```

## Desenvolvendo no Projeto

---

1. Agora para começar a desenvolver voce precisa saber se esta logado no seu {{accountClient}}
   - `vtex whoami`
     - `info: Logged into {{accountClient}} as yourUser@maeztra.com at production workspace master`
2. Criar seu próprio workspace
   - `vtex use exampleWorkspace`
     - A partir disso voce criará seu próprio workspace para realizar suas alterações
3. Dar start em seu projeto
   - `yarn start`
     - Com esse comando o seu link do vtex e seu gulp watch estarão rodando concorrentemente
4. Agora e só codar.

## Workflow

---

1. Ao dar commit, não utilize a branch master, crie uma branch com o nome da atividade que estiver atuando com gitflow.
2. Dê pull request para a master somente quando finalizar a atividade e for aprovada.
3. Ao dar pull request, peça para que um colega de equipe faça um code review e a aprove.

## Contríbua

---

A organização desse repositório trabalha com esquema de gitflow:

1. [Fluxo de trabalho de Gitflow](https://www.atlassian.com/br/git/tutorials/comparing-workflows/gitflow-workflow)
2. [Git Flow Explained: Quick and simple](https://medium.com/@muneebsajjad/git-flow-explained-quick-and-simple-7a753313572f)
