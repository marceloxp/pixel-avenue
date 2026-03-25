import { Config } from '../core/Config.js';
import { Utils } from '../core/Utils.js';

export class Building {
    constructor(data, worldX) {
        Object.assign(this, data);
        this.worldX = worldX;
    }

    draw(ctx, isHighlighted = false) {
        const x = this.worldX;
        const y = Config.BUILD_BASE - this.h;

        // Sombra
        Utils.px(ctx, x + 4, Config.BUILD_BASE - 1, this.w - 4, 3, 'rgba(0,0,0,0.25)');

        // Parede principal com destaque se hover
        const wallColor = isHighlighted ? Utils.shadeHex(this.wallA, 30) : this.wallA;
        Utils.px(ctx, x, y, this.w, this.h, wallColor);

        this.drawTexture(ctx, x, y);
        this.drawTrim(ctx, x, y);
        this.drawRoof(ctx, x, y);
        this.drawWindows(ctx, x, y);
        this.drawDoor(ctx, x, y);
        this.drawAwning(ctx, x, y);
        
        if (this.h >= 80) {
            this.drawLamp(ctx, x);
        }
        
        this.drawLabel(ctx, x, y);
    }

    drawTexture(ctx, x, y) {
        if (this.style === 'brick') {
            for (let row = 0; row < this.h; row += 6) {
                const offset = (row % 12 === 0) ? 0 : 4;
                for (let col = offset; col < this.w; col += 10) {
                    Utils.px(ctx, x + col, y + row, 9, 1, 'rgba(0,0,0,0.12)');
                    Utils.px(ctx, x + col, y + row + 5, 1, 5, 'rgba(0,0,0,0.1)');
                }
            }
        } else if (this.style === 'glass') {
            for (let col = 0; col < this.w; col += 8) {
                Utils.px(ctx, x + col, y, 1, this.h, 'rgba(255,255,255,0.1)');
            }
            for (let row = 0; row < this.h; row += 16) {
                Utils.px(ctx, x, y + row, this.w, 1, 'rgba(0,0,0,0.15)');
            }
        } else if (this.style === 'modern') {
            for (let row = 0; row < this.h; row += 10) {
                Utils.px(ctx, x, y + row, this.w, 1, 'rgba(0,0,0,0.1)');
            }
        }
    }

    drawTrim(ctx, x, y) {
        Utils.px(ctx, x + this.w - 4, y, 4, this.h, 'rgba(0,0,0,0.2)');
        Utils.px(ctx, x, y, 2, this.h, 'rgba(255,255,255,0.12)');

        for (let f = 1; f < this.floors; f++) {
            const fy = Config.BUILD_BASE - (this.h / this.floors) * f;
            Utils.px(ctx, x, fy, this.w, 2, this.trim);
            Utils.px(ctx, x, fy, this.w, 1, 'rgba(255,255,255,0.15)');
        }
    }

    drawRoof(ctx, x, y) {
        Utils.px(ctx, x - 2, y - 4, this.w + 4, 6, this.roof);
        Utils.px(ctx, x - 2, y - 5, this.w + 4, 2, this.trim);
        for (let px = x; px < x + this.w; px += 8) {
            Utils.px(ctx, px, y - 8, 5, 4, this.trim);
        }
    }

    drawWindows(ctx, x, y) {
        const glassColors = {
            'brick': '#a8d4f0', 'shop': '#b8e8c8', 'modern': '#90c8f0',
            'tower': '#b0d8f8', 'glass': '#c8e8ff', 'garage': '#b0b8c0', 'default': '#a8d0f0'
        };
        const gc = glassColors[this.style] || glassColors.default;
        
        this.windows.forEach(w => {
            if (this.style === 'garage' && w === this.windows[0]) return;
            this.drawCheckerWindow(ctx, x + w.x, y + w.y, w.w, w.h, gc);
        });
    }

    drawCheckerWindow(ctx, x, y, w, h, glassColor) {
        Utils.px(ctx, x - 1, y - 1, w + 2, h + 2, '#222');
        Utils.px(ctx, x, y, w, h, glassColor);
        Utils.px(ctx, x + 1, y + 1, Math.floor(w * 0.35), Math.floor(h * 0.4), 'rgba(255,255,255,0.45)');
        const mx = x + Math.floor(w / 2);
        const my = y + Math.floor(h / 2);
        Utils.px(ctx, mx, y, 1, h, 'rgba(0,0,0,0.3)');
        Utils.px(ctx, x, my, w, 1, 'rgba(0,0,0,0.3)');
    }

