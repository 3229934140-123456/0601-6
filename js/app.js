document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTime();
    initLobby();
    initBooths();
    initAvatar();
    initChat();
    initEvents();
    initDashboard();
    initProfile();
    initModals();
});

const areaData = {
    entrance: { name: '入口大厅', icon: 'fa-door-open', desc: '欢迎来到元宇宙科技博览会入口大厅，您可以在此处休息、交流，或前往各个展区参观。', visitors: 328, booths: 12 },
    tech: { name: '科技展区', icon: 'fa-microchip', desc: '汇聚全球顶尖科技企业，展示AI、VR、机器人等前沿科技产品，体验未来科技魅力。', visitors: 512, booths: 28 },
    fashion: { name: '时尚展区', icon: 'fa-tshirt', desc: '数字时尚品牌聚集地，展示虚拟服装、NFT配饰、数字潮玩等时尚单品。', visitors: 386, booths: 22 },
    stage: { name: '主舞台', icon: 'fa-theater-masks', desc: '峰会主舞台，行业领袖在此分享洞见，还有精彩演出和互动活动轮番上演。', visitors: 1256, booths: 0 },
    food: { name: '美食广场', icon: 'fa-utensils', desc: '逛展累了？来美食广场休息一下，品尝各种虚拟美食和饮品。', visitors: 198, booths: 8 },
    art: { name: '艺术展区', icon: 'fa-palette', desc: '数字艺术画廊，汇聚全球知名数字艺术家作品，打造沉浸式艺术体验。', visitors: 267, booths: 18 },
    startup: { name: '创业专区', icon: 'fa-rocket', desc: '优秀创业项目展示与路演，寻找投资合作伙伴，见证未来独角兽的诞生。', visitors: 334, booths: 24 },
    lounge: { name: '休息区', icon: 'fa-couch', desc: '安静的休息空间，可以与好友轻松聊天，或者独自整理参观收获。', visitors: 145, booths: 0 },
    exit: { name: '出口', icon: 'fa-sign-out-alt', desc: '感谢您参观元宇宙科技博览会，期待下次与您再见！', visitors: 89, booths: 0 },
};

const areaOrder = ['entrance', 'tech', 'fashion', 'stage', 'food', 'art', 'startup', 'lounge', 'exit'];

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`page-${pageId}`).classList.add('active');

            if (pageId === 'avatar') {
                updateAvatarPreview();
            }
        });
    });
}

function initTime() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        timeEl.textContent = timeStr;
    }
}

function initLobby() {
    renderVisitors();
    initMapAreas();
    initEnterSpace();
    initAreaNavigation();
}

function renderVisitors() {
    const grid = document.getElementById('visitors-grid');
    if (!grid) return;
    
    grid.innerHTML = mockData.visitors.map(visitor => `
        <div class="visitor-card">
            <div class="visitor-avatar" style="background: ${visitor.color};">
                <i class="fas ${visitor.avatar}"></i>
            </div>
            <div class="visitor-info">
                <div class="visitor-name">${visitor.name}</div>
                <div class="visitor-badge">${visitor.badge}</div>
            </div>
        </div>
    `).join('');
}

function initMapAreas() {
    const areas = document.querySelectorAll('.map-area');
    areas.forEach(area => {
        area.addEventListener('click', () => {
            const areaId = area.dataset.area;
            if (appState.inSpace) {
                switchArea(areaId);
            } else {
                areas.forEach(a => a.classList.remove('active'));
                area.classList.add('active');
            }
        });
    });
}

function initEnterSpace() {
    const btn = document.getElementById('btn-enter-space');
    const textSpan = document.getElementById('enter-space-text');
    const spaceExplore = document.getElementById('space-explore');

    if (btn) {
        btn.addEventListener('click', () => {
            appState.inSpace = !appState.inSpace;
            
            if (appState.inSpace) {
                textSpan.textContent = '退出空间';
                btn.querySelector('i').className = 'fas fa-sign-out-alt';
                spaceExplore.style.display = 'block';
                switchArea(appState.currentArea);
                renderNearbyVisitors();
            } else {
                textSpan.textContent = '进入空间';
                btn.querySelector('i').className = 'fas fa-play-circle';
                spaceExplore.style.display = 'none';
            }
        });
    }
}

function initAreaNavigation() {
    const prevBtn = document.getElementById('btn-prev-area');
    const nextBtn = document.getElementById('btn-next-area');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentIndex = areaOrder.indexOf(appState.currentArea);
            const prevIndex = (currentIndex - 1 + areaOrder.length) % areaOrder.length;
            switchArea(areaOrder[prevIndex]);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentIndex = areaOrder.indexOf(appState.currentArea);
            const nextIndex = (currentIndex + 1) % areaOrder.length;
            switchArea(areaOrder[nextIndex]);
        });
    }
}

function switchArea(areaId) {
    appState.currentArea = areaId;
    const area = areaData[areaId];
    appState.currentAreaName = area.name;

    const areaNameEl = document.getElementById('current-area-name');
    const areaDetailTitle = document.getElementById('area-detail-title');
    const areaDetailDesc = document.getElementById('area-detail-desc');
    const areaDetailIcon = document.getElementById('area-detail-icon');
    const areaVisitorCount = document.getElementById('area-visitor-count');
    const mapAreas = document.querySelectorAll('.map-area');

    if (areaNameEl) areaNameEl.textContent = area.name;
    if (areaDetailTitle) areaDetailTitle.textContent = area.name;
    if (areaDetailDesc) areaDetailDesc.textContent = area.desc;
    if (areaDetailIcon) areaDetailIcon.className = `fas ${area.icon}`;
    if (areaVisitorCount) areaVisitorCount.textContent = area.visitors;

    mapAreas.forEach(a => {
        a.classList.remove('active');
        if (a.dataset.area === areaId) {
            a.classList.add('active');
        }
    });

    renderNearbyVisitors();
}

