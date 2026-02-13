/**
 * Pexels image manifest — contextual placement
 * 42 unique images. No repeats.
 */

export const PEXELS_IMAGES = {
  background: [
    "/assets/pexels/pexels_26.jpeg",
    "/assets/pexels/pexels_30.jpeg",
  ],
  /** Agent headset/phone — Live Transfers dashboard card + transfers page */
  transfers: [
    { src: "/assets/pexels/pexels_0.jpeg", alt: "Call center agent with headset on phone" },
    { src: "/assets/pexels/pexels_1.jpeg", alt: "Professional adjusting headset for call" },
    { src: "/assets/pexels/pexels_3.jpeg", alt: "Call center agent wearing headset at work" },
    { src: "/assets/pexels/pexels_7.jpeg", alt: "Customer support agent with headset on laptop" },
    { src: "/assets/pexels/pexels_8.jpeg", alt: "Call center agent with headset" },
  ],
  /** Doctor/healthcare — Certification course (no overlap with background) */
  certification: [
    { src: "/assets/pexels/pexels_27.jpeg", alt: "Doctor consulting patient in medical office" },
    { src: "/assets/pexels/pexels_28.jpeg", alt: "Doctor at desk in modern office" },
    { src: "/assets/pexels/pexels_29.jpeg", alt: "Doctor in office for telemedicine" },
    { src: "/assets/pexels/pexels_31.jpeg", alt: "Doctor at desk in office" },
    { src: "/assets/pexels/pexels_32.jpeg", alt: "Doctor with medical equipment" },
    { src: "/assets/pexels/pexels_34.jpeg", alt: "Medical stethoscope and laptop" },
  ],
  /** Agent/senior meetings — Missions, plans */
  agentSenior: [
    { src: "/assets/pexels/pexels_17.jpeg", alt: "Agent and clients discussing paperwork" },
    { src: "/assets/pexels/pexels_19.jpeg", alt: "Adults discussing insurance policy" },
    { src: "/assets/pexels/pexels_25.jpeg", alt: "Senior couple on video call" },
  ],
  missions: {
    basics: { src: "/assets/pexels/pexels_33.jpeg", alt: "Doctor in white coat" },
    plans: { src: "/assets/pexels/pexels_17.jpeg", alt: "Agent discussing paperwork with clients" },
    compliance: { src: "/assets/pexels/pexels_14.jpeg", alt: "Professional with insurance policy" },
  },
  trivia: { src: "/assets/pexels/pexels_38.jpeg", alt: "Doctor conducting medical consultation" },
} as const;

export const WOODEN_BACKGROUNDS = PEXELS_IMAGES.background;
