# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + @use-gesture/react + Zustand (delegated & confirmed for MVP UI Prototype).

## Users

Mobile users placing their smartphone horizontally on a desk as a 21:9 Smart AI StandBy Clock & Focus Assistant.

## Product Purpose

An interactive MVP UI prototype demonstrating an iOS 27 Liquid Glass 21:9 horizontal smart clock with 3 equal interactive tiles (Clock/Alarm/White Noise, Rotary Countdown/Voice Recorder, Todo Hub/AI Focus & Wellness toggles) and a floating edge-snapping AI Agent bubble.

## Operating Context

Designed strictly for mobile landscape (portrait orientation is blocked via OrientationGuard), optimized for touch, pinch-to-zoom, double-tap tile expansion, and rotary circular dial gestures.

## Capabilities and Constraints

- MVP prototype: real-time clock, analog sweeping hands, multi-turn rotary countdown timer (±1h per full rotation), pinch/double-tap tile expansion, edge-snapping AI bubble, and local state management for todos & simulated recordings/AI alerts.
- Lock button is intentionally kept as an inactive UI placeholder per user instruction.
- Focus Camera (AI distraction alert) and Health Heart-Pulse (AI stand-up/wellness reminder) work as interactive toggle states with simulated alert banners in this MVP; full hardware/AI implementation roadmap is archived in `docs/FULL_ARCHITECTURE_ROADMAP.md`.
