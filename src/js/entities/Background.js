import { Config } from '../core/Config.js';
import { Utils } from '../core/Utils.js';

export class Background {
    constructor(ctx, worldWidth) {
        this.ctx = ctx;
        this.worldWidth = worldWidth;
    }

    draw() {
        this.drawSky();
        this.drawCitySilhouette();
        this.drawClouds();
        this.drawSidewalk();
        this.drawRoad();
        this.drawGround();
    }

    drawSky() {
        const bandH = Math.ceil((Config.SIDEWALK_Y - 2) / Config.SKY_COLORS.length);
        Config.SKY_COLORS.forEach((col, i) => {
            Utils.px(this.ctx, 0, i * bandH, this.worldWidth, bandH + 1, col);
        });
    }

    drawCitySilhouette() {
        const sils = [
            { x: 40, w: 30, h: 60 }, { x: 100, w: 22, h: 45 }, { x: 150, w: 28, h: 70 },
            { x: 200, w: 20, h: 50 }, { x: 240, w: 32, h: 80 }, { x: 300, w: 24, h: 55 },
            { x: 350, w: 18, h: 40 }, { x: 400, w: 36, h: 90 }, { x: 460, w: 22, h: 60 },
            { x: 510, w: 28, h: 72 }, { x: 570, w: 20, h: 48 }, { x: 620, w: 30, h: 65 },
            { x: 680, w: 26, h: 78 }, { x: 730, w: 18, h: 44 }, { x: 780, w: 34, h: 85 },
            { x: 840, w: 22, h: 52 }, { x: 890, w: 28, h: 68 }, { x: 950, w: 20, h: 55 },
            { x: 1000, w: 30, h: 75 }, { x: 1060, w: 24, h: 62 },
        ];
        const silY = Config.SIDEWALK_Y - 5;
        
        sils.forEach(s => {
            Utils.px(this.ctx, s.x, silY - s.h, s.w, s.h, '#7090b8');
            for (let wy = silY - s.h + 4; wy < silY - 4; wy += 8) {
                for (let wx = s.x + 3; wx < s.x + s.w - 5; wx += 7) {
                    if (Math.random() > 0.3) {
                        Utils.px(this.ctx, wx, wy, 3, 4, '#ffe08060');
                    }
                }
            }
        });
    }

    drawClouds() {
        const clouds = [
            { x: 60, y: 18, w: 48, h: 14 },
            { x: 180, y: 12, w: 38, h: 12 },
            { x: 320, y: 20, w: 56, h: 16 },
            { x: 500, y: 14, w: 44, h: 13 },
            { x: 680, y: 22, w: 52, h: 15 },
            { x: 820, y: 10, w: 36, h: 11 },
            { x: 960, y: 18, w: 48, h: 14 },
            { x: 1100, y: 14, w: 40, h: 12 },
        ];
        clouds.forEach(c => this.drawCloud(c.x, c.y, c.w, c.h));
    }

    drawCloud(x, y, w, h) {
        Utils.px(this.ctx, x + Math.floor(w * 0.1), y + Math.floor(h * 0.5), Math.floor(w * 0.8), Math.ceil(h * 0.5), '#fff');
        Utils.px(this.ctx, x + Math.floor(w * 0.25), y + Math.floor(h * 0.2), Math.floor(w * 0.5), Math.ceil(h * 0.6), '#fff');
        Utils.px(this.ctx, x + Math.floor(w * 0.05), y + Math.floor(h * 0.35), Math.floor(w * 0.3), Math.ceil(h * 0.45), '#f0f0ff');
        Utils.px(this.ctx, x + Math.floor(w * 0.6), y + Math.floor(h * 0.3), Math.floor(w * 0.32), Math.ceil(h * 0.4), '#f0f0ff');
        Utils.px(this.ctx, x + Math.floor(w * 0.15), y + h - 2, Math.floor(w * 0.7), 2, '#d8d8ee');
    }

    drawSidewalk() {
        Utils.px(this.ctx, 0, Config.SIDEWALK_Y, this.worldWidth, 14, '#c8b898');
        Utils.px(this.ctx, 0, Config.SIDEWALK_Y, this.worldWidth, 2, '#e0d0b0');
        Utils.px(this.ctx, 0, Config.SIDEWALK_Y + 12, this.worldWidth, 2, '#a09070');
        for (let tx = 0; tx < this.worldWidth; tx += 20) {
            Utils.px(this.ctx, tx, Config.SIDEWALK_Y + 2, 1, 10, 'rgba(0,0,0,0.08)');
        }
    }

    drawRoad() {
        Utils.px(this.ctx, 0, Config.GROUND_Y, this.worldWidth, 28, '#4a4a5a');
        Utils.px(this.ctx, 0, Config.GROUND_Y, this.worldWidth, 2, '#3a3a4a');
        for (let dx = 0; dx < this.worldWidth; dx += 28) {
            Utils.px(this.ctx, dx, Config.GROUND_Y + 13, 18, 2, '#f0d060');
        }
        Utils.px(this.ctx, 0, Config.GROUND_Y + 26, this.worldWidth, 2, '#333');
    }

    drawGround() {
        Utils.px(this.ctx, 0, Config.GROUND_Y + 28, this.worldWidth, Config.VH / Config.SCALE - Config.GROUND_Y, '#3a2a1a');
        Utils.px(this.ctx, 0, Config.GROUND_Y + 28, this.worldWidth, 6, '#5a3a2a');
        for (let bx = 0; bx < this.worldWidth; bx += 14) {
            Utils.px(this.ctx, bx, Config.GROUND_Y + 28, 1, 6, '#7a4a30');
        }
    }
}