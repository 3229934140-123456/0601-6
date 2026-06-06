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
                const activeTab = document.querySelector('.cust-tab.active');
                if (activeTab) {
                    renderCustomizeItems(activeTab.dataset.category);
                }
                updateAvatarPreview();
                refreshColorPaletteSelection();
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
    renderFavoriteBooths();
    renderCollections();
    renderMaterials();
    renderRecentVisits();
    initBoothFilters();
    initMaterialFilters();
    initBoothModal();
}

function renderFavoriteBooths() {
    const grid = document.getElementById('favorite-booths-grid');
    if (!grid) return;
    
    const favBooths = mockData.booths.filter(b => appState.favoriteBooths.includes(b.id));
    
    if (favBooths.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 30px 0; color: var(--text-secondary); font-size: 13px;">暂无收藏的展位</div>';
        return;
    }
    
    grid.innerHTML = favBooths.map(booth => `
        <div class="favorite-booth-card" data-booth-id="${booth.id}">
            <button class="btn-remove-fav-booth" data-booth-id="${booth.id}" title="取消收藏">
                <i class="fas fa-times"></i>
            </button>
            <div class="favorite-booth-icon"><i class="fas ${booth.icon}"></i></div>
            <div class="favorite-booth-info">
                <div class="favorite-booth-name">${booth.name}</div>
                <div class="favorite-booth-meta">${booth.exhibitor}</div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.favorite-booth-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-remove-fav-booth')) {
                openBoothModal(card.dataset.boothId);
            }
        });
    });

    grid.querySelectorAll('.btn-remove-fav-booth').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const boothId = parseInt(btn.dataset.boothId);
            if (confirm('确定要取消收藏这个展位吗？')) {
                toggleFavorite(boothId);
            }
        });
    });
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
    refreshAllBoothUI();
}

function refreshAllBoothUI() {
    const activeTab = document.querySelector('.filter-tabs .tab-btn.active');
    if (activeTab) {
        renderBooths(activeTab.dataset.filter);
    }
    renderFavoriteBooths();
    renderAssetsPage();
    updateAllStats();
    renderInterestAnalysis();
    
    const modal = document.getElementById('booth-modal');
    if (modal && modal.classList.contains('active')) {
        const btn = document.getElementById('btn-favorite-booth');
        if (btn) {
            const boothId = parseInt(btn.dataset.boothId);
            const isFav = appState.favoriteBooths.includes(boothId);
            btn.querySelector('i').className = `${isFav ? 'fas' : 'far'} fa-star`;
            btn.lastChild.textContent = isFav ? ' 已收藏' : ' 收藏展位';
            btn.classList.toggle('favorited', isFav);
        }
    }
}

function toggleProductCollection(product) {
    const existingIndex = appState.collectedProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex > -1) {
        appState.collectedProducts.splice(existingIndex, 1);
    } else {
        appState.collectedProducts.push({
            ...product,
            collectedAt: Date.now()
        });
    }
    
    refreshAllProductCollectionUI(product.boothId);
    updateAllStats();
    renderAssetsPage();
    renderInterestAnalysis();
}

function refreshAllProductCollectionUI(boothId) {
    renderCollections();
    
    const boothModal = document.getElementById('booth-modal');
    if (boothModal && boothModal.classList.contains('active')) {
        const btns = boothModal.querySelectorAll('.btn-collect-product-in-modal');
        btns.forEach(btn => {
            const bId = parseInt(btn.dataset.boothId);
            const pIdx = parseInt(btn.dataset.productIdx);
            const productId = `p-${bId}-${pIdx}`;
            const isCollected = appState.collectedProducts.some(p => p.id === productId);
            
            btn.classList.toggle('collected', isCollected);
            btn.querySelector('i').className = `${isCollected ? 'fas' : 'far'} fa-star`;
            btn.lastChild.textContent = isCollected ? ' 已收藏' : ' 收藏展品';
        });
    }
    
    const insideModal = document.getElementById('booth-inside-modal');
    if (insideModal && insideModal.classList.contains('active')) {
        const btns = insideModal.querySelectorAll('.btn-collect-product.inside-btn');
        btns.forEach(btn => {
            const productId = btn.dataset.productId;
            const isCollected = appState.collectedProducts.some(p => p.id === productId);
            
            btn.classList.toggle('collected', isCollected);
            btn.querySelector('i').className = `${isCollected ? 'fas' : 'far'} fa-star`;
            btn.lastChild.textContent = isCollected ? ' 已收藏' : ' 收藏';
        });
    }
}

function toggleMaterialCollection(material) {
    const existingIndex = appState.collectedMaterials.findIndex(m => m.id === material.id);
    
    if (existingIndex > -1) {
        return false;
    } else {
        appState.collectedMaterials.push({
            ...material,
            collectedAt: Date.now()
        });
        refreshAllMaterialCollectionUI();
        updateAllStats();
        renderAssetsPage();
        return true;
    }
}

function removeMaterial(materialId) {
    const existingIndex = appState.collectedMaterials.findIndex(m => m.id === materialId);
    if (existingIndex > -1) {
        appState.collectedMaterials.splice(existingIndex, 1);
        refreshAllMaterialCollectionUI();
        updateAllStats();
        renderAssetsPage();
        return true;
    }
    return false;
}

function refreshAllMaterialCollectionUI() {
    updateMaterialBoothFilter();
    renderMaterials();
    renderAssetsPage();
    updateAllStats();
    renderInterestAnalysis();
    
    const insideModal = document.getElementById('booth-inside-modal');
    if (insideModal && insideModal.classList.contains('active')) {
        const btns = insideModal.querySelectorAll('.btn-download-material');
        btns.forEach(btn => {
            const materialId = btn.dataset.materialId;
            const isCollected = appState.collectedMaterials.some(m => m.id === materialId);
            
            btn.classList.toggle('downloaded', isCollected);
            btn.querySelector('i').className = isCollected ? 'fas fa-check' : 'fas fa-download';
            btn.lastChild.textContent = isCollected ? ' 已领取' : ' 领取资料';
        });
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
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-star"></i>暂无收藏展品</div>';
        return;
    }
    
    grid.innerHTML = appState.collectedProducts.map((item) => `
        <div class="collection-item" data-product-id="${item.id}">
            <button class="btn-remove-collection" data-product-id="${item.id}" title="取消收藏">
                <i class="fas fa-times"></i>
            </button>
            <div class="collection-icon"><i class="fas ${item.icon}"></i></div>
            <div class="collection-info">
                <div class="collection-name">${item.name}</div>
                <div class="collection-meta">来自：${item.booth}</div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-collection')) return;
            const productId = item.dataset.productId;
            openProductDetail(productId);
        });
    });

    grid.querySelectorAll('.btn-remove-collection').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            if (confirm('确定要取消收藏这个展品吗？')) {
                const product = appState.collectedProducts.find(p => p.id === productId);
                if (product) {
                    toggleProductCollection(product);
                }
            }
        });
    });
}

