export interface DriverMapping {
  apiName: string;
  displayName: string;
  imageFile: string;
  constructor: string;
}

export interface ConstructorMapping {
  apiName: string;
  displayName: string;
  logoFile: string;
  carDesignFile: string;
}

export const driverMappings: DriverMapping[] = [
  // McLaren
  {
    apiName: "piastri",
    displayName: "Oscar Piastri",
    imageFile: "piastri.avif",
    constructor: "McLaren"
  },
  {
    apiName: "norris",
    displayName: "Lando Norris",
    imageFile: "norris.avif",
    constructor: "McLaren"
  },
  // Red Bull Racing
  {
    apiName: "max_verstappen",
    displayName: "Max Verstappen",
    imageFile: "verstappen.avif",
    constructor: "Red Bull"
  },
  {
    apiName: "lawson",
    displayName: "Liam Lawson",
    imageFile: "lawson.avif",
    constructor: "RB F1 Team"
  },
  // Mercedes
  {
    apiName: "russell",
    displayName: "George Russell",
    imageFile: "russell.avif",
    constructor: "Mercedes"
  },
  {
    apiName: "antonelli",
    displayName: "Andrea Kimi Antonelli",
    imageFile: "antonelli.avif",
    constructor: "Mercedes"
  },
  // Ferrari
  {
    apiName: "leclerc",
    displayName: "Charles Leclerc",
    imageFile: "leclerc.avif",
    constructor: "Ferrari"
  },
  {
    apiName: "hamilton",
    displayName: "Lewis Hamilton",
    imageFile: "hamilton.avif",
    constructor: "Ferrari"
  },
  // Williams
  {
    apiName: "albon",
    displayName: "Alexander Albon",
    imageFile: "albon.avif",
    constructor: "Williams"
  },
  {
    apiName: "sainz",
    displayName: "Carlos Sainz",
    imageFile: "sainz.avif",
    constructor: "Williams"
  },
  // Haas F1 Team
  {
    apiName: "ocon",
    displayName: "Esteban Ocon",
    imageFile: "ocon.avif",
    constructor: "Haas F1 Team"
  },
  {
    apiName: "bearman",
    displayName: "Oliver Bearman",
    imageFile: "bearman.avif",
    constructor: "Haas F1 Team"
  },
  // Aston Martin
  {
    apiName: "stroll",
    displayName: "Lance Stroll",
    imageFile: "stroll.avif",
    constructor: "Aston Martin"
  },
  {
    apiName: "alonso",
    displayName: "Fernando Alonso",
    imageFile: "alonso.avif",
    constructor: "Aston Martin"
  },
  // RB F1 Team
  {
    apiName: "hadjar",
    displayName: "Isack Hadjar",
    imageFile: "hadjar.avif",
    constructor: "RB F1 Team"
  },
  {
    apiName: "tsunoda",
    displayName: "Yuki Tsunoda",
    imageFile: "tsunoda.avif",
    constructor: "RB F1 Team"
  },
  // Alpine F1 Team
  {
    apiName: "gasly",
    displayName: "Pierre Gasly",
    imageFile: "gasly.avif",
    constructor: "Alpine F1 Team"
  },
  {
    apiName: "doohan",
    displayName: "Jack Doohan",
    imageFile: "doohan.avif",
    constructor: "Alpine F1 Team"
  },
  {
    apiName: "colapinto",
    displayName: "Franco Colapinto",
    imageFile: "colapinto.avif",
    constructor: "Alpine F1 Team"
  },
  // Sauber
  {
    apiName: "hulkenberg",
    displayName: "Nico Hülkenberg",
    imageFile: "hulkenberg.avif",
    constructor: "Sauber"
  },
  {
    apiName: "bortoleto",
    displayName: "Gabriel Bortoleto",
    imageFile: "bortoleto.avif",
    constructor: "Sauber"
  }
];

export const constructorMappings: ConstructorMapping[] = [
  {
    apiName: "McLaren",
    displayName: "McLaren",
    logoFile: "mclaren.avif",
    carDesignFile: "mclaren-car.avif"
  },
  {
    apiName: "red_bull",
    displayName: "Red Bull",
    logoFile: "red_bull.avif",
    carDesignFile: "redbull-car.avif"
  },
  {
    apiName: "Mercedes",
    displayName: "Mercedes",
    logoFile: "mercedes.avif",
    carDesignFile: "mercedes-car.avif"
  },
  {
    apiName: "Ferrari",
    displayName: "Ferrari",
    logoFile: "ferrari.avif",
    carDesignFile: "ferrari-car.avif"
  },
  {
    apiName: "Williams",
    displayName: "Williams",
    logoFile: "williams.avif",
    carDesignFile: "williams-car.avif"
  },
  {
    apiName: "Haas F1 Team",
    displayName: "Haas F1 Team",
    logoFile: "haas.avif",
    carDesignFile: "haas-car.avif"
  },
  {
    apiName: "Aston Martin",
    displayName: "Aston Martin",
    logoFile: "aston-martin.avif",
    carDesignFile: "aston-martin-car.avif"
  },
  {
    apiName: "RB F1 Team",
    displayName: "RB F1 Team",
    logoFile: "rb.png",
    carDesignFile: "rb-car.avif"
  },
  {
    apiName: "Alpine F1 Team",
    displayName: "Alpine F1 Team",
    logoFile: "alpine.avif",
    carDesignFile: "alpine-car.avif"
  },
  {
    apiName: "Sauber",
    displayName: "Sauber",
    logoFile: "sauber.avif",
    carDesignFile: "sauber-car.avif"
  }
]; 