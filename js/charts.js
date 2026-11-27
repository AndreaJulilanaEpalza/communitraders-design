/* ==========================================================================
   COMMUNITRADERS // COLORIMETRIA CHARTS & GAUGES (#E81C7B -> #F7944D + #C04CFD)
   ========================================================================== */

window.ViceCharts = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  isSerious() {
    return document.documentElement.getAttribute('data-theme') === 'serious';
  },

  getPalette() {
    if (this.isSerious()) {
      return {
        posTop: '#ff8d35',
        posBottom: '#b85a14',
        negTop: '#d60093',
        negBottom: '#7d0056',
        lineStart: '#d60093',
        lineMid: '#e64566',
        lineEnd: '#ff8d35',
        areaTop: 'rgba(214, 0, 147, 0.14)',
        areaBottom: 'rgba(255, 141, 53, 0.0)',
        dotStroke: '#d60093',
        ringGrad: ['#d60093', '#e84964', '#ff8d35'],
        donutShadow: 'none',
        riskLowText: 'LOW RISK',
        riskMedText: 'MODERATE RISK',
        riskHighText: 'ELEVATED RISK',
        riskHighColor: '#d60093',
        fontLabel: 'Inter, Plus Jakarta Sans, sans-serif',
        fontMono: 'IBM Plex Mono, JetBrains Mono, monospace'
      };
    }
    return {
      posTop: '#c04cfd',
      posBottom: '#831cd1',
      negTop: '#e81c7b',
      negBottom: '#f7944d',
      lineStart: '#e81c7b',
      lineMid: '#f44e5f',
      lineEnd: '#f7944d',
      areaTop: 'rgba(232, 28, 123, 0.28)',
      areaBottom: 'rgba(247, 148, 77, 0.0)',
      dotStroke: '#e81c7b',
      ringGrad: ['#e81c7b', '#f44e5f', '#f7944d'],
      donutShadow: 'drop-shadow(0 0 8px rgba(232,28,123,0.4))',
      riskLowText: 'LOW RISK // SHIELDED',
      riskMedText: 'MODERATE // BALANCED',
      riskHighText: 'HIGH VOLTAGE',
      riskHighColor: '#e81c7b',
      fontLabel: 'Plus Jakarta Sans, sans-serif',
      fontMono: 'JetBrains Mono, monospace'
    };
  },

  renderMonthlyBars(container, values = []) {
    if (!container) return;
    const p = this.getPalette();
    const width = 680;
    const height = 245;
    const padL = 44;
    const padR = 16;
    const padT = 18;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const maxPos = Math.max(20, ...values.map((v) => (v > 0 ? v : 0)));
    const minNeg = Math.min(-20, ...values.map((v) => (v < 0 ? v : 0)));
    const span = maxPos - minNeg || 40;
    const zeroY = padT + (maxPos / span) * plotH;

    let gridLines = '';
    for (let i = 0; i <= 4; i++) {
      const val = maxPos - (span * i) / 4;
      const y = padT + (plotH * i) / 4;
      gridLines += `
        <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3 4"/>
        <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-family="${p.fontMono}" font-size="10">${Math.round(val)}%</text>
      `;
    }

    const barSlot = plotW / 12;
    const barW = Math.min(26, barSlot * 0.52);

    let bars = '';
    values.forEach((v, idx) => {
      const x = padL + idx * barSlot + (barSlot - barW) / 2;
      const barH = Math.max(2, (Math.abs(v) / span) * plotH);
      const y = v >= 0 ? zeroY - barH : zeroY;
      const fill = v >= 0 ? 'url(#barPos)' : 'url(#barNeg)';
      const label = this.months[idx];

      bars += `
        <g>
          <rect x="${x}" y="${y}" width="${barW}" height="${v === 0 ? 2 : barH}" rx="3" fill="${fill}" opacity="0.92">
            <title>${label}: ${v}%</title>
          </rect>
          <text x="${x + barW / 2}" y="${height - 8}" text-anchor="middle" fill="var(--text-secondary)" font-family="${p.fontLabel}" font-size="11">${label}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="barPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${p.posTop}"/>
            <stop offset="100%" stop-color="${p.posBottom}"/>
          </linearGradient>
          <linearGradient id="barNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${p.negTop}"/>
            <stop offset="100%" stop-color="${p.negBottom}"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <line x1="${padL}" y1="${zeroY}" x2="${width - padR}" y2="${zeroY}" stroke="var(--accent-border)" stroke-width="1"/>
        ${bars}
      </svg>
    `;
  },

  renderEquityCurve(container, points = [100, 110, 125]) {
    if (!container) return;
    const pal = this.getPalette();
    const width = 680;
    const height = 245;
    const padL = 48;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const minV = Math.min(...points) * 0.96;
    const maxV = Math.max(...points) * 1.03;
    const span = maxV - minV || 10;

    const coords = points.map((v, i) => {
      const x = padL + (i / Math.max(1, points.length - 1)) * plotW;
      const y = padT + ((maxV - v) / span) * plotH;
      return { x, y, v };
    });

    const linePath = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${padT + plotH} L ${coords[0].x.toFixed(1)} ${padT + plotH} Z`;

    let dots = '';
    coords.forEach((p, idx) => {
      dots += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.6" fill="var(--bg-surface)" stroke="${pal.dotStroke}" stroke-width="2"><title>Period ${idx + 1}: ${p.v}</title></circle>`;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
        <defs>
          <linearGradient id="hudLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${pal.lineStart}"/>
            <stop offset="55%" stop-color="${pal.lineMid}"/>
            <stop offset="100%" stop-color="${pal.lineEnd}"/>
          </linearGradient>
          <linearGradient id="hudAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${pal.areaTop}"/>
            <stop offset="100%" stop-color="${pal.areaBottom}"/>
          </linearGradient>
        </defs>
        <line x1="${padL}" y1="${padT}" x2="${width - padR}" y2="${padT}" stroke="var(--border-subtle)"/>
        <line x1="${padL}" y1="${padT + plotH / 2}" x2="${width - padR}" y2="${padT + plotH / 2}" stroke="var(--border-subtle)"/>
        <line x1="${padL}" y1="${padT + plotH}" x2="${width - padR}" y2="${padT + plotH}" stroke="var(--border-medium)"/>
        <text x="${padL - 8}" y="${padT + 4}" text-anchor="end" fill="var(--text-muted)" font-family="${pal.fontMono}" font-size="10">${maxV.toFixed(0)}</text>
        <text x="${padL - 8}" y="${padT + plotH}" text-anchor="end" fill="var(--text-muted)" font-family="${pal.fontMono}" font-size="10">${minV.toFixed(0)}</text>
        <path d="${areaPath}" fill="url(#hudAreaGrad)"/>
        <path d="${linePath}" fill="none" stroke="url(#hudLineGrad)" stroke-width="2.5" stroke-linecap="round"/>
        ${dots}
      </svg>
    `;
  },

  renderRiskMeter(container, riskScore = 1) {
    if (!container) return;
    const p = this.getPalette();
    const pct = Math.min(100, Math.max(5, riskScore * 10));
    const levelText = riskScore <= 2 ? p.riskLowText : riskScore <= 5 ? p.riskMedText : p.riskHighText;
    const color = riskScore <= 2 ? 'var(--profit)' : riskScore <= 5 ? 'var(--neon-purple)' : p.riskHighColor;

    container.innerHTML = `
      <div style="padding: 26px 12px; display:flex; flex-direction:column; gap:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em;">Risk Assessment Index</div>
            <div style="font-family:var(--font-display); font-size:34px; font-weight:700; color:${color}; line-height:1.15;">${riskScore} / 10</div>
          </div>
          <span class="badge" style="background:var(--bg-tile); border:1px solid ${color}; color:${color};">${levelText}</span>
        </div>
        <div style="height:10px; border-radius:999px; background:rgba(128,128,145,0.18); overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, ${p.lineStart}, ${p.lineMid}, ${p.lineEnd}); border-radius:999px;"></div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">
          <div class="setting-box"><div class="setting-box-label">Max Daily DD</div><div class="setting-box-value">2.4%</div></div>
          <div class="setting-box"><div class="setting-box-label">Margin Utilization</div><div class="setting-box-value">6.8%</div></div>
          <div class="setting-box"><div class="setting-box-label">Sharpe Ratio</div><div class="setting-box-value">2.18</div></div>
        </div>
      </div>
    `;
  },

  renderTradesDonut(container, totalTrades = 80, winRate = 68.5) {
    if (!container) return;
    const p = this.getPalette();
    const radius = 58;
    const circ = 2 * Math.PI * radius;
    const winStroke = (winRate / 100) * circ;
    const lossStroke = circ - winStroke;

    container.innerHTML = `
      <svg viewBox="0 0 160 160" width="164" height="164">
        <defs>
          <linearGradient id="hudRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${p.ringGrad[0]}"/>
            <stop offset="60%" stop-color="${p.ringGrad[1]}"/>
            <stop offset="100%" stop-color="${p.ringGrad[2]}"/>
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="${radius}" fill="none" stroke="rgba(128,128,145,0.18)" stroke-width="13"/>
        <circle cx="80" cy="80" r="${radius}" fill="none"
          stroke="url(#hudRingGrad)" stroke-width="13" stroke-linecap="round"
          stroke-dasharray="${winStroke.toFixed(1)} ${lossStroke.toFixed(1)}"
          transform="rotate(-90 80 80)"
          style="filter: ${p.donutShadow};"/>
        <text x="80" y="76" text-anchor="middle" fill="var(--text-primary)" font-family="${p.fontMono}" font-size="25" font-weight="700">${totalTrades}</text>
        <text x="80" y="96" text-anchor="middle" fill="var(--text-secondary)" font-family="${p.fontLabel}" font-size="12">Total</text>
      </svg>
    `;
  }
};
