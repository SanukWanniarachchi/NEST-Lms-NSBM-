const text = { type: "string" };
const number = { type: "number" };
const boolean = { type: "boolean" };
const list = (item, min = 0) => ({ type: "array", item, min });
const choice = (...values) => ({ type: "string", values });
const object = (fields, optional = []) => ({ type: "object", fields, optional });
const lesson = object({
  slug: text, title: text, duration: text, description: text, learningObjective: text,
  keyPoints: list(text, 1), activity: text, recap: text, youtubeUrl: text,
  videoDuration: text, videoOrientation: choice("landscape", "portrait"), completed: boolean,
}, ["youtubeUrl", "videoDuration", "videoOrientation", "completed"]);
const course = object({
  slug: text, title: text, shortTitle: text, category: choice("Cybersecurity", "Networking", "Robotics"),
  eyebrow: text, description: text, longDescription: text, level: choice("Beginner", "Beginner to intermediate"),
  duration: text, lessonCount: number, imageKey: choice("cybersecurity", "networking", "robotics"),
  imageAlt: text, accent: choice("violet", "cyan", "amber"),
  instructor: object({ name: text, role: text, initials: text, bio: text }),
  outcomes: list(text, 1), modules: list(object({ id: text, title: text, description: text, lessons: list(lesson, 1) }), 1),
  progress: number,
});
const schema = object({
  version: number, generatedAt: text, courses: list(course, 1),
  announcements: list(object({
    title: text, date: text, category: choice("Event", "Research", "Workshop", "Community", "Notice"),
    summary: text, actionLabel: text, actionHref: text, featured: boolean,
  }, ["actionLabel", "actionHref", "featured"])),
});

function validate(value, shape, path) {
  if (shape.type === "array") {
    if (!Array.isArray(value) || value.length < shape.min) throw new Error(`${path}: expected an array with at least ${shape.min} entries.`);
    value.forEach((item, index) => validate(item, shape.item, `${path}[${index}]`));
  } else if (shape.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path}: expected an object.`);
    for (const key of Object.keys(value)) if (!Object.hasOwn(shape.fields, key)) throw new Error(`${path}.${key}: field is not approved for public export.`);
    for (const [key, field] of Object.entries(shape.fields)) {
      if (value[key] === undefined && shape.optional.includes(key)) continue;
      validate(value[key], field, `${path}.${key}`);
    }
  } else {
    if (typeof value !== shape.type || (shape.type === "number" && !Number.isFinite(value))) throw new Error(`${path}: expected ${shape.type}.`);
    if (shape.values && !shape.values.includes(value)) throw new Error(`${path}: unsupported value.`);
    if (shape.type === "string" && !value.trim() && !path.endsWith(".actionLabel") && !path.endsWith(".actionHref")) throw new Error(`${path}: text cannot be empty.`);
  }
}

function unique(values, path) {
  if (new Set(values).size !== values.length) throw new Error(`${path}: duplicate route identifiers.`);
  for (const value of values) if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error(`${path}: invalid route identifier.`);
}

export function validatePublishedContent(snapshot) {
  validate(snapshot, schema, "snapshot");
  if (snapshot.version !== 1) throw new Error("Unsupported published snapshot version.");
  if (!Number.isFinite(Date.parse(snapshot.generatedAt))) throw new Error("Invalid snapshot generation timestamp.");
  unique(snapshot.courses.map(item => item.slug), "courses");
  for (const item of snapshot.courses) {
    unique(item.modules.map(module => module.id), `${item.slug}.modules`);
    const lessons = item.modules.flatMap(module => module.lessons);
    unique(lessons.map(entry => entry.slug), `${item.slug}.lessons`);
    if (item.lessonCount !== lessons.length) throw new Error(`${item.slug}: incorrect lesson count.`);
    if (item.progress !== 0 || lessons.some(entry => entry.completed)) throw new Error(`${item.slug}: learner progress is not public curriculum data.`);
    for (const entry of lessons) {
      if (!entry.youtubeUrl && (entry.videoDuration || entry.videoOrientation)) throw new Error(`${entry.slug}: video details need a video URL.`);
      if (entry.youtubeUrl) {
        const url = new URL(entry.youtubeUrl);
        const host = url.hostname.replace(/^www\./, "");
        const segments = url.pathname.split("/").filter(Boolean);
        const videoId = host === "youtu.be" ? segments[0] : url.pathname === "/watch" ? url.searchParams.get("v") : ["embed", "shorts", "live"].includes(segments[0]) ? segments[1] : null;
        if (!["http:", "https:"].includes(url.protocol) || !["youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host) || !/^[A-Za-z0-9_-]{11}$/.test(videoId ?? "")) throw new Error(`${entry.slug}: unsupported video URL.`);
      }
    }
  }
  for (const item of snapshot.announcements) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || new Date(item.date).toISOString().slice(0, 10) !== item.date) throw new Error("Invalid announcement date.");
    if (Boolean(item.actionLabel) !== Boolean(item.actionHref)) throw new Error("Announcement actions need both a label and destination.");
    if (item.actionHref && !/^\/(?!\/)/.test(item.actionHref)) {
      if (!["https:", "http:"].includes(new URL(item.actionHref).protocol)) throw new Error("Unsupported announcement destination.");
    }
  }
  return snapshot;
}
