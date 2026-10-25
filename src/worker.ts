import { MENU_ITEM_ID } from './constants';
import { findEngine, getAvailableEngines } from './settings';

const CHILD_MENU_ITEM_ID_PREFIX = `${MENU_ITEM_ID}.`;

// worker 再起動のたびに重複 ID エラーになるため、必ず onInstalled の中で作成する
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    type: 'normal',
    id: MENU_ITEM_ID,
    // %s は Chrome が選択文字列に置換する
    title: chrome.i18n.getMessage('menuItemTitle'),
    contexts: ['selection'],
  });

  for (const engine of getAvailableEngines(chrome.i18n.getUILanguage())) {
    chrome.contextMenus.create({
      type: 'normal',
      id: `${CHILD_MENU_ITEM_ID_PREFIX}${engine.id}`,
      parentId: MENU_ITEM_ID,
      title: engine.title,
      contexts: ['selection'],
    });
  }
});

chrome.contextMenus.onClicked.addListener(({ menuItemId, selectionText }, tab) => {
  if (typeof menuItemId !== 'string' || !menuItemId.startsWith(CHILD_MENU_ITEM_ID_PREFIX)) {
    return;
  }

  const engine = findEngine(menuItemId.slice(CHILD_MENU_ITEM_ID_PREFIX.length));
  const query = selectionText?.trim();

  if (engine === undefined || query === undefined || query === '') {
    return;
  }

  void chrome.tabs.create({
    url: engine.buildUrl(query, chrome.i18n.getUILanguage()),
    // 元のタブの右隣に開く。tab は拡張機能のコンテキスト外から呼ばれた場合に undefined になりうる
    ...(tab === undefined ? {} : { index: tab.index + 1 }),
  });
});
