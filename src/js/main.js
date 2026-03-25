import { Scene } from './core/Scene.js';

// Dados dos prédios
const BUILDINGS_DATA = [
    {
        id: 'b1', name: 'Tijolão', sub: 'Residencial · 3 andares',
        w: 52, h: 72, floors: 3,
        style: 'brick',
        wallA: '#c0392b', wallB: '#922b21',
        trim: '#7b241c', roof: '#5d4037',
        door: { x: 18, w: 14, h: 20, color: '#e74c3c' },
        windows: [{ x: 6, y: 12, w: 16, h: 14 }, { x: 30, y: 12, w: 16, h: 14 },
        { x: 6, y: 32, w: 16, h: 14 }, { x: 30, y: 32, w: 16, h: 14 }],
    },
    {
        id: 'b2', name: 'Green Shop', sub: 'Comércio · 2 andares',
        w: 48, h: 56, floors: 2,
        style: 'shop',
        wallA: '#27ae60', wallB: '#1e8449',
        trim: '#145a32', roof: '#117a65',
        awning: { color: '#e74c3c', stripe: '#fff' },
        door: { x: 16, w: 16, h: 22, color: '#884400' },
        windows: [{ x: 4, y: 10, w: 14, h: 16 }, { x: 28, y: 10, w: 14, h: 16 },
        { x: 4, y: 30, w: 40, h: 16 }],
    },
    {
        id: 'b3', name: 'Blue Corner', sub: 'Misto · 3 andares',
        w: 54, h: 70, floors: 3,
        style: 'modern',
        wallA: '#2980b9', wallB: '#1a5276',
        trim: '#154360', roof: '#1c2833',
        door: { x: 20, w: 14, h: 22, color: '#5dade2' },
        windows: [{ x: 5, y: 8, w: 16, h: 18 }, { x: 27, y: 8, w: 16, h: 18 },
        { x: 5, y: 30, w: 16, h: 14 }, { x: 27, y: 30, w: 16, h: 14 },
        { x: 5, y: 48, w: 40, h: 10 }],
    },
    {
        id: 'b4', name: 'Candy Store', sub: 'Comércio · 1 andar',
        w: 44, h: 44, floors: 1,
        style: 'shop',
        wallA: '#f39c12', wallB: '#d68910',
        trim: '#a04000', roof: '#784212',
        awning: { color: '#e74c3c', stripe: '#fff8dc' },
        door: { x: 14, w: 16, h: 22, color: '#7d4e57' },
        windows: [{ x: 2, y: 10, w: 10, h: 18 }, { x: 30, y: 10, w: 10, h: 18 }],
    },
    {
        id: 'b5', name: 'Torre Cinza', sub: 'Corporativo · 5 andares',
        w: 46, h: 100, floors: 5,
        style: 'tower',
        wallA: '#95a5a6', wallB: '#717d7e',
        trim: '#515a5a', roof: '#2c3e50',
        door: { x: 14, w: 18, h: 24, color: '#aab7b8' },
        windows: [
            { x: 6, y: 8, w: 14, h: 12 }, { x: 26, y: 8, w: 14, h: 12 },
            { x: 6, y: 24, w: 14, h: 12 }, { x: 26, y: 24, w: 14, h: 12 },
            { x: 6, y: 40, w: 14, h: 12 }, { x: 26, y: 40, w: 14, h: 12 },
            { x: 6, y: 56, w: 14, h: 12 }, { x: 26, y: 56, w: 14, h: 12 },
            { x: 6, y: 72, w: 14, h: 12 }, { x: 26, y: 72, w: 14, h: 12 },
        ],
    },
    {
        id: 'b6', name: 'Rosa Boutique', sub: 'Comércio · 2 andares',
        w: 50, h: 58, floors: 2,
        style: 'shop',
        wallA: '#e8a0b4', wallB: '#c0708a',
        trim: '#9b3a5a', roof: '#7d2a48',
        awning: { color: '#c0008a', stripe: '#fff' },
        door: { x: 16, w: 18, h: 24, color: '#7d2a48' },
        windows: [{ x: 4, y: 8, w: 14, h: 16 }, { x: 30, y: 8, w: 14, h: 16 },
        { x: 4, y: 28, w: 40, h: 18 }],
    },
    {
        id: 'b7', name: 'Pub Escuro', sub: 'Bar · 2 andares',
        w: 50, h: 60, floors: 2,
        style: 'brick',
        wallA: '#6d4c41', wallB: '#4e342e',
        trim: '#3e2723', roof: '#212121',
        door: { x: 17, w: 16, h: 24, color: '#8d6e63' },
        windows: [{ x: 5, y: 10, w: 14, h: 14 }, { x: 29, y: 10, w: 14, h: 14 },
        { x: 5, y: 28, w: 14, h: 14 }, { x: 29, y: 28, w: 14, h: 14 }],
    },
    {
        id: 'b8', name: 'Glass Corp', sub: 'Corporativo · 4 andares',
        w: 52, h: 84, floors: 4,
        style: 'glass',
        wallA: '#b3cde0', wallB: '#6497b1',
        trim: '#005b96', roof: '#03396c',
        door: { x: 16, w: 20, h: 26, color: '#a8d8ea' },
        windows: [
            { x: 4, y: 6, w: 20, h: 16 }, { x: 28, y: 6, w: 20, h: 16 },
            { x: 4, y: 26, w: 20, h: 16 }, { x: 28, y: 26, w: 20, h: 16 },
            { x: 4, y: 46, w: 20, h: 16 }, { x: 28, y: 46, w: 20, h: 16 },
            { x: 4, y: 66, w: 44, h: 10 },
        ],
    },
    {
        id: 'b9', name: 'Farmácia+', sub: 'Saúde · 1 andar',
        w: 42, h: 42, floors: 1,
        style: 'shop',
        wallA: '#d5e8d4', wallB: '#a8c9a4',
        trim: '#5a8f6a', roof: '#3d6b52',
        awning: { color: '#2ecc71', stripe: '#fff' },
        door: { x: 12, w: 18, h: 24, color: '#27ae60' },
        windows: [{ x: 2, y: 8, w: 8, h: 20 }, { x: 32, y: 8, w: 8, h: 20 }],
    },
    {
        id: 'b10', name: 'Loft Laranja', sub: 'Residencial · 3 andares',
        w: 50, h: 68, floors: 3,
        style: 'brick',
        wallA: '#e67e22', wallB: '#ca6f1e',
        trim: '#935116', roof: '#6e2f0a',
        door: { x: 16, w: 18, h: 22, color: '#784212' },
        windows: [{ x: 5, y: 10, w: 14, h: 14 }, { x: 29, y: 10, w: 14, h: 14 },
        { x: 5, y: 28, w: 14, h: 14 }, { x: 29, y: 28, w: 14, h: 14 },
        { x: 5, y: 46, w: 40, h: 12 }],
    },
    {
        id: 'b11', name: 'Sky Tower', sub: 'Luxo · 6 andares',
        w: 48, h: 116, floors: 6,
        style: 'tower',
        wallA: '#1abc9c', wallB: '#148f77',
        trim: '#0e6655', roof: '#0a3d2e',
        door: { x: 14, w: 20, h: 28, color: '#76d7c4' },
        windows: [
            { x: 5, y: 6, w: 14, h: 12 }, { x: 27, y: 6, w: 14, h: 12 },
            { x: 5, y: 22, w: 14, h: 12 }, { x: 27, y: 22, w: 14, h: 12 },
            { x: 5, y: 38, w: 14, h: 12 }, { x: 27, y: 38, w: 14, h: 12 },
            { x: 5, y: 54, w: 14, h: 12 }, { x: 27, y: 54, w: 14, h: 12 },
            { x: 5, y: 70, w: 14, h: 12 }, { x: 27, y: 70, w: 14, h: 12 },
            { x: 5, y: 86, w: 38, h: 12 },
        ],
    },
    {
        id: 'b12', name: 'Garage King', sub: 'Serviços · 1 andar',
        w: 58, h: 46, floors: 1,
        style: 'garage',
        wallA: '#bdc3c7', wallB: '#95a5a6',
        trim: '#7f8c8d', roof: '#566573',
        door: { x: 8, w: 38, h: 28, color: '#aab7b8', isGarage: true },
        windows: [{ x: 48, y: 8, w: 8, h: 12 }],
    },
];

// Inicializar a cena
const scene = new Scene({
    bg: document.getElementById('bg'),
    city: document.getElementById('city'),
    scene: document.getElementById('scene')
}, BUILDINGS_DATA);

// Expor controles para debugging/console
window.scene = scene;
window.addCar = () => scene.addCar();
window.removeCar = () => scene.removeCar();
window.toggleCars = () => scene.toggleCars();
window.resetScene = () => scene.reset();

console.log('Cena inicializada! Use window.addCar(), window.removeCar(), window.toggleCars() para controlar os carros.');