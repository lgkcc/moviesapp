import React from 'react'
import { Alert, Pagination } from 'antd'

import classes from '../pages/Home.module.scss'
import { Movie, MoviesAll, TabsEnum } from '../pages/Home'

import CardMovie from './CardMovie'

interface IContentProps {
  movies: MoviesAll | null
  page: number
  pageChange: (page: number) => void
  tabState: TabsEnum
  addedMark: (value: number, movie: Movie) => void
  currentMark: LocalMark[]
}

export type LocalMark = {
  id: number
  mark: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  genre_ids: number[]
  vote_average: number
}
const MoviesList: React.FC<IContentProps> = ({
  movies,
  page,
  pageChange,
  tabState,
  addedMark,
  currentMark
}) => (
  <>
    {movies?.results?.length === 0 && (
      <Alert
        action="Фильмы по такому запросу не найдены"
        type="warning"
        className={classes.alert}
      />
    )}
    <div className={classes.content}>
      {tabState === TabsEnum.SEARCH &&
        movies?.results.map((movie: Movie) => {
          const localStartEl = currentMark.find(
            (mark: LocalMark) => mark.id === movie.id
          )
          return (
            <CardMovie
              key={movie.id}
              movie={movie}
              addedMark={addedMark}
              mark={localStartEl?.mark || 0}
            />
          )
        })}
      {tabState === TabsEnum.RATED &&
        currentMark?.map((movie: LocalMark) => (
          <CardMovie
            key={movie.id}
            movie={movie}
            addedMark={addedMark}
            mark={movie.mark || 0}
          />
        ))}
    </div>
    {tabState === TabsEnum.SEARCH && movies && movies.total_results > 20 && (
      <Pagination
        current={page}
        defaultPageSize={movies?.results.length}
        onChange={(clickPage) => pageChange(clickPage)}
        total={movies.total_results > 10000 ? 10000 : movies.total_results}
        showSizeChanger={false}
      />
    )}
  </>
)
export default MoviesList
