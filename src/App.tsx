import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

import Home from './pages/Home'

export const GenreContext = createContext<any>(null)

const App = () => {
  const [genre, setGenre] = useState({})
  useEffect(() => {
    const getGenre = async () => {
      const { data } = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=396eb3ae36fb979105321e5b3e0c9d43&language=ru-RU'
      )
      return data
    }
    getGenre().then((res) => setGenre(res))
  }, [])
  return (
    <div className="container">
      <GenreContext.Provider value={genre}>
        <Home />
      </GenreContext.Provider>
    </div>
  )
}

export default App
