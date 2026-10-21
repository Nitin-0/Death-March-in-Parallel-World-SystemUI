/* =========================================================================
   1. ANIMATED PURPLE MIASMA / CLOUD BACKGROUND (Matching Screenshot Scene)
   ========================================================================= */
const canvas = document.getElementById('miasmaCanvas');
const ctx = canvas.getContext('2d');
let w, h;

const cloudPuffs = [];
function initClouds() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cloudPuffs.length = 0;

    const horizonY = h * 0.34;
    for (let i = 0; i < 65; i++) {
        const yNorm = Math.pow(Math.random(), 0.85);
        const y = horizonY + yNorm * (h - horizonY + 80);
        const radius = 90 + yNorm * 220 + Math.random() * 90;
        cloudPuffs.push({
            x: Math.random() * (w + 400) - 200,
            y: y,
            r: radius,
            vx: (0.08 + yNorm * 0.22) * (Math.random() > 0.5 ? 1 : -1),
            lightness: Math.random(),
            phase: Math.random() * Math.PI * 2
        });
    }
    cloudPuffs.sort((a, b) => a.y - b.y);
}

function renderClouds(time) {
    ctx.clearRect(0, 0, w, h);
    const horizonY = h * 0.33;

    // Dark sky above horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 40);
    skyGrad.addColorStop(0, '#180a19');
    skyGrad.addColorStop(0.75, '#251026');
    skyGrad.addColorStop(1, '#4c1b44');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 40);

    // Bright magenta horizon rim glow
    const rimGrad = ctx.createLinearGradient(0, horizonY - 20, 0, horizonY + 95);
    rimGrad.addColorStop(0, 'rgba(135, 45, 118, 0)');
    rimGrad.addColorStop(0.35, 'rgba(148, 52, 130, 0.65)');
    rimGrad.addColorStop(1, 'rgba(65, 20, 58, 0.9)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, horizonY - 20, w, 120);

    // Volumetric cloud puffs
    for (const p of cloudPuffs) {
        p.x += p.vx;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.x < -p.r) p.x = w + p.r;

        const grad = ctx.createRadialGradient(
            p.x, p.y - p.r * 0.22, p.r * 0.08,
            p.x, p.y, p.r
        );

        if (p.lightness > 0.55) {
            grad.addColorStop(0, 'rgba(128, 45, 112, 0.42)');
            grad.addColorStop(0.55, 'rgba(78, 25, 68, 0.32)');
            grad.addColorStop(1, 'rgba(34, 11, 30, 0)');
        } else {
            grad.addColorStop(0, 'rgba(42, 14, 38, 0.65)');
            grad.addColorStop(0.6, 'rgba(28, 9, 25, 0.45)');
            grad.addColorStop(1, 'rgba(20, 6, 18, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(renderClouds);
}

window.addEventListener('resize', initClouds);
initClouds();
requestAnimationFrame(renderClouds);

/* =========================================================================
   2. SATOU'S SYSTEM DATA STATE (Lv 1 Default vs Lv 310 Post-Meteor Shower)
   ========================================================================= */
const satouState = {
    level: 1,
    expPercent: 0,
    statPointsAvailable: 0,
    title: 'Title: None',
    stats: { str: 9, vit: 7, dex: 3, agi: 5, int: 7, mnd: 3 },
    bonus: { str: 0, vit: 0, dex: 0, agi: 0, int: 0, mnd: 0 },
    hp: [10, 10],
    mp: [10, 10],
    sp: [10, 10],
    skills: [
        { name: 'Self-Regeneration', lv: 1, max: 10, active: true },
        { name: 'Arithmetic', lv: 1, max: 10, active: true },
        { name: 'Etiquette', lv: 1, max: 10, active: true },
        { name: 'Gaming', lv: 1, max: 10, active: true },
        { name: 'Cooking', lv: 1, max: 10, active: true },
        { name: 'Crisis Perception', lv: 1, max: 10, active: true },
        { name: 'Throwing', lv: 1, max: 10, active: true },
        { name: 'Magic Art', lv: 1, max: 10, active: false }
    ],
    logs: [
        'System booted successfully.',
        'Current Location: Dragon\'s Valley',
        'Initial item [Meteor Shower ×3] set to Shortcut Slot 1.'
    ]
};

const toastEl = document.getElementById('sysToast');
let toastTimer = null;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* Update UI from satouState */
function syncStatusUI() {
    document.getElementById('charLvText').textContent = `Lv ${satouState.level}`;
    document.getElementById('expBarFill').style.width = `${satouState.expPercent}%`;
    document.getElementById('currentTitleText').textContent = satouState.title;
    document.getElementById('dockTitleText').textContent = satouState.title;

    const rows = document.querySelectorAll('#abilityList .ability-row');
    const keys = ['str', 'vit', 'dex', 'agi', 'int', 'mnd'];
    rows.forEach((row, idx) => {
        const k = keys[idx];
        row.querySelector('.stat-point-box').textContent = satouState.stats[k];
        row.querySelector('.stat-bonus').textContent = `+${satouState.bonus[k]}`;
    });

    document.getElementById('hpTextBox').textContent = `${satouState.hp[0]} / ${satouState.hp[1]}`;
    document.getElementById('mpTextBox').textContent = `${satouState.mp[0]} / ${satouState.mp[1]}`;
    document.getElementById('spTextBox').textContent = `${satouState.sp[0]} / ${satouState.sp[1]}`;
}

/* Trigger Meteor Shower (Level 1 -> Level 310 canonical anime moment!) */
function triggerMeteorShower() {
    const flash = document.getElementById('meteorFlash');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 650);

    if (satouState.level === 1) {
        satouState.level = 310;
        satouState.expPercent = 94;
        satouState.statPointsAvailable = 3090;
        satouState.title = 'Title: God Slayer';
        satouState.stats = { str: 99, vit: 99, dex: 99, agi: 99, int: 99, mnd: 99 };
        satouState.bonus = { str: 15, vit: 15, dex: 15, agi: 15, int: 15, mnd: 15 };
        satouState.hp = [3100, 3100];
        satouState.mp = [3100, 3100];
        satouState.sp = [3100, 3100];
        satouState.logs.unshift('[All-Map Strategic Magic: Meteor Shower] activated!');
        satouState.logs.unshift('Dragon God Akura-Ou and hundreds of thousands of monsters defeated.');
        satouState.logs.unshift('Level increased from 1 → 310!');
        showToast('[Meteor Shower] Cast! Level 1 → Level 310 reached!');
    } else {
        // Toggle back to exact Level 1 screenshot state
        satouState.level = 1;
        satouState.expPercent = 0;
        satouState.statPointsAvailable = 0;
        satouState.title = 'Title: None';
        satouState.stats = { str: 9, vit: 7, dex: 3, agi: 5, int: 7, mnd: 3 };
        satouState.bonus = { str: 0, vit: 0, dex: 0, agi: 0, int: 0, mnd: 0 };
        satouState.hp = [10, 10];
        satouState.mp = [10, 10];
        satouState.sp = [10, 10];
        showToast('Reset to initial stats (Level 1)');
    }
    syncStatusUI();
}

/* Ability Point Box Click (Increment stat) */
document.querySelectorAll('.stat-point-box').forEach(box => {
    box.addEventListener('click', () => {
        const stat = box.dataset.stat;
        satouState.stats[stat] = (satouState.stats[stat] % 99) + 1;
        syncStatusUI();
        showToast(`${stat.toUpperCase()} changed to ${satouState.stats[stat]}`);
    });
});

/* Title Dropdown Selector */
const titleTrigger = document.getElementById('titleDropdownTrigger');
const titleMenu = document.getElementById('titleDropdownMenu');

titleTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    titleMenu.classList.toggle('open');
});

