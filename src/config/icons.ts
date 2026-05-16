import {
  Sparkles,
  Star,
  Moon,
  Sprout,
  Leaf,
  Link,
  Mask,
  RefreshCw,
  Lightbulb,
  Music,
  Palette,
  Compass,
  Bot,
  Bird,
  Tent,
} from 'lucide-react';

export const IconMap = {
  // mood icons
  '✨': Sparkles,
  '🌟': Star,
  '✦': Sparkles,
  '🌙': Moon,
  '🌱': Sprout,
  '🌿': Sprout,
  '🍂': Leaf,

  // panel icons
  '🎭': Mask,
  '🎪': Tent,
  '🔗': Link,
  '🔄': RefreshCw,
  '💡': Lightbulb,

  // content icons
  '🎵': Music,
  '🎨': Palette,

  // personality icons
  '🦉': Bird,
  '🧭': Compass,
  '🤖': Bot,
} as const;

export type IconName = keyof typeof IconMap;
