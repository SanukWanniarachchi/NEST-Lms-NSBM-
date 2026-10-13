# Local photo preview

Source folder: `C:\Users\Lenovo\Desktop\NEST Photos - Chaturya NSBM`.
Original downloads and the extracted CV photo remain unchanged there.

## Team portrait mapping

The filenames below are WhatsApp Image 2026-10-05 at the listed time.
Names and board positions have not been inferred from appearance or ordering.

| Site asset | Original JPEG time |
| --- | --- |
| member-01.webp | 14.54.52 (1) |
| member-02.webp | 14.54.52 |
| member-03.webp | 14.54.58 |
| member-04.webp | 14.54.59 (1) |
| member-05.webp | 14.54.59 (2) |
| member-06.webp | 14.54.59 |
| member-07.webp | 14.55.00 |
| member-08.webp | 11.21.57, Open Day portrait |
| sanuk-wanniarachchi-standing.webp | Originals/Sanuk-CV-portrait.png |

The built-in imagegen tool produced each portrait separately with transparent
alpha. The eight supplied portraits use this prompt set:

> Remove only the background; preserve the person's exact face, identity,
> hairstyle, expression, skin texture, body proportions, clothing, accessories,
> and original lighting. No beautification, retouching, pose changes, added
> clothing, text, or shadows. Frame head through waist, retaining the complete
> head and shoulders and natural hair edges. Output actual transparency.

Sanuk's CV portrait uses this prompt set:

> Preserve the exact face, hairstyle, expression, skin texture, age, and identity.
> Add a realistic dark suit jacket over the existing white shirt and burgundy
> tie. Keep the original natural lighting, complete head and shoulders, and a
> standing head-to-mid-thigh portrait, complete blazer torso, natural hands and
> dark trousers. Extend the missing body with realistic anatomy and proportions.
> Remove the grey backdrop and output transparency.
> No beautification, skin smoothing, text, props, logos, or background shadow.

Generated PNGs remain in the Codex generated-images folder. The site consumes
WebP copies under `public/images/team/`, with alpha retained. These are edited
previews that should be reviewed against the originals before publication.

## Event photos

- D.S. Senanayake College IoT workshop for Grade 6 students: six white-NSBM-shirt school
  photos, 11.07.36 through 11.07.46. Assets: `public/images/events/bsc-iot-workshop/`.
- NSBM Open Day 2026: all eight billboard/event photos at 11.16.33, 11.16.44,
  11.16.45, 11.16.46, 11.16.51 (without suffix), 11.16.52, 11.16.53 and 11.21.57.
  This includes both presentations, portraits in front of the displays, and the
  selfie with two girls, one wearing red. Assets: `public/images/events/open-day/`.
- The 11.16.51 (1) outdoor portrait belongs to About, rather than the Open Day
  gallery. Its separate portrait copy is 14.54.59 (2).
- The separate indoor workshop set, 11.07.52 through 11.07.56, is held aside
  pending the user's identification of the event.

Event scenes are preserved. Their dates are unconfirmed; download timestamps
are not represented as event dates. Photo highlights are maintained separately
from the dated admin-published announcement snapshot, preserving its import
contract. The gallery uses native details/summary controls and static image
imports so it works in the public static export and with deployment base paths.

## October 2026 additions

- The owner supplied `WhatsApp Image 2026-10-13 at 10.14.19.jpeg` and confirmed
  it depicts Mr. Supun Gajendrasinghe, the Master-in-Charge. Its WebP copy is
  `public/images/team/supun-gajendrasinghe.webp` (720 × 626). The original
  circular photograph is retained without generating or altering facial details.
- The owner supplied `WhatsApp Image 2026-10-13 at 10.19.30.jpeg` for the
  Game Development Workshop. Its full, uncropped WebP copy is
  `public/images/events/game-development-workshop/coming-soon.webp` (844 × 1055).
  Date, venue, tools, and registration remain unconfirmed. The poster's visual
  theme does not establish the workshop engine.
- The owner corrected the school name to D.S. Senanayake College. Existing
  school photo paths remain stable; the public gallery ID is `school-iot-workshop`.
- Event galleries and notices now appear together under `/news/`.
