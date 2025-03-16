// Main JavaScript para o site da Terto Barbearia

// Loader
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar o loader depois de 1,5 segundos
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        loader.style.opacity = '0';

        // Remover o loader do DOM após a animação de fade out
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Inicializar o carrossel
    initCarousel();

    // Adicionar classe ao header quando rolar a página
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Adicionar evento de escuta ao input do chat
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Animação de scroll suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Fechar sidebar se estiver aberta em dispositivos móveis
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('active')) {
                    toggleSidebar();
                }

                // Calcular posição com offset do header
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Adiciona escape key para fechar sidebar
    document.addEventListener('keydown', function (e) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Marcar links ativos no menu
    setActiveMenuLinks();

    // Adicionar evento para fechar o modal ao clicar fora
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        window.addEventListener('click', function (event) {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // Inicializar filtros de galeria
    initGalleryFilters();

    // Inicializar lightbox melhorado
    initLightbox();
});

// Controle do Sidebar - Versão melhorada
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('overlay');

    // Cria um overlay escuro se ele não existir
    if (!overlay && !sidebar.classList.contains('active')) {
        const overlayDiv = document.createElement('div');
        overlayDiv.id = 'overlay';
        overlayDiv.className = 'sidebar-overlay';
        overlayDiv.onclick = toggleSidebar; // Fecha ao clicar fora
        document.body.appendChild(overlayDiv);

        // Animação de fade in para o overlay
        setTimeout(() => {
            overlayDiv.style.opacity = '1';
        }, 10);
    } else if (overlay) {
        // Fade out do overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }

    // Alterna a classe active no sidebar
    sidebar.classList.toggle('active');

    // Impede a rolagem do body quando o sidebar está aberto
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Controle do Carrossel - Versão melhorada
let slideIndex = 0;
let slideInterval;
let isPlaying = true;
let slideDuration = 5000; // 5 segundos por slide

function initCarousel() {
    const carouselImages = document.getElementById('carousel-images');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (!carouselImages || !indicatorsContainer) return;

    const slides = carouselImages.getElementsByClassName('carousel-slide');
    if (slides.length === 0) return;

    // Criar indicadores com animação de progresso
    for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        indicator.onclick = function () { jumpToSlide(i); };

        if (i === 0) {
            indicator.classList.add('active');
            startProgressAnimation(indicator);
        }

        indicatorsContainer.appendChild(indicator);
    }

    // Inicializar primeiro slide como ativo
    slides[0].classList.add('active');

    // Adicionar swipe para dispositivos móveis
    addSwipeListeners(carouselImages.parentElement);

    // Iniciar carrossel automático
    startSlideInterval();

    // Pausar carrossel ao passar o mouse
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseSlideshow);
        carousel.addEventListener('mouseleave', resumeSlideshow);
    }
}

function startProgressAnimation(indicator) {
    // Reset any existing animation
    const indicatorAfter = indicator.querySelector('::after');
    if (indicatorAfter) {
        indicatorAfter.style.transition = 'none';
        indicatorAfter.style.width = '0';
        setTimeout(() => {
            indicatorAfter.style.transition = `width ${slideDuration}ms linear`;
            indicatorAfter.style.width = '100%';
        }, 10);
    }
}

function pauseSlideshow() {
    clearInterval(slideInterval);
    isPlaying = false;

    // Pause the progress animation
    const activeIndicator = document.querySelector('.indicator.active::after');
    if (activeIndicator) {
        const computedStyle = window.getComputedStyle(activeIndicator);
        const width = computedStyle.getPropertyValue('width');
        activeIndicator.style.transition = 'none';
        activeIndicator.style.width = width;
    }
}

function resumeSlideshow() {
    if (!isPlaying) {
        startSlideInterval();
        isPlaying = true;

        // Resume the progress animation
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
            startProgressAnimation(activeIndicator);
        }
    }
}

function startSlideInterval() {
    // Clear any existing interval
    clearInterval(slideInterval);

    slideInterval = setInterval(() => {
        moveSlide(1);
    }, slideDuration);
}

function moveSlide(n) {
    const carouselImages = document.getElementById('carousel-images');
    if (!carouselImages) return;

    const slides = carouselImages.getElementsByClassName('carousel-slide');
    const indicators = document.getElementsByClassName('indicator');

    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[slideIndex].classList.remove('active');
    indicators[slideIndex].classList.remove('active');

    // Calculate new slide index
    slideIndex = (slideIndex + n + slides.length) % slides.length;

    // Add active class to new slide
    slides[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');

    // Start progress animation for the active indicator
    startProgressAnimation(indicators[slideIndex]);

    // Move the carousel
    carouselImages.style.transform = `translateX(-${slideIndex * 100}%)`;

    // Restart the interval timer
    if (isPlaying) {
        startSlideInterval();
    }
}

function jumpToSlide(n) {
    if (slideIndex === n) return;

    const direction = n > slideIndex ? 1 : -1;
    moveSlide(direction * Math.abs(n - slideIndex));
}

// Adicionar funcionalidade de swipe para dispositivos móveis
function addSwipeListeners(element) {
    if (!element) return;

    let startX;
    let endX;
    const threshold = 50; // Minimum distance to be considered a swipe

    element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, false);

    element.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const distance = endX - startX;
        if (Math.abs(distance) >= threshold) {
            if (distance > 0) {
                // Swipe right - go to previous slide
                moveSlide(-1);
            } else {
                // Swipe left - go to next slide
                moveSlide(1);
            }
        }
    }
}

