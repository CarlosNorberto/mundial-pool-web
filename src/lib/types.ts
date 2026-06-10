import type { Stage } from './constants/stages';

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type Match = {
    id: string;
    home_team: string;
    away_team: string;
    home_score: number | null;
    away_score: number | null;
    winner_team: string | null;
    kickoff_at: string;
    stage: Stage;
    status: MatchStatus;
    group_name: string | null;
};

export type Prediction = {
    id: string;
    user_id: string;
    match_id: string;
    home_score: number;
    away_score: number;
    winner_team: string | null;
    points: number | null;
    created_at: string;
    updated_at: string;
};

export type Profile = {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
};

export type LeaderboardEntry = {
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    total_points: number;
    exact_matches: number;
    exact_predictions: number;
    correct_predictions: number;
    total_predictions: number;
};