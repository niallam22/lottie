export default function Editing({ weather, update, close }) {
    return (
      <div className="editing w-full">
        <h2>Editing {weather.name}</h2>
  
        <label htmlFor="climate">Climate</label>
        <select
          id="climate"
          value={weather.climate}
          onChange={(e) => update({ ...weather, climate: e.target.value })}
        >
          {["Sunny", "Cloudy", "Raining"].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
  
        <label htmlFor="temp">Temperature</label>
        <input
          id="temp"
          type="number"
          value={weather.temp}
          onChange={(e) => update({ ...weather, temp: e.target.value })}
        />
  
        <button type="button" onClick={() => close()}>
          Close
        </button>
      </div>
    );
  }