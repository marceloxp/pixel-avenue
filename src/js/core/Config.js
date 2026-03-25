// Configurações globais do jogo/animação
export const Config = {
    // Dimensões
    get VW() { return window.innerWidth; },
    get VH() { return window.innerHeight; },
    get SCALE() { return Math.max(2, Math.floor(window.innerHeight / 220)); },
    
    // Cores
    SKY_COLORS: [
        '#5ba3d9', '#5ba3d9', '#6ab0e0', '#6ab0e0',
        '#7fc0ea', '#7fc0ea', '#90ccee', '#90ccee',
        '#a8d8f4', '#a8d8f4', '#b8e0f6', '#b8e0f6',
    ],
    
    // Parâmetros da estrada
    get GROUND_Y() { return Math.floor(this.VH / this.SCALE) - 28; },
    get SIDEWALK_Y() { return this.GROUND_Y - 14; },
    get BUILD_BASE() { return this.GROUND_Y - 14; },
    
    // Pistas
    get LANE0_Y() { return this.GROUND_Y + 5; },
    get LANE1_Y() { return this.GROUND_Y + 17; },
    
    // Gap entre prédios
    GAP: 4,
    
    // Velocidade base dos carros
    BASE_CAR_SPEED: 1.2,
    MIN_CAR_SPEED: 0.5
};