document.querySelectorAll('.title-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.title-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        satouState.title = opt.dataset.title;
        syncStatusUI();
        titleMenu.classList.remove('open');
        showToast(`Title set to "${satouState.title}"`);
    });
});

document.addEventListener('click', () => titleMenu.classList.remove('open'));

// Bottom dock title bar cycles titles too
const titlesList = ['Title: None', 'Title: God Slayer', 'Title: Dragon Slayer', 'Title: Natural Disaster', 'Title: Hero'];
document.getElementById('dockTitleBar').addEventListener('click', () => {
    const idx = (titlesList.indexOf(satouState.title) + 1) % titlesList.length;
    satouState.title = titlesList[idx];
    syncStatusUI();
    showToast(`Switched title to "${satouState.title}"`);
});

// EXP bar click test
document.querySelector('.exp-bar-box').addEventListener('click', () => {
    satouState.expPercent = (satouState.expPercent + 25) % 100;
    syncStatusUI();
});

// Center HP/MP/SP gauges click toggles Lv1 <-> Lv310
document.getElementById('dockGaugesBtn').addEventListener('click', triggerMeteorShower);

/* =========================================================================
   3. WINDOW TABS & BOTTOM HEX NAVIGATION MENU SWITCHING
   ========================================================================= */
const mainWin = document.getElementById('mainSysWindow');
const winHeaderTitle = document.getElementById('winHeaderTitle');
const winSubnav = document.getElementById('winSubnav');
const tabStatus = document.getElementById('tabContentStatus');
const tabOther = document.getElementById('tabContentOther');
const dynamicBody = document.getElementById('dynamicPanelBody');

function setActiveRightHex(menuKey) {
    const rightMenus = ['status', 'skills', 'storage', 'magic', 'journal', 'log', 'settings'];
    rightMenus.forEach(k => {
        const el = document.querySelector(`.hex-slot[data-menu="${k}"]`);
        if (!el) return;
        const outer = el.querySelector('.hex-outer');
        const inner = el.querySelector('.hex-inner');
        if (k === menuKey) {
            outer.setAttribute('fill', '#9e987b');
            inner.setAttribute('fill', '#7d7860');
            inner.setAttribute('stroke', '#e8e4ce');
        } else if (k === 'log' || k === 'settings') {
            outer.setAttribute('fill', '#8d99a6');
            inner.setAttribute('fill', '#a2b0bf');
            inner.setAttribute('stroke', '#d0d9e3');
        } else {
            outer.setAttribute('fill', '#bab496');
            inner.setAttribute('fill', '#d6d1b8');
            inner.setAttribute('stroke', '#857f66');
        }
    });
}

