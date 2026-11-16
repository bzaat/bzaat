import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import type { Theme } from "../../theme";

/**
 * Hero centerpiece: a seamless 6-second loop per theme, rendered with Remotion
 * (see /remotion). The active theme's video crossfades in over the outgoing one
 * (both stay painted during the fade, so there is no flash); the outgoing video is
 * paused as soon as it starts leaving. Off-screen or hidden tabs pause playback.
 * Reduced motion, or spell effects turned off: the static poster frame only.
 */
const src = (theme: Theme, ext: string) => `${import.meta.env.BASE_URL}videos/hero-${theme}${ext}`;

function LoopVideo({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLVideoElement>(null);
  const present = useIsPresent();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!present) {
      v.pause();
      return;
    }
    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    // A decode error doesn't make the browser try the next <source>, so fall back to
    // the MP4 ourselves instead of freezing on the first frame.
    const onError = () => {
      if (!v.currentSrc.endsWith(".mp4")) {
        v.src = src(theme, ".mp4");
        v.load();
        sync();
      }
    };
    v.addEventListener("error", onError);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.removeEventListener("error", onError);
    };
  }, [present, theme]);

  return (
    <video
      ref={ref}
      className="size-full object-cover object-[74%_50%]"
      poster={src(theme, "-poster.webp")}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      tabIndex={-1}
    >
      <source src={src(theme, ".webm")} type="video/webm" />
      <source src={src(theme, ".mp4")} type="video/mp4" />
    </video>
  );
}

export function HeroVideo({ theme, still = false, className = "" }: { theme: Theme; still?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const staticOnly = !!reduce || still;

  return (
    <div aria-hidden="true" className={`hero-video pointer-events-none absolute -z-10 overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={theme}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: staticOnly ? 0 : 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {staticOnly ? (
            <img src={src(theme, "-poster.webp")} alt="" className="size-full object-cover object-[74%_50%]" />
          ) : (
            <LoopVideo theme={theme} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