function renderMaterials() {
    const grid = document.getElementById('materials-grid');
    if (!grid) return;
    
    let materials = [...appState.collectedMaterials];
    
    const boothFilter = document.getElementById('material-booth-filter');
    const sortSelect = document.getElementById('material-sort');
    
    if (boothFilter && boothFilter.value !== 'all') {
        const boothId = parseInt(boothFilter.value);
        materials = materials.filter(m => m.boothId === boothId);
    }
    
    if (sortSelect) {
        switch (sortSelect.value) {
            case 'time-desc':
                materials.sort((a, b) => b.collectedAt - a.collectedAt);
                break;
            case 'time-asc':
                materials.sort((a, b) => a.collectedAt - b.collectedAt);
                break;
            case 'name':
                materials.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }
    
    if (materials.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-folder-open"></i>暂无已领资料</div>';
        return;
    }
    
    grid.innerHTML = materials.map((item) => {
        const isSelected = selectedMaterialIds.has(item.id);
        return `
        <div class="material-item material-card selectable ${materialBatchMode ? 'batch-mode' : ''} ${isSelected ? 'selected' : ''}" data-material-id="${item.id}">
            <input type="checkbox" class="material-checkbox" data-material-id="${item.id}" ${isSelected ? 'checked' : ''}>
            <div class="material-icon"><i class="fas ${item.icon}"></i></div>
            <div class="material-info">
                <div class="material-name">${item.name}</div>
                <div class="material-meta">${item.booth} · ${item.size}</div>
                <div class="material-meta" style="margin-top:4px;font-size:11px;opacity:0.7;">
                    领取于 ${formatTimeAgo(item.collectedAt)}
                </div>
            </div>
            <div class="material-card-actions">
                <button class="material-action-btn" data-action="view" data-material-id="${item.id}">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="material-action-btn" data-action="download" data-material-id="${item.id}">
                    <i class="fas fa-download"></i> 下载
                </button>
                <button class="material-action-btn remove" data-action="remove" data-material-id="${item.id}">
                    <i class="fas fa-trash-alt"></i> 移除
                </button>
            </div>
        </div>
    `}).join('');

    grid.querySelectorAll('.material-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const materialId = btn.dataset.materialId;
            
            switch (action) {
                case 'view':
                    openMaterialDetail(materialId);
                    break;
                case 'download':
                    const mat = appState.collectedMaterials.find(m => m.id === materialId);
                    if (mat) {
                        alert(`正在下载: ${mat.name}`);
                    }
                    break;
                case 'remove':
                    if (confirm('确定要移除这份资料吗？移除后可在对应展位重新领取。')) {
                        removeMaterial(materialId);
                    }
                    break;
            }
        });
    });
    
    grid.querySelectorAll('.material-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!materialBatchMode) return;
            if (e.target.closest('.material-action-btn')) return;
            
            const materialId = card.dataset.materialId;
            toggleMaterialSelection(materialId);
            
            const checkbox = card.querySelector('.material-checkbox');
            const isSelected = selectedMaterialIds.has(materialId);
            card.classList.toggle('selected', isSelected);
            if (checkbox) checkbox.checked = isSelected;
        });
    });
    
    grid.querySelectorAll('.material-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            const materialId = checkbox.dataset.materialId;
            toggleMaterialSelection(materialId);
            
            const card = checkbox.closest('.material-card');
            if (card) {
                card.classList.toggle('selected', selectedMaterialIds.has(materialId));
            }
        });
    });
}

function initMaterialFilters() {
    const boothFilter = document.getElementById('material-booth-filter');
    const sortSelect = document.getElementById('material-sort');
    
    if (boothFilter) {
        const booths = [...new Set(appState.collectedMaterials.map(m => m.boothId))];
        booths.forEach(boothId => {
            const booth = mockData.booths.find(b => b.id === boothId);
            if (booth) {
                const option = document.createElement('option');
                option.value = boothId;
                option.textContent = booth.name;
                boothFilter.appendChild(option);
            }
        });
        
        boothFilter.addEventListener('change', () => {
            renderMaterials();
            updateSelectAllCheckbox();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            renderMaterials();
            updateSelectAllCheckbox();
        });
    }
    
    const batchBtn = document.getElementById('btn-material-batch');
    if (batchBtn) {
        batchBtn.addEventListener('click', toggleMaterialBatchMode);
    }
    
    const selectAll = document.getElementById('material-select-all');
    if (selectAll) {
        selectAll.addEventListener('change', toggleSelectAllMaterials);
    }
    
    const batchDownload = document.getElementById('btn-batch-download');
    if (batchDownload) {
        batchDownload.addEventListener('click', batchDownloadMaterials);
    }
    
    const batchRemove = document.getElementById('btn-batch-remove');
    if (batchRemove) {
        batchRemove.addEventListener('click', batchRemoveMaterials);
    }
    
    const batchCancel = document.getElementById('btn-batch-cancel');
    if (batchCancel) {
        batchCancel.addEventListener('click', toggleMaterialBatchMode);
    }
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
                                data-product-desc="${p.desc}"
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
    });

    document.querySelectorAll('.btn-collect-product-in-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const boothId = parseInt(btn.dataset.boothId);
            const productIdx = parseInt(btn.dataset.productIdx);
            const productName = btn.dataset.productName;
            const productIcon = btn.dataset.productIcon;
            const productDesc = btn.dataset.productDesc;
            const boothName = btn.dataset.boothName;
            
            recordProductView(boothId, productIdx);
            
            toggleProductCollection({
                id: `p-${boothId}-${productIdx}`,
                name: productName,
                booth: boothName,
                boothId: boothId,
                icon: productIcon,
                desc: productDesc,
            });
        });
    });
    
    modal.classList.add('active');
}

function openBoothInside(boothId) {
    const modal = document.getElementById('booth-inside-modal');
    const content = document.getElementById('booth-inside-content');
    const booth = mockData.booths.find(b => b.id == boothId);
    
    if (!booth || !content) return;

    startBoothVisit(boothId, booth.name);

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
                                    data-product-desc="${p.desc}"
                                    data-booth-name="${booth.name}"
                                    data-booth-id="${booth.id}"
                                    data-product-idx="${idx}">
                                <i class="${isCollected ? 'fas' : 'far'} fa-star"></i> ${isCollected ? '已收藏' : '收藏'}
                            </button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>

        <div class="booth-inside-tab-content" id="tab-materials">
            <div class="booth-materials-list">
                ${booth.materials.map((m, idx) => {
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
                                data-material-desc="${m.desc}"
                                data-booth-name="${booth.name}"
                                data-booth-id="${booth.id}"
                                data-material-idx="${idx}">
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
            const productName = btn.dataset.productName;
            const productIcon = btn.dataset.productIcon;
            const productDesc = btn.dataset.productDesc;
            const boothName = btn.dataset.boothName;
            const boothId = parseInt(btn.dataset.boothId);
            const productIdx = parseInt(btn.dataset.productIdx);
            
            recordProductView(boothId, productIdx);
            
            toggleProductCollection({
                id: productId,
                name: productName,
                booth: boothName,
                boothId: boothId,
                icon: productIcon,
                desc: productDesc,
            });
        });
    });

    content.querySelectorAll('.btn-download-material').forEach(btn => {
        btn.addEventListener('click', () => {
            const materialId = btn.dataset.materialId;
            const materialName = btn.dataset.materialName;
            const materialIcon = btn.dataset.materialIcon;
            const materialSize = btn.dataset.materialSize;
            const materialDesc = btn.dataset.materialDesc;
            const boothName = btn.dataset.boothName;
            const boothId = parseInt(btn.dataset.boothId);
            const materialIdx = parseInt(btn.dataset.materialIdx);
            
            const isCollected = appState.collectedMaterials.some(m => m.id === materialId);
            
            if (!isCollected) {
                const result = toggleMaterialCollection({
                    id: materialId,
                    name: materialName,
                    booth: boothName,
                    boothId: boothId,
                    size: materialSize,
                    icon: materialIcon,
                    desc: materialDesc,
                });
                if (result) {
                    recordMaterialCollection(boothId, materialIdx);
                }
            }
        });
    });

    modal.classList.add('active');
}

