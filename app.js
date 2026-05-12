/* global PROFILE */

function $(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function render() {
  const p = window.PROFILE;
  if (!p) throw new Error("Missing window.PROFILE (data/profile.js)");

  document.title = `${p.name} | ${p.headline}`;

  $("name").textContent = p.name;
  $("headline").textContent = p.headline;
  $("location").textContent = p.location;
  $("openTo").textContent = p.openTo || "Open to work";
  $("aboutText").textContent = p.about || "";

  const avatar = $("avatar");
  avatar.textContent = initials(p.name);
  avatar.setAttribute("aria-label", `${p.name} 头像`);

  const emailLink = $("emailLink");
  emailLink.textContent = p.email ? p.email : "可联系";

  const resumeCta = $("resumeCta");
  resumeCta.href = p.resumeUrl || "#";
  resumeCta.setAttribute("aria-disabled", p.resumeUrl ? "false" : "true");
  if (!p.resumeUrl) resumeCta.style.opacity = "0.55";

  // Stats
  const expYears = estimateYears(p.experiences || []);
  $("expYears").textContent = expYears ? `${expYears}+ 年` : "—";
  $("projCount").textContent = `${(p.projects || []).length}`;
  $("skillCount").textContent = `${(p.skills || []).length}`;

  // Highlights
  $("highlightList").innerHTML = (p.highlights || [])
    .map((x) => `<li>${escapeHtml(x)}</li>`)
    .join("");

  // Quick links
  $("quickLinks").innerHTML = (p.quickLinks || [])
    .map((x) => {
      const label = escapeHtml(x.label);
      const hint = escapeHtml(x.hint || "");
      const icon = escapeHtml(x.icon || "↗");
      const url = x.url || "#";
      return `
        <a class="quick__item" href="${url}" target="_blank" rel="noreferrer">
          <div class="quick__left">
            <div class="quick__icon" aria-hidden="true">${icon}</div>
            <div class="quick__text">
              <div class="quick__label">${label}</div>
              <div class="quick__hint">${hint}</div>
            </div>
          </div>
          <span class="small" aria-hidden="true">↗</span>
        </a>
      `;
    })
    .join("");

  // Experience
  const exp = p.experiences || [];
  $("expHint").textContent = exp.length ? `${exp.length} 段` : "—";
  $("experienceList").innerHTML = exp.map(renderTimelineItem).join("");

  // Projects
  $("projectList").innerHTML = (p.projects || []).map(renderProjectCard).join("");

  // Skills
  const skills = p.skills || [];
  $("skillChips").innerHTML = skills
    .map((s) => `<span class="chip" data-skill="${escapeHtml(s.toLowerCase())}">${escapeHtml(s)}</span>`)
    .join("");

  // Education
  $("educationList").innerHTML = (p.education || []).map(renderTimelineItem).join("");

  // Contact
  $("contactList").innerHTML = (p.contact || [])
    .map((x) => {
      const label = escapeHtml(x.label);
      const value = escapeHtml(x.value || "");
      const icon = escapeHtml(x.icon || "↗");
      const url = x.url || "#";
      return `
        <a class="contact__item" href="${url}" target="_blank" rel="noreferrer">
          <div class="contact__left">
            <div class="contact__icon" aria-hidden="true">${icon}</div>
            <div>
              <div class="contact__label">${label}</div>
              <div class="contact__value">${value}</div>
            </div>
          </div>
          <span class="small" aria-hidden="true">↗</span>
        </a>
      `;
    })
    .join("");

  $("footerText").textContent = `© ${new Date().getFullYear()} ${p.name} · Built with a LinkedIn-style template`;
}

function renderTimelineItem(x) {
  const role = escapeHtml(x.role || "Role");
  const org = escapeHtml(x.org || "Org");
  const loc = escapeHtml(x.location || "");
  const period = escapeHtml(x.period || "");

  const logo = initials(org).slice(0, 2);
  const bullets = Array.isArray(x.bullets) ? x.bullets : [];
  const tags = Array.isArray(x.tags) ? x.tags : [];

  return `
    <article class="titem">
      <div class="tlogo" aria-hidden="true">${escapeHtml(logo)}</div>
      <div class="tmain">
        <div class="ttitle">
          <div class="ttitle__role">${role}</div>
          <div class="ttitle__org">${org}</div>
        </div>
        <div class="tmeta">${period}${period && loc ? " · " : ""}${loc}</div>
        ${
          bullets.length
            ? `<div class="tdesc"><ul class="bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul></div>`
            : ""
        }
        ${
          tags.length
            ? `<div class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderProjectCard(x) {
  const name = escapeHtml(x.name || "Project");
  const desc = escapeHtml(x.desc || "");
  const tags = Array.isArray(x.tags) ? x.tags : [];
  const links = Array.isArray(x.links) ? x.links : [];

  return `
    <article class="pcard">
      <div class="pcard__top">
        <div>
          <div class="pcard__name">${name}</div>
          <p class="pcard__desc">${desc}</p>
        </div>
      </div>
      ${
        tags.length
          ? `<div class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`
          : ""
      }
      ${
        links.length
          ? `<div class="pcard__links">${links
              .map((l) => `<a class="btn btn--ghost" href="${l.url}" target="_blank" rel="noreferrer">${escapeHtml(l.label)}</a>`)
              .join("")}</div>`
          : ""
      }
    </article>
  `;
}

function estimateYears(exps) {
  // Best-effort. If user doesn't provide a number, infer from earliest year in period strings.
  const years = [];
  for (const e of exps) {
    const m = String(e.period || "").match(/(19|20)\d{2}/g);
    if (m) for (const y of m) years.push(Number(y));
  }
  if (!years.length) return 0;
  const earliest = Math.min(...years);
  const now = new Date().getFullYear();
  return Math.max(1, now - earliest);
}

function wireSearch() {
  const input = document.getElementById("search");
  if (!input) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    filterSkills(q);
    filterTextSections(q);
  });
}

function filterSkills(q) {
  const chips = Array.from(document.querySelectorAll(".chip[data-skill]"));
  for (const chip of chips) {
    const k = chip.getAttribute("data-skill") || "";
    chip.hidden = q.length ? !k.includes(q) : false;
  }
}

function filterTextSections(q) {
  // Simple highlight by collapsing non-matching items in timeline and projects.
  const blocks = Array.from(document.querySelectorAll(".titem, .pcard"));
  if (!q) {
    for (const b of blocks) b.style.display = "";
    return;
  }
  for (const b of blocks) {
    const text = b.textContent ? b.textContent.toLowerCase() : "";
    b.style.display = text.includes(q) ? "" : "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  wireSearch();
});

