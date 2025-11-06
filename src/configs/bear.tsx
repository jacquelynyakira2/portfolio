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
    title: "Work",
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
        id: "trailhead-learning-agent",
        title: "Trailhead Learning Agent",
        file: "markdown/trailhead-learning-agent.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "An AI-powered learning companion that provides personalized guidance and real-time support...",
        link: "https://trailhead.salesforce.com"
      },
      {
        id: "salesforce-help-agent",
        title: "Salesforce Help Agent",
        file: "markdown/salesforce-help-agent.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "AI agent with 83% autonomous resolution rate, handling 1M+ support requests and saving $50M...",
        link: "https://help.salesforce.com/s/"
      },
      {
        id: "agentblazer-status",
        title: "Agentblazer Status",
        file: "markdown/agentblazer-status.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "Recognition program for AI builders, aiming for 1 million Agentblazers by 2025...",
        link: "https://trailhead.salesforce.com/agentblazer"
      },
      {
        id: "trailhead-skill-taxonomy",
        title: "Skill Taxonomy",
        file: "markdown/trailhead-skill-taxonomy.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "Three-dimensional taxonomy system helping millions discover relevant learning content...",
        link: "https://trailhead.salesforce.com"
      },
      {
        id: "trailhead-merging-communities",
        title: "Merging Communities",
        file: "markdown/trailhead-merging-communities.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "Unified Slack, MuleSoft, and Tableau communities using a scalable Neighborhood framework...",
        link: "https://trailhead.salesforce.com/trailblazer-community"
      },
      {
        id: "trailhead-for-slack",
        title: "Trailhead for Slack",
        file: "markdown/trailhead-for-slack.md",
        icon: "i-simple-icons:salesforce",
        excerpt:
          "First Salesforce app on Slack - bringing learning into the flow of work...",
        link: "https://trailhead.salesforce.com/en/slack"
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
    title: "Passion",
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
