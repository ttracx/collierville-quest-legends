import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { gameDataService, LeaderboardEntry } from '../services/gameDataService';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';

interface LeaderboardProps {
  currentScore?: number;
  onClose?: () => void;
}

/**
 * Leaderboard component displaying top players
 * Integrates with Supabase to fetch and display high scores
 */
export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    const result = await gameDataService.getLeaderboard(10);
    
    if (result.success) {
      setEntries(result.data || []);
    } else {
      setError(result.error || 'Failed to load leaderboard');
    }
    
    setLoading(false);
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold">{position}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          Fitness Legends Leaderboard
        </CardTitle>
        <CardDescription>
          Top 10 fitness champions of Collierville Quest
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Be the first champion!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  currentScore && entry.total_score === currentScore
                    ? 'border-primary bg-primary/10'
                    : 'border-border'
                }`}
              >
                <div className="flex-shrink-0">
                  {getPositionIcon(index + 1)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{entry.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{entry.total_score}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {onClose && (
          <div className="mt-6 flex justify-center">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};