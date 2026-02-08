
export class Carousel3D {
    constructor(container, items, onCardClick, initialIndex = 0) {
        this.container = container;
        this.items = items;
        this.onCardClick = onCardClick;
        this.activeIndex = initialIndex;
        this.totalItems = items.length;

        // Touch state
        this.touchStart = null;
        this.touchEnd = null;
        this.dragOffset = 0;
        this.isDragging = false;

        // Auto-play
        this.autoPlayTimer = null;

        // Elements
        this.cardElements = [];

        this.init();
    }

    init() {
        this.container.innerHTML = ''; // Clear container
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.overflow = 'hidden';
        this.container.style.perspective = '1000px';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';

        // Create Card Elements
        this.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';

            // Inline Styles for base card
            card.style.position = 'absolute';
            // Responsive sizing: 65vh on desktop, but max 80vw on mobile for spacing
            const size = 'min(65vh, 80vw)';
            card.style.width = size;
            card.style.height = size; // 1:1 Square
            card.style.cursor = 'pointer';
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            card.style.transformOrigin = 'center center';

            // Inner Content
            card.innerHTML = `
                <div class="card-inner" style="
                    width: 100%; 
                    height: 100%; 
                    background: #000;
                    border-radius: 4px; 
                    overflow: hidden; 
                    display: flex; 
                    flex-direction: column;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 0 0 1px rgba(255, 255, 255, 0.05), /* Inner rim */
                        0 10px 30px rgba(0, 0, 0, 0.8), /* Deep shadow */
                        0 0 20px rgba(255, 255, 255, 0.1); /* Subtle outer glow */
                ">
                    <div class="card-img-wrapper" style="
                        flex: 1; 
                        overflow: hidden; 
                        background: #000; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        padding: 0;
                        position: relative;
                    ">
                        
                        <img src="${item.image}" alt="${item.name}" style="
                            width: 100%; 
                            height: 100%; 
                            object-fit: cover; /* Full bleed as requested */
                            display: block;
                        " />
                        
                        <!-- Tactile Overlay Glare -->
                        <div style="
                            position: absolute;
                            inset: 0;
                            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
                            pointer-events: none;
                            mix-blend-mode: overlay;
                        "></div>
                    </div>
                    
                    <div class="card-meta" style="
                        padding: 15px; 
                        text-align: center;
                        position: absolute;
                        bottom: -50px; 
                        left: 0;
                        right: 0;
                        transition: opacity 0.4s;
                        opacity: 0; 
                    ">
                        <h3 style="
                            margin:0; 
                            font-family:'Space Mono'; 
                            font-size: 1.1rem; 
                            color: #fff; 
                            letter-spacing: 1px;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                        ">${item.name}</h3>
                    </div>
                </div>
            `;

            // Click Handler
            card.addEventListener('click', () => {
                const diff = this.getDiff(index);
                if (diff === 0) {
                    if (this.onCardClick) this.onCardClick(item);
                } else {
                    this.setActiveIndex(index);
                }
            });

            this.container.appendChild(card);
            this.cardElements.push({ element: card, index });
        });

        // Add Controls (Arrows)
        this.createControls();

        // Event Listeners
        this.addEventListeners();

        // Initial Render
        this.updateStyles();
        this.startAutoPlay();
    }

    createControls() {
        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>`;
        prevBtn.style.cssText = `
            position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 30;
            background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; transition: color 0.3s;
        `;
        prevBtn.addEventListener('mouseenter', () => prevBtn.style.color = '#fff');
        prevBtn.addEventListener('mouseleave', () => prevBtn.style.color = 'rgba(255,255,255,0.3)');
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>`;
        nextBtn.style.cssText = `
            position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 30;
            background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; transition: color 0.3s;
        `;
        nextBtn.addEventListener('mouseenter', () => nextBtn.style.color = '#fff');
        nextBtn.addEventListener('mouseleave', () => nextBtn.style.color = 'rgba(255,255,255,0.3)');
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

        this.container.appendChild(prevBtn);
        this.container.appendChild(nextBtn);
    }

    addEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (this.container.offsetParent === null) return; // Only if visible
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch
        this.container.addEventListener('touchstart', (e) => {
            this.touchEnd = null;
            this.touchStart = e.touches[0].clientX;
            this.isDragging = true;
            this.dragOffset = 0;
            this.stopAutoPlay();
            this.container.style.transition = 'none'; // Disable container transition while dragging if needed
            this.cardElements.forEach(c => c.element.style.transition = 'none');
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (!this.touchStart) return;
            const currentX = e.touches[0].clientX;
            this.touchEnd = currentX;
            this.dragOffset = currentX - this.touchStart;
            this.updateStyles(); // Live update
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            this.isDragging = false;
            this.cardElements.forEach(c => c.element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)');

            if (!this.touchStart || !this.touchEnd) {
                this.dragOffset = 0;
                this.updateStyles();
                this.startAutoPlay();
                return;
            }

            const distance = this.touchStart - this.touchEnd;

            // Reset dragOffset before state change to ensure transition calculates from 0
            this.dragOffset = 0;

            if (distance > 50) {
                this.next();
            } else if (distance < -50) {
                this.prev();
            } else {
                this.updateStyles(); // Snap back
            }

            this.touchStart = null;
            this.touchEnd = null;
            this.startAutoPlay();
        });
    }

    getDiff(index) {
        let diff = index - this.activeIndex;
        if (diff > this.totalItems / 2) diff -= this.totalItems;
        if (diff < -this.totalItems / 2) diff += this.totalItems;
        return diff;
    }

    updateStyles() {
        this.cardElements.forEach(({ element, index }) => {
            const diff = this.getDiff(index);

            // Styles
            let zIndex = 0;
            let opacity = 0;
            let transform = 'translateX(-50%) scale(0.8)';
            let filter = 'blur(5px) grayscale(100%)';
            let pointerEvents = 'none';

            if (diff === 0) {
                // Active
                zIndex = 20;
                opacity = 1;
                pointerEvents = 'auto';
                filter = 'blur(0px) grayscale(0%)';
                // Note: translateX calcs are relative to center if using left: 50%
                // But in flex, it's easier to just translate. 
                // Let's stick to absolute positioning relative to container center
                element.style.left = '50%';
                transform = `translateX(calc(-50% + ${this.dragOffset}px)) scale(1)`;

                // Show Meta for active
                const meta = element.querySelector('.card-meta');
                if (meta) meta.style.opacity = '1';

            } else if (diff === -1) {
                // Prev
                zIndex = 10;
                opacity = 0.4;
                pointerEvents = 'auto';
                filter = 'blur(2px) brightness(0.5)';
                element.style.left = '50%';
                // Increased spacing for prev/next to reduced overlap on smaller screens
                transform = `translateX(calc(-130% + ${this.dragOffset}px)) scale(0.85) rotateY(15deg)`;
                const meta = element.querySelector('.card-meta');
                if (meta) meta.style.opacity = '0';
            } else if (diff === 1) {
                // Next
                zIndex = 10;
                opacity = 0.4;
                pointerEvents = 'auto';
                filter = 'blur(2px) brightness(0.5)';
                element.style.left = '50%';
                // Increased spacing for prev/next
                transform = `translateX(calc(30% + ${this.dragOffset}px)) scale(0.85) rotateY(-15deg)`;
                const meta = element.querySelector('.card-meta');
                if (meta) meta.style.opacity = '0';
            } else {
                // Hidden
                element.style.left = '50%';
                const meta = element.querySelector('.card-meta');
                if (meta) meta.style.opacity = '0';
            }

            element.style.zIndex = zIndex;
            element.style.opacity = opacity;
            element.style.transform = transform;
            element.style.filter = filter;
            element.style.pointerEvents = pointerEvents;
        });
    }

    setActiveIndex(index) {
        this.activeIndex = (index + this.totalItems) % this.totalItems;
        this.updateStyles();
    }

    next() {
        this.setActiveIndex(this.activeIndex + 1);
    }

    prev() {
        this.setActiveIndex(this.activeIndex - 1);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        if (this.totalItems > 1) {
            this.autoPlayTimer = setInterval(() => {
                this.next();
            }, 4000);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
    }

    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }
}
