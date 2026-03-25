// Funções utilitárias
export const Utils = {
    // Desenha um retângulo pixelado
    px(ctx, x, y, w, h, col) {
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    },
    
    // Sombreador de cores hex
    shadeHex(hex, amt) {
        const n = parseInt(hex.slice(1), 16);
        let r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + amt));
        let g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
        let b = Math.min(255, Math.max(0, (n & 0xff) + amt));
        return `rgb(${r},${g},${b})`;
    },
    
    // Random entre min e max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Random inteiro
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};