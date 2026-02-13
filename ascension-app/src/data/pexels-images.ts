/**
 * Pexels image manifest — contextual placement
 * Use: certification (doctor/healthcare), transfers (agent/senior), dashboard, etc.
 */

export const PEXELS_IMAGES = {
  background: [
    "/assets/pexels/pexels_12.jpeg",
    "/assets/pexels/pexels_13.jpeg",
  ],
  certification: [
    { src: "/assets/pexels/pexels_0.jpeg", alt: "Medical stethoscope and laptop" },
    { src: "/assets/pexels/pexels_1.jpeg", alt: "Doctor at desk with laptop" },
    { src: "/assets/pexels/pexels_4.jpeg", alt: "Doctor reviewing patient records" },
    { src: "/assets/pexels/pexels_5.jpeg", alt: "Doctor at office desk" },
  ],
  transfers: [
    { src: "/assets/pexels/pexels_2.jpeg", alt: "Senior on video call with agent" },
    { src: "/assets/pexels/pexels_3.jpeg", alt: "Agent discussing documents with senior couple" },
    { src: "/assets/pexels/pexels_7.jpeg", alt: "Senior couple consulting with agent" },
  ],
  missions: {
    basics: { src: "/assets/pexels/pexels_5.jpeg", alt: "Doctor at office" },
    plans: { src: "/assets/pexels/pexels_3.jpeg", alt: "Agent with senior couple" },
    compliance: { src: "/assets/pexels/pexels_8.jpeg", alt: "Medical professional" },
  },
  trivia: { src: "/assets/pexels/pexels_9.jpeg", alt: "Doctor ready for consultation" },
} as const;

export const WOODEN_BACKGROUNDS = PEXELS_IMAGES.background;
