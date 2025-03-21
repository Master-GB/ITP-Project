import './App.css';
import NavigationBar from "./Components/gihanComponent/donationComponent/navBar/nav"
import Footer from './Components/gihanComponent/donationComponent/footer/footer';

function App() {
  return (
  
    <div className="App">
      <NavigationBar/>
      <div className="main-content">
        {/* Your main content goes here */}
        <h1>Welcome to the Donation Platform</h1>
        <p>This is the main content of the page.</p>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
