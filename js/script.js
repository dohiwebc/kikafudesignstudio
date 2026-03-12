/* ==========================================================================
   幾何楓製作所燈 (Kikafu Design Studio) - Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. スクロール連動アニメーション (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.reveal, .section-title');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 一度表示されたら監視を解除
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    /* --- 2. ハンバーガーメニューの開閉 --- */
    const menuTrigger = document.getElementById('menu-trigger');
    const navList = document.getElementById('nav-list');
    const navOverlay = document.querySelector('.nav-overlay');

    if (menuTrigger && navList) {
        const closeNav = () => {
            document.body.classList.remove('nav-open');
            menuTrigger.classList.remove('is-active');
            menuTrigger.setAttribute('aria-expanded', 'false');
        };

        menuTrigger.addEventListener('click', () => {
            const willOpen = !document.body.classList.contains('nav-open');
            document.body.classList.toggle('nav-open', willOpen);
            menuTrigger.classList.toggle('is-active', willOpen);
            menuTrigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeNav);
        }

        // メニュー内リンクをクリックしたら閉じる
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Escキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeNav();
            }
        });
    }


    /* --- 3. スムーススクロール (ヘッダーの高さを考慮) --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === "#") return; // 単なる"#"の場合は無視

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* --- 4. ロゴクリック時の挙動 (トップページならスクロール / 他なら遷移) --- */
    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            const isHomePage = window.location.pathname === '/' || 
                            window.location.pathname.endsWith('index.html') ||
                            window.location.pathname === '';
            
            // 現在地がトップページかつリンク先が index.html または # の場合
            if (isHomePage && (logoLink.getAttribute('href') === 'index.html' || logoLink.getAttribute('href') === '#')) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }


    /* --- 5. FAQ アコーディオン --- */
    const faqButtons = document.querySelectorAll('.faq-question');
    if (faqButtons.length > 0) {
        faqButtons.forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                const answer = button.nextElementSibling;

                // アクティブ状態を切り替え
                item.classList.toggle('is-active');

                if (item.classList.contains('is-active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = 0;
                }
            });
        });
    }

    /* --- 6. WORKS 横スクロール（矢印＋ドラッグ＋ホイール） --- */
    const worksScroller = document.querySelector('.works-scroller');
    const worksTrack = document.querySelector('.works-track');
    const worksPrev = document.querySelector('.works-arrow--prev');
    const worksNext = document.querySelector('.works-arrow--next');

    if (worksScroller && worksTrack && worksPrev && worksNext) {
        const getCardWidth = () => {
            const firstCard = worksTrack.querySelector('.work-card');
            if (!firstCard) return worksScroller.clientWidth * 0.8;
            const rect = firstCard.getBoundingClientRect();
            return rect.width + 24; // gap 分を少し足す
        };

        const scrollByAmount = (direction) => {
            const amount = getCardWidth();
            worksScroller.scrollBy({
                left: direction * amount,
                behavior: 'smooth'
            });
        };

        worksPrev.addEventListener('click', () => scrollByAmount(-1));
        worksNext.addEventListener('click', () => scrollByAmount(1));

        // ホイールで横スクロール（縦スクロールを横に変換）
        worksScroller.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                worksScroller.scrollBy({
                    left: e.deltaY,
                    behavior: 'smooth'
                });
            }
        }, { passive: false });

        // ドラッグ操作
        let isDragging = false;
        let dragStartX = 0;
        let startScrollLeft = 0;

        const startDrag = (clientX) => {
            isDragging = true;
            dragStartX = clientX;
            startScrollLeft = worksScroller.scrollLeft;
            worksScroller.classList.add('is-dragging');
        };

        const moveDrag = (clientX) => {
            if (!isDragging) return;
            const walk = dragStartX - clientX;
            worksScroller.scrollLeft = startScrollLeft + walk;
        };

        const endDrag = () => {
            isDragging = false;
            worksScroller.classList.remove('is-dragging');
        };

        worksScroller.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.pageX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveDrag(e.pageX);
        });

        window.addEventListener('mouseup', endDrag);

        worksScroller.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            startDrag(e.touches[0].pageX);
        }, { passive: true });

        worksScroller.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            moveDrag(e.touches[0].pageX);
        }, { passive: true });

        worksScroller.addEventListener('touchend', endDrag);
        worksScroller.addEventListener('touchcancel', endDrag);
    }

});