interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send('put', endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send('post', endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send('delete', endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

// Global variables for HTML elements
const baseCurrencySelect = document.getElementById(
  'base-currency'
) as HTMLSelectElement;
const targetCurrencySelect = document.getElementById(
  'target-currency'
) as HTMLSelectElement;
const conversionResult = document.getElementById(
  'conversion-result'
) as HTMLElement;

const API_KEY = '8e54ae7be36bb3535f985aae'; // Replace with your API key
const api = new FetchWrapper(`https://v6.exchangerate-api.com/v6/${API_KEY}/`);

let rates: Record<string, number> = {};

function getConversionRates() {
  const baseCurrency = baseCurrencySelect.value;

  // Fetch the latest conversion rates for the selected base currency
  api
    .get(`latest/${baseCurrency}`)
    .then((data) => {
      rates = data.conversion_rates;
      updateConversionResult();
    })
    .catch((error) => {
      console.error('Error fetching conversion rates:', error);
    });
}

function updateConversionResult() {
  const targetCurrency = targetCurrencySelect.value;
  const conversionRate = rates[targetCurrency];

  if (conversionRate) {
    // Update the conversion result on the page
    conversionResult.textContent = conversionRate.toFixed(2);
  } else {
    conversionResult.textContent = 'N/A';
  }
}

// Add event listeners for currency selection
baseCurrencySelect.addEventListener('change', getConversionRates);
targetCurrencySelect.addEventListener('change', updateConversionResult);

// Initial call to fetch conversion rates
getConversionRates();