function renderPanelView(viewType) {
    mainWin.classList.remove('hidden');

    if (viewType === 'status') {
        winHeaderTitle.textContent = 'CHARACTER';
        winSubnav.innerHTML = `
        <div class="subnav-tab active" data-subtab="status">STATUS</div>
        <div class="subnav-tab" data-subtab="parameter">PARAMETER</div>
      `;
        tabStatus.style.display = 'block';
        tabOther.style.display = 'none';
        bindSubnavClicks();
        setActiveRightHex('status');
        return;
    }

    tabStatus.style.display = 'none';
    tabOther.style.display = 'grid';

    if (viewType === 'parameter') {
        winHeaderTitle.textContent = 'CHARACTER';
        winSubnav.innerHTML = `
        <div class="subnav-tab" data-subtab="status">STATUS</div>
        <div class="subnav-tab active" data-subtab="parameter">PARAMETER</div>
      `;
        bindSubnavClicks();
        dynamicBody.innerHTML = `
        <div style="font-size:10px; color:#dcd7c4; display:flex; flex-direction:column; gap:7px;">
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid #595349; padding-bottom:4px;">
            <span>Physical Attack (ATK)</span><strong style="font-family:Rajdhani; font-size:13px;">${satouState.stats.str * 2 + 5}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid #595349; padding-bottom:4px;">
            <span>Physical Defense (DEF)</span><strong style="font-family:Rajdhani; font-size:13px;">${satouState.stats.vit * 2 + 3}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid #595349; padding-bottom:4px;">
            <span>Magic Attack (MATK)</span><strong style="font-family:Rajdhani; font-size:13px;">${satouState.stats.int * 2 + 8}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid #595349; padding-bottom:4px;">
            <span>Magic Defense (MDEF)</span><strong style="font-family:Rajdhani; font-size:13px;">${satouState.stats.mnd * 2 + 4}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid #595349; padding-bottom:4px;">
            <span>Evasion / Agility (SPD)</span><strong style="font-family:Rajdhani; font-size:13px;">${satouState.stats.agi * 3}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding-top:4px; color:#dfd07c;">
            <span>Remaining Stat Points</span><strong style="font-family:Rajdhani; font-size:13px;">${satouState.statPointsAvailable} pt</strong>
          </div>
        </div>
      `;
    } else if (viewType === 'skills') {
        setActiveRightHex('skills');
        openCharWindow('skills');
        return;
    } else if (viewType === 'magic') {
        setActiveRightHex('magic');
        openCharWindow('spells');
        return;
    } else if (viewType === 'storage') {
        setActiveRightHex('storage');
        winHeaderTitle.textContent = 'STORAGE';
        winSubnav.innerHTML = `<div class="subnav-tab active">STORAGE</div><div class="subnav-tab">EQUIPMENT</div>`;
        dynamicBody.innerHTML = `
        <div class="custom-scroll">
          <div class="skill-item"><span>Casual Wear (Hoodie & Jeans)</span><span style="color:#a8e090;">E</span></div>
          <div class="skill-item"><span>Dragon God Fang & Scale Materials</span><span style="font-family:Rajdhani;">×999</span></div>
          <div class="skill-item"><span>Holy Sword Durandal</span><span style="font-family:Rajdhani;">×1</span></div>
          <div class="skill-item"><span>Gold & Platinum Coins</span><span style="font-family:Rajdhani;">×14,500,000</span></div>
        </div>
      `;
    } else if (viewType === 'journal') {
        setActiveRightHex('journal');
        winHeaderTitle.textContent = 'QUESTS & LORE';
        winSubnav.innerHTML = `<div class="subnav-tab active">WORLD INFO</div>`;
        dynamicBody.innerHTML = `
        <div style="font-size:10px; line-height:1.6; color:#ddd8c7;">
          <p style="margin-bottom:6px; color:#dfd07c; font-weight:700;">■ Current Location: Dragon's Valley</p>
          <p style="margin-bottom:8px;">A wasteland located on the outer fringes of the Shiga Kingdom. Habitat for lesser dragons and lizardmen tribes.</p>
          <p style="color:#b8b296;">* Drag the minimap to inspect surrounding terrain.</p>
        </div>
      `;
    } else if (viewType === 'log') {
        setActiveRightHex('log');
        winHeaderTitle.textContent = 'SYSTEM LOG';
        winSubnav.innerHTML = `<div class="subnav-tab active">SYSTEM LOG</div>`;
        dynamicBody.innerHTML = `
        <div class="custom-scroll" style="font-size:9.5px; line-height:1.55;">
          ${satouState.logs.map(l => `<div style="padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.08);">• ${l}</div>`).join('')}
        </div>
      `;
    } else if (viewType === 'settings') {
        setActiveRightHex('settings');
        winHeaderTitle.textContent = 'SYSTEM CONFIG';
        winSubnav.innerHTML = `<div class="subnav-tab active">CONFIG</div>`;
        dynamicBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px; font-size:10px;">
          <div class="skill-item" onclick="triggerMeteorShower()">
            <span>Toggle Status Mode (Lv 1 ⇔ Lv 310)</span>
            <span style="color:#dfd07c;">EXEC</span>
          </div>
          <div class="skill-item" onclick="resetWinPos()">
            <span>Reset Window Position to Center</span>
            <span>EXEC</span>
          </div>
          <div style="font-size:9px; color:#aca798; padding-top:4px;">
            Menu Rows: 3 Lines | Column Display: Detailed Mode
          </div>
        </div>
      `;
    }
}

function renderSkillItems() {
    dynamicBody.innerHTML = `
      <div class="custom-scroll">
        ${satouState.skills.map((s, idx) => `
          <div class="skill-item ${s.active ? '' : 'unactivated'}" data-sidx="${idx}">
            <span>${s.name}</span>
            <div class="skill-lv-Controls">
              <span>Lv ${s.lv}/${s.max}</span>
              <div class="skill-btn-mini" onclick="upgradeSkill(event, ${idx})">+</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
}

window.upgradeSkill = function (e, idx) {
    e.stopPropagation();
    const sk = satouState.skills[idx];
    sk.active = true;
    sk.lv = sk.lv < sk.max ? sk.lv + 1 : 1;
    renderSkillItems();
    showToast(`Skill [${sk.name}] set to Lv ${sk.lv}`);
};

function bindSubnavClicks() {
    winSubnav.querySelectorAll('.subnav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.subtab;
            if (target) renderPanelView(target);
        });
    });
}
bindSubnavClicks();

// Right Wing Menu Hex Clicks
document.querySelectorAll('.hex-slot[data-menu]').forEach(slot => {
    slot.addEventListener('click', () => {
        const menu = slot.dataset.menu;
        renderPanelView(menu);
    });
});

// Left Wing Action Hex Clicks
document.querySelectorAll('.hex-slot[data-action]').forEach(slot => {
    slot.addEventListener('click', () => {
        const act = slot.dataset.action;
        if (act === 'meteor') {
            triggerMeteorShower();
        } else if (act === 'radar') {
            if (typeof triggerRadarScan === 'function') {
                triggerRadarScan();
            } else {
                showToast('Radar / Detection Scan initialized');
            }
        } else if (act.startsWith('alert')) {
            slot.classList.remove('pulse-hex');
            renderPanelView('skills');
            showToast('Opened acquired skill list');
        } else {
            showToast('This shortcut slot is unassigned');
        }
    });
});

// Close button on center window
document.getElementById('winCloseBtn').addEventListener('click', () => {
    mainWin.classList.add('hidden');
    showToast('Window closed (Click bottom menu icons to re-open)');
});

/* =========================================================================
   4. DRAGGABLE CENTER WINDOWS & INTERACTIVE MINIMAP ZOOM/PAN
   ========================================================================= */
const dragHandle = document.getElementById('winDragHandle');
let isDraggingWin = false, winStartX = 0, winStartY = 0, winOrigLeft = 0, winOrigTop = 0;

dragHandle.addEventListener('mousedown', (e) => {
    if (e.target.id === 'winCloseBtn') return;
    isDraggingWin = true;
    const rect = mainWin.getBoundingClientRect();
    winOrigLeft = rect.left;
    winOrigTop = rect.top;
    winStartX = e.clientX;
    winStartY = e.clientY;
    mainWin.style.zIndex = '25';
    if (charWin) charWin.style.zIndex = '20';
});

/* =========================================================================
   5. AUTHENTIC CHARACTER -> SKILLS / SPELLS WINDOW CONTROLLER (from index2.html)
   ========================================================================= */
const SKILL_ICONS = {
    mind: `<svg viewBox="0 0 36 36" fill="none">
      <path d="M18 4L30 18L18 32L6 18L18 4Z" fill="#4f292b" stroke="#2d1718" stroke-width="2"/>
      <path d="M14 14C14 11.5 16 10 18 10C20 10 22 11.5 22 14C22 16 20 17.5 19 19H17C16 17.5 14 16 14 14Z" fill="#d9c6a3"/>
      <path d="M23 14L29 17V24C29 27.5 26 30 23 31C20 30 17 27.5 17 24V17L23 14Z" fill="#6b5e49" stroke="#d9c6a3" stroke-width="1.4"/>
    </svg>`,
    sewing: `<svg viewBox="0 0 28 28" fill="none">
      <path d="M20 4L15 24" stroke="#473c2c" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M6 12C9 6 13 20 16 13C19 6 22 16 24 10" stroke="#473c2c" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    service: `<svg viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="15" rx="9" ry="3.5" fill="#473c2c"/>
      <path d="M8 12C10 9 18 9 20 12" stroke="#473c2c" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    contract: `<svg viewBox="0 0 28 28" fill="none">
      <path d="M8 6H18L21 9V22H8V6Z" fill="#473c2c"/>
      <path d="M11 11H17M11 15H17M11 18H15" stroke="#d8d0b2" stroke-width="1.6"/>
    </svg>`,
    petrify: `<svg viewBox="0 0 28 28" fill="none">
      <circle cx="11" cy="15" r="5" fill="#59322c"/>
      <path d="M15 9L22 12V20L15 23L10 19V12L15 9Z" fill="#59322c" stroke="#d8d0b2" stroke-width="1.2"/>
    </svg>`,
    rot: `<svg viewBox="0 0 28 28" fill="none">
      <path d="M14 5L22 9V17C22 21.5 18.5 24.5 14 26C9.5 24.5 6 21.5 6 17V9L14 5Z" fill="#5b6635"/>
      <circle cx="12" cy="14" r="2" fill="#d8d0b2"/>
      <circle cx="17" cy="17" r="2.2" fill="#d8d0b2"/>
    </svg>`,
    disease: `<svg viewBox="0 0 28 28" fill="none">
      <ellipse cx="10" cy="13" rx="3.5" ry="5" transform="rotate(-20 10 13)" fill="#63322c"/>
      <ellipse cx="18" cy="16" rx="3.5" ry="5" transform="rotate(20 18 16)" fill="#63322c"/>
    </svg>`,
    poison: `<svg viewBox="0 0 28 28" fill="none">
      <path d="M11 7H17V11L21 17C21 20.5 18 23 14 23C10 23 7 20.5 7 17L11 11V7Z" fill="#59322c"/>
      <circle cx="14" cy="17" r="2.5" fill="#d8d0b2"/>
    </svg>`,
    paralysis: `<svg viewBox="0 0 28 28" fill="none">
      <path d="M8 9L13 14L9 19M19 8L15 14L20 20M14 6V22" stroke="#5b532c" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`,
    lightning: `<svg viewBox="0 0 28 28" fill="none">
      <path d="M15 4L7 15H14L12 24L21 13H14L15 4Z" fill="#59392c"/>
    </svg>`,
    cooking: `<svg viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="15" r="7" fill="#473c2c"/>
      <path d="M7 15H23" stroke="#473c2c" stroke-width="2.5"/>
    </svg>`,
    magic: `<svg viewBox="0 0 28 28" fill="none">
      <polygon points="14,3 17,11 25,11 19,16 21,24 14,19 7,24 9,16 3,11 11,11" fill="#423659"/>
    </svg>`
};

const skillsData = [
    {
      id: 'enemy_detection',
      name: 'Enemy Detection',
      en: 'Enemy Detection (Radar Scan)',
      category: 'PERCEPTION',
      level: 10,
      maxLevel: 10,
      active: true,
      icon: 'mind',
      tab: 'skills'
    },
    {
        id: 'mind_res',
        name: 'Mental Resistance',
        en: 'Mental Resistance',
        category: 'PERCEPTION',
        level: 0,
        maxLevel: 10,
        active: true,
        icon: 'mind',
        tab: 'skills'
    },
    {
        id: 'tailoring',
        name: 'Tailoring',
        en: 'Tailoring / Sewing',
        category: 'LIFE',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'sewing',
        tab: 'skills'
    },
    {
        id: 'service',
        name: 'Service / Hospitality',
        en: 'Service / Hospitality',
        category: 'LIFE',
        level: 1,
        maxLevel: 10,
        active: false,
        icon: 'service',
        tab: 'skills'
    },
    {
        id: 'contract',
        name: 'Contract',
        en: 'Contract',
        category: 'LIFE',
        level: 1,
        maxLevel: 10,
        active: false,
        icon: 'contract',
        tab: 'skills'
    },
    {
        id: 'petrify_res',
        name: 'Petrification Resistance',
        en: 'Petrification Resistance',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'petrify',
        tab: 'skills'
    },
    {
        id: 'rot_res',
        name: 'Rot Resistance',
        en: 'Rot / Decay Resistance',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'rot',
        tab: 'skills'
    },
    {
        id: 'disease_res',
        name: 'Disease Resistance',
        en: 'Disease Resistance',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'disease',
        tab: 'skills'
    },
    {
        id: 'poison_res',
        name: 'Poison Resistance',
        en: 'Poison Resistance',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'poison',
        tab: 'skills'
    },
    {
        id: 'paralysis_res',
        name: 'Paralysis Resistance',
        en: 'Paralysis Resistance',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'paralysis',
        tab: 'skills'
    },
    {
        id: 'lightning_res',
        name: 'Lightning Resistance',
        en: 'Lightning Resistance',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'lightning',
        tab: 'skills'
    },
    {
        id: 'sky_drive',
        name: 'Ground Shrink (Shukuchi)',
        en: 'Shukuchi / Ground Shrink',
        category: 'COMBAT',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'lightning',
        tab: 'skills'
    },
    {
        id: 'cooking',
        name: 'Cooking',
        en: 'Cooking',
        category: 'PRODUCTION',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'cooking',
        tab: 'skills'
    },
    {
        id: 'compounding',
        name: 'Compounding / Alchemy',
        en: 'Compounding / Alchemy',
        category: 'PRODUCTION',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'poison',
        tab: 'skills'
    },
    {
        id: 'poker_face',
        name: 'Poker Face',
        en: 'Poker Face',
        category: 'PERCEPTION',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'mind',
        tab: 'skills'
    },
    // SPELLS TAB ENTRIES
    {
        id: 'meteor_shower',
        name: 'Guided Meteor Shower',
        en: 'Meteor Shower (All-Map)',
        category: 'MAGIC',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'magic',
        tab: 'spells'
    },
    {
        id: 'short_stun',
        name: 'Short Stun',
        en: 'Short Stun',
        category: 'MAGIC',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'magic',
        tab: 'spells'
    },
    {
        id: 'condensed_magic',
        name: 'Condensed Magic Bullet',
        en: 'Condensed Magic Bullet',
        category: 'MAGIC',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'magic',
        tab: 'spells'
    },
    {
        id: 'holy_bolt',
        name: 'Holy Bolt',
        en: 'Holy Bolt',
        category: 'MAGIC',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'magic',
        tab: 'spells'
    },
    {
        id: 'sky_walk',
        name: 'Magic Hand',
        en: 'Magic Hand',
        category: 'MAGIC',
        level: 10,
        maxLevel: 10,
        active: true,
        icon: 'magic',
        tab: 'spells'
    }
];

// Character window state
let currentTab = 'skills';
let selectedSkillId = 'mind_res';
let filterCategory = 'ALL';
let filterState = 'ALL';
let skillPoints = 3100;
let showExactSP = false;

// Character window DOM Elements
const charWin = document.getElementById('charWindowWrapper');
const skillsListContainer = document.getElementById('skillsListContainer');
const detailHexIcon = document.getElementById('detailHexIcon');
const detailFraction = document.getElementById('detailFraction');
const detailSkillName = document.getElementById('detailSkillName');
const detailSkillCat = document.getElementById('detailSkillCat');
const detailToggleSwitch = document.getElementById('detailToggleSwitch');
const detailToggleKnob = document.getElementById('detailToggleKnob');
const upgradeSkillBtn = document.getElementById('upgradeSkillBtn');
const upgradeNoteText = document.getElementById('upgradeNoteText');
const detailPipsBar = document.getElementById('detailPipsBar');
const spDisplayVal = document.getElementById('spDisplayVal');

function openCharWindow(tab = 'skills') {
    charWin.classList.remove('hidden');
    charWin.style.zIndex = '25';
    mainWin.style.zIndex = '20';
    if (tab) {
        currentTab = tab;
        document.querySelectorAll('.subtab-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === currentTab);
        });
        const firstSkill = skillsData.find(s => s.tab === currentTab);
        if (firstSkill && (!selectedSkillId || !skillsData.find(s => s.id === selectedSkillId && s.tab === currentTab))) {
            selectedSkillId = firstSkill.id;
        }
        renderDetailCard();
        renderSkillsList();
    }
    showToast(tab === 'spells' ? 'Character (Spells List) opened' : 'Character (Skills List) opened');
}

function renderDetailCard() {
    const skill = skillsData.find(s => s.id === selectedSkillId) || skillsData[0];
    if (!skill) return;

    detailHexIcon.innerHTML = SKILL_ICONS[skill.icon] || SKILL_ICONS.mind;
    detailFraction.textContent = `${skill.level}/${skill.maxLevel}`;
    detailSkillName.textContent = skill.name;
    detailSkillCat.textContent = `CATEGORY : ${skill.category}`;

    if (skill.active) {
        detailToggleSwitch.classList.remove('off-state');
        detailToggleKnob.textContent = 'ON';
    } else {
        detailToggleSwitch.classList.add('off-state');
        detailToggleKnob.textContent = 'OFF';
    }

    if (skill.level >= skill.maxLevel) {
        upgradeSkillBtn.disabled = true;
        upgradeSkillBtn.textContent = 'MASTERY';
        upgradeNoteText.innerHTML = 'Maximum level<br>reached.';
    } else {
        upgradeSkillBtn.disabled = false;
        upgradeSkillBtn.textContent = 'UPGRADE';
        upgradeNoteText.innerHTML = '1 point required<br>for upgrade.';
    }

    detailPipsBar.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const pip = document.createElement('div');
        pip.className = 'pip-cell';
        if (i <= skill.level) {
            pip.classList.add(skill.level === 10 ? 'mastered-pip' : 'filled');
        }
        pip.title = `Set level to ${i}/10`;
        pip.addEventListener('click', () => {
            const diff = i - skill.level;
            skill.level = i;
            skill.active = true;
            skillPoints = Math.max(99, skillPoints - diff);
            updateSPDisplay();
            satouState.logs.unshift(`Skill [${skill.name}] set to Level ${skill.level}/10.`);
            showToast(`Skill "${skill.name}": Lv ${skill.level}/10`);
            renderDetailCard();
            renderSkillsList();
        });
        detailPipsBar.appendChild(pip);
    }
}

function renderSkillsList() {
    skillsListContainer.innerHTML = '';

    const filtered = skillsData.filter(s => {
        if (s.tab !== currentTab) return false;
        if (filterCategory !== 'ALL' && s.category !== filterCategory) return false;
        if (filterState === 'MASTERY' && s.level < s.maxLevel) return false;
        if (filterState === 'ACTIVE' && !s.active) return false;
        if (filterState === 'INACTIVE' && s.active) return false;
        return true;
    });

    filtered.forEach(skill => {
        if (skill.id === 'mind_res' && selectedSkillId === 'mind_res' && filterCategory === 'ALL' && filterState === 'ALL') {
            return;
        }

        const row = document.createElement('div');
        row.className = 'skill-row';
        if (!skill.active) row.classList.add('inactive-row');
        if (skill.id === selectedSkillId) row.classList.add('selected-row');

        const isMastered = skill.level >= skill.maxLevel;
        let middleBadgeHTML = '';
        if (isMastered && skill.active) {
            middleBadgeHTML = `<div class="mastery-ribbon"><span>MASTERY</span></div>`;
        } else if (skill.active && skill.level > 0) {
            middleBadgeHTML = `<div class="level-ribbon"><span>LV ${skill.level}/10</span></div>`;
        }

        row.innerHTML = `
        <div class="row-hex-icon">${SKILL_ICONS[skill.icon] || SKILL_ICONS.mind}</div>
        <div class="row-skill-name">${skill.name}</div>
        <div class="mastery-ribbon-cell">${middleBadgeHTML}</div>
        <div class="row-skill-cat">${skill.category}</div>
      `;

        row.addEventListener('click', () => {
            selectedSkillId = skill.id;
            renderDetailCard();
            renderSkillsList();
        });

        skillsListContainer.appendChild(row);
    });
}

function updateSPDisplay() {
    spDisplayVal.textContent = showExactSP ? skillPoints : (skillPoints > 99 ? '99+' : skillPoints);
}

detailToggleSwitch.addEventListener('click', () => {
    const skill = skillsData.find(s => s.id === selectedSkillId);
    if (!skill) return;
    skill.active = !skill.active;
    satouState.logs.unshift(`Skill [${skill.name}] set to ${skill.active ? 'ON (Active)' : 'OFF (Inactive)'}.`);
    if (skill.id === 'enemy_detection' && skill.active) {
        if (typeof triggerRadarScan === 'function') triggerRadarScan();
    }
    showToast(`Skill "${skill.name}": ${skill.active ? 'ON (Active)' : 'OFF (Inactive)'}`);
    renderDetailCard();
    renderSkillsList();
});

upgradeSkillBtn.addEventListener('click', () => {
    const skill = skillsData.find(s => s.id === selectedSkillId);
    if (!skill || skill.level >= skill.maxLevel) return;
    skill.level += 1;
    skill.active = true;
    skillPoints -= 1;
    updateSPDisplay();

    if (skill.level === skill.maxLevel) {
        satouState.logs.unshift(`Skill [${skill.name}] reached MASTERY (10/10)!`);
        showToast(`★ Skill "${skill.name}" reached MASTERY (10/10)!`);
    } else {
        satouState.logs.unshift(`Upgraded skill [${skill.name}] to (${skill.level}/10).`);
        showToast(`Skill "${skill.name}" upgraded to Lv ${skill.level}/10`);
    }

    renderDetailCard();
    renderSkillsList();
});

document.querySelectorAll('.subtab-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.subtab-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        const firstSkill = skillsData.find(s => s.tab === currentTab);
        if (firstSkill) selectedSkillId = firstSkill.id;
        renderDetailCard();
        renderSkillsList();
    });
});

