/* ============================================================
   ✏️  EDIT THIS FILE TO UPDATE YOUR WEBSITE — NO CODING NEEDED
   ============================================================

   Everything on the site (name, jobs, projects, skills...) comes
   from this one file. Change the text between the quotes, save,
   and refresh the page. That's it.

   Rules of thumb:
   1. Keep the quotes: "like this"
   2. Keep the commas at the end of lines
   3. To add a new job/project, copy an existing block from { to },
      paste it, and edit the text.
   4. If the site goes blank after an edit, you probably deleted a
      quote, comma, or bracket. Undo your last change.

   Tip: edit this file directly on github.com (click the pencil
   icon) and it will redeploy automatically if you host with
   GitHub Pages.
   ============================================================ */

window.SITE = {

  /* ---------- BASICS ---------- */
  name: "Swagat Adhikary",
  firstName: "Swagat",

  // These rotate in the typing animation on the landing screen.
  roles: [
    "Software Engineer",
    "Full-Stack Developer",
    "Mobile Engineer",
    "AR/VR Researcher",
    "Founder @ PickUp",
  ],

  tagline: "I build software that people actually use — from accessibility features at Fidelity to holographic video research at UNC.",

  location: "Raleigh–Durham, NC",
  email: "official.adhikary@gmail.com",
  phone: "(919) 480-5204",

  links: [
    { label: "GitHub",   url: "https://github.com/Swagat321" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/swag-adhikary/" },
  ],

  /* ---------- ABOUT ME ---------- */
  about: {
    photo: "SwagatPic.JPG",   // put a new image file in the folder and change this name to swap your photo
    paragraphs: [
      "Hey, I'm Swagat 👋 — a software engineer out of UNC Chapel Hill (Computer Science + Data Science, TA for Data Structures & Algorithms). I like working across the whole stack: I've shipped SwiftUI accessibility features at Fidelity, built backend services in Java and FastAPI, and researched 3D Gaussian Splatting for holographic video rendering.",
      "I'm happiest when I'm building something from zero. I founded PickUp, a cross-platform Flutter app that helps sports enthusiasts find teammates, after running 50+ customer empathy interviews. Before that I taught programming and robotics to 150+ students — which taught me more about explaining hard ideas simply than any class ever did.",
      "Right now I'm diving deeper into infrastructure — AWS, Docker, Kubernetes — because I want to understand not just how software is built, but how it runs at scale.",
    ],
  },

  // The animated number counters. Edit freely.
  stats: [
    { value: 4,   suffix: "+",  label: "Years building software" },
    { value: 150, suffix: "+",  label: "Students mentored" },
    { value: 10,  suffix: "+",  label: "Languages & frameworks" },
    { value: 3,   suffix: "",   label: "Hackathon awards" },
  ],

  /* ---------- SKILLS ---------- */
  skills: [
    {
      category: "Languages",
      items: ["Python", "Java", "JavaScript", "TypeScript", "C++", "C", "Dart", "Swift", "SQL", "R"],
    },
    {
      category: "Frameworks & Libraries",
      items: ["Flutter", "React", "Angular", "FastAPI", "SQLAlchemy", "TensorFlow", "Keras", "PyTorch", "NumPy", "pandas"],
    },
    {
      category: "Cloud & Infrastructure",
      items: ["AWS", "Google Cloud", "Firebase", "Docker", "PostgreSQL", "Git", "Apache", "Agile / Scrum"],
    },
  ],

  /* ---------- WORK EXPERIENCE (most recent first) ---------- */
  experience: [
    {
      company: "UNC Data Science & Society",
      role: "Researcher — 3D Gaussian Splatting",
      dates: "Jun 2024 – Aug 2024",
      location: "Chapel Hill, NC",
      points: [
        "Researched under Professor Richard Marks, feeding point-cloud and depth data into Unity to stream holographic video.",
        "Studied NeRF and earlier rendering models to contextualize the modern technique of Gaussian Splatting.",
      ],
      tech: ["Unity", "Computer Vision", "Research"],
    },
    {
      company: "Fidelity Investments",
      role: "Mobile Engineering Intern — Accessibility",
      dates: "Jun 2024 – Aug 2024",
      location: "Raleigh, NC",
      points: [
        "Migrated the app from UIKit to SwiftUI and added new accessibility features to keep the app inclusive for customers with disabilities.",
      ],
      tech: ["Swift", "SwiftUI", "iOS", "Accessibility"],
    },
    {
      company: "PickUp",
      role: "Founder & Software Engineer",
      dates: "Mar 2024 – Jun 2024",
      location: "Remote",
      points: [
        "Built a cross-platform Flutter app that helps sports enthusiasts gather teammates for games.",
        "Personally surveyed 50+ potential customers with open-ended empathy interviews to shape the MVP.",
        "Demo: youtu.be/dXf1Sn7cHjc · Code: github.com/Swagat321/pickup",
      ],
      tech: ["Flutter", "Dart", "Firebase", "Product"],
    },
    {
      company: "UNC Computer Science (CSXL)",
      role: "Software Engineering Intern",
      dates: "Jan 2024 – Jun 2024",
      location: "Chapel Hill, NC",
      points: [
        "Shipped a course-roadmap feature on the CSXL web app rated 5 stars by over 95% of users — SQLAlchemy + PostgreSQL entities, FastAPI with Pydantic, TypeScript/Angular frontend.",
      ],
      tech: ["FastAPI", "PostgreSQL", "Angular", "TypeScript"],
    },
    {
      company: "UNC Telepresence Lab",
      role: "Research Assistant — AR/VR Acoustic Simulation",
      dates: "Aug 2023 – Dec 2023",
      location: "Chapel Hill, NC",
      points: [
        "Programmed a sound emission and detection system in C++ to capture ray data within different room geometries.",
        "Modeled specular and diffuse ray journeys across environments to enhance the acoustic experience for XR users.",
        "Used calculus and pygsound to cut sound latency by 0.01s for improved realism.",
      ],
      tech: ["C++", "Python", "XR", "Acoustics"],
    },
    {
      company: "Fidelity Investments",
      role: "Full-Stack Software Engineer Intern",
      dates: "Jun 2023 – Aug 2023",
      location: "Raleigh, NC",
      points: [
        "Implemented a portfolio exchange tracker in Java compliant with 100% of business contracts and government regulations.",
        "Modernized the backend to redirect over 70% of traffic from phone agents to the UI client for automated asset rebalancing.",
        "Worked in an Agile team building RESTful APIs, designing schemas, and running scalable Lambda functions.",
      ],
      tech: ["Java", "AWS Lambda", "REST APIs", "Agile"],
    },
    {
      company: "Zebra Robotics",
      role: "Programming & Robotics Instructor",
      dates: "Mar 2022 – Aug 2022",
      location: "Cary, NC",
      points: [
        "Trained 150+ students (grades 3–10) for 20–30 hours weekly, tailoring hardware and software concepts to each level.",
        "Challenged students with programming problems in Python and Java, plus web design in HTML/CSS.",
      ],
      tech: ["Python", "Java", "Teaching"],
    },
  ],

  /* ---------- PROJECTS ---------- */
  projects: [
    {
      name: "Evently",
      year: "2023–2024",
      description: "Cross-platform Flutter app that recommends and schedules campus-wide events to target demographics. Co-founded from scratch over a winter break — a crash course in sacrifice, hard work, and mobile development.",
      tech: ["Flutter", "Dart", "Firebase"],
      links: [{ label: "Code", url: "https://github.com/Swagat321/evently2" }],
      award: "",
    },
    {
      name: "Ecosorter",
      year: "2023",
      description: "A Raspberry Pi scans a palette every second, classifies each object as recycling, compost, or e-waste, and flips a servo motor to sort it automatically.",
      tech: ["Raspberry Pi", "Python", "ML"],
      links: [
        { label: "Devpost", url: "https://devpost.com/software/ecosorter-4yqt9b" },
        { label: "Code", url: "https://github.com/Swagat321/HackDuke2023" },
      ],
      award: "🏆 Code for Good Award — HackDuke",
    },
    {
      name: "AgTech",
      year: "2022",
      description: "An apparatus measuring soil quality across 5 dimensions to empower farmers during peak Covid. Data pipeline: Arduino → Pi → Firebase → Google Colab → live website.",
      tech: ["Arduino", "Firebase", "Colab"],
      links: [
        { label: "Devpost", url: "https://devpost.com/software/agtech" },
        { label: "Live Site", url: "https://hacknc22.web.app/" },
      ],
      award: "🏆 $400 — John Deere + Infosys",
    },
    {
      name: "Elephant Trunk Biomimicry",
      year: "2022",
      description: "Prototype of a robotic arm for surgical and industrial applications, modeled on the powerful dexterity of an elephant's trunk.",
      tech: ["Robotics", "Biomimicry"],
      links: [{ label: "Paper", url: "https://github.com/Swag321/elephantTrunkModel/files/10419507/BMPaper.pdf" }],
      award: "",
    },
    {
      name: "Clap-Controlled Car",
      year: "2020",
      description: "A miniature car built with an Arduino, sound sensor, and motors that pivots direction based on the number of claps it hears.",
      tech: ["Arduino", "C++", "Hardware"],
      links: [],
      award: "",
    },
    {
      name: "Exercise Machine",
      year: "2020",
      description: "Soldered buttons to cycle workout routines, a potentiometer for screen brightness, and a timer that beeps at the end of each set — and doubles as a morning alarm.",
      tech: ["Arduino", "Soldering", "Hardware"],
      links: [],
      award: "",
    },
  ],

  /* ---------- EDUCATION ---------- */
  education: [
    {
      school: "University of North Carolina at Chapel Hill",
      degree: "B.S. Computer Science + Data Science",
      dates: "Graduated December 2024",
      details: [
        "Teaching Assistant for Data Structures & Algorithms",
        "Harvey Duke Scholarship recipient",
      ],
    },
    {
      school: "Wake Technical Community College",
      degree: "Diploma in IT: Web Development",
      dates: "2022",
      details: ["Dual-enrolled during high school for college transfer credit"],
    },
  ],

  /* ---------- THE VAULT (hidden button) ----------
     How to open it on the site:
       • Click the small glowing dot in the footer 3 times, OR
       • Press  Ctrl + Shift + L  anywhere on the page.

     Default login:  username "swagat"  password "changeme123"
     ⚠️ CHANGE THESE. To generate a new hash, open your browser
     console (F12) on the site and run:
        vaultHash("your-new-password")
     then paste the result below.

     After login you get a launchpad of your homelab links ("links"
     below). The URLs are Tailscale addresses from the Jarvis3 stack —
     they only work on devices connected to your tailnet, which is
     exactly the point. Add/remove links freely.
     (If you'd rather have a single redirect instead of a launchpad,
     delete the whole "links" list and set "url" instead.)

     NOTE: this gate is a lightweight front-door, not real security —
     the real protection is Tailscale (network) + each app's own login
     (see HOSTING.md → "Securing the Vault").
  ------------------------------------------------- */
  vault: {
    title: "Swagat's Vault",
    subtitle: "Restricted area. Authorized personnel only.",
    usernameHash: "c6d4452c88676602c4b57e6efbc130b6fd74e808391bad06a10b42ca580d66c6",
    passwordHash: "494a715f7e9b4071aca61bac42ca858a309524e5864f0920030862a4ae7589be",
    links: [
      { label: "🤖 Jarvis", desc: "Open WebUI · local LLM + RAG", url: "http://100.106.68.111:3000" },
      { label: "📸 Immich", desc: "photo library", url: "http://100.106.68.111:2283" },
      { label: "🔑 Vaultwarden", desc: "passwords (HTTPS via Caddy)", url: "https://100.106.68.111:11001" },
    ],
    url: "",   // legacy single-redirect mode — used only if "links" above is empty
  },

};
