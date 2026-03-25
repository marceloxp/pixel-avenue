import { Config } from './Config.js';
import { Utils } from './Utils.js';
import { CarManager } from '../entities/Car.js';
import { BuildingManager } from '../entities/Building.js';
import { Background } from '../entities/Background.js';

export class Scene {
    constructor(canvasElements, buildingsData) {
        this.bgCanvas = canvasElements.bg;
        this.cityCanvas = canvasElements.city;
        this.sceneElement = canvasElements.scene;

        this.bgCtx = null;
        this.ctx = null;

        this.buildingManager = null;
        this.carManager = null;
        this.background = null;
        this.buildingsData = buildingsData;

        this.scrollX = 0;
        this.dragging = false;
        this.dragStartX = 0;
        this.dragScrollX = 0;

        this.hoveredBuilding = null;
        this.animationId = null;
        this.isRunning = true;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupManagers();
        this.setupEvents();
        this.drawBackground();
        this.start();
    }

    setupCanvas() {
        const worldWidth = this.calculateWorldWidth();
        const ph = Math.floor(Config.VH / Config.SCALE);

        this.bgCanvas.width = this.cityCanvas.width = worldWidth * Config.SCALE;
        this.bgCanvas.height = this.cityCanvas.height = ph * Config.SCALE;
        this.bgCanvas.style.width = this.cityCanvas.style.width = worldWidth * Config.SCALE + 'px';
        this.bgCanvas.style.height = this.cityCanvas.style.height = Config.VH + 'px';

        this.bgCtx = this.bgCanvas.getContext('2d');
        this.ctx = this.cityCanvas.getContext('2d');

        this.bgCtx.scale(Config.SCALE, Config.SCALE);
        this.ctx.scale(Config.SCALE, Config.SCALE);
    }

    calculateWorldWidth() {
        let width = 120;
        this.buildingsData.forEach(b => {
            width += b.w + Config.GAP;
        });
        return width + 120;
    }

    setupManagers() {
        const worldWidth = this.calculateWorldWidth();
        this.buildingManager = new BuildingManager(this.buildingsData, Config.GAP);
        this.carManager = new CarManager(worldWidth);
        this.background = new Background(this.bgCtx, worldWidth);

        // Criar carros iniciais
        this.carManager.createCars(Math.floor(Utils.random(5, 10)));
    }

    setupEvents() {
        // Mouse drag
        const maxScroll = this.bgCanvas.width - Config.VW;

        this.sceneElement.addEventListener('mousedown', (e) => {
            this.dragging = true;
            this.dragStartX = e.clientX;
            this.dragScrollX = this.scrollX;
            this.sceneElement.classList.add('grabbing');
        });

        window.addEventListener('mouseup', () => {
            this.dragging = false;
            this.sceneElement.classList.remove('grabbing');
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.dragging) return;
            this.scrollX = Math.max(0, Math.min(maxScroll, this.dragScrollX - (e.clientX - this.dragStartX)));
            this.applyScroll();
            this.updateTooltip(e.clientX, e.clientY);
        });

        // Touch
        this.sceneElement.addEventListener('touchstart', (e) => {
            this.dragging = true;
            this.dragStartX = e.touches[0].clientX;
            this.dragScrollX = this.scrollX;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.dragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!this.dragging) return;
            this.scrollX = Math.max(0, Math.min(maxScroll, this.dragScrollX - (e.touches[0].clientX - this.dragStartX)));
            this.applyScroll();
        }, { passive: true });

        // Wheel
        this.sceneElement.addEventListener('wheel', (e) => {
            this.scrollX = Math.max(0, Math.min(maxScroll, this.scrollX + e.deltaY * 1.5));
            this.applyScroll();
            e.preventDefault();
        }, { passive: false });

        // Hover
        this.cityCanvas.addEventListener('mousemove', (e) => {
            if (!this.dragging) this.updateTooltip(e.clientX, e.clientY);
        });

        this.cityCanvas.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    drawBackground() {
        this.background.draw();
    }

    applyScroll() {
        const tx = -this.scrollX;
        this.bgCanvas.style.transform = `translateX(${tx}px)`;
        this.cityCanvas.style.transform = `translateX(${tx}px)`;
    }

    updateTooltip(mx, my) {
        const worldX = (mx + this.scrollX) / Config.SCALE;
        const worldY = my / Config.SCALE;

        this.hoveredBuilding = this.buildingManager.getBuildingAt(worldX, worldY);

        const tt = document.getElementById('tooltip');
        if (this.hoveredBuilding) {
            document.getElementById('tt-name').textContent = this.hoveredBuilding.name;
            document.getElementById('tt-sub').textContent = this.hoveredBuilding.sub;
            tt.style.display = 'block';
            tt.style.left = (mx + 14) + 'px';
            tt.style.top = (my - 40) + 'px';
        } else {
            tt.style.display = 'none';
        }
    }

    hideTooltip() {
        const tt = document.getElementById('tooltip');
        if (tt) tt.style.display = 'none';
        this.hoveredBuilding = null;
    }

    update() {
        if (!this.isRunning) return;
        this.carManager.update();
    }

    draw() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.buildingManager.worldWidth, Config.VH / Config.SCALE);
        this.carManager.draw(this.ctx);
        this.buildingManager.draw(this.ctx, this.hoveredBuilding);
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    reset() {
        this.scrollX = 0;
        this.applyScroll();
        this.carManager.clear();
        this.carManager.createCars(Math.floor(Utils.random(5, 10)));
    }

    // Controles públicos
    addCar() {
        this.carManager.addCar();
    }

    removeCar() {
        if (this.carManager.cars.length > 0) {
            this.carManager.removeCar(this.carManager.cars.length - 1);
        }
    }

    setCarSpeedMultiplier(multiplier) {
        this.carManager.cars.forEach(car => {
            car.speed = (car.speed / Config.BASE_CAR_SPEED) * Config.BASE_CAR_SPEED * multiplier;
        });
    }

    toggleCars() {
        this.carManager.active = !this.carManager.active;
    }
}