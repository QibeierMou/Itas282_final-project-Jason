
import ActivityTimer from "./components/ActivityTimer";
function App() {
   return (
    <div>
      <h1>Daily Time Tracker</h1>

      <ActivityTimer name="Study" />
      <ActivityTimer name="Exercise" />
      <ActivityTimer name="Eating" />
    </div>
  );
}

export default App;
