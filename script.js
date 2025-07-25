document.addEventListener('DOMContentLoaded', () => {
    // ========== CACHE DE ELEMENTOS DO DOM ==========
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');
    const themeToggle = document.getElementById('theme-toggle');

    // ========== ESTADO GLOBAL DO APLICATIVO ==========
    let gameStats = loadGameStats();
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // ========== NAVEGAÇÃO E INICIALIZAÇÃO ==========
    function updateActiveNav(targetId) {
        const currentHash = targetId.startsWith('#') ? targetId : `#${targetId}`;

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === currentHash;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
        
        sections.forEach(section => {
            section.classList.toggle('active-section', `#${section.id}` === currentHash);
        });
        
        if (currentHash === '#memory-game' && !MemoryGame.isInitialized()) {
            MemoryGame.init();
        }
    }
    
    function handleNavigation() {
        const targetId = window.location.hash || '#home';
        updateActiveNav(targetId);
    }
    
    window.addEventListener('popstate', handleNavigation);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (window.location.hash !== targetId) {
                window.history.pushState({ path: targetId }, '', targetId);
            }
            updateActiveNav(targetId);
        });
    });

    // ========== DADOS GLOBAIS (Quizzes, Features) ==========
    const quizzesData = [
        {
            title: "Fundamentos da Gen Alpha",
            questions: [
                { q: "Em que período nasceu a Geração Alpha?", o: ["2010-2024", "2005-2015", "2015-2025", "2000-2010"], a: 0 },
                { q: "Qual dispositivo foi lançado em 2010, mesmo ano do início da Gen Alpha?", o: ["iPhone", "iPad", "Kindle", "Android"], a: 1 },
                { q: "A Geração Alpha é sucessora de qual geração?", o: ["Geração Z", "Millennials", "Geração X", "Baby Boomers"], a: 0 },
                { q: "Qual plataforma de vídeo é mais popular entre crianças Alpha?", o: ["Facebook", "Netflix", "YouTube", "TikTok"], a: 2 },
                { q: "Como a Gen Alpha também é conhecida?", o: ["Geração de Vidro", "Nativos da Nuvem", "Geração Conectada", "Digital Natives"], a: 0 }
            ]
        },
        {
            title: "Tecnologia & Comportamento",
            questions: [
                { q: "O que significa 'sharenting'?", o: ["Pais compartilhando sobre filhos nas redes", "Crianças compartilhando brinquedos", "Compartilhar senhas", "Aplicativo de controle parental"], a: 0 },
                { q: "Qual habilidade a Gen Alpha desenvolve mais rapidamente?", o: ["Escrita à mão", "Interação social presencial", "Alfabetização digital", "Leitura tradicional"], a: 2 },
                { q: "Gamificação na educação significa:", o: ["Jogar videogames na escola", "Usar elementos de jogos no aprendizado", "Proibir jogos eletrônicos", "Competições esportivas"], a: 1 },
                { q: "Para a Gen Alpha, assistentes de voz são:", o: ["Tecnologia complexa", "Ferramentas raras", "Parte natural do cotidiano", "Brinquedos caros"], a: 2 },
                { q: "Principal preocupação dos pais sobre Gen Alpha:", o: ["Falta de tecnologia", "Tempo excessivo de tela", "Dificuldade com internet", "Custo dos dispositivos"], a: 1 },
                { q: "Qual a preferência de aprendizado da Gen Alpha?", o: ["Apenas texto", "Audio somente", "Visual e interativo", "Métodos tradicionais"], a: 2 },
                { q: "A atenção da Gen Alpha é melhor mantida com:", o: ["Longas palestras", "Conteúdo fragmentado", "Textos extensos", "Aulas expositivas"], a: 1 }
            ]
        },
        {
            title: "Impactos Sociais",
            questions: [
                { q: "Quem criou o termo 'Geração Alpha'?", o: ["Mark McCrindle", "Neil Howe", "William Strauss", "Don Tapscott"], a: 0 },
                { q: "Como a IA impacta a educação Alpha?", o: ["Personalização em escala", "Substitui professores", "Nenhum impacto", "Dificulta aprendizado"], a: 0 },
                { q: "Conteúdo curto (TikTok) pode causar:", o: ["Maior foco", "Redução do 'attention span'", "Aversão à tecnologia", "Melhor memória"], a: 1 },
                { q: "A Gen Alpha será a mais... da história:", o: ["Rica financeiramente", "Tecnologicamente fluente", "Tradicionalista", "Isolada socialmente"], a: 1 },
            ]
        },
        {
            title: "Futuro & Tendências",
            questions: [
                { q: "Modelo de trabalho preferido:", o: ["Presencial 8h/dia", "Híbrido e flexível", "Apenas remoto", "Trabalho manual"], a: 1 },
                { q: "Relação com sustentabilidade:", o: ["Indiferença total", "Preocupação integrada", "Apenas consumo", "Negação climática"], a: 1 },
                { q: "Comunicação predominante será:", o: ["Cartas manuscritas", "Visual e imersiva", "Apenas telefone", "Telegrama"], a: 1 },
                { q: "Maior desafio futuro da Gen Alpha:", o: ["Falta de tecnologia", "Sobrecarga de informação", "Isolamento total", "Volta ao analógico"], a: 1 },
            ]
        }
    ];

    const featuresData = [
        { icon: 'fa-mobile-alt', title: 'Nativos Móveis', desc: 'Dominam interfaces touch e dispositivos móveis desde a primeira infância, com naturalidade.' },
        { icon: 'fa-robot', title: 'IA Integrada', desc: 'Crescem interagindo com inteligência artificial, como assistentes de voz, de forma intuitiva.' },
        { icon: 'fa-globe', title: 'Conectados', desc: 'Pensam e agem de forma globalmente conectada, com acesso a informações e culturas de todo o mundo.' },
        { icon: 'fa-gamepad', title: 'Gamificação', desc: 'Aprendem melhor através de experiências interativas e gamificadas que oferecem recompensas e desafios.' },
        { icon: 'fa-video', title: 'Conteúdo Visual', desc: 'Preferem o consumo de informação em formato audiovisual (vídeos, imagens) a textos longos.' },
        { icon: 'fa-brain', title: 'Adaptáveis', desc: 'Possuem alta neuroplasticidade, adaptando-se rapidamente a novas tecnologias e ambientes digitais.' }
    ];

    // ========== MÓDULO DE INTERATIVIDADE GERAL ==========
    const Interactivity = (() => {
        function setupTypingEffect() {
            const typingTextElement = document.getElementById('typing-text');
            if(!typingTextElement) return;

            const wordsToType = ["Alpha.", "Digital.", "Conectada.", "do Futuro."];
            let wordIndex = 0, letterIndex = 0, isDeleting = false;

            function type() {
                const currentWord = wordsToType[wordIndex];
                const currentText = isDeleting 
                    ? currentWord.substring(0, letterIndex--)
                    : currentWord.substring(0, letterIndex++);
                
                typingTextElement.textContent = currentText;
                let typeSpeed = isDeleting ? 75 : 150;

                if (!isDeleting && letterIndex === currentWord.length + 1) {
                    isDeleting = true;
                    typeSpeed = 2000;
                } else if (isDeleting && letterIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % wordsToType.length;
                }
                setTimeout(type, typeSpeed);
            }
            type();
        }
        
        function createFeatureCards() {
            const featuresContainer = document.getElementById('features-container');
            if(!featuresContainer) return;
            featuresContainer.innerHTML = '';
            featuresData.forEach(feature => {
                const card = document.createElement('div');
                card.className = 'feature-card';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `Ver mais sobre ${feature.title}`);
                card.innerHTML = `
                    <div class="feature-front">
                        <div class="feature-icon"><i class="fas ${feature.icon}"></i></div>
                        <h4>${feature.title}</h4>
                    </div>
                    <div class="feature-back">
                        <p>${feature.desc}</p>
                    </div>
                `;
                card.addEventListener('click', () => card.classList.toggle('flipped'));
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.classList.toggle('flipped');
                    }
                });
                featuresContainer.appendChild(card);
            });
        }
        
        function setupChartInteractions() {
            const chartBars = document.querySelectorAll('.chart-bar');
            const tooltip = document.getElementById('chart-tooltip');
            if(!tooltip || chartBars.length === 0) return;

            chartBars.forEach(bar => {
                bar.addEventListener('mousemove', (e) => {
                    tooltip.textContent = `${bar.dataset.value}%`;
                    tooltip.style.opacity = '1';
                    tooltip.style.left = `${e.pageX + 15}px`;
                    tooltip.style.top = `${e.pageY - 30}px`;
                });
                bar.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                });
            });
        }

        function setupCursorFollower() {
            const cursorFollower = document.createElement('div');
            cursorFollower.className = 'cursor-follower';
            document.body.appendChild(cursorFollower);

            window.addEventListener('mousemove', e => {
                cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });

            document.querySelectorAll('a, button, .quiz-card, .memory-card, .feature-card, .poll-option').forEach(el => {
                el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover-effect'));
                el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover-effect'));
            });
        }

        function setupParallaxEffect() {
            const iconsToAnimate = document.querySelectorAll('.intro-card .icon, .stat-card .icon, .poll-question .icon');
            let ticking = false;

            function updateParallax() {
                const scrollY = window.scrollY;
                iconsToAnimate.forEach(icon => {
                    const speed = -0.1;
                    const yPos = scrollY * speed;
                    icon.style.transform = `translateY(${yPos}px)`;
                });
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }, { passive: true });
        }


        function setupStatsPoll() {
            const pollContainer = document.getElementById('stat-poll');
            if (!pollContainer) return;

            const options = pollContainer.querySelectorAll('.poll-option');
            const resultDiv = pollContainer.querySelector('.poll-result');
            let answered = false;

            options.forEach(option => {
                option.addEventListener('click', () => {
                    if (answered) return;
                    answered = true;
                    
                    const isCorrect = option.dataset.value === '92';
                    option.classList.add(isCorrect ? 'correct' : 'incorrect');

                    options.forEach(opt => {
                        if (opt.dataset.value === '92') {
                            opt.classList.add('correct');
                        } else if(opt !== option) {
                           opt.style.opacity = '0.5';
                        }
                        opt.style.pointerEvents = 'none';
                    });
                    
                    setTimeout(() => {
                        resultDiv.classList.remove('hidden');
                    }, 500);
                });
            });
        }

        function launchConfetti() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const confettiCount = 200;
            const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ffffff'];
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                document.body.appendChild(confetti);
                
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 8 + 4;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.top = '-20px';

                const duration = Math.random() * 3000 + 4000;
                const xEnd = Math.random() * 200 - 100;
                
                confetti.animate([
                    { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
                    { transform: `translate3d(${xEnd}px, 110vh, 0) rotate(${Math.random() * 360 * 3}deg)` }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.1, 0.5, 0.5, 1)',
                    iterations: 1,
                    fill: 'forwards'
                }).onfinish = () => {
                    confetti.remove();
                };
            }
        }

        function init() {
            setupTypingEffect();
            createFeatureCards();
            setupChartInteractions();
            setupCursorFollower();
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setupParallaxEffect();
            }
            setupStatsPoll();
        }

        return { init, launchConfetti };
    })();

    // ========== MÓDULO DO QUIZ ==========
    const Quiz = (() => {
        const elements = {
            container: document.querySelector('.quiz-container'),
            screen: document.getElementById('quiz-screen'),
            title: document.getElementById('quiz-title'),
            question: document.getElementById('quiz-question'),
            options: document.getElementById('quiz-options'),
            nextBtn: document.getElementById('next-btn'),
            result: document.getElementById('quiz-result'),
            resetBtn: document.getElementById('reset-quiz-btn'),
            newBtn: document.getElementById('new-quiz-btn'),
            progressText: document.getElementById('quiz-progress-text'),
            progressFill: document.getElementById('progress-fill'),
            progressBar: document.querySelector('.progress-bar'),
            feedbackIcon: document.getElementById('quiz-feedback-icon'),
            feedbackScore: document.getElementById('quiz-score'),
            feedbackText: document.getElementById('quiz-feedback')
        };
        if (!elements.container) return;

        let state = { currentQuiz: null, currentIndex: 0, score: 0, selectedAnswer: null };

        function start(quizId) {
            if (!quizzesData[quizId]) return;
            state = { currentQuiz: quizzesData[quizId], currentIndex: 0, score: 0, selectedAnswer: null };
            
            elements.container.classList.add('hidden');
            elements.result.classList.add('hidden');
            elements.screen.classList.remove('hidden');
            elements.title.textContent = state.currentQuiz.title;
            
            loadQuestion();
        }

        function loadQuestion() {
            if (state.currentIndex >= state.currentQuiz.questions.length) {
                showResults();
                return;
            }
            elements.options.innerHTML = '';
            elements.nextBtn.classList.add('hidden');
            state.selectedAnswer = null;

            const questionData = state.currentQuiz.questions[state.currentIndex];
            elements.question.textContent = questionData.q;
            updateProgress();

            questionData.o.forEach((option, index) => {
                const optionEl = document.createElement('button');
                optionEl.className = 'quiz-option';
                optionEl.textContent = option;
                optionEl.dataset.index = index;
                elements.options.appendChild(optionEl);
            });
        }

        function selectOption(optionEl) {
            if (state.selectedAnswer !== null) return;
            
            const selectedIndex = parseInt(optionEl.dataset.index);
            state.selectedAnswer = selectedIndex;
            optionEl.classList.add('selected');
            
            const correctIndex = state.currentQuiz.questions[state.currentIndex].a;
            
            setTimeout(() => {
                if (selectedIndex === correctIndex) {
                    state.score++;
                    optionEl.classList.remove('selected');
                    optionEl.classList.add('correct');
                } else {
                    optionEl.classList.remove('selected');
                    optionEl.classList.add('incorrect');
                    const correctOption = elements.options.querySelector(`[data-index='${correctIndex}']`);
                    if (correctOption) correctOption.classList.add('correct');
                }
                
                Array.from(elements.options.children).forEach(el => el.disabled = true);
                elements.nextBtn.classList.remove('hidden');
                elements.nextBtn.focus();
            }, 500);
        }

        function showResults() {
            elements.screen.classList.add('hidden');
            elements.result.classList.remove('hidden');
            
            const scorePercent = (state.score / state.currentQuiz.questions.length) * 100;
            elements.feedbackScore.textContent = `${state.score}/${state.currentQuiz.questions.length}`;
            
            let feedback = {};
            if (scorePercent === 100) {
                feedback = { icon: '🏆', text: "Perfeito! Você é um verdadeiro especialista!" };
                Interactivity.launchConfetti();
            }
            else if (scorePercent >= 80) feedback = { icon: '🌟', text: "Excelente! Ótimo conhecimento!" };
            else if (scorePercent >= 60) feedback = { icon: '👍', text: "Muito bom! Você está no caminho certo!" };
            else feedback = { icon: '📚', text: "Bom esforço! Continue explorando para aprender mais!" };
            
            elements.feedbackIcon.textContent = feedback.icon;
            elements.feedbackText.textContent = feedback.text;

            gameStats.quizzesCompleted++;
            gameStats.totalScore += state.score;
            saveGameStats();
        }
        
        function updateProgress() {
            const totalQuestions = state.currentQuiz.questions.length;
            const progress = ((state.currentIndex + 1) / totalQuestions) * 100;
            elements.progressText.textContent = `Questão ${state.currentIndex + 1} de ${totalQuestions}`;
            elements.progressFill.style.width = `${progress}%`;
            elements.progressBar.setAttribute('aria-valuenow', progress);
        }
        
        function reset() {
            const quizId = quizzesData.findIndex(q => q.title === state.currentQuiz.title);
            start(quizId);
        }

        function backToSelection() {
            elements.screen.classList.add('hidden');
            elements.result.classList.add('hidden');
            elements.container.classList.remove('hidden');
        }
        
        elements.container.addEventListener('click', e => {
            const card = e.target.closest('.quiz-card');
            if(card) start(parseInt(card.dataset.quizId));
        });
        elements.options.addEventListener('click', e => {
            const option = e.target.closest('.quiz-option');
            if(option && !option.disabled) selectOption(option);
        });
        elements.nextBtn.addEventListener('click', () => { state.currentIndex++; loadQuestion(); });
        elements.resetBtn.addEventListener('click', reset);
        elements.newBtn.addEventListener('click', backToSelection);
    })();
    
    // ========== MÓDULO DO JOGO DA MEMÓRIA (VERSÃO SIMPLIFICADA) ==========
    const MemoryGame = (() => {
        const elements = {
            board: document.getElementById('memory-board'),
            moves: document.getElementById('moves-count'),
            time: document.getElementById('time-count'),
            score: document.getElementById('score-count'),
            highscore: document.getElementById('highscore-value'),
            result: document.getElementById('memory-result'),
            finalStats: document.getElementById('memory-final-stats'),
            playAgainBtn: document.getElementById('play-again-btn'),
            peekBtn: document.getElementById('peek-btn'),
            // REMOVIDO: Seletor dos botões de dificuldade
        };
        if (!elements.board) return { init: () => {}, isInitialized: () => true };

        // ALTERADO: Configuração fixa do jogo
        const GAME_CONFIG = { pairs: 8, cols: 4 };
        const ICONS_POOL = [ 'fa-brands fa-tiktok', 'fa-brands fa-youtube', 'fa-brands fa-instagram', 'fa-solid fa-robot', 'fa-solid fa-gamepad', 'fa-solid fa-vr-cardboard', 'fa-solid fa-tablet-screen-button', 'fa-solid fa-headset', 'fa-solid fa-drone', 'fa-solid fa-lightbulb' ];
        
        let state = {};
        // ALTERADO: High score agora é um número, não um objeto
        let highScore = parseInt(localStorage.getItem('memoryHighScore')) || 0;
        let initialized = false;

        // ALTERADO: Função não precisa mais do parâmetro 'difficulty'
        function resetState() {
            if (state.timer) clearInterval(state.timer);
            // REMOVIDO: 'difficulty' do estado
            state = { hasFlipped: false, lock: true, first: null, second: null, moves: 0, score: 0, time: 0, timer: null, matchedPairs: 0, peekUsed: false };
        }
        
        // ALTERADO: Função não precisa mais do parâmetro 'difficulty'
        function init() {
            initialized = true;
            resetState();
            
            elements.peekBtn.disabled = false;
            elements.result.classList.add('hidden');
            elements.board.innerHTML = '';
            
            generateBoard();
            updateDisplays();
            // REMOVIDO: Chamada para updateDifficultyButtons()
            
            initialReveal();
        }

        function initialReveal() {
            const cards = document.querySelectorAll('.memory-card');
            cards.forEach(card => card.classList.add('flip'));
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('flip'));
                state.lock = false;
            }, 2500);
        }

        // ALTERADO: Função não precisa mais do parâmetro 'difficulty' e usa a constante GAME_CONFIG
        function generateBoard() {
            elements.board.style.setProperty('--grid-cols', GAME_CONFIG.cols);

            const iconsForGame = ICONS_POOL.slice(0, GAME_CONFIG.pairs);
            const gameCardsData = [...iconsForGame, ...iconsForGame].sort(() => 0.5 - Math.random());
            
            gameCardsData.forEach(iconClass => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.icon = iconClass;
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', 'Carta do jogo');
                card.innerHTML = `<div class="front-face"><i class="fas fa-question"></i></div><div class="back-face"><i class="${iconClass}"></i></div>`;
                elements.board.appendChild(card);
            });
        }

        function flipCard(card) {
            if (state.lock || card === state.first || card.classList.contains('matched')) return;
            startTimer();
            card.classList.add('flip');
            if (!state.hasFlipped) {
                state.hasFlipped = true;
                state.first = card;
                return;
            }
            state.second = card;
            state.moves++;
            state.lock = true;
            checkForMatch();
        }

        function checkForMatch() {
            const isMatch = state.first.dataset.icon === state.second.dataset.icon;
            state.score += isMatch ? 100 : -10;
            if (state.score < 0) state.score = 0;
            updateDisplays();
            isMatch ? handleMatch() : handleMismatch();
        }

        function handleMatch() {
            state.first.classList.add('pulse', 'matched');
            state.second.classList.add('pulse', 'matched');
            state.matchedPairs++;
            
            setTimeout(() => {
                // ALTERADO: Usa a constante GAME_CONFIG
                if (state.matchedPairs === GAME_CONFIG.pairs) {
                    endGame();
                } else {
                    resetTurn();
                }
            }, 500);
        }

        function handleMismatch() {
            state.first.classList.add('shake');
            state.second.classList.add('shake');
            
            setTimeout(() => {
                state.first.classList.remove('flip', 'shake');
                state.second.classList.remove('flip', 'shake');
                resetTurn();
            }, 1000);
        }

        function resetTurn() {
            [state.hasFlipped, state.lock] = [false, false];
            state.first = null;
            state.second = null;
        }
        
        function endGame() {
            clearInterval(state.timer);
            state.timer = null;
            Interactivity.launchConfetti();

            // ALTERADO: Lógica de high score simplificada
            if (state.score > highScore) {
                highScore = state.score;
                localStorage.setItem('memoryHighScore', highScore);
            }

            elements.finalStats.textContent = `Sua pontuação final foi de ${state.score} pontos!`;
            elements.result.classList.remove('hidden');
            updateDisplays();
        }
        
        // ALTERADO: Lógica de exibição de high score simplificada
        function updateDisplays() {
            elements.moves.textContent = state.moves;
            elements.score.textContent = state.score;
            elements.time.textContent = formatTime(state.time);
            elements.highscore.textContent = highScore;
        }
        
        // REMOVIDO: Função updateDifficultyButtons() foi completamente removida.
        
        function startTimer() { if (!state.timer) state.timer = setInterval(() => { state.time++; updateDisplays(); }, 1000); }
        const formatTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
        
        function peekCards() {
            if (state.lock || state.peekUsed) return;

            state.peekUsed = true;
            elements.peekBtn.disabled = true;
            state.lock = true;
            state.score = Math.max(0, state.score - 50);
            updateDisplays();

            const unflippedCards = document.querySelectorAll('.memory-card:not(.flip)');
            unflippedCards.forEach(card => card.classList.add('flip'));

            setTimeout(() => {
                unflippedCards.forEach(card => card.classList.remove('flip'));
                state.lock = false;
            }, 2000);
        }

        elements.board.addEventListener('click', e => {
            const card = e.target.closest('.memory-card');
            if(card) flipCard(card);
        });
        
        // REMOVIDO: Listener dos botões de dificuldade.
        
        elements.peekBtn.addEventListener('click', peekCards);
        // ALTERADO: Listener chama init() sem argumentos.
        elements.playAgainBtn.addEventListener('click', () => init());
        
        return { init, isInitialized: () => initialized };
    })();

    // ========== DARK MODE ==========
    function applyTheme() {
        document.body.classList.toggle('dark-mode', isDarkMode);
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
        themeToggle.setAttribute('aria-label', `Ativar tema ${isDarkMode ? 'claro' : 'escuro'}`);
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', String(isDarkMode));
        applyTheme();
    }
    
    themeToggle.addEventListener('click', toggleTheme);

    // ========== PERSISTÊNCIA DE DADOS ==========
    function saveGameStats() {
        localStorage.setItem('gameStats', JSON.stringify(gameStats));
    }
    function loadGameStats() {
        try {
            const stats = localStorage.getItem('gameStats');
            const defaultStats = { quizzesCompleted: 0, bestMemoryTime: null, totalScore: 0 };
            return stats ? { ...defaultStats, ...JSON.parse(stats) } : defaultStats;
        } catch (error) {
            console.error("Erro ao carregar estatísticas do jogo:", error);
            return { quizzesCompleted: 0, bestMemoryTime: null, totalScore: 0 };
        }
    }

    // ========== ANIMAÇÕES COM INTERSECTION OBSERVER ==========
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver(
            (entries, obs) => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            }), { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        document.querySelectorAll('.intro-card, .quiz-card, .stat-card, .about-text, .chart-container, .stat-poll-card, .about-features').forEach(el => {
            observer.observe(el);
        });
    }

    // ========== INICIALIZAÇÃO GERAL ==========
    applyTheme();
    handleNavigation();
    Interactivity.init();
    console.log('🚀 Site da Geração Alpha carregado com todas as funcionalidades e otimizações!');
});