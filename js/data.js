const appState = {
    inSpace: false,
    currentArea: 'entrance',
    currentAreaName: '入口大厅',
    favoriteBooths: [1, 3],
    collectedProducts: [
        { id: 'p-1-1', name: 'VR头显Pro', booth: '未来科技体验馆', boothId: 1, icon: 'fa-vr-cardboard', desc: '4K分辨率，120Hz刷新率', collectedAt: Date.now() - 3600000 },
        { id: 'p-2-0', name: '赛博朋克外套', booth: '数字时尚秀场', boothId: 2, icon: 'fa-user', desc: '限量版数字服装', collectedAt: Date.now() - 7200000 },
        { id: 'p-3-0', name: '抽象数字画', booth: '数字艺术画廊', boothId: 3, icon: 'fa-image', desc: '限量版数字艺术品', collectedAt: Date.now() - 1800000 },
    ],
    collectedMaterials: [
        { id: 'm-1-0', name: '产品白皮书.pdf', booth: '未来科技体验馆', boothId: 1, size: '2.3MB', icon: 'fa-file-pdf', desc: '详细介绍公司产品线和技术参数', collectedAt: Date.now() - 5400000 },
        { id: 'm-2-0', name: '新品目录.pdf', booth: '数字时尚秀场', boothId: 2, size: '3.2MB', icon: 'fa-file-pdf', desc: '2026秋冬新品全部款式', collectedAt: Date.now() - 9000000 },
        { id: 'm-4-0', name: '投资手册.pdf', booth: '创业项目路演', boothId: 4, size: '1.2MB', icon: 'fa-file-pdf', desc: '创业项目投资价值分析', collectedAt: Date.now() - 10800000 },
    ],
    visitRecords: [
        { boothId: 1, boothName: '未来科技体验馆', lastVisitAt: Date.now() - 1800000, duration: 680, viewedProducts: [0, 1], collectedMaterials: [0], visitCount: 2 },
        { boothId: 2, boothName: '数字时尚秀场', lastVisitAt: Date.now() - 5400000, duration: 420, viewedProducts: [0], collectedMaterials: [0], visitCount: 1 },
        { boothId: 4, boothName: '创业项目路演', lastVisitAt: Date.now() - 10800000, duration: 950, viewedProducts: [0, 1, 2], collectedMaterials: [0], visitCount: 3 },
    ],
    currentBoothVisit: null,
    avatarConfig: {
        hairstyle: 'h1',
        outfit: 'o1',
        accessory: null,
        skin: 's1',
        outfitColor: '#6C5CE7',
        hairColor: '#2D3436',
        skinColor: '#FFE4C4',
    },
    registeredEvents: [],
    inVoiceChannel: true,
    togetherFriendIds: [1, 4],
};

