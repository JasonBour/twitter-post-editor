// 全局状态
let currentUserInfo = {
    username: '大熊Jason',
    handle: '@JasonCharlie12',
    avatar: 'avatar.jpg',
    verified: true
};

// 推文数据全局状态
let currentTweetData = {
    postTime: '下午12:48 · 2025/11/26',
    views: '11万',
    comments: '3',
    retweets: '4',
    likes: '21',
    bookmarks: '1.3K'
};

// 自动生成合理的推文数据
function autoGenerateTweetData() {
    // 自动设置推文时间为当前时间的前3小时
    const now = new Date();
    const tweetTime = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    
    // 格式化时间为 "下午12:48 · 2025/11/26" 格式
    const hours = tweetTime.getHours();
    const minutes = tweetTime.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? '下午' : '上午';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const year = tweetTime.getFullYear();
    const month = (tweetTime.getMonth() + 1).toString().padStart(2, '0');
    const day = tweetTime.getDate().toString().padStart(2, '0');
    
    const formattedTime = `${period}${formattedHours}:${minutes} · ${year}/${month}/${day}`;
    
    // 生成合理的互动数据（基于正态分布，模拟真实推文数据）
    // 查看数：1万 - 50万
    const views = Math.floor(Math.random() * 490000) + 10000;
    const formattedViews = views >= 10000 ? `${(views / 10000).toFixed(1)}万` : views.toString();
    
    // 评论数：查看数的 0.1% - 1%
    const commentRate = Math.random() * 0.009 + 0.001;
    const comments = Math.floor(views * commentRate);
    
    // 转发数：评论数的 50% - 200%
    const retweetRate = Math.random() * 1.5 + 0.5;
    const retweets = Math.floor(comments * retweetRate);
    
    // 点赞数：评论数的 5 - 20 倍
    const likeRate = Math.random() * 15 + 5;
    const likes = Math.floor(comments * likeRate);
    
    // 收藏数：点赞数的 10% - 30%
    const bookmarkRate = Math.random() * 0.2 + 0.1;
    const bookmarks = Math.floor(likes * bookmarkRate);
    const formattedBookmarks = bookmarks >= 1000 ? `${(bookmarks / 1000).toFixed(1)}K` : bookmarks.toString();
    
    // 更新全局状态
    currentTweetData = {
        postTime: formattedTime,
        views: formattedViews,
        comments: comments.toString(),
        retweets: retweets.toString(),
        likes: likes.toString(),
        bookmarks: formattedBookmarks
    };
    
    // 保存到本地存储
    saveTweetData();
    
    // 更新编辑面板
    updateDataEditor();
    
    // 同步到所有卡片
    syncTweetDataToAllCards();
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadTweetData();
    setupGlobalListeners();
    setupSourceEditor();
    setupDataEditorListeners();
    
    // 页面加载时自动生成推文数据
    autoGenerateTweetData();
    
    // 初始渲染一次（如果有保存的内容）
    // const savedContent = localStorage.getItem('sourceContent');
    // if (savedContent) {
    //     document.getElementById('sourceEditor').innerHTML = savedContent;
    //     autoLayout();
    // }
});

// 设置全局监听器（用于同步用户信息和推文数据）
function setupGlobalListeners() {
    // 监听所有卡片的用户信息变化
    document.getElementById('previewPanel').addEventListener('input', (e) => {
        const target = e.target;
        if (target.classList.contains('username')) {
            updateUserInfo('username', target.innerText);
        } else if (target.classList.contains('handle')) {
            updateUserInfo('handle', target.innerText);
        }
    });

    // 头像上传
    document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);

    // 点击任意头像触发上传
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('avatar')) {
            document.getElementById('avatarInput').click();
        }
    });
}

// 设置数据编辑器监听器
function setupDataEditorListeners() {
    // 可以在这里添加实时更新逻辑
    // 例如：当输入框内容变化时自动更新所有卡片
}

// 更新单个推文数据并同步到所有卡片
function updateTweetData(key, value) {
    currentTweetData[key] = value;
    saveTweetData();
    syncTweetDataToAllCards();
}

// 更新所有推文数据（从编辑面板获取）
function updateAllTweetData() {
    // 从编辑面板获取所有数据
    currentTweetData.postTime = document.getElementById('editPostTime').value;
    currentTweetData.views = document.getElementById('editViews').value;
    currentTweetData.comments = document.getElementById('editComments').value;
    currentTweetData.retweets = document.getElementById('editRetweets').value;
    currentTweetData.likes = document.getElementById('editLikes').value;
    currentTweetData.bookmarks = document.getElementById('editBookmarks').value;
    
    saveTweetData();
    syncTweetDataToAllCards();
}

