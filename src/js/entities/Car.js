import { Config } from '../core/Config.js';
import { Utils } from '../core/Utils.js';

export class Car {
    static COLORS = [
        '#e74c3c', '#c0392b', '#f39c12', '#e67e22', '#d35400',
        '#f1c40f', '#f4d03f', '#2ecc71', '#27ae60', '#1abc9c',
        '#16a085', '#3498db', '#2980b9', '#9b59b6', '#8e44ad',
        '#34495e', '#2c3e50', '#7f8c8d', '#95a5a6', '#bdc3c7',
        '#e84393', '#fd79a8', '#00cec9', '#0984e3', '#6c5ce7'
    ];

    constructor(x, lane, speed, color, type, dir, worldWidth) {
        this.x = x;
        this.lane = lane;
        this.speed = speed;
        this.color = color;
        this.type = type;
        this.dir = dir;
        this.worldWidth = worldWidth;
    }

    static createRandom(lane, worldWidth) {
        return new Car(
            Math.random() * worldWidth,
            lane,
            Utils.random(Config.MIN_CAR_SPEED, Config.BASE_CAR_SPEED),
            Car.COLORS[Math.floor(Math.random() * Car.COLORS.length)],
            Math.random() > 0.5 ? 'sedan' : 'truck',
            Math.random() > 0.5 ? 1 : -1,
            worldWidth
        );
    }

    update() {
        this.x += this.speed * this.dir;
        if (this.x > this.worldWidth + 40) this.x = -40;
        if (this.x < -40) this.x = this.worldWidth + 40;
    }

    draw(ctx) {
        const cy = this.lane === 0 ? Config.LANE0_Y : Config.LANE1_Y;
        const cx = this.x;
        const flip = this.dir === -1;

        ctx.save();
        if (flip) {
            ctx.scale(-1, 1);
            ctx.translate(-this.worldWidth, 0);
        }
        const rx = flip ? this.worldWidth - cx : cx;

        if (this.type === 'truck') {
            this.drawTruck(ctx, rx, cy);
        } else {
            this.drawSedan(ctx, rx, cy);
        }
        ctx.restore();
    }

    drawTruck(ctx, rx, cy) {
        Utils.px(ctx, rx, cy, 36, 8, this.color);
        Utils.px(ctx, rx + 26, cy - 4, 10, 12, Utils.shadeHex(this.color, -30));
        Utils.px(ctx, rx + 27, cy - 3, 8, 5, '#a8d8f060');
        Utils.px(ctx, rx + 3, cy + 7, 6, 3, '#222');
        Utils.px(ctx, rx + 14, cy + 7, 6, 3, '#222');
        Utils.px(ctx, rx + 28, cy + 7, 6, 3, '#222');
        Utils.px(ctx, rx + 4, cy + 8, 2, 1, '#888');
    }

    drawSedan(ctx, rx, cy) {
        Utils.px(ctx, rx, cy + 2, 28, 6, this.color);
        Utils.px(ctx, rx + 5, cy - 2, 16, 6, Utils.shadeHex(this.color, 20));
        Utils.px(ctx, rx + 6, cy - 1, 6, 3, '#b8dff060');
        Utils.px(ctx, rx + 13, cy - 1, 5, 3, '#b8dff060');
        Utils.px(ctx, rx + 3, cy + 7, 5, 3, '#222');
        Utils.px(ctx, rx + 20, cy + 7, 5, 3, '#222');
        Utils.px(ctx, rx + 4, cy + 8, 2, 1, '#888');
        Utils.px(ctx, rx + 25, cy + 4, 2, 2, '#ffe080');
    }
}

export class CarManager {
    constructor(worldWidth) {
        this.worldWidth = worldWidth;
        this.cars = [];
        this.active = true;
    }

    createCars(quantity) {
        this.cars = [];
        let lane = 1;
        for (let i = 0; i < quantity; i++) {
            this.cars.push(Car.createRandom(lane++ % 2, this.worldWidth));
        }
        return this.cars;
    }

    update() {
        if (!this.active) return;
        this.cars.forEach(car => car.update());
    }

    draw(ctx) {
        if (!this.active) return;
        this.cars.forEach(car => car.draw(ctx));
    }

    addCar() {
        this.cars.push(Car.createRandom(Math.random() > 0.5 ? 0 : 1, this.worldWidth));
    }

    removeCar(index) {
        if (index >= 0 && index < this.cars.length) {
            this.cars.splice(index, 1);
        }
    }

    clear() {
        this.cars = [];
    }
}