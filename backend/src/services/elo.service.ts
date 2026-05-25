// ELO Rating System Service for Risk Game
// Implements standard ELO algorithm with K-factor adjustments

export class EloService {
  private static readonly K_FACTOR = 32; // Standard K-factor for ELO calculation
  private static readonly MIN_K_FACTOR = 16; // Minimum K-factor for experienced players
  private static readonly MAX_K_FACTOR = 64; // Maximum K-factor for new players

  /**
   * Calculate expected score based on ELO ratings
   * @param ratingA Player A's rating
   * @param ratingB Player B's rating
   * @returns Expected score for Player A (0 to 1)
   */
  static calculateExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  /**
   * Calculate new ELO ratings after a game
   * @param ratingA Player A's current rating
   * @param ratingB Player B's current rating
   * @param scoreA Player A's actual score (1 for win, 0.5 for draw, 0 for loss)
   * @returns [newRatingA, newRatingB]
   */
  static calculateNewRatings(
    ratingA: number,
    ratingB: number,
    scoreA: number
  ): [number, number] {
    const expectedA = this.calculateExpectedScore(ratingA, ratingB);
    const expectedB = this.calculateExpectedScore(ratingB, ratingA);

    const newRatingA = ratingA + this.getKFactor(ratingA) * (scoreA - expectedA);
    const newRatingB = ratingB + this.getKFactor(ratingB) * ((1 - scoreA) - expectedB);

    return [Math.round(newRatingA), Math.round(newRatingB)];
  }

  /**
   * Calculate K-factor based on player experience
   * @param rating Current player rating
   * @returns Appropriate K-factor
   */
  private static getKFactor(rating: number): number {
    // New players (below 2100) get higher K-factor
    if (rating < 2100) return this.MAX_K_FACTOR;
    // Experienced players (2100-2400) get standard K-factor
    if (rating < 2400) return this.K_FACTOR;
    // Master players (above 2400) get lower K-factor
    return this.MIN_K_FACTOR;
  }

  /**
   * Calculate ELO changes for a multiplayer game
   * @param playerRatings Array of player ratings
   * @param playerScores Array of player scores (1 for win, 0 for loss)
   * @returns Array of ELO changes for each player
   */
  static calculateMultiplayerElo(
    playerRatings: number[],
    playerScores: number[]
  ): number[] {
    if (playerRatings.length !== playerScores.length) {
      throw new Error('Ratings and scores arrays must have the same length');
    }

    const numPlayers = playerRatings.length;
    const eloChanges = new Array(numPlayers).fill(0);

    // Calculate head-to-head results for each player
    for (let i = 0; i < numPlayers; i++) {
      let totalExpected = 0;
      let totalActual = 0;

      for (let j = 0; j < numPlayers; j++) {
        if (i !== j) {
          const expected = this.calculateExpectedScore(playerRatings[i], playerRatings[j]);
          const actual = playerScores[i] > playerScores[j] ? 1 : 
                         playerScores[i] < playerScores[j] ? 0 : 0.5;
          
          totalExpected += expected;
          totalActual += actual;
        }
      }

      const kFactor = this.getKFactor(playerRatings[i]);
      eloChanges[i] = Math.round(kFactor * (totalActual - totalExpected) / (numPlayers - 1));
    }

    return eloChanges;
  }

  /**
   * Calculate ELO rating based on win probability
   * @param winProbability Probability of winning (0 to 1)
   * @param opponentRating Opponent's rating
   * @returns Required rating to achieve that win probability
   */
  static calculateRatingFromWinProbability(
    winProbability: number,
    opponentRating: number
  ): number {
    if (winProbability <= 0 || winProbability >= 1) {
      throw new Error('Win probability must be between 0 and 1 (exclusive)');
    }
    
    const ratingDiff = -400 * Math.log10(1 / winProbability - 1);
    return opponentRating + ratingDiff;
  }

  /**
   * Calculate rating difference for a given win probability
   * @param winProbability Probability of winning (0 to 1)
   * @returns Rating difference needed
   */
  static calculateRatingDifference(winProbability: number): number {
    if (winProbability <= 0 || winProbability >= 1) {
      throw new Error('Win probability must be between 0 and 1 (exclusive)');
    }
    
    return -400 * Math.log10(1 / winProbability - 1);
  }

  /**
   * Get rating category based on ELO score
   * @param elo ELO rating
   * @returns Category name
   */
  static getRatingCategory(elo: number): string {
    if (elo < 1200) return 'Novice';
    if (elo < 1400) return 'Beginner';
    if (elo < 1600) return 'Intermediate';
    if (elo < 1800) return 'Advanced';
    if (elo < 2000) return 'Expert';
    if (elo < 2200) return 'Master';
    if (elo < 2400) return 'Grandmaster';
    return 'Legendary';
  }

  /**
   * Calculate seasonal bonus based on performance
   * @param currentElo Current ELO rating
   * @param gamesPlayed Number of games played in season
   * @returns Seasonal bonus multiplier (1.0 = no bonus)
   */
  static calculateSeasonalBonus(currentElo: number, gamesPlayed: number): number {
    let bonus = 1.0;
    
    // Activity bonus for playing many games
    if (gamesPlayed >= 50) bonus += 0.05;
    if (gamesPlayed >= 100) bonus += 0.10;
    if (gamesPlayed >= 200) bonus += 0.15;
    
    // Performance bonus for high ELO
    if (currentElo >= 2000) bonus += 0.10;
    if (currentElo >= 2200) bonus += 0.20;
    if (currentElo >= 2400) bonus += 0.30;
    
    return bonus;
  }

  /**
   * Calculate ELO gain for winning a game
   * @param playerRating Player's current rating
   * @param opponentRating Opponent's rating
   * @returns ELO gain for winning
   */
  static calculateWinGain(playerRating: number, opponentRating: number): number {
    const expected = this.calculateExpectedScore(playerRating, opponentRating);
    return Math.round(this.getKFactor(playerRating) * (1 - expected));
  }

  /**
   * Calculate ELO loss for losing a game
   * @param playerRating Player's current rating
   * @param opponentRating Opponent's rating
   * @returns ELO loss for losing
   */
  static calculateLossLoss(playerRating: number, opponentRating: number): number {
    const expected = this.calculateExpectedScore(playerRating, opponentRating);
    return Math.round(this.getKFactor(playerRating) * (0 - expected));
  }

  /**
   * Calculate ELO change for a draw
   * @param playerRating Player's current rating
   * @param opponentRating Opponent's rating
   * @returns ELO change for a draw
   */
  static calculateDrawChange(playerRating: number, opponentRating: number): number {
    const expected = this.calculateExpectedScore(playerRating, opponentRating);
    return Math.round(this.getKFactor(playerRating) * (0.5 - expected));
  }
}
