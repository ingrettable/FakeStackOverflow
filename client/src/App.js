import React from 'react';
import FakeStackOverflow from './components/fakestackoverflow.js';
import MainPage from './components/mainPage.js';

function App() {
  const port = "8000";
  const server = `http://localhost:${port}`;
  const [currentPage, setCurrentPage] = React.useState('welcome');
  const [userData, setUserData] = React.useState({ email: '', password: '', isLoggedIn: false });

  const handleFakeStack = () => {
    setCurrentPage('fakeStack');
  };

  return (
    <div>
      {currentPage === "welcome" && 
        <MainPage server={server} handleFakeStack={handleFakeStack} setUserData={setUserData} />
      }

      {currentPage === "fakeStack" &&  
         <section className="fakeso">
         <link href='https://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' />
         <FakeStackOverflow userData={userData} server={server} />
       </section>
      }
    </div>
  );
}

export default App;
