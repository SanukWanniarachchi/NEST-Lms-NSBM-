import cybersecurityImage from "@/public/images/courses/cybersecurity-foundations.webp";
import networkingImage from "@/public/images/courses/networking-essentials.webp";
import roboticsImage from "@/public/images/courses/robotics-fundamentals.webp";
import type { Course } from "@/types/lms";

export const courses: Course[] = [
  {
    slug: "cybersecurity-foundations",
    title: "Cybersecurity Foundations: Defend the Digital World",
    shortTitle: "Cybersecurity Foundations",
    category: "Cybersecurity",
    eyebrow: "Think like a defender",
    description:
      "Build a practical foundation in digital safety, common threats, secure habits, and ethical cyber defence.",
    longDescription:
      "Explore how modern systems are protected through short, approachable lessons and guided scenarios. This demonstration course connects essential cyber concepts to the everyday digital environments university students use.",
    level: "Beginner",
    duration: "4 weeks",
    lessonCount: 12,
    image: cybersecurityImage,
    imageAlt:
      "Illustrated university students discussing a protected digital network in a cybersecurity lab",
    accent: "violet",
    instructor: {
      name: "Nethmi Perera",
      role: "Demo Cybersecurity Mentor",
      initials: "NP",
      bio: "A fictional NEST mentor profile created for this frontend demonstration, focused on practical security awareness and ethical learning.",
    },
    outcomes: [
      "Recognise common digital threats and social engineering patterns",
      "Apply safer account, device, and browsing practices",
      "Explain the purpose of encryption, access control, and defence in depth",
      "Approach cybersecurity problems with an ethical, defensive mindset",
    ],
    progress: 68,
    modules: [
      {
        id: "cyber-world",
        title: "The connected world",
        description: "Understand what we protect and why digital trust matters.",
        lessons: [
          { slug: "what-is-cybersecurity", title: "What is cybersecurity?", duration: "7 min", description: "A clear tour of assets, risks, threats, and safeguards.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-01", completed: true },
          { slug: "your-digital-footprint", title: "Your digital footprint", duration: "8 min", description: "See how everyday online activity creates useful—and sensitive—data.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-02", completed: true },
          { slug: "threats-and-vulnerabilities", title: "Threats and vulnerabilities", duration: "10 min", description: "Separate weaknesses from the people and events that can exploit them.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-03", completed: true },
        ],
      },
      {
        id: "safe-by-default",
        title: "Safer by default",
        description: "Turn security concepts into dependable personal habits.",
        lessons: [
          { slug: "strong-authentication", title: "Stronger authentication", duration: "9 min", description: "Passwords, passphrases, managers, and multi-factor authentication.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-04", completed: true },
          { slug: "spot-the-phish", title: "Spot the phish", duration: "11 min", description: "Evaluate messages, links, urgency, and identity clues before acting.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-05", completed: true },
          { slug: "devices-and-updates", title: "Devices, updates, and backups", duration: "8 min", description: "Build a simple resilience routine for devices and important work.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-06" },
        ],
      },
      {
        id: "defence-layers",
        title: "Layers of defence",
        description: "Explore the controls that protect systems and networks.",
        lessons: [
          { slug: "encryption-basics", title: "Encryption without the mystery", duration: "10 min", description: "Understand data at rest, in transit, and the role of keys.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-07" },
          { slug: "access-control", title: "Who should have access?", duration: "9 min", description: "Learn least privilege, roles, and responsible permissions.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-08" },
          { slug: "defence-in-depth", title: "Defence in depth", duration: "12 min", description: "Combine people, process, and technology into layered protection.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-09" },
        ],
      },
      {
        id: "ethical-defender",
        title: "The ethical defender",
        description: "Practise responsible analysis and incident thinking.",
        lessons: [
          { slug: "ethics-and-permission", title: "Ethics, scope, and permission", duration: "8 min", description: "Why curiosity must always be paired with consent and boundaries.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-10" },
          { slug: "incident-response", title: "When something goes wrong", duration: "11 min", description: "A calm first look at reporting, containment, and recovery.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-11" },
          { slug: "cyber-challenge", title: "Course challenge", duration: "15 min", description: "Apply the course ideas to a fictional campus security scenario.", youtubeUrl: "https://www.youtube.com/watch?v=demo-cyber-12" },
        ],
      },
    ],
  },
  {
    slug: "networking-essentials",
    title: "Networking Essentials: How the Internet Connects Us",
    shortTitle: "Networking Essentials",
    category: "Networking",
    eyebrow: "Connect the pieces",
    description:
      "Follow data from one device to another and understand the foundations behind reliable digital communication.",
    longDescription:
      "Learn the language of computer networks through visual explanations, practical examples, and a campus network scenario. The course turns abstract protocols and devices into a connected story.",
    level: "Beginner",
    duration: "4 weeks",
    lessonCount: 12,
    image: networkingImage,
    imageAlt:
      "Illustrated university students connecting computers and a router in a networking laboratory",
    accent: "cyan",
    instructor: {
      name: "Kavindu Jayasinghe",
      role: "Demo Networking Mentor",
      initials: "KJ",
      bio: "A fictional NEST mentor profile created for this frontend demonstration, passionate about making networks visible and understandable.",
    },
    outcomes: [
      "Describe how data moves through a network",
      "Identify common network devices and their roles",
      "Explain addressing, switching, routing, and core protocols",
      "Sketch and troubleshoot a simple small network",
    ],
    progress: 42,
    modules: [
      {
        id: "network-story",
        title: "The network story",
        description: "Start with connected devices and the journey of a message.",
        lessons: [
          { slug: "why-networks", title: "Why networks exist", duration: "7 min", description: "From two computers to a connected campus.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-01", completed: true },
          { slug: "data-in-packets", title: "Data travels in packets", duration: "9 min", description: "Break a message into manageable pieces and follow its journey.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-02", completed: true },
          { slug: "network-shapes", title: "Shapes and sizes of networks", duration: "8 min", description: "Compare local, wide-area, wired, and wireless networks.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-03", completed: true },
        ],
      },
      {
        id: "devices",
        title: "Meet the devices",
        description: "Understand the equipment that moves and protects traffic.",
        lessons: [
          { slug: "switches", title: "Switches and local delivery", duration: "10 min", description: "See how a switch learns where devices live.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-04", completed: true },
          { slug: "routers", title: "Routers and the next hop", duration: "11 min", description: "Choose a path between different networks.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-05" },
          { slug: "wireless-access", title: "Wireless access", duration: "9 min", description: "Connect devices through radio while managing coverage and safety.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-06" },
        ],
      },
      {
        id: "addresses-protocols",
        title: "Addresses and protocols",
        description: "Learn the rules and labels that make communication possible.",
        lessons: [
          { slug: "ip-addresses", title: "IP addresses made visual", duration: "12 min", description: "Locate network interfaces using logical addresses.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-07" },
          { slug: "dns", title: "DNS: names to numbers", duration: "9 min", description: "Follow a friendly domain name to its destination.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-08" },
          { slug: "tcp-udp", title: "TCP and UDP", duration: "12 min", description: "Compare reliable delivery with fast, lightweight transport.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-09" },
        ],
      },
      {
        id: "build-troubleshoot",
        title: "Build and troubleshoot",
        description: "Bring the concepts together in a practical network plan.",
        lessons: [
          { slug: "small-network", title: "Plan a small network", duration: "13 min", description: "Select devices and map connections for a student project room.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-10" },
          { slug: "troubleshooting", title: "A troubleshooting mindset", duration: "11 min", description: "Work from physical links to services, one layer at a time.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-11" },
          { slug: "network-challenge", title: "Course challenge", duration: "15 min", description: "Repair a fictional campus lab network using visual clues.", youtubeUrl: "https://www.youtube.com/watch?v=demo-network-12" },
        ],
      },
    ],
  },
  {
    slug: "robotics-fundamentals",
    title: "Robotics Fundamentals: Build, Sense, Move",
    shortTitle: "Robotics Fundamentals",
    category: "Robotics",
    eyebrow: "Turn ideas into motion",
    description:
      "Discover how mechanics, electronics, sensors, and code work together inside an approachable mobile robot.",
    longDescription:
      "Move from the building blocks of a robot to a complete sense-think-act loop. Visual lessons and workshop-style challenges keep the experience practical, creative, and friendly for beginners.",
    level: "Beginner to intermediate",
    duration: "5 weeks",
    lessonCount: 12,
    image: roboticsImage,
    imageAlt:
      "Illustrated university students assembling a small robot in a campus makerspace",
    accent: "amber",
    instructor: {
      name: "Amaya Fernando",
      role: "Demo Robotics Mentor",
      initials: "AF",
      bio: "A fictional NEST mentor profile created for this frontend demonstration, combining playful prototyping with systems thinking.",
    },
    outcomes: [
      "Explain the sense-think-act model of a robot",
      "Recognise common sensors, actuators, and control components",
      "Break a robot challenge into mechanical and software decisions",
      "Design and test a simple mobile robot behaviour",
    ],
    progress: 0,
    modules: [
      {
        id: "robot-building-blocks",
        title: "Robot building blocks",
        description: "Meet the systems that turn a machine into a robot.",
        lessons: [
          { slug: "what-is-a-robot", title: "What makes a robot?", duration: "8 min", description: "Separate automation, machines, and responsive robots.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-01" },
          { slug: "sense-think-act", title: "Sense, think, act", duration: "9 min", description: "Use a simple loop to understand robot behaviour.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-02" },
          { slug: "mechanical-structure", title: "Mechanical structure", duration: "10 min", description: "Frames, joints, wheels, and the importance of stability.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-03" },
        ],
      },
      {
        id: "sensing-world",
        title: "Sensing the world",
        description: "Give a robot useful information about its environment.",
        lessons: [
          { slug: "distance-sensors", title: "Measuring distance", duration: "10 min", description: "Compare simple approaches to detecting nearby objects.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-04" },
          { slug: "light-and-line", title: "Light and line sensors", duration: "9 min", description: "Turn reflected light into a path-following signal.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-05" },
          { slug: "clean-sensor-data", title: "Working with sensor data", duration: "11 min", description: "Handle noisy readings with thresholds and repeated samples.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-06" },
        ],
      },
      {
        id: "motion-control",
        title: "Motion and control",
        description: "Translate decisions into controlled physical movement.",
        lessons: [
          { slug: "motors-actuators", title: "Motors and actuators", duration: "10 min", description: "Choose movement components for different jobs.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-07" },
          { slug: "drive-and-turn", title: "Drive, turn, repeat", duration: "12 min", description: "Coordinate wheel speeds to create predictable motion.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-08" },
          { slug: "feedback", title: "Feedback improves control", duration: "11 min", description: "Compare open-loop commands with measured correction.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-09" },
        ],
      },
      {
        id: "prototype-challenge",
        title: "Prototype challenge",
        description: "Design, test, and improve a complete robot behaviour.",
        lessons: [
          { slug: "plan-behaviour", title: "Plan the behaviour", duration: "9 min", description: "Turn a goal into states, decisions, and actions.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-10" },
          { slug: "test-iterate", title: "Test and iterate", duration: "10 min", description: "Use observations to improve both code and hardware.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-11" },
          { slug: "robotics-challenge", title: "Course challenge", duration: "16 min", description: "Guide a fictional robot safely through a campus makerspace.", youtubeUrl: "https://www.youtube.com/watch?v=demo-robotics-12" },
        ],
      },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return undefined;

  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((item) => item.slug === lessonSlug);
    if (lesson) return { course, module: courseModule, lesson };
  }

  return undefined;
}

export function getAllLessonParams() {
  return courses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        slug: course.slug,
        lesson: lesson.slug,
      })),
    ),
  );
}
