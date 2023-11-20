// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'

// function App() {
//   return (
//     <section className="fakeso">
//       <FakeStackOverflow />
//     </section>
//   );
// }

function App() {
  const port = "8000";
  const server = `http://localhost:${port}`;

  return (
    <section className="fakeso">
      <link href='https://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' />
      <FakeStackOverflow server={server} />
    </section>
  );
}

export default App;
