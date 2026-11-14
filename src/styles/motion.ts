import type { Transition } from 'motion/react';

export const iosSpringExpand: Transition = {
  type: 'spring',
  stiffness: 330,
  damping: 32,
  mass: 0.85,
};

export const iosSpringSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 28,
  mass: 0.7,
};

export const iosSpringBubble: Transition = {
  type: 'spring',
  stiffness: 290,
  damping: 24,
  mass: 0.8,
};

export const iosSpringModal: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};
