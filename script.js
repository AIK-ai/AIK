// 展示区域滚动功能
function scrollShowcase(rowIndex, scrollAmount) {
    const showcaseRows = document.querySelectorAll('.showcase-row');
    const currentRow = showcaseRows[rowIndex];
    currentRow.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// 初始化AOS动画库
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        disable: window.innerWidth < 768
    });

    // 标语切换效果
    const slogans = document.querySelectorAll('.slogan-container .subtitle');
    let currentSlogan = 0;

    function switchSlogan() {
        slogans.forEach(slogan => slogan.classList.remove('current'));
        currentSlogan = (currentSlogan + 1) % slogans.length;
        slogans[currentSlogan].classList.add('current');
    }

    setInterval(switchSlogan, 3000);
});

// 导航栏滚动效果
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
let isScrollingUp = false;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        if (!isScrollingUp) {
            navbar.style.transform = 'translateY(-100%)';
        }
        isScrollingUp = false;
    } else {
        navbar.style.transform = 'translateY(0)';
        isScrollingUp = true;
    }
    
    lastScrollTop = scrollTop;
});

// 平滑滚动
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

// 优化图片加载
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.img-container img');
    
    images.forEach(img => {
        // 创建新的Image对象预加载图片
        const tempImage = new Image();
        tempImage.src = img.src;
        
        tempImage.onload = function() {
            img.style.opacity = '1';
        };
        
        // 如果图片加载失败，显示错误提示
        tempImage.onerror = function() {
            img.style.display = 'none';
            const errorText = document.createElement('div');
            errorText.className = 'image-error';
            errorText.textContent = '图片加载失败';
            img.parentNode.appendChild(errorText);
        };
    });
});

// 响应式导航菜单
const menuToggle = document.createElement('button');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<span></span><span></span><span></span>';
document.querySelector('.navbar .container').prepend(menuToggle);

menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// 功能预览悬停效果
document.querySelectorAll('.feature-preview-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const tooltip = this.querySelector('.feature-tooltip');
        if (tooltip) {
            const rect = tooltip.getBoundingClientRect();
            if (rect.left < 0) {
                tooltip.style.left = '0';
                tooltip.style.transform = 'translateY(0)';
            } else if (rect.right > window.innerWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '0';
                tooltip.style.transform = 'translateY(0)';
            }
        }
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 效果展示区翻页功能
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.showcase-slider');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.showcase-track');
        const items = track.querySelectorAll('.showcase-item');
        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        
        // 复制项目用于无缝循环
        const clonedItems = Array.from(items).map(item => item.cloneNode(true));
        clonedItems.forEach(clone => track.appendChild(clone));
        
        const itemWidth = items[0].offsetWidth + 20; // 包含margin-right
        const totalWidth = itemWidth * items.length;
        const visibleWidth = slider.offsetWidth;
        const scrollStep = Math.floor(visibleWidth / itemWidth) * itemWidth;
        
        let isAnimating = false;
        let currentScroll = 0;
        
        // 初始化自动滚动
        function initAutoScroll() {
            track.style.transform = 'translateX(0)';
            track.style.transition = 'none';
            track.style.animation = 'autoScroll 120s linear infinite';
        }
        
        // 处理翻页
        function handleScroll(direction) {
            if (isAnimating) return;
            isAnimating = true;
            
            // 暂停自动滚动
            track.style.animation = 'none';
            
            // 获取当前位置
            const matrix = new WebKitCSSMatrix(getComputedStyle(track).transform);
            currentScroll = matrix.m41;
            
            // 计算目标位置
            let targetScroll = currentScroll + (direction === 'prev' ? scrollStep : -scrollStep);
            
            // 处理边界情况
            if (direction === 'prev' && targetScroll > 0) {
                // 如果向前滚动超过起点，立即跳转到末尾
                track.style.transition = 'none';
                track.style.transform = `translateX(${-totalWidth}px)`;
                track.offsetHeight; // 触发重排
                targetScroll = -totalWidth + scrollStep;
            } else if (direction === 'next' && targetScroll < -totalWidth) {
                // 如果向后滚动超过终点，立即跳转到起点
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                track.offsetHeight; // 触发重排
                targetScroll = -scrollStep;
            }
            
            // 应用过渡效果
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(${targetScroll}px)`;
            
            // 翻页完成后恢复自动滚动
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.animation = 'autoScroll 120s linear infinite';
                // 计算动画延迟，使其从当前位置继续
                track.style.animationDelay = `${targetScroll / totalWidth * 120}s`;
                isAnimating = false;
            }, 500);
        }
        
        // 绑定事件
        prev.addEventListener('click', () => handleScroll('prev'));
        next.addEventListener('click', () => handleScroll('next'));
        
        // 鼠标悬停控制
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // 动画结束时重置
        track.addEventListener('animationend', () => {
            initAutoScroll();
        });
        
        // 初始化
        initAutoScroll();
    });
});

// 为所有图片添加点击事件
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有图片元素
    const allImages = document.querySelectorAll('img');
    
    // 为每个图片添加点击事件
    allImages.forEach(img => {
        // 添加鼠标样式
        img.style.cursor = 'pointer';
        
        // 添加点击事件
        img.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认行为
            
            // 创建新窗口并打开图片
            const imgUrl = this.src;
            const imgTitle = this.alt || '图片预览';
            
            // 检测是否为移动设备
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                // 移动端：创建全屏遮罩层
                const overlay = document.createElement('div');
                overlay.className = 'image-preview-overlay';
                
                const content = `
                    <div class="mobile-image-preview">
                        <div class="image-title">${imgTitle}</div>
                        <div class="image-container">
                            <img src="${imgUrl}" alt="${imgTitle}">
                        </div>
                        <button class="close-button">关闭</button>
                    </div>
                `;
                
                overlay.innerHTML = content;
                document.body.appendChild(overlay);
                document.body.style.overflow = 'hidden'; // 防止背景滚动
                
                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    .image-preview-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.9);
                        z-index: 10000;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .mobile-image-preview {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .image-title {
                        color: white;
                        font-size: 16px;
                        margin-bottom: 20px;
                        text-align: center;
                        width: 100%;
                        padding: 0 40px;
                    }
                    .image-container {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        max-height: 80vh;
                    }
                    .image-container img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        touch-action: pinch-zoom;
                    }
                    .close-button {
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        z-index: 10001;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .close-button:active {
                        background: rgba(255, 255, 255, 0.3);
                    }
                    @media (orientation: landscape) {
                        .mobile-image-preview {
                            flex-direction: row;
                            padding: 10px;
                        }
                        .image-title {
                            writing-mode: vertical-rl;
                            margin-bottom: 0;
                            margin-right: 20px;
                            padding: 0;
                        }
                        .close-button {
                            right: 20px;
                            bottom: auto;
                            top: 50%;
                            left: auto;
                            transform: translateY(-50%);
                        }
                    }
                `;
                document.head.appendChild(style);
                
                // 添加关闭事件
                const closeButton = overlay.querySelector('.close-button');
                const closePreview = () => {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                };
                
                closeButton.addEventListener('click', closePreview);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        closePreview();
                    }
                });
                
                // 添加触摸手势支持
                let touchStartY = 0;
                overlay.addEventListener('touchstart', (e) => {
                    touchStartY = e.touches[0].clientY;
                });
                
                overlay.addEventListener('touchmove', (e) => {
                    const touchDiff = e.touches[0].clientY - touchStartY;
                    if (Math.abs(touchDiff) > 100) {
                        closePreview();
                    }
                });
            } else {
                // 桌面端：打开新窗口
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${imgTitle}</title>
                        <style>
                            body {
                                margin: 0;
                                padding: 20px;
                                background: #000;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                min-height: 100vh;
                                font-family: 'Noto Sans SC', sans-serif;
                            }
                            .image-title {
                                color: white;
                                font-size: 20px;
                                margin-bottom: 20px;
                                text-align: center;
                            }
                            .image-container {
                                max-width: 90vw;
                                max-height: 80vh;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            img {
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                            }
                            .close-button {
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                background: rgba(255, 255, 255, 0.2);
                                border: none;
                                color: white;
                                padding: 10px 20px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 16px;
                                transition: background 0.3s ease;
                            }
                            .close-button:hover {
                                background: rgba(255, 255, 255, 0.3);
                            }
                            @media (max-width: 768px) {
                                body {
                                    padding: 10px;
                                }
                                .image-title {
                                    font-size: 16px;
                                }
                                .close-button {
                                    padding: 8px 16px;
                                    font-size: 14px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="image-title">${imgTitle}</div>
                        <div class="image-container">
                            <img src="${imgUrl}" alt="${imgTitle}">
                        </div>
                        <button class="close-button" onclick="window.close()">关闭</button>
                    </body>
                    </html>
                `);
                newWindow.document.close();
            }
        });
    });
});

// 二维码弹窗功能
function createQRCodeModal() {
    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.className = 'qrcode-modal';
    
    // 创建弹窗内容
    const content = `
        <div class="qrcode-container">
            <div class="qrcode-content">
                <img src="images/二维码.png" alt="联系二维码">
                <p>扫码联系我们</p>
                <button class="close-qrcode">关闭</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = content;
    document.body.appendChild(modal);
    
    // 添加关闭功能
    const closeBtn = modal.querySelector('.close-qrcode');
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
}

// 添加点击事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要显示二维码的链接
    const qrcodeLinks = [
        ...document.querySelectorAll('a[href="#contact"]'),
        ...document.querySelectorAll('a[href="#business"]'),
        ...document.querySelectorAll('a[href="#partner"]'),
        ...document.querySelectorAll('a[href="#join"]'),
        ...document.querySelectorAll('.social-link')
    ];
    
    // 为每个链接添加点击事件
    qrcodeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            createQRCodeModal();
        });
    });
});