// 同步推文数据到所有卡片
function syncTweetDataToAllCards() {
    const cards = document.querySelectorAll('.phone-container');
    cards.forEach(card => {
        // 更新时间
        const postTime = card.querySelector('.post-time');
        if (postTime) postTime.innerText = currentTweetData.postTime;
        
        // 更新查看数
        const views = card.querySelector('.views');
        if (views) views.innerText = currentTweetData.views;
        
        // 更新评论数
        const commentCount = card.querySelector('.comment-item .count');
        if (commentCount) commentCount.innerText = currentTweetData.comments;
        
        // 更新转发数
        const retweetCount = card.querySelector('.retweet-item .count');
        if (retweetCount) retweetCount.innerText = currentTweetData.retweets;
        
        // 更新点赞数
        const likeCount = card.querySelector('.like-item .count');
        if (likeCount) likeCount.innerText = currentTweetData.likes;
        
        // 更新收藏数
        const bookmarkCount = card.querySelector('.bookmark-item .count');
        if (bookmarkCount) bookmarkCount.innerText = currentTweetData.bookmarks;
    });
}

// 保存推文数据到localStorage
function saveTweetData() {
    localStorage.setItem('twitterTweetData', JSON.stringify(currentTweetData));
}

// 从localStorage加载推文数据
function loadTweetData() {
    const saved = localStorage.getItem('twitterTweetData');
    if (saved) {
        currentTweetData = JSON.parse(saved);
    }
    
    // 更新编辑面板
    updateDataEditor();
    
    // 同步到现有卡片
    syncTweetDataToAllCards();
}

// 更新数据编辑器面板
function updateDataEditor() {
    document.getElementById('editPostTime').value = currentTweetData.postTime;
    document.getElementById('editViews').value = currentTweetData.views;
    document.getElementById('editComments').value = currentTweetData.comments;
    document.getElementById('editRetweets').value = currentTweetData.retweets;
    document.getElementById('editLikes').value = currentTweetData.likes;
    document.getElementById('editBookmarks').value = currentTweetData.bookmarks;
}

// 更新用户信息并同步到所有卡片
function updateUserInfo(key, value) {
    currentUserInfo[key] = value;
    saveUserInfo();

    // 同步到所有卡片
    const cards = document.querySelectorAll('.phone-container');
    cards.forEach(card => {
        const el = card.querySelector(`.${key}`);
        if (el && el.innerText !== value) {
            el.innerText = value;
        }
    });
}

// 处理头像上传
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const newAvatar = event.target.result;
            currentUserInfo.avatar = newAvatar;
            saveUserInfo();

            // 更新所有头像
            document.querySelectorAll('.avatar').forEach(img => {
                img.src = newAvatar;
            });
        };
        reader.readAsDataURL(file);
    }
}

// 保存/加载用户信息
function saveUserInfo() {
    localStorage.setItem('twitterUserInfo', JSON.stringify(currentUserInfo));
}

function loadUserInfo() {
    const saved = localStorage.getItem('twitterUserInfo');
    if (saved) {
        currentUserInfo = JSON.parse(saved);
        // 更新现有卡片（如果有）
        updateCardUserInfo(document.querySelector('.phone-container'));
    }
}

function updateCardUserInfo(card) {
    if (!card) return;
    card.querySelector('.username').innerText = currentUserInfo.username;
    card.querySelector('.handle').innerText = currentUserInfo.handle;
    const avatar = card.querySelector('.avatar');
    if (avatar) avatar.src = currentUserInfo.avatar;
}

// 更新单个卡片的推文数据
function updateCardTweetData(card) {
    if (!card) return;
    
    // 更新时间
    const postTime = card.querySelector('.post-time');
    if (postTime) postTime.innerText = currentTweetData.postTime;
    
    // 更新查看数
    const views = card.querySelector('.views');
    if (views) views.innerText = currentTweetData.views;
    
    // 更新评论数
    const commentCount = card.querySelector('.comment-item .count');
    if (commentCount) commentCount.innerText = currentTweetData.comments;
    
    // 更新转发数
    const retweetCount = card.querySelector('.retweet-item .count');
    if (retweetCount) retweetCount.innerText = currentTweetData.retweets;
    
    // 更新点赞数
    const likeCount = card.querySelector('.like-item .count');
    if (likeCount) likeCount.innerText = currentTweetData.likes;
    
    // 更新收藏数
    const bookmarkCount = card.querySelector('.bookmark-item .count');
    if (bookmarkCount) bookmarkCount.innerText = currentTweetData.bookmarks;
}

// 设置源编辑器
function setupSourceEditor() {
    const editor = document.getElementById('sourceEditor');
    const maxCharsInput = document.getElementById('maxChars');
    let timeout;

    const triggerLayout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            autoLayout();
        }, 800);
    };

    editor.addEventListener('input', triggerLayout);
    maxCharsInput.addEventListener('input', triggerLayout);

    // 处理粘贴（去除格式，保留图片）
    editor.addEventListener('paste', (e) => {
        setTimeout(() => {
            cleanEditorStyles(editor);
        }, 0);
    });
}

