const textInput = document.getElementById("textInput");
const preview = document.getElementById("preview");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const fontSelect = document.getElementById("fontSelect");
const phoneticToggle = document.getElementById("phoneticToggle");
const keyboardToggle = document.getElementById("keyboardToggle");
const keyboardContainer = document.getElementById("keyboardContainer");
const urduKeyboard = document.getElementById("urduKeyboard");
const layerIndicator = document.getElementById("layerIndicator");

const FONT_STYLES = {
  "MyUrduFont": { family: '"MyUrduFont", "Noto Naskh Arabic", serif', lineHeight: "2.2" },
  "Noto Nastaliq Urdu": { family: '"Noto Nastaliq Urdu", "MyUrduFont", serif', lineHeight: "2.75" },
  "Gulzar": { family: '"Gulzar", "MyUrduFont", serif', lineHeight: "2.5" },
  "Aref Ruqaa": { family: '"Aref Ruqaa", "MyUrduFont", serif', lineHeight: "2.35" },
  "Alkalami": { family: '"Alkalami", "MyUrduFont", serif', lineHeight: "2.4" },
  "Katibeh": { family: '"Katibeh", "MyUrduFont", serif', lineHeight: "2.25" },
  "Amiri": { family: '"Amiri", "MyUrduFont", serif', lineHeight: "2.15" },
  "Rakkas": { family: '"Rakkas", "MyUrduFont", serif', lineHeight: "2.3" },
  "Marhey": { family: '"Marhey", "MyUrduFont", sans-serif', lineHeight: "2.2" },
  "Noto Naskh Arabic": { family: '"Noto Naskh Arabic", "MyUrduFont", serif', lineHeight: "2.1" },
  "Scheherazade New": { family: '"Scheherazade New", "MyUrduFont", serif', lineHeight: "2.2" },
  "Lateef": { family: '"Lateef", "MyUrduFont", serif', lineHeight: "2.1" },
  "Markazi Text": { family: '"Markazi Text", "MyUrduFont", serif', lineHeight: "2.1" },
  "Harmattan": { family: '"Harmattan", "MyUrduFont", serif', lineHeight: "2.15" },
  "Reem Kufi": { family: '"Reem Kufi", "MyUrduFont", sans-serif', lineHeight: "2.1" },
  "Noto Kufi Arabic": { family: '"Noto Kufi Arabic", "MyUrduFont", sans-serif', lineHeight: "2.1" },
  "Kufam": { family: '"Kufam", "MyUrduFont", sans-serif', lineHeight: "2.1" },
  "Mirza": { family: '"Mirza", "MyUrduFont", serif', lineHeight: "2.1" },
  "Lalezar": { family: '"Lalezar", "MyUrduFont", sans-serif', lineHeight: "2.05" },
  "Changa": { family: '"Changa", "MyUrduFont", sans-serif', lineHeight: "2.05" },
  "Lemonada": { family: '"Lemonada", "MyUrduFont", sans-serif', lineHeight: "2.25" },
  "Vazirmatn": { family: '"Vazirmatn", "MyUrduFont", sans-serif', lineHeight: "2.05" },
  "Cairo": { family: '"Cairo", "MyUrduFont", sans-serif', lineHeight: "2.05" },
  "Tajawal": { family: '"Tajawal", "MyUrduFont", sans-serif', lineHeight: "2.05" },
  "IBM Plex Sans Arabic": { family: '"IBM Plex Sans Arabic", "MyUrduFont", sans-serif', lineHeight: "2.05" },
};

const FONT_STORAGE_KEY = "urduFontWriter.selectedFont";

function applyFontStyle(fontKey) {
  const style = FONT_STYLES[fontKey] || FONT_STYLES["MyUrduFont"];
  document.documentElement.style.setProperty("--urdu-font", style.family);
  document.documentElement.style.setProperty("--urdu-line-height", style.lineHeight);
  if (fontSelect.value !== fontKey && FONT_STYLES[fontKey]) {
    fontSelect.value = fontKey;
  }
}