// 功能卡片点击交互
const featureCards = document.querySelectorAll('.feature-card');
const featureOverlay = document.querySelector('.feature-overlay');
const featureDetail = document.querySelector('.feature-detail');

// 功能描述映射
const featureDescriptions = {
    '电商产品摄影': '一键生成专业电商产品图，提升转化率',
    'AI人像写真摄影': '智能人像生成，打造完美写真',
    '时尚穿搭摄影': '时尚穿搭展示，展现个性风格',
    '万能替换': '灵活替换图片元素，创造无限可能',
    '爆款图片复刻': '一键复制热门风格，快速制作爆款',
    '服装替换': '将模特服装智能转换为指定服装，更高效地展示您的服装产品',
    '一键扩图': '智能扩展图片边界，完美还原场景细节',
    '旧照修复上色': '修复老照片损坏，为黑白照片智能上色',
    '文字水印消除': '智能去除图片中的文字和水印痕迹',
    '超清放大': '提升图片分辨率，保持清晰度不失真',
    '批量Lora': '批量处理图片风格，提高工作效率',
    '万能生成': '一键生成各类风格图片，满足多样化需求'
};

featureCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img').cloneNode(true);
        const title = card.querySelector('.feature-title').textContent;
        const description = featureDescriptions[title];

        featureDetail.innerHTML = '';
        featureDetail.appendChild(img);
        const descriptionP = document.createElement('p');
        descriptionP.textContent = description;
        featureDetail.appendChild(descriptionP);

        featureOverlay.classList.add('active');
        featureDetail.classList.add('active');
    });
});

featureOverlay.addEventListener('click', () => {
    featureOverlay.classList.remove('active');
    featureDetail.classList.remove('active');
}); 