const mockData = {
    visitors: [
        { id: 1, name: '星空漫步者', badge: 'VIP会员', avatar: 'fa-user-astronaut', color: '#6C5CE7' },
        { id: 2, name: '科技探索者', badge: '参展商', avatar: 'fa-user-tie', color: '#00CEC9' },
        { id: 3, name: '梦想家小明', badge: '普通访客', avatar: 'fa-user', color: '#FF6B6B' },
        { id: 4, name: '未来旅人', badge: 'VIP会员', avatar: 'fa-user-ninja', color: '#FFD93D' },
        { id: 5, name: '数字艺术家', badge: '演讲嘉宾', avatar: 'fa-user-graduate', color: '#FD79A8' },
        { id: 6, name: '极客小李', badge: '普通访客', avatar: 'fa-user-secret', color: '#45B7D1' },
        { id: 7, name: '创意设计师', badge: '参展商', avatar: 'fa-user-edit', color: '#96CEB4' },
        { id: 8, name: 'VR爱好者', badge: '普通访客', avatar: 'fa-user-circle', color: '#DDA0DD' },
    ],

    booths: [
        { id: 1, name: '未来科技体验馆', exhibitor: '未来科技有限公司', category: 'tech', icon: 'fa-microchip', visitors: 1256, likes: 328, badge: '热门', desc: '展示最新的AI、VR、AR等前沿科技产品，体验沉浸式未来生活。', products: [
            { name: '智能AI助手', desc: '基于大模型的智能对话系统', icon: 'fa-robot' },
            { name: 'VR头显Pro', desc: '4K分辨率，120Hz刷新率', icon: 'fa-vr-cardboard' },
            { name: '智能眼镜', desc: '轻量化AR智能眼镜', icon: 'fa-glasses' }
        ], materials: [
            { name: '产品白皮书.pdf', icon: 'fa-file-pdf', size: '2.3MB', desc: '详细介绍公司产品线和技术参数' },
            { name: '品牌介绍.pptx', icon: 'fa-file-powerpoint', size: '8.5MB', desc: '公司品牌故事和发展历程' },
            { name: '技术白皮书.docx', icon: 'fa-file-word', size: '1.8MB', desc: '核心技术架构和研发成果' },
        ]},
        { id: 2, name: '数字时尚秀场', exhibitor: '潮牌数字服饰', category: 'fashion', icon: 'fa-tshirt', visitors: 892, likes: 256, badge: '新品', desc: '数字时尚品牌展示虚拟服装、NFT配饰等数字时尚单品。', products: [
            { name: '赛博朋克外套', desc: '限量版数字服装', icon: 'fa-user' },
            { name: '霓虹运动鞋', desc: '会发光的虚拟跑鞋', icon: 'fa-shoe-prints' },
            { name: '像素风帽子', desc: '复古像素风格配饰', icon: 'fa-hat-cowboy' }
        ], materials: [
            { name: '新品目录.pdf', icon: 'fa-file-pdf', size: '3.2MB', desc: '2026秋冬新品全部款式' },
            { name: '品牌故事.pdf', icon: 'fa-file-pdf', size: '1.5MB', desc: '品牌设计理念和灵感来源' },
            { name: '合作方案.docx', icon: 'fa-file-word', size: '980KB', desc: '品牌合作和联名方案' },
        ]},
        { id: 3, name: '数字艺术画廊', exhibitor: '元宇宙艺术中心', category: 'art', icon: 'fa-palette', visitors: 678, likes: 189, badge: '', desc: '汇聚全球数字艺术家作品，打造沉浸式艺术体验空间。', products: [
            { name: '抽象数字画', desc: '限量版数字艺术品', icon: 'fa-image' },
            { name: '3D雕塑', desc: '交互式3D艺术作品', icon: 'fa-cube' },
            { name: '动态光影', desc: '随音乐变化的光影艺术', icon: 'fa-lightbulb' }
        ], materials: [
            { name: '艺术展品图录.pdf', icon: 'fa-file-pdf', size: '5.6MB', desc: '本次展览全部作品介绍' },
            { name: '艺术家手册.pdf', icon: 'fa-file-pdf', size: '2.1MB', desc: '参展艺术家简历和作品' },
            { name: '收藏指南.docx', icon: 'fa-file-word', size: '650KB', desc: '数字艺术收藏入门指南' },
        ]},
        { id: 4, name: '创业项目路演', exhibitor: '创投加速器', category: 'startup', icon: 'fa-rocket', visitors: 1024, likes: 298, badge: '推荐', desc: '优秀创业项目展示与路演，寻找投资合作伙伴。', products: [
            { name: '元宇宙办公', desc: '虚拟办公解决方案', icon: 'fa-briefcase' },
            { name: '数字身份系统', desc: '去中心化身份验证', icon: 'fa-id-card' },
            { name: '虚拟地产', desc: '元宇宙房产投资', icon: 'fa-home' }
        ], materials: [
            { name: '投资手册.pdf', icon: 'fa-file-pdf', size: '1.2MB', desc: '创业项目投资价值分析' },
            { name: '路演日程.xlsx', icon: 'fa-file-excel', size: '450KB', desc: '今日路演项目时间表' },
            { name: '商业计划书模板.docx', icon: 'fa-file-word', size: '230KB', desc: '标准商业计划书模板' },
        ]},
        { id: 5, name: '智能生活空间', exhibitor: '智慧家居科技', category: 'tech', icon: 'fa-home', visitors: 856, likes: 234, badge: '', desc: '展示智能家居产品，打造智慧生活新体验。', products: [
            { name: 'AI音箱', desc: '全屋语音控制中心', icon: 'fa-speaker' },
            { name: '智能门锁', desc: '人脸识别解锁', icon: 'fa-lock' },
            { name: '环境监测仪', desc: '室内空气质量监测', icon: 'fa-wind' }
        ], materials: [
            { name: '产品手册.pdf', icon: 'fa-file-pdf', size: '4.2MB', desc: '全系列智能家居产品介绍' },
            { name: '安装指南.docx', icon: 'fa-file-word', size: '890KB', desc: '设备安装和使用说明' },
            { name: '售后服务.pdf', icon: 'fa-file-pdf', size: '560KB', desc: '保修政策和服务网点' },
        ]},
        { id: 6, name: '潮流虚拟配饰', exhibitor: '潮玩数字工坊', category: 'fashion', icon: 'fa-gem', visitors: 723, likes: 198, badge: '新品', desc: '虚拟珠宝、配饰、潮玩等数字收藏品。', products: [
            { name: '钻石项链', desc: '永不磨损的虚拟钻石', icon: 'fa-gem' },
            { name: '机械手表', desc: '精密虚拟钟表', icon: 'fa-clock' },
            { name: '潮玩手办', desc: '限量版数字手办', icon: 'fa-toys' }
        ], materials: [
            { name: '藏品图录.pdf', icon: 'fa-file-pdf', size: '6.8MB', desc: '全部数字藏品介绍' },
            { name: '收藏价值报告.pdf', icon: 'fa-file-pdf', size: '1.5MB', desc: '数字藏品市场分析报告' },
            { name: '兑换说明.docx', icon: 'fa-file-word', size: '340KB', desc: '实体周边兑换规则' },
        ]},
        { id: 7, name: 'NFT艺术展厅', exhibitor: '加密艺术画廊', category: 'art', icon: 'fa-coins', visitors: 567, likes: 156, badge: '', desc: '知名NFT艺术家作品展览，支持一键收藏。', products: [
            { name: '无聊猿', desc: '经典NFT头像系列', icon: 'fa-draw-polygon' },
            { name: '加密朋克', desc: '像素风艺术藏品', icon: 'fa-paint-brush' },
            { name: '艺术照', desc: '数字摄影作品', icon: 'fa-camera' }
        ], materials: [
            { name: 'NFT入门指南.pdf', icon: 'fa-file-pdf', size: '1.1MB', desc: 'NFT收藏从零开始' },
            { name: '拍卖规则.docx', icon: 'fa-file-word', size: '120KB', desc: '数字艺术品拍卖规则' },
            { name: '作品集.pdf', icon: 'fa-file-pdf', size: '3.4MB', desc: '本期展览全部作品' },
        ]},
        { id: 8, name: '科技新品发布', exhibitor: '创新科技联盟', category: 'startup', icon: 'fa-lightbulb', visitors: 1134, likes: 312, badge: '热门', desc: '最新科技创新产品首发，限时优惠预订。', products: [
            { name: '折叠屏手机', desc: '第三代折叠屏技术', icon: 'fa-mobile-alt' },
            { name: '无线充电板', desc: '隔空充电技术', icon: 'fa-battery-full' },
            { name: '智能戒指', desc: '健康监测智能穿戴', icon: 'fa-ring' }
        ], materials: [
            { name: '新品发布会手册.pdf', icon: 'fa-file-pdf', size: '2.8MB', desc: '发布产品详细参数' },
            { name: '预订单.xlsx', icon: 'fa-file-excel', size: '320KB', desc: '首批预订优惠价格表' },
            { name: '媒体资料包.zip', icon: 'fa-file-archive', size: '15.6MB', desc: '高清图片和新闻稿' },
        ]},
    ],

    friends: [
        { id: 1, name: '科技达人小王', status: '在线', location: '科技展区', avatar: 'fa-user-astronaut', color: '#6C5CE7', online: true },
        { id: 2, name: '小美同学', status: '在线', location: '时尚展区', avatar: 'fa-user', color: '#FD79A8', online: true },
        { id: 3, name: '产品经理老张', status: '忙碌', location: '创业专区', avatar: 'fa-user-tie', color: '#00CEC9', online: true },
        { id: 4, name: '设计师阿杰', status: '在线', location: '艺术展区', avatar: 'fa-user-edit', color: '#FFD93D', online: true },
        { id: 5, name: '投资人李总', status: '离线', location: '上次登录：2小时前', avatar: 'fa-user-circle', color: '#96CEB4', online: false },
        { id: 6, name: '游戏玩家小明', status: '在线', location: '休息区', avatar: 'fa-gamepad', color: '#FF6B6B', online: true },
    ],

    togetherFriends: [
        { id: 1, name: '科技达人小王', status: '与你同游', avatar: 'fa-user-astronaut', color: '#6C5CE7' },
        { id: 4, name: '设计师阿杰', status: '与你同游', avatar: 'fa-user-edit', color: '#FFD93D' },
    ],

    voiceParticipants: [
        { id: 1, name: '主持人莉莉', speaking: true, muted: false, avatar: 'fa-user', color: '#FD79A8' },
        { id: 2, name: '科技达人小王', speaking: false, muted: false, avatar: 'fa-user-astronaut', color: '#6C5CE7' },
        { id: 3, name: '小美同学', speaking: false, muted: true, avatar: 'fa-user', color: '#FD79A8' },
        { id: 4, name: '嘉宾张教授', speaking: true, muted: false, avatar: 'fa-user-graduate', color: '#00CEC9' },
        { id: 5, name: '产品经理老张', speaking: false, muted: false, avatar: 'fa-user-tie', color: '#45B7D1' },
        { id: 6, name: '设计师阿杰', speaking: false, muted: false, avatar: 'fa-user-edit', color: '#FFD93D' },
        { id: 7, name: '你', speaking: false, muted: false, avatar: 'fa-user', color: '#96CEB4', isSelf: true },
        { id: 8, name: '神秘访客', speaking: false, muted: true, avatar: 'fa-user-secret', color: '#DDA0DD' },
    ],

    chatMessages: [
        { id: 1, sender: '主持人莉莉', content: '欢迎大家来到今天的元宇宙科技分享会！', time: '14:30', self: false, color: '#FD79A8' },
        { id: 2, sender: '你', content: '终于等到这场分享了，期待！', time: '14:31', self: true, color: '#96CEB4' },
        { id: 3, sender: '科技达人小王', content: '听说今天会发布新产品？', time: '14:32', self: false, color: '#6C5CE7' },
        { id: 4, sender: '嘉宾张教授', content: '是的，今天会有惊喜哦~', time: '14:33', self: false, color: '#00CEC9' },
        { id: 5, sender: '小美同学', content: '好期待！有抽奖活动吗？🎁', time: '14:34', self: false, color: '#FD79A8' },
    ],

    events: [
        { id: 1, title: '元宇宙科技峰会开幕式', time: '09:00 - 10:30', desc: '行业领袖共话元宇宙未来发展趋势', status: 'finished', type: 'keynote' },
        { id: 2, title: 'AI技术创新论坛', time: '10:30 - 12:00', desc: '探讨人工智能在元宇宙中的应用', status: 'live', type: 'forum' },
        { id: 3, title: '数字时尚发布会', time: '14:00 - 15:30', desc: '2026秋冬数字时装新品发布', status: 'upcoming', type: 'fashion' },
        { id: 4, title: '创业项目路演', time: '15:30 - 17:00', desc: '优秀创业项目展示与投资对接', status: 'upcoming', type: 'startup' },
        { id: 5, title: '元宇宙音乐节', time: '19:00 - 22:00', desc: '顶级DJ带来沉浸式音乐体验', status: 'upcoming', type: 'music' },
        { id: 6, title: 'NFT艺术拍卖', time: '20:00 - 21:30', desc: '珍稀数字艺术品限时拍卖', status: 'upcoming', type: 'art' },
    ],

    boothRanking: [
        { rank: 1, name: '未来科技体验馆', value: '1,256', meta: '科技类' },
        { rank: 2, name: '科技新品发布', value: '1,134', meta: '创业类' },
        { rank: 3, name: '创业项目路演', value: '1,024', meta: '创业类' },
        { rank: 4, name: '数字时尚秀场', value: '892', meta: '时尚类' },
        { rank: 5, name: '智能生活空间', value: '856', meta: '科技类' },
    ],

    eventRanking: [
        { rank: 1, name: '元宇宙音乐节', value: '5,234', meta: '音乐类' },
        { rank: 2, name: 'AI技术创新论坛', value: '3,892', meta: '科技类' },
        { rank: 3, name: '数字时尚发布会', value: '2,756', meta: '时尚类' },
        { rank: 4, name: 'NFT艺术拍卖', value: '1,987', meta: '艺术类' },
        { rank: 5, name: '创业项目路演', value: '1,543', meta: '创业类' },
    ],

    presetAvatars: [
        { id: 1, name: '科技先锋', desc: '未来科技风格', icon: 'fa-user-astronaut', color: '#6C5CE7' },
        { id: 2, name: '商务精英', desc: '专业商务形象', icon: 'fa-user-tie', color: '#00CEC9' },
        { id: 3, name: '潮流达人', desc: '时尚潮流穿搭', icon: 'fa-user-alt', color: '#FD79A8' },
        { id: 4, name: '艺术气质', desc: '文艺清新风格', icon: 'fa-user-edit', color: '#FFD93D' },
        { id: 5, name: '运动健将', desc: '活力运动风格', icon: 'fa-running', color: '#FF6B6B' },
        { id: 6, name: '神秘忍者', desc: '暗黑酷炫风格', icon: 'fa-user-ninja', color: '#2D3436' },
    ],

    customizeItems: {
        hairstyle: [
            { id: 'h1', name: '短发', icon: 'fa-user' },
            { id: 'h2', name: '长发', icon: 'fa-female' },
            { id: 'h3', name: '莫西干', icon: 'fa-user-ninja' },
            { id: 'h4', name: '卷发', icon: 'fa-user-circle' },
            { id: 'h5', name: '光头', icon: 'fa-user-secret' },
            { id: 'h6', name: '双马尾', icon: 'fa-user-alt' },
            { id: 'h7', name: '爆炸头', icon: 'fa-user-astronaut' },
            { id: 'h8', name: '背头', icon: 'fa-user-tie' },
        ],
        outfit: [
            { id: 'o1', name: 'T恤牛仔裤', icon: 'fa-tshirt' },
            { id: 'o2', name: '西装', icon: 'fa-user-tie' },
            { id: 'o3', name: '连衣裙', icon: 'fa-female' },
            { id: 'o4', name: '运动装', icon: 'fa-running' },
            { id: 'o5', name: '风衣', icon: 'fa-user-alt' },
            { id: 'o6', name: '卫衣', icon: 'fa-user' },
            { id: 'o7', name: '机甲服', icon: 'fa-robot' },
            { id: 'o8', name: '太空服', icon: 'fa-user-astronaut' },
        ],
        accessory: [
            { id: 'a1', name: '眼镜', icon: 'fa-glasses' },
            { id: 'a2', name: '帽子', icon: 'fa-hat-cowboy' },
            { id: 'a3', name: '耳机', icon: 'fa-headphones' },
            { id: 'a4', name: '项链', icon: 'fa-gem' },
            { id: 'a5', name: '手表', icon: 'fa-clock' },
            { id: 'a6', name: '口罩', icon: 'fa-head-side-mask' },
            { id: 'a7', name: '背包', icon: 'fa-backpack' },
            { id: 'a8', name: '翅膀', icon: 'fa-feather-alt' },
        ],
        skin: [
            { id: 's1', name: '白皙', color: '#FFE4C4' },
            { id: 's2', name: '自然', color: '#DEB887' },
            { id: 's3', name: '小麦色', color: '#D2B48C' },
            { id: 's4', name: '健康色', color: '#CD853F' },
            { id: 's5', name: '深肤色', color: '#8B4513' },
            { id: 's6', name: '蓝色', color: '#4169E1' },
            { id: 's7', name: '绿色', color: '#32CD32' },
            { id: 's8', name: '紫色', color: '#9370DB' },
        ],
    },

    blacklist: [
        { id: 1, name: '广告机器人001', reason: '发送垃圾广告', avatar: 'fa-robot', color: '#636E72' },
        { id: 2, name: '骚扰用户小王', reason: '言语骚扰', avatar: 'fa-user-slash', color: '#B2BEC3' },
        { id: 3, name: '骗子账号', reason: '涉嫌诈骗', avatar: 'fa-user-secret', color: '#636E72' },
    ],

    collectedCards: [
        { id: 1, name: '张总', company: '未来科技有限公司 CEO', avatar: 'fa-user-tie', color: '#6C5CE7' },
        { id: 2, name: '李设计师', company: '潮牌数字服饰 创意总监', avatar: 'fa-user-edit', color: '#FD79A8' },
        { id: 3, name: '王工程师', company: '元宇宙艺术中心 CTO', avatar: 'fa-user-cog', color: '#00CEC9' },
        { id: 4, name: '陈经理', company: '创投加速器 投资经理', avatar: 'fa-briefcase', color: '#FFD93D' },
    ],

    myCollections: [
        { id: 1, name: 'VR头显Pro', booth: '未来科技体验馆', icon: 'fa-vr-cardboard' },
        { id: 2, name: '赛博朋克外套', booth: '数字时尚秀场', icon: 'fa-user' },
        { id: 3, name: '抽象数字画', booth: '数字艺术画廊', icon: 'fa-image' },
    ],

    myMaterials: [
        { id: 1, name: '产品白皮书.pdf', booth: '未来科技体验馆', size: '2.3MB', icon: 'fa-file-pdf' },
        { id: 2, name: '品牌介绍.pptx', booth: '数字时尚秀场', size: '8.5MB', icon: 'fa-file-powerpoint' },
        { id: 3, name: '投资手册.docx', booth: '创业项目路演', size: '1.2MB', icon: 'fa-file-word' },
    ],

    prizes: [
        { name: '一等奖', item: 'VR头显' },
        { name: '二等奖', item: '智能手表' },
        { name: '三等奖', item: '无线耳机' },
        { name: '纪念品', item: '限定徽章' },
        { name: '优惠券', item: '50元优惠券' },
        { name: '积分', item: '100积分' },
        { name: '再来一次', item: '额外抽奖机会' },
        { name: '谢谢参与', item: '感谢参与' },
    ],
};
