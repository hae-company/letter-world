export type Locale = "ko" | "en" | "ja";

export const LOCALES: { id: Locale; label: string; flag: string }[] = [
  { id: "ko", label: "한국어", flag: "🇰🇷" },
  { id: "en", label: "English", flag: "🇺🇸" },
  { id: "ja", label: "日本語", flag: "🇯🇵" },
];

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    title: "Letter to the World",
    letterCount: "통의 편지가 세계에",
    randomLetter: "랜덤 편지 열기",
    writeLetter: "편지 쓰기",
    loading: "지도를 불러오는 중...",
    toPlaceholder: "세상 누군가에게",
    bodyPlaceholder: "편지를 써보세요...",
    fromPlaceholder: "익명의 누군가",
    cancel: "취소",
    send: "편지 보내기",
    sending: "보내는 중...",
    arrived: "에 도착했습니다",
    yourLetter: "당신의 편지가",
    cheerPrompt: "이 편지에 응원을 보내세요",
    cheerSent: "응원을 보냈습니다!",
    tapToClose: "탭하여 닫기",
    to: "To.",
    from: "From.",
  },
  en: {
    title: "Letter to the World",
    letterCount: "letters around the world",
    randomLetter: "Random Letter",
    writeLetter: "Write a Letter",
    loading: "Loading map...",
    toPlaceholder: "To someone in the world",
    bodyPlaceholder: "Write your letter...",
    fromPlaceholder: "Anonymous",
    cancel: "Cancel",
    send: "Send Letter",
    sending: "Sending...",
    arrived: "has arrived at",
    yourLetter: "Your letter",
    cheerPrompt: "Send a cheer for this letter",
    cheerSent: "Cheer sent!",
    tapToClose: "Tap to close",
    to: "To.",
    from: "From.",
  },
  ja: {
    title: "Letter to the World",
    letterCount: "通の手紙が世界に",
    randomLetter: "ランダムな手紙",
    writeLetter: "手紙を書く",
    loading: "地図を読み込み中...",
    toPlaceholder: "世界の誰かへ",
    bodyPlaceholder: "手紙を書いてみてください...",
    fromPlaceholder: "匿名の誰か",
    cancel: "キャンセル",
    send: "手紙を送る",
    sending: "送信中...",
    arrived: "に届きました",
    yourLetter: "あなたの手紙が",
    cheerPrompt: "この手紙に応援を送りましょう",
    cheerSent: "応援を送りました！",
    tapToClose: "タップして閉じる",
    to: "To.",
    from: "From.",
  },
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.ko[key] || key;
}