function startBoothVisit(boothId, boothName) {
    endBoothVisit();
    
    const existingIdx = appState.visitRecords.findIndex(r => r.boothId === boothId);
    if (existingIdx === -1) {
        appState.visitRecords.unshift({
            boothId: boothId,
            boothName: boothName,
            lastVisitAt: Date.now(),
            duration: 0,
            viewedProducts: [],
            collectedMaterials: [],
            visitCount: 0,
        });
    }
    
    appState.currentBoothVisit = {
        boothId: boothId,
        boothName: boothName,
        enterTime: Date.now(),
    };
}

function endBoothVisit() {
    if (!appState.currentBoothVisit) return;
    
    const { boothId, boothName, enterTime } = appState.currentBoothVisit;
    const duration = Math.floor((Date.now() - enterTime) / 1000);
    
    if (duration > 0) {
        const existingIdx = appState.visitRecords.findIndex(r => r.boothId === boothId);
        
        if (existingIdx > -1) {
            const record = appState.visitRecords[existingIdx];
            record.lastVisitAt = Date.now();
            record.duration += duration;
            record.visitCount += 1;
            appState.visitRecords.splice(existingIdx, 1);
            appState.visitRecords.unshift(record);
        }
        
        refreshAllVisitRecordUI();
    }
    
    appState.currentBoothVisit = null;
}

function recordProductView(boothId, productIdx) {
    const record = appState.visitRecords.find(r => r.boothId === boothId);
    if (record && !record.viewedProducts.includes(productIdx)) {
        record.viewedProducts.push(productIdx);
    }
}

function recordMaterialCollection(boothId, materialIdx) {
    const record = appState.visitRecords.find(r => r.boothId === boothId);
    if (record && !record.collectedMaterials.includes(materialIdx)) {
        record.collectedMaterials.push(materialIdx);
    }
    refreshAllVisitRecordUI();
}

function refreshAllVisitRecordUI() {
    renderRecentVisits();
    renderAssetsPage();
    updateAllStats();
    renderInterestAnalysis();
}

function renderRecentVisits() {
    const list = document.getElementById('recent-visits-list');
    if (!list) return;
    
    const records = [...appState.visitRecords].sort((a, b) => b.lastVisitAt - a.lastVisitAt);
    
    if (records.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i>暂无参观记录</div>';
        return;
    }
    
    list.innerHTML = records.slice(0, 5).map(record => {
        const timeStr = formatTimeAgo(record.lastVisitAt);
        const durationStr = formatDuration(record.duration);
        return `
            <div class="recent-visit-item" data-booth-id="${record.boothId}">
                <div class="recent-visit-icon"><i class="fas fa-store"></i></div>
                <div class="recent-visit-info">
                    <div class="recent-visit-name">${record.boothName}</div>
                    <div class="recent-visit-meta">
                        <span><i class="fas fa-clock"></i> ${timeStr}</span>
                        <span><i class="fas fa-hourglass-half"></i> 停留${durationStr}</span>
                        <span><i class="fas fa-box"></i> 看了${record.viewedProducts.length}件展品</span>
                        <span><i class="fas fa-file"></i> 领了${record.collectedMaterials.length}份资料</span>
                    </div>
                </div>
                <div class="recent-visit-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
        `;
    }).join('');
    
    list.querySelectorAll('.recent-visit-item').forEach(item => {
        item.addEventListener('click', () => {
            const boothId = parseInt(item.dataset.boothId);
            openVisitDetail(boothId);
        });
    });
}

function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
}

