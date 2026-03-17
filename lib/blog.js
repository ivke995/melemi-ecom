export const slugify = (value) => {
  if (!value) return "";

  const replacements = {
    "\u010D": "c",
    "\u0107": "c",
    "\u0111": "dj",
    "\u0161": "s",
    "\u017E": "z",
    "\u010C": "c",
    "\u0106": "c",
    "\u0110": "dj",
    "\u0160": "s",
    "\u017D": "z",
  };

  let normalized = value.trim();

  Object.entries(replacements).forEach(([key, replacement]) => {
    normalized = normalized.split(key).join(replacement);
  });

  return normalized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const createExcerpt = (content, maxLength = 180) => {
  if (!content) return "";
  const normalized = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
  const stripped = normalized.replace(/[#>*_`~\[\]()]/g, "");
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength).trim()}...`;
};
