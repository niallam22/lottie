import Image from 'next/image'

export default function Editing({ careHome, update, close }) {
    return (
      <div className="editing w-full bg-slate-900">
        <h2 className="text-pink-300 font-bold">{careHome.name}</h2>

        <Image 
        className='px-4'
        src='/home.svg' 
        alt="Home drawing"
        width={450}
        height={24}
        />
        <h4 className='text-white m-0'>Description</h4>
        <p className='text-white text-sm pb-2'>{careHome.description}</p>
        <h4 className='text-white m-0'>Rating</h4>
        <p className='text-white text-sm pb-2'>{careHome.rating}/5</p>
        <h4 className='text-white m-0'>Cost per week</h4>
        <p className='text-white text-sm pb-4'>£{careHome.cost}</p>
  
        {/* <label htmlFor="climate">Climate</label>
        <select
          id="climate"
          value={careHome.climate}
          onChange={(e) => update({ ...careHome, description: e.target.value })}
        >
          {["Sunny", "Cloudy", "Raining"].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select> */}
  
        <button className="text-white border-2 rounded-xl my-4" type="button" onClick={() => close()}>
          Close
        </button>
      </div>
    );
  }