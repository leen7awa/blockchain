import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FaSortDown, FaPlus, FaPaperPlane } from "react-icons/fa6";
import { FaSignOutAlt, FaSpinner, FaKey } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';
import { baseUrl } from '../service/consts';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const Home = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  // const [isShowNetworkModal, setIsShowNetworkModal] = useState(false);
  const [isShowAccountModal, setIsShowAccountModal] = useState(false);
  const [isShowPrivateKeyModal, setIsShowPrivateKeyModal] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState({});
  const [isShowSendingModal, setIsShowSendingModal] = useState(false);
  const [sendingData, setSendingData] = useState({
    fromAccount: '',
    toAccount: '',
    token: '',
    amount: 0
  });

  const [isSending, setIsSending] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({});
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [username, setUsername] = useState("");
  const [key, setKey] = useState("");
  const closePrivateKeyModal = useCallback(() => setIsShowPrivateKeyModal(false), []);
  const closeAccountModal = useCallback(() => setIsShowAccountModal(false), []);
  const showAccountModal = useCallback(() => {
    setIsShowAccountModal(true);
    setIsCreateAccount(false);
  }, []);
  const showSendingModal = useCallback(() => setIsShowSendingModal(true));
  const closeSendingModal = useCallback(() => setIsShowSendingModal(false));

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);
  useEffect(() => {
    loadAccounts();
  }, []);
  useEffect(() => {
    if (Object.keys(account).length) {
      setIsLoadingBalance(true);
      axios.post(`${baseUrl}/balance`, {
        address: account.publicKey
      }).then(response => {
        setBalanceInfo(response.data);
        setIsLoadingBalance(false);
      }).catch(error => {
        setIsLoadingBalance(false);
      });
    }
  }, [account]);

  const loadAccounts = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/accounts`);
      setAccounts(response.data.accounts);
      setUsername(response.data.username);
      if (response.data.accounts.length) setAccount(response.data.accounts[0]);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }, []);

  const createAccount = useCallback(async () => {
    if (!accountName) {
      toast.warning('Account field is required!');
      return;
    }
    if (!privateKey) {
      toast.warning('Private key field is required!');
      return;
    }

    try {
      setIsCreateAccount(true);
      const response = await axios.post(`${baseUrl}/account`, {
        account: accountName,
        privateKey: privateKey
      });
      toast.success(response.data.msg);
      setIsCreateAccount(false);
      loadAccounts();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  }, [accountName, privateKey]);

  const sendToken = useCallback(async () => {
    for (const key in sendingData) {
      if (sendingData[key] === '' || sendingData[key] === 0) {
        toast.warning(`${key.charAt(0).toUpperCase()}${key.slice(1)} field is required!`);
        return;
      }
    }
    try {
      setIsSending(true);
      const response = await axios.post(`${baseUrl}/send-transaction`, sendingData);
      console.log(response);
      setIsSending(false);
      toast.success('Success!');
    } catch (error) {
      setIsSending(false);
      const msg = error.response.data.reason;
      toast.error(`${msg.charAt(0).toUpperCase()}${msg.slice(1)}`);
    }
    setIsShowSendingModal(false);
  }, [sendingData]);

  const selectAccount = useCallback(async (account) => {
    setAccount(account);
    closeAccountModal();
  }, []);

  const showPrivateKey = useCallback((key) => {
    setIsShowAccountModal(false);
    setIsShowPrivateKeyModal(true);
    setKey(key);
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container className='my-2'>
          <Navbar.Brand className='w-25'>

            <Link to={'#'} className='text-decoration-none'>
              <h1 className='my-0'>HD Wallet</h1>
            </Link>
          </Navbar.Brand>
          <Navbar.Brand>
            <div className='d-flex flex-column'>
              <div className='d-flex justify-content-center'>
                <div variant='dark' className='d-flex'>
                  <span>{username}</span>
                </div>
              </div>
              <p className='mb-0 text-center'>{account.publicKey}</p>
            </div>
          </Navbar.Brand>
          <div className='w-25 d-flex justify-content-end align-items-center'>
            <button className='btn btn-dark'
              onClick={() => {
                delete axios.defaults.headers.common['authorization'];
                localStorage.removeItem("auth");
                navigate("/");
              }}>
              <span className='me-2'>Logout</span>
            </button>
          </div>
        </Container>
      </Navbar>
      <Container>
        {!isLoadingBalance ?
          (Object.keys(account).length
            ? <>
              <h1 className='text-center mt-5 display-3 text-secondary'>{balanceInfo.ethBalance} Ethereum</h1>
              <h3 className='text-center mb-5 text-secondary'>${balanceInfo.ethBalance * balanceInfo.ethUsd} USD (1 ETH = ${balanceInfo.ethUsd} USD)</h3>

              <h1 className='text-center mt-5 display-3 text-secondary'>{balanceInfo.optBalance} Optimism</h1>
              <h3 className='text-center mb-5 text-secondary'>${balanceInfo.optBalance * balanceInfo.optUsd} USD (1 OPT = ${balanceInfo.optUsd} USD)</h3>
            </>
            : <h1 className='text-center mt-5 display-3 text-secondary'>No account selected!</h1>
          )
          : <div className='d-flex align-items-center justify-content-center my-5'>
            <Spinner animation="border" role="status" variant='secondary'></Spinner>
            <h5 className='text-secondary m-2 display-6'>Calculating...</h5>
          </div>
        }
        {Object.keys(account).length !== 0 &&
          <div className='d-flex justify-content-center'>
            <Button variant='dark' onClick={showSendingModal}><FaPaperPlane /> Send</Button>
          </div>
        }
      </Container>

      <Modal show={isShowSendingModal} onHide={closeSendingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Send a token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="from" label="From" className='mb-3'>
            <Form.Select aria-label="from" value={sendingData.fromAccount}
              onChange={e => setSendingData({ ...sendingData, fromAccount: e.target.value })}>
              <option value=''>Select a account</option>
              {accounts.map((item, index) =>
                <option value={item.privateKey} key={index}>{item.publicKey.slice(0, 8) + '...' + item.publicKey.slice(-5)}</option>
              )}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId="to" label="To" className='mb-3'>
            <Form.Select aria-label="to" value={sendingData.toAccount}
              onChange={e => setSendingData({ ...sendingData, toAccount: e.target.value })}>
              <option value=''>Select a account</option>
              {accounts.map((item, index) =>
                <option value={item.publicKey} key={index}>{item.publicKey.slice(0, 8) + '...' + item.publicKey.slice(-5)}</option>
              )}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId="token" label="Token" className='mb-3'>
            <Form.Select aria-label="token" value={sendingData.token}
              onChange={e => setSendingData({ ...sendingData, token: e.target.value })}>
              <option value="">Select asset to send</option>
              <option value="ethereum">ethereum</option>
              <option value="optimism">optimism</option>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel controlId="amount" label="Amount">
            <Form.Control type="number" min="0" value={sendingData.amount}
              onChange={e => setSendingData({ ...sendingData, amount: e.target.value })} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" className='w-100' onClick={sendToken}>
            {isSending ? <FaSpinner icon="spinner" className="spinner" /> : <FaPaperPlane />} Send
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isShowPrivateKeyModal} onHide={closePrivateKeyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Private key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{ wordBreak: 'break-all' }} className='my-2 text-center'>{key}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={closePrivateKeyModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isShowAccountModal} onHide={closeAccountModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isCreateAccount ? 'Add account' : 'Select an account'}</Modal.Title>
        </Modal.Header>
        {isCreateAccount
          ? <Modal.Body>
            <p className='mb-0'>Account name</p>
            <input type="text" className='form-control' placeholder='Enter your new account.'
              onChange={e => setAccountName(e.target.value)} />
            <p className='mb-0 mt-3'>Private key</p>
            <input type="text" className='form-control' placeholder='Enter your private key. ex: 0x12345abcdef67890...'
              onChange={e => setPrivateKey(e.target.value)} />
          </Modal.Body>
          : <>
            {accounts.map((item, index) =>
              <Modal.Body className={'border-bottom ' + (account.name === item.name ? 'bg-light' : '')}
                style={{ cursor: 'pointer' }} key={index} onClick={() => selectAccount(item)}>
                <div className='d-flex justify-content-between'>
                  <div>
                    <h5 className='mb-0'>{item.name}</h5>
                    <p className='mb-0'>{`${item.publicKey?.slice(0, 8)}...${item.publicKey?.slice(-5)}`}</p>
                  </div>
                  <Button variant='dark' size='sm' className='my-2'
                    onClick={() => showPrivateKey(item.privateKey)}><FaKey /></Button>
                </div>
              </Modal.Body>)}
          </>
        }
      </Modal>
    </>
  )
}

export default Home