function renderNearbyVisitors() {
    const grid = document.getElementById('nearby-visitors-grid');
    if (!grid) return;

    const shuffled = [...mockData.visitors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);

    grid.innerHTML = selected.map(visitor => `
        <div class="visitor-card">
            <div class="visitor-avatar" style="background: ${visitor.color};">
                <i class="fas ${visitor.avatar}"></i>
            </div>
            <div class="visitor-info">
                <div class="visitor-name">${visitor.name}</div>
                <div class="visitor-badge">${visitor.badge}</div>
            </div>
        </div>
    `).join('');
}

function initBooths() {
    renderBooths('all');
    renderCollections();
    renderMaterials();
    initBoothFilters();
    initBoothModal();
}

function renderBooths(filter) {
    const grid = document.getElementById('booths-grid');
    if (!grid) return;
    
    let booths = mockData.booths;
    
    if (filter === 'favorites') {
        booths = booths.filter(b => appState.favoriteBooths.includes(b.id));
    } else if (filter !== 'all') {
        booths = booths.filter(b => b.category === filter);
    }
    
    if (booths.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-secondary);"><i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i><p>暂无展位</p></div>';
        return;
    }
    
    grid.innerHTML = booths.map(booth => {
        const isFavorite = appState.favoriteBooths.includes(booth.id);
        return `
        <div class="booth-card" data-booth-id="${booth.id}">
            <div class="booth-image" style="background: linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()});">
                <i class="fas ${booth.icon}"></i>
                ${booth.badge ? `<span class="booth-badge">${booth.badge}</span>` : ''}
                <div class="booth-favorite ${isFavorite ? 'active' : ''}" data-favorite="${booth.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
                </div>
            </div>
            <div class="booth-info">
                <div class="booth-name">${booth.name}</div>
                <div class="booth-exhibitor">${booth.exhibitor}</div>
                <div class="booth-stats">
                    <span class="booth-stat"><i class="fas fa-eye"></i> ${booth.visitors}</span>
                    <span class="booth-stat"><i class="fas fa-heart"></i> ${booth.likes}</span>
                </div>
            </div>
        </div>
    `}).join('');

    grid.querySelectorAll('.booth-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.booth-favorite')) {
                openBoothModal(card.dataset.boothId);
            }
        });
    });

    grid.querySelectorAll('.booth-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const boothId = parseInt(btn.dataset.favorite);
            toggleFavorite(boothId);
            
            const activeTab = document.querySelector('.filter-tabs .tab-btn.active');
            if (activeTab && activeTab.dataset.filter === 'favorites') {
                renderBooths('favorites');
            } else {
                const isFavorite = appState.favoriteBooths.includes(boothId);
                btn.classList.toggle('active', isFavorite);
                const icon = btn.querySelector('i');
                icon.className = `${isFavorite ? 'fas' : 'far'} fa-star`;
            }
            
            renderCollections();
        });
    });
}

function toggleFavorite(boothId) {
    const index = appState.favoriteBooths.indexOf(boothId);
    if (index > -1) {
        appState.favoriteBooths.splice(index, 1);
    } else {
        appState.favoriteBooths.push(boothId);
    }
}

function getRandomColor() {
    const colors = ['#6C5CE7', '#00CEC9', '#FF6B6B', '#FFD93D', '#FD79A8', '#45B7D1', '#96CEB4', '#DDA0DD'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function initBoothFilters() {
    const tabs = document.querySelectorAll('.filter-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderBooths(tab.dataset.filter);
        });
    });
}

function renderCollections() {
    const grid = document.getElementById('collections-grid');
    if (!grid) return;
    
    if (appState.collectedProducts.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: var(--text-secondary); font-size: 14px;">暂无收藏展品</div>';
        return;
    }
    
    grid.innerHTML = appState.collectedProducts.map((item, index) => `
        <div class="collection-item">
            <button class="btn-remove-collection" data-index="${index}" title="取消收藏">
                <i class="fas fa-times"></i>
            </button>
            <div class="collection-icon"><i class="fas ${item.icon}"></i></div>
            <div class="collection-info">
                <div class="collection-name">${item.name}</div>
                <div class="collection-meta">来自：${item.booth}</div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.btn-remove-collection').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            if (confirm('确定要取消收藏这个展品吗？')) {
                appState.collectedProducts.splice(index, 1);
                renderCollections();
            }
        });
    });
}

function renderMaterials() {
    const grid = document.getElementById('materials-grid');
    if (!grid) return;
    
    if (appState.collectedMaterials.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: var(--text-secondary); font-size: 14px;">暂无已领资料</div>';
        return;
    }
    
    grid.innerHTML = appState.collectedMaterials.map((item, index) => `
        <div class="material-item">
            <button class="btn-remove-material" data-index="${index}" title="移除">
                <i class="fas fa-times"></i>
            </button>
            <div class="material-icon"><i class="fas ${item.icon}"></i></div>
            <div class="material-info">
                <div class="material-name">${item.name}</div>
                <div class="material-meta">${item.booth} · ${item.size}</div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.btn-remove-material').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            if (confirm('确定要移除这份资料吗？')) {
                appState.collectedMaterials.splice(index, 1);
                renderMaterials();
            }
        });
    });
}

