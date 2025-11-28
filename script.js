// Configurações
let animationSpeed = 1;
let isPlaying = true;
let totalItems = 0;
let currentProgress = 0;

// Elementos DOM
const scrollElement = document.getElementById('scroll');
const currentDateElement = document.getElementById('currentDate');
const progressFillElement = document.getElementById('progressFill');
const progressTextElement = document.getElementById('progressText');
const playPauseButton = document.getElementById('playPause');
const speedDownButton = document.getElementById('speedDown');
const speedUpButton = document.getElementById('speedUp');
const speedDisplayElement = document.getElementById('speedDisplay');

// Atualiza a data atual
function updateDate() {
    const now = new Date();
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        weekday: 'long'
    };
    const dateString = now.toLocaleDateString('pt-BR', options);
    currentDateElement.textContent = dateString;
}

// Carrega os dados do JSON
async function loadData() {
    try {
        const response = await fetch('items.json');
        const data = await response.json();
        return data.relatorio_empresarial_2025.areas;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return [];
    }
}

// Renderiza o conteúdo
function renderContent(areas) {
    let html = '';
    totalItems = 0;

    areas.forEach(area => {
        html += `<div class="area-title">${area.titulo}</div>`;
        
        if (area.subareas) {
            // Área com subáreas (DESENVOLVIMENTO)
            area.subareas.forEach(subarea => {
                html += `<div class="subarea-title">${subarea.subtitulo}</div>`;
                subarea.itens.forEach(item => {
                    html += `
                        <div class="item">
                            <span class="item-id">${item.id}.</span>
                            ${item.descricao}
                        </div>
                    `;
                    totalItems++;
                });
            });
        } else {
            // Área sem subáreas
            area.itens.forEach(item => {
                html += `
                    <div class="item">
                        <span class="item-id">${item.id}.</span>
                        ${item.descricao}
                    </div>
                `;
                totalItems++;
            });
        }
    });

    scrollElement.innerHTML = html;
    
    // Duplica o conteúdo para loop perfeito
    scrollElement.innerHTML += scrollElement.innerHTML;
    
    updateProgress();
}

// Atualiza a barra de progresso
function updateProgress() {
    const scrollHeight = scrollElement.scrollHeight / 2; // Porque duplicamos
    const scrollTop = Math.abs(parseFloat(scrollElement.style.transform?.replace('translateY(', '') || 0));
    
    currentProgress = (scrollTop / scrollHeight) * 100;
    progressFillElement.style.width = `${currentProgress}%`;
    progressTextElement.textContent = `${Math.round(currentProgress)}%`;
}

// Controla a animação
function updateAnimation() {
    const duration = 120 / animationSpeed; // 120 segundos base dividido pela velocidade
    scrollElement.style.animationDuration = `${duration}s`;
    
    if (isPlaying) {
        scrollElement.classList.remove('paused');
    } else {
        scrollElement.classList.add('paused');
    }
}

// Event Listeners
playPauseButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseButton.textContent = isPlaying ? '⏸️' : '▶️';
    updateAnimation();
});

speedDownButton.addEventListener('click', () => {
    if (animationSpeed > 0.5) {
        animationSpeed -= 0.25;
        updateAnimation();
        speedDisplayElement.textContent = `${animationSpeed}x`;
    }
});

speedUpButton.addEventListener('click', () => {
    if (animationSpeed < 3) {
        animationSpeed += 0.25;
        updateAnimation();
        speedDisplayElement.textContent = `${animationSpeed}x`;
    }
});

// Pausa/play com espaço
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isPlaying = !isPlaying;
        playPauseButton.textContent = isPlaying ? '⏸️' : '▶️';
        updateAnimation();
    }
});

// Atualiza progresso durante a animação
scrollElement.addEventListener('animationiteration', updateProgress);

// Inicialização
async function init() {
    updateDate();
    
    const areas = await loadData();
    if (areas.length > 0) {
        renderContent(areas);
        updateAnimation();
        
        // Atualiza progresso a cada 100ms
        setInterval(updateProgress, 100);
    } else {
        scrollElement.innerHTML = '<div class="error">Erro ao carregar os dados</div>';
    }
    
    // Atualiza data a cada minuto
    setInterval(updateDate, 60000);
}

// Inicia a aplicação
init();
