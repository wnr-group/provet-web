import { Sparkles, ShieldCheck, FlaskConical, Headset, Truck, HeartPulse, Handshake, Leaf, TrendingUp, Factory, Globe2, Microscope, Award, Users } from "lucide-react";

// The icon for a bullet point on a content page, chosen from the words in its
// text so each point gets one that fits it ("Quality Conscience" a shield,
// "Innovative Formulations" a flask). Points matching nothing here fall back
// to a spark, so a point the admin adds later still gets an icon.
const RULES = [
  [/quality|conscience|standard|certif|complian|safe|assur/i, ShieldCheck],
  [/formulat|innovat|research|r&d|laborator|\blab\b|science|develop/i, FlaskConical],
  [/technical|support|service|advice|advis|consult|help/i, Headset],
  [/supply|deliver|logistic|distribut|availab|stock/i, Truck],
  [/health|animal|vet|care|welfare/i, HeartPulse],
  [/customer|partner|trust|relationship|client/i, Handshake],
  [/natural|organic|herbal|eco|sustain|green/i, Leaf],
  [/growth|perform|result|product(iv|ion)|yield|efficien/i, TrendingUp],
  [/manufactur|plant|facilit|production/i, Factory],
  [/global|export|worldwide|international|nation/i, Globe2],
  [/test|trial|analys|diagnos/i, Microscope],
  [/award|best|leader|excellen|expert/i, Award],
  [/team|people|staff|experience/i, Users],
];

export default function PointIcon({ text, size = 24, className }) {
  const Icon = RULES.find(([re]) => re.test(text))?.[1] || Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
