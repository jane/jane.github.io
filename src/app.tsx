import * as React from 'react'
import Header from './header'
import Repos from './repos'

const storageKey = 'jane.github.io'

const globalStyles = `
html, body {
  margin: 0;
  padding: 0;
  font-family: "Proxima Nova", "Montserrat", "Helvetica Neue", "Noto Sans", sans-serif;
  box-sizing: border-box;
}
`

export type DisplayRepo = {
  description: string,
  language?: string,
  name: string,
  stars: number,
  url: string,
}

type ResponseRepo = {
  archived: boolean,
  description: string,
  fork: boolean,
  html_url: string,
  language?: string,
  name: string,
  stargazers_count: number,
}

type State = {
  repos: Array<DisplayRepo>
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = { repos: [] }
  }

  getFromStorage() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) || '""')
      const now = new Date()
      const then = new Date(data.date)
      if ((+now - +then) / 36e5 <= 24) {
        return Promise.resolve(data.repos)
      }
      return Promise.resolve([])
    } catch (_) {
      return Promise.resolve([])
    }
  }

  setInStorage(repos: Array<DisplayRepo>) {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ repos, date: new Date() })
      )
    } catch (_) {}
  }

  componentDidMount() {
    const style = document.createElement('style')
    style.innerHTML = globalStyles
    document.head.appendChild(style)

    this.getFromStorage().then((repos: Array<DisplayRepo>) => {
      if (repos && repos.length) {
        this.setState({ repos })
      } else {
        fetch('https://api.github.com/users/jane/repos?sort=updated')
          .then((b) => b.json())
          .then((rs: Array<ResponseRepo>) => {
            const repos = rs
              .filter((r: ResponseRepo) => !r.fork && !r.archived)
              .map(
                ({
                  description,
                  html_url: url,
                  language,
                  name,
                  stargazers_count: stars,
                }) => ({
                  description,
                  language,
                  name,
                  stars,
                  url,
                })
              )
              .sort((a, b) => b.stars - a.stars)

            this.setInStorage(repos)
            this.setState({ repos })
          })
      }
    })
  }

  render() {
    return (
      <div>
        <Header />
        <Repos repos={this.state.repos} />
      </div>
    )
  }
}
