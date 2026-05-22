// header.js – الهيدر والهيرو وشريط البحث المتقدم (3 أوضاع + اقتراحات)

// ==================== قاعدة البيانات ====================
const dictionaryDB = [
    { id: 1, word: 'كتب', root: 'ك ت ب', rootLetters: ['ك','ت','ب'], meaning: 'الكتابة: خطّ الحروف وتسطيرها، والكَتْبُ: الجمع والضمّ.', chapter: 'ثلاثي', isUsed: true, derivations: ['كتاب','مكتبة','كاتب','مكتوب'], permutations: [{letters:'كتب',status:'مستعملة',isUsed:true},{letters:'كبت',status:'مستعملة',isUsed:true},{letters:'تبك',status:'مهملة',isUsed:false},{letters:'بكت',status:'مستعملة',isUsed:true}] },
    { id: 2, word: 'علم', root: 'ع ل م', rootLetters: ['ع','ل','م'], meaning: 'العِلْم: نقيض الجهل، وهو إدراك الشيء على ما هو به.', chapter: 'ثلاثي', isUsed: true, derivations: ['عالم','علامة','معلوم','تعليم'], permutations: [{letters:'علم',status:'مستعملة',isUsed:true},{letters:'عمل',status:'مستعملة',isUsed:true},{letters:'لمع',status:'مستعملة',isUsed:true}] },
    { id: 3, word: 'خرج', root: 'خ ر ج', rootLetters: ['خ','ر','ج'], meaning: 'الخروج: نقيض الدخول. خرج يخرج خروجاً.', chapter: 'ثلاثي', isUsed: true, derivations: ['خروج','مخرج','خراج','تخريج'], permutations: [{letters:'خرج',status:'مستعملة',isUsed:true},{letters:'جخر',status:'مستعملة',isUsed:true}] },
    { id: 4, word: 'ضرب', root: 'ض ر ب', rootLetters: ['ض','ر','ب'], meaning: 'الضرب: إيقاع شيء على شيء.', chapter: 'ثلاثي', isUsed: true, derivations: ['مضرب','ضارب','مضروب','تضارب'], permutations: [{letters:'ضرب',status:'مستعملة',isUsed:true},{letters:'ضبر',status:'مستعملة',isUsed:true},{letters:'ربض',status:'مستعملة',isUsed:true}] },
    { id: 5, word: 'حسن', root: 'ح س ن', rootLetters: ['ح','س','ن'], meaning: 'الحُسن: نقيض القبح.', chapter: 'ثلاثي', isUsed: true, derivations: ['إحسان','محسن','حسنة','تحسين'], permutations: [{letters:'حسن',status:'مستعملة',isUsed:true},{letters:'سحن',status:'مستعملة',isUsed:true},{letters:'نسح',status:'مستعملة',isUsed:true},{letters:'نحس',status:'مستعملة',isUsed:true}] },
    { id: 6, word: 'دحرج', root: 'د ح ر ج', rootLetters: ['د','ح','ر','ج'], meaning: 'الدحرجة: دفع الشيء وتقليبه.', chapter: 'رباعي', isUsed: true, derivations: ['تدحرج','مدحرج','دحرجة'], permutations: [{letters:'دحرج',status:'مستعملة',isUsed:true}] },
    { id: 7, word: 'زلزل', root: 'ز ل ز ل', rootLetters: ['ز','ل','ز','ل'], meaning: 'الزلزلة: الحركة الشديدة.', chapter: 'رباعي', isUsed: true, derivations: ['زلزال','زلزلة','مزلزل'], permutations: [{letters:'زلزل',status:'مستعملة',isUsed:true}] },
    { id: 8, word: 'سفرجل', root: 'س ف ر ج ل', rootLetters: ['س','ف','ر','ج','ل'], meaning: 'السفرجل: فاكهة معروفة.', chapter: 'خماسي', isUsed: true, derivations: ['سفرجلة'], permutations: [{letters:'سفرجل',status:'مستعملة',isUsed:true}] },
    { id: 9, word: 'كم', root: 'ك م', rootLetters: ['ك','م'], meaning: 'كم: حرف استفهام عن العدد.', chapter: 'ثنائي', isUsed: true, derivations: ['كمية','كِمّ'], permutations: [{letters:'كم',status:'مستعملة',isUsed:true},{letters:'مك',status:'مستعملة',isUsed:true}] },
    { id: 10, word: 'قمر', root: 'ق م ر', rootLetters: ['ق','م','ر'], meaning: 'القمر: جرم سماوي منير ليلاً.', chapter: 'ثلاثي', isUsed: true, derivations: ['قمري','قمار','مقامرة'], permutations: [{letters:'قمر',status:'مستعملة',isUsed:true},{letters:'قرم',status:'مستعملة',isUsed:true},{letters:'رمق',status:'مستعملة',isUsed:true},{letters:'مرق',status:'مستعملة',isUsed:true},{letters:'رقم',status:'مستعملة',isUsed:true}] }
];

