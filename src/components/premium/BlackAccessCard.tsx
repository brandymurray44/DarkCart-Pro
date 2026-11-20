"use client";

import { useState } from "react";
import { Button, Badge, Card, CardHeader, CardContent, CardFooter } from "@/components/ui";

interface BlackAccessCardProps {
  isSubscribed?: boolean;
  onUpgrade?: () => void;
}

export function BlackAccessCard({ isSubscribed = false, onUpgrade }: BlackAccessCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card variant={isSubscribed ? "intelligence" : "classified"}>
      {isSubscribed && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          ACTIVE
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🔒</div>
          <div>
            <h3 className="text-xl font-bold text-white">BLACK ACCESS</h3>
            <p className="text-sm text-purple-300">Premium Intelligence Tier</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="intelligence" pulse>TOP-SECRET</Badge>
            <span className="text-sm text-slate-300">Trend Intelligence</span>
          </div>
          
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">▸</span>
              <span>Access to classified trend data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">▸</span>
              <span>Advanced competitor threat analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">▸</span>
              <span>Real-time market intelligence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">▸</span>
              <span>Exclusive AI-powered insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">▸</span>
              <span>Priority support access</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded p-3">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            $49<span className="text-sm text-slate-400">/month</span>
          </div>
          <p className="text-xs text-slate-400">Classified Intelligence Subscription</p>
        </div>
      </CardContent>

      <CardFooter>
        {isSubscribed ? (
          <Button variant="secondary" className="w-full" disabled>
            ACCESS GRANTED
          </Button>
        ) : (
          <Button 
            variant="primary" 
            className="w-full"
            glitch={isHovered}
            onClick={onUpgrade}
          >
            UPGRADE TO BLACK ACCESS
          </Button>
        )}
      </CardFooter>
      </Card>
    </div>
  );
}
