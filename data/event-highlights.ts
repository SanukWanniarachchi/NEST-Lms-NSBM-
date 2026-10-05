import schoolGroup from "@/public/images/events/bsc-iot-workshop/group.webp";
import schoolActivity01 from "@/public/images/events/bsc-iot-workshop/activity-01.webp";
import schoolActivity02 from "@/public/images/events/bsc-iot-workshop/activity-02.webp";
import schoolActivity03 from "@/public/images/events/bsc-iot-workshop/activity-03.webp";
import schoolActivity04 from "@/public/images/events/bsc-iot-workshop/activity-04.webp";
import schoolActivity05 from "@/public/images/events/bsc-iot-workshop/activity-05.webp";
import openDay01 from "@/public/images/events/open-day/presentation-01.webp";
import openDay02 from "@/public/images/events/open-day/presentation-02.webp";
import openDayTeam from "@/public/images/events/open-day/team.webp";
import openDayPortrait01 from "@/public/images/events/open-day/portrait-01.webp";
import openDayPortrait02 from "@/public/images/events/open-day/portrait-02.webp";
import openDayPortrait03 from "@/public/images/events/open-day/portrait-03.webp";
import openDayPortrait04 from "@/public/images/events/open-day/portrait-04.webp";
import openDayPortrait05 from "@/public/images/events/open-day/portrait-05.webp";

// The supplied photos identify these events, but do not confirm event dates.
// Keep this local photo collection separate from the admin-published dated notices.
export const eventHighlights = [
  {
    id: "bsc-college-iot-workshop",
    title: "BSC College IoT workshop for Grade 6 students",
    category: "Workshop",
    summary: "NEST at BSC College for an IoT workshop with Grade 6 students. A look at the school activities and the people learning together.",
    photos: [
      { image: schoolGroup, alt: "NEST members in white NSBM shirts at the BSC College IoT workshop" },
      { image: schoolActivity01, alt: "A NEST member helping students with a school workshop activity" },
      { image: schoolActivity02, alt: "Students gathering around an activity during the Grade 6 IoT workshop" },
      { image: schoolActivity03, alt: "NEST members working alongside students in the school classroom" },
      { image: schoolActivity04, alt: "A classroom session during the BSC College IoT workshop" },
      { image: schoolActivity05, alt: "NEST members and students together inside the school classroom" },
    ],
  },
  {
    id: "nsbm-open-day",
    title: "NEST at NSBM Open Day 2026",
    category: "Event",
    summary: "Club members at NSBM Open Day, sharing ideas through computing and sustainable technology displays.",
    photos: [
      { image: openDay01, alt: "A NEST member presenting a computing display at NSBM Open Day" },
      { image: openDay02, alt: "A NEST member beside the computing and renewable energy displays at Open Day" },
      { image: openDayTeam, alt: "Two NEST members together at NSBM Open Day" },
      { image: openDayPortrait01, alt: "A club member in a black blazer standing in front of the Open Day billboards" },
      { image: openDayPortrait02, alt: "A club member beside the computing and renewable energy billboards" },
      { image: openDayPortrait03, alt: "A club member in a black blazer beside the sustainable energy billboard" },
      { image: openDayPortrait04, alt: "A club member wearing glasses and an Open Day volunteer lanyard in front of the computing billboard" },
      { image: openDayPortrait05, alt: "A club member in a black blazer and white shirt standing in front of the Open Day displays" },
    ],
  },
];
