import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timeline } from '../QuantumDetective';
import { AudioManager } from './AudioManager';
import { AdventureChallengeComponent } from './AdventureChallenge';
import { CanvasScene } from './CanvasScene';
import { InteractiveElements } from './InteractiveElements';
import { FastForward } from 'lucide-react';

interface StoryDisplayProps {
  timeline: Timeline;
  progress: number;
  onChoice: (choiceId: string) => void;
  onEvidenceFound: (evidence: any) => void;
}

const storyContent = {
  alpha: {
    0: {
      title: "Corporate Shadows",
      text: "You stand in the gleaming lobby of NeoTech Industries. The body of CEO Marcus Vrain lies slumped over his desk on the 50th floor. Security footage shows no one entering or leaving his office after 6 PM. The official report calls it suicide, but something doesn't add up...",
      choices: [
        { id: "examine_body", text: "Examine the body closely" },
        { id: "check_security", text: "Review security systems" },
        { id: "interview_secretary", text: "Question his secretary" }
      ],
      evidence: { id: "suicide_note_alpha", name: "Suicide Note", description: "A typed note claiming responsibility" },
      ascii: `
        ╔═══════════════════════╗
        ║    NEOTECH TOWER      ║
        ║  ████████████████████ ║
        ║  ║                 ║ ║
        ║  ║  50F: [CRIME]   ║ ║
        ║  ║     ☠️ CEO      ║ ║
        ║  ║                 ║ ║
        ║  ████████████████████ ║
        ║   STATUS: LOCKED      ║
        ╚═══════════════════════╝
      `
    },
    1: {
      title: "The Executive Suite",
      text: "Marcus Vrain's office is pristine, almost too clean. His computer is still logged in, showing recent stock transactions worth millions. A coffee cup sits cold on his desk, lipstick stain on the rim - but Vrain lived alone...",
      choices: [
        { id: "analyze_computer", text: "Investigate the computer" },
        { id: "examine_coffee", text: "Test the coffee cup" },
        { id: "search_office", text: "Search for hidden compartments" }
      ],
      evidence: { id: "lipstick_cup_alpha", name: "Coffee Cup", description: "Contains traces of an unknown lipstick" },
      ascii: `
        ╔══════════════════════════╗
        ║     EXECUTIVE SUITE      ║
        ║                          ║
        ║  📺 [MONITOR] 💻 [LAPTOP] ║
        ║  📊 STOCKS: +$5.2M       ║
        ║                          ║
        ║  ☕ [COFFEE] ← 💋 LIPSTICK ║
        ║  🗂️  [FILES] 🔒 [SAFE]    ║
        ║                          ║
        ║  STATUS: INVESTIGATED    ║
        ╚══════════════════════════╝
      `,
      adventure: {
        task: "HACKING CHALLENGE",
        description: "Decode the encrypted financial records",
        puzzle: "Binary sequence: 01010001 01010101 01000001 01001110 01010100 01010101 01001101",
        solution: "QUANTUM",
        reward: "Advanced Evidence: Hidden Offshore Account"
      }
    },
    2: {
      title: "Digital Forensics",
      text: "You've accessed Vrain's computer systems. The financial records reveal a complex web of transactions, but one catches your eye - a massive transfer scheduled for tomorrow morning. Someone was planning to drain the company accounts. The killer might have been after more than just Vrain's life...",
      choices: [
        { id: "trace_transaction", text: "Trace the suspicious transaction" },
        { id: "check_emails", text: "Examine recent emails" },
        { id: "forensic_analysis", text: "Run deep forensic scan" }
      ],
      evidence: { id: "financial_records_alpha", name: "Financial Records", description: "Suspicious $50M transfer scheduled" },
      ascii: `
        ╔══════════════════════════╗
        ║    FINANCIAL MATRIX      ║
        ║                          ║
        ║  💰 BALANCE: $127.5M     ║
        ║  📈 PENDING: $50M OUT    ║
        ║  🏦 DEST: [ENCRYPTED]    ║
        ║                          ║
        ║  ⚠️  ALERT: SUSPICIOUS   ║
        ║  🔍 TRACE: IN PROGRESS   ║
        ║                          ║
        ║  STATUS: ANALYZING...    ║
        ╚══════════════════════════╝
      `
    },
    3: {
      title: "The Email Trail",
      text: "The email trace reveals encrypted communications with someone code-named 'Phoenix'. The messages reference a hostile takeover and mention eliminating obstacles. But there's something odd - the emails were sent after Vrain's death. Someone else has access to his accounts...",
      choices: [
        { id: "decrypt_phoenix", text: "Decrypt Phoenix communications" },
        { id: "trace_ip", text: "Trace IP addresses" },
        { id: "examine_timestamps", text: "Analyze message timestamps" }
      ],
      evidence: { id: "phoenix_emails_alpha", name: "Phoenix Communications", description: "Encrypted emails sent after death" },
      ascii: `
        ╔══════════════════════════╗
        ║      EMAIL FORENSICS     ║
        ║                          ║
        ║  📧 FROM: "PHOENIX"      ║
        ║  ⏰ SENT: AFTER DEATH    ║
        ║  🔐 ENCRYPTION: AES-256  ║
        ║                          ║
        ║  📝 CONTENT: HOSTILE     ║
        ║     TAKEOVER PLANS       ║
        ║                          ║
        ║  STATUS: DECRYPTING...   ║
        ╚══════════════════════════╝
      `
    },
    4: {
      title: "Phoenix Rising",
      text: "The decryption reveals Phoenix's true identity - Margaret Chen, Vrain's business partner and the company's CTO. The timestamps show she was accessing his email remotely during a board meeting with 20 witnesses. She couldn't have killed him physically, but she's clearly involved. The corporate espionage goes deeper than murder...",
      choices: [
        { id: "confront_chen", text: "Confront Margaret Chen" },
        { id: "examine_partnership", text: "Investigate their partnership" },
        { id: "board_meeting_alibi", text: "Verify board meeting alibi" }
      ],
      evidence: { id: "chen_identity_alpha", name: "Phoenix Identity", description: "Margaret Chen = Phoenix code name" },
      ascii: `
        ╔══════════════════════════╗
        ║    PHOENIX REVEALED      ║
        ║                          ║
        ║  👤 MARGARET CHEN, CTO   ║
        ║  🤝 BUSINESS PARTNER     ║
        ║  📊 BOARD MEETING: 20 WIT║
        ║                          ║
        ║  💼 CORPORATE ESPIONAGE  ║
        ║  🎭 REMOTE ACCESS        ║
        ║                          ║
        ║  STATUS: IDENTIFIED      ║
        ╚══════════════════════════╝
      `,
      adventure: {
        task: "CORPORATE INFILTRATION",
        description: "Analyze the partnership documents for hidden clauses",
        puzzle: "Which clause gives Chen control if Vrain dies? A) Asset Transfer B) Succession Rights C) Insurance Beneficiary D) Voting Control",
        solution: "B",
        reward: "Hidden Partnership Secret"
      }
    },
    5: {
      title: "The Final Confrontation",
      text: "In Chen's office, you find the murder weapon - a syringe containing untraceable poison. Chen admits to the corporate conspiracy but swears she didn't kill Vrain. 'Someone beat me to it,' she says. 'I was going to ruin him financially, not murder him.' The real killer used her plan as cover. But who had access to both their offices?",
      choices: [
        { id: "security_access", text: "Check security access logs" },
        { id: "janitor_investigation", text: "Interview cleaning staff" },
        { id: "chen_cooperation", text: "Get Chen to cooperate" }
      ],
      evidence: { id: "poison_syringe_alpha", name: "Poison Syringe", description: "Untraceable compound, Chen's fingerprints" },
      ascii: `
        ╔══════════════════════════╗
        ║    FINAL REVELATION      ║
        ║                          ║
        ║  💉 MURDER WEAPON FOUND  ║
        ║  🧪 UNTRACEABLE POISON   ║
        ║  👤 CHEN: NOT THE KILLER ║
        ║                          ║
        ║  🤔 WHO HAD ACCESS?      ║
        ║  🔍 CASE CONVERGENCE     ║
        ║                          ║
        ║  STATUS: BREAKTHROUGH    ║
        ╚══════════════════════════╝
      `
    }
  },
  beta: {
    0: {
      title: "Family Secrets",
      text: "The same office, but in this reality, family photos line Marcus Vrain's desk. His estranged daughter had recently returned to his life. The murder weapon - a letter opener - bears her fingerprints, but she has an alibi...",
      choices: [
        { id: "examine_photos", text: "Study the family photos" },
        { id: "check_alibi", text: "Verify daughter's alibi" },
        { id: "analyze_weapon", text: "Examine the letter opener" }
      ],
      evidence: { id: "family_photo_beta", name: "Family Photo", description: "Recent photo showing reconciliation" },
      ascii: `
        ╔══════════════════════════╗
        ║      FAMILY TIMELINE     ║
        ║                          ║
        ║  📸 [PHOTO] 👨‍👩‍👧 FAMILY   ║
        ║  💝 REUNION: 2 WEEKS AGO ║
        ║                          ║
        ║  🗡️  WEAPON: LETTER OPENER║
        ║  👆 PRINTS: DAUGHTER'S   ║
        ║                          ║
        ║  STATUS: CONFLICTED      ║
        ╚══════════════════════════╝
      `
    },
    1: {
      title: "Blood Relations",
      text: "Sarah Vrain's alibi checks out - she was at a charity gala with 200 witnesses. Yet her fingerprints are on the murder weapon. Security cameras show her leaving the building at 5 PM, an hour before the estimated time of death...",
      choices: [
        { id: "gala_investigation", text: "Investigate the charity gala" },
        { id: "timeline_analysis", text: "Analyze the timeline" },
        { id: "fingerprint_expert", text: "Consult fingerprint expert" }
      ],
      evidence: { id: "gala_ticket_beta", name: "Charity Gala Ticket", description: "Timestamped entry at 6:30 PM" },
      ascii: `
        ╔══════════════════════════╗
        ║    ALIBI VERIFICATION    ║
        ║                          ║
        ║  🎭 GALA: 6:30 PM ENTRY  ║
        ║  👥 WITNESSES: 200+      ║
        ║  📹 CCTV: 5:00 PM EXIT   ║
        ║                          ║
        ║  ⏰ TOD: 6:00 PM         ║
        ║  🤔 PARADOX: DETECTED    ║
        ║                          ║
        ║  STATUS: INVESTIGATING   ║
        ╚══════════════════════════╝
      `,
      adventure: {
        task: "TIME PARADOX PUZZLE",
        description: "Solve the impossible timeline",
        puzzle: "If Sarah left at 5 PM and death occurred at 6 PM, but she was at the gala at 6:30 PM, how is this possible?",
        solution: "TWIN_SISTER",
        reward: "Breakthrough: Twin Sister Theory"
      }
    }
  },
  gamma: {
    0: {
      title: "Underground Connections",
      text: "In this timeline, Marcus Vrain wasn't just a CEO - he was laundering money for the Shadow Syndicate. His office shows signs of a struggle. The murder appears professional, but one detail seems deliberately planted...",
      choices: [
        { id: "examine_struggle", text: "Analyze signs of struggle" },
        { id: "trace_money", text: "Follow the money trail" },
        { id: "syndicate_contacts", text: "Investigate syndicate connections" }
      ],
      evidence: { id: "planted_evidence_gamma", name: "Syndicate Card", description: "Too obviously placed calling card" },
      ascii: `
        ╔══════════════════════════╗
        ║    SHADOW SYNDICATE      ║
        ║                          ║
        ║  💰 MONEY LAUNDERING     ║
        ║  🥊 SIGNS OF STRUGGLE    ║
        ║                          ║
        ║  🃏 CALLING CARD         ║
        ║  ⚠️  TOO OBVIOUS?        ║
        ║                          ║
        ║  🕵️ PROFESSIONAL HIT     ║
        ║  STATUS: SUSPICIOUS      ║
        ╚══════════════════════════╝
      `
    },
    1: {
      title: "Shadow Games",
      text: "The money trail leads to offshore accounts and encrypted communications. Vrain was preparing to testify against the Shadow Syndicate. But the planted evidence suggests someone wanted it to look like a syndicate hit...",
      choices: [
        { id: "decrypt_communications", text: "Decrypt the messages" },
        { id: "witness_protection", text: "Check witness protection records" },
        { id: "double_agent", text: "Look for double agents" }
      ],
      evidence: { id: "encrypted_message_gamma", name: "Encrypted Message", description: "References 'The Cleaner'" },
      ascii: `
        ╔══════════════════════════╗
        ║    ENCRYPTED COMMS       ║
        ║                          ║
        ║  🔐 MSG: [ENCRYPTED]     ║
        ║  👤 "THE CLEANER"        ║
        ║  🏛️  WITNESS PROTECTION   ║
        ║                          ║
        ║  💰 OFFSHORE: $12.5M     ║
        ║  🕵️ DOUBLE AGENT?        ║
        ║                          ║
        ║  STATUS: DECRYPTING...   ║
        ╚══════════════════════════╝
      `,
      adventure: {
        task: "DECRYPTION CHALLENGE",
        description: "Crack the syndicate's code",
        puzzle: "Caesar cipher with shift 13: 'GUR PYRNAYRE VF PBZVAT'",
        solution: "THE CLEANER IS COMING",
        reward: "Urgent Intel: Assassin Incoming"
      }
    }
  },
  delta: {
    0: {
      title: "Quantum Echoes",
      text: "In this final timeline, you begin to see the truth. Marcus Vrain exists in all realities, but so does his killer. Someone with access to quantum technology has been manipulating events across timelines. The real question is: who has this technology?",
      choices: [
        { id: "quantum_analysis", text: "Analyze quantum signatures" },
        { id: "technology_source", text: "Trace the quantum technology" },
        { id: "interdimensional_evidence", text: "Compare evidence across timelines" }
      ],
      evidence: { id: "quantum_signature_delta", name: "Quantum Residue", description: "Traces of interdimensional activity" },
      ascii: `
        ╔══════════════════════════╗
        ║    QUANTUM REALITY       ║
        ║                          ║
        ║  🌀 MULTIDIMENSIONAL     ║
        ║  ⚛️  QUANTUM SIGNATURES   ║
        ║                          ║
        ║  🔬 RESIDUE DETECTED     ║
        ║  📊 TIMELINE ANALYSIS    ║
        ║                          ║
        ║  🎯 TRUTH CONVERGENCE    ║
        ║  STATUS: CRITICAL        ║
        ╚══════════════════════════╝
      `
    },
    1: {
      title: "The Final Truth",
      text: "The quantum signatures match those of another detective - your predecessor who disappeared six months ago. Detective Ray Morrison had access to the same quantum jumping technology. But if he's the killer... who's been sending you these cases?",
      choices: [
        { id: "confront_morrison", text: "Confront Detective Morrison" },
        { id: "trace_case_source", text: "Find who assigned this case" },
        { id: "quantum_trap", text: "Set a quantum trap" }
      ],
      evidence: { id: "morrison_badge_delta", name: "Detective Badge", description: "Ray Morrison's missing badge" },
      ascii: `
        ╔══════════════════════════╗
        ║    FINAL REVELATION      ║
        ║                          ║
        ║  👮 DET. RAY MORRISON    ║
        ║  ❓ MISSING: 6 MONTHS    ║
        ║                          ║
        ║  🎯 QUANTUM SIGNATURE    ║
        ║  ⚡ MATCH: 99.7%         ║
        ║                          ║
        ║  🕵️ THE TRUTH AWAITS     ║
        ║  STATUS: ENDGAME         ║
        ╚══════════════════════════╝
      `,
      adventure: {
        task: "FINAL CONFRONTATION",
        description: "Choose your strategy wisely",
        puzzle: "Three paths diverge: Force, Deception, or Truth. Which will expose the quantum killer?",
        solution: "TRUTH",
        reward: "Case Solved: The Quantum Conspiracy"
      }
    }
  }
};

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  timeline,
  progress,
  onChoice,
  onEvidenceFound
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [currentStory, setCurrentStory] = useState(storyContent[timeline][progress as keyof typeof storyContent[typeof timeline]]);
  const [showAdventure, setShowAdventure] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!currentStory) return;
    
    setDisplayedText('');
    setShowChoices(false);
    setCanSkip(true);
    
    const text = currentStory.text;
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setShowChoices(true);
        setCanSkip(false);
        clearInterval(typeInterval);
        
        if (currentStory.evidence) {
          setTimeout(() => {
            onEvidenceFound(currentStory.evidence);
            AudioManager.playEvidenceFound();
          }, 500);
        }
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentStory, onEvidenceFound]);

  const skipText = () => {
    if (!currentStory) return;
    setDisplayedText(currentStory.text);
    setShowChoices(true);
    setCanSkip(false);
    
    if (currentStory.evidence) {
      setTimeout(() => {
        onEvidenceFound(currentStory.evidence);
        AudioManager.playEvidenceFound();
      }, 100);
    }
  };

  useEffect(() => {
    const newStory = storyContent[timeline][progress as keyof typeof storyContent[typeof timeline]];
    if (newStory) {
      setCurrentStory(newStory);
    }
  }, [timeline, progress]);

  const handleChoice = (choiceId: string) => {
    AudioManager.playUISound(600);
    onChoice(choiceId);
  };

  const getSceneType = (timeline: Timeline, progress: number) => {
    if (progress === 0) return 'office';
    if (progress === 1) return 'investigation';
    if (progress === 2) return 'confrontation';
    if (timeline === 'delta') return 'quantum';
    return 'investigation';
  };

  const getInteractiveElement = () => {
    if (timeline === 'alpha' && progress === 1) {
      return {
        type: 'quick_time' as const,
        data: {
          question: "The coffee cup is still warm! Someone was here recently. What's your immediate action?",
          options: ["Secure the scene", "Test the coffee", "Check security footage", "Call for backup"],
          correctAnswer: "Secure the scene",
          timeLimit: 8,
          reward: "Crime Scene Secured - Enhanced Evidence Collection"
        }
      };
    }
    
    if (timeline === 'beta' && progress === 1) {
      return {
        type: 'memory_game' as const,
        data: {
          instruction: "Memorize the timeline of events",
          sequence: ["5PM Exit", "6PM Death", "6:30PM Gala"],
          options: ["5PM Exit", "6PM Death", "6:30PM Gala", "7PM Return", "8PM Alibi", "9PM Call"],
          reward: "Timeline Mastery - Paradox Detected"
        }
      };
    }
    
    if (timeline === 'gamma' && progress === 1) {
      return {
        type: 'deduction' as const,
        data: {
          scenario: "Analyze the syndicate evidence. Which clues seem genuine?",
          clues: [
            "Calling card left in plain sight",
            "Professional execution style", 
            "Money laundering records",
            "Planted fingerprints",
            "Encrypted communications",
            "Fake witness testimony"
          ],
          correctAnswers: ["Professional execution style", "Money laundering records", "Encrypted communications"],
          requiredAnswers: 3,
          passingScore: 2,
          reward: "Syndicate Pattern Recognition"
        }
      };
    }
    
    if (timeline === 'delta' && progress === 1) {
      return {
        type: 'observation' as const,
        data: {
          description: "Study the quantum signatures carefully",
          scenario: "Residual quantum energy patterns suggest interdimensional activity. The signatures show: [REDACTED] frequency modulation, temporal displacement markers, and [REDACTED] quantum entanglement traces.",
          observations: [
            "Frequency matches Detective Morrison's equipment",
            "Temporal displacement of 6 months",
            "Quantum entanglement with missing badge",
            "Energy signature is synthetic"
          ],
          correctAnswer: "Frequency matches Detective Morrison's equipment",
          reward: "Quantum Analysis Mastery"
        }
      };
    }
    
    return null;
  };

  if (!currentStory) {
    return (
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/30">
        <div className="text-center text-muted-foreground">
          <p>This timeline has no more content available.</p>
          <p className="text-sm mt-2">Try switching to another timeline to continue the investigation.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-orbitron text-3xl font-bold text-primary mb-2">
          {currentStory.title}
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full"></div>
      </div>

      <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/30 min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <CanvasScene 
              timeline={timeline}
              progress={progress}
              scene={getSceneType(timeline, progress)}
              className="mb-4"
            />
          </div>
          {canSkip && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={skipText}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <FastForward className="w-4 h-4" />
                Skip Text
              </Button>
            </div>
          )}
          
          <p className="text-lg leading-relaxed font-rajdhani text-foreground">
            {displayedText}
            {!showChoices && (
              <span className="animate-blink-caret ml-1">|</span>
            )}
          </p>
        </div>

        {currentStory.evidence && showChoices && (
          <div className="mt-6 p-4 bg-accent/20 border border-accent/50 rounded-lg">
            <div className="flex items-center gap-2 text-accent font-semibold">
              <div className="w-2 h-2 bg-accent rounded-full animate-quantum-pulse"></div>
              Evidence Found: {currentStory.evidence.name}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {currentStory.evidence.description}
            </p>
          </div>
        )}

        {getInteractiveElement() && showChoices && (
          <div className="mt-6">
            <InteractiveElements
              type={getInteractiveElement()!.type}
              data={getInteractiveElement()!.data}
              onComplete={(success, reward) => {
                if (success && reward) {
                  onEvidenceFound({
                    id: `interactive_${Date.now()}`,
                    name: reward,
                    description: `Earned through interactive gameplay`
                  });
                  AudioManager.playEvidenceFound();
                }
              }}
              onFail={() => {
              }}
            />
          </div>
        )}

        {(currentStory as any).adventure && showChoices && (
          <div className="mt-6 p-4 bg-quantum-gamma/20 border border-quantum-gamma/50 rounded-lg">
            <div className="flex items-center gap-2 text-quantum-gamma font-bold mb-2">
              <div className="w-2 h-2 bg-quantum-gamma rounded-full animate-quantum-pulse"></div>
              Adventure Challenge: {(currentStory as any).adventure.task}
            </div>
            <p className="text-sm text-foreground mb-2">
              {(currentStory as any).adventure.description}
            </p>
            <div className="text-sm text-muted-foreground bg-background/50 p-2 rounded font-mono mb-3">
              {(currentStory as any).adventure.puzzle}
            </div>
            <Button
              onClick={() => setShowAdventure(true)}
              className="w-full quantum-btn"
            >
              🎯 Start Challenge
            </Button>
            <div className="text-xs text-quantum-gamma mt-2 text-center">
              Reward: {(currentStory as any).adventure.reward}
            </div>
          </div>
        )}

        {showChoices && currentStory.choices && (
          <div className="mt-8 space-y-3">
            {currentStory.choices.map((choice, index) => (
              <Button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                variant="outline"
                className="w-full text-left justify-start p-4 border-muted hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-all duration-300"
              >
                <span className="text-primary font-bold mr-3">{index + 1}.</span>
                {choice.text}
              </Button>
            ))}
          </div>
        )}
      </Card>

      {showAdventure && (currentStory as any).adventure && (
        <AdventureChallengeComponent
          challenge={(currentStory as any).adventure}
          onComplete={(reward) => {
            AudioManager.playEvidenceFound();
            onEvidenceFound({
              id: `adventure_${Date.now()}`,
              name: reward,
              description: `Earned through completing: ${(currentStory as any).adventure.task}`
            });
            setShowAdventure(false);
          }}
          onClose={() => setShowAdventure(false)}
        />
      )}
    </div>
  );
};