function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes < 60) return `${minutes}分${secs}秒`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分`;
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function initModals() {
    const boothInsideModal = document.getElementById('booth-inside-modal');
    const boothInsideClose = document.querySelector('.booth-inside-close');
    const liveModal = document.getElementById('live-modal');
    const liveClose = document.querySelector('.live-close');

    if (boothInsideClose && boothInsideModal) {
        boothInsideClose.addEventListener('click', () => {
            boothInsideModal.classList.remove('active');
            endBoothVisit();
        });
        boothInsideModal.addEventListener('click', (e) => {
            if (e.target === boothInsideModal) {
                boothInsideModal.classList.remove('active');
                endBoothVisit();
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

    const productDetailModal = document.getElementById('product-detail-modal');
    const productDetailClose = document.querySelector('.product-detail-close');
    
    if (productDetailClose && productDetailModal) {
        productDetailClose.addEventListener('click', () => {
            productDetailModal.classList.remove('active');
        });
        productDetailModal.addEventListener('click', (e) => {
            if (e.target === productDetailModal) {
                productDetailModal.classList.remove('active');
            }
        });
    }

    const materialDetailModal = document.getElementById('material-detail-modal');
    const materialDetailClose = document.querySelector('.material-detail-close');
    
    if (materialDetailClose && materialDetailModal) {
        materialDetailClose.addEventListener('click', () => {
            materialDetailModal.classList.remove('active');
        });
        materialDetailModal.addEventListener('click', (e) => {
            if (e.target === materialDetailModal) {
                materialDetailModal.classList.remove('active');
            }
        });
    }

    const visitDetailModal = document.getElementById('visit-detail-modal');
    const visitDetailClose = document.querySelector('.visit-detail-close');
    
    if (visitDetailClose && visitDetailModal) {
        visitDetailClose.addEventListener('click', () => {
            visitDetailModal.classList.remove('active');
        });
        visitDetailModal.addEventListener('click', (e) => {
            if (e.target === visitDetailModal) {
                visitDetailModal.classList.remove('active');
            }
        });
    }

    const assetExportModal = document.getElementById('asset-export-modal');
    const assetExportClose = document.querySelector('.asset-export-close');
    
    if (assetExportClose && assetExportModal) {
        assetExportClose.addEventListener('click', () => {
            assetExportModal.classList.remove('active');
        });
        assetExportModal.addEventListener('click', (e) => {
            if (e.target === assetExportModal) {
                assetExportModal.classList.remove('active');
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
    refreshColorPaletteSelection();
}

function refreshColorPaletteSelection() {
    const colors = document.querySelectorAll('.color-option');
    colors.forEach(color => {
        color.classList.toggle('active', color.dataset.color === appState.avatarConfig.outfitColor);
    });
}

function updateAvatarPreview() {
    const config = appState.avatarConfig;
    const head = document.querySelector('.avatar-head');
    const torso = document.querySelector('.avatar-torso');
    const arms = document.querySelector('.avatar-arms');
    const legs = document.querySelector('.avatar-legs');
    const previewContainer = document.getElementById('avatar-preview');
    const avatarBody = document.querySelector('.avatar-body');

    if (!avatarBody) return;

    if (head) {
        head.style.background = config.skinColor;
    }

    if (torso) {
        torso.style.background = config.outfitColor;
        torso.className = 'avatar-torso';
        const outfitNum = config.outfit.replace('o', '');
        if (outfitNum !== '1') {
            torso.classList.add(`style-${outfitNum}`);
        }
    }

    if (arms) {
        arms.style.setProperty('--arm-color', config.outfitColor);
    }

    if (legs) {
        legs.style.background = config.outfitColor;
        legs.style.filter = 'brightness(0.85)';
    }

    let hairEl = avatarBody.querySelector('.avatar-hair');
    if (!hairEl) {
        hairEl = document.createElement('div');
        hairEl.className = 'avatar-hair';
        avatarBody.insertBefore(hairEl, head || avatarBody.firstChild);
    }
    
    hairEl.style.background = config.hairColor || '#2D3436';
    hairEl.className = 'avatar-hair';
    const hairNum = config.hairstyle.replace('h', '');
    if (hairNum !== '1') {
        hairEl.classList.add(`style-${hairNum}`);
    }

    let accEl = avatarBody.querySelector('.avatar-accessory');
    if (!accEl) {
        accEl = document.createElement('div');
        accEl.className = 'avatar-accessory';
        avatarBody.appendChild(accEl);
    }

    if (config.accessory) {
        const accItem = mockData.customizeItems.accessory.find(a => a.id === config.accessory);
        if (accItem) {
            accEl.innerHTML = `<i class="fas ${accItem.icon}"></i>`;
            accEl.classList.add('show');
        }
    } else {
        accEl.classList.remove('show');
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
    updateAllStats();
    renderInterestAnalysis();
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
    renderAssetsPage();
    initRatingStars();
    initSubmitSurvey();
    initExportButton();
}

function initExportButton() {
    const exportBtn = document.getElementById('btn-export-assets');
    if (exportBtn) {
        exportBtn.addEventListener('click', openExportModal);
    }
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

function openProductDetail(productId) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-detail-content');
    const product = appState.collectedProducts.find(p => p.id === productId);
    
    if (!product || !content) return;
    
    const isCollected = appState.collectedProducts.some(p => p.id === productId);
    const collectTime = product.collectedAt ? formatTimeAgo(product.collectedAt) : '未知';
    
    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon-large"><i class="fas ${product.icon}"></i></div>
            <div class="detail-main-info">
                <h2>${product.name}</h2>
                <div class="detail-booth"><i class="fas fa-store"></i> 来源：${product.booth}</div>
                <div class="detail-time"><i class="far fa-clock"></i> 收藏于 ${collectTime}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-info-circle"></i> 展品说明</h3>
            <div class="detail-desc">${product.desc || '暂无详细描述'}</div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-chart-bar"></i> 展品信息</h3>
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="detail-stat-value">${isCollected ? '已收藏' : '未收藏'}</span>
                    <span class="detail-stat-label">收藏状态</span>
                </div>
                <div class="detail-stat">
                    <span class="detail-stat-value">${product.boothId || '-'}</span>
                    <span class="detail-stat-label">展位编号</span>
                </div>
                <div class="detail-stat">
                    <span class="detail-stat-value">${collectTime}</span>
                    <span class="detail-stat-label">收藏时长</span>
                </div>
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="detail-btn primary" id="btn-go-booth-from-product">
                <i class="fas fa-door-open"></i> 进入来源展位
            </button>
            <button class="detail-btn secondary ${isCollected ? 'favorited' : ''}" id="btn-toggle-product-fav">
                <i class="${isCollected ? 'fas' : 'far'} fa-star"></i> ${isCollected ? '取消收藏' : '收藏展品'}
            </button>
        </div>
    `;
    
    const goBoothBtn = document.getElementById('btn-go-booth-from-product');
    if (goBoothBtn) {
        goBoothBtn.addEventListener('click', () => {
            closeAllModals();
            if (product.boothId) {
                openBoothInside(product.boothId);
            }
        });
    }
    
    const toggleBtn = document.getElementById('btn-toggle-product-fav');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const wasCollected = appState.collectedProducts.some(p => p.id === productId);
            toggleProductCollection(product);
            
            if (wasCollected) {
                modal.classList.remove('active');
            } else {
                openProductDetail(productId);
            }
        });
    }
    
    modal.classList.add('active');
}

