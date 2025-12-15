// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 添加平滑滚动效果
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 为博客文章卡片添加悬停效果
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });

    // 页面滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const navLinks = header.querySelectorAll('.nav-links a');
        const logoLink = header.querySelector('.logo a');
        
        if (window.scrollY > 50) {
            // 深色背景
            header.style.background = 'rgba(51, 51, 51, 0.95)';
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            // 白色文字
            navLinks.forEach(link => {
                link.style.color = '#ffffff';
            });
            logoLink.style.color = '#4CAF50';
        } else {
            // 浅色背景（恢复CSS默认样式）
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'var(--shadow)';
            
            // 深色文字（恢复CSS默认样式）
            navLinks.forEach(link => {
                link.style.color = 'var(--text-color)';
            });
            logoLink.style.color = 'var(--primary-color)';
        }
    });

    // 添加页面加载动画
    const mainContent = document.querySelector('main');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';
    mainContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);
});