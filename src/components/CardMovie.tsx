import React, { useContext } from 'react'
import { Card, Rate, Tag } from 'antd'

import { GenreContext } from '../App'
import { Movie } from '../pages/Home'
import classes from '../pages/Home.module.scss'

const { Meta } = Card

interface ICardMovieProps {
  movie: Movie
  addedMark: (value: number, movie: Movie) => void
  mark: number
}

type GenreType = {
  id: number
  name: string
}

const urlImage = 'https://image.tmdb.org/t/p/w500'

const CardMovie = ({ movie, addedMark, mark }: ICardMovieProps) => {
  const { genres } = useContext(GenreContext)
  let styleMark = classes.mark
  if (movie.vote_average >= 3 && movie.vote_average < 5) {
    styleMark = `${classes.mark} ${classes.normal}`
  } else if (movie.vote_average >= 5 && movie.vote_average < 7) {
    styleMark = `${classes.mark} ${classes.good}`
  } else if (movie.vote_average >= 7) {
    styleMark = `${classes.mark} ${classes.excellent}`
  }
  return (
    <Card
      key={movie.id}
      className={classes.card}
      cover={
        <img
          alt="example"
          src={
            movie.poster_path
              ? urlImage + movie.poster_path
              : 'http://mixstuff.ru/wp-content/uploads/2021/08/kino.jpg'
          }
        />
      }
    >
      <div className={styleMark}>{movie.vote_average}</div>
      <Meta title={movie.title} />
      <div>{movie.release_date}</div>
      <div className={classes.tags}>
        {movie.genre_ids.map((genreId) => (
          <Tag key={genreId} className={classes.tag}>
            {genres?.find((genre: GenreType) => genre.id === genreId).name}
          </Tag>
        ))}
      </div>
      <Meta
        description={`${
          movie?.overview.split(' ').slice(0, 15).join(' ') ||
          'К данному фильму нету описания :('
        }${movie?.overview.split(' ').length > (15 || 0) ? '...' : ''}`}
      />
      <Rate
        allowHalf
        className={classes.rate}
        count={10}
        value={mark}
        onChange={(value: number) => addedMark(value, movie)}
      />
    </Card>
  )
}

export default CardMovie
