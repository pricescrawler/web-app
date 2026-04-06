# Plano de Ação — Prices Crawler Web App

> Análise gerada em 2026-04-05

## Estado da Implementação

| #   | Melhoria                              | Estado                                 |
| --- | ------------------------------------- | -------------------------------------- |
| 1   | Substituir `alert()` por Toast        | ✅ Concluído                           |
| 2   | Error Boundaries                      | ✅ Concluído                           |
| 3   | Adicionar testes                      | ⏳ Pendente                            |
| 4   | Memoização ProductCard                | ✅ Concluído                           |
| 5   | Validação e sanitização de inputs     | ✅ Concluído (trim no SearchContainer) |
| 6   | localStorage try/catch                | ✅ Concluído                           |
| 7   | Histórico de pesquisas / Autocomplete | ⏳ Pendente                            |
| 8   | Favoritos de produtos                 | ✅ Concluído                           |
| 9   | Filtros avançados na pesquisa         | ✅ Concluído                           |
| 10  | Indicador de variação de preço        | ✅ Concluído                           |
| 11  | Modo offline / Service Worker         | ⏳ Pendente                            |
| 12  | Exportação PDF                        | ✅ Concluído                           |
| 13  | Remover duplicação de código          | ✅ Concluído                           |
| 14  | PropTypes / TypeScript                | ⏳ Pendente                            |

### Sprint 4 — Features avançadas (concluído em 2026-04-05)

- `ProductSearch`: painel de filtros colapsável com seleção de marcas (chips) e faixa de preço (min/max); cálculo de `filteredProducts` via `useMemo`; botão "Filtros" com badge de contagem de filtros ativos; botão "Limpar filtros"
- `ProductList`: exportação para PDF via `window.print()` sem novas dependências — abre janela de impressão com tabela formatada (catálogo, nome, preço, qtd, total por linha e total geral)
- Traduções PT e EN actualizadas com chaves `pages.filters.*` e `pages.product-list.options.export-pdf`

### Sprint 3 — Novas funcionalidades (concluído em 2026-04-05)

- `src/services/store/favorites/favoritesReducer.js`: criado reducer de favoritos com ações `ADD_FAVORITE` / `REMOVE_FAVORITE` e persistência em localStorage
- `productsReducer.js`: `favorites` adicionado ao `combineReducers`
- `ProductCard`: botão de coração (favorito/desfavoritar) com estado visual preenchido/vazio; badge de desconto percentual (`-20%`) em vez de "PROMO" genérico quando há `campaignPrice` e `regularPrice`
- `src/pages/Favorites/index.jsx`: nova página com grelha de produtos favoritos, estado vazio e botão "Limpar todos"
- `NavigationBar`: link "Favoritos" com badge de contagem em desktop e mobile
- `App.jsx`: rota `/favorites` adicionada
- Traduções PT e EN atualizadas com chaves `menu.favorites`, `general.favorites.*`, `pages.favorites.*`

### Sprint 2 — Performance e código duplicado (concluído em 2026-04-05)

- `src/services/utils/index.js`: `convertToFloat` agora é null-safe (não crasha em null/undefined); adicionadas funções `tryParsePrice` e `handleImageError` centralizadas
- `ComparisonModal`: removida função `tryParsePrice` local, passa a usar `utils.tryParsePrice`; `onError` das imagens usa `utils.handleImageError`
- `ComparisonBar`: `onError` das imagens usa `utils.handleImageError`
- `ProductCard`: `truncate` movida para fora do componente; `addToList` usa `useCallback`; componente envolto em `React.memo`; `onError` usa `utils.handleImageError`
- `ProductSearch`: `Object.assign([], products)` substituído por `useMemo`; `handleSortChanges`, `handleViewModeChange`, `toggleComparison` e `isInComparison` envoltos em `useCallback`

### Sprint 1 — Quick wins (concluído em 2026-04-05)

- Instalada biblioteca `sonner` para notificações toast
- Criado `src/components/ErrorBoundary/index.jsx` com fallback de UI e botão de reload
- `App.jsx`: adicionado `<Toaster>` com suporte a dark mode, `<ErrorBoundary>` a envolver as rotas, e try/catch no acesso ao localStorage
- `productsReducer.js`: removidos `alert()` dos cases `GET_PRODUCTS_FAIL` e `GET_PRODUCT_FAIL` (reducers devem ser funções puras); adicionado try/catch ao `localStorage.getItem`
- `productsActions.js`: adicionado `toast.error()` em todos os `.catch()` das thunks
- `SearchContainer/index.jsx`: substituídos todos os `alert()` por `toast.error()` / `toast.warning()`; adicionado `.trim()` ao valor de pesquisa

---

## Estado Atual

App React 19 + Redux + Tailwind CSS para pesquisa e comparação de preços, com lista de compras, histórico de preços e i18n (PT/EN). Boa base, mas com pontos críticos a resolver.

---

## Prioridade Crítica

### 1. Substituir todos os `alert()` por notificações Toast

**Problema:** Os `alert()` bloqueiam a interface — péssima UX em produção.

**Ficheiros afetados:**

- `src/services/store/products/productsReducer.js` (linhas 56, 77)
- `src/components/SearchContainer/index.jsx` (linhas 45, 125, 154)

