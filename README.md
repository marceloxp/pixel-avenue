# Pixel City Simulator

An interactive pixel art style animation of a city with moving cars, detailed buildings, and panoramic scrolling.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Element Configuration](#element-configuration)
  - [Global Settings](#global-settings)
  - [Buildings](#buildings)
  - [Cars](#cars)
  - [Background Scene](#background-scene)
- [Control API](#control-api)
- [Animation Flow](#animation-flow)
- [Quick Customization](#quick-customization)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Pixel City Simulator is an interactive animation that simulates a city in pixel art style. The system is modular, with each element encapsulated in its own class, managed by a central maestro (`Scene`).

**Key features:**
- Drag to explore the city horizontally
- Tooltip with building information on mouse hover
- Traffic flow in two lanes with opposite directions
- Programmatic control via browser console

---

## Architecture

```
Scene (Maestro)
├── Config          → Global settings
├── Utils           → Utility functions
├── Background      → Static elements (sky, clouds, ground)
├── BuildingManager → Manages building collection
│   └── Building    → Individual building
└── CarManager      → Manages car collection
    └── Car         → Individual car
```

**Data flow:**
1. `Scene` initializes all managers
2. `requestAnimationFrame` calls `Scene.animate()` continuously
3. `animate()` calls `update()` (moves cars) and `draw()` (renders everything)
4. Mouse/touch events control scrolling and tooltips

---

## Element Configuration

### Global Settings

**File:** `js/core/Config.js`

| Property         | Effect                    | How to modify                                       |
| ---------------- | ------------------------- | --------------------------------------------------- |
| `SCALE`          | Pixel size                | Adjust formula: `Math.max(2, Math.floor(VH / 220))` |
| `SKY_COLORS`     | Sky gradient colors       | Change hex values in the array                      |
| `GAP`            | Spacing between buildings | Change value (e.g., 4, 6, 8)                        |
| `BASE_CAR_SPEED` | Maximum car speed         | Increase/decrease value (1.2 default)               |
| `MIN_CAR_SPEED`  | Minimum speed             | Adjust between 0.3 and 0.8                          |

> **Note:** `GROUND_Y`, `LANE0_Y`, etc., are automatically calculated based on screen height. No need to modify them manually.

---

### Buildings

**File:** `js/main.js` (array `BUILDINGS_DATA`)

Each building is an object with the following structure:

| Property  | Type   | Required | Description                                                            |
| --------- | ------ | -------- | ---------------------------------------------------------------------- |
| `id`      | string | ✅       | Unique identifier                                                      |
| `name`    | string | ✅       | Name displayed in tooltip                                              |
| `sub`     | string | ✅       | Subtitle/additional information                                        |
| `w`       | number | ✅       | Width in pixels                                                        |
| `h`       | number | ✅       | Height in pixels                                                       |
| `floors`  | number | ✅       | Number of floors (affects dividing lines)                              |
| `style`   | string | ✅       | Defines texture: `brick`, `shop`, `modern`, `tower`, `glass`, `garage` |
| `wallA`   | string | ✅       | Main wall color                                                        |
| `wallB`   | string | ✅       | Secondary color (internal use)                                         |
| `trim`    | string | ✅       | Color of details and divisions                                         |
| `roof`    | string | ✅       | Roof color                                                             |
| `door`    | object | ✅       | Door configuration                                                     |
| `windows` | array  | ✅       | List of windows                                                        |
| `awning`  | object | ❌       | Only for `shop` style                                                  |

#### Door Structure (`door`)

```javascript
door: {
    x: 18,        // X position relative to building's left side
    w: 14,        // Width
    h: 20,        // Height
    color: '#e74c3c',
    isGarage: false  // true = garage door (different drawing style)
}
```

#### Window Structure (`windows` array)

```javascript
windows: [
    { x: 6, y: 12, w: 16, h: 14 },  // x, y relative to top-left corner
    { x: 30, y: 12, w: 16, h: 14 }
]
```

#### Available Styles

| `style`  | Texture          | Special Features             |
| -------- | ---------------- | ---------------------------- |
| `brick`  | Brick pattern    | Alternating horizontal lines |
| `shop`   | Solid            | Requires `awning`            |
| `modern` | Horizontal lines | Decorative bands             |
| `tower`  | Solid            | Taller, supports lantern     |
| `glass`  | Glass panels     | Mirror-like effect           |
| `garage` | Solid            | Special garage door          |

> **Tip:** To add a new building, simply include a new object in the `BUILDINGS_DATA` array. Position is automatically calculated.

---

### Cars

**File:** `js/entities/Car.js`

#### Car Class

Created automatically by `CarManager`, but can be manually instantiated:

```javascript
new Car(x, lane, speed, color, type, dir, worldWidth)
```

| Parameter    | Values                 | Description                                     |
| ------------ | ---------------------- | ----------------------------------------------- |
| `x`          | number                 | Initial horizontal position                     |
| `lane`       | 0 or 1                 | 0 = upper lane (closer to curb), 1 = lower lane |
| `speed`      | 0.5 ~ 1.2              | Movement speed                                  |
| `color`      | string hex             | Car color (see list below)                      |
| `type`       | `'sedan'` or `'truck'` | Defines size and shape                          |
| `dir`        | 1 or -1                | Direction: 1 = right, -1 = left                 |
| `worldWidth` | number                 | Total world width (for wraparound)              |

#### Available Colors

Defined in the static array `Car.COLORS`. There are 25 predefined colors:

- **Reds:** `#e74c3c`, `#c0392b`
- **Oranges:** `#f39c12`, `#e67e22`, `#d35400`
- **Yellows:** `#f1c40f`, `#f4d03f`
- **Greens:** `#2ecc71`, `#27ae60`
- **Blue/Greens:** `#1abc9c`, `#16a085`
- **Blues:** `#3498db`, `#2980b9`, `#0984e3`
- **Purples:** `#9b59b6`, `#8e44ad`, `#6c5ce7`
- **Pinks:** `#e84393`, `#fd79a8`, `#00cec9`
- **Grays:** `#34495e`, `#2c3e50`, `#7f8c8d`, `#95a5a6`, `#bdc3c7`

#### CarManager (Control API)

| Method                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `createCars(quantity)` | Creates N random cars                    |
| `addCar()`             | Adds a random car                        |
| `removeCar(index)`     | Removes car by index                     |
| `clear()`              | Removes all cars                         |
| `update()`             | Updates positions (called automatically) |
| `draw(ctx)`            | Draws all cars                           |

**Property:** `carManager.active` → `true/false` to pause movement.

---

### Background Scene

**File:** `js/entities/Background.js`

The background consists of layers rendered once on the background canvas (`bgCanvas`):

| Method                 | What it draws                                |
| ---------------------- | -------------------------------------------- |
| `drawSky()`            | Pixelated gradient using `Config.SKY_COLORS` |
| `drawCitySilhouette()` | Distant buildings (bluish silhouette)        |
| `drawClouds()`         | Clouds at predefined positions               |
| `drawSidewalk()`       | Sidewalk with tile lines                     |
| `drawRoad()`           | Asphalt, center lines, and curb              |
| `drawGround()`         | Ground below the road with brick texture     |

**How to modify:**
- **Clouds:** Edit the `clouds` array inside the `drawClouds()` method
- **Silhouette:** Edit the `sils` array inside `drawCitySilhouette()`
- **Ground colors:** Change hex values in the corresponding methods

---

## Control API

The `Scene` exposes methods that can be called via browser console:

| Command               | Effect                                    |
| --------------------- | ----------------------------------------- |
| `window.addCar()`     | Adds a new random car                     |
| `window.removeCar()`  | Removes the last car from the list        |
| `window.toggleCars()` | Pauses/resumes car movement               |
| `window.resetScene()` | Resets the scene (resets scroll and cars) |

**Example usage in console:**
```javascript
addCar()                    // Adds a car
removeCar()                 // Removes a car
toggleCars()                // Freezes traffic
resetScene()                // Returns to start
```

---

## Animation Flow

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

**Frame rate:** Controlled by `requestAnimationFrame`, synchronized with monitor refresh rate.

---

## Quick Customization

### Change car speed
In `Config.js`, adjust `BASE_CAR_SPEED` and `MIN_CAR_SPEED`.

### Add new car color
In `Car.js`, add a new hex value to the `Car.COLORS` array.

### Modify the sky
In `Config.js`, change `SKY_COLORS`. The gradient uses the array in vertical order.

### Add custom building
In `main.js`, insert a new object into the `BUILDINGS_DATA` array. Follow the structure of existing ones.

### Change lane positions
In `Config.js`, adjust `LANE0_Y` and `LANE1_Y`. Values are relative to `GROUND_Y`.

---

## Troubleshooting

### "Cars don't appear"
- Check if `carManager.active` is `true`
- Confirm `carManager.cars` is not empty
- In console, run `scene.carManager.cars.length` to see the quantity

### "Tooltip doesn't appear"
- Check if HTML element with `id="tooltip"` exists
- Confirm `name` and `sub` properties are defined on the building

### "Scrolling doesn't work"
- Check if `scene.sceneElement` is set correctly
- Confirm `maxScroll` is calculated properly (must be > 0)

### "Module error"
- Ensure files are imported with `type="module"` in HTML
- Verify relative paths in imports

---

## Development Tips

1. **Add new vehicle types:**
   - Extend the `Car` class
   - Add a new `drawTipo()` method similar to `drawSedan()`/`drawTruck()`
   - Modify `getRandomType()` to include the new type

2. **Add interactive elements:**
   - Create a new entity (e.g., `Pedestrian.js`)
   - Add a manager in `Scene`
   - Include in `update()` and `draw()` loops

3. **Save scene state:**
   - Access `scene.scrollX` for scroll position
   - Access `scene.carManager.cars` for car list
   - Use `localStorage` to persist

---

## Quick Reference Files

| Functionality | File                     | Main Functions/Variables                              |
| ------------- | ------------------------ | ----------------------------------------------------- |
| Settings      | `core/Config.js`         | `SCALE`, `SKY_COLORS`, `BASE_CAR_SPEED`               |
| Utilities     | `core/Utils.js`          | `px()`, `shadeHex()`, `random()`                      |
| Maestro       | `core/Scene.js`          | `Scene.animate()`, `Scene.update()`, `Scene.draw()`   |
| Cars          | `entities/Car.js`        | `Car.draw()`, `CarManager.createCars()`, `Car.COLORS` |
| Buildings     | `entities/Building.js`   | `Building.draw()`, `BuildingManager.getBuildingAt()`  |
| Background    | `entities/Background.js` | `Background.drawSky()`, `Background.drawRoad()`       |
| Data          | `main.js`                | `BUILDINGS_DATA`                                      |

## Run local server

```sh
npx http-server -a 0.0.0.0
```
