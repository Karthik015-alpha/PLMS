'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Terminal, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  LineChart, 
  Lock, 
  Zap, 
  ArrowRight, 
  Check, 
  Flame, 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  Calendar, 
  ChevronRight, 
  Menu, 
  X, 
  Code, 
  Activity 
} from 'lucide-react';

// Custom Type Definitions for state
interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  // Mobile Nav Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interaction State - Checklist in Hero Mockup
  const [heroTasks, setHeroTasks] = useState<Task[]>([
    { id: 1, text: 'Review Data Structures', done: true },
    { id: 2, text: 'Write Markdown notes for OS', done: false },
    { id: 3, text: 'Complete 2 hour study block', done: false },
  ]);

  const toggleHeroTask = (id: number) => {
    setHeroTasks(
      heroTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Interaction State - Pomodoro Timer in Dashboard Showcase
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25:00
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(1500);
  };

  // Interaction State - Notes Preview Tab in Showcase
  const [noteTab, setNoteTab] = useState<'editor' | 'preview'>('preview');
  const markdownText = `# System Design Notes
## Database Sharding
Sharding is a method for distributing a single dataset across multiple databases.

\`\`\`typescript
interface ShardManager {
  hashKey(key: string): number;
  getTargetDb(key: string): Database;
}
\`\`\`
- [x] Understand horizontal scaling
- [ ] Implement consistent hashing`;

  // Animated numbers simulator (incrementing on load)
  const [stats, setStats] = useState({
    topics: 0,
    productivity: 0,
    streak: 0,
    notes: 0,
  });

  useEffect(() => {
    const duration = 1500; // ms
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setStats({
        topics: Math.min(Math.round((120 / steps) * currentStep), 120),
        productivity: Math.min(Math.round((95 / steps) * currentStep), 95),
        streak: Math.min(Math.round((30 / steps) * currentStep), 30),
        notes: Math.min(Math.round((500 / steps) * currentStep), 500),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-neutral-100 font-sans antialiased relative overflow-x-hidden select-none">
      
      {/* Background Grids, Lighting, and Blur Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] pointer-events-none z-0" />
      
      {/* Glowing Neon Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00ff9d] opacity-[0.03] blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00c8ff] opacity-[0.03] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[10%] w-[45%] h-[45%] rounded-full bg-emerald-500 opacity-[0.02] blur-[130px] pointer-events-none z-0" />

      {/* Futuristic Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative size-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff9d]/20 to-[#00c8ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Terminal className="size-4 text-[#00ff9d] group-hover:scale-105 transition-transform" />
              </div>
              <span className="font-semibold tracking-tight text-white flex items-center gap-1.5">
                PLMS
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#00ff9d]/30 text-[#00ff9d] bg-[#00ff9d]/5">v1.0</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</a>
              <a href="#workflow" className="text-sm text-neutral-400 hover:text-white transition-colors">Workflow</a>
              <a href="#stats" className="text-sm text-neutral-400 hover:text-white transition-colors">Stats</a>
              <a href="#showcase" className="text-sm text-neutral-400 hover:text-white transition-colors">Showcase</a>
              <a href="#testimonials" className="text-sm text-neutral-400 hover:text-white transition-colors">Testimonials</a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm text-neutral-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="relative group px-4 py-2 text-xs font-semibold text-neutral-950 bg-[#00ff9d] rounded-lg hover:brightness-110 transition-all duration-200 shadow-md shadow-[#00ff9d]/10"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.05] bg-black/95 px-6 py-6 space-y-4">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-1"
            >
              Features
            </a>
            <a 
              href="#workflow" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-1"
            >
              Workflow
            </a>
            <a 
              href="#stats" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-1"
            >
              Stats
            </a>
            <a 
              href="#showcase" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-1"
            >
              Showcase
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-1"
            >
              Testimonials
            </a>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-3 pt-2">
              <Link 
                href="/auth/login" 
                className="w-full text-center py-2 rounded-lg border border-white/10 text-sm text-neutral-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="w-full text-center py-2 rounded-lg bg-[#00ff9d] text-neutral-950 font-semibold text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-28 pb-20 md:pb-32 z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Left Text Column */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm text-xs text-neutral-300">
              <Sparkles className="size-3.5 text-[#00c8ff]" />
              <span>Next-Gen Learning Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 leading-[1.1]">
              Organize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c8ff] text-glow-emerald">
                Learning
              </span>{' '}
              Like a Developer
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
              Track subjects, manage notes, monitor progress, and build a smarter study workflow. A productivity cockpit designed with Markdown and analytics integrated at the core.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/auth/register"
                className="relative group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00ff9d] to-[#00c8ff] px-6 py-3.5 text-sm font-semibold text-neutral-950 hover:brightness-110 shadow-lg shadow-[#00ff9d]/10 transition duration-300"
              >
                Get Started Free
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#showcase"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 backdrop-blur-sm"
              >
                View Dashboard Showcase
              </a>
            </div>
          </div>

          {/* Right Floating Mockup Column */}
          <div className="relative animate-float-slow lg:ml-4">
            
            {/* Ambient Background Glow behind mockup */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-[#00ff9d]/10 to-[#00c8ff]/10 blur-xl opacity-80" />

            {/* Premium Mini-Dashboard Window Mockup */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/[0.08]">
              
              {/* Window Header */}
              <div className="h-11 border-b border-white/[0.05] bg-black/40 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-[#ff5f56]" />
                  <div className="size-3 rounded-full bg-[#ffbd2e]" />
                  <div className="size-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                  <Terminal className="size-3" /> plms --dashboard
                </div>
                <div className="w-12 h-1 bg-transparent" />
              </div>

              {/* Window Content */}
              <div className="p-5 space-y-5 bg-neutral-950/80">
                
                {/* Row 1: Subject Cards & Streak */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Subject Item */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-500">SUBJECT</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-[#00ff9d]">CS-201</span>
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-200">Data Structures</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-neutral-400">
                        <span>Mastery</span>
                        <span>82%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00ff9d] to-[#00c8ff] rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Streak Card */}
                  <div className="p-4 rounded-xl border border-[#00ff9d]/20 bg-[#00ff9d]/[0.02] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 size-16 rounded-full bg-[#00ff9d]/5 blur-md" />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-400">STUDY STREAK</span>
                      <Flame className="size-4 text-orange-500 fill-orange-500 animate-pulse" />
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-[#00ff9d]">
                        30 Days
                      </div>
                      <p className="text-[9px] text-neutral-400 font-mono mt-0.5">Top 5% of Engineers</p>
                    </div>
                  </div>

                </div>

                {/* Row 2: Markdown Note Preview & Task Checkbox */}
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4">
                  
                  {/* Notes Monospace Snippet */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                      <span className="text-[11px] font-mono text-neutral-400">NOTES PREVIEW</span>
                      <span className="text-[9px] font-mono text-neutral-500">index.md</span>
                    </div>
                    <div className="font-mono text-[10px] space-y-1.5 text-neutral-300 leading-normal">
                      <p className="text-[#00ff9d]"><span className="text-neutral-600">#</span> Modern Algorithms</p>
                      <p><span className="text-neutral-600">##</span> Depth First Search</p>
                      <p className="text-neutral-500">// Time Complexity: O(V + E)</p>
                      <div className="pl-3 border-l-2 border-[#00c8ff]/40 text-neutral-400 bg-white/[0.01] p-1 rounded font-mono">
                        <span className="text-[#00c8ff]">function</span> dfs(node) {'{'} ... {'}'}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Interactive Checklist */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-400">UPCOMING TASKS</span>
                      <span className="text-[9px] text-[#00c8ff] font-mono">Click to toggle</span>
                    </div>
                    <div className="space-y-2">
                      {heroTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => toggleHeroTask(task.id)}
                          className="w-full flex items-start gap-2.5 text-left group/btn"
                        >
                          <div className={`mt-0.5 size-3.5 rounded border transition-colors flex items-center justify-center ${
                            task.done 
                              ? 'bg-[#00ff9d] border-[#00ff9d] text-neutral-950' 
                              : 'border-white/20 group-hover/btn:border-[#00ff9d]/50 bg-neutral-900'
                          }`}>
                            {task.done && <Check className="size-2.5 stroke-[3]" />}
                          </div>
                          <span className={`text-[11px] leading-tight select-none transition-all ${
                            task.done ? 'line-through text-neutral-500' : 'text-neutral-300 group-hover/btn:text-white'
                          }`}>
                            {task.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Simulated Sparkline Analytics Bar */}
                <div className="p-3 rounded-xl border border-white/5 bg-black/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Activity className="size-3.5 text-[#00c8ff]" />
                    <span className="text-[11px] font-mono text-neutral-300">Daily Study Output</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-6">
                    <div className="w-2.5 h-2 bg-neutral-800 rounded-sm" />
                    <div className="w-2.5 h-3 bg-neutral-700 rounded-sm" />
                    <div className="w-2.5 h-5 bg-[#00c8ff] rounded-sm" />
                    <div className="w-2.5 h-4 bg-neutral-700 rounded-sm" />
                    <div className="w-2.5 h-6 bg-[#00ff9d] rounded-sm animate-pulse" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 z-10 border-t border-white/[0.03]">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs text-[#00ff9d] font-mono">
            <Terminal className="size-3" /> FEATURES_MANIFEST
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Designed for the Modern Developer
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Every feature is optimized for swift, distraction-free study blocks. Move faster, recall concepts, and store knowledge cleanly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Subject Management */}
          <div className="glass-panel glass-panel-glow-emerald rounded-2xl p-6 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#00ff9d]/30 transition-colors">
              <BookOpen className="size-5 text-[#00ff9d]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff9d] transition-colors">
              Subject Management
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Create structured directories for subjects, organize syllabi, and set tags. Manage the high-level roadmap of your technical curriculum.
            </p>
          </div>

          {/* Card 2: Markdown Notes */}
          <div className="glass-panel glass-panel-glow-blue rounded-2xl p-6 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#00c8ff]/30 transition-colors">
              <FileText className="size-5 text-[#00c8ff]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00c8ff] transition-colors">
              Markdown Notes
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Take notes utilizing high-fidelity Markdown. Write blocks of code with full clean syntax spacing, standard tags, and formatted subheadings.
            </p>
          </div>

          {/* Card 3: Progress Tracking */}
          <div className="glass-panel glass-panel-glow-emerald rounded-2xl p-6 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#00ff9d]/30 transition-colors">
              <Flame className="size-5 text-[#00ff9d]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff9d] transition-colors">
              Progress Tracking
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Maintain active streak charts, log revision milestones, and visually trace mastery meters that reflect your daily progress.
            </p>
          </div>

          {/* Card 4: Study Planner */}
          <div className="glass-panel glass-panel-glow-blue rounded-2xl p-6 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#00c8ff]/30 transition-colors">
              <Calendar className="size-5 text-[#00c8ff]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00c8ff] transition-colors">
              Study Planner
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Map out daily objectives, create focused review sessions, and schedule recurring study blocks with developer-style ease.
            </p>
          </div>

          {/* Card 5: Analytics Dashboard */}
          <div className="glass-panel glass-panel-glow-emerald rounded-2xl p-6 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#00ff9d]/30 transition-colors">
              <LineChart className="size-5 text-[#00ff9d]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff9d] transition-colors">
              Analytics Dashboard
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Receive telemetry on your study habits. Gain insights into total note logs, weekly review scores, and streak achievements.
            </p>
          </div>

          {/* Card 6: Secure Authentication */}
          <div className="glass-panel glass-panel-glow-blue rounded-2xl p-6 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#00c8ff]/30 transition-colors">
              <Lock className="size-5 text-[#00c8ff]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00c8ff] transition-colors">
              Secure Authentication
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Your syllabus and notes are secured behind encrypted credentials, guaranteeing safe cloud backups of your educational repository.
            </p>
          </div>

        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 z-10 border-t border-white/[0.03] overflow-hidden">
        
        {/* Background glow specific for workflow */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full bg-[#00c8ff]/5 blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 md:mb-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs text-[#00c8ff] font-mono">
            <Zap className="size-3" /> PIPELINE_WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Optimized Studying in 3 Steps
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Transition smoothly from plan creation to mastery. Build structured routines designed to stick.
          </p>
        </div>

        {/* Workflow Steps Container */}
        <div className="relative">
          
          {/* Horizontal Connection Path for desktop */}
          <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-[#00ff9d]/30 via-[#00c8ff]/30 to-[#00ff9d]/30">
            {/* Glowing flowing pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent w-20 h-[1.5px] animate-flow" style={{ animation: 'flow-line 2.5s linear infinite' }} />
          </div>

          <div className="grid gap-12 lg:grid-cols-3 relative z-10">
            
            {/* Step 1 */}
            <div className="text-center space-y-5 group">
              <div className="mx-auto size-16 rounded-2xl bg-neutral-900 border border-white/10 group-hover:border-[#00ff9d]/40 flex items-center justify-center text-lg font-bold text-white shadow-lg relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff9d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookOpen className="size-6 text-[#00ff9d]" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#00ff9d] tracking-widest uppercase">STEP 01</span>
                <h3 className="text-xl font-bold text-neutral-100">Create Subjects</h3>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                  Establish a hierarchy for your topics, map syllabi guidelines, and categorize subject matter.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-5 group">
              <div className="mx-auto size-16 rounded-2xl bg-neutral-900 border border-white/10 group-hover:border-[#00c8ff]/40 flex items-center justify-center text-lg font-bold text-white shadow-lg relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00c8ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <FileText className="size-6 text-[#00c8ff]" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#00c8ff] tracking-widest uppercase">STEP 02</span>
                <h3 className="text-xl font-bold text-neutral-100">Add Notes & Topics</h3>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                  Populate topics with descriptive Markdown notes, code snippets, lists, and reference logs.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-5 group">
              <div className="mx-auto size-16 rounded-2xl bg-neutral-900 border border-white/10 group-hover:border-[#00ff9d]/40 flex items-center justify-center text-lg font-bold text-white shadow-lg relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff9d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Flame className="size-6 text-[#00ff9d]" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#00ff9d] tracking-widest uppercase">STEP 03</span>
                <h3 className="text-xl font-bold text-neutral-100">Track Progress Daily</h3>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                  Log focused study runs, clear checklists, grow streaks, and analyze weekly progress indicators.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Showcase */}
      <section id="stats" className="relative max-w-7xl mx-auto px-6 py-20 z-10 border-t border-white/[0.03]">
        
        {/* Neon accent rings */}
        <div className="absolute top-[20%] left-[10%] size-28 bg-[#00ff9d]/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] size-28 bg-[#00c8ff]/5 rounded-full blur-xl pointer-events-none" />

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          
          {/* Stat 1 */}
          <div className="glass-panel rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent opacity-40" />
            <BookOpen className="size-4 text-[#00ff9d] mx-auto opacity-60 group-hover:scale-110 transition-transform" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {stats.topics}+
            </div>
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              Topics Managed
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass-panel rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00c8ff] to-transparent opacity-40" />
            <Activity className="size-4 text-[#00c8ff] mx-auto opacity-60 group-hover:scale-110 transition-transform" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {stats.productivity}%
            </div>
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              Productivity Boost
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-panel rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff9d] to-transparent opacity-40" />
            <Flame className="size-4 text-orange-500 mx-auto opacity-80 group-hover:scale-110 transition-transform" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {stats.streak} Day
            </div>
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              Study Streak
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass-panel rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00c8ff] to-transparent opacity-40" />
            <FileText className="size-4 text-[#00c8ff] mx-auto opacity-60 group-hover:scale-110 transition-transform" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {stats.notes}+
            </div>
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              Notes Written
            </div>
          </div>

        </div>
      </section>

      {false && (
      // Large Realistic Mockup Showcase
      <section id="showcase" className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 z-10 border-t border-white/[0.03]">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs text-[#00ff9d] font-mono">
            <Code className="size-3" /> APP_SHOWCASE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Study Console Built For Builders
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Gain absolute mastery over your subjects. Leverage responsive navigation panels, study streaks, and robust Markdown editors.
          </p>
        </div>

        Large Detailed Dashboard Cockpit Mockup
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/[0.08] relative">
          
          {/* Header Bar */}
          <div className="h-12 border-b border-white/[0.05] bg-black/50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-[#ff5f56]" />
              <div className="size-3 rounded-full bg-[#ffbd2e]" />
              <div className="size-3 rounded-full bg-[#27c93f]" />
              <span className="text-neutral-600 px-2">|</span>
              <span className="text-xs text-neutral-400 font-mono tracking-wider">https://plms.dev/dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono bg-[#00ff9d]/10 text-[#00ff9d] px-2 py-0.5 rounded border border-[#00ff9d]/20">
                ACTIVE SESSION
              </span>
            </div>
          </div>

          {/* Main Dashboard Layout Split */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] bg-neutral-950/80 min-h-[500px]">
            
            {/* Sidebar Navigation Mockup */}
            <div className="border-r border-white/[0.05] bg-black/40 p-4 space-y-6">
              
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-2">WORKSPACE</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-white text-xs font-medium cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Terminal className="size-3.5 text-[#00ff9d]" /> Dashboard
                    </span>
                    <span className="size-2 rounded-full bg-[#00ff9d]" />
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-400 hover:bg-white/[0.02] hover:text-white text-xs font-medium cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <BookOpen className="size-3.5" /> Subjects
                    </span>
                    <span className="text-[9px] font-mono text-neutral-600 bg-neutral-900 px-1 py-0.5 rounded">6</span>
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-400 hover:bg-white/[0.02] hover:text-white text-xs font-medium cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5" /> Notes Log
                    </span>
                    <span className="text-[9px] font-mono text-neutral-600 bg-neutral-900 px-1 py-0.5 rounded">42</span>
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-neutral-400 hover:bg-white/[0.02] hover:text-white text-xs font-medium cursor-pointer transition-colors">
                    <span className="flex items-center gap-2">
                      <CheckSquare className="size-3.5" /> Study Tasks
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-2">SUBJECTS REGISTER</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2.5 px-2.5 py-1 text-neutral-400 hover:text-white cursor-pointer transition-colors">
                    <div className="size-1.5 rounded-full bg-[#00ff9d]" />
                    <span>Computer Networks</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1 text-neutral-400 hover:text-white cursor-pointer transition-colors">
                    <div className="size-1.5 rounded-full bg-[#00c8ff]" />
                    <span>Operating Systems</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-1 text-neutral-400 hover:text-white cursor-pointer transition-colors">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                    <span>Machine Learning</span>
                  </div>
                </div>
              </div>

              {/* Quick Profile Footer Mock */}
              <div className="absolute bottom-4 left-4 w-[188px] p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-gradient-to-tr from-[#00ff9d] to-[#00c8ff] flex items-center justify-center text-[10px] font-bold text-neutral-950">
                  DEV
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-neutral-200">Karthik</div>
                  <div className="text-[9px] font-mono text-[#00ff9d]">mastery_lv. 4</div>
                </div>
              </div>

            </div>

            {/* Central Work Grid */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Row 1: Active Subject and Pomodoro Study Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active Subject detail */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500">SUBJECT TARGET</span>
                      <h3 className="text-lg font-bold text-neutral-100">Operating Systems Prep</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00c8ff]/10 text-[#00c8ff] border border-[#00c8ff]/20">
                      HIGH PRIOR
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>Syllabus Covered</span>
                      <span className="font-mono">14 / 18 topics (78%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-900 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00c8ff] to-[#00ff9d] rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1"><Check className="size-3.5 text-[#00ff9d]" /> 4 Mock tests solved</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Flame className="size-3.5 text-orange-500" /> Exam in 4 days</span>
                  </div>
                </div>

                {/* Pomodoro Timer Session Tracker - Full Interaction! */}
                <div className="p-5 rounded-xl border border-[#00ff9d]/20 bg-[#00ff9d]/[0.01] space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500">STUDY TIMELINE BLOCK</span>
                    <span className="text-[10px] font-mono text-orange-500 flex items-center gap-1">
                      <Flame className="size-3 stroke-[2.5]" /> FOCUS TIME
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-4xl font-extrabold text-white font-mono tracking-wider text-glow-emerald">
                      {formatTimer(timerSeconds)}
                    </div>
                    <p className="text-[10px] text-neutral-400 font-mono mt-1">
                      {timerActive ? 'Active concentration session' : 'System standby • Ready to study'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={toggleTimer}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00ff9d] text-neutral-950 hover:brightness-110 flex items-center gap-1 transition-all"
                    >
                      {timerActive ? <Pause className="size-3.5 fill-neutral-950" /> : <Play className="size-3.5 fill-neutral-950" />}
                      {timerActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 border border-white/10 text-neutral-300 hover:bg-neutral-800 flex items-center gap-1 transition-all"
                    >
                      <RefreshCw className="size-3" />
                      Reset
                    </button>
                  </div>
                </div>

              </div>

              {/* Row 2: Markdown Interactive Notebook Panel & Mini Calendar */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                
                {/* Interactive Notebook Workspace */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-[#00ff9d]" />
                      <span className="text-xs font-semibold text-neutral-200">Notes Editor (Markdown)</span>
                    </div>
                    <div className="flex bg-neutral-900 p-0.5 rounded-md border border-white/5 text-[10px] font-mono">
                      <button
                        onClick={() => setNoteTab('editor')}
                        className={`px-2 py-0.5 rounded transition-all ${
                          noteTab === 'editor' ? 'bg-[#00ff9d] text-neutral-950 font-bold' : 'text-neutral-400'
                        }`}
                      >
                        code.md
                      </button>
                      <button
                        onClick={() => setNoteTab('preview')}
                        className={`px-2 py-0.5 rounded transition-all ${
                          noteTab === 'preview' ? 'bg-[#00ff9d] text-neutral-950 font-bold' : 'text-neutral-400'
                        }`}
                      >
                        preview
                      </button>
                    </div>
                  </div>

                  {noteTab === 'editor' ? (
                    <textarea
                      value={markdownText}
                      readOnly
                      className="w-full h-32 bg-transparent text-[11px] font-mono text-neutral-400 border-none outline-none resize-none focus:ring-0 leading-relaxed"
                    />
                  ) : (
                    <div className="h-32 overflow-y-auto space-y-2 text-[11px] leading-relaxed">
                      <h4 className="text-sm font-bold text-white">System Design Notes</h4>
                      <p className="text-neutral-300 font-semibold border-b border-white/5 pb-1">Database Sharding</p>
                      <p className="text-neutral-400">Sharding is a method for distributing a single dataset across multiple databases.</p>
                      <div className="p-2 rounded bg-neutral-900 font-mono text-[9px] border border-white/5 text-[#00ff9d]">
                        interface ShardManager {'{'} hashKey(k: string): number; {'}'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Calendar Workspace Mockup */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500">UPCOMING REVISIONS</span>
                    <Calendar className="size-3.5 text-[#00c8ff]" />
                  </div>
                  <div className="space-y-2.5">
                    
                    <div className="p-2.5 rounded-lg bg-neutral-900 border-l-2 border-[#00ff9d] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-200">OS Concepts Review</div>
                        <div className="text-[9px] font-mono text-neutral-500">Tomorrow • 14:00</div>
                      </div>
                      <ChevronRight className="size-3.5 text-neutral-600" />
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-900 border-l-2 border-[#00c8ff] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-200">System Sharding Live</div>
                        <div className="text-[9px] font-mono text-neutral-500">May 28 • 16:30</div>
                      </div>
                      <ChevronRight className="size-3.5 text-neutral-600" />
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 z-10 border-t border-white/[0.03]">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs text-[#00ff9d] font-mono">
            <Sparkles className="size-3" /> VERIFIED_PEER_REVIEWS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Endorsed by Fast Learners
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            See how developers and engineering students organize their learning curves.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Testimonial 1 */}
          <div className="glass-panel rounded-2xl p-6 space-y-5 relative flex flex-col justify-between hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic">
              "As a self-taught engineer, mapping my syllabus in PLMS keeps my learning structured. The Markdown notes panel and study streaks keep me highly accountable."
            </p>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-neutral-950">
                JD
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  Jessica Davis
                  <span className="text-[9px] font-mono text-[#00ff9d] bg-[#00ff9d]/5 px-1 rounded">PRO</span>
                </h4>
                <p className="text-[10px] text-neutral-500 font-mono">@jess_codes</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-panel rounded-2xl p-6 space-y-5 relative flex flex-col justify-between hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic">
              "The Pomodoro session tracker paired with the subject registers matches my developer setup. I can write notes with proper code formatting and check off daily targets."
            </p>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-tr from-[#00c8ff] to-[#00ff9d] flex items-center justify-center text-[10px] font-bold text-neutral-950">
                SC
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  Siddharth Chandra
                </h4>
                <p className="text-[10px] text-neutral-500 font-mono">@sid_dev</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-panel rounded-2xl p-6 space-y-5 relative flex flex-col justify-between hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic">
              "PLMS organizes subjects and notes in a cohesive layout. I no longer struggle to remember where I left off in my curriculum. Telemetry reports help map output."
            </p>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-tr from-[#00ff9d] to-purple-500 flex items-center justify-center text-[10px] font-bold text-neutral-950">
                MR
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  Marcus Rossi
                  <span className="text-[9px] font-mono text-[#00c8ff] bg-[#00c8ff]/5 px-1 rounded font-normal">STUDENT</span>
                </h4>
                <p className="text-[10px] text-neutral-500 font-mono">@marcusr_cs</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 z-10 text-center my-10 rounded-3xl border border-white/[0.08] overflow-hidden bg-black/40">
        
        {/* Background glowing gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,255,157,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-[-100px] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        <div className="space-y-6 max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Start Building Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c8ff] text-glow-emerald">
              Learning System
            </span>{' '}
            Today
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Bring subjects, checklists, notes, and progress scoreboards together in a sleek personal database. Take charge of your mastery track.
          </p>
          <div className="pt-4">
            <Link
              href="/auth/register"
              className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00ff9d] to-[#00c8ff] px-8 py-4 text-sm font-semibold text-neutral-950 hover:brightness-110 shadow-xl shadow-[#00ff9d]/20 transition duration-300 group"
            >
              Launch PLMS Free
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Developer-Focused Footer */}
      <footer className="border-t border-white/[0.05] bg-black/60 py-12 text-neutral-500 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight text-sm">
              <Terminal className="size-4 text-[#00ff9d]" /> PLMS
            </div>
            <p className="text-xs max-w-xs leading-relaxed">
              Personal Learning Management System. Rebuilding self-education paths for designers, coders, and system architects.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#00ff9d] font-mono bg-[#00ff9d]/5 px-2.5 py-1 rounded border border-[#00ff9d]/15 w-fit">
              <span className="size-1.5 bg-[#00ff9d] rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-neutral-300 font-mono tracking-widest">PRODUCT</h5>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#features" className="hover:text-neutral-300 transition-colors">Features list</a></li>
              <li><a href="#workflow" className="hover:text-neutral-300 transition-colors">Study pipeline</a></li>
              <li><a href="#showcase" className="hover:text-neutral-300 transition-colors">Cockpit console</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-neutral-300 font-mono tracking-widest">DEVELOPER</h5>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/auth/register" className="hover:text-neutral-300 transition-colors">Github API</Link></li>
              <li><Link href="/auth/login" className="hover:text-neutral-300 transition-colors">Schema docs</Link></li>
              <li><Link href="/auth/register" className="hover:text-neutral-300 transition-colors">System Telemetry</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-neutral-300 font-mono tracking-widest">LEGAL</h5>
            <ul className="space-y-1.5 text-xs">
              <li><span className="hover:text-neutral-300 cursor-pointer transition-colors">Privacy key</span></li>
              <li><span className="hover:text-neutral-300 cursor-pointer transition-colors">Credential policy</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} PLMS. All rights reserved.
          </div>
          {/* <div className="flex items-center gap-1 text-[11px] font-mono">
            Designed for engineers with <span className="text-[#00ff9d]">♥</span>
          </div> */}
        </div>
      </footer>

    </main>
  );
}
