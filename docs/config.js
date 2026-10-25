const CONFIG = {
  hero: {
    name: "Giulio Purgatorio",
    title: "AWS Tech Lead & Cloud Solution Architect",
    tagline: "Turning architectural challenges into elegant, cloud-native solutions, with a relentless focus on IaC, security, automation and operational efficiency.",
    avatar: "./me.jpg",
    status: {
      text: "AWS Swiss Army Knife",
      active: true
    }
  },

  // Bento Grid Cards
  cards: [
    {
      id: "card-cv",
      title: "Curriculum Vitae",
      description: "Explore my professional career.\nYou can either play it interactively or download the classic PDF!",
      icon: "file-code-2",
      badge: "Interactive & PDF",
      accent: "emerald",
      size: "medium",
      action: {
        type: "modal",
        modalId: "modal-cv"
      }
    },
    {
      id: "card-social",
      title: "Social & Network",
      description: "Connect with me or explore public (a.k.a. older) projects on GitHub.",
      icon: "share-2",
      badge: "Profiles & Git",
      accent: "violet",
      size: "medium",
      action: {
        type: "modal",
        modalId: "modal-social"
      }
    }
  ],

  // Modals Configuration
  modals: {
    "modal-cv": {
      title: "Curriculum Vitae",
      subtitle: "Choose how you'd like to explore my profile!",
      type: "cv-selector",
      options: [
        {
          id: "cv-game",
          title: "Interactive Pixel-Art CV",
          description: "Explore my 2D retro pixel-art RPG world showcasing my cloud projects!",
          badge: "Recommended",
          icon: "gamepad-2",
          url: "https://cv.gpurg.com",
          target: "_blank",
          cta: "Play Now"
        },
        {
          id: "cv-pdf",
          title: "Standard PDF Resume",
          description: "Classic downloadable resume format for quick offline review.",
          badge: "Standard",
          icon: "download",
          url: "./cv.pdf",
          download: "Giulio_Purgatorio_AWS_Tech_Lead_CV.pdf",
          target: "_blank",
          cta: "Download"
        }
      ]
    },

    "modal-social": {
      title: "Social & Network",
      subtitle: "Official profiles",
      type: "social-list",
      profiles: [
        {
          platform: "LinkedIn",
          handle: "giulio-purgatorio",
          url: "https://www.linkedin.com/in/giulio-purgatorio-701a77206",
          icon: "linkedin",
          stat: "AWS Tech Lead",
          badge: "Official Profile"
        },
        {
          platform: "GitHub",
          handle: "@GPurgatorio",
          url: "https://github.com/GPurgatorio",
          icon: "github",
          stat: "Code Repositories",
          badge: "Open Source"
        },
        {
          platform: "Direct email",
          handle: "contact@gpurg.com",
          url: "mailto:contact@gpurg.com",
          icon: "mail",
          stat: "Personal email",
          badge: "Direct Contact"
        }
      ]
    },

    "modal-privacy": {
      title: "Privacy & Legal Notice",
      subtitle: "Technical data, hosting transparency and legal notices",
      type: "privacy-notice",
      sections: [
        {
          title: "1. Privacy & Edge Logs (GDPR Art. 13 & 6(1)(f))",
          icon: "server",
          content: "This is a static, client-side personal hub with zero application-level personal data collection or profiling. Standard HTTP request data (IP address, browser user-agent, and timestamp) is processed transiently by the edge hosting and CDN infrastructure (GitHub Pages / Fastly CDN) strictly for network security, DDoS mitigation, and reliable delivery under legitimate interest (GDPR Art. 6(1)(f)). For data inquiries, contact:",
          contactEmail: "info@gpurg.com"
        },
        {
          title: "2. Zero Cookies & Zero Storage (ePrivacy Art. 5(3))",
          icon: "eye-off",
          content: "This website sets zero first-party or third-party HTTP cookies and uses zero client-side storage mechanisms (no localStorage, sessionStorage, IndexedDB, or fingerprinting). All UI state remains strictly in volatile browser memory, exempting this site from cookie consent banners under Art. 5(3) of Directive 2002/58/EC."
        },
        {
          title: "3. Zero Third-Party Requests (Strict CSP)",
          icon: "lock",
          content: "All scripts, stylesheets, native system fonts, and vector assets are self-hosted and restricted via a strict Content-Security-Policy (default-src 'none') and no-referrer policy. Your browser never initiates outbound requests to external CDNs, font providers, or third-party trackers."
        },
        {
          title: "4. Non-Affiliation, Fair Use & Open-Source Credits",
          icon: "shield-check",
          content: "This website is an independent personal initiative and is not affiliated with, endorsed by, or sponsored by any past or present employer, client, academic institution, or technology vendor. All referenced trademarks (including AWS, Amazon Web Services, LinkedIn, and GitHub) belong to their respective owners and are used strictly under Nominative Fair Use. Self-hosted UI icons are used under permissive open-source licenses from Lucide / Feather Icons (ISC / MIT)."
        },
        {
          title: "5. No Warranty & Limitation of Liability (\"AS IS\")",
          icon: "file-code-2",
          content: "All content, links, and portfolio materials on this domain are provided strictly \"AS IS\" for informational and portfolio purposes without warranty of any kind, express or implied. Nothing on this site constitutes professional engineering, legal, or security consultancy, and the author assumes zero liability for any reliance placed on this material."
        }
      ]
    }
  }
};

// Freeze configuration to prevent runtime mutations
Object.freeze(CONFIG);

if (typeof module !== 'undefined') {
  module.exports = CONFIG;
}
