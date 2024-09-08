import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { baseUrl } from '../service/consts';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

const seeds = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12]
];

const RestoreWallet = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedPhrases, setSeedPhrases] = useState([]);
  const [show, setShow] = useState(true);

  // Fetch seed phrase from the server using the username
  const fetchSeedPhrase = useCallback(async () => {
    if (username.trim() === '') {
      toast.error("Please enter a username");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/fetch-seedphrase`, { username });
      setSeedPhrase(response.data.seedPhrase);
      setSeedPhrases(response.data.seedPhrase.split(' '));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching seed phrase");
    }
  }, [username]);

  // Restore wallet using the entered seed phrase
  const restoreWallet = useCallback(async () => {
    const seedPhraseElems = document.getElementsByTagName('input');
    let tmps = [];
    for (let index = 0; index < seedPhraseElems.length; index++) {
      tmps.push(seedPhraseElems[index].value);
    }

    try {
      const response = await axios.post(`${baseUrl}/restore`, { seedPhrase: tmps.join(' ') });
      
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore wallet");
    }
  }, [navigate]);

  return (
    <Container>
      <div className='d-flex justify-content-center align-items-center flex-column w-100 vh-100'>
        <h4 className='display-1 mb-4'>Seed Phrase</h4>
        <h6 className='mb-4'>use seed phrase to restore wallet</h6>

        {/* Input to enter username */}
        <Container>
          <Row>
            <Col sm>
              <input
                type="text"
                className='form-control mb-2'
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Col>
            <Col sm>
              <button className="btn btn-dark mb-2" onClick={fetchSeedPhrase}>Fetch Seed Phrase</button>
            </Col>
          </Row>

          {/* Display fetched seed phrase */}
          {seedPhrase && show &&
            <Alert variant="info" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Seed Phrase for {username}</Alert.Heading>
              <p>{seedPhrases.map((item, index) => <span key={index} className='me-3'>{`${index + 1}: ${item}`}</span>)}</p>
            </Alert>
          }

          {/* Input fields to enter seed phrase for restoration */}
          {/* <Container>
            {seeds.map((items, key1) =>
              <Row key={key1}>
                {items.map((item, key2) => 
                  <Col key={key1 + '' + key2} sm>
                    <input type="text" className='form-control mb-2' placeholder={item} />
                  </Col>
                )}
              </Row>
            )}
          </Container> */}
        </Container>

        {/* Button to trigger wallet restoration */}
        <div className='d-flex'>
          {/* <button className="btn btn-dark me-1" onClick={restoreWallet}>Restore</button> */}
        </div>
      </div>
    </Container>
  );
};

export default RestoreWallet;
