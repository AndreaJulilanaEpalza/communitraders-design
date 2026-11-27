/* ==========================================================================
   COMMUNITRADERS // ELEGANT BLACK & #FF0055 — MOCK DATA & TWO TEST PROFILES
   ========================================================================== */

window.ViceData = {
  users: {
    follower: {
      id: '2100224002',
      password: 'vice-follower',
      name: 'IB Test',
      shortName: 'IB',
      avatarInitial: 'I',
      role: 'follower',
      roleLabel: 'Follower',
      platform: 'MT5',
      server: 'Tradeview-Live',
      copyStatus: true,
      followedStrategyId: 'strategy-forex-2',
      kpis: {
        pnl: 0,
        margin: 0,
        freeMargin: 1019.5,
        balance: 1019.5,
        credit: 0,
        equity: 1019.5,
        risk: null
      },
      followingSettings: {
        drawdown: 'In equity',
        copyMode: 'FixedLots',
        copyStatus: 'Copying',
        riskRatio: 2.5,
        minLotSize: 0.02,
        maxLotSize: 11,
        maxDD: 1200
      }
    },
    provider: {
      id: '2100224001',
      password: 'vice-provider',
      name: 'Signal Test',
      shortName: 'Signal',
      avatarInitial: 'S',
      role: 'provider',
      roleLabel: 'Signal provider',
      platform: 'MT5',
      server: 'Tradeview-Live',
      visibility: true,
      ownStrategyId: 'strategy-forex-2',
      kpis: {
        pnl: 0,
        margin: 0,
        freeMargin: 45910.8,
        balance: 45910.8,
        credit: 0,
        equity: 45910.8,
        risk: 1
      }
    }
  },

  // Sleek Obsidian + #FF0055 + Neon Purple SVG Avatars
  avatars: {
    cyberChart: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0812"/><stop offset="100%" stop-color="#1c142e"/></linearGradient></defs>
        <rect width="100" height="100" fill="url(#g1)"/>
        <rect x="16" y="54" width="9" height="28" rx="2" fill="#3a2d54"/>
        <rect x="32" y="42" width="9" height="40" rx="2" fill="#7b2cbf"/>
        <rect x="48" y="30" width="9" height="52" rx="2" fill="#f6f5fa"/>
        <rect x="64" y="46" width="9" height="36" rx="2" fill="#b026ff"/>
        <rect x="80" y="22" width="9" height="60" rx="2" fill="#ff0055"/>
        <path d="M12 44 L36 32 L56 38 L86 16" stroke="#ff0055" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>`
    )}`,
    neonBull: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#0d0b14"/>
        <path d="M18 72 L42 48 L56 58 L82 26" stroke="#b026ff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <polygon points="84,22 70,25 79,36" fill="#ff0055"/>
      </svg>`
    )}`,
    viceCharacterA: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#120e1e"/>
        <circle cx="50" cy="40" r="17" fill="#2b223d" stroke="#b026ff" stroke-width="2"/>
        <path d="M22 96 C22 68 78 68 78 96 Z" fill="#1d172c"/>
        <path d="M40 72 L50 84 L60 72" stroke="#ff0055" stroke-width="2.5" fill="none"/>
      </svg>`
    )}`,
    viceCharacterB: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#0d0b14"/>
        <circle cx="50" cy="40" r="17" fill="#1e172e" stroke="#f6f5fa" stroke-width="1.8"/>
        <path d="M22 96 C22 68 78 68 78 96 Z" fill="#ff0055" opacity="0.88"/>
      </svg>`
    )}`,
    sunsetBadge: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#0b0912"/>
        <circle cx="50" cy="48" r="24" fill="#b026ff" opacity="0.9"/>
        <rect x="0" y="54" width="100" height="4" fill="#0b0912"/>
        <rect x="0" y="64" width="100" height="5" fill="#0b0912"/>
        <rect x="0" y="75" width="100" height="25" fill="#0b0912"/>
      </svg>`
    )}`
  },

  strategies: [
    {
      id: 'strategy-forex-2',
      name: 'StrategyForex2',
      description: 'description2',
      avatarKey: 'cyberChart',
      totalReturn: 77.86,
      yieldCurrent: -0.412921,
      fee: 25,
      drawdown: 200,
      followersCount: 4,
      mostTraded: 'EURUSD',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 100,
      accountType: 'XLev',
      totalTrades: 80,
      winRate: 68.5,
      profitFactor: 1.94,
      popularScore: 98,
      topSymbols: [
        { symbol: 'EURUSD', pct: '80%', flags: ['eu', 'us'] },
        { symbol: 'USDJPY', pct: '12.5%', flags: ['us', 'jp'] },
        { symbol: 'AUDJPY', pct: '5%', flags: ['au', 'jp'] }
      ],
      monthlyYield: {
        2026: [-16, -135, 18, 24, 14, -8, 22, 31, 15, -4, 19, 12],
        2025: [12, 18, -9, 25, 32, 14, -6, 21, 28, 11, 16, 19]
      },
      equityCurve: [100, 108, 114, 110, 126, 139, 134, 149, 162, 171, 177.86]
    },
    {
      id: 'test-strategy-jo',
      name: 'Test Startegy Jo...',
      description: 'Intraday trend-following system trading Tokyo & London liquidity sweeps.',
      avatarKey: 'neonBull',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 2,
      mostTraded: '---',
      riskScore: 0,
      currency: 'USD',
      strategyType: 'Manual',
      leverage: 200,
      accountType: 'RAW',
      totalTrades: 14,
      winRate: 50.0,
      profitFactor: 1.05,
      popularScore: 60,
      topSymbols: [
        { symbol: 'EURUSD', pct: '50%', flags: ['eu', 'us'] },
        { symbol: 'GBPUSD', pct: '30%', flags: ['gb', 'us'] },
        { symbol: 'USDJPY', pct: '20%', flags: ['us', 'jp'] }
      ],
      monthlyYield: { 2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 100, 100, 100, 100]
    },
    {
      id: 'strategy-edge',
      name: 'Strategy-Edge...',
      description: 'Low-latency EURUSD.edge breakout module with tight equity stop.',
      avatarKey: 'sunsetBadge',
      totalReturn: -0.36,
      yieldCurrent: -0.36,
      fee: 0,
      drawdown: 0,
      followersCount: 2,
      mostTraded: 'EURUSD.edge',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 100,
      accountType: 'Edge',
      totalTrades: 34,
      winRate: 47.0,
      profitFactor: 0.94,
      popularScore: 72,
      topSymbols: [
        { symbol: 'EURUSD.edge', pct: '100%', flags: ['eu', 'us'] },
        { symbol: 'GBPUSD', pct: '0%', flags: ['gb', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] }
      ],
      monthlyYield: { 2026: [4, -7, 2, -1, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [5, 3, -2, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 102, 99, 101, 99.64]
    },
    {
      id: 'strategy-freddy',
      name: 'Strategy-Freddy',
      description: 'Conservative swing positions aligned with macro central bank rate cycles.',
      avatarKey: 'viceCharacterA',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 1,
      mostTraded: '---',
      riskScore: 0,
      currency: 'USD',
      strategyType: 'Manual',
      leverage: 100,
      accountType: 'Standard',
      totalTrades: 8,
      winRate: 50.0,
      profitFactor: 1.0,
      popularScore: 45,
      topSymbols: [
        { symbol: 'EURUSD', pct: '60%', flags: ['eu', 'us'] },
        { symbol: 'AUDJPY', pct: '40%', flags: ['au', 'jp'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] }
      ],
      monthlyYield: { 2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 100, 100, 100]
    },
    {
      id: 'strategy-test-n',
      name: 'Strategy Test N...',
      description: 'Grid-free NY session momentum strategy with fixed stop protection.',
      avatarKey: 'sunsetBadge',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 1,
      mostTraded: '---',
      riskScore: 0,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 100,
      accountType: 'XLev',
      totalTrades: 12,
      winRate: 58.0,
      profitFactor: 1.12,
      popularScore: 40,
      topSymbols: [
        { symbol: 'EURUSD', pct: '100%', flags: ['eu', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] },
        { symbol: 'AUDJPY', pct: '0%', flags: ['au', 'jp'] }
      ],
      monthlyYield: { 2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 101, 99, 100]
    },
    {
      id: 'best-strategy-jb',
      name: 'best strategy JB...',
      description: 'Zero-fee EURUSD pullback hunter built for steady compounding.',
      avatarKey: 'viceCharacterB',
      totalReturn: 20.2,
      yieldCurrent: 20.2,
      fee: 0,
      drawdown: 100,
      followersCount: 1,
      mostTraded: 'EURUSD',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'Manual',
      leverage: 100,
      accountType: 'XLev',
      totalTrades: 52,
      winRate: 65.4,
      profitFactor: 1.72,
      popularScore: 84,
      topSymbols: [
        { symbol: 'EURUSD', pct: '90%', flags: ['eu', 'us'] },
        { symbol: 'GBPUSD', pct: '10%', flags: ['gb', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] }
      ],
      monthlyYield: { 2026: [4.2, 6.1, 3.8, 6.1, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [2, 4, 3, 5, 2, 4, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 104, 110, 114, 120.2]
    },
    {
      id: 'strategy-forex-edge',
      name: 'Strategy-Forex...',
      description: 'Precision EURUSD.edge orderflow scalper operating during EU overlap.',
      avatarKey: 'viceCharacterA',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 1,
      mostTraded: 'EURUSD.edge',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 100,
      accountType: 'Edge',
      totalTrades: 19,
      winRate: 52.6,
      profitFactor: 1.04,
      popularScore: 52,
      topSymbols: [
        { symbol: 'EURUSD.edge', pct: '100%', flags: ['eu', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] },
        { symbol: 'AUDJPY', pct: '0%', flags: ['au', 'jp'] }
      ],
      monthlyYield: { 2026: [1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 101, 99, 100]
    },
    {
      id: 'signal-edge-m',
      name: 'Signal-Edge-M...',
      description: 'Multi-timeframe breakout model with automated trailing take-profit.',
      avatarKey: 'viceCharacterA',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 1,
      mostTraded: 'EURUSD',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 100,
      accountType: 'XLev',
      totalTrades: 27,
      winRate: 51.8,
      profitFactor: 1.02,
      popularScore: 55,
      topSymbols: [
        { symbol: 'EURUSD', pct: '85%', flags: ['eu', 'us'] },
        { symbol: 'USDJPY', pct: '15%', flags: ['us', 'jp'] },
        { symbol: 'AUDJPY', pct: '0%', flags: ['au', 'jp'] }
      ],
      monthlyYield: { 2026: [2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 102, 99, 100]
    },
    {
      id: 'forex-test-ne',
      name: 'Forex-test-ne...',
      description: 'Experimental mean-reversion basket across low-spread FX pairs.',
      avatarKey: 'viceCharacterA',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 1,
      mostTraded: 'EURUSD',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 100,
      accountType: 'Standard',
      totalTrades: 16,
      winRate: 50.0,
      profitFactor: 1.0,
      popularScore: 39,
      topSymbols: [
        { symbol: 'EURUSD', pct: '70%', flags: ['eu', 'us'] },
        { symbol: 'GBPUSD', pct: '30%', flags: ['gb', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] }
      ],
      monthlyYield: { 2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 100, 100]
    },
    {
      id: 'strategy-test-si',
      name: 'Strategy Test Si...',
      description: 'High-conviction momentum breakout compounding strategy.',
      avatarKey: 'viceCharacterB',
      totalReturn: 99947.59,
      yieldCurrent: 142.8,
      fee: 10,
      drawdown: 0,
      followersCount: 3,
      mostTraded: 'USDJPY',
      riskScore: 8,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 500,
      accountType: 'XLev',
      totalTrades: 214,
      winRate: 74.2,
      profitFactor: 2.85,
      popularScore: 95,
      topSymbols: [
        { symbol: 'USDJPY', pct: '65%', flags: ['us', 'jp'] },
        { symbol: 'EURUSD', pct: '25%', flags: ['eu', 'us'] },
        { symbol: 'AUDJPY', pct: '10%', flags: ['au', 'jp'] }
      ],
      monthlyYield: { 2026: [38, 52, 24, 28, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [19, 25, 31, 44, 22, 18, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 165, 240, 390, 610]
    },
    {
      id: 'signal-test-new',
      name: 'Signal test new ...',
      description: 'Clean price-action intraday entries on major USD crosses.',
      avatarKey: 'viceCharacterA',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 0,
      drawdown: 0,
      followersCount: 1,
      mostTraded: 'EURUSD',
      riskScore: 1,
      currency: 'USD',
      strategyType: 'Manual',
      leverage: 100,
      accountType: 'Standard',
      totalTrades: 9,
      winRate: 55.5,
      profitFactor: 1.09,
      popularScore: 42,
      topSymbols: [
        { symbol: 'EURUSD', pct: '100%', flags: ['eu', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] },
        { symbol: 'AUDJPY', pct: '0%', flags: ['au', 'jp'] }
      ],
      monthlyYield: { 2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 100, 100]
    },
    {
      id: 'strategy-test-123',
      name: 'Strategytest123',
      description: 'Institutional volatility capture on GBP & EUR pairs.',
      avatarKey: 'viceCharacterA',
      totalReturn: 0.0,
      yieldCurrent: 0.0,
      fee: 34,
      drawdown: 0,
      followersCount: 2,
      mostTraded: 'GBPUSD',
      riskScore: 6,
      currency: 'USD',
      strategyType: 'ExpertAdvisor',
      leverage: 200,
      accountType: 'XLev',
      totalTrades: 41,
      winRate: 48.7,
      profitFactor: 1.01,
      popularScore: 64,
      topSymbols: [
        { symbol: 'GBPUSD', pct: '70%', flags: ['gb', 'us'] },
        { symbol: 'EURUSD', pct: '30%', flags: ['eu', 'us'] },
        { symbol: 'USDJPY', pct: '0%', flags: ['us', 'jp'] }
      ],
      monthlyYield: { 2026: [3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      equityCurve: [100, 103, 97, 100]
    }
  ],

  providerNotes: [
    {
      id: 'note-1',
      author: 'StrategyForex2',
      timestamp: '12:59 am • November 21, 2025',
      text: '[Automatic message] Important!, this signal provider has just updated its fee from 15% to 25%. This new value will be applied once the current month\'s performance is paid'
    },
    {
      id: 'note-2',
      author: 'StrategyForex2',
      timestamp: '7:59 pm • November 20, 2025',
      text: '[Automatic message] Important!, this signal provider has just updated its fee from 15% to 25%. This new value will be applied once the current month\'s performance is paid'
    },
    {
      id: 'note-3',
      author: 'StrategyForex2',
      timestamp: '4:15 pm • November 18, 2025',
      text: 'Session Desk Note: Maintaining strict EURUSD risk limits ahead of CPI volatility.'
    }
  ],

  followersList: [
    {
      login: '2100259318',
      name: 'Edinson Mejia',
      copyMode: 'Proportional',
      minLot: 'N/A',
      maxLot: 'N/A',
      riskRatio: '1',
      fixedLotAmt: 'N/A',
      ddProtection: 'No drawdown',
      maxDD: '$0'
    },
    {
      login: '2100257209',
      name: 'Test operaciones',
      copyMode: 'Proportional',
      minLot: 'N/A',
      maxLot: 'N/A',
      riskRatio: '0.7',
      fixedLotAmt: 'N/A',
      ddProtection: 'In equity',
      maxDD: '$1002'
    },
    {
      login: '2100224002',
      name: 'IB Test',
      copyMode: 'FixedLots',
      minLot: '0.02',
      maxLot: '11',
      riskRatio: 'N/A',
      fixedLotAmt: '2.5',
      ddProtection: 'In equity',
      maxDD: '$1200'
    },
    {
      login: '2100238293',
      name: 'Follower_Demo_Test',
      copyMode: 'Proportional',
      minLot: 'N/A',
      maxLot: 'N/A',
      riskRatio: '1',
      fixedLotAmt: 'N/A',
      ddProtection: 'No drawdown',
      maxDD: '$0'
    }
  ],

  orders: {
    open: [],
    sampleSimulatedOrder: {
      ticket: '9842105',
      openTime: '2026-11-27 09:14:22',
      type: 'BUY',
      symbol: 'EURUSD',
      volume: '0.50',
      price: '1.08420',
      sl: '1.08100',
      tp: '1.09050',
      commission: '-3.50',
      swap: '0.00',
      pnl: '+142.50',
      comment: 'StrategyForex2_EA'
    },
    closed: [
      {
        ticket: '9841022',
        openTime: '2026-11-25 14:20:09',
        type: 'BUY',
        symbol: 'EURUSD',
        volume: '1.00',
        price: '1.08110',
        sl: '1.07850',
        tp: '1.08650',
        commission: '-7.00',
        swap: '-1.20',
        pnl: '+324.00',
        comment: 'Copied #StrategyForex2'
      },
      {
        ticket: '9840814',
        openTime: '2026-11-24 08:45:31',
        type: 'SELL',
        symbol: 'USDJPY',
        volume: '0.50',
        price: '154.620',
        sl: '155.100',
        tp: '153.900',
        commission: '-3.50',
        swap: '+0.80',
        pnl: '+186.40',
        comment: 'Copied #StrategyForex2'
      },
      {
        ticket: '9839905',
        openTime: '2026-11-21 16:02:11',
        type: 'BUY',
        symbol: 'AUDJPY',
        volume: '0.25',
        price: '99.840',
        sl: '99.400',
        tp: '100.400',
        commission: '-1.75',
        swap: '0.00',
        pnl: '-58.25',
        comment: 'SL Hit'
      }
    ],
    historicalSettings: [
      {
        date: '2026-11-21 09:12:04',
        strategy: 'StrategyForex2',
        copyMode: 'FixedLots',
        riskOrLot: '2.50 lots',
        minMaxLot: '0.02 / 11',
        ddProtection: 'In equity ($1200)',
        action: 'Updated Max. DD & Risk ratio'
      },
      {
        date: '2026-11-14 18:40:19',
        strategy: 'StrategyForex2',
        copyMode: 'Proportional',
        riskOrLot: '1.0x',
        minMaxLot: '0.01 / 5',
        ddProtection: 'In equity ($800)',
        action: 'Started following strategy'
      }
    ]
  },

  agentChatInitial: {
    follower: [
      {
        role: 'agent',
        sender: 'Manager Tim',
        time: 'Online',
        text: 'Hey IB Test! I’m Manager Tim, your Communitraders & MultiMAM guide. You’re currently copying StrategyForex2 (#2 in Global Leaderboards). Want to inspect top risk-adjusted managers, check your badges, or join the Demo to Live Challenge?'
      }
    ],
    provider: [
      {
        role: 'agent',
        sender: 'Manager Tim',
        time: 'Online',
        text: 'Welcome back Signal Test! You just climbed into the Top 10 Signal Providers this month with 6 unlocked badges (including Gold Risk Master). Check Season Challenges or share your public profile referral link to attract more followers.'
      }
    ]
  },

  timNotifications: [
    {
      title: 'Risk Master Badge Unlocked',
      tier: 'Gold',
      text: 'Congratulations! You have unlocked the Risk Master badge.'
    },
    {
      title: 'Leaderboard Rank Up',
      tier: 'Platinum',
      text: 'You are now among the Top 10 Money Managers this month.'
    },
    {
      title: 'New Season Launched',
      tier: 'Legendary',
      text: 'A new season is starting. Check out the available challenges.'
    }
  ],

  // 10 Badges & Achievements Catalog (5 Tiers: Bronze, Silver, Gold, Platinum, Legendary)
  badgesCatalog: [
    {
      id: 'top-money-manager',
      name: 'Top Money Manager',
      icon: '👑',
      desc: 'Top-performing Money Managers on MultiMAM.',
      criteria: 'Top 10 verified monthly net return',
      providerTier: 'Gold',
      followerTier: null,
      progressPct: 100
    },
    {
      id: 'top-signal-provider',
      name: 'Top Signal Provider',
      icon: '📡',
      desc: 'Top-performing Signal Providers in Communitraders.',
      criteria: 'Rank Top 5 in Signal Providers',
      providerTier: 'Platinum',
      followerTier: null,
      progressPct: 100
    },
    {
      id: 'best-risk-manager',
      name: 'Best Risk Manager',
      icon: '🛡️',
      desc: 'Best Profit-to-Drawdown Ratio across verified trades.',
      criteria: 'Profit/DD ratio ≥ 3.5x',
      providerTier: 'Gold',
      followerTier: 'Bronze',
      progressPct: 100
    },
    {
      id: 'tp-hunter',
      name: 'TP Hunter',
      icon: '🎯',
      desc: '100 Take Profits achieved cleanly without widening SL.',
      criteria: '80 / 100 verified TP hits',
      providerTier: 'Silver',
      followerTier: 'Bronze',
      progressPct: 80
    },
    {
      id: 'capital-king',
      name: 'Capital King',
      icon: '💎',
      desc: 'Largest capital under management (AUM).',
      criteria: '$250K+ verified copied/managed AUM',
      providerTier: 'Bronze',
      followerTier: null,
      progressPct: 48
    },
    {
      id: 'crowd-favorite',
      name: 'Crowd Favorite',
      icon: '🔥',
      desc: 'Most followed strategy by active accounts.',
      criteria: '4 / 10 active followers for Gold',
      providerTier: 'Silver',
      followerTier: null,
      progressPct: 72
    },
    {
      id: 'consistency-master',
      name: 'Consistency Master',
      icon: '📈',
      desc: 'Consistent monthly performance with controlled variance.',
      criteria: '6+ positive months out of 8',
      providerTier: 'Platinum',
      followerTier: 'Silver',
      progressPct: 100
    },
    {
      id: 'rising-star',
      name: 'Rising Star',
      icon: '⭐',
      desc: 'Best emerging Money Manager or Signal Provider.',
      criteria: 'Fastest 90-day verified growth',
      providerTier: 'Gold',
      followerTier: 'Bronze',
      progressPct: 100
    },
    {
      id: 'drawdown-defender',
      name: 'Drawdown Defender',
      icon: '⚡',
      desc: 'Maintaining controlled drawdown over time.',
      criteria: 'Max DD ≤ 5% over 60 days',
      providerTier: 'Legendary',
      followerTier: 'Gold',
      progressPct: 100
    },
    {
      id: 'veteran-manager',
      name: 'Veteran Manager',
      icon: '🏛️',
      desc: 'Long-term verified trading history on Tradeview.',
      criteria: '12+ months verified track record',
      providerTier: 'Gold',
      followerTier: null,
      progressPct: 85
    }
  ],

  // Global Leaderboards (8 Tabs + 5 Timeframes + Public Profile Data)
  leaderboardTabs: [
    { id: 'top-mm', label: 'Top Money Managers' },
    { id: 'top-sp', label: 'Top Signal Providers' },
    { id: 'best-risk', label: 'Best Risk Managers' },
    { id: 'capital-leaders', label: 'Capital Leaders' },
    { id: 'most-followed', label: 'Most Followed Strategies' },
    { id: 'fastest-growing', label: 'Fastest-Growing Strategies' },
    { id: 'most-consistent', label: 'Most Consistent Managers' },
    { id: 'rising-stars', label: 'Rising Stars' }
  ],

  leaderboardEntries: [
    {
      id: 'lb-strategy-forex-2',
      strategyId: 'strategy-forex-2',
      name: 'StrategyForex2',
      manager: 'Signal Test',
      type: 'Signal Provider',
      platform: 'Communitraders',
      returnAll: 77.86,
      returnAnnual: 64.2,
      returnQuarterly: 28.4,
      returnMonthly: 14.8,
      returnWeekly: 4.1,
      profitDdRatio: 4.8,
      aum: 148500,
      followers: 4,
      growthPct: 38.4,
      consistencyPct: 91,
      riskScore: 1,
      maxDD: 2.4,
      winRate: 68.5,
      fee: 25,
      referralCode: 'TV-SIG-2100224001',
      badges: [
        { name: 'Drawdown Defender', tier: 'Legendary' },
        { name: 'Top Signal Provider', tier: 'Platinum' },
        { name: 'Best Risk Manager', tier: 'Gold' },
        { name: 'Consistency Master', tier: 'Platinum' }
      ],
      isSelf: true,
      featured: true
    },
    {
      id: 'lb-alpha-mam',
      strategyId: 'best-strategy-jb',
      name: 'Vanguard MultiMAM Alpha',
      manager: 'Mateo Silva',
      type: 'Money Manager',
      platform: 'MultiMAM',
      returnAll: 112.4,
      returnAnnual: 58.9,
      returnQuarterly: 22.1,
      returnMonthly: 11.4,
      returnWeekly: 3.2,
      profitDdRatio: 5.4,
      aum: 842000,
      followers: 29,
      growthPct: 24.5,
      consistencyPct: 94,
      riskScore: 1,
      maxDD: 2.1,
      winRate: 71.2,
      fee: 20,
      referralCode: 'TV-MAM-884120',
      badges: [
        { name: 'Capital King', tier: 'Legendary' },
        { name: 'Top Money Manager', tier: 'Legendary' },
        { name: 'Best Risk Manager', tier: 'Platinum' }
      ],
      featured: true
    },
    {
      id: 'lb-best-jb',
      strategyId: 'best-strategy-jb',
      name: 'best strategy JB...',
      manager: 'Julian B.',
      type: 'Signal Provider',
      platform: 'Communitraders',
      returnAll: 20.2,
      returnAnnual: 20.2,
      returnQuarterly: 14.5,
      returnMonthly: 6.1,
      returnWeekly: 1.9,
      profitDdRatio: 3.9,
      aum: 64200,
      followers: 18,
      growthPct: 44.2,
      consistencyPct: 86,
      riskScore: 1,
      maxDD: 1.8,
      winRate: 65.4,
      fee: 0,
      referralCode: 'TV-SIG-554102',
      badges: [
        { name: 'Rising Star', tier: 'Platinum' },
        { name: 'Crowd Favorite', tier: 'Gold' }
      ]
    },
    {
      id: 'lb-institutional-fx',
      strategyId: 'strategy-edge',
      name: 'Institutional Alpha FX',
      manager: 'Elena Rostova',
      type: 'Money Manager',
      platform: 'MultiMAM',
      returnAll: 89.5,
      returnAnnual: 49.4,
      returnQuarterly: 19.2,
      returnMonthly: 9.7,
      returnWeekly: 2.8,
      profitDdRatio: 4.3,
      aum: 1240000,
      followers: 42,
      growthPct: 19.8,
      consistencyPct: 96,
      riskScore: 2,
      maxDD: 3.1,
      winRate: 69.0,
      fee: 15,
      referralCode: 'TV-MAM-903211',
      badges: [
        { name: 'Capital King', tier: 'Legendary' },
        { name: 'Consistency Master', tier: 'Legendary' },
        { name: 'Veteran Manager', tier: 'Platinum' }
      ],
      featured: true
    },
    {
      id: 'lb-strategy-si',
      strategyId: 'strategy-test-si',
      name: 'Strategy Test Si...',
      manager: 'Dante V.',
      type: 'Signal Provider',
      platform: 'Communitraders',
      returnAll: 184.5,
      returnAnnual: 142.8,
      returnQuarterly: 68.0,
      returnMonthly: 28.0,
      returnWeekly: 7.4,
      profitDdRatio: 2.1,
      aum: 92400,
      followers: 15,
      growthPct: 62.5,
      consistencyPct: 71,
      riskScore: 8,
      maxDD: 14.5,
      winRate: 74.2,
      fee: 10,
      referralCode: 'TV-SIG-778201',
      badges: [
        { name: 'Rising Star', tier: 'Gold' },
        { name: 'TP Hunter', tier: 'Platinum' }
      ]
    },
    {
      id: 'lb-apex-quant',
      strategyId: 'signal-edge-m',
      name: 'Apex Quant MAM',
      manager: 'Carlos Mendez',
      type: 'Money Manager',
      platform: 'MultiMAM',
      returnAll: 64.1,
      returnAnnual: 41.2,
      returnQuarterly: 16.4,
      returnMonthly: 7.9,
      returnWeekly: 2.1,
      profitDdRatio: 4.6,
      aum: 510000,
      followers: 24,
      growthPct: 31.0,
      consistencyPct: 89,
      riskScore: 1,
      maxDD: 2.2,
      winRate: 67.1,
      fee: 18,
      referralCode: 'TV-MAM-412008',
      badges: [
        { name: 'Drawdown Defender', tier: 'Gold' },
        { name: 'Veteran Manager', tier: 'Gold' }
      ]
    }
  ],

  // 7 Season Challenges Catalog (Section 3) + Level/Trophy/Medal Progression
  signalChallenge: {
    seasonTitle: 'SEASON',
    userLevel: 14,
    userXp: 4280,
    nextLevelXp: 5000,
    currentRankIndex: 2, // 0: Bronze, 1: Silver, 2: Gold, 3: Platinum, 4: Legendary
    ranksLadder: [
      { name: 'Bronze', minLevel: 1, stars: 1, perk: 'Verified Profile' },
      { name: 'Silver', minLevel: 6, stars: 2, perk: 'Public Ranking Eligibility' },
      { name: 'Gold', minLevel: 12, stars: 3, perk: 'Featured Discover Slot' },
      { name: 'Platinum', minLevel: 18, stars: 4, perk: 'Reduced Platform Fee' },
      { name: 'Legendary', minLevel: 25, stars: 5, perk: 'Institutional Allocation Review' }
    ],
    trophiesAndMedals: [
      { id: 'tm-1', kind: 'trophy', name: 'Manager League Cup', tier: 'Gold', stars: 4, desc: 'Top 5 finish in Q4 League standings' },
      { id: 'tm-2', kind: 'medal', name: 'Risk Master Medal', tier: 'Platinum', stars: 5, desc: '4.8x Profit-to-Drawdown verified ratio' },
      { id: 'tm-3', kind: 'trophy', name: 'Consistency Trophy', tier: 'Gold', stars: 4, desc: '8 consecutive controlled-DD weeks' },
      { id: 'tm-4', kind: 'medal', name: 'Strategy Builder Medal', tier: 'Silver', stars: 3, desc: 'Verified EA profile & 80+ tracked trades' }
    ],
    tierLabel: 'Tier II — Verified Strategist',
    nextTierLabel: 'Tier III — Elite Syndicate',
    tierProgressPct: 78,
    daysRemaining: '14d 08h',
    kpis: [
      { label: 'Profit Target (+15%)', value: '+77.86%', status: 'PASSED', pct: 100 },
      { label: 'Max Drawdown (≤10%)', value: '2.40%', status: 'PASSED', pct: 24 },
      { label: 'Min Trading Days (10)', value: '18 Days', status: 'PASSED', pct: 100 },
      { label: 'Follower Milestone (5)', value: '4 / 5', status: 'IN PROGRESS', pct: 80 }
    ],
    challengesCatalog: [
      {
        id: 'ch-30-day',
        name: '30-Day Challenge',
        category: 'Consistency',
        eligibility: 'Verified MT4/MT5 Live or Demo Accounts',
        startDate: 'Nov 01, 2026',
        endDate: 'Nov 30, 2026',
        objective: 'Achieve ≥ +6% verified return with ≤ 5% max drawdown over 30 days.',
        progressPct: 90,
        reward: 'Consistency Master (Gold) + Featured Slot',
        rank: '#4 / 182',
        status: 'claimable'
      },
      {
        id: 'ch-demo-live',
        name: 'Demo to Live Challenge',
        category: 'Qualification',
        eligibility: 'New Traders & Demo Candidates (Subject to Compliance Approval)',
        startDate: 'Nov 01, 2026',
        endDate: 'Dec 15, 2026',
        objective: 'Demonstrate +10% return, ≤ 6% DD, min 15 trading days to qualify for a Live Signal Provider account.',
        progressPct: 68,
        reward: 'Funded Live Account Sponsorship (Pending Review)',
        rank: '#12 / 410',
        status: 'active'
      },
      {
        id: 'ch-risk-master',
        name: 'Risk Master Challenge',
        category: 'Risk Control',
        eligibility: 'All Signal Providers & Money Managers',
        startDate: 'Nov 01, 2026',
        endDate: 'Dec 31, 2026',
        objective: 'Maintain Profit-to-Drawdown ratio ≥ 3.5x with zero daily DD breaches.',
        progressPct: 100,
        reward: 'Best Risk Manager Badge (Gold)',
        rank: '#2 / 94',
        status: 'claimable'
      },
      {
        id: 'ch-build-fund',
        name: 'Build Your Fund',
        category: 'Capital Growth',
        eligibility: 'MultiMAM Money Managers & Signal Providers',
        startDate: 'Oct 15, 2026',
        endDate: 'Jan 15, 2027',
        objective: 'Grow AUM sustainably by +25% while keeping follower retention ≥ 85%.',
        progressPct: 62,
        reward: 'Capital King Tier Up + $500 Rebate Credit',
        rank: '#7 / 68',
        status: 'active'
      },
      {
        id: 'ch-strategy-builder',
        name: 'Strategy Builder',
        category: 'Onboarding',
        eligibility: 'Newly Registered Signal Providers',
        startDate: 'Nov 01, 2026',
        endDate: 'Dec 31, 2026',
        objective: 'Publish a verified strategy profile, bio, risk cap, and execute 20+ tracked trades.',
        progressPct: 100,
        reward: 'Verified Strategist Emblem',
        rank: 'Qualified',
        status: 'claimed'
      },
      {
        id: 'ch-manager-month',
        name: 'Manager of the Month',
        category: 'Spotlight',
        eligibility: 'Top 20 Leaderboard Managers',
        startDate: 'Nov 01, 2026',
        endDate: 'Nov 30, 2026',
        objective: 'Lead monthly risk-adjusted return & follower satisfaction score.',
        progressPct: 84,
        reward: 'Homepage Featured Hero + Press Spotlight',
        rank: '#2 / 20',
        status: 'active'
      },
      {
        id: 'ch-manager-league',
        name: 'Manager League (Q4)',
        category: 'League Competition',
        eligibility: 'Monthly, Quarterly & Annual Verified Accounts',
        startDate: 'Oct 01, 2026',
        endDate: 'Dec 31, 2026',
        objective: 'Compete across Monthly, Quarterly, and Annual divisions for League Trophy.',
        progressPct: 78,
        reward: 'Platinum League Trophy + Institutional Allocation Review',
        rank: '#3 / 120',
        status: 'active'
      }
    ]
  }
};
