import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Signup} />
        <Route path="/quiz" Component={Quiz} />
        <Route path="/result" Component={Result} />
      </Routes>
    </Router>
  );
}

export default App;
