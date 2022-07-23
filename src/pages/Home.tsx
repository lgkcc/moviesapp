import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Spin, Alert, Input, Tabs } from 'antd'
import axios from 'axios'
import debounce from 'lodash.debounce'

import MoviesList, { TLocalMark } from '../components/MoviesList'

import classes from './Home.module.scss'

const { TabPane } = Tabs

export type TMoviesAll = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export type Movie = {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  genre_ids: number[]
  vote_average: number
}

export enum TabsEnum {
  SEARCH = 'search',
  RATED = 'rated'
}

export type TabsType = TabsEnum.SEARCH | TabsEnum.RATED

const tabsArray: TabsType[] = [TabsEnum.SEARCH, TabsEnum.RATED]

const Home: React.FC = () => {
  const [movies, setMovies] = useState<TMoviesAll | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [tabState, setTabState] = useState<TabsType>(TabsEnum.SEARCH)
  const [currentMark, setCurrentMark] = useState<TLocalMark[]>([])

  useEffect(() => {
    const localStorageMovie = localStorage.getItem('movie')
    localStorageMovie && setCurrentMark(JSON.parse(localStorageMovie))
  }, [])

  const addedMark = (value: number, movie: Movie) => {
    const isFindMark: TLocalMark | undefined = currentMark.find(
      (mark) => mark.id === movie.id
    )
    if (isFindMark) {
      const updateMark = currentMark.map((mark: TLocalMark) => {
        if (mark.id === movie.id) {
          return { ...mark, mark: value }
        }
        return mark
      })
      if (value === 0) {
        const removeElement = currentMark.filter((mark) => mark.id !== movie.id)
        setCurrentMark(removeElement)
        localStorage.setItem('movie', JSON.stringify(removeElement))
      } else {
        setCurrentMark(updateMark)
        localStorage.setItem('movie', JSON.stringify(updateMark))
      }
    } else {
      localStorage.setItem(
        'movie',
        JSON.stringify([...currentMark, { mark: value, ...movie }])
      )
      setCurrentMark([...currentMark, { mark: value, ...movie }])
    }
  }
  const loadRef = useRef<boolean>(true)
  useEffect(() => {
    loadRef.current = true
    const fetchMovie = async () => {
      try {
        if (!searchValue) {
          return null
        }
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=396eb3ae36fb979105321e5b3e0c9d43&query=${searchValue}&language=ru-RU&page=${page}`
        )
        return data
      } catch (err) {
        setError(true)
      } finally {
        loadRef.current = false
      }
    }
    fetchMovie().then((res) => setMovies(res))
  }, [searchValue, page])

  const searchChange = useCallback(
    debounce((value: string) => {
      setSearchValue(value)
      setPage(1)
    }, 500),
    []
  )
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    searchChange(e.target.value)
  }
  const pageChange = (onClickPage: number) => setPage(onClickPage)

  if (error) {
    return (
      <div className={classes.home}>
        <Alert
          action="Произошла ошибка, попробуйте позже.."
          type="error"
          className={classes.alert}
        />
      </div>
    )
  }
  const keys: number[] = [1, 2]
  return (
    <div className={classes.home}>
      {loadRef.current ? (
        <Spin size="large" />
      ) : (
        <Tabs
          defaultActiveKey="1"
          centered
          onTabClick={(key: string) => setTabState(tabsArray[+key - 1])}
        >
          {tabsArray.map((tab, index) => (
            <TabPane tab={tab} key={keys[index]}>
              {tab === TabsEnum.SEARCH && (
                <Input
                  placeholder="Type to search..."
                  value={inputValue}
                  onChange={inputChange}
                />
              )}
              <MoviesList
                movies={movies}
                page={page}
                pageChange={pageChange}
                tabState={tabState}
                addedMark={addedMark}
                currentMark={currentMark}
              />
            </TabPane>
          ))}
        </Tabs>
      )}
    </div>
  )
}

export default Home
