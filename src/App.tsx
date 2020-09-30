import React, { Suspense, lazy, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import ExampleCourse from './Courses/exampleCoruse/ExampleCourse'
import { Projects } from './Courses/Projects'
import HomePage from './homepage/HomePage'
import { useUiStore } from './appState'
import shallow from 'zustand/shallow'
// import HomePage from './homepage/HomePage'
// import './App.css'

// const ExampleCourse = lazy(() =>
//   import(/* webpackPrefetch: true */ './Courses/ExampleCourse'),
// )

const App: React.FC<{}> = () => {
  const setIsMobile = useUiStore(state => state.setIsMobile, shallow)
  useLayoutEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      setIsMobile(true)
    }
  }, [])
  return (
    <Suspense fallback={null}>
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/courses" component={Projects} />
        </Switch>
      </Router>
    </Suspense>
  )
}

export default App