function openMaterialDetail(materialId) {
    const modal = document.getElementById('material-detail-modal');
    const content = document.getElementById('material-detail-content');
    const material = appState.collectedMaterials.find(m => m.id === materialId);
    
    if (!material || !content) return;
    
    const collectTime = material.collectedAt ? formatTimeAgo(material.collectedAt) : '未知';
    
    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon-large"><i class="fas ${material.icon}"></i></div>
            <div class="detail-main-info">
                <h2>${material.name}</h2>
                <div class="detail-booth"><i class="fas fa-store"></i> 来源：${material.booth}</div>
                <div class="detail-time"><i class="far fa-clock"></i> 领取于 ${collectTime}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-info-circle"></i> 资料说明</h3>
            <div class="detail-desc">${material.desc || '暂无详细描述'}</div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-file"></i> 文件信息</h3>
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="detail-stat-value">${material.size || '-'}</span>
                    <span class="detail-stat-label">文件大小</span>
                </div>
                <div class="detail-stat">
                    <span class="detail-stat-value">已领取</span>
                    <span class="detail-stat-label">领取状态</span>
                </div>
                <div class="detail-stat">
                    <span class="detail-stat-value">${collectTime}</span>
                    <span class="detail-stat-label">领取时长</span>
                </div>
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="detail-btn primary" id="btn-download-material-detail">
                <i class="fas fa-download"></i> 重新下载
            </button>
            <button class="detail-btn secondary" id="btn-go-booth-from-material">
                <i class="fas fa-store"></i> 进入来源展位
            </button>
            <button class="detail-btn danger" id="btn-remove-material-detail">
                <i class="fas fa-trash-alt"></i> 移除资料
            </button>
        </div>
    `;
    
    const downloadBtn = document.getElementById('btn-download-material-detail');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert(`正在下载: ${material.name}`);
        });
    }
    
    const goBoothBtn = document.getElementById('btn-go-booth-from-material');
    if (goBoothBtn) {
        goBoothBtn.addEventListener('click', () => {
            closeAllModals();
            if (material.boothId) {
                openBoothInside(material.boothId);
            }
        });
    }
    
    const removeBtn = document.getElementById('btn-remove-material-detail');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (confirm('确定要移除这份资料吗？移除后可在对应展位重新领取。')) {
                removeMaterial(materialId);
                modal.classList.remove('active');
            }
        });
    }
    
    modal.classList.add('active');
}

function updateAllStats() {
    const favBoothCount = appState.favoriteBooths.length;
    const favProductCount = appState.collectedProducts.length;
    const materialCount = appState.collectedMaterials.length;
    const visitCount = appState.visitRecords.length;
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayVisitCount = appState.visitRecords.filter(r => r.lastVisitAt >= todayStart.getTime()).length;
    
    const statFavBooths = document.getElementById('stat-fav-booths');
    if (statFavBooths) statFavBooths.textContent = favBoothCount;
    
    const statFavProducts = document.getElementById('stat-fav-products');
    if (statFavProducts) statFavProducts.textContent = favProductCount;
    
    const statMaterials = document.getElementById('stat-collected-materials');
    if (statMaterials) statMaterials.textContent = materialCount;
    
    const statVisited = document.getElementById('stat-visited-booths');
    if (statVisited) statVisited.textContent = visitCount;
    
    const myBoothFavCount = document.getElementById('my-booth-fav-count');
    if (myBoothFavCount) myBoothFavCount.textContent = favBoothCount;
    
    const myProductFavCount = document.getElementById('my-product-fav-count');
    if (myProductFavCount) myProductFavCount.textContent = favProductCount;
    
    const myMaterialCount = document.getElementById('my-material-count');
    if (myMaterialCount) myMaterialCount.textContent = materialCount;
    
    const myTodayVisitCount = document.getElementById('my-today-visit-count');
    if (myTodayVisitCount) myTodayVisitCount.textContent = todayVisitCount || visitCount;
}

function renderAssetsPage() {
    renderAssetBooths();
    renderAssetProducts();
    renderAssetMaterials();
    renderAssetVisits();
    updateAllStats();
}

function renderAssetBooths() {
    const list = document.getElementById('assets-booths-list');
    if (!list) return;
    
    const favBooths = mockData.booths.filter(b => appState.favoriteBooths.includes(b.id));
    
    if (favBooths.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-store"></i>暂无收藏展位</div>';
        return;
    }
    
    list.innerHTML = favBooths.slice(0, 6).map(booth => `
        <div class="asset-mini-card" data-booth-id="${booth.id}">
            <div class="asset-mini-icon"><i class="fas ${booth.icon}"></i></div>
            <div class="asset-mini-name">${booth.name}</div>
        </div>
    `).join('');
    
    list.querySelectorAll('.asset-mini-card').forEach(card => {
        card.addEventListener('click', () => {
            const boothId = parseInt(card.dataset.boothId);
            switchPage('booths');
            closeAllModals();
            openBoothInside(boothId);
        });
    });
}

function renderAssetProducts() {
    const list = document.getElementById('assets-products-list');
    if (!list) return;
    
    const products = appState.collectedProducts;
    
    if (products.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-star"></i>暂无收藏展品</div>';
        return;
    }
    
    list.innerHTML = products.slice(0, 6).map(product => `
        <div class="asset-mini-card" data-product-id="${product.id}">
            <div class="asset-mini-icon"><i class="fas ${product.icon}"></i></div>
            <div class="asset-mini-name">${product.name}</div>
        </div>
    `).join('');
    
    list.querySelectorAll('.asset-mini-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            openProductDetail(productId);
        });
    });
}

function renderAssetMaterials() {
    const list = document.getElementById('assets-materials-list');
    if (!list) return;
    
    const materials = appState.collectedMaterials;
    
    if (materials.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-file"></i>暂无已领资料</div>';
        return;
    }
    
    list.innerHTML = materials.slice(0, 5).map(material => `
        <div class="asset-mini-item" data-material-id="${material.id}">
            <div class="asset-mini-item-icon"><i class="fas ${material.icon}"></i></div>
            <div class="asset-mini-item-info">
                <div class="asset-mini-item-name">${material.name}</div>
                <div class="asset-mini-item-sub">${material.booth} · ${material.size}</div>
            </div>
        </div>
    `).join('');
    
    list.querySelectorAll('.asset-mini-item').forEach(item => {
        item.addEventListener('click', () => {
            const materialId = item.dataset.materialId;
            openMaterialDetail(materialId);
        });
    });
}

function renderAssetVisits() {
    const list = document.getElementById('assets-visits-list');
    if (!list) return;
    
    const records = [...appState.visitRecords].sort((a, b) => b.lastVisitAt - a.lastVisitAt);
    
    if (records.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i>暂无参观记录</div>';
        return;
    }
    
    list.innerHTML = records.slice(0, 5).map(record => `
        <div class="asset-mini-item" data-booth-id="${record.boothId}">
            <div class="asset-mini-item-icon"><i class="fas fa-store"></i></div>
            <div class="asset-mini-item-info">
                <div class="asset-mini-item-name">${record.boothName}</div>
                <div class="asset-mini-item-sub">${formatTimeAgo(record.lastVisitAt)} · 停留${formatDuration(record.duration)}</div>
            </div>
        </div>
    `).join('');
    
    list.querySelectorAll('.asset-mini-item').forEach(item => {
        item.addEventListener('click', () => {
            const boothId = parseInt(item.dataset.boothId);
            switchPage('booths');
            closeAllModals();
            openBoothInside(boothId);
        });
    });
}

function switchPage(pageId) {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(nav => nav.classList.remove('active'));
    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add('active');
    
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.classList.add('active');
    
    if (pageId === 'avatar') {
        updateAvatarPreview();
    }
}

function updateMaterialBoothFilter() {
    const boothFilter = document.getElementById('material-booth-filter');
    if (!boothFilter) return;
    
    const currentValue = boothFilter.value;
    const booths = [...new Set(appState.collectedMaterials.map(m => m.boothId))];
    
    boothFilter.innerHTML = '<option value="all">全部展位</option>';
    
    booths.forEach(boothId => {
        const booth = mockData.booths.find(b => b.id === boothId);
        if (booth) {
            const option = document.createElement('option');
            option.value = boothId;
            option.textContent = booth.name;
            boothFilter.appendChild(option);
        }
    });
    
    boothFilter.value = currentValue || 'all';
}

function openVisitDetail(boothId) {
    const modal = document.getElementById('visit-detail-modal');
    const content = document.getElementById('visit-detail-content');
    const record = appState.visitRecords.find(r => r.boothId === boothId);
    const booth = mockData.booths.find(b => b.id === boothId);
    
    if (!record || !booth || !content) return;
    
    const lastVisitStr = formatTimeAgo(record.lastVisitAt);
    const durationStr = formatDuration(record.duration);
    
    let viewedProductsHtml = '';
    if (record.viewedProducts.length > 0) {
        viewedProductsHtml = record.viewedProducts.map(pIdx => {
            const product = booth.products[pIdx];
            if (!product) return '';
            return `
                <div class="visit-product-item" data-product-idx="${pIdx}">
                    <div class="visit-product-icon"><i class="fas ${product.icon}"></i></div>
                    <div class="visit-product-name">${product.name}</div>
                </div>
            `;
        }).join('');
    } else {
        viewedProductsHtml = '<div class="visit-detail-empty">暂无浏览记录</div>';
    }
    
    let collectedMaterialsHtml = '';
    if (record.collectedMaterials.length > 0) {
        collectedMaterialsHtml = record.collectedMaterials.map(mIdx => {
            const material = booth.materials[mIdx];
            if (!material) return '';
            return `
                <div class="visit-material-item" data-material-idx="${mIdx}">
                    <div class="visit-material-icon"><i class="fas ${material.icon}"></i></div>
                    <div class="visit-material-name">${material.name}</div>
                </div>
            `;
        }).join('');
    } else {
        collectedMaterialsHtml = '<div class="visit-detail-empty">暂无资料领取记录</div>';
    }
    
    const timelineEvents = [];
    timelineEvents.push({
        time: record.lastVisitAt - record.duration * 1000,
        text: '进入展位'
    });
    record.viewedProducts.forEach((pIdx, i) => {
        const offset = Math.floor((record.duration / (record.viewedProducts.length + 1)) * (i + 1) * 1000);
        const product = booth.products[pIdx];
        if (product) {
            timelineEvents.push({
                time: record.lastVisitAt - record.duration * 1000 + offset,
                text: `浏览展品：${product.name}`
            });
        }
    });
    record.collectedMaterials.forEach((mIdx, i) => {
        const offset = Math.floor(record.duration * 0.7 * 1000 + i * 5000);
        const material = booth.materials[mIdx];
        if (material) {
            timelineEvents.push({
                time: record.lastVisitAt - record.duration * 1000 + offset,
                text: `领取资料：${material.name}`
            });
        }
    });
    timelineEvents.push({
        time: record.lastVisitAt,
        text: '离开展位'
    });
    timelineEvents.sort((a, b) => a.time - b.time);
    
    const timelineHtml = timelineEvents.map(event => `
        <div class="timeline-item">
            <div class="timeline-time">${formatTime(event.time)}</div>
            <div class="timeline-text">${event.text}</div>
        </div>
    `).join('');
    
    content.innerHTML = `
        <div class="visit-detail-header">
            <div class="visit-detail-icon"><i class="fas ${booth.icon}"></i></div>
            <div class="visit-detail-title">
                <h2>${record.boothName}</h2>
                <p>累计参观 ${record.visitCount} 次 · 最近访问 ${lastVisitStr}</p>
            </div>
        </div>
        
        <div class="visit-detail-stats">
            <div class="visit-stat-item">
                <div class="visit-stat-value">${record.visitCount}</div>
                <div class="visit-stat-label">参观次数</div>
            </div>
            <div class="visit-stat-item">
                <div class="visit-stat-value">${durationStr}</div>
                <div class="visit-stat-label">累计停留</div>
            </div>
            <div class="visit-stat-item">
                <div class="visit-stat-value">${record.viewedProducts.length}</div>
                <div class="visit-stat-label">浏览展品</div>
            </div>
            <div class="visit-stat-item">
                <div class="visit-stat-value">${record.collectedMaterials.length}</div>
                <div class="visit-stat-label">领取资料</div>
            </div>
        </div>
        
        <div class="visit-detail-section">
            <h3><i class="fas fa-clock"></i> 最近访问时间线</h3>
            <div class="visit-timeline">
                ${timelineHtml}
            </div>
        </div>
        
        <div class="visit-detail-section">
            <h3><i class="fas fa-star"></i> 看过的展品</h3>
            <div class="visit-products-list">
                ${viewedProductsHtml}
            </div>
        </div>
        
        <div class="visit-detail-section">
            <h3><i class="fas fa-file-download"></i> 领过的资料</h3>
            <div class="visit-materials-list">
                ${collectedMaterialsHtml}
            </div>
        </div>
        
        <div class="visit-detail-actions">
            <button class="detail-btn primary" id="visit-detail-enter">
                <i class="fas fa-door-open"></i> 进入展位
            </button>
            <button class="detail-btn secondary" id="visit-detail-close">
                <i class="fas fa-times"></i> 关闭
            </button>
        </div>
    `;
    
    content.querySelectorAll('.visit-product-item').forEach(item => {
        item.addEventListener('click', () => {
            const pIdx = parseInt(item.dataset.productIdx);
            const productId = `p-${boothId}-${pIdx}`;
            const product = appState.collectedProducts.find(p => p.id === productId);
            if (product) {
                modal.classList.remove('active');
                openProductDetail(productId);
            }
        });
    });
    
    content.querySelectorAll('.visit-material-item').forEach(item => {
        item.addEventListener('click', () => {
            const mIdx = parseInt(item.dataset.materialIdx);
            const materialId = `m-${boothId}-${mIdx}`;
            const material = appState.collectedMaterials.find(m => m.id === materialId);
            if (material) {
                modal.classList.remove('active');
                openMaterialDetail(materialId);
            }
        });
    });
    
    const enterBtn = document.getElementById('visit-detail-enter');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            openBoothInside(boothId);
        });
    }
    
    const closeBtn = document.getElementById('visit-detail-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    modal.classList.add('active');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function openExportModal() {
    const modal = document.getElementById('asset-export-modal');
    const content = document.getElementById('asset-export-content');
    if (!content) return;
    
    const boothOptions = mockData.booths.map(b => 
        `<option value="${b.id}">${b.name}</option>`
    ).join('');
    
    content.innerHTML = `
        <div class="export-header">
            <h2><i class="fas fa-file-export"></i> 导出参观资产清单</h2>
            <p>选择筛选条件和导出内容，生成您的参观资产清单</p>
        </div>
        
        <div class="export-filters">
            <div class="export-filter-group">
                <label>按展位筛选</label>
                <select id="export-booth-filter">
                    <option value="all">全部展位</option>
                    ${boothOptions}
                </select>
            </div>
            <div class="export-filter-group">
                <label>时间范围</label>
                <select id="export-time-range">
                    <option value="all">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">最近7天</option>
                    <option value="month">最近30天</option>
                </select>
            </div>
        </div>
        
        <div class="export-options">
            <label class="export-option">
                <input type="checkbox" id="export-booths" checked>
                <span>收藏的展位</span>
            </label>
            <label class="export-option">
                <input type="checkbox" id="export-products" checked>
                <span>收藏的展品</span>
            </label>
            <label class="export-option">
                <input type="checkbox" id="export-materials" checked>
                <span>已领资料</span>
            </label>
            <label class="export-option">
                <input type="checkbox" id="export-visits" checked>
                <span>参观记录</span>
            </label>
        </div>
        
        <div class="export-preview" id="export-preview">
            请选择导出内容...
        </div>
        
        <div class="export-actions">
            <button class="detail-btn secondary" id="export-cancel">
                <i class="fas fa-times"></i> 取消
            </button>
            <button class="detail-btn primary" id="export-download">
                <i class="fas fa-download"></i> 下载清单
            </button>
        </div>
    `;
    
    const updatePreview = () => {
        const boothFilter = document.getElementById('export-booth-filter').value;
        const timeRange = document.getElementById('export-time-range').value;
        const includeBooths = document.getElementById('export-booths').checked;
        const includeProducts = document.getElementById('export-products').checked;
        const includeMaterials = document.getElementById('export-materials').checked;
        const includeVisits = document.getElementById('export-visits').checked;
        
        const preview = generateExportPreview(
            boothFilter, timeRange,
            includeBooths, includeProducts, includeMaterials, includeVisits
        );
        document.getElementById('export-preview').textContent = preview;
    };
    
    ['export-booth-filter', 'export-time-range', 'export-booths', 'export-products', 'export-materials', 'export-visits'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updatePreview);
    });
    
    document.getElementById('export-cancel').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    document.getElementById('export-download').addEventListener('click', () => {
        const boothFilter = document.getElementById('export-booth-filter').value;
        const timeRange = document.getElementById('export-time-range').value;
        const includeBooths = document.getElementById('export-booths').checked;
        const includeProducts = document.getElementById('export-products').checked;
        const includeMaterials = document.getElementById('export-materials').checked;
        const includeVisits = document.getElementById('export-visits').checked;
        
        const content = generateExportPreview(
            boothFilter, timeRange,
            includeBooths, includeProducts, includeMaterials, includeVisits
        );
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `参观资产清单_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('资产清单已下载！');
    });
    
    updatePreview();
    modal.classList.add('active');
}