// Standard Urdu Phonetic layout rows (each key maps normal & shifted characters)
const KEYBOARD_ROWS = [
  [
    { code: "Backquote", hint: "`", normal: "ً", shift: "ٰ" },
    { code: "Digit1", hint: "1", normal: "۱", shift: "!" },
    { code: "Digit2", hint: "2", normal: "۲", shift: "@" },
    { code: "Digit3", hint: "3", normal: "۳", shift: "#" },
    { code: "Digit4", hint: "4", normal: "۴", shift: "₨" },
    { code: "Digit5", hint: "5", normal: "۵", shift: "٪" },
    { code: "Digit6", hint: "6", normal: "۶", shift: "^" },
    { code: "Digit7", hint: "7", normal: "۷", shift: "&" },
    { code: "Digit8", hint: "8", normal: "۸", shift: "٭" },
    { code: "Digit9", hint: "9", normal: "۹", shift: "(" },
    { code: "Digit0", hint: "0", normal: "۰", shift: ")" },
    { code: "Minus", hint: "-", normal: "-", shift: "ـ" },
    { code: "Equal", hint: "=", normal: "=", shift: "+" },
    { action: "backspace", label: "⌫", title: "Backspace", className: "special wide" },
  ],
  [
    { code: "KeyQ", hint: "q", normal: "ق", shift: "ْ" },
    { code: "KeyW", hint: "w", normal: "و", shift: "ؤ" },
    { code: "KeyE", hint: "e", normal: "ع", shift: "َ" },
    { code: "KeyR", hint: "r", normal: "ر", shift: "ڑ" },
    { code: "KeyT", hint: "t", normal: "ت", shift: "ٹ" },
    { code: "KeyY", hint: "y", normal: "ے", shift: "ۓ" },
    { code: "KeyU", hint: "u", normal: "ء", shift: "ئ" },
    { code: "KeyI", hint: "i", normal: "ی", shift: "ِ" },
    { code: "KeyO", hint: "o", normal: "ہ", shift: "ۂ" },
    { code: "KeyP", hint: "p", normal: "پ", shift: "ُ" },
    { code: "BracketLeft", hint: "[", normal: "[", shift: "{" },
    { code: "BracketRight", hint: "]", normal: "]", shift: "}" },
  ],
  [
    { code: "KeyA", hint: "a", normal: "ا", shift: "آ" },
    { code: "KeyS", hint: "s", normal: "س", shift: "ص" },
    { code: "KeyD", hint: "d", normal: "د", shift: "ڈ" },
    { code: "KeyF", hint: "f", normal: "ف", shift: "ٰ" },
    { code: "KeyG", hint: "g", normal: "گ", shift: "غ" },
    { code: "KeyH", hint: "h", normal: "ھ", shift: "ح" },
    { code: "KeyJ", hint: "j", normal: "ج", shift: "ض" },
    { code: "KeyK", hint: "k", normal: "ک", shift: "خ" },
    { code: "KeyL", hint: "l", normal: "ل", shift: "ؒ" },
    { code: "Semicolon", hint: ";", normal: "؛", shift: ":" },
    { code: "Quote", hint: "'", normal: "'", shift: '"' },
    { action: "enter", label: "↵", title: "New line", className: "special wide" },
  ],
  [
    { action: "shift", label: "⇧ Shift", title: "Toggle Shift layer", className: "special extra-wide" },
    { code: "KeyZ", hint: "z", normal: "ز", shift: "ذ" },
    { code: "KeyX", hint: "x", normal: "ش", shift: "ژ" },
    { code: "KeyC", hint: "c", normal: "چ", shift: "ث" },
    { code: "KeyV", hint: "v", normal: "ط", shift: "ظ" },
    { code: "KeyB", hint: "b", normal: "ب", shift: "ً" },
    { code: "KeyN", hint: "n", normal: "ن", shift: "ں" },
    { code: "KeyM", hint: "m", normal: "م", shift: "ّ" },
    { code: "Comma", hint: ",", normal: "،", shift: "ِ" },
    { code: "Period", hint: ".", normal: "۔", shift: "َ" },
    { code: "Slash", hint: "/", normal: "/", shift: "؟" },
  ],
  [
    { action: "space", label: "Space", title: "Space", className: "special space-key" },
  ],
];

// Build lookup table from physical ASCII character -> Urdu character
const PHONETIC_MAP = {};
const SHIFT_ASCII_MAP = {
  "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
  "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_",
  "=": "+", "[": "{", "]": "}", ";": ":", "'": '"', ",": "<",
  ".": ">", "/": "?",
};

