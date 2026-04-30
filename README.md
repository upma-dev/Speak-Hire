# 🚀 Speak-Hire - Revolutionize Hiring with AI Interviews!

![Hero Preview](public/ai.png)

> **AI-Powered Interviews • Zero Hassle Hiring • Instant Insights**

[![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwind)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-DB%2BAuth-3FCF99?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000?style=for-the-badge&logo=vercel)](https://vercel.com)

## 🎯 **What is Speak-Hire?**

**Speak-Hire** is your **all-in-one AI interview platform** that transforms traditional hiring into a seamless, insightful experience. 

**For Recruiters:**
- Create AI interviews in 30 seconds
- Get eye-tracking, voice analysis, candidate ranking
- Share one link - no scheduling hassles
- Instant AI feedback scores

**For Candidates:**
- Join via link (no account needed)
- Natural voice conversation with AI interviewer
- Real-time performance tracking
- Complete in your preferred time

## ✨ **Why Choose Speak-Hire?** (Creative Edge)

```
Traditional Interviews    →   Speak-Hire AI
30 mins scheduling       →   Instant link sharing
Manual note-taking       →   AI sentiment analysis  
Biased human judgment    →   Objective eye-tracking
Missed subtle cues       →   ML-powered insights
Hours of review          →   Instant candidate ranking
```

## 🚀 **Live Demo** 
🌐 **[https://speak-hire.vercel.app/](https://speak-hire.vercel.app/)** *(Production Live!)*

## 🔥 **Live Demo Features**

| Feature | Status | Cool Factor |
|---------|--------|-------------|
| 👁️ **Eye Contact Tracking** | ✅

## 🛠️ **One-Click Setup** (Normal User Friendly)

```bash
# Clone & Install
npx create-next-app@15 my-speak-hire --example https://github.com/upma-dev/Speak-Hire
cd my-speak-hire
npm install

# 1. Supabase (5 mins)
# supabase.com → New Project → Copy URL + Anon Key

# 2. Copy .env.local
cp .env.example .env.local
# Add your Supabase URL/Key

# 3. Run!
npm run dev
# Open http://localhost:3000 ✨
```

### .env.local Template
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_HOST_URL=http://localhost:3000
```

## 🏗️ **Architecture Magic** (Impress Interviewers)

```
Frontend (Next.js 15 App Router)
├── Glassmorphism UI + Framer Motion animations
├── Shadcn UI + Custom components
└── Turbopack dev server (blazing fast!)

Backend (Supabase)
├── Auth (Google OAuth)
├── Storage (profile pics, ML models)
├── Realtime (interview status)
└── Edge Functions ready

AI/ML Pipeline
├── Vapi.ai → Voice conversation
├── MediaPipe → Face/eye tracking  
├── Custom scoring → Candidate ranking

Payments
├── Stripe Checkout
├── Razorpay India
└── Credit system
```

## 🎨 **Design Excellence**

**Theme:** *Cosmic Dark* (`#0B0F19` → `#1E293B`)
- **Glass Cards** - Backdrop blur + white/10 borders
- **Magnetic Buttons** - Interactive hover physics
- **Spotlight Effects** - Dynamic lighting animations
- **Gradient Flows** - Purple-blue themes

**Creativity Highlights:**
```
1. Custom Cursor Glow ✨
2. Moving Gradient Backgrounds 🌈
3. Voice Wave Visualization 🔊 
4. Eye Tracking Live Overlay 👁️
5. AI Feedback Cards with Ranking 🏆
6. Skeleton Loaders (New!) ⚡
```

## 🚀 **Production Ready**

```
✅ TypeScript + ESLint
✅ SEO Meta (dynamic titles)
✅ PWA Ready (manifest)
✅ Internationalization ready
✅ A/B Testing (analytics.js)
✅ Error boundaries
✅ Loading optimization (Suspense)
```

## 📊 **Database Schema** (Clean & Scalable)

```sql
Users: id, email, name, picture, plan, credits
Interviews: id, interview_id, jobPosition, duration, type
Feedback: interview_id → JSON insights (sentiment, gaze, score)
```

## 🎮 **User Journey** (Wow Factor)

```
1. Recruiter Login (Google 1-click)  
2. "Create Interview" → Auto-generate link
3. Share link → Candidate joins instantly
4. AI Interview (10 mins) → Live tracking
5. Instant Feedback → Ranking + insights
6. Dashboard → All interviews analytics
```

## 🧪 **Recent BlackboxAI Enhancements**

```
🔧 Fixed Next/Image Supabase hosting error
🗑️ Removed privacy-concern avatar from dashboard
⚡ Added smooth loading skeletons (4 pages)
📱 Enhanced mobile sidebar UX
📖 This impressive README!
```

## 🌟 **Demo Video Script**
```
\"Watch how Speak-Hire transforms hiring:
- 30s interview creation
- Live eye-tracking analysis
- AI voice conversation
- Instant candidate ranking
No more scheduling nightmares!\"
```

## 🤝 **Contribute Like a Pro**

```bash
git checkout -b feature/cool-idea
npm run lint-fix
npm test
git push && gh pr create
```

## 📞 **Get Started Today!**

⭐ **Star this repo**    
💬 **Issues/PRs welcome**

**Built with ❤️ by upma-dev**

---

> *From 100 resumes → 1 perfect hire. AI does the heavy lifting.*
