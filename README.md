# K-8M: 8개월 한국어 말하기 연습

A production-ready, local-first PWA for Korean speaking practice. Designed for shy learners who freeze when speaking, with a focus on building consistent habits over 8 months.

## 🎯 Core Philosophy

- **No decision fatigue**: One "시작" button to begin your daily practice
- **No free-form creation** (Phase 1): First 8 weeks focus on memorization only
- **Behavior system, not content library**: Track consistency, not just content consumption
- **Anti-avoidance design**: Floating rescue button, skip options without guilt

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon in the address bar
3. Confirm installation

### iOS Safari
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android Chrome
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Dexie (IndexedDB wrapper) - all data stored locally
- **Audio**: HTMLAudioElement + Media Session API
- **PWA**: Custom service worker with offline support

## 📂 Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Main page with tab navigation
│   └── globals.css     # Global styles
├── components/
│   ├── tabs/           # Tab components
│   │   ├── TodayTab.tsx
│   │   ├── SentencesTab.tsx
│   │   ├── ListeningTab.tsx
│   │   ├── PartnerTab.tsx
│   │   ├── ProgressTab.tsx
│   │   └── SettingsTab.tsx
│   ├── session/        # Session flow components
│   │   ├── ListeningBlock.tsx
│   │   ├── SpeakingBlock.tsx
│   │   ├── PartnerBlock.tsx
│   │   └── FrictionRating.tsx
│   ├── TabNav.tsx
│   └── RescueButton.tsx
├── data/               # Seed data
│   ├── sentences.ts    # 30 foundation sentences
│   ├── partnerScripts.ts
│   └── program.ts
├── hooks/              # Custom React hooks
│   ├── useAudioPlayer.ts
│   └── useTimer.ts
├── lib/                # Core logic
│   ├── db.ts          # Dexie database
│   ├── types.ts       # TypeScript types
│   ├── scheduling.ts  # Sentence selection logic
│   └── context.tsx    # React context
└── test/
    ├── setup.ts
    └── scheduling.test.ts
```

## 🎮 App Flow

### Daily Session (시작 button)

1. **듣기 (Listening)** - 10 minutes
   - Play current episode on loop
   - Optional shadowing mode
   - Running mode for big controls

2. **말하기 (Speaking)** - 5 sentences
   - Step 1: Listen (TTS)
   - Step 2: Repeat after
   - Step 3: Recall from memory
   - Rate: 쉬움/보통/어려움

3. **파트너 (Partner)** - 5 minutes (optional)
   - Practice with Korean partner
   - Script cards for guided conversation
   - Big "스킵" button (no guilt)

## 📊 Scheduling Logic

Simplified spaced repetition (not full SM-2):

**Mastery States**: NEW → WARM → HOT → SOLID

**Daily Selection**: 3 from NEW/WARM + 2 from HOT/SOLID

**Rating Effects**:
- 쉬움 (Easy): Move forward one state
- 보통 (Normal): Stay same
- 어려움 (Hard): Move back one state

**Pin Rule**: If rated "어려움" 2+ times in 7 days, sentence is pinned for tomorrow.

## 📅 8-Week Program

| Week | Focus | Content |
|------|-------|---------|
| 1-2 | Foundation | 30 basic sentences |
| 3-4 | Partner Intro | + 식사/날씨 scripts |
| 5-6 | Work/Weekend | + 일/주말 scripts |
| 7-8 | Integration | Full practice |

## 💾 Data & Backup

All data is stored locally in IndexedDB. No account required.

### Export/Import
1. Go to 진행 (Progress) tab
2. Click 📤 내보내기 to download JSON backup
3. Click 📥 가져오기 to restore from backup

### Data Stored
- Sentence mastery states
- Review history
- Episode list and metadata
- Daily completion logs
- Settings

## ⚙️ Settings

| Setting | Default | Options |
|---------|---------|---------|
| Daily time budget | 20 min | 10/15/20/30 |
| Episode lock days | 3 | 1/3/5/7 |
| Phase 1 lock | ON | Toggle |
| Speech recognition | OFF | Toggle (beta) |
| Notifications | OFF | Toggle + time |

## 📱 iOS Limitations

Due to iOS Safari restrictions:

1. **Audio autoplay**: User must interact first before audio plays
2. **Background audio**: May pause when screen locks
3. **Push notifications**: Not supported in PWA mode
4. **IndexedDB**: Data may be cleared after 7 days of inactivity (iOS 13.4+)

### Recommendations for iOS
- Keep the app open while practicing
- Regularly export backups
- Add to Home Screen for best experience

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests once
npm run test:run
```

Tests cover:
- Mastery state transitions
- Pin for tomorrow rule
- Review logging

## 🔒 Privacy

- No data sent to servers
- Everything stored locally
- No analytics or tracking
- No login required

## 📝 Assumptions & Decisions

1. **French translations**: User is learning Korean with French as L1
2. **No romanization**: User can read Hangeul
3. **TTS**: Uses Web Speech API (Korean voice availability varies by device)
4. **Audio files**: Stored in IndexedDB (limited by browser storage quota)
5. **Notifications**: Uses browser Notification API where supported

## 🤝 Contributing

This is a personal learning tool, but improvements are welcome:
- Bug fixes
- Accessibility improvements
- Additional content seeds
- iOS workarounds

## 📄 License

MIT License - Feel free to fork and customize for your own learning journey!

---

화이팅! 🇰🇷
