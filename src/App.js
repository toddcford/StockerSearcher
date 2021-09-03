import axios from 'axios'
import './App.css'
import {useState} from 'react'

const subset = ['Name', 'Description', 'Sector', 'Industry', 'MarketCapitalization', 'EPS', '52WeekHigh', '52WeekLow'];


const formatString = (my_string) => {
  my_string = my_string.toLowerCase();
  let words = my_string.split(' ');
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
  return words.join(' ')
}

const filterData = (data) => {
 let filtered_obj = Object.keys(data)
  .filter(key => subset.includes(key))
  .reduce((obj,key) => {
    obj[key] = data[key];
    return obj;
  }, {});

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  filtered_obj['EPS'] = formatter.format(filtered_obj['EPS']);
  filtered_obj['52WeekHigh'] = formatter.format(filtered_obj['52WeekHigh']);
  filtered_obj['52WeekLow'] = formatter.format(filtered_obj['52WeekLow']);
  filtered_obj['MarketCapitalization'] = formatter.format(filtered_obj['MarketCapitalization']);
  filtered_obj['Sector'] = formatString(filtered_obj['Sector']);
  filtered_obj['Industry'] = formatString(filtered_obj['Industry'])

  return filtered_obj;
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    document.getElementById('enter').click();
  }
}
function Table(props) {
  const table = Object.entries(props.data).map((key) => 
    <div className='entry'>
      <h4 className='key'>   {key[0]}  </h4>
      <p  className='value'> {key[1]}  </p>
    </div>
  )
  return table;
}

function App() {
  const [ticker, setTicker] = useState('');
  const [companyData, setCompanyData] = useState({});
  
  var options = {
    method: 'GET',
    url: 'https://alpha-vantage.p.rapidapi.com/query',
    params: {
      function: 'OVERVIEW',
      symbol: ticker,
      outputsize: 'compact',
      datatype: 'json'
    },
    headers: {
      'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
      'x-rapidapi-key': process.env.REACT_APP_API_KEY
    }
  };
  console.log(process.env.REACT_APP_API_KEY);
  const updateCompany = (company) => {
    setTicker(company)
    axios.request(options).then(function (response) {
      setCompanyData(filterData(response.data))
    }).catch(function (error) {
      console.error(error);
    });
   }

  return (
    <div className="App">
      <h1 className='title'> Stock Searcher </h1>
      <label className='header'>   
        <input className='input' type='text' placeholder='Stock ticker...' value={ticker} onChange={(e)=>setTicker(e.target.value)} 
                onKeyDown={(e)=>handleKeyPress(e)}/>
        <button id="enter" className='button' type='submit'onClick={() => updateCompany(ticker)}>Search</button>
      </label>      
      <Table data={companyData} />
    </div>
  );
}

export default App;
