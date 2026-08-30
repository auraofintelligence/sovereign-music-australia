/* Sovereign Music Australia · shared navigation and footer.
   Data-driven: pages include <div id="site-header"></div> and <div id="site-footer"></div>
   plus this script (defer). Edit the nav here once, every page follows. */

(function () {
  const NAV = {
    home: { href: "index.html", label: "Sovereign Music" },
    paths: [
      { href: "artist.html", label: "make" },
      { href: "listener.html", label: "listen" },
      { href: "venue.html", label: "stage" },
      { href: "allies.html", label: "build" },
    ],
    layers: [
      { href: "ecosystem.html", label: "ecosystem" },
      { href: "hallmark.html", label: "mark" },
      { href: "charts.html", label: "charts" },
      { href: "awards.html", label: "awards" },
      { href: "rights.html", label: "rights" },
      { href: "bargain.html", label: "bargain" },
      { href: "terms.html", label: "terms" },
      { href: "money.html", label: "money" },
      { href: "pool.html", label: "pool" },
    ],
  };

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function link(item) {
    const current = item.href.toLowerCase() === here ? ' aria-current="page"' : "";
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  }

  const headerHost = document.getElementById("site-header");
  if (headerHost) {
    headerHost.outerHTML = `
      <header class="site-head">
        <div class="bar">
          <a class="crest" href="${NAV.home.href}"><span class="sigil" aria-hidden="true"></span>${NAV.home.label}</a>
          <nav aria-label="Site">
            ${NAV.paths.map(link).join("\n            ")}
            <span class="divider" aria-hidden="true">&middot;</span>
            ${NAV.layers.map(link).join("\n            ")}
          </nav>
        </div>
      </header>`;
  }

  const footerHost = document.getElementById("site-footer");
  if (footerHost) {
    footerHost.outerHTML = `
      <footer class="site-foot">
        <div class="wrap foot-grid">
          <span>Sovereign Music Australia &middot; built on Quandamooka Country</span>
          <span>Luke Nathan Hayes &times; Claude &middot; 2026 &middot; <a href="https://github.com/auraofintelligence/sovereign-music-australia">source</a> &middot; <a href="LICENCE.md">licence</a></span>
        </div>
      </footer>`;
  }
})();
