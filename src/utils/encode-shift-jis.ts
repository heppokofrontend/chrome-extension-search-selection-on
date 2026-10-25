// TextEncoder は UTF-8 しか扱えないため、TextDecoder で全コードを逆引きして変換表を作る
let shiftJisTable: ReadonlyMap<string, readonly number[]> | undefined;

const buildShiftJisTable = () => {
  const decoder = new TextDecoder('shift_jis');
  const table = new Map<string, readonly number[]>();
  const register = (bytes: readonly number[]) => {
    const char = decoder.decode(new Uint8Array(bytes));

    // 未定義のコードは U+FFFD になる。同じ文字に複数のコードが割り当てられている場合は先勝ちにする
    if (Array.from(char).length === 1 && char !== '\uFFFD' && !table.has(char)) {
      table.set(char, bytes);
    }
  };

  for (let byte = 0xa1; byte <= 0xdf; byte++) {
    register([byte]);
  }

  for (let lead = 0x81; lead <= 0xfc; lead++) {
    if (lead > 0x9f && lead < 0xe0) {
      continue;
    }

    for (let trail = 0x40; trail <= 0xfc; trail++) {
      if (trail !== 0x7f) {
        register([lead, trail]);
      }
    }
  }

  return table;
};

const toPercent = (bytes: readonly number[]) =>
  bytes.map((byte) => `%${byte.toString(16).toUpperCase().padStart(2, '0')}`).join('');

/**
 * 文字列を Shift_JIS としてパーセントエンコードする。
 * Shift_JIS で表せない文字は、フォーム送信時のブラウザの挙動に合わせて数値文字参照にする。
 */
export const encodeShiftJis = (text: string) => {
  shiftJisTable ??= buildShiftJisTable();

  return Array.from(text)
    .map((char) => {
      const codePoint = char.codePointAt(0) ?? 0;

      if (codePoint < 0x80) {
        return encodeURIComponent(char);
      }

      const bytes = shiftJisTable?.get(char);

      return bytes === undefined ? encodeURIComponent(`&#${String(codePoint)};`) : toPercent(bytes);
    })
    .join('');
};