**Solução:** O shadcn/ui já está instalado e inclui componente `Toast` — basta adotar.

---

### 2. Error Boundaries

**Problema:** Sem nenhum `ErrorBoundary`, um crash num componente derruba a app toda sem feedback ao utilizador.

**Solução:** Criar um `ErrorBoundary` genérico em `src/components/ErrorBoundary/` e envolver as páginas em `src/App.jsx`.

---

### 3. Adicionar testes

**Problema:** Zero testes existem apesar das bibliotecas já instaladas (Testing Library, jest-dom).

**Ação prioritária:**

- Testes unitários para utilities: `src/services/utils/index.js`
- Testes para reducers Redux: `src/services/store/products/productsReducer.js`
- Testes de integração para componentes críticos: `ProductCard`, `SearchContainer`

---

## Prioridade Alta

### 4. Memoização de componentes

**Problema:** `ProductCard` é renderizado 50+ vezes sem `React.memo`. Em cada mudança de estado, todos re-renderizam desnecessariamente.

**Solução:** Adicionar `React.memo` ao `ProductCard` e `useCallback` nos handlers de `src/pages/ProductSearch/index.jsx`.

---

### 5. Validação e sanitização de inputs

**Problema:**

- Campo de pesquisa (`SearchContainer/index.jsx:287`) sem trim nem validação
- Respostas da API (`productsActions.js`) não verificam null/undefined antes de aceder a propriedades

---

### 6. localStorage com try/catch

**Problema:** `App.jsx:22` e outros ficheiros fazem `JSON.parse()` sem try/catch — se o localStorage estiver corrompido, a app crasha silenciosamente.

**Solução:** Envolver todos os acessos ao localStorage em try/catch com fallback seguro.

---

## Novas Funcionalidades

### 7. Histórico de pesquisas / Autocomplete

Guardar as últimas N pesquisas e mostrá-las como sugestões no campo de pesquisa. Sem necessidade de backend — pode ser persistido em localStorage.

---

### 8. Favoritos de produtos

Ícone de coração no `ProductCard` para guardar produtos. Persistir em localStorage. Lista de favoritos acessível via navegação.

---

### 9. Filtros avançados na pesquisa

Atualmente só existe ordenação por preço. Adicionar:

- Filtro por marca
- Filtro por quantidade/embalagem
- Faixa de preço (slider min/max)

---

### 10. Indicador de variação de preço

No `ProductCard`, mostrar a variação percentual do último preço vs. a média histórica (lógica já existe em `ProductDetails`).
Exemplo: `↓ 12%` em verde, `↑ 5%` em vermelho.

---

### 11. Modo offline / Service Worker

Adicionar um service worker básico para cachear assets e mostrar uma página de fallback quando não há internet, em vez de a app quebrar.

---

### 12. Exportação PDF da lista de compras

`ProductList` já exporta XLSX e cópia WhatsApp. Adicionar exportação PDF seria natural para impressão de listas.

---

## Dívida Técnica

### 13. Remover duplicação de código

- Lógica `convertToFloat` duplicada em `src/services/utils/index.js:7-10` e `src/components/ComparisonModal/index.jsx:24-29`
- Handler de erro de imagem repetido em `ProductCard`, `ComparisonBar` e `ComparisonModal`

**Solução:** Centralizar em `src/services/utils/index.js` e reutilizar.

---

### 14. PropTypes / TypeScript

Múltiplos componentes com `/* eslint-disable react/prop-types */` desativam a validação de props em componentes críticos.

**Opções:**

- Adicionar PropTypes nos componentes existentes (baixo esforço)
- Migrar gradualmente para TypeScript (maior esforço, maior robustez)

---

## Resumo por Esforço vs. Impacto

| #   | Melhoria                       | Esforço | Impacto |
| --- | ------------------------------ | ------- | ------- |
| 1   | Substituir `alert()` por Toast | Baixo   | Alto    |
| 2   | Error Boundaries               | Baixo   | Alto    |
| 4   | Memoização ProductCard         | Baixo   | Médio   |
| 6   | localStorage try/catch         | Baixo   | Médio   |
| 10  | Indicador variação de preço    | Médio   | Alto    |
| 8   | Favoritos de produtos          | Médio   | Alto    |
| 7   | Histórico de pesquisas         | Médio   | Médio   |
| 9   | Filtros avançados              | Médio   | Médio   |
| 3   | Testes                         | Alto    | Alto    |
| 11  | Offline / Service Worker       | Alto    | Médio   |
| 12  | Exportação PDF                 | Médio   | Baixo   |
| 13  | Remover duplicação de código   | Baixo   | Baixo   |
| 14  | PropTypes / TypeScript         | Médio   | Médio   |

---

## Ordem de Implementação Sugerida

1. **Sprint 1 — Quick wins:** #1, #2, #6 (baixo esforço, alto impacto)
2. **Sprint 2 — Performance:** #4, #13, #14
3. **Sprint 3 — Novas features:** #10, #8, #7
4. **Sprint 4 — Features avançadas:** #9, #12, #11
5. **Contínuo:** #3 (testes, adicionar à medida que se desenvolvem features), #5