    drawDoor(ctx, x, y) {
        const d = this.door;
        const dx = x + d.x;
        const dy = Config.BUILD_BASE - d.h;
        
        if (d.isGarage) {
            Utils.px(ctx, dx, dy, d.w, d.h, d.color);
            Utils.px(ctx, dx - 1, dy - 1, d.w + 2, d.h + 2, '#555');
            for (let gp = 0; gp < d.h; gp += 5) {
                Utils.px(ctx, dx, dy + gp, d.w, 1, 'rgba(0,0,0,0.2)');
            }
            Utils.px(ctx, dx + Math.floor(d.w / 2) - 2, dy + d.h - 4, 4, 2, '#888');
        } else {
            Utils.px(ctx, dx - 1, dy - 1, d.w + 2, d.h + 2, '#222');
            Utils.px(ctx, dx, dy, d.w, d.h, d.color);
            Utils.px(ctx, dx + 2, dy + 2, d.w - 4, Math.floor(d.h * 0.4) - 2, 'rgba(0,0,0,0.2)');
            Utils.px(ctx, dx + 2, dy + Math.floor(d.h * 0.45), d.w - 4, Math.floor(d.h * 0.45), 'rgba(0,0,0,0.2)');
            Utils.px(ctx, dx + d.w - 5, dy + Math.floor(d.h * 0.55), 2, 2, '#d4af37');
            Utils.px(ctx, dx - 2, Config.BUILD_BASE - 2, d.w + 4, 3, '#b0a080');
        }
    }

    drawAwning(ctx, x, y) {
        if (!this.awning) return;
        
        const aw = this.awning;
        const awY = Config.BUILD_BASE - this.h / this.floors - 2;
        const awH = 8;
        
        Utils.px(ctx, x - 2, awY, this.w + 4, awH, aw.color);
        for (let s = 0; s < this.w + 4; s += 6) {
            Utils.px(ctx, x - 2 + s, awY, 3, awH, aw.stripe + '80');
        }
        for (let f = 0; f < this.w + 4; f += 4) {
            Utils.px(ctx, x - 2 + f, awY + awH, 2, 4, aw.color);
        }
        Utils.px(ctx, x - 2, awY + awH + 4, this.w + 4, 2, 'rgba(0,0,0,0.18)');
    }

    drawLamp(ctx, x) {
        Utils.px(ctx, x + this.w + 2, Config.SIDEWALK_Y - 26, 2, 26, '#888');
        Utils.px(ctx, x + this.w - 4, Config.SIDEWALK_Y - 26, 8, 2, '#888');
        Utils.px(ctx, x + this.w - 6, Config.SIDEWALK_Y - 28, 4, 4, '#ffe080');
        Utils.px(ctx, x + this.w - 8, Config.SIDEWALK_Y - 26, 8, 2, '#666');
    }

    drawLabel(ctx, x, y) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        
        const lx = x + Math.floor(this.w / 2);
        const ly = Config.BUILD_BASE - this.h - 16;
        const txt = this.name;
        
        ctx.font = `bold 7px 'Courier New'`;
        const tw = ctx.measureText(txt).width;
        const pad = 5;
        
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(lx - tw / 2 - pad, ly - 10, tw + pad * 2, 12);
        ctx.strokeStyle = '#ffe08088';
        ctx.lineWidth = 1;
        ctx.strokeRect(lx - tw / 2 - pad, ly - 10, tw + pad * 2, 12);
        
        ctx.fillStyle = '#ffe080';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, lx, ly - 4);
        
        ctx.strokeStyle = '#ffe08055';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(lx, ly + 2);
        ctx.lineTo(lx, ly + 12);
        ctx.stroke();
        ctx.restore();
    }
}

export class BuildingManager {
    constructor(buildingsData, gap = 4) {
        this.buildings = [];
        this.worldWidth = 120;
        this.gap = gap;
        this.initBuildings(buildingsData);
    }

    initBuildings(buildingsData) {
        this.buildings = [];
        buildingsData.forEach(b => {
            this.buildings.push(new Building(b, this.worldWidth));
            this.worldWidth += b.w + this.gap;
        });
        this.worldWidth += 120;
    }

    draw(ctx, hoveredBuilding = null) {
        this.buildings.forEach(b => {
            b.draw(ctx, hoveredBuilding === b);
        });
    }

    getBuildingAt(worldX, worldY) {
        for (const b of this.buildings) {
            const bx = b.worldX;
            const by = Config.BUILD_BASE - b.h;
            if (worldX >= bx && worldX <= bx + b.w && 
                worldY >= by && worldY <= Config.BUILD_BASE) {
                return b;
            }
        }
        return null;
    }

    getWorldWidth() {
        return this.worldWidth;
    }
}