import React, { useState } from 'react';
import { Save, Download, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { gameDataService } from '../services/gameDataService';
import { useToast } from './ui/use-toast';

interface SaveLoadGameProps {
  gameState: any;
  scores: any;
  onLoadGame: (gameState: any, scores: any) => void;
  onClose?: () => void;
}

/**
 * Save/Load game component
 * Handles game persistence with Supabase
 */
export const SaveLoadGame: React.FC<SaveLoadGameProps> = ({ 
  gameState, 
  scores, 
  onLoadGame, 
  onClose 
}) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveGame = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Create anonymous session if needed
    let userId = await getCurrentUserId();
    if (!userId) {
      const sessionResult = await gameDataService.createAnonymousSession();
      if (!sessionResult.success) {
        setError('Failed to create session');
        setLoading(false);
        return;
      }
      userId = sessionResult.userId;
    }

    // Save game state
    const result = await gameDataService.saveGameState(userId!, gameState, scores);
    
    if (result.success) {
      setSuccess('Game saved successfully!');
      toast({
        title: "Game Saved",
        description: "Your progress has been saved.",
      });
      
      // Also submit to leaderboard
      const totalScore = Object.values(scores).reduce((sum: number, score: any) => sum + (score || 0), 0);
      await gameDataService.submitToLeaderboard(username, totalScore);
    } else {
      setError(result.error || 'Failed to save game');
    }
    
    setLoading(false);
  };

  const handleLoadGame = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const userId = await getCurrentUserId();
    if (!userId) {
      setError('No saved game found');
      setLoading(false);
      return;
    }

    const result = await gameDataService.loadGameState(userId);
    
    if (result.success && result.data) {
      const loadedState = JSON.parse(result.data.game_state);
      onLoadGame(loadedState, result.data.scores);
      setSuccess('Game loaded successfully!');
      toast({
        title: "Game Loaded",
        description: "Your saved progress has been restored.",
      });
    } else {
      setError(result.error || 'No saved game found');
    }
    
    setLoading(false);
  };

  const getCurrentUserId = async (): Promise<string | null> => {
    const result = await gameDataService.getCurrentUser();
    return result.success ? result.userId || null : null;
  };

  const currentTotalScore = Object.values(scores).reduce((sum: number, score: any) => sum + (score || 0), 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save & Load Game
        </CardTitle>
        <CardDescription>
          Save your progress or load a previous game
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground">Current Score</div>
            <div className="text-2xl font-bold">{currentTotalScore} points</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSaveGame} 
              disabled={loading || !username.trim()}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Game
            </Button>
            
            <Button 
              onClick={handleLoadGame} 
              variant="outline"
              disabled={loading}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Load Game
            </Button>
          </div>
        </div>

        {onClose && (
          <Button onClick={onClose} variant="ghost" className="w-full">
            Close
          </Button>
        )}
      </CardContent>
    </Card>
  );
};