type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

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
  | "Chinese"

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string
  nationality: ActressNationality,
}

function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === 'object' && dati !== null &&
    "id" in dati && typeof dati.id === 'number' &&
    "name" in dati && typeof dati.name === 'string' &&
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    "death_year" in dati && typeof dati.birth_year === 'number' &&
    "biography" in dati && typeof dati.biography === 'string' &&
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === 'string') &&
    "awards" in dati && dati.awards === 'string' &&
    "nationality" in dati && typeof dati.nationality === 'string'
  )
}

async function getActress(id: number) {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const data: unknown = await response.json();
    if (!isActress(data)) {
      throw new Error("Dati non validi")
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return null
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const res = await fetch(`http://localhost:3333/actresses`);
    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: ${res.statusText}`);
    }
    const data: unknown = await res.json();
    if(!(data instanceof Array)) {
      throw new Error("Formato dei dati non valido");
    }
    const attriciValide: Actress[] = data.filter(isActress);
    return attriciValide
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return []
  }
}