function generateExportPreview(boothFilter, timeRange, includeBooths, includeProducts, includeMaterials, includeVisits) {
    const now = Date.now();
    let timeCutoff = 0;
    if (timeRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        timeCutoff = today.getTime();
    } else if (timeRange === 'week') {
        timeCutoff = now - 7 * 24 * 60 * 60 * 1000;
    } else if (timeRange === 'month') {
        timeCutoff = now - 30 * 24 * 60 * 60 * 1000;
    }
    
    const filterBoothId = boothFilter === 'all' ? null : parseInt(boothFilter);
    const lines = [];
    
    lines.push('═══════════════════════════════════════════');
    lines.push('           参 观 资 产 清 单');
    lines.push('═══════════════════════════════════════════');
    lines.push(`生成时间：${new Date().toLocaleString('zh-CN')}`);
    lines.push('');
    
    if (includeBooths) {
        let booths = mockData.booths.filter(b => appState.favoriteBooths.includes(b.id));
        if (filterBoothId) booths = booths.filter(b => b.id === filterBoothId);
        
        lines.push('【收藏的展位】');
        lines.push('───────────────────────────────────────────');
        if (booths.length === 0) {
            lines.push('  暂无收藏展位');
        } else {
            booths.forEach((b, i) => {
                lines.push(`  ${i + 1}. ${b.name}`);
                lines.push(`     分类：${b.category || '未分类'}`);
                lines.push(`     位置：${b.location || '未知'}`);
            });
        }
        lines.push(`  共 ${booths.length} 个展位`);
        lines.push('');
    }
    
    if (includeProducts) {
        let products = appState.collectedProducts.filter(p => {
            if (timeCutoff > 0 && p.collectedAt && p.collectedAt < timeCutoff) return false;
            if (filterBoothId && p.boothId !== filterBoothId) return false;
            return true;
        });
        
        lines.push('【收藏的展品】');
        lines.push('───────────────────────────────────────────');
        if (products.length === 0) {
            lines.push('  暂无收藏展品');
        } else {
            products.forEach((p, i) => {
                lines.push(`  ${i + 1}. ${p.name}`);
                lines.push(`     来源：${p.booth}`);
                lines.push(`     说明：${p.desc || '暂无描述'}`);
                if (p.collectedAt) {
                    lines.push(`     收藏时间：${new Date(p.collectedAt).toLocaleString('zh-CN')}`);
                }
            });
        }
        lines.push(`  共 ${products.length} 件展品`);
        lines.push('');
    }
    
    if (includeMaterials) {
        let materials = appState.collectedMaterials.filter(m => {
            if (timeCutoff > 0 && m.collectedAt && m.collectedAt < timeCutoff) return false;
            if (filterBoothId && m.boothId !== filterBoothId) return false;
            return true;
        });
        
        lines.push('【已领资料】');
        lines.push('───────────────────────────────────────────');
        if (materials.length === 0) {
            lines.push('  暂无已领资料');
        } else {
            materials.forEach((m, i) => {
                lines.push(`  ${i + 1}. ${m.name}`);
                lines.push(`     来源：${m.booth}`);
                lines.push(`     大小：${m.size}`);
                lines.push(`     说明：${m.desc || '暂无描述'}`);
                if (m.collectedAt) {
                    lines.push(`     领取时间：${new Date(m.collectedAt).toLocaleString('zh-CN')}`);
                }
            });
        }
        lines.push(`  共 ${materials.length} 份资料`);
        lines.push('');
    }
    
    if (includeVisits) {
        let records = appState.visitRecords.filter(r => {
            if (timeCutoff > 0 && r.lastVisitAt < timeCutoff) return false;
            if (filterBoothId && r.boothId !== filterBoothId) return false;
            return true;
        });
        records.sort((a, b) => b.lastVisitAt - a.lastVisitAt);
        
        lines.push('【参观记录】');
        lines.push('───────────────────────────────────────────');
        if (records.length === 0) {
            lines.push('  暂无参观记录');
        } else {
            records.forEach((r, i) => {
                lines.push(`  ${i + 1}. ${r.boothName}`);
                lines.push(`     参观次数：${r.visitCount} 次`);
                lines.push(`     累计停留：${formatDuration(r.duration)}`);
                lines.push(`     最近访问：${new Date(r.lastVisitAt).toLocaleString('zh-CN')}`);
                lines.push(`     浏览展品：${r.viewedProducts.length} 件`);
                lines.push(`     领取资料：${r.collectedMaterials.length} 份`);
            });
        }
        lines.push(`  共 ${records.length} 条记录`);
        lines.push('');
    }
    
    lines.push('═══════════════════════════════════════════');
    lines.push('      感谢您的参观，期待下次再会！');
    lines.push('═══════════════════════════════════════════');
    
    return lines.join('\n');
}

