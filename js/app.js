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
});

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
            areas.forEach(a => a.classList.remove('active'));
            area.classList.add('active');
        });
    });
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
    if (filter !== 'all' && filter !== 'favorites') {
        booths = booths.filter(b => b.category === filter);
    }
    
    grid.innerHTML = booths.map(booth => `
        <div class="booth-card" data-booth-id="${booth.id}">
            <div class="booth-image" style="background: linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()});">
                <i class="fas ${booth.icon}"></i>
                ${booth.badge ? `<span class="booth-badge">${booth.badge}</span>` : ''}
                <div class="booth-favorite" data-favorite="${booth.id}">
                    <i class="far fa-star"></i>
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
    `).join('');

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
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        });
    });
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
    
    grid.innerHTML = mockData.myCollections.map(item => `
        <div class="collection-item">
            <div class="collection-icon"><i class="fas ${item.icon}"></i></div>
            <div class="collection-info">
                <div class="collection-name">${item.name}</div>
                <div class="collection-meta">来自：${item.booth}</div>
            </div>
        </div>
    `).join('');
}

function renderMaterials() {
    const grid = document.getElementById('materials-grid');
    if (!grid) return;
    
    grid.innerHTML = mockData.myMaterials.map(item => `
        <div class="material-item">
            <div class="material-icon"><i class="fas ${item.icon}"></i></div>
            <div class="material-info">
                <div class="material-name">${item.name}</div>
                <div class="material-meta">${item.booth} · ${item.size}</div>
            </div>
        </div>
    `).join('');
}

function initBoothModal() {
    const modal = document.getElementById('booth-modal');
    const closeBtn = document.querySelector('.modal-close');
    
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
            <button class="detail-btn primary"><i class="fas fa-door-open"></i> 进入展位</button>
            <button class="detail-btn secondary"><i class="fas fa-star"></i> 收藏展位</button>
        </div>
        <div class="products-list">
            <h3><i class="fas fa-box-open"></i> 展品列表</h3>
            ${booth.products.map(p => `
                <div class="product-item">
                    <div class="product-icon"><i class="fas ${p.icon}"></i></div>
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-desc">${p.desc}</div>
                        <button class="product-btn"><i class="fas fa-star"></i> 收藏展品</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('active');
}

function initAvatar() {
    renderCustomizeItems('hairstyle');
    renderPresetAvatars();
    initCustomizeTabs();
    initColorPalette();
    initSaveAvatar();
}

function renderCustomizeItems(category) {
    const container = document.getElementById('customize-items');
    if (!container) return;
    
    const items = mockData.customizeItems[category];
    
    if (category === 'skin') {
        container.innerHTML = items.map((item, index) => `
            <div class="customize-item ${index === 0 ? 'active' : ''}" data-item-id="${item.id}" style="background: ${item.color};">
            </div>
        `).join('');
    } else {
        container.innerHTML = items.map((item, index) => `
            <div class="customize-item ${index === 0 ? 'active' : ''}" data-item-id="${item.id}" title="${item.name}">
                <i class="fas ${item.icon}"></i>
            </div>
        `).join('');
    }
    
    container.querySelectorAll('.customize-item').forEach(item => {
        item.addEventListener('click', () => {
            container.querySelectorAll('.customize-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
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
            
            const torso = document.querySelector('.avatar-torso');
            const arms = document.querySelector('.avatar-arms');
            if (torso && arms) {
                const colorVal = color.dataset.color;
                torso.style.background = colorVal;
                arms.style.setProperty('--arm-color', colorVal);
            }
        });
    });
}

function renderPresetAvatars() {
    const grid = document.getElementById('preset-grid');
    if (!grid) return;
    
    grid.innerHTML = mockData.presetAvatars.map(avatar => `
        <div class="preset-card" data-avatar-id="${avatar.id}">
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
        });
    });
}

function initSaveAvatar() {
    const btn = document.querySelector('.btn-save-avatar');
    if (btn) {
        btn.addEventListener('click', () => {
            alert('形象保存成功！');
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
}

function renderFriends() {
    const container = document.getElementById('friends-online');
    if (!container) return;
    
    container.innerHTML = mockData.friends.map(friend => `
        <div class="friend-item">
            <div class="friend-avatar ${friend.online ? 'online' : 'offline'}" style="background: ${friend.color};">
                <i class="fas ${friend.avatar}"></i>
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status">${friend.location}</div>
            </div>
        </div>
    `).join('');
}

function renderTogetherFriends() {
    const container = document.getElementById('friends-together');
    if (!container) return;
    
    container.innerHTML = mockData.togetherFriends.map(friend => `
        <div class="friend-item">
            <div class="friend-avatar online" style="background: ${friend.color};">
                <i class="fas ${friend.avatar}"></i>
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status">${friend.status}</div>
            </div>
        </div>
    `).join('');
}

function renderVoiceParticipants() {
    const container = document.getElementById('voice-participants');
    if (!container) return;
    
    container.innerHTML = mockData.voiceParticipants.map(p => `
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
}

function renderEventsTimeline() {
    const container = document.getElementById('events-timeline');
    if (!container) return;
    
    container.innerHTML = mockData.events.map(event => `
        <div class="timeline-item ${event.status}">
            <div class="timeline-time">${event.time}</div>
            <div class="timeline-title">${event.title}</div>
            <div class="timeline-desc">${event.desc}</div>
            <div class="timeline-actions">
                <button class="timeline-btn secondary"><i class="fas fa-info-circle"></i> 详情</button>
                ${event.status === 'live' ? '<button class="timeline-btn primary"><i class="fas fa-play"></i> 立即参与</button>' : 
                  event.status === 'upcoming' ? '<button class="timeline-btn primary"><i class="fas fa-calendar-plus"></i> 活动报名</button>' :
                  '<button class="timeline-btn"><i class="fas fa-redo"></i> 观看回放</button>'}
            </div>
        </div>
    `).join('');
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
            alert('问卷提交成功！获得100积分奖励！');
        });
    }
}