// ==================== المتغيرات العامة ====================
let searchMode = 'word';
let searchTimeout = null;

// ==================== دوال البحث والاقتراحات ====================
function setSearchMode(mode, tabElement) {
    searchMode = mode;
    document.querySelectorAll('.search-tab').forEach(tab => tab.classList.remove('active'));
    if (tabElement) tabElement.classList.add('active');
    const input = document.getElementById('searchInput');
    if (mode === 'word') input.placeholder = 'اكتب الكلمة هنا... مثال: كتب، علم، خرج';
    else if (mode === 'root') input.placeholder = 'اكتب الجذر هنا... مثال: ك ت ب، ع ل م';
    else input.placeholder = 'اكتب الحروف هنا... مثال: ك ت، ب ك';
    input.value = '';
    document.getElementById('suggestionsDropdown').classList.remove('show');
}

// دالة لتوحيد النصوص العربية وإزالة التشكيل لزيادة دقة البحث بأضعاف
function normalizeArabic(text) {
    if (!text) return '';
    return text.replace(/[\u0617-\u061A\u064B-\u0652]/g, "") // إزالة التشكيل
               .replace(/[أإآ]/g, "ا") // توحيد الألف
               .replace(/ة/g, "ه") // توحيد التاء المربوطة
               .replace(/ى/g, "ي"); // توحيد الألف المقصورة
}

