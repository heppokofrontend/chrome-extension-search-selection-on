import { encodeShiftJis } from './utils/encode-shift-jis';

export type Engine = {
  id: string;
  title: string;
  // uiLanguage は chrome.i18n.getUILanguage() の値(例: "ja", "en-US")
  buildUrl: (query: string, uiLanguage: string) => string;
};

export const ENGINES: { ALL: readonly Engine[]; JP: readonly Engine[]; EN: readonly Engine[] } = {
  // 言語を問わず出す
  ALL: [
    {
      id: 'x',
      title: 'X（Twitter）',
      buildUrl: (query) => `https://x.com/search?q=${encodeURIComponent(query)}`,
    },
    {
      id: 'youtube',
      title: 'YouTube',
      buildUrl: (query) =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    },
    {
      id: 'instagram',
      title: 'Instagram',
      buildUrl: (query) =>
        `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(query)}`,
    },
    {
      id: 'google',
      title: 'Google',
      buildUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    },
    {
      id: 'amazon',
      title: 'Amazon',
      buildUrl: (query, uiLanguage) =>
        `https://www.amazon.${uiLanguage.startsWith('ja') ? 'co.jp' : 'com'}/s?k=${encodeURIComponent(query)}`,
    },
    {
      id: 'wikipedia',
      title: 'Wikipedia',
      // 言語版は UI 言語の主言語サブタグで切り替える(例: "en-US" → en.wikipedia.org)
      buildUrl: (query, uiLanguage) =>
        `https://${uiLanguage.split('-')[0] ?? 'en'}.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
    },
    {
      id: 'google-maps',
      title: 'Google Maps',
      buildUrl: (query) => `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
    },
    {
      id: 'reddit',
      title: 'Reddit',
      buildUrl: (query) => `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
    },
  ],
  // UI 言語が日本語のときだけ出す
  JP: [
    {
      id: 'yodobashi',
      title: 'ヨドバシ.com',
      buildUrl: (query) => `https://www.yodobashi.com/?word=${encodeURIComponent(query)}`,
    },
    {
      id: 'biccamera',
      title: 'ビックカメラ.com',
      // ビックカメラのクエリは Shift_JIS でパーセントエンコードされている
      buildUrl: (query) => `https://www.biccamera.com/bc/category/?q=${encodeShiftJis(query)}`,
    },
    {
      id: 'rakuten',
      title: '楽天市場',
      buildUrl: (query) => `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(query)}/`,
    },
    {
      id: 'yahoo-shopping',
      title: 'Yahoo!ショッピング',
      buildUrl: (query) => `https://shopping.yahoo.co.jp/search/${encodeURIComponent(query)}/0/`,
    },
    {
      id: 'yahoo-auctions',
      title: 'ヤフオク!',
      buildUrl: (query) =>
        `https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(query)}`,
    },
    {
      id: 'mercari',
      title: 'メルカリ',
      buildUrl: (query) => `https://jp.mercari.com/search?keyword=${encodeURIComponent(query)}`,
    },
  ],
  // UI 言語が英語のときだけ出す
  EN: [
    {
      id: 'ebay',
      title: 'eBay',
      buildUrl: (query) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
    },
  ],
};

// 定義順に依存させず、グループをまたいで id の昇順で並べる
export const getAvailableEngines = (uiLanguage: string): readonly Engine[] =>
  [
    ...ENGINES.ALL,
    ...(uiLanguage.startsWith('ja') ? ENGINES.JP : []),
    ...(uiLanguage.startsWith('en') ? ENGINES.EN : []),
  ].toSorted((a, b) => a.id.localeCompare(b.id));

export const findEngine = (id: string) =>
  [...ENGINES.ALL, ...ENGINES.JP, ...ENGINES.EN].find((engine) => engine.id === id);
