import axios from 'axios';
import Button from '@mui/material/Button';
import { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState();

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
  }

  const onFileUpload = async() => {
    const data = new FormData();
  
    data.append(
      'photo',
      selectedFile
    );

    const res = await axios({
      method: 'post',
      url: 'http://localhost:1701/api/cv-document/ru/vehicle-certificate',
      data,
      headers: { 'Content-Type': `multipart/form-data; boundary=${data._boundary}`, },
    });
  };
  return (<>
    {/* тело приложения */}
    <Button
      variant="contained"
      component="label"
    >
      Выбрать СТС
      <input
        type="file"
        hidden
        onChange={onFileChange}
      />
    </Button>
    <Button
      variant="contained"
      component="label"
      onClick={onFileUpload}
    >
      Загрузить СТС
    </Button>
  </>);
}

export default App;