let materialBatchMode = false;
let selectedMaterialIds = new Set();

function toggleMaterialBatchMode() {
    materialBatchMode = !materialBatchMode;
    selectedMaterialIds.clear();
    
    const batchActions = document.getElementById('material-batch-actions');
    const batchBtn = document.getElementById('btn-material-batch');
    
    if (batchActions) {
        batchActions.style.display = materialBatchMode ? 'flex' : 'none';
    }
    if (batchBtn) {
        batchBtn.textContent = materialBatchMode ? '退出批量' : '批量管理';
    }
    
    renderMaterials();
    updateMaterialBatchCount();
}

function toggleMaterialSelection(materialId) {
    if (selectedMaterialIds.has(materialId)) {
        selectedMaterialIds.delete(materialId);
    } else {
        selectedMaterialIds.add(materialId);
    }
    updateMaterialBatchCount();
    updateSelectAllCheckbox();
}

function updateMaterialBatchCount() {
    const countEl = document.getElementById('material-selected-count');
    if (countEl) countEl.textContent = selectedMaterialIds.size;
}

function updateSelectAllCheckbox() {
    const checkbox = document.getElementById('material-select-all');
    if (!checkbox) return;
    
    const visibleMaterials = getFilteredMaterials();
    const allSelected = visibleMaterials.length > 0 && 
        visibleMaterials.every(m => selectedMaterialIds.has(m.id));
    checkbox.checked = allSelected;
}

