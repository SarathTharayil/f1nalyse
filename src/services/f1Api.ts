import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export interface Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  date: string;
  time?: string;
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructors: Array<{
    constructorId: string;
    name: string;
    nationality: string;
  }>;
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

export interface RaceResult {
  position: string;
  grid: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
  points: string;
  status: string;
  Time?: {
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
}

export interface LapTime {
  driverId: string;
  position: string;
  time: string;
  lap: string;
}

export interface PositionChange {
  driverId: string;
  startPosition: string;
  endPosition: string;
  change: number;
}

class F1ApiService {
  async getCurrentSeason() {
    const response = await axios.get(`${BASE_URL}/current.json`);
    return response.data.MRData.RaceTable.season;
  }

  async getNextRace() {
    const response = await axios.get(`${BASE_URL}/current/next.json`);
    return response.data.MRData.RaceTable.Races[0] as Race;
  }

  async getCurrentDriverStandings() {
    const response = await axios.get(`${BASE_URL}/current/driverStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings as DriverStanding[];
  }

  async getCurrentConstructorStandings() {
    const response = await axios.get(`${BASE_URL}/current/constructorStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings as ConstructorStanding[];
  }

  async getDriverStandingsBySeason(season: string) {
    const response = await axios.get(`${BASE_URL}/${season}/driverStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings as DriverStanding[];
  }

  async getConstructorStandingsBySeason(season: string) {
    const response = await axios.get(`${BASE_URL}/${season}/constructorStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings as ConstructorStanding[];
  }

  async getLastRaceResults() {
    const response = await axios.get(`${BASE_URL}/current/last/results.json`);
    const raceData = response.data.MRData.RaceTable.Races[0];
    return {
      race: raceData,
      results: raceData.Results as RaceResult[]
    };
  }

  async getSchedule() {
    const response = await axios.get(`${BASE_URL}/current.json`);
    return response.data.MRData.RaceTable.Races as Race[];
  }

  async getDriverResultsBySeason(season: string, driverId: string) {
    const response = await axios.get(`${BASE_URL}/${season}/drivers/${driverId}/results.json`);
    return response.data.MRData.RaceTable.Races as Array<{
      round: string;
      raceName: string;
      date: string;
      Results: RaceResult[];
    }>;
  }

  async getConstructorResultsBySeason(season: string, constructorId: string) {
    const response = await axios.get(`${BASE_URL}/${season}/constructors/${constructorId}/results.json`);
    return response.data.MRData.RaceTable.Races as Array<{
      round: string;
      raceName: string;
      date: string;
      Results: RaceResult[];
    }>;
  }

  async getRaceResultsByRound(season: string, round: string) {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/results.json`);
    return response.data.MRData.RaceTable.Races[0] as {
      round: string;
      raceName: string;
      date: string;
      Results: RaceResult[];
    };
  }

  async getLapTimesByRound(season: string, round: string, lap: string) {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/laps/${lap}.json`);
    return response.data.MRData.RaceTable.Races[0].Laps[0].Timings as LapTime[];
  }

  async getDriverStandingsProgression(season: string) {
    const response = await axios.get(`${BASE_URL}/${season}/driverStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists as Array<{
      round: string;
      DriverStandings: DriverStanding[];
    }>;
  }

  async getConstructorStandingsProgression(season: string) {
    const response = await axios.get(`${BASE_URL}/${season}/constructorStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists as Array<{
      round: string;
      ConstructorStandings: ConstructorStanding[];
    }>;
  }
}

export const f1Api = new F1ApiService();
