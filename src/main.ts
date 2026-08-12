type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

type ActressNationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese";

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: ActressNationality;
};

type ActorNationality =
  | ActressNationality
  | "Scottish"
  | "New Zealand"
  | "Hong Kong"
  | "German"
  | "Canadian"
  | "Irish";

type Actor = Person & {
  knwon_for: [string, string, string];
  awards: [string] | [string, string];
  nationality: ActorNationality;
};

function isPerson(dati: unknown): dati is Person {
  return (
    typeof dati === "object" &&
    dati !== null &&
    "id" in dati &&
    typeof dati.id === "number" &&
    "name" in dati &&
    typeof dati.name === "string" &&
    "birth_year" in dati &&
    typeof dati.birth_year === "number" &&
    (!("death_year" in dati) ||
      typeof dati.death_year === "number" ||
      dati.death_year === null) &&
    "biography" in dati &&
    typeof dati.biography === "string" &&
    "image" in dati &&
    typeof dati.image === "string"
  );
}

function isActress(dati: unknown): dati is Actress {
  return (
    isPerson(dati) &&
    "known_for" in dati &&
    dati.known_for instanceof Array &&
    dati.known_for.length === 3 &&
    dati.known_for.every((m) => typeof m === "string") &&
    "awards" in dati &&
    dati.awards instanceof Array &&
    (dati.awards.length === 1 || dati.awards.length === 2) &&
    dati.awards.every((a) => typeof a === "string") &&
    "nationality" in dati &&
    typeof dati.nationality === "string"
  );
}

function isActor(dati: unknown): dati is Actor {
  return (
    isPerson(dati) &&
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every((m) => typeof m === "string") &&
    "awards" in dati &&
    typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof dati.nationality === "string"
  );
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error("Formato dati non valido");
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell' attrice", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error("Formato dati non valido");
    }
    const validActresses: Actress[] = dati.filter(isActress);
    return validActresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recuperto delle attrici", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map((id) => getActress(id));
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recuperto delle attrici", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}

function createActress(data: Omit<Actress, "id">): Actress {
  return { ...data, id: Math.floor(Math.random() * 1000) };
}

function updateActress(actress: Actress, updates: Partial<Actress>): Actress {
  return {
    ...actress,
    ...updates,
    id: actress.id,
    name: actress.name,
  };
}

async function getActor(id: number): Promise<Actor | null> {
  try {
    const response = await fetch(`http://localhost:3333/actor/${id}`);
    const dati: unknown = await response.json();
    if (!isActor(dati)) {
      throw new Error("Formato dati non valido");
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recuperto dell'attore", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return null;
  }
}

async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch(`http://localhost:3333/actor`);
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error("Formato dati non valido");
    }
    const validActors: Actor[] = dati.filter(isActor);
    return validActors;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recuperto degli attori", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}

async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = ids.map((id) => getActor(id));
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recuperto degli attori", error);
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}

function createActor(data: Omit<Actor, "id">): Actor {
  return { ...data, id: Math.floor(Math.random() * 1000) };
}

function updateActor(actor: Actor, updates: Partial<Actor>): Actor {
  return {
    ...actor,
    ...updates,
    id: actor.id,
    name: actor.name,
  };
}

async function createRandomCouple(): Promise<[Actress, Actor] | null> {
  const [actresses, actors] = await Promise.all([
    getAllActresses(),
    getAllActors(),
  ]);
  if (actresses.length === 0 || actors.length === 0) {
    return null;
  }
  const randomActress = actresses[Math.floor(Math.random() * actresses.length)];
  const randomActor = actors[Math.floor(Math.random() * actors.length)];
  return [randomActress, randomActor];
}
