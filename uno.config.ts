import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  rules: [
    ["aspect-ratio-2-1", { "aspect-ratio": 2 / 1 }],
    [
      "font-exo2",
      {
        "font-family": '"Exo 2", sans-serif',
        "font-optical-sizing": "auto",
        "font-weight": "400",
        "font-style": "normal",
      },
    ],
  ],
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
      "main-blue": "#627BC1",
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
