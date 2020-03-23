import React from 'react';
import logo from './logo.svg';
import './css/App.css';
import NavBar from './components/navBar';
import Feed from './components/feed';
import SearchBar from './components/searchBar';
import LoginForm from './components/loginForm';
function App() {
  return (
      <div>
        <NavBar/>
        <SearchBar/>
        <div className="container" style={{ maxWidth: "100%" }}>
          <div className="row">
            <div className="col">
            </div>
            <div className="col-8">
              <Feed></Feed>
            </div>
            <div className="col">
              <LoginForm></LoginForm>
            </div>
          </div>
        </div>
      </div>
      
  );
}

export default App;
