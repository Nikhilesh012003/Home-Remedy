
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Key } from 'lucide-react';

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (apiKey: string) => void;
  defaultApiKey: string;
}

export function ApiKeyModal({ open, onOpenChange, onSave, defaultApiKey }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const { toast } = useToast();

  useEffect(() => {
    setApiKey(defaultApiKey);
  }, [defaultApiKey, open]);

  const handleSave = () => {
    if (!apiKey || apiKey.trim() === '') {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Gemini API key",
        variant: "destructive",
      });
      return;
    }

    onSave(apiKey.trim());
    onOpenChange(false);
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved",
      variant: "default",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] p-4 md:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Key className="w-4 h-4 md:w-5 md:h-5" />
            Gemini API Key
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter your Gemini API key to use your own quota for AI recommendations.
            <a 
              href="https://ai.google.dev/tutorials/setup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-2 text-blue-500 hover:underline"
            >
              Get a Gemini API key →
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 md:py-4">
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            className="w-full text-sm md:text-base"
            type="password"
          />
          <p className="text-xs text-gray-500 mt-2">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
        <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">Save API Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
