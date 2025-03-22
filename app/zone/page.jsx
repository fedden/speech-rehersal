'use client';
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

const essay = `Public speaking can feel intimidating, but shifting my mindset helps me transform anxiety into enthusiasm. As I prepare to speak at Alex's wedding, I tell myself: I'm excited to present this! I genuinely look forward to delivering for Alex and Alexandra, Alex's family, Elliot and Leonie, Becky and Bill, whoever is there. When I stop focusing on my own performance and start focusing on connecting with the audience, that's when I truly make an impact.

Adopting a growth mindset helps enormously. Instead of thinking, "I will always struggle with confidence," I remind myself, "I'm learning to be confident. It might take a while, and it might be tricky, but there is much I can learn." Similarly, instead of viewing my fear of public speaking as something abnormal or broken, I remind myself that fear is natural - it affects everyone. **Athletes describe their anxiety as "being in the zone,**" giving it a different label.

Pauses no longer need to feel horrible or panic-inducing; instead, they are valuable tools. Great speakers embrace silence because they know audiences need time to absorb the message. **Being comfortable with silence demonstrates strength and composure**.

I'm also learning to be comfortable as the center of attention. Instead of thinking, "Being the center of attention means too much. I don't deserve this space," I reframe it as, "I effortlessly let others take centre stage - why not allow myself the same? When it's my turn, the audience willingly gives me that space."

Remembering I'm special but not overly important helps balance self-consciousness. Rather than thinking everyone notices every minor detail, **I realise that it's really not about me - it's about the audience** (and Alex and Alex) and the subject (my friendship with Alex and marriage). Shifting my focus to genuinely serving the audience and wedding significantly reduces my anxiety.

Insights from others have also been helpful. Fighting or suppressing anxiety doesn't work; instead, **I lean into the anxiety**. Rather than denying my nerves, I acknowledge, "Yes, I'm nervous. Public speaking is scary. This takes courage, and I'm courageous. My heart pounds because I'm doing something brave, and I'm proud of myself."

Realising that nearly everyone in the audience is glad they're not speaking helps me own any awkwardness confidently. Approaching speaking from a place of humility - wanting to add genuine value to the audience - shifts the attention away from my anxiety. **Reminding myself, "I'm nervous because I'm excited to share this information,"** converts anxiety into a positive form of excitement.

The illusion of transparency reminds me that people cannot usually see my nervousness. While awareness of my body language is beneficial, minor stutters, fillers, or grammar mishaps don't significantly impact the audience. It's not about exact wording but rather my energy. **It's not what you say, but how you say it.** Public speaking isn't just delivering sentences - it's about delivering my energy; communicating enthusiasm and passion to connect to the audience's primal side.

Lastly, adopting an abundance mentality helps. There will be no shortage of speaking opportunities in my lifetime. Every time I get on stage is a win. Each brave act moves me forward, putting me ahead of those who stay on the sidelines. **Who cares if the audience likes me?** The real question is whether I like and appreciate them. I am their gateway into a new world; they join me on the journey my speech creates.`;

export default function ZonePage() {
  const [selectedVoice, setSelectedVoice] = useState('amelia');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  // Cleanup effect to stop audio when leaving the page
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setAudio(null);
      }
    };
  }, [audio]);

  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    const newAudio = new Audio(`/audio/${voice}.mp3`);
    newAudio.addEventListener('ended', () => setIsPlaying(false));
    setAudio(newAudio);
  };

  const togglePlayback = () => {
    if (!audio) {
      const newAudio = new Audio(`/audio/${selectedVoice}.mp3`);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Fixed header section */}
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">In The Zone Mindset</h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayback}
                  className="px-6 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <span>⏸️</span> Pause
                    </>
                  ) : (
                    <>
                      <span>▶️</span> Play
                    </>
                  )}
                </button>
                
                <select
                  value={selectedVoice}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="amelia">Amelia's Voice</option>
                  <option value="cassidy">Cassidy's Voice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scrollable content section */}
          <div className="p-8 overflow-y-auto max-h-[calc(100vh-16rem)]">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(essay) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 