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

    /**
     * Create a new match
     * @param {Object} matchData - The data for the new match
     * @returns {Promise<Object>} Created match object
     *
     * @example
     * const matchData = {
     *   details: { gameday: 1, date: "2024-09-01T14:00:00Z", stadium: "stadium-uuid", location: "Vienna" },
     *   homeTeamId: "home-team-uuid",
     *   awayTeamId: "away-team-uuid",
     *   homeBlanket: null,
     *   awayBlanket: null,
     *   score: { home: 0, away: 0 },
     *   status: "pending"
     * };
     */
    async createMatch(matchData) {
        return this.apiService.post('matches', matchData);
    }

    /**
     * Update a match by ID
     * @param {string} matchId - The UUID of the match
     * @param {Object} matchData - The data to update
     * @returns {Promise<Object>} Updated match object
     *
     * @example
     * const matchData = {
     *   status: "completed",
     *   score: { home: 3, away: 2 }
     * };
     */
    async updateMatch(matchId, matchData) {
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
     * Add a goal to a match
     * @param {string} matchId - The UUID of the match
     * @param {Object} goalData - The data for the goal
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const goalData = {
     *   playerId: "player-uuid",
     *   scoreTeam: "home",
     *   minute: 45
     * };
     */
    async addGoal(matchId, goalData) {
        return this.apiService.post(`matches/${matchId}/goal`, goalData);
    }

    /**
     * Add a red card to a player in a match
     * @param {string} matchId - The UUID of the match
     * @param {Object} cardData - The data for the red card
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const cardData = {
     *   playerId: "player-uuid",
     *   teamId: "team-uuid",
     *   minute: 30
     * };
     */
    async addRedCard(matchId, cardData) {
        return this.apiService.post(`matches/${matchId}/redCard`, cardData);
    }

    /**
     * Add a yellow card to a player in a match
     * @param {string} matchId - The UUID of the match
     * @param {Object} cardData - The data for the yellow card
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const cardData = {
     *   playerId: "player-uuid",
     *   teamId: "team-uuid",
     *   minute: 15
     * };
     */
    async addYellowCard(matchId, cardData) {
        return this.apiService.post(`matches/${matchId}/yellowCard`, cardData);
    }

    /**
     * Add a yellow-red card to a player in a match
     * @param {string} matchId - The UUID of the match
     * @param {Object} cardData - The data for the yellow-red card
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const cardData = {
     *   playerId: "player-uuid",
     *   teamId: "team-uuid",
     *   minute: 50
     * };
     */
    async addYellowRedCard(matchId, cardData) {
        return this.apiService.post(`matches/${matchId}/yellowRedCard`, cardData);
    }

    /**
     * Add a player to the home blanket
     * @param {string} matchId - The UUID of the match
     * @param {Object} playerData - The data for the player
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const playerData = {
     *   playerId: "player-uuid"
     * };
     */
    async addPlayerToHomeBlankett(matchId, playerData) {
        return this.apiService.post(`matches/${matchId}/homeBlankett/addPlayer`, playerData);
    }

    /**
     * Add a player to the away blanket
     * @param {string} matchId - The UUID of the match
     * @param {Object} playerData - The data for the player
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const playerData = {
     *   playerId: "player-uuid"
     * };
     */
    async addPlayerToAwayBlankett(matchId, playerData) {
        return this.apiService.post(`matches/${matchId}/awayBlankett/addPlayer`, playerData);
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
     * Mark a game as a no-show
     * @param {string} matchId - The UUID of the match
     * @param {Object} noShowData - Data for the no-show (winning team)
     * @returns {Promise<Object>} Response status
     *
     * @example
     * const noShowData = {
     *   winningTeam: "home"
     * };
     */
    async noShowGame(matchId, noShowData) {
        return this.apiService.patch(`matches/${matchId}/noShowGame`, noShowData);
    }
}

export default MatchController;
