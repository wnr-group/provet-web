import clsx from "clsx";
import { SOCIAL_ICONS } from "./SocialIcons";
import { platformLabel } from "@/lib/socialSchema";

// One presentational component for both the footer and the Contact page, fed
// by the same admin config (lib/data.js -> getActiveSocialLinks). It renders
// nothing at all when no platform is enabled, so neither surface leaves an
// empty row of icons behind.
//
// `variant` only switches the colour treatment - the footer sits on the dark
// navy band, the Contact page on the light card background.
const VARIANTS = {
  dark: "bg-white/5 text-brand-100 hover:bg-accent-400 hover:text-brand-900",
  light: "bg-accent-100 text-accent-700 hover:bg-accent-500 hover:text-white",
};

export default function SocialLinks({ links = [], variant = "dark", className, iconSize = 15 }) {
  const renderable = links.filter((link) => link?.url && SOCIAL_ICONS[link.platform]);
  if (renderable.length === 0) return null;

  return (
    <div className={clsx("flex flex-wrap gap-3", className)}>
      {renderable.map((link) => {
        const Icon = SOCIAL_ICONS[link.platform];
        const label = platformLabel(link.platform);
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            // noopener/noreferrer: these URLs are admin-controlled but still
            // external, and target="_blank" would otherwise hand the opened
            // page a reference back to window.opener.
            rel="noopener noreferrer"
            title={label}
            aria-label={`${label} (opens in a new tab)`}
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full transition",
              VARIANTS[variant] || VARIANTS.dark
            )}
          >
            <Icon width={iconSize} height={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
