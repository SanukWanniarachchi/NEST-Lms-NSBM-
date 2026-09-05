import type { ModuleQuiz, QuizQuestion, QuizSource } from "@/types/quiz";

const reviewedOn = "2026-09-03";

const sources = {
  nistCsf: source("nist-csf-2", "The NIST Cybersecurity Framework (CSF) 2.0", "National Institute of Standards and Technology", "https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20", "CSF Core functions and cybersecurity risk outcomes"),
  fips199: source("fips-199", "FIPS PUB 199: Standards for Security Categorization", "National Institute of Standards and Technology", "https://csrc.nist.gov/pubs/fips/199/final", "Definitions of confidentiality, integrity, and availability"),
  cisaPhishing: source("cisa-phishing", "Recognize and Report Phishing", "Cybersecurity and Infrastructure Security Agency", "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing", "Phishing indicators and safe response"),
  nistMalware: source("nist-malware", "NIST Computer Security Resource Center Glossary: Malware", "National Institute of Standards and Technology", "https://csrc.nist.gov/glossary/term/malware", "Malware definition"),
  nistIdentity: source("nist-800-63b", "NIST SP 800-63B: Authentication and Lifecycle Management", "National Institute of Standards and Technology", "https://pages.nist.gov/800-63-4/sp800-63b.html", "Password authenticators and phishing resistance"),
  nistFirewall: source("nist-800-41", "NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy", "National Institute of Standards and Technology", "https://csrc.nist.gov/pubs/sp/800/41/r1/final", "Firewall technologies and policy"),
  tls: source("rfc-8446", "RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3", "Internet Engineering Task Force", "https://www.rfc-editor.org/rfc/rfc8446.html", "Security properties and protocol overview"),
  hostRequirements: source("rfc-1122", "RFC 1122: Requirements for Internet Hosts - Communication Layers", "Internet Engineering Task Force", "https://www.rfc-editor.org/rfc/rfc1122.html", "Internet host communication layers"),
  routerRequirements: source("rfc-1812", "RFC 1812: Requirements for IP Version 4 Routers", "Internet Engineering Task Force", "https://www.rfc-editor.org/rfc/rfc1812.html", "Router introduction and packet forwarding"),
  tcp: source("rfc-9293", "RFC 9293: Transmission Control Protocol", "Internet Engineering Task Force", "https://www.rfc-editor.org/rfc/rfc9293.html", "TCP purpose, reliability, and connection operation"),
  udp: source("rfc-768", "RFC 768: User Datagram Protocol", "Internet Engineering Task Force", "https://www.rfc-editor.org/info/rfc768/", "UDP datagram service and protocol fields"),
  dns: source("rfc-1034", "RFC 1034: Domain Names - Concepts and Facilities", "Internet Engineering Task Force", "https://www.rfc-editor.org/info/rfc1034/", "DNS design goals, name space, and resolvers"),
  dhcp: source("rfc-2131", "RFC 2131: Dynamic Host Configuration Protocol", "Internet Engineering Task Force", "https://www.rfc-editor.org/info/rfc2131/", "DHCP operation and configuration parameters"),
  http: source("rfc-9110", "RFC 9110: HTTP Semantics", "Internet Engineering Task Force", "https://www.rfc-editor.org/rfc/rfc9110.html", "HTTP messages, methods, and status codes"),
  icmp: source("rfc-792", "RFC 792: Internet Control Message Protocol", "Internet Engineering Task Force", "https://www.rfc-editor.org/rfc/rfc792.html", "ICMP purpose and message types"),
  arduinoUno: source("arduino-uno-r3", "Arduino UNO R3 Documentation", "Arduino", "https://docs.arduino.cc/hardware/uno-rev3/", "Board processor, pins, clock, and memory"),
  arduinoDigital: source("arduino-digital-pins", "Digital Pins", "Arduino", "https://docs.arduino.cc/learn/microcontrollers/digital-pins/", "Digital input and output behaviour"),
  arduinoAnalog: source("arduino-analog-input", "Analog Input Pins", "Arduino", "https://docs.arduino.cc/learn/microcontrollers/analog-input/", "Analog-to-digital conversion and analog pins"),
  arduinoPwm: source("arduino-pwm", "Use PWM Output with Arduino", "Arduino", "https://docs.arduino.cc/tutorials/generic/SecretsOfArduinoPWM/", "PWM duty cycle and output generation"),
  rosNodes: source("ros2-nodes", "ROS 2 Documentation: Nodes", "Open Robotics", "https://docs.ros.org/en/lyrical/Concepts/Basic/About-Nodes.html", "Nodes and the ROS graph"),
  rosInterfaces: source("ros2-interfaces", "ROS 2 Interfaces: Topics, Services, and Actions", "Open Robotics", "https://docs.ros.org/en/rolling/Concepts/Basic/Interfaces-Topics-Services-Actions.html", "Communication patterns and appropriate uses"),
} satisfies Record<string, QuizSource>;