function handleSuggestions() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = document.getElementById('searchInput').value.trim();
        const dropdown = document.getElementById('suggestionsDropdown');
        if (query.length < 1) {
            dropdown.classList.remove('show');
            return;
        }
        let matches = [];
        const normQuery = normalizeArabic(query);
        if (searchMode === 'word') {
            matches = dictionaryDB.filter(e => 
                normalizeArabic(e.word).includes(normQuery) || 
                (e.derivations && e.derivations.some(d => normalizeArabic(d).includes(normQuery))) || 
                (e.permutations && e.permutations.some(p => normalizeArabic(p.letters).includes(normQuery)))
            );
        } else if (searchMode === 'root') {
            const clean = normQuery.replace(/\s+/g, '');
            matches = dictionaryDB.filter(e => normalizeArabic(e.root).replace(/\s+/g, '').includes(clean));
        } else {
            const clean = normQuery.replace(/\s+/g, '');
            matches = dictionaryDB.filter(e => normalizeArabic(e.rootLetters.join('')).includes(clean));
        }
        matches = matches.slice(0, 8);
        if (matches.length === 0) {
            dropdown.classList.remove('show');
            return;
        }
        dropdown.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="window.quickSearch('${m.word}')">
                <span class="sugg-word">${m.word}</span>
                <span class="sugg-root">${m.root}</span>
                <span class="sugg-meaning">${m.meaning.substring(0, 60)}...</span>
            </div>
        `).join('');
        dropdown.classList.add('show');
    }, 200);
}

window.quickSearch = function(word) {
    document.getElementById('searchInput').value = word;
    document.getElementById('suggestionsDropdown').classList.remove('show');
    performSearch();
};

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('الرجاء إدخال نص للبحث.');
        return;
    }
    let results = [];
    const normQuery = normalizeArabic(query);
    if (searchMode === 'word') {
        results = dictionaryDB.filter(e => 
            normalizeArabic(e.word).includes(normQuery) || 
            (e.derivations && e.derivations.some(d => normalizeArabic(d).includes(normQuery))) || 
            (e.permutations && e.permutations.some(p => normalizeArabic(p.letters).includes(normQuery))) ||
            normalizeArabic(e.meaning).includes(normQuery)
        );
        results.sort((a,b) => {
            const normA = normalizeArabic(a.word);
            const normB = normalizeArabic(b.word);
            if (normA === normQuery && normB !== normQuery) return -1;
            if (normB === normQuery && normA !== normQuery) return 1;
            if (normA.startsWith(normQuery) && !normB.startsWith(normQuery)) return -1;
            if (normB.startsWith(normQuery) && !normA.startsWith(normQuery)) return 1;
            const aDerivExact = a.derivations.some(d => normalizeArabic(d) === normQuery);
            const bDerivExact = b.derivations.some(d => normalizeArabic(d) === normQuery);
            if (aDerivExact && !bDerivExact) return -1;
            if (bDerivExact && !aDerivExact) return 1;
            return 0;
        });
    } else if (searchMode === 'root') {
        const clean = normQuery.replace(/\s+/g, '');
        results = dictionaryDB.filter(e => normalizeArabic(e.root).replace(/\s+/g, '').includes(clean));
    } else {
        const clean = normQuery.replace(/\s+/g, '');
        results = dictionaryDB.filter(e => normalizeArabic(e.rootLetters.join('')).includes(clean));
    }
    if (results.length === 0) {
        alert(`❌ لم يتم العثور على نتائج لـ "${query}" في وضع البحث بالـ${searchMode === 'word' ? 'كلمة' : (searchMode === 'root' ? 'جذر' : 'حروف')}.`);
        return;
    }
    let msg = `✅ تم العثور على ${results.length} نتيجة:\n`;
    results.forEach(r => { msg += `\n📖 ${r.word} (جذر: ${r.root})`; });
    msg += '\n\n(سيتم عرض التفاصيل الكاملة في قسم النتائج لاحقاً)';
    alert(msg);
    window.currentSearchResults = results;
    document.dispatchEvent(new CustomEvent('searchPerformed', { detail: { results, query } }));
}

// ==================== تأثير النافبار والقائمة المتنقلة ====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) navbar.classList.add('navbar-scrolled');
        else navbar.classList.remove('navbar-scrolled');
    });
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
        });
    }
}

// ==================== ربط الأحداث ====================
function bindEvents() {
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            setSearchMode(tab.getAttribute('data-mode'), tab);
        });
    });
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });
        searchInput.addEventListener('input', handleSuggestions);
    }
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('searchWrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            document.getElementById('suggestionsDropdown').classList.remove('show');
        }
    });
}

// ==================== التهيئة ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    bindEvents();
    setSearchMode('word', document.querySelector('.search-tab.active'));
    console.log(`🚀 header.js جاهز - ${dictionaryDB.length} كلمة في قاعدة البيانات`);
});

// abwab.js – تفعيل أزرار الأبواب (نفس الكود السابق مع تحسين)
(function() {
    function initAbwab() {
        if (typeof dictionaryDB === 'undefined') {
            console.warn('⚠️ abwab.js: dictionaryDB غير موجودة، تأكد من تحميل header.js أولاً.');
            return;
        }
        const buttons = document.querySelectorAll('.abwab-btn');
        if (buttons.length === 0) return;

        function filterByBab(babName) {
            let filtered = dictionaryDB.filter(entry => entry.chapter === babName);
            if (filtered.length === 0) {
                alert(`📭 لا توجد كلمات في باب "${babName}" ضمن قاعدة البيانات الحالية.`);
                return;
            }
            let wordList = filtered.map(e => e.word).join('، ');
            alert(`✅ باب ${babName} يحتوي على ${filtered.length} كلمة:\n${wordList}\n\n(سيتم عرض التفاصيل الكاملة في قسم النتائج قريباً)`);
            window.currentFilteredResults = filtered;
            window.currentFilterBab = babName;
            document.dispatchEvent(new CustomEvent('abwabFiltered', { detail: { results: filtered, bab: babName } }));
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const bab = this.getAttribute('data-bab');
                if (bab) filterByBab(bab);
            });
        });
        console.log('✅ abwab.js جاهز – أزرار الأبواب مرتبطة');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAbwab);
    } else {
        initAbwab();
    }
})();

// makharij.js – إضافة خاصية النطق الصوتي للحرف مع إظهار المخرج
(function() {
    // دالة للنطق باستخدام Web Speech API
    function speakLetter(letter) {
        if (!window.speechSynthesis) {
            console.warn("متصفحك لا يدعم خاصية تحويل النص إلى كلام");
            return;
        }
        // إيقاف أي نطق قيد التشغيل لتجنب التداخل
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.lang = 'ar-SA';       // اللغة العربية
        utterance.rate = 0.9;           // سرعة معتدلة
        utterance.pitch = 1;             // نبرة طبيعية
        utterance.volume = 1;
        
        // محاولة اختيار صوت عربي إن وجد
        let voices = window.speechSynthesis.getVoices();
        // بعض المتصفحات تحتاج انتظار تحميل الأصوات
        if (voices.length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', () => {
                voices = window.speechSynthesis.getVoices();
                const arabicVoice = voices.find(voice => voice.lang === 'ar-SA' || voice.lang === 'ar');
                if (arabicVoice) utterance.voice = arabicVoice;
                window.speechSynthesis.speak(utterance);
            });
        } else {
            const arabicVoice = voices.find(voice => voice.lang === 'ar-SA' || voice.lang === 'ar');
            if (arabicVoice) utterance.voice = arabicVoice;
            window.speechSynthesis.speak(utterance);
        }
    }

    function initMakharij() {
        const letterCards = document.querySelectorAll('.letter-card');
        if (letterCards.length === 0) return;

        letterCards.forEach(card => {
            // نضيف حدث النقر
            card.addEventListener('click', (e) => {
                // منع انتشار الحدث لتجنب أي تداخل
                e.stopPropagation();
                
                // الحصول على بيانات الحرف
                let letter = card.getAttribute('data-pronounce') || card.getAttribute('data-letter') || card.innerText.trim();
                let makhraj = card.getAttribute('data-makhraj');
                if (!makhraj) {
                    makhraj = 'سيتم إضافة التفاصيل لاحقاً.';
                }
                
                // نطق الحرف
                speakLetter(letter);
                
                // عرض المخرج في تنبيه (يمكن استبدالها بتوست لاحقاً)
                alert(`🔊 حرف: ${letter}\n📍 المخرج: ${makhraj}`);
            });
        });
        console.log('✅ makharij.js مع ميزة الصوت – جاهز');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMakharij);
    } else {
        initMakharij();
    }
})();

// results.js – عرض النتائج ديناميكياً، المودال، المفضلة، التاريخ، والتكامل مع header.js و abwab.js

(function() {
    // -------------------- الاعتماد على dictionaryDB من header.js --------------------
    if (typeof dictionaryDB === 'undefined') {
        console.error('❌ results.js: dictionaryDB غير موجودة. تأكد من تحميل header.js أولاً.');
        return;
    }

    // -------------------- المتغيرات العامة --------------------
    let currentResults = [];
    let currentDisplayedWordId = null;
    let favorites = JSON.parse(localStorage.getItem('almoein_favorites')) || [];
    let searchHistory = JSON.parse(localStorage.getItem('almoein_history')) || [];

    // -------------------- دوال التخزين المحلي --------------------
    function saveFavorites() { localStorage.setItem('almoein_favorites', JSON.stringify(favorites)); }
    function saveHistory() { localStorage.setItem('almoein_history', JSON.stringify(searchHistory)); }

    function addToFavorites(wordId) {
        const wordObj = dictionaryDB.find(w => w.id === wordId);
        if (!wordObj) return;
        if (!favorites.some(fav => fav.id === wordId)) {
            favorites.push({ id: wordId, word: wordObj.word });
            saveFavorites();
            renderFavoritesList(); // تحديث واجهة المفضلة إذا كانت موجودة
        }
    }
    function removeFromFavorites(wordId) {
        favorites = favorites.filter(fav => fav.id !== wordId);
        saveFavorites();
        renderFavoritesList();
    }
    function isFavorite(wordId) {
        return favorites.some(fav => fav.id === wordId);
    }
    function addToHistory(wordId) {
        const wordObj = dictionaryDB.find(w => w.id === wordId);
        if (!wordObj) return;
        searchHistory = searchHistory.filter(h => h.id !== wordId);
        searchHistory.unshift({ id: wordId, word: wordObj.word });
        if (searchHistory.length > 10) searchHistory.pop();
        saveHistory();
        renderHistoryList();
    }

    // -------------------- عرض المفضلة والتاريخ (إذا كانت الأقسام موجودة) --------------------
    function renderFavoritesList() {
        const container = document.getElementById('favoritesList');
        if (!container) return;
        if (favorites.length === 0) {
            container.innerHTML = '<li class="empty-msg">لا توجد كلمات مفضلة بعد.</li>';
            return;
        }
        container.innerHTML = favorites.map(fav => `
            <li>
                <span class="fav-word" data-word-id="${fav.id}">${fav.word}</span>
                <button class="remove-fav" data-word-id="${fav.id}"><i class="fa-regular fa-trash-can"></i></button>
            </li>
        `).join('');
        document.querySelectorAll('.fav-word').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.getAttribute('data-word-id'));
                const wordObj = dictionaryDB.find(w => w.id === id);
                if (wordObj) showWordDetailModal(wordObj);
            });
        });
        document.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-word-id'));
                removeFromFavorites(id);
            });
        });
    }

    function renderHistoryList() {
        const container = document.getElementById('historyList');
        if (!container) return;
        if (searchHistory.length === 0) {
            container.innerHTML = '<li class="empty-msg">لا يوجد سجل بحث بعد.</li>';
            return;
        }
        container.innerHTML = searchHistory.map(hist => `
            <li>
                <span class="history-word" data-word-id="${hist.id}">${hist.word}</span>
                <button class="remove-history" data-word-id="${hist.id}"><i class="fa-regular fa-trash-can"></i></button>
            </li>
        `).join('');
        document.querySelectorAll('.history-word').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.getAttribute('data-word-id'));
                const wordObj = dictionaryDB.find(w => w.id === id);
                if (wordObj) showWordDetailModal(wordObj);
            });
        });
        document.querySelectorAll('.remove-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute('data-word-id'));
                searchHistory = searchHistory.filter(h => h.id !== id);
                saveHistory();
                renderHistoryList();
            });
        });
    }

    // -------------------- عرض بطاقات النتائج --------------------
    function renderResults(results, queryTitle) {
        const container = document.getElementById('resultsListContainer');
        const section = document.getElementById('wordResultSection');
        const titleSpan = document.getElementById('resultsQueryTitle');
        const noResultsDiv = document.getElementById('noResultsMessage');

        if (!container || !section) return;

        if (!results || results.length === 0) {
            container.innerHTML = '';
            noResultsDiv.style.display = 'block';
            titleSpan.innerText = queryTitle || '---';
            section.style.display = 'block';
            return;
        }

        noResultsDiv.style.display = 'none';
        titleSpan.innerText = queryTitle || ` (${results.length} نتيجة)`;
        container.innerHTML = results.map(entry => `
            <div class="result-word-card" data-word-id="${entry.id}">
                <div class="card-word-main">
                    <span class="card-word">${entry.word}</span>
                    <span class="card-root">${entry.root}</span>
                </div>
                <div class="card-meaning-preview">${entry.meaning.substring(0, 100)}...</div>
                <div class="card-meta">
                    <span class="${entry.isUsed ? 'badge-used' : 'badge-unused'}">${entry.isUsed ? '✓ مستعملة' : '✗ مهملة'}</span>
                    <span class="badge-chapter">${entry.chapter}</span>
                    <span style="color:#aaa;">${entry.derivations.length} اشتقاق | ${entry.permutations.length} تقليب</span>
                </div>
            </div>
        `).join('');

        // إضافة حدث النقر لكل بطاقة
        document.querySelectorAll('.result-word-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.getAttribute('data-word-id'));
                const wordObj = dictionaryDB.find(w => w.id === id);
                if (wordObj) showWordDetailModal(wordObj);
            });
        });

        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // -------------------- المودال التفصيلي --------------------
    function showWordDetailModal(wordObj) {
        if (!wordObj) return;
        addToHistory(wordObj.id);

        const modalOverlay = document.getElementById('wordModalOverlay');
        const modalContent = document.getElementById('modalContent');
        if (!modalOverlay || !modalContent) return;

        const permHTML = wordObj.permutations.map(p => `
            <span class="perm-item ${p.isUsed ? 'perm-used' : 'perm-unused'}" title="${p.status}">
                ${p.letters} <small>(${p.status})</small>
            </span>
        `).join('');
        const derivHTML = wordObj.derivations.map(d => `<span class="deriv-tag">${d}</span>`).join('');

        modalContent.innerHTML = `
            <div class="modal-word-title">${wordObj.word}</div>
            <div class="modal-root-highlight"><span>الجذر: ${wordObj.root}</span></div>
            <div class="detail-section"><h4>📖 المعنى</h4><p class="meaning-text">${wordObj.meaning}</p></div>
            <div class="detail-section">
                <h4>📌 معلومات الكلمة</h4>
                <div class="info-grid">
                    <div class="info-item"><span>الباب</span><span>${wordObj.chapter}</span></div>
                    <div class="info-item"><span>الحالة</span><span style="color:${wordObj.isUsed ? '#2e6b47' : '#b33'}">${wordObj.isUsed ? 'مستعملة' : 'مهملة'}</span></div>
                    <div class="info-item"><span>الاشتقاقات</span><span>${wordObj.derivations.length}</span></div>
                    <div class="info-item"><span>التقليبات</span><span>${wordObj.permutations.length}</span></div>
                </div>
            </div>
            <div class="detail-section"><h4>🌿 الاشتقاقات</h4><div class="derivations-list">${derivHTML}</div></div>
            <div class="detail-section"><h4>🔄 تقليبات الحروف</h4><div class="permutations-grid">${permHTML}</div></div>
            <button class="fav-modal-btn" id="modalFavBtn">${isFavorite(wordObj.id) ? '❤️ أُضيفت إلى المفضلة' : '🤍 حفظ إلى المفضلة'}</button>
        `;

        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const favBtn = document.getElementById('modalFavBtn');
        if (favBtn) {
            favBtn.onclick = () => {
                if (isFavorite(wordObj.id)) {
                    removeFromFavorites(wordObj.id);
                    favBtn.innerHTML = '🤍 حفظ إلى المفضلة';
                } else {
                    addToFavorites(wordObj.id);
                    favBtn.innerHTML = '❤️ أُضيفت إلى المفضلة';
                }
                renderFavoritesList();
            };
        }
    }

    function closeModal() {
        const modalOverlay = document.getElementById('wordModalOverlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // -------------------- التعامل مع أحداث البحث والأبواب --------------------
    function setupEventListeners() {
        // حدث البحث من header.js
        document.addEventListener('searchPerformed', (e) => {
            const { results, query } = e.detail;
            currentResults = results;
            renderResults(results, query);
        });

        // حدث تصفية الأبواب من abwab.js
        document.addEventListener('abwabFiltered', (e) => {
            const { results, bab } = e.detail;
            currentResults = results;
            renderResults(results, `باب ${bab}`);
        });

        // إغلاق المودال
        const closeBtn = document.getElementById('closeModalBtn');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            const overlay = document.getElementById('wordModalOverlay');
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // -------------------- تهيئة قسم المفضلة والتاريخ إذا وجد --------------------
    function initFavHistory() {
        renderFavoritesList();
        renderHistoryList();
        // إضافة مستمعين لأزرار المسح
        const clearFavBtn = document.getElementById('clearFavoritesBtn');
        if (clearFavBtn) {
            clearFavBtn.addEventListener('click', () => {
                favorites = [];
                saveFavorites();
                renderFavoritesList();
            });
        }
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                searchHistory = [];
                saveHistory();
                renderHistoryList();
            });
        }
    }

    // -------------------- بدء التشغيل --------------------
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        initFavHistory();
        console.log('✅ results.js جاهز – نظام النتائج الديناميكي يعمل');
    });
})();

// favorites-history.js – إدارة المفضلة وسجل البحث بشكل مستقل (يعتمد على dictionaryDB)
(function() {
    if (typeof dictionaryDB === 'undefined') {
        console.error('❌ favorites-history.js: dictionaryDB غير موجودة.');
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('almoein_favorites')) || [];
    let searchHistory = JSON.parse(localStorage.getItem('almoein_history')) || [];

    function saveFavorites() { localStorage.setItem('almoein_favorites', JSON.stringify(favorites)); }
    function saveHistory() { localStorage.setItem('almoein_history', JSON.stringify(searchHistory)); }

    function addToFavorites(wordId) {
        const wordObj = dictionaryDB.find(w => w.id === wordId);
        if (!wordObj) return;
        if (!favorites.some(fav => fav.id === wordId)) {
            favorites.push({ id: wordId, word: wordObj.word });
            saveFavorites();
            renderFavorites();
        }
    }
    function removeFromFavorites(wordId) {
        favorites = favorites.filter(fav => fav.id !== wordId);
        saveFavorites();
        renderFavorites();
    }
    function addToHistory(wordId) {
        const wordObj = dictionaryDB.find(w => w.id === wordId);
        if (!wordObj) return;
        searchHistory = searchHistory.filter(h => h.id !== wordId);
        searchHistory.unshift({ id: wordId, word: wordObj.word });
        if (searchHistory.length > 10) searchHistory.pop();
        saveHistory();
        renderHistory();
    }

    function renderFavorites() {
        const container = document.getElementById('favoritesList');
        if (!container) return;
        if (favorites.length === 0) {
            container.innerHTML = '<li class="empty-msg">لا توجد كلمات مفضلة بعد.</li>';
            return;
        }
        container.innerHTML = favorites.map(fav => `
            <li>
                <span class="fav-word" data-word-id="${fav.id}">${fav.word}</span>
                <button class="remove-fav" data-word-id="${fav.id}"><i class="fa-regular fa-trash-can"></i></button>
            </li>
        `).join('');
        document.querySelectorAll('.fav-word').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.dataset.wordId);
                const word = dictionaryDB.find(w => w.id === id);
                if (word) showWordDetail(word); // يجب تعريف showWordDetail أو استخدام حدث مخصص
            });
        });
        document.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.wordId);
                removeFromFavorites(id);
            });
        });
    }

    function renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;
        if (searchHistory.length === 0) {
            container.innerHTML = '<li class="empty-msg">لا يوجد سجل بحث بعد.</li>';
            return;
        }
        container.innerHTML = searchHistory.map(hist => `
            <li>
                <span class="history-word" data-word-id="${hist.id}">${hist.word}</span>
                <button class="remove-history" data-word-id="${hist.id}"><i class="fa-regular fa-trash-can"></i></button>
            </li>
        `).join('');
        document.querySelectorAll('.history-word').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.dataset.wordId);
                const word = dictionaryDB.find(w => w.id === id);
                if (word) showWordDetail(word);
            });
        });
        document.querySelectorAll('.remove-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.wordId);
                searchHistory = searchHistory.filter(h => h.id !== id);
                saveHistory();
                renderHistory();
            });
        });
    }

    // تعريف دالة showWordDetail مؤقتاً لفتح المودال (يمكن ربطها مع results.js)
    window.showWordDetail = function(wordObj) {
        // نطلق حدثاً ليفتح results.js المودال
        const event = new CustomEvent('showWordDetail', { detail: { word: wordObj } });
        document.dispatchEvent(event);
    };

    // أزرار المسح
    function bindClearButtons() {
        const clearFav = document.getElementById('clearFavoritesBtn');
        if (clearFav) {
            clearFav.addEventListener('click', () => {
                favorites = [];
                saveFavorites();
                renderFavorites();
            });
        }
        const clearHist = document.getElementById('clearHistoryBtn');
        if (clearHist) {
            clearHist.addEventListener('click', () => {
                searchHistory = [];
                saveHistory();
                renderHistory();
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderFavorites();
        renderHistory();
        bindClearButtons();
        console.log('✅ favorites-history.js جاهز');
    });
})();

// about.js – يمكن إضافة عدادات ديناميكية أو تأثيرات بسيطة، لكنه ثابت حالياً
(function() {
    function initAbout() {
        // يمكنك لاحقاً تحديث الأرقام ديناميكياً من قاعدة البيانات
        // مثلاً: عرض عدد الجذور الفعلية من dictionaryDB
        if (typeof dictionaryDB !== 'undefined') {
            const uniqueRoots = new Set();
            dictionaryDB.forEach(entry => {
                const rootKey = entry.root.replace(/\s/g, '');
                uniqueRoots.add(rootKey);
            });
            const rootsCountElem = document.querySelector('.stat-box:first-child span');
            if (rootsCountElem && uniqueRoots.size > 10) {
                rootsCountElem.innerText = '+' + uniqueRoots.size;
            }
        }
        console.log('✅ about.js جاهز (قسم عن معجم العين)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAbout);
    } else {
        initAbout();
    }
})();

// footer.js – إضافة سلاسة الانتقال للروابط الداخلية ومنع التحميل الافتراضي
(function() {
    function initFooter() {
        const allLinks = document.querySelectorAll('.footer a');
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        });
        console.log('✅ footer.js جاهز');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter);
    } else {
        initFooter();
    }
})();


// back-to-top.js – إظهار الزر عند التمرير لأسفل ونعومة العودة للأعلى
(function() {
    const backBtn = document.getElementById('backToTopBtn');
    if (!backBtn) return;

    function toggleBackToTop() {
        if (window.scrollY > 400) {
            backBtn.classList.add('show');
        } else {
            backBtn.classList.remove('show');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    window.addEventListener('scroll', toggleBackToTop);
    backBtn.addEventListener('click', scrollToTop);
    toggleBackToTop(); // فحص أولي

    console.log('✅ زر العودة للأعلى جاهز');
})();