# Pixel City Simulator

Uma animação interativa em estilo pixel art de uma cidade com carros em movimento, prédios detalhados e rolagem panorâmica.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Configuração de Elementos](#configuração-de-elementos)
  - [Configurações Globais](#configurações-globais)
  - [Prédios](#prédios)
  - [Carros](#carros)
  - [Cenário de Fundo](#cenário-de-fundo)
- [API de Controle](#api-de-controle)
- [Fluxo de Animação](#fluxo-de-animação)
- [Personalização Rápida](#personalização-rápida)
- [Solução de Problemas](#solução-de-problemas)

---

## Visão Geral

O Pixel City Simulator é uma animação interativa que simula uma cidade em estilo pixel art. O sistema é modular, com cada elemento encapsulado em sua própria classe, gerenciado por um maestro central (`Scene`).

**Principais características:**
- Arraste para explorar a cidade horizontalmente
- Tooltip com informações dos prédios ao passar o mouse
- Tráfego de carros em duas pistas com direções opostas
- Controle programático via console do navegador

---

## Arquitetura

```
Scene (Maestro)
├── Config          → Configurações globais
├── Utils           → Funções utilitárias
├── Background      → Elementos estáticos (céu, nuvens, chão)
├── BuildingManager → Gerencia coleção de prédios
│   └── Building    → Prédio individual
└── CarManager      → Gerencia coleção de carros
    └── Car         → Carro individual
```

**Fluxo de dados:**
1. `Scene` inicializa todos os gerenciadores
2. `requestAnimationFrame` chama `Scene.animate()` continuamente
3. `animate()` chama `update()` (movimenta carros) e `draw()` (renderiza tudo)
4. Eventos de mouse/touch controlam rolagem e tooltips

---

## Configuração de Elementos

### Configurações Globais

**Arquivo:** `js/core/Config.js`

| Propriedade      | Efeito                       | Como modificar                                        |
| ---------------- | ---------------------------- | ----------------------------------------------------- |
| `SCALE`          | Tamanho dos pixels           | Ajuste a fórmula: `Math.max(2, Math.floor(VH / 220))` |
| `SKY_COLORS`     | Cores do gradiente do céu    | Altere os valores hex no array                        |
| `GAP`            | Espaçamento entre prédios    | Mude o valor (ex: 4, 6, 8)                            |
| `BASE_CAR_SPEED` | Velocidade máxima dos carros | Aumente/diminua o valor (1.2 padrão)                  |
| `MIN_CAR_SPEED`  | Velocidade mínima            | Ajuste entre 0.3 e 0.8                                |

> **Nota:** `GROUND_Y`, `LANE0_Y`, etc., são calculados automaticamente baseados na altura da tela. Não é necessário alterá-los manualmente.

---

### Prédios

**Arquivo:** `js/main.js` (array `BUILDINGS_DATA`)

Cada prédio é um objeto com a seguinte estrutura:

| Propriedade | Tipo   | Obrigatório | Descrição                                                             |
| ----------- | ------ | ----------- | --------------------------------------------------------------------- |
| `id`        | string | ✅          | Identificador único                                                   |
| `name`      | string | ✅          | Nome exibido no tooltip                                               |
| `sub`       | string | ✅          | Subtítulo/informação adicional                                        |
| `w`         | number | ✅          | Largura em pixels                                                     |
| `h`         | number | ✅          | Altura em pixels                                                      |
| `floors`    | number | ✅          | Número de andares (afeta linhas divisórias)                           |
| `style`     | string | ✅          | Define textura: `brick`, `shop`, `modern`, `tower`, `glass`, `garage` |
| `wallA`     | string | ✅          | Cor principal da parede                                               |
| `wallB`     | string | ✅          | Cor secundária (uso interno)                                          |
| `trim`      | string | ✅          | Cor dos detalhes e divisões                                           |
| `roof`      | string | ✅          | Cor do telhado                                                        |
| `door`      | object | ✅          | Configuração da porta                                                 |
| `windows`   | array  | ✅          | Lista de janelas                                                      |
| `awning`    | object | ❌          | Apenas para estilo `shop`                                             |

#### Estrutura da Porta (`door`)

```javascript
door: {
    x: 18,        // Posição X relativa à esquerda do prédio
    w: 14,        // Largura
    h: 20,        // Altura
    color: '#e74c3c',
    isGarage: false  // true = porta de garagem (desenho diferente)
}
```

#### Estrutura da Janela (`windows` array)

```javascript
windows: [
    { x: 6, y: 12, w: 16, h: 14 },  // x, y relativos ao canto superior esquerdo
    { x: 30, y: 12, w: 16, h: 14 }
]
```

#### Estilos Disponíveis

| `style`  | Textura            | Características Especiais       |
| -------- | ------------------ | ------------------------------- |
| `brick`  | Padrão de tijolos  | Linhas horizontais intercaladas |
| `shop`   | Liso               | Requer `awning` (marquise)      |
| `modern` | Linhas horizontais | Faixas decorativas              |
| `tower`  | Liso               | Mais alto, suporte para lampião |
| `glass`  | Painéis de vidro   | Efeito espelhado                |
| `garage` | Liso               | Porta de garagem especial       |

> **Dica:** Para adicionar um novo prédio, basta incluir um novo objeto no array `BUILDINGS_DATA`. A posição é calculada automaticamente.

---

### Carros

**Arquivo:** `js/entities/Car.js`

#### Classe Car

Criada automaticamente pelo `CarManager`, mas pode ser instanciada manualmente:

```javascript
new Car(x, lane, speed, color, type, dir, worldWidth)
```

| Parâmetro    | Valores                | Descrição                                                    |
| ------------ | ---------------------- | ------------------------------------------------------------ |
| `x`          | número                 | Posição horizontal inicial                                   |
| `lane`       | 0 ou 1                 | 0 = pista superior (próxima ao meio-fio), 1 = pista inferior |
| `speed`      | 0.5 ~ 1.2              | Velocidade de movimento                                      |
| `color`      | string hex             | Cor do carro (veja lista abaixo)                             |
| `type`       | `'sedan'` ou `'truck'` | Define tamanho e forma                                       |
| `dir`        | 1 ou -1                | Direção: 1 = direita, -1 = esquerda                          |
| `worldWidth` | número                 | Largura total do mundo (para wraparound)                     |

#### Cores Disponíveis

Definidas no array estático `Car.COLORS`. São 25 cores pré-definidas:

- **Vermelhos:** `#e74c3c`, `#c0392b`
- **Laranjas:** `#f39c12`, `#e67e22`, `#d35400`
- **Amarelos:** `#f1c40f`, `#f4d03f`
- **Verdes:** `#2ecc71`, `#27ae60`
- **Azuis/Verdes:** `#1abc9c`, `#16a085`
- **Azuis:** `#3498db`, `#2980b9`, `#0984e3`
- **Roxos:** `#9b59b6`, `#8e44ad`, `#6c5ce7`
- **Rosa:** `#e84393`, `#fd79a8`, `#00cec9`
- **Cinzas:** `#34495e`, `#2c3e50`, `#7f8c8d`, `#95a5a6`, `#bdc3c7`

#### CarManager (API de Controle)

| Método                   | Descrição                                   |
| ------------------------ | ------------------------------------------- |
| `createCars(quantidade)` | Cria N carros aleatórios                    |
| `addCar()`               | Adiciona um carro aleatório                 |
| `removeCar(index)`       | Remove carro pelo índice                    |
| `clear()`                | Remove todos os carros                      |
| `update()`               | Atualiza posições (chamado automaticamente) |
| `draw(ctx)`              | Desenha todos os carros                     |

**Propriedade:** `carManager.active` → `true/false` para pausar movimento.

---

### Cenário de Fundo

**Arquivo:** `js/entities/Background.js`

O fundo é composto por camadas renderizadas uma única vez no canvas de fundo (`bgCanvas`):

| Método                 | O que desenha                                 |
| ---------------------- | --------------------------------------------- |
| `drawSky()`            | Gradiente pixelado usando `Config.SKY_COLORS` |
| `drawCitySilhouette()` | Prédios distantes (silhueta azulada)          |
| `drawClouds()`         | Nuvens em posições pré-definidas              |
| `drawSidewalk()`       | Calçada com linhas de tile                    |
| `drawRoad()`           | Asfalto, faixas centrais e meio-fio           |
| `drawGround()`         | Chão abaixo da estrada com textura de tijolos |

**Como modificar:**
- **Nuvens:** Edite o array `clouds` dentro do método `drawClouds()`
- **Silhueta:** Edite o array `sils` dentro de `drawCitySilhouette()`
- **Cores do chão:** Altere os valores hex nos métodos correspondentes

---

## API de Controle

A `Scene` expõe métodos que podem ser chamados via console do navegador:

| Comando               | Efeito                                   |
| --------------------- | ---------------------------------------- |
| `window.addCar()`     | Adiciona um novo carro aleatório         |
| `window.removeCar()`  | Remove o último carro da lista           |
| `window.toggleCars()` | Pausa/retoma o movimento dos carros      |
| `window.resetScene()` | Reinicia a cena (reseta scroll e carros) |

**Exemplo de uso no console:**
```javascript
addCar()                    // Adiciona um carro
removeCar()                 // Remove um carro
toggleCars()                // Congela o tráfego
resetScene()                // Volta ao início
```

---

## Fluxo de Animação

```
1. window.load
   └── new Scene() → init()
       ├── setupCanvas()
       ├── setupManagers()
       │   ├── new BuildingManager(buildingsData)
       │   ├── new CarManager(worldWidth)
       │   └── new Background(bgCtx)
       ├── setupEvents()
       ├── drawBackground()
       └── start()
           └── animate() [loop]
               ├── update()
               │   └── carManager.update()
               └── draw()
                   ├── carManager.draw()
                   └── buildingManager.draw()
```

**Frame rate:** Controlado por `requestAnimationFrame`, sincronizado com a taxa de atualização do monitor.

---

## Personalização Rápida

### Mudar velocidade dos carros
No `Config.js`, ajuste `BASE_CAR_SPEED` e `MIN_CAR_SPEED`.

### Adicionar nova cor de carro
No `Car.js`, adicione um novo valor hex ao array `Car.COLORS`.

### Modificar o céu
No `Config.js`, altere `SKY_COLORS`. O gradiente usa o array na ordem vertical.

### Adicionar prédio personalizado
No `main.js`, insira um novo objeto no array `BUILDINGS_DATA`. Siga a estrutura dos existentes.

### Mudar posição das pistas
No `Config.js`, ajuste `LANE0_Y` e `LANE1_Y`. Os valores são relativos a `GROUND_Y`.

---

## Solução de Problemas

### "Carros não aparecem"
- Verifique se `carManager.active` está `true`
- Confirme que `carManager.cars` não está vazio
- No console, execute `scene.carManager.cars.length` para ver a quantidade

### "Tooltip não aparece"
- Verifique se o elemento HTML com `id="tooltip"` existe
- Confirme que as propriedades `name` e `sub` estão definidas no prédio

### "Rolagem não funciona"
- Verifique se `scene.sceneElement` está configurado corretamente
- Confirme que `maxScroll` é calculado adequadamente (deve ser > 0)

### "Erro de módulo"
- Certifique-se de que os arquivos estão sendo importados com `type="module"` no HTML
- Verifique os caminhos relativos nos imports

---

## Dicas de Desenvolvimento

1. **Adicionar novos tipos de veículos:**
   - Estenda a classe `Car`
   - Adicione um novo método `drawTipo()` similar a `drawSedan()`/`drawTruck()`
   - Modifique `getRandomType()` para incluir o novo tipo

2. **Adicionar elementos interativos:**
   - Crie uma nova entidade (ex: `Pedestrian.js`)
   - Adicione um gerenciador no `Scene`
   - Inclua nos loops `update()` e `draw()`

3. **Salvar estado da cena:**
   - Acesse `scene.scrollX` para posição de rolagem
   - Acesse `scene.carManager.cars` para lista de carros
   - Use `localStorage` para persistir

---

## Arquivos de Referência Rápida

| Funcionalidade | Arquivo                  | Principais Funções/Variáveis                          |
| -------------- | ------------------------ | ----------------------------------------------------- |
| Configurações  | `core/Config.js`         | `SCALE`, `SKY_COLORS`, `BASE_CAR_SPEED`               |
| Utilitários    | `core/Utils.js`          | `px()`, `shadeHex()`, `random()`                      |
| Maestro        | `core/Scene.js`          | `Scene.animate()`, `Scene.update()`, `Scene.draw()`   |
| Carros         | `entities/Car.js`        | `Car.draw()`, `CarManager.createCars()`, `Car.COLORS` |
| Prédios        | `entities/Building.js`   | `Building.draw()`, `BuildingManager.getBuildingAt()`  |
| Fundo          | `entities/Background.js` | `Background.drawSky()`, `Background.drawRoad()`       |
| Dados          | `main.js`                | `BUILDINGS_DATA`                                      |

## Executar servidor local

```sh
npx http-server -a 0.0.0.0
```
