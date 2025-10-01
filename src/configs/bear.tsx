import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-fa-solid:paw",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-la:dragon",
        excerpt: "I believe that AI is meant to elevate you, not replace you."
      },
      {
        id: "educational-talks-workshops",
        title: "Talks, & Workshops",
        file: "markdown/educational-talks-workshops.md",
        icon: "i-material-symbols:school",
        excerpt: "Educational content, workshops, and learning resources..."
      },
      {
        id: "awards-and-recognition",
        title: "Awards and Publications",
        file: "markdown/awards-and-recognition.md",
        icon: "i-material-symbols:workspace-premium",
        excerpt: "Honors, awards, and special acknowledgments throughout my career..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-octicon:browser",
        excerpt: "Why I chose this design"
      }
    ]
  },
  {
    id: "project",
    title: "Work Projects",
    icon: "i-octicon:repo",
    md: [
      {
        id: "salesforce-trailhead",
        title: "Salesforce Trailhead",
        file: "markdown/salesforce-trailhead.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "Creating innovative learning experiences for millions of Trailblazers worldwide...",
        link: "https://trailhead.salesforce.com"
      },
      {
        id: "api-ification-project",
        title: "The API-ification of Everything",
        file: "markdown/project-example.md",
        icon: "i-material-symbols:api",
        excerpt:
          "How Intent-Based Computing Kills the App - exploring the future of digital interaction...",
        link: "https://example.com"
      },
      {
        id: "tiny-ui-project",
        title: "Tiny UI: Reaction Bubbles",
        file: "markdown/tiny-ui-project.md",
        icon: "i-material-symbols:bubble-chart",
        excerpt:
          "A design study exploring how micro-interactions create meaningful visual relationships...",
        link: "https://example.com"
      }
    ]
  },
  {
    id: "passion-projects",
    title: "Passion Projects",
    icon: "i-carbon:favorite-filled",
    md: [
      {
        id: "colorgen-project",
        title: "ColorGen - Figma Plugin",
        file: "markdown/colorgen-project.md",
        icon: "i-material-symbols:palette",
        excerpt:
          "A Figma plugin that generates harmonious color palettes to streamline design workflows...",
        link: "https://github.com/jacquelynyakira2/ColorGen"
      },
      {
        id: "passion-placeholder",
        title: "Coming Soon",
        file: "markdown/passions-coming-soon.md",
        icon: "i-ph:lightbulb-filament-duotone",
        excerpt: "Personal explorations that bring me joy."
      }
    ]
  }
];

export default bear;