function cleanEditorStyles(editor) {
    // 简单清理：移除所有 style 属性
    const elements = editor.querySelectorAll('*');
    elements.forEach(el => {
        el.removeAttribute('style');
    });
}

// 核心功能：自动排版
function autoLayout() {
    const editor = document.getElementById('sourceEditor');
    const previewPanel = document.getElementById('previewPanel');
    const template = document.getElementById('cardTemplate');

    // 获取内容节点
    const nodes = Array.from(editor.childNodes);
    if (nodes.length === 0 && editor.innerText.trim() === '') return;

    // 分割内容
    const pages = splitContent(nodes);

    // 清空预览区
    previewPanel.innerHTML = '';

    // 渲染页面
    pages.forEach((pageContent, index) => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.phone-container');

        // 设置ID方便调试
        card.id = `card-${index}`;

        // 填充用户信息
        updateCardUserInfo(card);
        
        // 填充推文数据
        updateCardTweetData(card);

        // 填充内容
        const contentArea = card.querySelector('.post-content');
        contentArea.innerHTML = pageContent;

        previewPanel.appendChild(card);
    });
}

// 内容分割逻辑
function splitContent(nodes) {
    const pages = [];
    let currentBuffer = document.createElement('div');
    let currentTextLength = 0;

    // 换行符占用的"虚拟字符数"，降低成本以更准确反映实际字数
    const NEWLINE_COST = 10;

    // 获取字数限制 - 修复：确保正确获取输入值
    const maxCharsInput = document.getElementById('maxChars');
    const MAX_CHARS = parseInt(maxCharsInput.value) || 200;
    console.log('当前设置的每页字数:', MAX_CHARS);
    
    // 图片占用的虚拟字数，降低成本以允许更多内容
    const IMG_COST = 30;

    const pushPage = () => {
        if (currentBuffer.childNodes.length > 0) {
            pages.push(currentBuffer.innerHTML);
            currentBuffer = document.createElement('div');
            currentTextLength = 0;
        }
    };

    // 递归处理节点
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            if (!text) return;

            // 修复：直接处理整个文本，不按换行符分割
            let remainingText = text;
            
            while (remainingText.length > 0) {
                const availableSpace = MAX_CHARS - currentTextLength;
                
                if (availableSpace <= 0) {
                    // 当前页已满，创建新页
                    pushPage();
                    continue;
                }
                
                if (remainingText.length <= availableSpace) {
                    // 剩余文本可以全部放入当前页
                    currentBuffer.appendChild(document.createTextNode(remainingText));
                    currentTextLength += remainingText.length;
                    remainingText = '';
                } else {
                    // 剩余文本太长，需要分割
                    let splitIndex = availableSpace;
                    
                    // 尝试在空格或标点处分割，避免单词被截断
                    const lastSpaceIndex = remainingText.lastIndexOf(' ', splitIndex);
                    if (lastSpaceIndex > splitIndex - 20) {
                        splitIndex = lastSpaceIndex;
                    }
                    
                    // 如果找不到合适的分割点，就直接按字数分割
                    if (splitIndex <= 0) {
                        splitIndex = availableSpace;
                    }
                    
                    const chunk = remainingText.substring(0, splitIndex);
                    currentBuffer.appendChild(document.createTextNode(chunk));
                    pushPage();
                    remainingText = remainingText.substring(splitIndex).trimStart();
                }
            }

        } else if (node.tagName === 'BR') {
            // 处理换行符
            currentBuffer.appendChild(document.createElement('br'));
            currentTextLength += NEWLINE_COST;
            if (currentTextLength >= MAX_CHARS) {
                pushPage();
            }
        } else if (node.tagName === 'IMG') {
            // 处理图片：允许图片和文字出现在同一页
            const imgClone = node.cloneNode(true);
            // 添加样式限制图片尺寸，确保适应推文卡片宽度
            imgClone.style.maxWidth = '100%';
            imgClone.style.height = 'auto';
            imgClone.style.display = 'block';
            imgClone.style.margin = '10px 0';
            imgClone.style.borderRadius = '12px';
            
            // 如果添加图片会超过限制，先分页
            if (currentTextLength + IMG_COST > MAX_CHARS) {
                pushPage();
            }
            
            currentBuffer.appendChild(imgClone);
            currentTextLength += IMG_COST;
            
            // 如果添加图片后超过限制，分页
            if (currentTextLength >= MAX_CHARS) {
                pushPage();
            }
        } else {
            // 处理容器节点
            const isBlock = ['DIV', 'P', 'H1', 'H2', 'H3', 'LI'].includes(node.tagName);
            
            // 块级元素前添加换行
            if (isBlock && currentTextLength > 0) {
                currentBuffer.appendChild(document.createElement('br'));
                currentTextLength += NEWLINE_COST;
                if (currentTextLength >= MAX_CHARS) {
                    pushPage();
                }
            }
            
            // 递归处理子节点
            Array.from(node.childNodes).forEach(child => processNode(child));
            
            // 块级元素后添加换行
            if (isBlock) {
                currentBuffer.appendChild(document.createElement('br'));
                currentTextLength += NEWLINE_COST;
                if (currentTextLength >= MAX_CHARS) {
                    pushPage();
                }
            }
        }
    }
    
    // 处理所有节点
    nodes.forEach(node => processNode(node));
    
    // 推送最后一页
    pushPage();
    
    console.log('生成的页数:', pages.length);
    return pages;
}

