// src/components/SocialShare.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';

export const SocialShare = ({ gameState, onClose, getBadgeAndRank }) => {
  const [copied, setCopied] = useState(false);
  
  const shareText = `I scored ${gameState.score + gameState.bonusPoints} points as a "${getBadgeAndRank(gameState.score + gameState.bonusPoints, gameState.totalPossibleScore, gameState.icpStatus).badge}" in the ICP Management Simulation! Can you do better? #SkilldémyChallenge #NursingEducation`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-blue-50">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Share Your Achievement
            </CardTitle>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Share your results with friends and colleagues:</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">{shareText}</p>
              <button 
                onClick={copyToClipboard}
                className="flex items-center text-blue-600 text-sm mt-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Share directly to:</p>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto"
                onClick={() => {
                  // In a real implementation, this would open Twitter sharing
                  alert("Would share to Twitter in production");
                }}
              >
                <Twitter className="h-6 w-6 mb-1 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto"
                onClick={() => {
                  alert("Would share to Facebook in production");
                }}
              >
                <Facebook className="h-6 w-6 mb-1 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto"
                onClick={() => {
                  alert("Would share to LinkedIn in production");
                }}
              >
                <Linkedin className="h-6 w-6 mb-1 text-blue-700" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center p-3 h-auto"
                onClick={() => {
                  alert("Would share to WhatsApp in production");
                }}
              >
                <MessageCircle className="h-6 w-6 mb-1 text-green-500" />
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => {
              alert("Would generate a shareable image in production");
            }}
          >
            Generate Shareable Image
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};