"use client";

import { useEffect, useState } from "react";
import { Save, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { adminGetSocialLinks, adminUpdateSocialLinks } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import { SOCIAL_ICONS } from "@/components/ui/SocialIcons";

// The platform list is fixed (see lib/socialSchema.js), so this is a single
// save-all form like Website Content rather than a create/delete CRUD screen -
// the admin fills in URLs and flips toggles, they never add or remove rows.
export default function SocialAdmin() {
  const [links, setLinks] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetSocialLinks()
      .then((res) => setLinks(res.links))
      .catch((err) => setError(err.message || "Could not load social links."));
  }, []);

  const updateLink = (platform, field, value) => {
    setLinks((current) =>
      current.map((link) => {
        if (link.platform !== platform) return link;
        const next = { ...link, [field]: value };
        // Clearing the URL of an enabled platform would fail validation on
        // save, so drop it back to disabled as the admin types instead of
        // letting them hit an error they didn't cause on purpose.
        if (field === "url" && !value.trim()) next.isActive = false;
        return next;
      })
    );
    setSaved(false);
    setError("");
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await adminUpdateSocialLinks(
        links.map(({ platform, url, isActive, order }) => ({ platform, url, isActive, order }))
      );
      setLinks(res.links);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Could not save social links.");
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = links?.filter((l) => l.isActive && l.url?.trim()).length ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Social Media</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Set the links shown in the website footer and on the Contact page. Only enabled platforms appear.
          </p>
        </div>
        <button onClick={onSave} disabled={saving || !links} className="btn-primary">
          <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!links ? (
        <div className="mt-5">
          <PageSpinner />
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-3">
            {links.map((link) => {
              const Icon = SOCIAL_ICONS[link.platform];
              const hasUrl = Boolean(link.url?.trim());
              return (
                <div key={link.platform} className="card p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-3 sm:w-44 sm:shrink-0">
                      <span
                        className={clsx(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition",
                          link.isActive && hasUrl ? "bg-accent-500 text-white" : "bg-mist-100 text-ink-soft"
                        )}
                      >
                        {Icon && <Icon width={16} height={16} />}
                      </span>
                      <span className="truncate font-semibold text-ink">{link.label}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <label className="sr-only" htmlFor={`url-${link.platform}`}>
                        {link.label} URL
                      </label>
                      <input
                        id={`url-${link.platform}`}
                        type="url"
                        inputMode="url"
                        className="input"
                        placeholder={link.placeholder}
                        value={link.url || ""}
                        onChange={(e) => updateLink(link.platform, "url", e.target.value)}
                      />
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {hasUrl && (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${link.label} in a new tab`}
                          className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <label
                        className={clsx(
                          "flex items-center gap-2 text-sm",
                          hasUrl ? "text-ink" : "cursor-not-allowed text-ink-soft/60"
                        )}
                        title={hasUrl ? undefined : "Add a URL first"}
                      >
                        <input
                          type="checkbox"
                          disabled={!hasUrl}
                          checked={Boolean(link.isActive)}
                          onChange={(e) => updateLink(link.platform, "isActive", e.target.checked)}
                        />
                        Enabled
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-ink-soft">
            {enabledCount === 0
              ? "No platforms enabled — the social icons are hidden on the public site."
              : `${enabledCount} platform${enabledCount === 1 ? "" : "s"} shown on the footer and Contact page.`}
          </p>
        </>
      )}
    </div>
  );
}
