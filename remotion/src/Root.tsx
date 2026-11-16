import { Composition } from "remotion";
import { AurorLightLoop } from "./AurorLightLoop";
import { DarkArtsLoop } from "./DarkArtsLoop";
import { FantasticBeastsLoop } from "./FantasticBeastsLoop";

// Seamless 6-second hero loops (180 frames at 30 fps), one per portfolio theme.
// 1280x720; the site places them full-bleed behind the hero, centred at 74% across.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="AurorLightLoop" component={AurorLightLoop} durationInFrames={180} fps={30} width={1280} height={720} />
      <Composition id="DarkArtsLoop" component={DarkArtsLoop} durationInFrames={180} fps={30} width={1280} height={720} />
      <Composition id="FantasticBeastsLoop" component={FantasticBeastsLoop} durationInFrames={180} fps={30} width={1280} height={720} />
    </>
  );
};