function initBoothModal() {
    const modal = document.getElementById('booth-modal');
    const closeBtn = document.querySelector('#booth-modal .modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

function openBoothModal(boothId) {
    const modal = document.getElementById('booth-modal');
    const detail = document.getElementById('booth-detail');
    const booth = mockData.booths.find(b => b.id == boothId);
    
    if (!booth || !detail) return;

    const isFavorite = appState.favoriteBooths.includes(parseInt(boothId));
    
    detail.innerHTML = `
        <div class="detail-header">
            <div class="detail-image" style="background: linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()});">
                <i class="fas ${booth.icon}"></i>
            </div>
            <h2>${booth.name}</h2>
            <div class="detail-exhibitor">${booth.exhibitor}</div>
        </div>
        <p class="detail-desc">${booth.desc}</p>
        <div class="detail-stats">
            <div class="detail-stat">
                <span class="detail-stat-num">${booth.visitors}</span>
                <span class="detail-stat-label">访问量</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-num">${booth.likes}</span>
                <span class="detail-stat-label">收藏数</span>
            </div>
            <div class="detail-stat">
                <span class="detail-stat-num">${booth.products.length}</span>
                <span class="detail-stat-label">展品数</span>
            </div>
        </div>
        <div class="detail-actions">
            <button class="detail-btn primary" id="btn-enter-booth" data-booth-id="${booth.id}">
                <i class="fas fa-door-open"></i> 进入展位
            </button>
            <button class="detail-btn secondary ${isFavorite ? 'favorited' : ''}" id="btn-favorite-booth" data-booth-id="${booth.id}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i> ${isFavorite ? '已收藏' : '收藏展位'}
            </button>
        </div>
        <div class="products-list">
            <h3><i class="fas fa-box-open"></i> 展品列表</h3>
            ${booth.products.map((p, idx) => {
                const productId = `${booth.id}-${idx}`;
                const isCollected = appState.collectedProducts.some(cp => cp.id === `p-${productId}`);
                return `
                <div class="product-item">
                    <div class="product-icon"><i class="fas ${p.icon}"></i></div>
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-desc">${p.desc}</div>
                        <button class="product-btn btn-collect-product-in-modal ${isCollected ? 'collected' : ''}" 
                                data-booth-id="${booth.id}" 
                                data-product-idx="${idx}"
                                data-product-name="${p.name}"
                                data-product-icon="${p.icon}"
                                data-booth-name="${booth.name}">
                            <i class="${isCollected ? 'fas' : 'far'} fa-star"></i> ${isCollected ? '已收藏' : '收藏展品'}
                        </button>
                    </div>
                </div>
            `}).join('')}
        </div>
    `;

    document.getElementById('btn-enter-booth').addEventListener('click', () => {
        modal.classList.remove('active');
        openBoothInside(booth.id);
    });

    document.getElementById('btn-favorite-booth').addEventListener('click', () => {
        const id = parseInt(booth.id);
        toggleFavorite(id);
        const isFav = appState.favoriteBooths.includes(id);
        const btn = document.getElementById('btn-favorite-booth');
        btn.querySelector('i').className = `${isFav ? 'fas' : 'far'} fa-star`;
        btn.lastChild.textContent = isFav ? ' 已收藏' : ' 收藏展位';
        btn.classList.toggle('favorited', isFav);
        renderBooths(document.querySelector('.filter-tabs .tab-btn.active').dataset.filter);
    });

    document.querySelectorAll('.btn-collect-product-in-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const boothId = parseInt(btn.dataset.boothId);
            const productIdx = parseInt(btn.dataset.productIdx);
            const productName = btn.dataset.productName;
            const productIcon = btn.dataset.productIcon;
            const boothName = btn.dataset.boothName;
            const productId = `p-${boothId}-${productIdx}`;
            
            const existingIndex = appState.collectedProducts.findIndex(p => p.id === productId);
            
            if (existingIndex > -1) {
                appState.collectedProducts.splice(existingIndex, 1);
                btn.classList.remove('collected');
                btn.querySelector('i').className = 'far fa-star';
                btn.lastChild.textContent = ' 收藏展品';
            } else {
                appState.collectedProducts.push({
                    id: productId,
                    name: productName,
                    booth: boothName,
                    boothId: boothId,
                    icon: productIcon
                });
                btn.classList.add('collected');
                btn.querySelector('i').className = 'fas fa-star';
                btn.lastChild.textContent = ' 已收藏';
            }
            
            renderCollections();
        });
    });
    
    modal.classList.add('active');
}

