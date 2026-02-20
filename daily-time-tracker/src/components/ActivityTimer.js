function ActivityTimer({ name }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>00:00:00</p>
      <button>Start</button>
      <button>Stop</button>
    </div>
  );
}

export default ActivityTimer;