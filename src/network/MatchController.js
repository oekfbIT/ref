import ApiService from './ApiService';

class MatchController {
    constructor() {
        this.apiService = new ApiService();
    }

    /**
     * Get all matches
     * @returns {Promise<Object[]>} Array of match objects
     */
    async getAllMatches() {
        return this.apiService.get('matches');
    }

    /**
     * Get a match by ID
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Match object
     */
    async getMatchById(matchId) {
        return this.apiService.get(`matches/${matchId}`);
    }

    async getLeagueByMatchId(matchId) {
        return this.apiService.get(`matches/league/${matchId}`);
    }

    /**
     * Create a new match
     * @param {number} gameday - Gameday number
     * @param {string} date - Date of the match in ISO string format
     * @param {string} stadium - UUID of the stadium
     * @param {string} location - Location of the match
     * @param {string} homeTeamId - UUID of the home team
     * @param {string} awayTeamId - UUID of the away team
     * @param {Object|null} homeBlanket - Home blanket data (nullable)
     * @param {Object|null} awayBlanket - Away blanket data (nullable)
     * @param {Object} score - Initial score (home and away)
     * @param {string} status - Match status
     * @returns {Promise<Object>} Created match object
     */
    async createMatch(gameday, date, stadium, location, homeTeamId, awayTeamId, homeBlanket = null, awayBlanket = null, score, status) {
        const matchData = {
            details: { gameday, date, stadium, location },
            homeTeamId,
            awayTeamId,
            homeBlanket,
            awayBlanket,
            score,
            status
        };
        return this.apiService.post('matches', matchData);
    }

    /**
     * Update a match by ID
     * @param {string} matchId - The UUID of the match
     * @param {Object} score - Updated score (home and away)
     * @param {string} status - Updated match status
     * @returns {Promise<Object>} Updated match object
     */
    async updateMatch(matchId, score, status) {
        const matchData = { score, status };
        return this.apiService.patch(`matches/${matchId}`, matchData);
    }

    /**
     * Delete a match by ID
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<void>}
     */
    async deleteMatch(matchId) {
        return this.apiService.delete(`matches/${matchId}`);
    }

    /**
     * Reset a game
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async resetGame(matchId) {
        return this.apiService.get(`matches/${matchId}/resetGame`);
    }

    /**
     * Reset halftime of a game
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async resetHalftime(matchId) {
        return this.apiService.get(`matches/${matchId}/resetHalftime`);
    }

    /**
     * Add a goal to a match
     * @param {string} matchId - The UUID of the match
     * @param {string} playerId - UUID of the player
     * @param {string} scoreTeam - Team to which the score belongs ("home" or "away")
     * @param {number} minute - Minute of the goal
     * @param {string} name - Name of the player
     * @param {string} image - Image URL of the player
     * @param {string} number - Player's number
     * @returns {Promise<Object>} Response status
     */
    async addGoal(matchId, playerId, scoreTeam, minute, name, image, number, ownGoal = false) {
        const goalData = {
            playerId,
            scoreTeam,
            minute,
            name,
            image,
            number,
            assign: scoreTeam,  // "home" or "away" based on scoreTeam
            ownGoal               // Pass the ownGoal value
        };
        return this.apiService.post(`matches/${matchId}/goal`, goalData);
    }

    /**
     * Add a red card to a player in a match
     * @param {string} matchId - The UUID of the match
     * @param {string} playerId - UUID of the player
     * @param {string} teamId - UUID of the team
     * @param {number} minute - Minute of the card
     * @param {string} name - Name of the player
     * @param {string} image - Image URL of the player
     * @param {string} number - Player's number
     * @returns {Promise<Object>} Response status
     */
    async addRedCard(matchId, playerId, teamId, minute, name, image, number) {
        const cardData = {
            playerId,
            teamId,
            minute: parseInt(minute, 10),  // Ensure minute is an integer
            name,
            image,
            number
        };
        return this.apiService.post(`matches/${matchId}/redCard`, cardData);
    }