function getFilteredMaterials() {
    let materials = [...appState.collectedMaterials];
    
    const boothFilter = document.getElementById('material-booth-filter')?.value;
    if (boothFilter && boothFilter !== 'all') {
        materials = materials.filter(m => m.boothId === parseInt(boothFilter));
    }
    
    const sort = document.getElementById('material-sort')?.value || 'time-desc';
    if (sort === 'time-desc') {
        materials.sort((a, b) => (b.collectedAt || 0) - (a.collectedAt || 0));
    } else if (sort === 'time-asc') {
        materials.sort((a, b) => (a.collectedAt || 0) - (b.collectedAt || 0));
    } else if (sort === 'name') {
        materials.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return materials;
}

function toggleSelectAllMaterials() {
    const checkbox = document.getElementById('material-select-all');
    if (!checkbox) return;
    
    const materials = getFilteredMaterials();
    
    if (checkbox.checked) {
        materials.forEach(m => selectedMaterialIds.add(m.id));
    } else {
        materials.forEach(m => selectedMaterialIds.delete(m.id));
    }
    
    renderMaterials();
    updateMaterialBatchCount();
}

function batchRemoveMaterials() {
    if (selectedMaterialIds.size === 0) {
        alert('请先选择要移除的资料');
        return;
    }
    
    if (!confirm(`确定要移除选中的 ${selectedMaterialIds.size} 份资料吗？`)) {
        return;
    }
    
    selectedMaterialIds.forEach(id => {
        removeMaterial(id, true);
    });
    
    selectedMaterialIds.clear();
    toggleMaterialBatchMode();
    refreshAllMaterialCollectionUI();
}

function batchDownloadMaterials() {
    if (selectedMaterialIds.size === 0) {
        alert('请先选择要下载的资料');
        return;
    }
    
    const materials = appState.collectedMaterials.filter(m => selectedMaterialIds.has(m.id));
    const names = materials.map(m => m.name).join('、');
    alert(`开始批量下载 ${materials.length} 份资料：\n${names}`);
}

function renderInterestAnalysis() {
    renderInterestCategories();
    renderActiveBooths();
    renderMaterialTrend();
}

function renderInterestCategories() {
    const container = document.getElementById('interest-categories');
    if (!container) return;
    
    const categoryScores = {};
    
    appState.favoriteBooths.forEach(boothId => {
        const booth = mockData.booths.find(b => b.id === boothId);
        if (booth && booth.category) {
            categoryScores[booth.category] = (categoryScores[booth.category] || 0) + 3;
        }
    });
    
    appState.collectedMaterials.forEach(m => {
        const booth = mockData.booths.find(b => b.id === m.boothId);
        if (booth && booth.category) {
            categoryScores[booth.category] = (categoryScores[booth.category] || 0) + 2;
        }
    });
    
    appState.visitRecords.forEach(r => {
        const booth = mockData.booths.find(b => b.id === r.boothId);
        if (booth && booth.category) {
            const score = Math.min(Math.floor(r.duration / 60), 5);
            categoryScores[booth.category] = (categoryScores[booth.category] || 0) + score;
        }
    });
    
    const categories = Object.entries(categoryScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (categories.length === 0) {
        container.innerHTML = '<div class="visit-detail-empty">暂无数据</div>';
        return;
    }
    
    const maxScore = Math.max(...categories.map(c => c[1]), 1);
    
    container.innerHTML = categories.map(([name, score]) => {
        const percentage = Math.round((score / maxScore) * 100);
        return `
            <div class="category-bar-item">
                <span class="category-name">${name}</span>
                <div class="category-bar">
                    <div class="category-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="category-value">${score}</span>
            </div>
        `;
    }).join('');
}

function renderActiveBooths() {
    const container = document.getElementById('interest-active-booths');
    if (!container) return;
    
    const boothScores = {};
    
    appState.visitRecords.forEach(r => {
        let score = r.visitCount * 2 + Math.floor(r.duration / 120);
        if (appState.favoriteBooths.includes(r.boothId)) score += 5;
        const materialCount = appState.collectedMaterials.filter(m => m.boothId === r.boothId).length;
        score += materialCount * 3;
        boothScores[r.boothId] = score;
    });
    
    const topBooths = Object.entries(boothScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (topBooths.length === 0) {
        container.innerHTML = '<div class="visit-detail-empty">暂无数据</div>';
        return;
    }
    
    container.innerHTML = topBooths.map(([boothId, score], idx) => {
        const booth = mockData.booths.find(b => b.id === parseInt(boothId));
        if (!booth) return '';
        return `
            <div class="active-booth-item" data-booth-id="${boothId}">
                <span class="active-booth-rank">${idx + 1}</span>
                <span class="active-booth-name">${booth.name}</span>
                <span class="active-booth-score">${score}分</span>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.active-booth-item').forEach(item => {
        item.addEventListener('click', () => {
            const boothId = parseInt(item.dataset.boothId);
            openBoothInside(boothId);
        });
    });
}

function renderMaterialTrend() {
    const container = document.getElementById('interest-material-trend');
    if (!container) return;
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const dayIndex = new Date().getDay() || 7;
    
    const weeklyData = [2, 1, 3, 2, 4, 3, appState.collectedMaterials.length % 5 + 1];
    const maxVal = Math.max(...weeklyData, 1);
    const total = weeklyData.reduce((a, b) => a + b, 0);
    
    const barsHtml = days.map((day, i) => {
        const height = Math.round((weeklyData[i] / maxVal) * 100);
        const isToday = (i + 1) === dayIndex;
        return `
            <div class="trend-bar-item">
                <div class="trend-bar" style="height: ${Math.max(height, 5)}%; ${isToday ? 'opacity: 1;' : 'opacity: 0.6;'}"></div>
                <span class="trend-label">${day}</span>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="trend-bars">
            ${barsHtml}
        </div>
        <div class="trend-summary">
            <div class="trend-summary-item">
                <div class="trend-summary-value">${total}</div>
                <div class="trend-summary-label">本周领取</div>
            </div>
            <div class="trend-summary-item">
                <div class="trend-summary-value">${appState.collectedMaterials.length}</div>
                <div class="trend-summary-label">累计资料</div>
            </div>
            <div class="trend-summary-item">
                <div class="trend-summary-value">${Math.round(total / 7)}</div>
                <div class="trend-summary-label">日均领取</div>
            </div>
        </div>
    `;
}

function refreshAllInterestUI() {
    renderInterestAnalysis();
}
