// src/pages/miniapp/AboutScreen.tsx
import { Sparkles, Shield, Eye, Trophy, Gift, Coins, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutScreen() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="p-4 pt-2 pb-10 md:pb-6 space-y-6">
        {/* Welcome Header */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-neon-gold" />
            <h1 className="text-2xl font-display font-bold text-neon-gold">
              Welcome, Lucky One! 🍀
            </h1>
          </div>
          <p className="text-base text-foreground leading-relaxed">
            The GiftDraw.today team is thrilled to welcome you to a unique Web3 project unlike anything else in the world! 
            <strong className="text-neon-gold"> GiftDraw.today ≠ lottery.</strong> This is a <strong className="text-neon-gold">New Paradigm</strong>.
          </p>
          <p className="text-base text-foreground leading-relaxed mt-4">
            We stand against gambling and shattered lives! We believe that collective consciousness can achieve incredible things: 
            simply purchase an NFT ticket for just <strong className="text-neon-gold">$1</strong> and participate in the global 
            redistribution of funds <strong className="text-neon-gold">every single day</strong>! GiftDraw.today makes people wealthy daily. 💰
          </p>
        </Card>

        {/* Core Values */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-neon-gold" />
            <h2 className="text-xl font-display font-bold">Core Principles</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-green" />
                Honesty & Decentralization
              </h3>
              <p className="text-sm text-muted-foreground">
                Results cannot be faked - the blockchain guarantees it. Every draw is verifiable and immutable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-neon-green" />
                Complete Transparency
              </h3>
              <p className="text-sm text-muted-foreground">
                You see full information about all participants, the prize pool amount, and the number of winners. 
                You can verify every draw through a unique hash.
              </p>
            </div>
          </div>
        </Card>

        {/* Winning Chances */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-neon-gold" />
            <h2 className="text-xl font-display font-bold">High Winning Probability</h2>
          </div>
          <div className="space-y-3">
            <p className="text-base text-foreground">
              <strong className="text-neon-gold text-lg">25%</strong> of participants become winners! 🎉
            </p>
            <p className="text-sm text-muted-foreground">
              Poker-style tournaments + a jackpot that rolls over to the next draw if not won. The excitement never ends!
            </p>
          </div>
        </Card>

        {/* Ticket Types */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-neon-gold" />
            <h2 className="text-xl font-display font-bold">Ticket Types</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50 min-w-[100px]">
                Legendary
              </Badge>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">1:10,000 chance when minting</p>
                <p className="text-xs text-muted-foreground">Ultra-rare tickets with extraordinary rewards!</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50 min-w-[100px]">
                Event
              </Badge>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">1:1,000 chance when minting</p>
                <p className="text-xs text-muted-foreground">Special event tickets with enhanced prizes!</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50 min-w-[100px]">
                Common
              </Badge>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">Standard ticket with 25% winning chance</p>
                <p className="text-xs text-muted-foreground">Your everyday path to victory!</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Airdrop Section */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-neon-gold" />
            <h2 className="text-xl font-display font-bold">Airdrop Program</h2>
          </div>
          <div className="space-y-4">
            <p className="text-base text-foreground">
              <strong className="text-neon-gold">$GIFT</strong> utility token created on <strong className="text-neon-gold">Solana</strong>.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Supply:</span>
                <span className="text-sm font-semibold text-foreground">100,000,000 GIFT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">DEX Liquidity (50%):</span>
                <span className="text-sm font-semibold text-foreground">50,000,000 GIFT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Airdrop (25%):</span>
                <span className="text-sm font-semibold text-neon-gold">25,000,000 GIFT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Presale, CEX, Team (25%):</span>
                <span className="text-sm font-semibold text-foreground">25,000,000 GIFT</span>
              </div>
            </div>
            <div className="pt-2">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-neon-gold hover:underline flex items-center gap-2"
              >
                <span>DEX Pool</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="glass-card p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-neon-gold/30">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-display font-bold text-neon-gold">
              Ready to Change Your Life? 🚀
            </h2>
            <p className="text-sm text-muted-foreground">
              Join thousands of winners who are already part of the GiftDraw.today revolution!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