// 导出功能
async function exportAllImages() {
    const cards = document.querySelectorAll('.phone-container');
    if (cards.length === 0) {
        alert('没有可导出的内容');
        return;
    }

    // 安全检查：如果在 file:// 协议下且使用默认头像（非 Base64），提示用户
    const isLocalFile = window.location.protocol === 'file:';
    const isDefaultAvatar = !currentUserInfo.avatar.startsWith('data:');

    if (isLocalFile && isDefaultAvatar) {
        const proceed = confirm('⚠️ 提示：\n检测到你正在直接运行 HTML 文件，且使用的是默认头像。\n\n浏览器的安全策略可能会阻止导出图片。\n\n建议：\n👉 点击头像上传一张本地图片（即使是同一张）\n👉 或者使用 VS Code "Live Server" 插件运行\n\n是否仍要尝试导出？');
        if (!proceed) return;
    } else if (!confirm(`准备导出 ${cards.length} 张图片，是否继续？`)) {
        return;
    }

    let successCount = 0;
    let failCount = 0;

    try {
        // 加载库
        if (typeof domtoimage === 'undefined') {
            await loadDomToImage();
        }

        for (let i = 0; i < cards.length; i++) {
            const success = await exportSingleCard(cards[i], i + 1);
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
            // 稍微暂停
            await new Promise(r => setTimeout(r, 500));
        }

        if (successCount === 0) {
            alert('导出失败！\n请尝试手动上传一张头像后再试。');
        } else {
            alert(`导出完成！\n成功: ${successCount}\n失败: ${failCount}`);
        }

    } catch (error) {
        console.error('导出过程出错:', error);
        alert('导出过程发生错误，请检查控制台。');
    }
}

async function exportSingleCard(element, index) {
    try {
        // 准备截图
        const originalOutline = element.style.outline;
        element.style.outline = 'none';

        // 处理 contenteditable
        const editables = element.querySelectorAll('[contenteditable]');
        editables.forEach(el => el.setAttribute('contenteditable', 'false'));
        
        // 隐藏滚动条
        const contentElement = element.querySelector('.content');
        const originalOverflow = contentElement.style.overflow;
        contentElement.style.overflow = 'hidden';
        
        // 确保内容完全渲染
        await new Promise(resolve => setTimeout(resolve, 100));

        // 使用 dom-to-image 导出（高清晰度）
        const scale = 3; // 3倍分辨率，提高清晰度
        const width = element.offsetWidth * scale;
        const height = element.offsetHeight * scale;

        const dataUrl = await domtoimage.toPng(element, {
            bgcolor: '#ffffff',
            quality: 1.0,
            width: width,
            height: height,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: element.offsetWidth + 'px',
                height: element.offsetHeight + 'px'
            }
        });

        // 恢复
        element.style.outline = originalOutline;
        editables.forEach(el => el.setAttribute('contenteditable', 'true'));
        
        // 恢复滚动条
        contentElement.style.overflow = originalOverflow;

        // 下载
        const link = document.createElement('a');
        link.download = `twitter-post-${index}-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();

        return true;

    } catch (e) {
        console.error(`导出第 ${index} 张失败:`, e);
        // 尝试恢复
        const editables = element.querySelectorAll('[contenteditable]');
        editables.forEach(el => el.setAttribute('contenteditable', 'true'));
        return false;
    }
}

// 加载 dom-to-image 库
function loadDomToImage() {
    return new Promise((resolve, reject) => {
        if (window.domtoimage) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// 重置内容
function resetContent() {
    if (confirm('确定要清空所有内容吗？')) {
        document.getElementById('sourceEditor').innerHTML = '';
        document.getElementById('previewPanel').innerHTML = '';
        // 恢复默认卡片
        autoLayout();
    }
}

console.log('Twitter 自动排版编辑器已加载');