function openBoothInside(boothId) {
    const modal = document.getElementById('booth-inside-modal');
    const content = document.getElementById('booth-inside-content');
    const booth = mockData.booths.find(b => b.id == boothId);
    
    if (!booth || !content) return;

    const materials = [
        { name: '产品白皮书.pdf', icon: 'fa-file-pdf', size: '2.3MB' },
        { name: '品牌介绍.pptx', icon: 'fa-file-powerpoint', size: '8.5MB' },
        { name: '产品说明书.docx', icon: 'fa-file-word', size: '1.8MB' },
    ];

    content.innerHTML = `
        <div class="booth-inside-header">
            <h2>${booth.name}</h2>
            <div class="booth-exhibitor-name">${booth.exhibitor}</div>
        </div>
        <div class="booth-inside-tabs">
            <button class="booth-inside-tab active" data-tab="products">
                <i class="fas fa-box-open"></i> 展品
            </button>
            <button class="booth-inside-tab" data-tab="materials">
                <i class="fas fa-file-download"></i> 资料
            </button>
            <button class="booth-inside-tab" data-tab="interact">
                <i class="fas fa-comments"></i> 互动
            </button>
        </div>

        <div class="booth-inside-tab-content active" id="tab-products">
            <div class="booth-products-list">
                ${booth.products.map((p, idx) => {
                    const productId = `p-${booth.id}-${idx}`;
                    const isCollected = appState.collectedProducts.some(cp => cp.id === productId);
                    return `
                    <div class="booth-product-card">
                        <div class="booth-product-icon"><i class="fas ${p.icon}"></i></div>
                        <div class="booth-product-name">${p.name}</div>
                        <div class="booth-product-desc">${p.desc}</div>
                        <div class="booth-product-actions">
                            <button class="btn-collect-product inside-btn ${isCollected ? 'collected' : ''}"
                                    data-product-id="${productId}"
                                    data-product-name="${p.name}"
                                    data-product-icon="${p.icon}"
                                    data-booth-name="${booth.name}"
                                    data-booth-id="${booth.id}">
                                <i class="${isCollected ? 'fas' : 'far'} fa-star"></i> ${isCollected ? '已收藏' : '收藏'}
                            </button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="booth-inside-tab-content" id="tab-materials">
            <div class="booth-materials-list">
                ${materials.map((m, idx) => {
                    const materialId = `m-${booth.id}-${idx}`;
                    const isCollected = appState.collectedMaterials.some(cm => cm.id === materialId);
                    return `
                    <div class="booth-material-item">
                        <div class="booth-material-icon"><i class="fas ${m.icon}"></i></div>
                        <div class="booth-material-info">
                            <div class="booth-material-name">${m.name}</div>
                            <div class="booth-material-meta">${booth.name} · ${m.size}</div>
                        </div>
                        <button class="btn-download-material ${isCollected ? 'downloaded' : ''}"
                                data-material-id="${materialId}"
                                data-material-name="${m.name}"
                                data-material-icon="${m.icon}"
                                data-material-size="${m.size}"
                                data-booth-name="${booth.name}">
                            <i class="fas ${isCollected ? 'fa-check' : 'fa-download'}"></i>
                            ${isCollected ? '已领取' : '领取资料'}
                        </button>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="booth-inside-tab-content" id="tab-interact">
            <div style="text-align: center; padding: 40px 0;">
                <div style="font-size: 48px; color: var(--text-secondary); margin-bottom: 20px; opacity: 0.5;">
                    <i class="fas fa-users"></i>
                </div>
                <h3 style="color: var(--text-primary); margin-bottom: 10px;">展位互动</h3>
                <p style="color: var(--text-secondary); margin-bottom: 25px;">与展商实时交流，获取更多产品信息</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="detail-btn primary"><i class="fas fa-comments"></i> 在线咨询</button>
                    <button class="detail-btn secondary"><i class="fas fa-calendar-plus"></i> 预约演示</button>
                    <button class="detail-btn secondary"><i class="fas fa-video"></i> 视频介绍</button>
                </div>
            </div>
        </div>
    `;

    content.querySelectorAll('.booth-inside-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            content.querySelectorAll('.booth-inside-tab').forEach(t => t.classList.remove('active'));
            content.querySelectorAll('.booth-inside-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    content.querySelectorAll('.btn-collect-product.inside-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            const existingIndex = appState.collectedProducts.findIndex(p => p.id === productId);
            
            if (existingIndex > -1) {
                appState.collectedProducts.splice(existingIndex, 1);
                btn.classList.remove('collected');
                btn.querySelector('i').className = 'far fa-star';
                btn.lastChild.textContent = ' 收藏';
            } else {
                appState.collectedProducts.push({
                    id: productId,
                    name: btn.dataset.productName,
                    booth: btn.dataset.boothName,
                    boothId: parseInt(btn.dataset.boothId),
                    icon: btn.dataset.productIcon
                });
                btn.classList.add('collected');
                btn.querySelector('i').className = 'fas fa-star';
                btn.lastChild.textContent = ' 已收藏';
            }
            
            renderCollections();
        });
    });

    content.querySelectorAll('.btn-download-material').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('downloaded')) return;
            
            const materialId = btn.dataset.materialId;
            const existing = appState.collectedMaterials.find(m => m.id === materialId);
            
            if (!existing) {
                appState.collectedMaterials.push({
                    id: materialId,
                    name: btn.dataset.materialName,
                    booth: btn.dataset.boothName,
                    size: btn.dataset.materialSize,
                    icon: btn.dataset.materialIcon
                });
                
                btn.classList.add('downloaded');
                btn.querySelector('i').className = 'fas fa-check';
                btn.lastChild.textContent = ' 已领取';
                
                renderMaterials();
            }
        });
    });

    modal.classList.add('active');
}

function initModals() {
    const boothInsideModal = document.getElementById('booth-inside-modal');
    const boothInsideClose = document.querySelector('.booth-inside-close');
    const liveModal = document.getElementById('live-modal');
    const liveClose = document.querySelector('.live-close');

    if (boothInsideClose && boothInsideModal) {
        boothInsideClose.addEventListener('click', () => {
            boothInsideModal.classList.remove('active');
        });
        boothInsideModal.addEventListener('click', (e) => {
            if (e.target === boothInsideModal) {
                boothInsideModal.classList.remove('active');
            }
        });
    }

    if (liveClose && liveModal) {
        liveClose.addEventListener('click', () => {
            liveModal.classList.remove('active');
        });
        liveModal.addEventListener('click', (e) => {
            if (e.target === liveModal) {
                liveModal.classList.remove('active');
            }
        });
    }

    const liveSendBtn = document.getElementById('live-send-btn');
    const liveChatInput = document.getElementById('live-chat-input');
    
    if (liveSendBtn && liveChatInput) {
        const sendLiveMsg = () => {
            const text = liveChatInput.value.trim();
            if (!text) return;
            
            const chatMsgs = document.getElementById('live-chat-messages');
            const msg = document.createElement('div');
            msg.className = 'live-msg';
            msg.innerHTML = '<span class="live-msg-user">我:</span> ' + text;
            chatMsgs.appendChild(msg);
            chatMsgs.scrollTop = chatMsgs.scrollHeight;
            liveChatInput.value = '';
        };
        
        liveSendBtn.addEventListener('click', sendLiveMsg);
        liveChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendLiveMsg();
        });
    }
}