for (const row of KEYBOARD_ROWS) {
  for (const key of row) {
    if (!key.hint) continue;
    PHONETIC_MAP[key.hint] = key.normal;
    const shiftedHint = SHIFT_ASCII_MAP[key.hint] || key.hint.toUpperCase();
    PHONETIC_MAP[shiftedHint] = key.shift;
  }
}

let phoneticEnabled = true;
let keyboardVisible = true;
let shiftLocked = false;
let physicalShiftHeld = false;
let lastSelection = { start: textInput.value.length, end: textInput.value.length };
let repeatDelayTimer = null;
let repeatIntervalTimer = null;

const keyElementsByCode = new Map();
const keyButtons = [];

function isShiftActive() {
  return shiftLocked || physicalShiftHeld;
}

function syncPreview() {
  preview.textContent = textInput.value || " ";
}

function saveSelection() {
  lastSelection = {
    start: textInput.selectionStart ?? textInput.value.length,
    end: textInput.selectionEnd ?? textInput.value.length,
  };
}

function getCaretRange() {
  if (document.activeElement === textInput) {
    return {
      start: textInput.selectionStart ?? textInput.value.length,
      end: textInput.selectionEnd ?? textInput.value.length,
    };
  }
  const max = textInput.value.length;
  return {
    start: Math.min(lastSelection.start, max),
    end: Math.min(lastSelection.end, max),
  };
}

function insertTextAtCursor(text, fromTouch = false) {
  const { start, end } = getCaretRange();
  const value = textInput.value;
  textInput.value = value.slice(0, start) + text + value.slice(end);
  const newPos = start + text.length;
  lastSelection = { start: newPos, end: newPos };

  // Keep focus on desktop mouse clicks; avoid forcing native OS keyboard open on touch
  if (!fromTouch) {
    textInput.focus();
  }
  if (document.activeElement === textInput) {
    textInput.setSelectionRange(newPos, newPos);
  }
  syncPreview();
}

function deleteAtCursor(fromTouch = false) {
  const { start, end } = getCaretRange();
  const value = textInput.value;
  let newPos = start;

  if (start !== end) {
    textInput.value = value.slice(0, start) + value.slice(end);
    newPos = start;
  } else if (start > 0) {
    textInput.value = value.slice(0, start - 1) + value.slice(end);
    newPos = start - 1;
  } else {
    return;
  }

  lastSelection = { start: newPos, end: newPos };
  if (!fromTouch) {
    textInput.focus();
  }
  if (document.activeElement === textInput) {
    textInput.setSelectionRange(newPos, newPos);
  }
  syncPreview();
}

function updateKeyboardLabels() {
  const shifted = isShiftActive();
  layerIndicator.textContent = shifted ? "Shift" : "Normal";
  layerIndicator.classList.toggle("shift-active", shifted);

  for (const { btn, key } of keyButtons) {
    if (key.action === "shift") {
      btn.classList.toggle("shift-on", shifted);
      btn.setAttribute("aria-pressed", String(shifted));
    } else if (key.normal !== undefined) {
      const charSpan = btn.querySelector(".urdu-char");
      const hintSpan = btn.querySelector(".latin-hint");
      charSpan.textContent = shifted ? key.shift : key.normal;
      const hintChar = shifted
        ? (SHIFT_ASCII_MAP[key.hint] || key.hint.toUpperCase())
        : key.hint;
      hintSpan.textContent = hintChar;
    }
  }
}

function stopRepeat() {
  clearTimeout(repeatDelayTimer);
  clearInterval(repeatIntervalTimer);
  repeatDelayTimer = null;
  repeatIntervalTimer = null;
}

function flashKey(el) {
  if (!el) return;
  el.classList.add("is-pressed");
  setTimeout(() => el.classList.remove("is-pressed"), 130);
}

