
import Navbar from './components/Navbar'
import Home from './contents/Home'
import About from './contents/About'
import Curriculum from './contents/Curriculum'
import Projects from './contents/Projects'
import Contact from './contents/Contact'

import './App.css';
import {
BrowserRouter as Router,
Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/about">
          <About />
        </Route>

        <Route exact path="/cv">
          <Curriculum />
        </Route>

        <Route exact path="/projects">
          <Projects />
        </Route>

        <Route exact path="/contact">
          <Contact />
        </Route>

      </div>
    </Router>
   
  );
}

export default App;