    /**
     * Add a yellow card to a player in a match
     * @param {string} matchId - The UUID of the match
     * @param {string} playerId - UUID of the player
     * @param {string} teamId - UUID of the team
     * @param {number} minute - Minute of the card
     * @param {string} name - Name of the player
     * @param {string} image - Image URL of the player
     * @param {string} number - Player's number
     * @returns {Promise<Object>} Response status
     */
    async addYellowCard(matchId, playerId, teamId, minute, name, image, number) {
        const cardData = {
            playerId,
            teamId,
            minute: parseInt(minute, 10),  // Ensure minute is an integer
            name,
            image,
            number
        };
        return this.apiService.post(`matches/${matchId}/yellowCard`, cardData);
    }

    /**
     * Add a yellow-red card to a player in a match
     * @param {string} matchId - The UUID of the match
     * @param {string} playerId - UUID of the player
     * @param {string} teamId - UUID of the team
     * @param {number} minute - Minute of the card
     * @param {string} name - Name of the player
     * @param {string} image - Image URL of the player
     * @param {string} number - Player's number
     * @returns {Promise<Object>} Response status
     */
    async addYellowRedCard(matchId, playerId, teamId, minute, name, image, number) {
        const cardData = {
            playerId,
            teamId,
            minute: parseInt(minute, 10),  // Ensure minute is an integer
            name,
            image,
            number
        };
        return this.apiService.post(`matches/${matchId}/yellowRedCard`, cardData);
    }

    /**
     * Add multiple players to the home blanket
     * @param {string} matchId - The UUID of the match
     * @param {string[]} playerIds - Array of player UUIDs
     * @returns {Promise<Object>} Response status
     */
    async addPlayersToHomeBlanket(matchId, playerIds, coach) {
        const playerData = { playerIds, coach };
        return this.apiService.post(`matches/${matchId}/homeBlanket/addPlayers`, playerData);
    }

    /**
     * Add multiple players to the away blanket
     * @param {string} matchId - The UUID of the match
     * @param {string[]} playerIds - Array of player UUIDs
     * @returns {Promise<Object>} Response status
     */
    async addPlayersToAwayBlanket(matchId, playerIds, coach) {
        const playerData = { playerIds, coach };
        return this.apiService.post(`matches/${matchId}/awayBlanket/addPlayers`, playerData);
    }

    /**
     * Start a game
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async startGame(matchId) {
        return this.apiService.patch(`matches/${matchId}/startGame`);
    }

    /**
     * End the first half of a game
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async endFirstHalf(matchId) {
        return this.apiService.patch(`matches/${matchId}/endFirstHalf`);
    }

    /**
     * Start the second half of a game
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async startSecondHalf(matchId) {
        return this.apiService.patch(`matches/${matchId}/startSecondHalf`);
    }

    /**
     * End a game
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async endGame(matchId) {
        return this.apiService.patch(`matches/${matchId}/endGame`);
    }

    /**
     * End a game with Spielabbruch status
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async spielAbbruch(matchId) {
        return this.apiService.patch(`matches/${matchId}/spielabbruch`);
    }

    /**
     * Mark a game as done
     * @param {string} matchId - The UUID of the match
     * @returns {Promise<Object>} Response status
     */
    async done(matchId) {
        return this.apiService.patch(`matches/${matchId}/done`);
    }

    /**
     * Submit a game and update match status to submitted
     * @param {string} matchId - The UUID of the match
     * @param {string} text - The match report text
     * @returns {Promise<Object>} Response status
     */
    async submitGame(matchId, text) {
        const submitData = {
            text
        };
        return this.apiService.patch(`matches/${matchId}/submit`, submitData);
    }

    /**
     * Mark a game as a no-show
     * @param {string} matchId - The UUID of the match
     * @param {string} winningTeam - The team that won due to no-show ("home" or "away")
     * @returns {Promise<Object>} Response status
     */
    async noShowGame(matchId, winningTeam) {
        const noShowData = { winningTeam };
        return this.apiService.patch(`matches/${matchId}/noShowGame`, noShowData);
    }

    /**
     * Toggle the dress for a team's blanket in a match
     * @param {string} matchId - The UUID of the match
     * @param {string} team - The team to toggle dress for ("home" or "away")
     * @returns {Promise<Object>} Response status
     */

    /**
     *  Delete an event from a match and update the score if it's a goal
     *  @param {string} eventId - The UUID of the event to delete
     */
    async deleteEvent(eventId) {
        return this.apiService.delete(`events/${eventId}`);
    }

    async toggleDress(matchId, team) {
        const toggleData = { team };
        return this.apiService.post(`matches/${matchId}/toggle`, toggleData);
    }

}

export default MatchController;
