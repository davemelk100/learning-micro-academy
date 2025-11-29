# Fork Notes

This repository was forked from `soulchi-design-demo` and transformed into Learning Micro-Academy.

## Changes Made

### Branding
- All SOULCHI references replaced with "Learning Micro-Academy"
- Updated app identifiers and package names
- Updated mobile app configurations (iOS and Android)

### Content Transformation
- **Virtues → Courses**: Transformed virtue/pillar cards into course modules
  - Examples: Intro to UX, Design Systems, Energy Efficiency at Home, etc.
- **SDGs → Learning Topics**: Changed SDG selection to Learning Topics selection
- **Featured Course**: Replaced "Virtue of the Week" with "Featured Course"

### UI Updates
- Welcome screen now includes sign-up CTAs for:
  - Cohort membership
  - Newsletter subscription
  - Course library access (local implementation)
- Built-in course library with full course content and lessons
- Updated all UI text to use learning/course terminology

### Technical Changes
- Updated storage keys (`learning-micro-academy-user-state`)
- Updated package identifiers for mobile apps
- Updated interface names (e.g., `HelpButtonProps`)

## Repository Setup

This is now an independent repository. To connect it to GitHub:

1. Create a new repository on GitHub (e.g., `learning-micro-academy`)

2. Add the remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/learning-micro-academy.git
```

3. Push the code:
```bash
git branch -M main
git push -u origin main
```

## Original Repository

Original repository: `soulchi-design-demo`
Original branch: `learning-micro-academy` (created with these changes)