function setupDropdown(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('open');
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
        if (!isOpen) menu.classList.add('open');
    });
}

setupDropdown('catFilterBtn', 'catDropdown');
setupDropdown('stateFilterBtn', 'stateDropdown');
setupDropdown('spBtn', 'spDropdown');

document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
});

document.querySelectorAll('#catDropdown .dropdown-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('#catDropdown .dropdown-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        filterCategory = opt.dataset.cat;
        document.getElementById('catFilterLabel').textContent =
            filterCategory === 'ALL' ? 'ALL CATEGORY' : `CAT: ${filterCategory}`;
        renderSkillsList();
    });
});

document.querySelectorAll('#stateDropdown .dropdown-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('#stateDropdown .dropdown-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        filterState = opt.dataset.state;
        document.getElementById('stateFilterLabel').textContent = opt.innerText.trim();
        renderSkillsList();
    });
});

document.getElementById('maxAllBtn').addEventListener('click', () => {
    skillsData.forEach(s => { s.level = 10; s.active = true; });
    satouState.logs.unshift('All skills enhanced to MASTERY (10/10)!');
    showToast('★ All skills enhanced to MASTERY (10/10)');
    renderDetailCard();
    renderSkillsList();
});

document.getElementById('resetSelectedBtn').addEventListener('click', () => {
    const skill = skillsData.find(s => s.id === selectedSkillId);
    if (skill) {
        skill.level = 0;
        satouState.logs.unshift(`Skill [${skill.name}] reset to 0/10.`);
        showToast(`Skill "${skill.name}" reset to 0/10`);
        renderDetailCard();
        renderSkillsList();
    }
});

