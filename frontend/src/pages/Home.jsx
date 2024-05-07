
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import marmara_logo from'../components/images/marmara_logo.png'
import UserCard from '../components/home/UserCard';
import AccountCard from '../components/home/AccountCard';
import InvestmentAccountCard from '../components/home/InvestmentAccountCard';


const Home = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [investmentAccount, setInvestmentAccount] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/user/6638ad52feffe9bf93eb807f')
      .then((response) => {
        setUser(response.data);
        setLoading(false);
        return axios.get(`http://localhost:5555/account/no/${response.data.customerNumber}`);
      })
      .then((accountResponse) => {
        setAccount(accountResponse.data);
        return axios.get(`http://localhost:5555/investment/getByConnectedAccount/${accountResponse.data.accountNumber}`);
      })
      .then((investmentResponse) => {
        setInvestmentAccount(investmentResponse.data)
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const userName = user ? user.name : '';

  return (
    <div className='p-4 relative'>
      <div className='text-center'>
        <h1 className='text-3xl my-8'><em>Welcome to transfer module </em><strong>{userName}</strong></h1>
        <img src={marmara_logo} alt="Logo" className="w-31 h-auto rounded-full absolute top-0 right-0 mt-4 mr-4 opacity-50" />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 justify-center'>
        {!loading && user && <UserCard user={user} />}
        {!loading && account && <AccountCard account={account} />}
      </div>
      {!loading && investmentAccount && <InvestmentAccountCard investmentAccount={investmentAccount} />}
    </div>
  );
};

export default Home
