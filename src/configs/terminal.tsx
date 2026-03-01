import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-bio",
        title: "bio.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Hi, I'm Jacquelyn. Principal Product Design Director at Salesforce. Creative
              technologist and product designer based in Indianapolis, specializing in
              AI-driven experiences, product design, and creative technology.
            </div>
            <div className="pt-2">
              I believe AI is meant to elevate you, not replace you.
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content:
          "AI-driven experiences / Product design / Creative technology / Generative art / Accessible learning tools / Experimental storytelling"
      },
      {
        id: "about-who-cares",
        title: "who-cares.txt",
        type: "file",
        content:
          "Dean's Board at Herron School of Art. Design mentor at Salesforce. I run a 6-month cohort for senior college students on capstone projects. Open to speaking, workshops, and collaboration."
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="mailto:jacquelyn.halpern@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                jacquelyn.halpern@gmail.com
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/jacquelynhalpern/"
                target="_blank"
                rel="noreferrer"
              >
                /jacquelynhalpern
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/jacquelynyakira2/"
                target="_blank"
                rel="noreferrer"
              >
                @jacquelynyakira2
              </a>
            </li>
            <li>
              Passion Project:{" "}
              <a
                className="text-blue-300"
                href="https://www.lilchef.app"
                target="_blank"
                rel="noreferrer"
              >
                lilchef.app
              </a>
            </li>
            <li>
              Dribbble:{" "}
              <a
                className="text-blue-300"
                href="https://dribbble.com/Jacquelynyakira"
                target="_blank"
                rel="noreferrer"
              >
                @Jacquelynyakira
              </a>
            </li>
            <li>
              Medium:{" "}
              <a
                className="text-blue-300"
                href="https://medium.com/@jacquelynyakira"
                target="_blank"
                rel="noreferrer"
              >
                @jacquelynyakira
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "projects",
    title: "projects",
    type: "folder",
    children: [
      {
        id: "projects-agentblazer",
        title: "agentblazer.txt",
        type: "file",
        content:
          "Agentblazer Status @ Salesforce Trailhead. Launched three new status tiers (Explorer, Builder, Pioneer) recognizing the AI builder community. Principal Product Design Director, 2024-2025."
      },
      {
        id: "projects-colorgen",
        title: "colorgen.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Colorgen – Figma plugin for color palettes, gradients, and HSL color game.
            </div>
            <div className="pt-2">
              GitHub:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/jacquelynyakira2/ColorGen"
                target="_blank"
                rel="noreferrer"
              >
                jacquelynyakira2/ColorGen
              </a>
            </div>
          </div>
        )
      },
      {
        id: "projects-lilchef",
        title: "lilchef.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>Lil Chef – Passion project. A creative cooking companion.</div>
            <div className="pt-2">
              <a
                className="text-blue-300"
                href="https://www.lilchef.app"
                target="_blank"
                rel="noreferrer"
              >
                www.lilchef.app
              </a>
            </div>
          </div>
        )
      },
      {
        id: "projects-trailhead",
        title: "trailhead.txt",
        type: "file",
        content:
          "Salesforce Trailhead – AI learning experiences, skill taxonomy, Slack integration, learning agents. Designing accessible AI education at scale."
      }
    ]
  },
  {
    id: "skills",
    title: "skills",
    type: "folder",
    children: [
      {
        id: "skills-design",
        title: "design.txt",
        type: "file",
        content:
          "Product design / UX design / AI/ML product design / Design systems / Generative art / Accessible design"
      },
      {
        id: "skills-tech",
        title: "tech.txt",
        type: "file",
        content:
          "Figma / Prototyping / Design tools / Creative coding / Figma plugins / AI-assisted design workflows"
      },
      {
        id: "skills-brands",
        title: "experience.txt",
        type: "file",
        content: "Salesforce / Netflix / Apple / Meta / Accenture"
      }
    ]
  },
  {
    id: "writing",
    title: "writing",
    type: "folder",
    children: [
      {
        id: "writing-medium",
        title: "medium.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>Articles and essays on design, AI, and creativity.</div>
            <div className="pt-2">
              <a
                className="text-blue-300"
                href="https://medium.com/@jacquelynyakira"
                target="_blank"
                rel="noreferrer"
              >
                medium.com/@jacquelynyakira
              </a>
            </div>
          </div>
        )
      },
      {
        id: "writing-talks",
        title: "talks.txt",
        type: "file",
        content:
          "Educational talks & workshops. Topics: AI & Creativity, Designing with Cursor, How AI is Changing the Way We Work. Butler University, Indiana University HCI, and more."
      }
    ]
  },
  {
    id: "about-dream",
    title: "designer-dream.css",
    type: "file",
    content: (
      <div className="py-1">
        <div>
          <span className="text-gray-400">{"/* designer's dream */"}</span>
        </div>
        <div>
          <span className="text-purple-400">.design</span>
          <span> {"{"}</span>
        </div>
        <div>
          <span className="text-blue-400 ml-4">iteration</span>
          <span>: </span>
          <span className="text-green-400">infinite</span>
          <span>;</span>
        </div>
        <div>
          <span className="text-blue-400 ml-4">padding</span>
          <span>: </span>
          <span className="text-amber-300">"still adjusting"</span>
          <span>;</span>
        </div>
        <div>
          <span>{"}"}</span>
        </div>
      </div>
    )
  }
];

export default terminal;
