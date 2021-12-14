import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';

import CharacterList from './components/Characters/CharacterList';
import FilmList from './components/Films/FilmList';

function App() {
  const [films, setFilms] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    getFilms();
    getCharacters();
  }, []); //ignore this elist error
  const getFilms = async () => {
    const resp = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/films`, {
      headers: {
        // method: 'GET',
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
      },
    });

    const data = await resp.json();
    const filmData = data.map((item) => [
      item.title,
      item.title.toLowerCase().replace(/ /g, '-'),
      item.box_office_total.toFixed().replace(/.0+$/, '0'), //needs 1 extra 0 still
      item.academy_award_nominations,
    ]);
    setFilms(filmData);
    return [FilmList];
  };

  const getCharacters = async () => {
    const resp = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/characters`, {
      headers: {
        // method: 'GET',
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
      },
    });
    const data = await resp.json();
    const characterData = data.map((item) => [item.date, item.dates]);

    setCharacters(characterData);
    return [CharacterList];
  };

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavLink to="/films" data-testid="film-link">
            Films
          </NavLink>
          <NavLink to="/characters" data-testid="character-link">
            Characters
          </NavLink>
        </header>
        <Switch>
          <Route path="/characters">
            <CharacterList characters={characters} setCharacters={setCharacters} />
          </Route>
          <Route path="/films">
            <FilmList films={films} setFilms={setFilms} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