// Lightbox da Galeria
let currentImageIndex = 0;
let galleryImages = [];

function initLightbox() {
    // Coletar todas as imagens da galeria
    const galleryImgElements = document.querySelectorAll('.gallery-item:not(.featured-video) img');
    galleryImages = Array.from(galleryImgElements);
}

// Abrir lightbox com a imagem clicada
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (lightbox && lightboxImg) {
        // Encontrar o índice da imagem atual
        currentImageIndex = galleryImages.indexOf(img);

        // Definir a imagem
        lightboxImg.src = img.src;

        // Tentar obter o caption a partir do overlay
        const overlayTitle = img.closest('.gallery-item').querySelector('.overlay-content h3');
        const overlayDesc = img.closest('.gallery-item').querySelector('.overlay-content p');

        if (overlayTitle && overlayDesc) {
            lightboxCaption.innerHTML = `<h3>${overlayTitle.textContent}</h3><p>${overlayDesc.textContent}</p>`;
        } else {
            lightboxCaption.innerHTML = img.alt;
        }

        // Mostrar lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fechar lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Navegar entre as imagens
function changeImage(direction) {
    if (galleryImages.length === 0) return;

    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    const newImage = galleryImages[currentImageIndex];

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (lightboxImg && newImage) {
        lightboxImg.src = newImage.src;

        // Tentar obter o caption a partir do overlay
        const overlayTitle = newImage.closest('.gallery-item').querySelector('.overlay-content h3');
        const overlayDesc = newImage.closest('.gallery-item').querySelector('.overlay-content p');

        if (overlayTitle && overlayDesc) {
            lightboxCaption.innerHTML = `<h3>${overlayTitle.textContent}</h3><p>${overlayDesc.textContent}</p>`;
        } else {
            lightboxCaption.innerHTML = newImage.alt;
        }
    }
}

// Evento de teclado para navegação no lightbox
document.addEventListener('keydown', function (e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Chatbot
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const chatbotBtn = document.querySelector('.chatbot-btn');

    if (!chatbot) return;

    chatbot.classList.toggle('active');

    if (chatbot.classList.contains('active')) {
        if (chatbotBtn) chatbotBtn.style.display = 'none';
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
    } else {
        setTimeout(() => {
            if (chatbotBtn) chatbotBtn.style.display = 'flex';
        }, 300);
    }
}

// Função para enviar mensagem no chatbot
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chatbot-messages');

    if (!chatInput || !chatMessages || !chatInput.value.trim()) return;

    // Criar e adicionar mensagem do usuário
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'user-message';
    userMessageDiv.textContent = chatInput.value;
    chatMessages.appendChild(userMessageDiv);

    // Limpar input
    const userMessage = chatInput.value;
    chatInput.value = '';

    // Rolar para a mensagem mais recente
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simular resposta do bot (após um pequeno delay)
    setTimeout(() => {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'bot-message';

        // Respostas simples baseadas em palavras-chave
        if (userMessage.toLowerCase().includes('horário') || userMessage.toLowerCase().includes('hora')) {
            botMessageDiv.textContent = 'Nosso horário de funcionamento é de Terça a sábado, das 7h às 19h e Domingo ate as 14:00 segunda e Fechado.';
        } else if (userMessage.toLowerCase().includes('preço') || userMessage.toLowerCase().includes('valor') || userMessage.toLowerCase().includes('quanto')) {
            botMessageDiv.textContent = 'Nossos preços estao nos card va la de uma conferida .';
        } else if (userMessage.toLowerCase().includes('agendamento') || userMessage.toLowerCase().includes('marcar') || userMessage.toLowerCase().includes('agendar')) {
            botMessageDiv.textContent = 'Para agendar, você pode usar nosso formulário de agendamento ou entrar em contato pelo telefone no whatzap : 829 99600-9360.';
        } else if (userMessage.toLowerCase().includes('endereço') || userMessage.toLowerCase().includes('local') || userMessage.toLowerCase().includes('onde')) {
            botMessageDiv.textContent = 'Estamos localizados na Rua Lorival Messias 130 Pilar-AL.';
        } else if (userMessage.toLowerCase().includes('fundador') || userMessage.toLowerCase().includes('dono')) {
            botMessageDiv.textContent = 'Nossa barbearia foi fundada por Jonatas Terto em 2019. Jonatas tem mais de 5 anos de experiência como barbeiro e é apaixonado por proporcionar o melhor atendimento aos clientes.';
        } else {
            botMessageDiv.textContent = 'Obrigado por entrar em contato! Como posso ajudar com nossos serviços de barbearia?';
        }

        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

// Função para agendamento
function scheduleAppointment() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const datetime = document.getElementById('datetime').value;

    if (!name || !phone || !service || !datetime) {
        alert('Por favor, preencha todos os campos para agendar.');
        return;
    }

    // Aqui você normalmente enviaria os dados para um servidor
    // Como é apenas demonstração, vamos mostrar um alerta
    alert(`Agendamento recebido!\n\nNome: ${name}\nTelefone: ${phone}\nServiço: ${service}\nData e Hora: ${datetime}\n\nEntraremos em contato para confirmar seu horário.`);

    // Limpar formulário
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('service').value = '';
    document.getElementById('datetime').value = '';
}

// Função para marcar links ativos no menu
function setActiveMenuLinks() {
    // Obter o caminho da página atual
    const currentPage = window.location.pathname.split('/').pop();

    // Encontrar todos os links do menu
    const navLinks = document.querySelectorAll('.desktop-nav a, .sidebar-links a');

    navLinks.forEach(link => {
        // Remover a classe active de todos os links
        link.classList.remove('active');

        // Verificar se o link corresponde à página atual
        const linkHref = link.getAttribute('href');

        if (currentPage === '' || currentPage === 'index.html') {
            // Estamos na página inicial
            if (linkHref.startsWith('#') || linkHref === 'index.html') {
                // Não marcamos os links internos como ativos automaticamente
                // porque eles serão ativados pelo scroll
            }
        } else if (linkHref === currentPage || linkHref.includes(currentPage)) {
            // Estamos em uma página secundária e o link aponta para ela
            link.classList.add('active');
        }
    });
}

// Funções para o modal de vídeo
function openVideoModal(videoSrc) {
    const modal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    if (modal && videoFrame) {
        videoFrame.src = videoSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    if (modal && videoFrame) {
        modal.style.display = 'none';
        // Importante: limpar o src para parar o vídeo
        videoFrame.src = '';
        document.body.style.overflow = 'auto';
    }
}

// Função para inicializar os filtros da galeria
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remover active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Adicionar active ao botão clicado
            this.classList.add('active');

            // Aplicar o filtro
            const filter = this.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });
}

// Função para filtrar os itens da galeria
function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        if (filter === 'all') {
            item.classList.remove('hide');
            setTimeout(() => {
                item.classList.add('show');
            }, 10);
        } else {
            if (item.getAttribute('data-category') === filter) {
                item.classList.remove('hide');
                setTimeout(() => {
                    item.classList.add('show');
                }, 10);
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
            }
        }
    });
}

