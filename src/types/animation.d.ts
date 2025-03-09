// Tailwind CSSのアニメーション関連の型定義を拡張
interface TailwindAnimations {
  'animate-fadeIn': string;
  'animate-claudeSpin': string;
  'animate-claudeFadeIn': string;
}

// tailwind.config.jsでアニメーションを定義する場合は
// これらの型を参照できるようにしておく
declare module 'tailwindcss/tailwind-config' {
  interface TailwindConfig {
    theme: {
      extend: {
        animation: Partial<TailwindAnimations>;
      }
    }
  }
}
