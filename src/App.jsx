import Conatainer from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Textfield from '@mui/material/TextField';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY_WEATHER
}&q=`;

export default function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: '',
  });

  const [weather, setWeather] = useState({
    city: '',
    country: '',
    temp: '',
    condition: '',
    icon: '',
    conditionText: '',
    temp_c: '',
  });

  const sendForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: error.message,
    });

    try {
      if (!city.trim()) throw { message: 'City is required' };
      const res = await fetch(`${API_WEATHER}${city}`);
      const data = await res.json();
      if (data.error) throw { message: data.error.message };
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Conatainer
      maxWidth='xs'
      sx={{
        mt: 2,
        backgroundColor: 'grey.300',
        borderRadius: '10px',
        border: '1px solid grey',
      }}>
      <Typography variant='h3' component='h1' align='center' gutterBottom>
        Weather App
      </Typography>

      <Box
        sx={{ display: 'grid', gap: 2 }}
        component='form'
        autoComplete='off'
        onSubmit={sendForm}>
        <Textfield
          id='city'
          label='City'
          variant='outlined'
          size='small'
          required
          fullWidth
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />
        <LoadingButton
          type='submit'
          loading={loading}
          loadingIndicator='Loading...'
          endIcon={<SendIcon />}>
          Search
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gap: 2,
            textAlign: 'center',
          }}>
          <Typography variant='h4' component='h2'>
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component='img'
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: '0 auto' }}
          />
          <Typography
            variant='h5'
            component='h3'
            sx={{
              color: 'black',
            }}>
            {weather.temp} °C
          </Typography>
          <Typography variant='h6' component='h4'>
            {weather.conditionText}
          </Typography>
        </Box>
      )}
      <Typography textAlign='center' sx={{ mt: 2, fontSize: '10px' }}>
        Powered by:{' '}
        <a href='https://www.weatherapi.com/' title='Weather API'>
          WeatherAPI.com
        </a>
      </Typography>
    </Conatainer>
  );
}
