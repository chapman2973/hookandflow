// ==================== ПЛАВНАЯ ПРОКРУТКА ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== ПРОГРЕСС-БАР ПРОКРУТКИ ====================
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});

// ==================== МОБИЛЬНОЕ МЕНЮ ====================
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

if (burger && navMenu) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

// ==================== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .advantage-card, .tariff-card, .case-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== СТИЛЬ НАВИГАЦИИ ПРИ СКРОЛЛЕ ====================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// ==================== КАЛЬКУЛЯТОР ROI ====================
const ordersSlider = document.getElementById('orders');
const avgCheckSlider = document.getElementById('avgCheck');
const ordersValue = document.getElementById('ordersValue');
const avgCheckValue = document.getElementById('avgCheckValue');
const savingsDisplay = document.getElementById('savings');

function calculateSavings() {
    if (!ordersSlider || !avgCheckSlider) return;
    
    const orders = parseInt(ordersSlider.value);
    const avgCheck = parseInt(avgCheckSlider.value);
    
    // Формула: (заказов * средний чек * 0.25 рост) - затраты на бота
    const monthlySavings = Math.round((orders * avgCheck * 0.25) - 3000);
    
    ordersValue.textContent = orders;
    avgCheckValue.textContent = avgCheck + ' ₽';
    savingsDisplay.textContent = monthlySavings.toLocaleString('ru-RU');
}

if (ordersSlider && avgCheckSlider) {
    ordersSlider.addEventListener('input', calculateSavings);
    avgCheckSlider.addEventListener('input', calculateSavings);
    calculateSavings();
}

// ==================== АНИМАЦИЯ ЦИФР В СТАТИСТИКЕ ====================
function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = document.querySelectorAll('.stat-item h3[data-count]');
            statItems.forEach(item => {
                const targetValue = parseInt(item.dataset.count);
                animateValue(item, 0, targetValue, 2000);
            });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ==================== FAQ АККОРДЕОН ====================
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    
    if (question && toggle) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Закрыть все остальные
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherToggle = otherItem.querySelector('.faq-toggle');
                if (otherToggle) otherToggle.textContent = '+';
            });
            
            // Переключить текущий
            if (!isActive) {
                item.classList.add('active');
                toggle.textContent = '−';
            }
        });
    }
});

// ==================== LIVE УВЕДОМЛЕНИЯ ====================
const notifications = [
    "Салон красоты в Екатеринбурге только что заказал бота",
    "Фитнес-центр в Берёзовском получил расчёт стоимости",
    "Кафе в Екатеринбурге интересуется автоматизацией",
    "Автосервис в Березовском заказал консультацию"
];

function showNotification() {
    const notification = document.querySelector('.live-notifications .notification');
    if (notification) {
        const randomText = notifications[Math.floor(Math.random() * notifications.length)];
        const textElement = notification.querySelector('.notification-text');
        if (textElement) {
            textElement.textContent = randomText;
        }
        
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }, 5000);
    }
}

// Показываем уведомление каждые 10 секунд
setInterval(showNotification, 10000);
setTimeout(showNotification, 3000); // Первое через 3 сек

// ==================== ОТПРАВКА ФОРМЫ В TELEGRAM ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email') || 'Не указан',
            business: formData.get('business'),
            message: formData.get('message') || 'Не указано'
        };
        
        // ВАЖНО: Добавь свой Telegram Bot Token и Chat ID
        // Инструкция: https://core.telegram.org/bots#3-how-do-i-create-a-bot
        const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Получи у @BotFather
        const CHAT_ID = 'YOUR_CHAT_ID_HERE'; // Свой ID получи у @userinfobot
        
        const text = `
🔔 Новая заявка с сайта Hook & Flow!

👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
📧 Email: ${data.email}
🏢 Бизнес: ${data.business}
💬 Сообщение: ${data.message}
        `;
        
        try {
            // Раскомментируй когда добавишь свой токен
            /*
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'HTML'
                })
            });
            
            if (response.ok) {
                alert('✅ Спасибо за заявку! Мы свяжемся с вами в течение 15 минут.');
                contactForm.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
            */
            
            // Временно показываем успех без реальной отправки
            alert('✅ Спасибо за заявку! Мы свяжемся с вами в течение 15 минут.');
            contactForm.reset();
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('⚠️ Произошла ошибка. Позвоните нам: +7 (912) 628-58-24');
        }
    });
}

// ==================== КНОПКА "НАВЕРХ" ====================
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== ПАРАЛЛАКС ЭФФЕКТ ДЛЯ HERO ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

console.log('🚀 Hook & Flow сайт загружен успешно!');
console.log('💡 Не забудь добавить свой Telegram Bot Token для приёма заявок');