function source(id: string, title: string, publisher: string, href: string, section: string): QuizSource {
  return { id, title, publisher, href, section, reviewedOn };
}

function question(id: string, prompt: string, choices: string[], correctAnswer: string, explanation: string, sourceItem: QuizSource): QuizQuestion {
  if (!choices.includes(correctAnswer)) throw new Error(`Correct answer is missing from ${id}`);
  return { id, prompt, choices, correctAnswer, explanation, source: sourceItem };
}

function quiz(courseSlug: string, moduleId: string, title: string, introduction: string, questions: QuizQuestion[]): ModuleQuiz {
  return { id: `${courseSlug}/${moduleId}`, courseSlug, moduleId, title, introduction, passingScore: 2, questions };
}

export const moduleQuizzes: ModuleQuiz[] = [
  quiz("cybersecurity-foundations", "introduction-to-cybersecurity", "Cybersecurity foundations checkpoint", "Check your understanding of cybersecurity risk and the CIA triad.", [
    question("cyber-intro-1", "Which NIST CSF 2.0 function was added to place organizational decision-making around the other five functions?", ["Govern", "Encrypt", "Audit", "Authorize"], "Govern", "CSF 2.0 uses Govern alongside Identify, Protect, Detect, Respond, and Recover.", sources.nistCsf),
    question("cyber-intro-2", "Which security objective protects information from unauthorized disclosure?", ["Availability", "Confidentiality", "Integrity", "Recoverability"], "Confidentiality", "Confidentiality preserves authorized restrictions on information access and disclosure.", sources.fips199),
    question("cyber-intro-3", "Which security objective is affected when records are changed without authorization?", ["Integrity", "Availability", "Confidentiality", "Portability"], "Integrity", "Integrity guards against improper information modification or destruction.", sources.fips199),
  ]),
  quiz("cybersecurity-foundations", "common-attacks", "Common attacks checkpoint", "Recognize phishing, social engineering, and malicious software behaviour.", [
    question("cyber-attacks-1", "What is the safest way to verify an urgent message asking you to sign in?", ["Use the message link in private browsing", "Contact the organization through a known official channel", "Reply with your password", "Forward it to classmates"], "Contact the organization through a known official channel", "CISA recommends resisting urgency and contacting the organization using trusted contact information rather than the message.", sources.cisaPhishing),
    question("cyber-attacks-2", "Which description best matches malware?", ["Software or firmware intended to perform an unauthorized process", "Any application that uses the Internet", "A failed login attempt", "A physical network cable"], "Software or firmware intended to perform an unauthorized process", "NIST defines malware as software or firmware intended to perform an unauthorized process that adversely affects a system.", sources.nistMalware),
    question("cyber-attacks-3", "Which message characteristic is a common phishing warning sign?", ["A verified university domain and expected context", "Pressure to act immediately or face a serious consequence", "A notice you independently requested", "A bookmarked official login page"], "Pressure to act immediately or face a serious consequence", "Urgent or emotionally pressuring language is a common phishing indicator.", sources.cisaPhishing),
  ]),
  quiz("cybersecurity-foundations", "authentication-password-security", "Authentication checkpoint", "Review current password and authentication guidance.", [
    question("cyber-auth-1", "Under current NIST guidance, what minimum length applies to a password used as a single authentication factor?", ["8 characters", "10 characters", "12 characters", "15 characters"], "15 characters", "NIST SP 800-63B requires a minimum of 15 characters when a password is the only authentication factor.", sources.nistIdentity),
    question("cyber-auth-2", "Which password rule does current NIST guidance reject?", ["Blocking common compromised passwords", "Allowing password managers", "Requiring mixtures of character types", "Supporting long passwords"], "Requiring mixtures of character types", "NIST says verifiers should not impose composition rules such as mandatory uppercase, digits, and symbols.", sources.nistIdentity),
    question("cyber-auth-3", "Which statement about passwords is accurate?", ["Passwords are phishing-resistant", "Passwords alone are not phishing-resistant", "Passwords eliminate account recovery risk", "Passwords prove possession of a physical device"], "Passwords alone are not phishing-resistant", "NIST explicitly states that password authenticators are not phishing-resistant.", sources.nistIdentity),
  ]),
  quiz("cybersecurity-foundations", "network-security-basics", "Network security checkpoint", "Check how firewalls and encrypted transport contribute to network protection.", [
    question("cyber-network-1", "What is a firewall primarily used to control?", ["Traffic flowing between networks or hosts", "The physical speed of a processor", "Password length", "File naming"], "Traffic flowing between networks or hosts", "A firewall enforces policy by controlling network traffic between systems or networks.", sources.nistFirewall),
    question("cyber-network-2", "What does TLS 1.3 protect when correctly used?", ["Data exchanged between communicating applications", "A device from all malware", "The physical network cable", "Every file stored on a computer"], "Data exchanged between communicating applications", "TLS is designed to prevent eavesdropping, tampering, and message forgery for application communication.", sources.tls),
    question("cyber-network-3", "Why must firewall rules be based on an explicit policy?", ["So required traffic can be distinguished from unwanted traffic", "So every port remains open", "So encryption becomes unnecessary", "So users never need authentication"], "So required traffic can be distinguished from unwanted traffic", "NIST firewall guidance treats policy as the basis for deciding which traffic should be permitted or blocked.", sources.nistFirewall),
  ]),
  quiz("cybersecurity-foundations", "safe-practices", "Safe practices checkpoint", "Apply safer authentication, reporting, and incident-response decisions.", [
    question("cyber-safe-1", "When should a service force a password change under current NIST guidance?", ["Every 30 days", "Whenever a user changes location", "When there is evidence the password was compromised", "After every successful login"], "When there is evidence the password was compromised", "NIST advises against arbitrary periodic changes but requires a change when compromise is evident.", sources.nistIdentity),
    question("cyber-safe-2", "What should you do after recognizing a suspected phishing message?", ["Report it through the organization's approved process and delete it", "Reply to challenge the sender", "Open attachments to collect proof", "Post it publicly with active links"], "Report it through the organization's approved process and delete it", "CISA recommends reporting suspected phishing through the appropriate channel and then deleting the message.", sources.cisaPhishing),
    question("cyber-safe-3", "Which NIST CSF function covers actions taken after a cybersecurity incident is detected?", ["Respond", "Identify", "Govern", "Protect"], "Respond", "The Respond function contains outcomes for taking action regarding a detected cybersecurity incident.", sources.nistCsf),
  ]),
  quiz("networking-essentials", "introduction-to-networking", "Networking introduction checkpoint", "Review hosts, routers, and layered Internet communication.", [
    question("network-intro-1", "What is the central job of an IP router?", ["Forward packets toward their destinations", "Translate every domain name", "Store every website", "Generate user passwords"], "Forward packets toward their destinations", "RFC 1812 describes routers as systems that receive and forward IP datagrams.", sources.routerRequirements),
    question("network-intro-2", "Which device is considered an Internet host?", ["An end system that runs Internet communication protocols", "Only a cable between switches", "Only a router core", "A passive wall socket"], "An end system that runs Internet communication protocols", "RFC 1122 defines host requirements for end systems participating in Internet communication.", sources.hostRequirements),
    question("network-intro-3", "Why are communication protocols organized in layers?", ["Each layer provides defined services to the layer above", "Every layer uses the same address", "Layers remove the need for standards", "Only one layer operates at a time"], "Each layer provides defined services to the layer above", "The Internet host model organizes communication functions into layers with defined responsibilities and interfaces.", sources.hostRequirements),
  ]),
  quiz("networking-essentials", "network-fundamentals", "Network fundamentals checkpoint", "Compare TCP, UDP, and DNS responsibilities.", [
    question("network-fundamentals-1", "Which transport protocol provides a reliable, in-order byte stream?", ["UDP", "TCP", "DNS", "ICMP"], "TCP", "TCP provides reliable, ordered delivery of a byte stream between applications.", sources.tcp),
    question("network-fundamentals-2", "Which statement best describes UDP?", ["It uses a minimal connectionless datagram service", "It guarantees in-order delivery", "It resolves domain names", "It assigns IP configuration"], "It uses a minimal connectionless datagram service", "UDP provides datagram communication with a minimum of protocol mechanism and without TCP-style connection handling.", sources.udp),
    question("network-fundamentals-3", "What does a DNS resolver request from name servers?", ["Information associated with a domain name", "A new physical cable", "A password reset", "A processor instruction"], "Information associated with a domain name", "DNS resolvers query name servers for resource information associated with names.", sources.dns),
  ]),
  quiz("networking-essentials", "network-security-basics", "Networking security checkpoint", "Review transport protection, traffic policy, and network boundaries.", [
    question("network-security-1", "Which protocol is designed to protect application data against eavesdropping and tampering in transit?", ["TLS", "DHCP", "ICMP", "DNS alone"], "TLS", "TLS provides confidentiality and integrity protection for data exchanged by communicating applications.", sources.tls),
    question("network-security-2", "What should a deny-by-default firewall policy do?", ["Block traffic unless a rule permits it", "Permit every new connection", "Disable all logging", "Replace endpoint authentication"], "Block traffic unless a rule permits it", "A deny-by-default policy permits only traffic explicitly allowed by the firewall policy.", sources.nistFirewall),
    question("network-security-3", "Which boundary is a common location for a network firewall?", ["Between networks with different security requirements", "Inside a monitor cable", "Between a keyboard and a user", "Only inside a text document"], "Between networks with different security requirements", "Firewalls are commonly placed at boundaries to enforce traffic policy between networks or security zones.", sources.nistFirewall),
  ]),
  quiz("networking-essentials", "internet-communication", "Internet communication checkpoint", "Follow the roles of DNS, DHCP, and HTTP.", [
    question("network-internet-1", "What is DNS designed to provide?", ["A distributed name space and resource information", "Automatic battery charging", "Physical packet switching", "Password encryption"], "A distributed name space and resource information", "DNS provides a distributed, hierarchical name space and associated resource records.", sources.dns),
    question("network-internet-2", "What can DHCP provide to a client?", ["Reusable network configuration parameters", "A guaranteed website identity", "Physical Wi-Fi coverage", "Source-code compilation"], "Reusable network configuration parameters", "DHCP supplies hosts with network configuration parameters and can allocate network addresses.", sources.dhcp),
    question("network-internet-3", "Which HTTP element communicates the purpose of a request, such as GET or POST?", ["Method", "Status code", "Domain suffix", "MAC address"], "Method", "An HTTP request method indicates the purpose and desired semantics of the request.", sources.http),
  ]),
  quiz("networking-essentials", "practical-networking", "Practical networking checkpoint", "Apply diagnostic and configuration concepts.", [
    question("network-practical-1", "What is ICMP primarily used to report?", ["Network delivery problems and control information", "User passwords", "Web page styling", "Database records"], "Network delivery problems and control information", "ICMP carries control and error messages related to IP datagram processing.", sources.icmp),
    question("network-practical-2", "Why does a host need a default gateway for many destinations outside its local network?", ["To send packets to a router that can forward them onward", "To convert UDP into TCP", "To increase monitor resolution", "To create domain names"], "To send packets to a router that can forward them onward", "Routers forward IP datagrams between networks; a default gateway is the host's route when no more specific route applies.", sources.routerRequirements),
    question("network-practical-3", "If a TCP segment is lost, which TCP capability supports recovery?", ["Retransmission", "Domain registration", "Voltage regulation", "Address leasing"], "Retransmission", "TCP detects missing data and retransmits so the receiving application obtains an ordered byte stream.", sources.tcp),
  ]),
  quiz("robotics-fundamentals", "introduction-to-robotics", "Robotics introduction checkpoint", "Review modular robot software and communication concepts.", [
    question("robot-intro-1", "What is a ROS 2 node?", ["A participant in the ROS graph that performs computation", "A physical battery cell", "A type of wheel", "Only a cloud database"], "A participant in the ROS graph that performs computation", "ROS 2 nodes are participants in the ROS graph and are typically organized to perform one logical task.", sources.rosNodes),
    question("robot-intro-2", "Which ROS 2 interface best fits a continuous stream of sensor readings?", ["Topic", "Service", "Action", "Password"], "Topic", "ROS 2 topics provide asynchronous publish-subscribe communication for continuous data streams such as sensor data.", sources.rosInterfaces),
    question("robot-intro-3", "Why divide a robot application into multiple nodes?", ["To separate logical responsibilities into modular units", "To remove all communication", "To guarantee zero failures", "To avoid using sensors"], "To separate logical responsibilities into modular units", "ROS recommends that each node perform one logical function, supporting modular system design.", sources.rosNodes),
  ]),
  quiz("robotics-fundamentals", "electronics-basics", "Electronics basics checkpoint", "Check digital, analog, and board-level input/output concepts.", [
    question("robot-electronics-1", "How many digital input/output pins are documented for the Arduino UNO R3?", ["6", "8", "12", "14"], "14", "The UNO R3 documentation specifies 14 digital input/output pins.", sources.arduinoUno),
    question("robot-electronics-2", "What does an Arduino digital input interpret?", ["A HIGH or LOW logic state", "An unlimited continuous voltage value", "A domain name", "A motor speed by itself"], "A HIGH or LOW logic state", "Digital pins read logic states represented as HIGH or LOW according to the board's electrical thresholds.", sources.arduinoDigital),
    question("robot-electronics-3", "What converts an analog input voltage into a numeric reading on a microcontroller?", ["Analog-to-digital converter", "DNS resolver", "Firewall", "Mechanical gearbox"], "Analog-to-digital converter", "The microcontroller's analog-to-digital converter samples an input voltage and represents it as a numeric value.", sources.arduinoAnalog),
  ]),
  quiz("robotics-fundamentals", "microcontrollers", "Microcontroller checkpoint", "Review the documented capabilities of the Arduino UNO R3 and ATmega328P.", [
    question("robot-mcu-1", "Which microcontroller is used by the classic Arduino UNO R3?", ["ATmega328P", "ESP32-S3", "RP2040", "STM32H7"], "ATmega328P", "The Arduino UNO R3 is based on the ATmega328P microcontroller.", sources.arduinoUno),
    question("robot-mcu-2", "What is the documented clock speed of the Arduino UNO R3?", ["1 MHz", "8 MHz", "16 MHz", "120 MHz"], "16 MHz", "Arduino documents a 16 MHz ceramic resonator for the UNO R3.", sources.arduinoUno),
    question("robot-mcu-3", "Which UNO R3 memory retains stored data when power is removed?", ["EEPROM", "SRAM only", "CPU registers", "PWM output"], "EEPROM", "The ATmega328P on the UNO R3 includes EEPROM, which is non-volatile memory.", sources.arduinoUno),
  ]),
  quiz("robotics-fundamentals", "motion-control", "Motion and control checkpoint", "Review PWM output and feedback-oriented robot control.", [
    question("robot-motion-1", "What does changing PWM duty cycle change?", ["The proportion of each cycle the output is active", "The number of microcontroller pins", "The network address", "The sensor's physical location"], "The proportion of each cycle the output is active", "PWM controls the fraction of each repeating period for which the output signal is active.", sources.arduinoPwm),
    question("robot-motion-2", "How many UNO R3 digital pins are documented as PWM-capable?", ["2", "4", "6", "14"], "6", "The UNO R3 provides six digital pins that can be used as PWM outputs.", sources.arduinoUno),
    question("robot-motion-3", "Which ROS 2 interface is most suitable for a long-running movement that needs feedback and cancellation?", ["Action", "Topic only", "Service only", "Parameter"], "Action", "ROS 2 actions support long-running tasks with feedback, a result, and cancellation.", sources.rosInterfaces),
  ]),
  quiz("robotics-fundamentals", "smart-robotics-iot", "Smart robotics checkpoint", "Check communication patterns for connected and autonomous robots.", [
    question("robot-smart-1", "Which ROS 2 pattern allows multiple subscribers to receive an ongoing telemetry stream?", ["Topic publish-subscribe", "Service request-response", "Action result only", "Local password storage"], "Topic publish-subscribe", "Topics support asynchronous streams and can connect multiple publishers and subscribers.", sources.rosInterfaces),
    question("robot-smart-2", "Which ROS 2 interface best fits a quick request that needs one response?", ["Service", "Topic", "Action", "Sensor pin"], "Service", "Services implement synchronous request-response communication for short operations.", sources.rosInterfaces),
    question("robot-smart-3", "Which ROS 2 interface should control a task that takes time and must report progress?", ["Action", "Service", "Static parameter", "Digital input"], "Action", "Actions are designed for long-running work with feedback, results, and cancellation.", sources.rosInterfaces),
  ]),
];

export function getModuleQuiz(courseSlug: string, moduleId: string) {
  return moduleQuizzes.find((item) => item.courseSlug === courseSlug && item.moduleId === moduleId);
}