// Função atualizada para redirecionar para o WhatsApp incluindo data de nascimento
function redirectToWhatsApp(e) {
    e.preventDefault();

    // Obter os valores dos campos
    const name = document.getElementById('name').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const phone = document.getElementById('phone').value.trim();

    // Validação básica
    if (!name || !birthdate || !phone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Formatar a data de nascimento para exibição brasileira (DD/MM/AAAA)
    const birthdateParts = birthdate.split('-');
    const formattedBirthdate = birthdateParts.length === 3 ?
        `${birthdateParts[2]}/${birthdateParts[1]}/${birthdateParts[0]}` : birthdate;

    // Construir a mensagem para o WhatsApp
    let message = `Olá! Gostaria de agendar um horário na Terto Barbearia.\n\n`;
    message += `*Nome:* ${name}\n`;
    message += `*Data de Nascimento:* ${formattedBirthdate}\n`;
    message += `*Telefone:* ${phone}\n`;
    message += `\nPor favor, gostaria de informações sobre disponibilidade e valores dos serviços.`;

    // Número da barbearia
    const whatsappNumber = '5582996009360'; // Inclui o código do país (55) para o Brasil

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);

    // Criar o link do WhatsApp
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Redirecionar para o WhatsApp
    window.open(whatsappLink, '_blank');
}

// Adicionar máscara para o campo de telefone
document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            // Formatar: (XX) XXXXX-XXXX
            if (value.length > 0) {
                value = `(${value.slice(0, 2)})${value.length > 2 ? ' ' + value.slice(2, 7) : ''}${value.length > 7 ? '-' + value.slice(7, 11) : ''}`;
            }

            e.target.value = value;
        });
    }
});

// Funções para a galeria
document.addEventListener('DOMContentLoaded', function () {
    // Filtros da galeria
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');

            // Filtrar itens da galeria
            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Funções do Lightbox
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';

    // Evitar rolagem da página
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';

    // Permitir rolagem novamente
    document.body.style.overflow = 'auto';
}

// Fechar o lightbox ao clicar fora da imagem
document.addEventListener('DOMContentLoaded', function () {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});