function initAvatar() {
    renderCustomizeItems('hairstyle');
    renderPresetAvatars();
    initCustomizeTabs();
    initColorPalette();
    initSaveAvatar();
    updateAvatarPreview();
}

function renderCustomizeItems(category) {
    const container = document.getElementById('customize-items');
    if (!container) return;
    
    const items = mockData.customizeItems[category];
    const current = appState.avatarConfig;
    
    let currentId;
    if (category === 'hairstyle') currentId = current.hairstyle;
    else if (category === 'outfit') currentId = current.outfit;
    else if (category === 'accessory') currentId = current.accessory;
    else if (category === 'skin') currentId = current.skin;
    
    if (category === 'skin') {
        container.innerHTML = items.map(item => `
            <div class="customize-item ${item.id === currentId ? 'active' : ''}" data-item-id="${item.id}" 
                 data-item-color="${item.color}" style="background: ${item.color};">
            </div>
        `).join('');
    } else {
        container.innerHTML = items.map(item => `
            <div class="customize-item ${item.id === currentId ? 'active' : ''}" data-item-id="${item.id}" 
                 data-category="${category}" title="${item.name}">
                <i class="fas ${item.icon}"></i>
            </div>
        `).join('');
    }
    
    container.querySelectorAll('.customize-item').forEach(item => {
        item.addEventListener('click', () => {
            container.querySelectorAll('.customize-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const itemId = item.dataset.itemId;
            const itemColor = item.dataset.itemColor;
            
            if (category === 'hairstyle') {
                appState.avatarConfig.hairstyle = itemId;
            } else if (category === 'outfit') {
                appState.avatarConfig.outfit = itemId;
            } else if (category === 'accessory') {
                appState.avatarConfig.accessory = itemId;
            } else if (category === 'skin') {
                appState.avatarConfig.skin = itemId;
                appState.avatarConfig.skinColor = itemColor;
            }
            
            updateAvatarPreview();
        });
    });
}

function initCustomizeTabs() {
    const tabs = document.querySelectorAll('.cust-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderCustomizeItems(tab.dataset.category);
        });
    });
}

function initColorPalette() {
    const colors = document.querySelectorAll('.color-option');
    colors.forEach(color => {
        color.addEventListener('click', () => {
            colors.forEach(c => c.classList.remove('active'));
            color.classList.add('active');
            appState.avatarConfig.outfitColor = color.dataset.color;
            updateAvatarPreview();
        });
    });
}

