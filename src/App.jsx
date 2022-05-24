import axios from 'axios';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [textRecognising, setTextRecognising] = useState({
    loading: false,
    recognised: false,
    data: undefined,
  });

  const [formDate, setFormData] = useState();

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
  }

  const onFileUpload = async() => {
    const data = new FormData();
  
    data.append(
      'photo',
      selectedFile
    );
    
    setTextRecognising(prev => ({
      ...prev,
      loading: true,
    }));

    const res = await axios({
      method: 'post',
      url: 'http://localhost:1701/api/cv-document/ru/vehicle-certificate',
      data,
      headers: { 'Content-Type': `multipart/form-data; boundary=${data._boundary}`, },
    });

    setTextRecognising(prev => ({
      ...prev,
      loading: false,
      recognised: true,
      data: res.data,
    }));

    setFormData(Object.fromEntries(Object.entries(res.data).filter(([key, value]) => value !== 'notPSD') ));
  };
  return (
    <Box
      style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}
    >
      <span>Выберите фото свидетельства регистрации ТС</span>
      <Box
        style={{ marginTop: '20px' }}
      >
        {/* тело приложения */}
        <Button
          variant="contained"
          component="label"
        >
          Выбрать СТС
          <input
            type="file"
            hidden
            onChange={ onFileChange }
          />
        </Button>
        <Button
          variant="contained"
          component="label"
          onClick={ onFileUpload }
          style={{marginLeft: '10px'}}
        >
          Загрузить СТС
        </Button>
      </Box>
      <Box
        style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}
      >
        <TextField id="VIM" label="VIM" variant="outlined" style={{ marginTop: '15px' }} value={formDate?.VIM} focused={formDate?.VIM} onChange={ e => { setFormData(prev  => ({ ...prev, VIM: e.target.value})) }}/>
        <TextField id="brand" label="Марка" variant="outlined" style={{ marginTop: '15px' }} value={formDate?.brand} focused={formDate?.brand} onChange={ e => { setFormData(prev  => ({ ...prev, brand: e.target.value})) }}/>
        <TextField id="year" label="Год выпуска" variant="outlined" style={{ marginTop: '15px' }} value={formDate?.year} focused={formDate?.year} onChange={ e => { setFormData(prev  => ({ ...prev, year: e.target.value})) }}/>
        <TextField id="color" label="Цвет" variant="outlined" style={{ marginTop: '15px' }} value={formDate?.color} focused={formDate?.color} onChange={ e => { setFormData(prev  => ({ ...prev, color: e.target.value})) }}/>
        <TextField id="power" label="Мощность" variant="outlined" style={{ marginTop: '15px' }} value={formDate?.power} focused={formDate?.power} onChange={ e => { setFormData(prev  => ({ ...prev, power: e.target.value})) }} />
      </Box>
      {textRecognising.loading && 'Загрузка...'}
      {!textRecognising.loading && textRecognising.recognised &&

        <Box
          style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}
        >
          <span>Распознание завершено</span>
          {Object.entries(textRecognising.data).filter(([key, value]) => value === 'notPSD').length === 0
            ? <span>Все поля распознаны</span>
            : <Box
                style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', color: 'red' }}
              >
                <span>Не все поля распознаны достоверно, пожалуйста, введите данные вручную для следующих полей:</span>
                {Object.keys(Object.fromEntries(Object.entries(textRecognising.data).filter(([key, value]) => value === 'notPSD') )).map(el=> {
                  return (
                    <span>{el}</span>
                  )
                })}
              </Box>
          }
        </Box>
      }
    </Box>
  );
}

export default App;