function renderKeyboard() {
  urduKeyboard.innerHTML = "";
  keyElementsByCode.clear();
  keyButtons.length = 0;

  for (const row of KEYBOARD_ROWS) {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";

    for (const key of row) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `kb-key${key.className ? " " + key.className : ""}`;
      btn.tabIndex = -1;

      if (key.title) {
        btn.title = key.title;
        btn.setAttribute("aria-label", key.title);
      }

      if (key.action) {
        btn.textContent = key.label;
      } else {
        const hintSpan = document.createElement("span");
        hintSpan.className = "latin-hint";
        hintSpan.textContent = key.hint;

        const charSpan = document.createElement("span");
        charSpan.className = "urdu-char";
        charSpan.textContent = key.normal;

        btn.append(hintSpan, charSpan);
        if (key.code) {
          keyElementsByCode.set(key.code, btn);
        }
      }

      // Pointer events handle both mouse and touch cleanly without stealing textarea focus
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const isTouch = e.pointerType === "touch";
        btn.classList.add("is-pressed");

        if (key.action === "shift") {
          shiftLocked = !shiftLocked;
          updateKeyboardLabels();
          return;
        }

        if (key.action === "backspace") {
          deleteAtCursor(isTouch);
          stopRepeat();
          repeatDelayTimer = setTimeout(() => {
            repeatIntervalTimer = setInterval(() => deleteAtCursor(isTouch), 65);
          }, 380);
          return;
        }

        if (key.action === "enter") {
          insertTextAtCursor("\n", isTouch);
          return;
        }

        if (key.action === "space") {
          insertTextAtCursor(" ", isTouch);
          return;
        }

        const charToInsert = isShiftActive() ? key.shift : key.normal;
        insertTextAtCursor(charToInsert, isTouch);
      });

      const release = () => {
        btn.classList.remove("is-pressed");
        if (key.action === "backspace") {
          stopRepeat();
        }
      };

      btn.addEventListener("pointerup", release);
      btn.addEventListener("pointerleave", release);
      btn.addEventListener("pointercancel", release);

      keyButtons.push({ btn, key });
      rowEl.appendChild(btn);
    }

    urduKeyboard.appendChild(rowEl);
  }

  updateKeyboardLabels();
}

// Physical keyboard phonetic typing + visual feedback
textInput.addEventListener("keydown", (e) => {
  if (e.key === "Shift") {
    physicalShiftHeld = true;
    updateKeyboardLabels();
    return;
  }

  if (!phoneticEnabled) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.isComposing) return;

  // Map printable ASCII keys to Urdu phonetic characters
  if (e.key.length === 1 && Object.prototype.hasOwnProperty.call(PHONETIC_MAP, e.key)) {
    e.preventDefault();
    insertTextAtCursor(PHONETIC_MAP[e.key], false);
    flashKey(keyElementsByCode.get(e.code));
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    physicalShiftHeld = false;
    updateKeyboardLabels();
  }
});

window.addEventListener("blur", () => {
  physicalShiftHeld = false;
  stopRepeat();
  updateKeyboardLabels();
});

textInput.addEventListener("input", () => {
  saveSelection();
  syncPreview();
});
textInput.addEventListener("click", saveSelection);
textInput.addEventListener("keyup", saveSelection);
textInput.addEventListener("select", saveSelection);

fontSelect.addEventListener("change", () => {
  const chosen = fontSelect.value;
  applyFontStyle(chosen);
  try {
    localStorage.setItem(FONT_STORAGE_KEY, chosen);
  } catch {
    // Ignore storage errors in restricted contexts
  }
});

phoneticToggle.addEventListener("click", () => {
  phoneticEnabled = !phoneticEnabled;
  phoneticToggle.textContent = `Urdu Typing: ${phoneticEnabled ? "ON" : "OFF"}`;
  phoneticToggle.classList.toggle("active", phoneticEnabled);
  phoneticToggle.setAttribute("aria-pressed", String(phoneticEnabled));
});

keyboardToggle.addEventListener("click", () => {
  keyboardVisible = !keyboardVisible;
  keyboardToggle.textContent = `Keyboard: ${keyboardVisible ? "ON" : "OFF"}`;
  keyboardToggle.classList.toggle("active", keyboardVisible);
  keyboardToggle.setAttribute("aria-pressed", String(keyboardVisible));
  keyboardContainer.classList.toggle("hidden", !keyboardVisible);
});

copyBtn.addEventListener("click", async () => {
  const text = textInput.value;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    textInput.select();
    document.execCommand("copy");
  }
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy text"), 1200);
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  lastSelection = { start: 0, end: 0 };
  syncPreview();
  textInput.focus();
});

try {
  const savedFont = localStorage.getItem(FONT_STORAGE_KEY);
  if (savedFont && FONT_STYLES[savedFont]) {
    applyFontStyle(savedFont);
  }
} catch {
  // Ignore storage errors
}

renderKeyboard();
syncPreview();