function updateAvatarPreview() {
    const config = appState.avatarConfig;
    const head = document.querySelector('.avatar-head');
    const torso = document.querySelector('.avatar-torso');
    const arms = document.querySelector('.avatar-arms');
    const legs = document.querySelector('.avatar-legs');
    const accessoryEl = document.querySelector('.avatar-accessory');
    const previewContainer = document.getElementById('avatar-preview');

    if (head) {
        head.style.background = config.skinColor;
    }
    if (torso) {
        torso.style.background = config.outfitColor;
    }
    if (arms) {
        arms.style.setProperty('--arm-color', config.outfitColor);
    }
    if (legs) {
        legs.style.background = config.outfitColor;
        legs.style.filter = 'brightness(0.8)';
    }

    if (!accessoryEl && previewContainer) {
        const acc = document.createElement('div');
        acc.className = 'avatar-accessory';
        acc.style.cssText = `
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 28px;
            color: var(--primary-color);
            z-index: 10;
            pointer-events: none;
        `;
        previewContainer.appendChild(acc);
    }

    const accEl = document.querySelector('.avatar-accessory');
    if (accEl) {
        if (config.accessory) {
            const accItem = mockData.customizeItems.accessory.find(a => a.id === config.accessory);
            if (accItem) {
                accEl.innerHTML = `<i class="fas ${accItem.icon}"></i>`;
                accEl.style.display = 'block';
            }
        } else {
            accEl.style.display = 'none';
        }
    }

    const hairEl = document.querySelector('.avatar-hair');
    if (!hairEl && head) {
        const hair = document.createElement('div');
        hair.className = 'avatar-hair';
        hair.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 35px;
            border-radius: 35px 35px 0 0;
            background: #2D3436;
            z-index: 5;
        `;
        head.parentElement.insertBefore(hair, head);
    }
}

function renderPresetAvatars() {
    const grid = document.getElementById('preset-grid');
    if (!grid) return;
    
    grid.innerHTML = mockData.presetAvatars.map(avatar => `
        <div class="preset-card" data-avatar-id="${avatar.id}" data-color="${avatar.color}">
            <div class="preset-avatar-icon" style="background: ${avatar.color};">
                <i class="fas ${avatar.icon}"></i>
            </div>
            <div class="preset-name">${avatar.name}</div>
            <div class="preset-desc">${avatar.desc}</div>
        </div>
    `).join('');
    
    grid.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', () => {
            grid.querySelectorAll('.preset-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const color = card.dataset.color;
            appState.avatarConfig.outfitColor = color;
            
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
            
            updateAvatarPreview();
        });
    });
}

function initSaveAvatar() {
    const btn = document.querySelector('.btn-save-avatar');
    if (btn) {
        btn.addEventListener('click', () => {
            btn.classList.add('saved');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> 保存成功';
            
            setTimeout(() => {
                btn.classList.remove('saved');
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
}

function rotateAvatar(direction) {
    const avatar = document.querySelector('.avatar-body');
    if (avatar) {
        const currentRotation = parseFloat(avatar.dataset.rotation || 0);
        const newRotation = currentRotation + direction * 30;
        avatar.dataset.rotation = newRotation;
        avatar.style.transform = `rotateY(${newRotation}deg)`;
    }
}

function initChat() {
    renderFriends();
    renderTogetherFriends();
    renderVoiceParticipants();
    renderChatMessages();
    initVoiceControls();
    initChatInput();
    initCallControls();
}

function renderFriends() {
    const container = document.getElementById('friends-online');
    if (!container) return;
    
    container.innerHTML = mockData.friends.map(friend => {
        const isTogether = appState.togetherFriendIds.includes(friend.id);
        return `
        <div class="friend-item ${isTogether ? 'together' : ''}" data-friend-id="${friend.id}">
            <div class="friend-avatar ${friend.online ? 'online' : 'offline'}" style="background: ${friend.color};">
                <i class="fas ${friend.avatar}"></i>
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status">${isTogether ? '同游中' : friend.location}</div>
            </div>
            <button class="invite-btn" data-friend-id="${friend.id}" data-friend-name="${friend.name}" style="display:none;">
                <i class="fas fa-phone-alt"></i>
            </button>
        </div>
    `}).join('');

    container.querySelectorAll('.friend-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const btn = item.querySelector('.invite-btn');
            if (btn) btn.style.display = 'flex';
        });
        item.addEventListener('mouseleave', () => {
            const btn = item.querySelector('.invite-btn');
            if (btn) btn.style.display = 'none';
        });
    });

    container.querySelectorAll('.invite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const friendId = parseInt(btn.dataset.friendId);
            const friendName = btn.dataset.friendName;
            inviteToVoice(friendId, friendName);
        });
    });
}

function inviteToVoice(friendId, friendName) {
    if (appState.togetherFriendIds.includes(friendId)) {
        alert(`${friendName} 已经在同游中了`);
        return;
    }
    
    if (confirm(`确定邀请 ${friendName} 一起同游吗？`)) {
        appState.togetherFriendIds.push(friendId);
        
        const friend = mockData.friends.find(f => f.id === friendId);
        if (friend && !mockData.voiceParticipants.find(p => p.id === `f-${friendId}`)) {
            mockData.voiceParticipants.push({
                id: `f-${friendId}`,
                name: friend.name,
                speaking: false,
                muted: false,
                avatar: friend.avatar,
                color: friend.color
            });
        }
        
        renderFriends();
        renderTogetherFriends();
        renderVoiceParticipants();
        updateParticipantCount();
        
        setTimeout(() => {
            alert(`${friendName} 已加入同游！`);
        }, 500);
    }
}

function renderTogetherFriends() {
    const container = document.getElementById('friends-together');
    if (!container) return;
    
    const togetherFriends = mockData.friends.filter(f => appState.togetherFriendIds.includes(f.id));
    
    if (togetherFriends.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px 0; color: var(--text-secondary); font-size: 13px;">暂无同游好友</div>';
        return;
    }
    
    container.innerHTML = togetherFriends.map(friend => `
        <div class="friend-item">
            <div class="friend-avatar online" style="background: ${friend.color};">
                <i class="fas ${friend.avatar}"></i>
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status">与你同游</div>
            </div>
        </div>
    `).join('');
}

function renderVoiceParticipants() {
    const container = document.getElementById('voice-participants');
    if (!container) return;
    
    let participants = mockData.voiceParticipants;
    
    if (!appState.inVoiceChannel) {
        participants = participants.filter(p => !p.isSelf);
    }
    
    container.innerHTML = participants.map(p => `
        <div class="voice-participant">
            <div class="participant-avatar ${p.speaking ? 'speaking' : ''}" style="background: ${p.color};">
                <i class="fas ${p.avatar}"></i>
                <div class="mic-status ${p.muted ? 'muted' : ''}">
                    <i class="fas ${p.muted ? 'fa-microphone-slash' : 'fa-microphone'}"></i>
                </div>
            </div>
            <div class="participant-name">${p.name}</div>
        </div>
    `).join('');
    
    updateParticipantCount();
}

function updateParticipantCount() {
    const countEl = document.getElementById('participant-count');
    if (countEl) {
        const count = appState.inVoiceChannel ? mockData.voiceParticipants.length : mockData.voiceParticipants.filter(p => !p.isSelf).length;
        countEl.textContent = count;
    }
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = mockData.chatMessages.map(msg => `
        <div class="chat-message ${msg.self ? 'self' : ''}">
            <div class="chat-msg-avatar" style="background: ${msg.color};">
                <i class="fas fa-user"></i>
            </div>
            <div>
                <div class="chat-msg-content">${msg.content}</div>
                <div class="chat-msg-time">${msg.time}</div>
            </div>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

function initVoiceControls() {
    const micBtn = document.getElementById('btn-mic');
    const speakerBtn = document.getElementById('btn-speaker');
    
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            micBtn.classList.toggle('active');
            const icon = micBtn.querySelector('i');
            if (micBtn.classList.contains('active')) {
                icon.className = 'fas fa-microphone';
            } else {
                icon.className = 'fas fa-microphone-slash';
            }
            
            const selfParticipant = mockData.voiceParticipants.find(p => p.isSelf);
            if (selfParticipant) {
                selfParticipant.muted = !micBtn.classList.contains('active');
            }
            renderVoiceParticipants();
        });
    }
    
    if (speakerBtn) {
        speakerBtn.addEventListener('click', () => {
            speakerBtn.classList.toggle('active');
            const icon = speakerBtn.querySelector('i');
            if (speakerBtn.classList.contains('active')) {
                icon.className = 'fas fa-volume-up';
            } else {
                icon.className = 'fas fa-volume-mute';
            }
        });
    }
}