document.getElementById('closeCharWindowBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    charWin.classList.add('hidden');
    showToast('Character window closed (Click bottom menu icons to re-open)');
});

// Bring clicked window to front
charWin.addEventListener('mousedown', () => {
    charWin.style.zIndex = '25';
    mainWin.style.zIndex = '20';
});
mainWin.addEventListener('mousedown', () => {
    mainWin.style.zIndex = '25';
    charWin.style.zIndex = '20';
});

// Dragging Character Window
const charDragHandle = document.getElementById('charDragHandle');
let isDraggingChar = false, charStartX = 0, charStartY = 0, charOrigLeft = 0, charOrigTop = 0;

charDragHandle.addEventListener('mousedown', (e) => {
    if (e.target.id === 'closeCharWindowBtn') return;
    isDraggingChar = true;
    const rect = charWin.getBoundingClientRect();
    charOrigLeft = rect.left;
    charOrigTop = rect.top;
    charStartX = e.clientX;
    charStartY = e.clientY;
    charWin.style.zIndex = '25';
    mainWin.style.zIndex = '20';
});

// Initialize Character Window
renderDetailCard();
renderSkillsList();
updateSPDisplay();

window.addEventListener('mousemove', (e) => {
    if (isDraggingWin) {
        const dx = e.clientX - winStartX;
        const dy = e.clientY - winStartY;
        mainWin.style.left = `${winOrigLeft + dx}px`;
        mainWin.style.top = `${winOrigTop + dy}px`;
    }
    if (isDraggingChar) {
        const dx = e.clientX - charStartX;
        const dy = e.clientY - charStartY;
        charWin.style.left = `${charOrigLeft + dx}px`;
        charWin.style.top = `${charOrigTop + dy}px`;
    }
    if (typeof isDraggingMapWin !== 'undefined' && isDraggingMapWin) {
        const dx = e.clientX - mapWinStartX;
        const dy = e.clientY - mapWinStartY;
        mapWin.style.left = `${mapWinOrigLeft + dx}px`;
        mapWin.style.top = `${mapWinOrigTop + dy}px`;
    }
    if (typeof isPanningModalMap !== 'undefined' && isPanningModalMap) {
        mapModalPanX = (e.clientX - modalMapStartX) / mapModalZoom;
        mapModalPanY = (e.clientY - modalMapStartY) / mapModalZoom;
        if (typeof applyMainMapTransform === 'function') applyMainMapTransform();
    }
});

