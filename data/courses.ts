import cybersecurityImage from "@/public/images/courses/cybersecurity-foundations.webp";
import networkingImage from "@/public/images/courses/networking-essentials.webp";
import roboticsImage from "@/public/images/courses/robotics-fundamentals.webp";
import type { Course, Lesson } from "@/types/lms";

function microLesson(
  slug: string,
  title: string,
  description: string,
  keyPoints: string[],
  activity: string,
  duration = "2 min",
): Lesson {
  const whatMatch = title.match(/^What is (.+)\?$/i);
  const objective = whatMatch
    ? `Explain the role and meaning of “${whatMatch[1]}” and connect it to a familiar technology scenario.`
    : `Describe the key ideas behind “${title.replace(/[?]/g, "")}” and apply them to a familiar technology scenario.`;
  return {
    slug,
    title,
    duration,
    description,
    learningObjective: objective,
    keyPoints,
    activity,
    recap: description,
  };
}

const cyber = microLesson;
const network = microLesson;
const robot = microLesson;

export const courses: Course[] = [
  {
    slug: "cybersecurity-foundations",
    title: "Cybersecurity Foundations: Protect the Digital World",
    shortTitle: "Cybersecurity Foundations",
    category: "Cybersecurity",
    eyebrow: "Think like a defender",
    description: "Recognise common attacks, protect accounts and devices, and build safer digital habits from the ground up.",
    longDescription: "A beginner-friendly micro-course that explains cyber risk through short visual lessons, familiar examples, and practical safety checks for everyday university life.",
    level: "Beginner",
    duration: "Approx. 58 min",
    lessonCount: 29,
    image: cybersecurityImage,
    imageAlt: "A bright blue shield and keyhole connected to an abstract circuit network",
    accent: "violet",
    instructor: {
      name: "NEST Learning Team",
      role: "Cybersecurity learning path",
      initials: "NT",
      bio: "Developed as a collaborative NEST micro-course for students beginning their journey into digital safety and ethical cyber awareness.",
    },
    outcomes: [
      "Explain why cybersecurity matters to individuals and organisations",
      "Recognise malware, phishing, social engineering, and password attacks",
      "Apply stronger authentication, browsing, Wi-Fi, update, and backup practices",
      "Describe core network-security controls including firewalls, encryption, HTTPS, and VPNs",
    ],
    progress: 0,
    modules: [
      {
        id: "introduction-to-cybersecurity",
        title: "Introduction to Cybersecurity",
        description: "Build the vocabulary needed to discuss threats, protection, and digital trust.",
        lessons: [
          cyber("what-is-cybersecurity", "What is Cybersecurity?", "Understand how people, processes, and technology protect systems and information.", ["Digital assets", "Threats and safeguards", "Real-world incidents"], "List three digital assets you use at university and one protection for each."),
          cyber("why-cybersecurity-matters", "Why Cybersecurity Matters", "Connect security incidents to privacy, finances, learning, reputation, and organisational continuity.", ["Personal impact", "Organisational impact", "Shared responsibility"], "Trace the possible impact of a compromised university account."),
          cyber("types-of-hackers", "Types of Hackers", "Compare white-hat, black-hat, and grey-hat activity through permission and intent.", ["White-hat", "Black-hat", "Grey-hat"], "Classify three short scenarios by intent and authorisation."),
          cyber("common-cyber-threats", "Common Cyber Threats Overview", "Survey the attacks beginners are most likely to encounter online.", ["Malware", "Phishing", "Account compromise"], "Match each threat to the warning sign that best reveals it."),
          cyber("cia-triad", "The CIA Triad", "Use confidentiality, integrity, and availability to describe what security protects.", ["Confidentiality", "Integrity", "Availability"], "Apply the CIA triad to a student records system."),
        ],
      },
      {
        id: "common-attacks",
        title: "Common Attacks",
        description: "Recognise how common attacks work and the signals that help expose them.",
        lessons: [
          cyber("what-is-malware", "What is Malware?", "Learn how malicious software disrupts, spies on, damages, or controls devices.", ["Malicious software", "Delivery methods", "Warning signs"], "Identify safe first actions after noticing suspicious device behaviour."),
          cyber("virus-worm-trojan", "Virus vs Worm vs Trojan", "Separate three common malware types by how they spread and disguise themselves.", ["Virus", "Worm", "Trojan"], "Sort example behaviours into virus, worm, or Trojan categories."),
          cyber("what-is-phishing", "What is Phishing?", "Spot messages designed to steal information or pressure you into an unsafe action.", ["Sender clues", "Suspicious links", "Urgency and impersonation"], "Inspect a sample email and mark every phishing indicator."),
          cyber("password-attacks", "Password Attacks", "Understand brute-force and dictionary attacks and why predictable passwords fail.", ["Brute force", "Dictionary attacks", "Credential reuse"], "Compare weak and strong passphrases without revealing a real password."),
          cyber("man-in-the-middle", "Man-in-the-Middle Attacks", "See how an attacker can intercept communication between two trusted endpoints.", ["Interception", "Untrusted networks", "Encrypted connections"], "Draw the normal path and intercepted path of a web request."),
          cyber("social-engineering", "Social Engineering Basics", "Recognise manipulation that targets human trust rather than technical weaknesses.", ["Pretexting", "Authority", "Urgency"], "Rewrite a pressured response into a calm verification step."),
          cyber("ransomware", "Ransomware Explained", "Understand how ransomware blocks access to data and why recovery planning matters.", ["Encryption for extortion", "Backups", "Incident reporting"], "Choose the safest first responses to a ransomware warning."),
          cyber("zero-day-attacks", "Zero-Day Attacks", "Learn why previously unknown vulnerabilities can be difficult to defend against.", ["Unknown vulnerability", "Exploit window", "Layered defence"], "Explain why updates and multiple safeguards still matter when no patch exists."),
        ],
      },
      {
        id: "authentication-password-security",
        title: "Authentication & Password Security",
        description: "Build safer account habits and understand how systems verify identity.",
        lessons: [
          cyber("strong-passwords", "What Makes a Strong Password?", "Create memorable passphrases that resist guessing and automated attacks.", ["Length", "Uniqueness", "Passphrases"], "Evaluate sample passwords using length, uniqueness, and predictability."),
          cyber("multi-factor-authentication", "Multi-Factor Authentication", "Add a second verification factor so one stolen password is not enough.", ["Knowledge factors", "Possession factors", "Biometric factors"], "Choose suitable factors for email, banking, and campus accounts."),
          cyber("password-hashing", "Password Hashing", "Understand how one-way hashing helps services avoid storing readable passwords.", ["One-way transformation", "Salt", "Verification"], "Use a lock-and-fingerprint analogy to explain password hashing."),
          cyber("password-mistakes", "Common Password Mistakes", "Recognise reuse, sharing, predictable patterns, and unsafe storage.", ["Password reuse", "Personal details", "Unsafe sharing"], "Create a safer alternative for each common password mistake."),
          cyber("password-managers", "Password Managers", "Use an encrypted vault to create and store unique credentials.", ["Encrypted vault", "Password generation", "Recovery planning"], "Draft a checklist for choosing and setting up a password manager."),
        ],
      },
      {
        id: "network-security-basics",
        title: "Network Security Basics",
        description: "Meet the network concepts and controls that protect data in transit.",
        lessons: [
          cyber("what-is-a-network", "What is a Network?", "See how connected devices exchange data and share services.", ["Connected devices", "Data exchange", "Shared services"], "Sketch the devices connected to a typical home or study network."),
          cyber("what-is-an-ip-address", "What is an IP Address?", "Understand the logical address used to identify a device interface on a network.", ["Network identity", "IPv4 example", "Public and private context"], "Label the source and destination addresses in a simple packet journey."),
          cyber("what-is-a-firewall", "What is a Firewall?", "Learn how traffic rules allow trusted communication and block unwanted connections.", ["Traffic filtering", "Rules", "Inbound and outbound traffic"], "Decide which sample connections a basic firewall should allow."),
          cyber("what-is-encryption", "What is Encryption?", "Turn readable information into protected ciphertext that requires a key.", ["Plaintext", "Ciphertext", "Keys"], "Use a sealed-message analogy to explain encryption to a classmate."),
          cyber("https-vs-http", "HTTPS vs HTTP", "Recognise how HTTPS protects web traffic with encryption and identity checks.", ["TLS", "Browser indicators", "Data in transit"], "Compare the security signals of HTTP and HTTPS page addresses."),
          cyber("vpn-basics", "VPN Basics", "Understand how a VPN creates an encrypted tunnel to a trusted service.", ["Encrypted tunnel", "VPN endpoint", "Limits of a VPN"], "Map what a VPN protects and what safe browsing habits still remain necessary."),
        ],
      },
      {
        id: "safe-practices",
        title: "Safe Practices",
        description: "Turn cybersecurity knowledge into a repeatable personal protection routine.",
        lessons: [
          cyber("safe-browsing", "Safe Browsing Tips", "Use browser signals, careful downloads, and deliberate link checking to reduce risk.", ["Trusted sources", "Link checking", "Download caution"], "Create a five-point safe-browsing checklist."),
          cyber("fake-websites", "Recognising Fake Websites", "Inspect addresses, design inconsistencies, requests, and trust signals before entering data.", ["Domain spelling", "Page behaviour", "Unexpected requests"], "Compare a legitimate address with three deceptive lookalikes."),
          cyber("secure-wifi", "Secure Wi-Fi Usage", "Protect devices and accounts when connecting through home, campus, or public wireless networks.", ["Trusted networks", "Router security", "Public Wi-Fi caution"], "Choose safer actions for three public Wi-Fi scenarios."),
          cyber("updates-patching", "Software Updates & Patching", "Understand how timely updates close known weaknesses and improve resilience.", ["Security patches", "Automatic updates", "Supported software"], "Audit the update settings on a non-sensitive practice device."),
          cyber("backup-strategies", "Backup Strategies", "Use reliable copies to recover from loss, damage, or ransomware.", ["3-2-1 approach", "Recovery copies", "Restore testing"], "Design a backup plan for important coursework."),
        ],
      },
    ],
  },
  {
    slug: "networking-essentials",
    title: "Networking Essentials: How Digital Connections Work",
    shortTitle: "Networking Essentials",
    category: "Networking",
    eyebrow: "Connect the pieces",
    description: "Follow data across devices, addresses, protocols, and services, then apply the ideas to a practical small network.",
    longDescription: "A visual beginner micro-course that turns networking terminology into one connected story—from the first local link to internet services and practical troubleshooting.",
    level: "Beginner",
    duration: "Approx. 50 min",
    lessonCount: 25,
    image: networkingImage,
    imageAlt: "A bright orange wireless router linking a balanced network of connected nodes",
    accent: "amber",
    instructor: {
      name: "NEST Learning Team",
      role: "Networking learning path",
      initials: "NT",
      bio: "Developed as a collaborative NEST micro-course to make the systems behind everyday connectivity visible and approachable.",
    },
    outcomes: [
      "Identify common network types, devices, addresses, and protocols",
      "Explain how packets travel across local networks and the internet",
      "Describe core safety controls including firewalls, VPNs, and encryption",
      "Set up, inspect, test, and troubleshoot a small network",
    ],
    progress: 0,
    modules: [
      {
        id: "introduction-to-networking",
        title: "Introduction to Networking",
        description: "Discover why networks exist and the devices and links that make them possible.",
        lessons: [
          network("what-is-networking", "What is Networking?", "See how connected devices communicate, share resources, and reach internet services.", ["Connected devices", "Communication", "Internet basics"], "Draw a network containing two devices and one shared service."),
          network("types-of-networks", "Types of Networks", "Compare LAN, WAN, and MAN networks by coverage, ownership, and purpose.", ["LAN", "WAN", "MAN"], "Classify home, campus, city, and global network examples."),
          network("networking-devices", "Networking Devices", "Understand the basic roles of routers, switches, modems, and hubs.", ["Router", "Switch", "Modem and hub"], "Match each device to the traffic-handling job it performs."),
          network("wired-vs-wireless", "Wired vs Wireless Networks", "Compare Ethernet and Wi-Fi for speed, mobility, interference, and deployment.", ["Ethernet", "Wi-Fi", "Performance trade-offs"], "Recommend wired or wireless connectivity for three campus situations."),
          network("benefits-of-networking", "Benefits of Networking", "Connect networks to file sharing, communication, internet access, and collaboration.", ["Resource sharing", "Communication", "Internet access"], "List the network services used during one study session."),
        ],
      },
      {
        id: "network-fundamentals",
        title: "Network Fundamentals",
        description: "Learn the addresses, naming systems, protocols, and packets behind communication.",
        lessons: [
          network("ip-address", "What is an IP Address?", "Understand how logical addresses identify interfaces and guide packets to destinations.", ["Logical addressing", "Network and host context", "Packet destination"], "Label source and destination IP addresses in a simple message flow."),
          network("ipv4-vs-ipv6", "IPv4 vs IPv6", "Compare the familiar 32-bit IPv4 format with the larger 128-bit IPv6 address space.", ["32-bit IPv4", "128-bit IPv6", "Address capacity"], "Identify whether sample addresses use IPv4 or IPv6."),
          network("mac-address", "MAC Address Basics", "Learn how a network interface is identified for local data delivery.", ["Hardware address", "Local delivery", "Network interface"], "Follow how a switch uses MAC addresses inside a LAN."),
          network("dns-explained", "DNS Explained", "See how the Domain Name System translates human-friendly names into IP addresses.", ["Domain names", "DNS lookup", "IP result"], "Trace what happens after entering a website name in a browser."),
          network("network-protocols", "Network Protocols", "Recognise HTTP, HTTPS, and FTP as agreed rules for different communication tasks.", ["HTTP", "HTTPS", "FTP"], "Match each protocol to a suitable file or web scenario."),
          network("data-packets", "Data Packets & Transmission", "Understand how information is divided, addressed, transmitted, and reassembled.", ["Packet structure", "Transmission path", "Reassembly"], "Split a short message into numbered packets and reorder it."),
        ],
      },
      {
        id: "network-security-basics",
        title: "Network Security Basics",
        description: "Protect network communication with safer practices and layered controls.",
        lessons: [
          network("firewall", "What is a Firewall?", "Use traffic rules to control which connections may enter or leave a network.", ["Filtering", "Rules", "Allowed and blocked traffic"], "Create allow-or-block decisions for four sample connections."),
          network("safe-wifi", "Safe Wi-Fi Practices", "Reduce wireless risk with strong settings, trusted networks, and careful public access.", ["Strong encryption", "Trusted access points", "Public Wi-Fi caution"], "Review a sample router checklist and identify weak settings."),
          network("vpn", "VPN Basics", "Understand encrypted tunnels, VPN endpoints, and the boundaries of VPN protection.", ["Tunnel", "Encryption", "VPN limitations"], "Diagram a device-to-VPN-to-service connection path."),
          network("encryption", "Encryption Basics", "Protect network data by transforming plaintext into ciphertext with a key.", ["Plaintext", "Ciphertext", "Encryption key"], "Explain encrypted transmission using a sealed-envelope analogy."),
          network("network-threats", "Common Network Threats", "Recognise interception, unauthorised access, malicious traffic, and service disruption.", ["Eavesdropping", "Unauthorised access", "Denial of service"], "Pair each network threat with a sensible defensive control."),
        ],
      },
      {
        id: "internet-communication",
        title: "Internet & Communication",
        description: "Connect local networking ideas to global services, cloud systems, and digital communication.",
        lessons: [
          network("how-internet-works", "How the Internet Works", "Follow a request across local equipment, service providers, routers, and destination servers.", ["Networks of networks", "Routing", "Internet service providers"], "Sketch the major stops between a laptop and a website."),
          network("client-server", "Client-Server Model", "Understand how clients request resources and servers respond with services or data.", ["Client request", "Server response", "Shared service"], "Label the client and server in three familiar applications."),
          network("cloud-computing", "Cloud Computing Basics", "See how remote computing resources provide storage, software, and processing on demand.", ["Remote resources", "Scalability", "Cloud services"], "Classify examples as local computing or cloud-supported computing."),
          network("email-process", "Email Communication Process", "Trace a message from the sender's client through mail servers to the recipient.", ["Mail client", "Sending server", "Recipient server"], "Sequence the stages of sending and receiving an email."),
          network("troubleshooting-basics", "Network Troubleshooting Basics", "Use a calm, layered process to isolate physical, configuration, and service problems.", ["Check the physical layer", "Verify configuration", "Test one step at a time"], "Order a troubleshooting checklist for a device with no internet access."),
        ],
      },
      {
        id: "practical-networking",
        title: "Practical Networking Skills",
        description: "Apply the course through setup, inspection, testing, and simulation tasks.",
        lessons: [
          network("home-network", "Setting Up a Home Network", "Plan connections, place equipment, secure wireless access, and connect devices.", ["Router placement", "Secure Wi-Fi", "Device connection"], "Design a simple home network diagram and setup checklist."),
          network("ip-configuration", "Checking IP Configuration", "Inspect address, gateway, and DNS information to understand a device's network settings.", ["IP address", "Default gateway", "DNS server"], "Annotate a sample IP configuration output."),
          network("connectivity-testing", "Speed & Connectivity Testing", "Use basic tests to distinguish reachability, latency, and throughput issues.", ["Reachability", "Latency", "Throughput"], "Choose the right test for slow, intermittent, and disconnected scenarios."),
          network("packet-tracer", "Introduction to Cisco Packet Tracer", "Use a visual simulator to place devices, create links, and observe packet movement.", ["Workspace", "Devices and links", "Simulation mode"], "Plan a two-PC, one-switch Packet Tracer exercise."),
        ],
      },
    ],
  },
  {
    slug: "robotics-fundamentals",
    title: "Robotics Fundamentals: Sense, Think, Act",
    shortTitle: "Robotics Fundamentals",
    category: "Robotics",
    eyebrow: "Turn ideas into motion",
    description: "Explore robot systems through electronics, Arduino-based control, motion, feedback, sensors, and connected applications.",
    longDescription: "A visual beginner micro-course that follows the complete robot workflow—from basic circuits and microcontrollers to movement, feedback, wireless communication, and future applications.",
    level: "Beginner to intermediate",
    duration: "Approx. 62 min",
    lessonCount: 31,
    image: roboticsImage,
    imageAlt: "A bright teal educational rover connected to gears and a controller board",
    accent: "cyan",
    instructor: {
      name: "NEST Learning Team",
      role: "Robotics learning path",
      initials: "NT",
      bio: "Developed as a collaborative NEST micro-course that combines approachable electronics, control, and creative systems thinking.",
    },
    outcomes: [
      "Explain the components and sense-think-act workflow of a robot",
      "Recognise basic circuits, sensors, actuators, and signal types",
      "Describe Arduino inputs, outputs, PWM, servos, and sensor interfaces",
      "Compare motor control, feedback, IoT connectivity, and smart robotics applications",
    ],
    progress: 0,
    modules: [
      {
        id: "introduction-to-robotics",
        title: "Introduction to Robotics",
        description: "Understand what robots are, where they work, and how their systems cooperate.",
        lessons: [
          robot("what-is-a-robot", "What is a Robot?", "Distinguish robots from ordinary machines through sensing, decision-making, and action.", ["Automation", "Programmable behaviour", "Environment interaction"], "Classify familiar machines as robots or non-robots and explain why."),
          robot("types-of-robots", "Types of Robots", "Compare industrial, mobile, and humanoid robots by structure and purpose.", ["Industrial robots", "Mobile robots", "Humanoid robots"], "Match robot types to manufacturing, exploration, and assistance tasks."),
          robot("robot-components", "Components of a Robot", "Meet the mechanical frame, controller, sensors, actuators, and power system.", ["Structure", "Controller and sensors", "Actuators and power"], "Label the major components on a simple mobile robot diagram."),
          robot("robot-applications", "Real-Life Applications", "Explore how robots support manufacturing, medicine, agriculture, logistics, and research.", ["Industry", "Healthcare", "Service and exploration"], "Choose a useful robot application for a campus challenge."),
          robot("sense-think-act", "Sense → Think → Act", "Use the core loop to explain how a robot observes, decides, and responds.", ["Sense", "Think", "Act"], "Map the loop for a robot that avoids an obstacle."),
        ],
      },
      {
        id: "electronics-basics",
        title: "Electronics Basics",
        description: "Build the electrical vocabulary needed to understand robot hardware.",
        lessons: [
          robot("voltage-current-resistance", "Voltage, Current & Resistance", "Use a simple flow analogy to relate electrical pressure, movement, and opposition.", ["Voltage", "Current", "Resistance"], "Predict how changing resistance affects a basic LED circuit."),
          robot("what-is-a-circuit", "What is a Circuit?", "Understand closed paths, sources, loads, and connections in an electrical system.", ["Closed path", "Power source", "Load"], "Trace current around a simple battery-and-LED circuit."),
          robot("digital-vs-analog", "Digital vs Analog Signals", "Compare discrete digital states with continuously varying analog measurements.", ["HIGH and LOW", "Analog range", "Signal conversion"], "Classify button, temperature, and light sensor signals."),
          robot("what-is-a-sensor", "What is a Sensor?", "See how sensors convert physical conditions into usable electrical information.", ["Physical quantity", "Electrical signal", "Measurement"], "Select a sensor for distance, light, and temperature tasks."),
          robot("what-is-an-actuator", "What is an Actuator?", "Learn how actuators turn electrical commands into movement, light, sound, or force.", ["Input command", "Physical output", "Motor and servo examples"], "Match actuators to the actions a robot must perform."),
          robot("leds-resistors", "LEDs and Resistors", "Protect and control an LED by adding resistance and observing polarity.", ["LED polarity", "Current limiting", "Safe connection"], "Draw a safe series circuit for an LED and resistor."),
          robot("breadboard-basics", "Breadboard Basics", "Prototype circuits without solder by understanding connected rows and power rails.", ["Terminal strips", "Power rails", "Temporary prototyping"], "Mark connected holes on a breadboard diagram."),
        ],
      },
      {
        id: "microcontrollers",
        title: "Microcontrollers: ATmega328P & Arduino",
        description: "Learn how a small controller reads inputs, runs instructions, and drives outputs.",
        lessons: [
          robot("microcontroller", "What is a Microcontroller?", "Understand the compact computer that coordinates inputs, processing, memory, and outputs.", ["CPU", "Memory", "Input/output pins"], "Identify where a microcontroller fits in the sense-think-act loop."),
          robot("arduino-overview", "Arduino Overview", "Meet the Arduino board, programming workflow, and ATmega328P-based control system.", ["Arduino board", "USB and power", "Sketch workflow"], "Label the main sections of an Arduino Uno-style board."),
          robot("digital-io", "Digital Input & Output", "Read two-state inputs and control two-state outputs with digital pins.", ["INPUT", "OUTPUT", "HIGH and LOW"], "Plan the logic for a button controlling an LED."),
          robot("blink-led", "Blink LED Concept", "Follow the sequence of switching an output on, waiting, and switching it off.", ["Output state", "Timing", "Repeated loop"], "Arrange the steps of a blink sequence in the correct order."),
          robot("push-button", "Push Button Input", "Use a button as a digital input and understand stable pull-up or pull-down states.", ["Button state", "Pull-up or pull-down", "Input reading"], "Predict input readings when a wired button is pressed and released."),
          robot("pwm-basics", "PWM Basics", "Control average output power through rapid on-off pulses and duty cycle.", ["Pulse width", "Duty cycle", "Average output"], "Compare LED brightness at 25%, 50%, and 90% duty cycles."),
          robot("servo-basics", "Servo Motor Basics", "Command a servo to move toward a controlled angular position.", ["Position control", "Control pulse", "Mechanical range"], "Choose suitable servo positions for a small robot arm."),
          robot("interfacing-sensors", "Interfacing Sensors", "Connect power, ground, and signal lines, then interpret a sensor's output.", ["Power", "Ground", "Signal"], "Create a connection checklist for a three-pin sensor."),
        ],
      },
      {
        id: "motion-control",
        title: "Motion & Control",
        description: "Turn controller decisions into reliable movement and improve behaviour with feedback.",
        lessons: [
          robot("motor-types", "Types of Motors", "Compare DC, servo, and stepper motors by speed, position, and control needs.", ["DC motor", "Servo motor", "Stepper motor"], "Select a motor for wheels, steering, and precise rotation."),
          robot("how-motors-work", "How Motors Work", "See how electrical energy and magnetic forces produce rotational movement.", ["Magnetic field", "Rotor", "Electrical to mechanical energy"], "Explain motor rotation using a simple magnetic interaction diagram."),
          robot("motor-driver", "Motor Driver Concept", "Use a driver circuit to provide motor current and direction safely beyond a controller pin.", ["Current amplification", "Direction control", "Controller protection"], "Place a motor driver correctly between a microcontroller and motors."),
          robot("feedback", "What is Feedback?", "Measure results and use them to correct or stabilise a robot's behaviour.", ["Target", "Measurement", "Correction"], "Describe feedback for maintaining a robot's speed."),
          robot("open-vs-closed-loop", "Open Loop vs Closed Loop", "Compare commands without measurement to control that responds to measured output.", ["Open loop", "Closed loop", "Error correction"], "Classify a timer-based turn and sensor-corrected turn."),
          robot("line-following", "Line Following Robot Concept", "Combine reflectance sensors, decisions, and motor adjustments to follow a path.", ["Line sensing", "Control decision", "Motor correction"], "Build a decision table for left, centre, and right sensor readings."),
        ],
      },
      {
        id: "smart-robotics-iot",
        title: "Smart Robotics & IoT",
        description: "Connect robots to wireless services, cloud data, and emerging intelligent applications.",
        lessons: [
          robot("iot-in-robotics", "What is IoT in Robotics?", "Understand how connected robots exchange data with applications, services, and other devices.", ["Connected device", "Data exchange", "Remote service"], "Map the data flow for a remotely monitored robot."),
          robot("wireless-communication", "Wireless Communication Basics", "Compare common short- and medium-range ways for robots to communicate without cables.", ["Bluetooth", "Wi-Fi", "Range and reliability"], "Choose a wireless option for control, telemetry, and cloud access."),
          robot("sensors-cloud", "Robot + Sensors + Cloud", "Follow sensor readings from the robot to storage, analysis, and a user dashboard.", ["Sensor data", "Network connection", "Cloud processing"], "Diagram a temperature-monitoring robot and its cloud data path."),
          robot("smart-home-robot", "Smart Home Robot Example", "Combine sensing, movement, connectivity, and user interaction in one household scenario.", ["Environmental sensing", "Automation", "User control"], "Define the sense-think-act loop for a home assistance task."),
          robot("future-of-robotics", "Future of Robotics", "Explore collaborative robots, autonomy, responsible design, and new human-robot roles.", ["Collaboration", "Autonomy", "Responsible innovation"], "Propose one beneficial future robot and one design responsibility."),
        ],
      },
    ],
  },
];

export const totalLessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);

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