function initCallControls() {
    const inviteBtn = document.querySelector('.voice-btn.call');
    const leaveBtn = document.querySelector('.voice-btn.leave');

    if (inviteBtn) {
        inviteBtn.addEventListener('click', () => {
            const onlineFriends = mockData.friends.filter(f => f.online && !appState.togetherFriendIds.includes(f.id));
            if (onlineFriends.length === 0) {
                alert('没有可邀请的在线好友');
                return;
            }
            
            const friendNames = onlineFriends.map(f => f.name).join('、');
            const inviteName = prompt(`请输入要邀请的好友名称：\n可邀请：${friendNames}`);
            
            if (inviteName) {
                const friend = onlineFriends.find(f => f.name === inviteName);
                if (friend) {
                    inviteToVoice(friend.id, friend.name);
                } else {
                    alert('未找到该好友');
                }
            }
        });
    }

    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => {
            if (appState.inVoiceChannel) {
                if (confirm('确定要离开语音频道吗？')) {
                    appState.inVoiceChannel = false;
                    leaveBtn.classList.add('active');
                    leaveBtn.querySelector('span').textContent = '加入频道';
                    leaveBtn.querySelector('i').className = 'fas fa-sign-in-alt';
                    renderVoiceParticipants();
                }
            } else {
                appState.inVoiceChannel = true;
                leaveBtn.classList.remove('active');
                leaveBtn.querySelector('span').textContent = '离开频道';
                leaveBtn.querySelector('i').className = 'fas fa-sign-out-alt';
                renderVoiceParticipants();
            }
        });
    }
}

function initChatInput() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    const sendMessage = () => {
        const text = input.value.trim();
        if (!text) return;
        
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        mockData.chatMessages.push({
            id: Date.now(),
            sender: '你',
            content: text,
            time: time,
            self: true,
            color: '#96CEB4'
        });
        
        input.value = '';
        renderChatMessages();
        
        setTimeout(() => {
            mockData.chatMessages.push({
                id: Date.now() + 1,
                sender: '主持人莉莉',
                content: '收到！欢迎参与讨论~',
                time: time,
                self: false,
                color: '#FD79A8'
            });
            renderChatMessages();
        }, 1000);
    };
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
}

function initEvents() {
    renderEventsTimeline();
    initLottery();
    initLiveStage();
}

function renderEventsTimeline() {
    const container = document.getElementById('events-timeline');
    if (!container) return;
    
    container.innerHTML = mockData.events.map(event => {
        const isRegistered = appState.registeredEvents.includes(event.id);
        return `
        <div class="timeline-item ${event.status}">
            <div class="timeline-time">${event.time}</div>
            <div class="timeline-title">${event.title}</div>
            <div class="timeline-desc">${event.desc}</div>
            <div class="timeline-actions">
                <button class="timeline-btn secondary"><i class="fas fa-info-circle"></i> 详情</button>
                ${event.status === 'live' ? 
                    `<button class="timeline-btn primary btn-join-live" data-event-id="${event.id}" data-event-title="${event.title}">
                        <i class="fas fa-play"></i> 立即参与
                    </button>` : 
                  event.status === 'upcoming' ? 
                    `<button class="timeline-btn primary btn-register-event ${isRegistered ? 'registered' : ''}" 
                            data-event-id="${event.id}" data-event-title="${event.title}">
                        <i class="fas ${isRegistered ? 'fa-check' : 'fa-calendar-plus'}"></i> 
                        ${isRegistered ? '已报名' : '活动报名'}
                    </button>` :
                    '<button class="timeline-btn"><i class="fas fa-redo"></i> 观看回放</button>'}
            </div>
        </div>
    `}).join('');

    container.querySelectorAll('.btn-register-event').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = parseInt(btn.dataset.eventId);
            const eventTitle = btn.dataset.eventTitle;
            
            if (appState.registeredEvents.includes(eventId)) {
                if (confirm('确定要取消报名吗？')) {
                    const idx = appState.registeredEvents.indexOf(eventId);
                    appState.registeredEvents.splice(idx, 1);
                    btn.classList.remove('registered');
                    btn.querySelector('i').className = 'fas fa-calendar-plus';
                    btn.lastChild.textContent = ' 活动报名';
                }
            } else {
                appState.registeredEvents.push(eventId);
                btn.classList.add('registered');
                btn.querySelector('i').className = 'fas fa-check';
                btn.lastChild.textContent = ' 已报名';
                alert(`成功报名「${eventTitle}」！活动开始前会提醒您。`);
            }
        });
    });

    container.querySelectorAll('.btn-join-live').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventTitle = btn.dataset.eventTitle;
            openLiveStream(eventTitle);
        });
    });
}

function initLiveStage() {
    const btn = document.querySelector('.btn-watch-live');
    if (btn) {
        btn.addEventListener('click', () => {
            openLiveStream('2026元宇宙科技峰会开幕式');
        });
    }
}