window.addEventListener('mouseup', () => {
    isDraggingWin = false;
    isDraggingChar = false;
    if (typeof isDraggingMapWin !== 'undefined') isDraggingMapWin = false;
    if (typeof isPanningModalMap !== 'undefined') isPanningModalMap = false;
});

window.resetWinPos = function () {
    mainWin.style.left = 'calc(50% - 428px)';
    mainWin.style.top = 'calc(50% - 210px)';
    mainWin.classList.remove('hidden');
    charWin.style.left = 'calc(50% - 112px)';
    charWin.style.top = 'calc(50% - 320px)';
    charWin.classList.remove('hidden');
    showToast('Window positions reset to center');
};

/* Minimap Zoom & Pan */
let mapZoom = 1;
let mapPanX = 0, mapPanY = 0;
/* =========================================================================
     6. MAIN TACTICAL MAP MODAL CONTROLLER (Anime Exact Replica)
     ========================================================================= */
  const mapWin = document.getElementById('mapWindowWrapper');
  const mapDragHandle = document.getElementById('mapDragHandle');
  const closeMapWindowBtn = document.getElementById('closeMapWindowBtn');
  const mainMapViewport = document.getElementById('mainMapViewport');
  const mainMapCanvas = document.getElementById('mainMapCanvas');
  const mapTabMap = document.getElementById('mapTabMap');
  const mapTabMarker = document.getElementById('mapTabMarker');
  const mapTabSearch = document.getElementById('mapTabSearch');
  const mapMarkerCards = document.getElementById('mainMapMarkerCards');
  const mapSearchOverlay = document.getElementById('mapSearchOverlay');
  const mapSearchInput = document.getElementById('mapSearchInput');
  const mapSearchClose = document.getElementById('mapSearchClose');
  const map2dToggleBtn = document.getElementById('map2dToggleBtn');
  const map2dLabel = document.getElementById('map2dLabel');

  let mapModalZoom = 1.0;
  let mapModalPanX = 0, mapModalPanY = 0;
  let isPanningModalMap = false, modalMapStartX = 0, modalMapStartY = 0;
  let isDraggingMapWin = false, mapWinStartX = 0, mapWinStartY = 0, mapWinOrigLeft = 0, mapWinOrigTop = 0;
  let is3dMode = false;
  let showMarkerCards = false;

  function applyMainMapTransform() {
    if (is3dMode) {
      mainMapCanvas.style.transform = `perspective(900px) rotateX(26deg) rotateZ(-1deg) scale(${mapModalZoom * 0.96}) translate(${mapModalPanX}px, ${mapModalPanY}px)`;
    } else {
      mainMapCanvas.style.transform = `scale(${mapModalZoom}) translate(${mapModalPanX}px, ${mapModalPanY}px)`;
    }
  }

  function openMapModal() {
    mapWin.classList.remove('hidden');
    mapWin.style.zIndex = '26';
    charWin.style.zIndex = '20';
    mainWin.style.zIndex = '19';
    showToast("Opened Area Map: Dragon's Valley");
  }
  window.openMapModal = openMapModal;

  function closeMapModal() {
    mapWin.classList.add('hidden');
    showToast('Map window closed (Click minimap to re-open)');
  }
  closeMapWindowBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMapModal();
  });

  // Clicking map window brings it to front
  mapWin.addEventListener('mousedown', () => {
    mapWin.style.zIndex = '26';
    charWin.style.zIndex = '20';
    mainWin.style.zIndex = '19';
  });

  // Dragging map modal by top header tab
  mapDragHandle.addEventListener('mousedown', (e) => {
    if (e.target.id === 'closeMapWindowBtn') return;
    isDraggingMapWin = true;
    const rect = mapWin.getBoundingClientRect();
    mapWinOrigLeft = rect.left;
    mapWinOrigTop = rect.top;
    mapWinStartX = e.clientX;
    mapWinStartY = e.clientY;
    mapWin.style.zIndex = '26';
    charWin.style.zIndex = '20';
    mainWin.style.zIndex = '19';
  });

  // 2D / 3D Perspective Toggle (Screenshot 2 bottom-right button)
  map2dToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    is3dMode = !is3dMode;
    map2dToggleBtn.classList.toggle('is-3d', is3dMode);
    map2dLabel.textContent = is3dMode ? '3D' : '2D';
    applyMainMapTransform();
    showToast(is3dMode ? 'Map Mode: 3D Isometric View' : 'Map Mode: 2D Planar View');
  });

  /* Radar / Detection Display Scanner */
  let isRadarScanning = false;
  let hasRadarScanned = false;
  let scanAnimFrameId = null;

  function resetMapDotsToWhite() {
    const dots = document.querySelectorAll('.map-unit-dot');
    dots.forEach(d => {
      d.classList.remove('state-red', 'ping-detected');
      d.classList.add('state-white');
    });
    const scanLine = document.getElementById('mapScanLine');
    if (scanLine) {
      scanLine.classList.remove('scanning', 'scanned-settled');
      scanLine.style.display = 'none';
      scanLine.style.top = '0px';
    }
    hasRadarScanned = false;
  }

  function triggerRadarScan() {
    // If map window is closed, open it so user can watch the red scan light
    if (mapWin && mapWin.classList.contains('hidden')) {
      openMapModal();
    }

    if (isRadarScanning) return;
    isRadarScanning = true;

    // Short tick to ensure map window is rendered and dimensions are computed
    setTimeout(() => {
      const scanLine = document.getElementById('mapScanLine');
      const viewport = document.getElementById('mainMapViewport');
      const dots = Array.from(document.querySelectorAll('.map-unit-dot'));

      if (!scanLine || !viewport) {
        isRadarScanning = false;
        return;
      }

      // Reset dots to white at start of scan
      dots.forEach(d => {
        d.classList.remove('state-red', 'ping-detected');
        d.classList.add('state-white');
      });

      // Prepare scan line for top-to-bottom sweep
      scanLine.classList.remove('scanned-settled');
      scanLine.classList.add('scanning');
      scanLine.style.display = 'block';
      scanLine.style.bottom = 'auto';
      scanLine.style.top = '0px';

      showToast('Enemy Detection: Scanning battlefield with radar light...');

      const duration = 2200; // 2.2 seconds scan duration
      const startTime = performance.now();
      const scannedSet = new Set();

      function scanStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Move scan line from top to bottom
        const currentYPx = progress * (viewport.clientHeight - 4);
        scanLine.style.top = `${currentYPx}px`;

        // Check which dots are passed by the red scan wave
        dots.forEach(dot => {
          if (!scannedSet.has(dot)) {
            const dotY = parseFloat(dot.dataset.y) || 270;
            const dotProgress = dotY / 540; // 0 to 1 across 540 viewBox height

            if (progress >= dotProgress) {
              scannedSet.add(dot);
              const type = dot.dataset.type;
              dot.classList.add('ping-detected');
              if (type === 'enemy') {
                // Enemy identified: Turn White -> Red!
                dot.classList.remove('state-white');
                dot.classList.add('state-red');
              } else {
                // Confirmed Non-Enemy / Neutral: Remains White!
                dot.classList.add('state-white');
              }
            }
          }
        });

        if (progress < 1) {
          scanAnimFrameId = requestAnimationFrame(scanStep);
        } else {
          // Scan complete: Settle red line at bottom of map
          isRadarScanning = false;
          hasRadarScanned = true;
          scanLine.classList.remove('scanning');
          scanLine.classList.add('scanned-settled');
          showToast('Enemy Detection Complete: 4 Hostiles Identified, 3 Non-Enemies');

          // Sync minimap markers
          const minimapMarkers = document.getElementById('mapMarkers');
          if (minimapMarkers) {
            minimapMarkers.style.opacity = '0.9';
          }
        }
      }

      scanAnimFrameId = requestAnimationFrame(scanStep);
    }, 120);
  }
  window.triggerRadarScan = triggerRadarScan;

  // Subtabs Bar: MAP | MARKER | SEARCH
  function setActiveMapTab(tabBtn) {
    if (!tabBtn) return;
    [mapTabMap, mapTabMarker, mapTabSearch].forEach(btn => { if (btn) btn.classList.remove('active'); });
    tabBtn.classList.add('active');
  }
  window.setActiveMapTab = setActiveMapTab;

  if (mapTabMap) {
    mapTabMap.addEventListener('click', () => {
      setActiveMapTab(mapTabMap);
      showMarkerCards = false;
      if (mapMarkerCards) mapMarkerCards.setAttribute('opacity', '0');
      if (mapSearchOverlay) mapSearchOverlay.classList.remove('visible');
      showToast("Area Map: Dragon's Valley Tactical Terrain");
    });
  }

  if (mapTabMarker) {
    mapTabMarker.addEventListener('click', () => {
      setActiveMapTab(mapTabMarker);
      showMarkerCards = !showMarkerCards;
      if (mapMarkerCards) mapMarkerCards.setAttribute('opacity', showMarkerCards ? '1' : '0');
      if (mapSearchOverlay) mapSearchOverlay.classList.remove('visible');
      showToast(showMarkerCards ? 'Markers: Tactical Unit Intel Active' : 'Markers Hidden');
    });
  }

  if (mapTabSearch) {
    mapTabSearch.addEventListener('click', () => {
      setActiveMapTab(mapTabSearch);
      if (mapSearchOverlay) {
        mapSearchOverlay.classList.toggle('visible');
        if (mapSearchOverlay.classList.contains('visible') && mapSearchInput) {
          mapSearchInput.focus();
          showToast('Search: Type to filter units or locations');
        }
      }
    });
  }

  if (mapSearchClose) {
    mapSearchClose.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mapSearchOverlay) mapSearchOverlay.classList.remove('visible');
      setActiveMapTab(mapTabMap);
    });
  }

  if (mapSearchInput) {
    mapSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.anime-callout-card');
      cards.forEach(card => {
        const txt = card.textContent.toLowerCase();
        if (!q || txt.includes(q)) {
          card.style.display = '';
          card.setAttribute('opacity', '1');
        } else {
          card.setAttribute('opacity', '0.2');
        }
      });
      if (q && mapMarkerCards) {
        mapMarkerCards.setAttribute('opacity', '1');
      }
    });
  }

  // Pan within map viewport
  if (mainMapViewport) {
    mainMapViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('#map2dToggleBtn') || e.target.closest('#mapSearchOverlay') || e.target.closest('.anime-callout-card')) return;
      isPanningModalMap = true;
      modalMapStartX = e.clientX - mapModalPanX * mapModalZoom;
      modalMapStartY = e.clientY - mapModalPanY * mapModalZoom;
    });

    // Mouse wheel zoom on map viewport
    mainMapViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      mapModalZoom = Math.min(3.0, Math.max(0.7, +(mapModalZoom + delta).toFixed(2)));
      applyMainMapTransform();
    }, { passive: false });

    // Double click resets zoom and pan
    mainMapViewport.addEventListener('dblclick', (e) => {
      if (e.target.closest('#map2dToggleBtn') || e.target.closest('#mapSearchOverlay') || e.target.closest('.anime-callout-card')) return;
      mapModalZoom = 1.0;
      mapModalPanX = 0;
      mapModalPanY = 0;
      applyMainMapTransform();
      showToast('Map View Reset to Default');
    });
  }

  // Escape key closes map modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mapWin && !mapWin.classList.contains('hidden')) {
      closeMapModal();
    }
  });

  const UNIT_INTEL = {
    dot7: { faction: 'Dragon Valley', rank: 'Wyvern Scout', lvl: 'Lv 28', type: 'Hostile', sub: 'AIR SWARM', name: 'Glaive-Wing Wyvern', age: 'Adult (42)', sex: 'Male', race: 'Lesser Dragonkin' },
    dot6: { faction: 'Dragon Valley', rank: 'Flocking Wyvern', lvl: 'Lv 29', type: 'Hostile', sub: 'AIR SWARM', name: 'Storm-Crest Wyvern', age: 'Adult (38)', sex: 'Female', race: 'Lesser Dragonkin' },
    dot5: { faction: 'Canyon Outlaws', rank: 'Raider Leader', lvl: 'Lv 24', type: 'Hostile', sub: 'BANDIT AMBUSH', name: 'Vance the Scarred', age: '31', sex: 'Male', race: 'Human' },
    dot4: { faction: 'Seiryuu Guild', rank: 'Caravan Master', lvl: 'Lv 14', type: 'Non-Enemy', sub: 'TRADE CONVOY', name: 'Milo Brand', age: '45', sex: 'Male', race: 'Human' },
    dot3: { faction: 'Explorer Guild', rank: 'Silver Adventurer', lvl: 'Lv 16', type: 'Non-Enemy', sub: 'ESCORT PARTY', name: 'Theresa Vane', age: '22', sex: 'Female', race: 'Half-Elf' },
    dot2: { faction: 'Shiga Kingdom', rank: 'Knight Courier', lvl: 'Lv 21', type: 'Non-Enemy', sub: 'ROYAL MESSENGER', name: 'Sir Raymond Delacroix', age: '27', sex: 'Male', race: 'Human' },
    dot1: { faction: 'Canyon Outlaws', rank: 'Forward Scout', lvl: 'Lv 22', type: 'Hostile', sub: 'LOOKOUT SQUAD', name: 'Jarek Quickfoot', age: '24', sex: 'Male', race: 'Human (Plains Tribe)' }
  };

  // Card click & dropdown toggle handlers
  document.querySelectorAll('.anime-callout-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('expanded');
      const dotId = card.dataset.dot;
      const dot = document.querySelector(`.map-unit-dot[data-id="${dotId}"]`);
      if (dot) {
        dot.classList.add('ping-detected');
        setTimeout(() => dot.classList.remove('ping-detected'), 450);
      }
    });
  });

  // Dot click handlers: highlights card and toggles appraisal dropdown
  document.querySelectorAll('.map-unit-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const dotId = dot.dataset.id;
      const info = UNIT_INTEL[dotId];

      // Make sure cards layer is visible
      mapMarkerCards.setAttribute('opacity', '1');
      showMarkerCards = true;
      setActiveMapTab(mapTabMarker);

      // Focus card
      document.querySelectorAll('.anime-callout-card').forEach(c => c.classList.remove('active-target'));
      const card = document.querySelector(`.anime-callout-card[data-dot="${dotId}"]`);
      if (card) {
        card.classList.add('active-target');
        card.classList.toggle('expanded');
      }

      if (info) {
        showToast(`[${info.faction}] ${info.rank} +${info.lvl} ｜ ${info.name} (${info.race})`);
      }
    });
  });

  window.resetWinPos = function() {
    mainWin.style.left = 'calc(50% - 428px)';
    mainWin.style.top = 'calc(50% - 210px)';
    mainWin.classList.remove('hidden');
    charWin.style.left = 'calc(50% - 112px)';
    charWin.style.top = 'calc(50% - 320px)';
    charWin.classList.remove('hidden');
    if (mapWin) {
      mapWin.style.left = 'calc(50% - 370px)';
      mapWin.style.top = 'calc(50% - 270px)';
    }
    showToast('Window positions reset to center');
  };


