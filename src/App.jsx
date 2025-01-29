import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = '5bdfe5e3bd1d425ebf93198c89ef623b';
const CLIENT_SECRET = '37044d3a6b3a49a381410ed47974f7d0';

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]); 

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };

   
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => console.error("Error al obtener el token de acceso:", error));
  }, []);


  async function search() {
    // Obtener el ID del artista
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    try {
      const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
        .then(response => response.json())
        .then(data => data.artists.items[0].id);

      console.log("El ID del artista es: " + artistID); 

      // Obtener los álbumes del artista
      const returnedAlbums = await fetch("https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50", searchParameters)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setAlbums(data.items); 
        });

    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  }

  return (
    <div className='App'>
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search Artist'
            type='input'
            onKeyDown={event => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map((album, i) => {
            console.log(album);
            return (
              <Card key={i}>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
