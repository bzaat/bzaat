# Hero loops (Remotion)

Three seamless 6-second loops (180 frames, 30 fps, 1280x720) for the portfolio hero, one per theme. Kept separate from `site/` so Remotion never ends up in the site's dependencies.

| Composition | Theme | Background |
|---|---|---|
| `AurorLightLoop` | Auror Office | `#F6EEDB` |
| `DarkArtsLoop` | Dark Arts | `#090A0F` |
| `FantasticBeastsLoop` | Newt's Case | `#2A1A16` |

Every motion is a periodic function of `frame / 180` (see `src/loop.ts`), so frame 180 renders like frame 0. The centerpiece sits 74% across to match the site's hero layout.

## Preview

```bash
npm install
npx remotion studio
```

## Render into the site

```bash
O=../site/public/videos
for pair in "AurorLightLoop auror" "DarkArtsLoop darkarts" "FantasticBeastsLoop beasts"; do
  set -- $pair
  npx remotion render $1 $O/hero-$2.webm --codec=vp9 --crf=33 --license-key=free-license
  npx remotion render $1 $O/hero-$2.mp4  --codec=h264 --crf=25 --license-key=free-license
  npx remotion still  $1 out/posters/hero-$2-poster.png --frame=0 --image-format=png --license-key=free-license
done
# then convert out/posters/*.png to $O/hero-*-poster.webp (quality ~86)
```

Then run `npm run build` in `site/` and commit `docs/`.