const minimapContent = document.getElementById('minimapContent');
const zoomSymbol = document.getElementById('zoomSymbol');

function applyMapTransform() {
    minimapContent.style.transform = `scale(${mapZoom}) translate(${mapPanX}px, ${mapPanY}px)`;
}

document.getElementById('minimapZoomBtn').addEventListener('click', () => {
    if (mapZoom === 1) {
        mapZoom = 1.45;
        zoomSymbol.textContent = '−';
        showToast('Minimap: Zoomed View (1.45x)');
    } else {
        mapZoom = 1;
        mapPanX = 0;
        mapPanY = 0;
        zoomSymbol.textContent = '+';
        showToast('Minimap: Standard View (1.0x)');
    }
    applyMapTransform();
});

const minimapDragArea = document.getElementById('minimapDragArea');
let isPanningMap = false, mapStartX = 0, mapStartY = 0;

let minimapMouseDownPos = { x: 0, y: 0 };
minimapDragArea.addEventListener('mousedown', (e) => {
    isPanningMap = true;
    mapStartX = e.clientX - mapPanX;
    mapStartY = e.clientY - mapPanY;
    minimapMouseDownPos = { x: e.clientX, y: e.clientY };
});

minimapDragArea.addEventListener('click', (e) => {
    if (e.target.closest('#minimapZoomBtn')) return;
    const dist = Math.hypot(e.clientX - minimapMouseDownPos.x, e.clientY - minimapMouseDownPos.y);
    if (dist < 8) {
        if (typeof openMapModal === 'function') openMapModal();
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isPanningMap) return;
    mapPanX = Math.max(-35, Math.min(35, e.clientX - mapStartX));
    mapPanY = Math.max(-35, Math.min(35, e.clientY - mapStartY));
    applyMapTransform();
});

window.addEventListener('mouseup', () => { isPanningMap = false; });