function openLiveStream(title) {
    const modal = document.getElementById('live-modal');
    const titleEl = document.getElementById('live-title');
    
    if (titleEl) {
        titleEl.textContent = title;
    }
    
    modal.classList.add('active');
    
    let likes = 3256;
    const likeInterval = setInterval(() => {
        likes += Math.floor(Math.random() * 5);
        const likesEl = document.getElementById('live-likes');
        if (likesEl) likesEl.textContent = likes.toLocaleString();
    }, 3000);
    
    let viewers = 12847;
    const viewerInterval = setInterval(() => {
        viewers += Math.floor(Math.random() * 20) - 5;
        const viewersEl = document.getElementById('live-viewers');
        if (viewersEl) viewersEl.textContent = viewers.toLocaleString();
    }, 5000);
    
    const modalEl = document.getElementById('live-modal');
    const closeHandler = () => {
        clearInterval(likeInterval);
        clearInterval(viewerInterval);
        modalEl.removeEventListener('click', outsideHandler);
        document.querySelector('.live-close').removeEventListener('click', closeHandler);
    };
    
    const outsideHandler = (e) => {
        if (e.target === modalEl) {
            closeHandler();
        }
    };
    
    document.querySelector('.live-close').addEventListener('click', closeHandler);
    modalEl.addEventListener('click', outsideHandler);
}

function initLottery() {
    const spinBtn = document.getElementById('spin-btn');
    const wheel = document.getElementById('lottery-wheel');
    let spinning = false;
    let spinCount = 3;
    
    if (spinBtn && wheel) {
        spinBtn.addEventListener('click', () => {
            if (spinning || spinCount <= 0) return;
            
            spinning = true;
            spinCount--;
            
            const randomIndex = Math.floor(Math.random() * 8);
            const targetRotation = randomIndex * 45 + 360 * 5 + 22.5;
            
            wheel.style.transform = `rotate(${targetRotation}deg)`;
            
            setTimeout(() => {
                spinning = false;
                const prize = mockData.prizes[randomIndex];
                alert(`恭喜您获得：${prize.name} - ${prize.item}！`);
                
                const countEl = document.querySelector('.lottery-info p strong');
                if (countEl) {
                    countEl.textContent = spinCount;
                }
                
                if (spinCount <= 0) {
                    spinBtn.disabled = true;
                    spinBtn.textContent = '已用完';
                }
            }, 4000);
        });
    }
}

function initDashboard() {
    renderBoothRanking();
    renderEventRanking();
    initStayTime();
    initOnlineCount();
}

function renderBoothRanking() {
    const container = document.getElementById('booth-ranking');
    if (!container) return;
    
    container.innerHTML = mockData.boothRanking.map(item => `
        <div class="ranking-item">
            <div class="ranking-num ${item.rank <= 3 ? 'top' + item.rank : ''}">${item.rank}</div>
            <div class="ranking-info">
                <div class="ranking-name">${item.name}</div>
                <div class="ranking-meta">${item.meta}</div>
            </div>
            <div class="ranking-value">${item.value}</div>
        </div>
    `).join('');
}

function renderEventRanking() {
    const container = document.getElementById('event-ranking');
    if (!container) return;
    
    container.innerHTML = mockData.eventRanking.map(item => `
        <div class="ranking-item">
            <div class="ranking-num ${item.rank <= 3 ? 'top' + item.rank : ''}">${item.rank}</div>
            <div class="ranking-info">
                <div class="ranking-name">${item.name}</div>
                <div class="ranking-meta">${item.meta}</div>
            </div>
            <div class="ranking-value">${item.value}</div>
        </div>
    `).join('');
}

function initStayTime() {
    let seconds = 45 * 60 + 32;
    const timeEl = document.getElementById('stay-time');
    
    if (!timeEl) return;
    
    setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        timeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function initOnlineCount() {
    const countEl = document.getElementById('online-count');
    if (!countEl) return;
    
    setInterval(() => {
        const base = 2800;
        const variation = Math.floor(Math.random() * 100) - 50;
        countEl.textContent = (base + variation).toLocaleString();
    }, 3000);
}

function initProfile() {
    initProfileTabs();
    renderBlacklist();
    renderCollectedCards();
    initRatingStars();
    initSubmitSurvey();
}

function initProfileTabs() {
    const tabs = document.querySelectorAll('.p-tab');
    const contents = document.querySelectorAll('.p-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.ptab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(`p-${tabId}`).classList.add('active');
        });
    });
}

function renderBlacklist() {
    const grid = document.getElementById('blacklist-grid');
    if (!grid) return;
    
    grid.innerHTML = mockData.blacklist.map(item => `
        <div class="blacklist-item">
            <div class="friend-avatar" style="background: ${item.color};">
                <i class="fas ${item.avatar}"></i>
            </div>
            <div class="blacklist-info">
                <div class="blacklist-name">${item.name}</div>
                <div class="blacklist-reason">原因：${item.reason}</div>
            </div>
            <button class="btn-unblock" data-id="${item.id}">解除</button>
        </div>
    `).join('');
    
    grid.querySelectorAll('.btn-unblock').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('确定要解除该用户的黑名单吗？')) {
                const id = e.target.dataset.id;
                mockData.blacklist = mockData.blacklist.filter(b => b.id != id);
                renderBlacklist();
            }
        });
    });
}

function renderCollectedCards() {
    const grid = document.getElementById('collected-cards');
    if (!grid) return;
    
    grid.innerHTML = mockData.collectedCards.map(card => `
        <div class="collected-card-item">
            <div class="card-avatar" style="background: ${card.color};">
                <i class="fas ${card.avatar}"></i>
            </div>
            <div class="collected-card-info">
                <div class="collected-card-name">${card.name}</div>
                <div class="collected-card-company">${card.company}</div>
            </div>
        </div>
    `).join('');
}

function initRatingStars() {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((s, i) => {
                s.classList.toggle('fas', i <= index);
                s.classList.toggle('far', i > index);
                s.classList.toggle('active', i <= index);
            });
        });
    });
}

function initSubmitSurvey() {
    const btn = document.querySelector('.btn-submit-survey');
    if (btn) {
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> 提交成功';
            btn.style.background = '#27ae60';
            
            setTimeout(() => {
                alert('问卷提交成功！获得100积分奖励！');
            }, 300);
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        });
    }
}
