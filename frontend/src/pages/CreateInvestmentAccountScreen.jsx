import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateInvestmentAccountScreen = () => {

    const [loading, setLoading] = useState(false);
    const [currencyType, setCurrencyType] = useState('TRY');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('')
    const [isKVKKApproved, setIsKVKKApproved] = useState(false);
    const [isAgreementApproved, setIsAgreementApproved] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();


    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/account/${id}`)
            .then((response) => {
                setAccountNumber(response.data.accountNumber);
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Please check console');
                console.log(error);
            });
    }, [id]);

    const handleCurrencyChange = (event) => {
        setCurrencyType(event.target.value);
    };

    const confirmTransfer = () => {
        if (!isKVKKApproved || !isAgreementApproved) {
            enqueueSnackbar('Please check KVKK ve sözleşme onaylarını kontrol edin.', { variant: 'warning' });
            return;
        }

        const data = {
            accountName,
            accountCurrencyType: currencyType,
            connectedAccount: accountNumber
        };
        setLoading(true);
        axios
            .post(`http://localhost:5555/investment/${id}`, data)
            .then(() => {
                setLoading(false);
                enqueueSnackbar('Invs account successfully', { variant: 'success' });
                navigate('/');
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error.response ? error.response.data.message : 'An error occurred';
                enqueueSnackbar(errorMessage, { variant: 'error' });
                console.log(error);
            });
    };

    return (
        <div className='p-4 bg-100 min-h-screen'>
            <div className='text-center'>
                <h1 className='text-3xl my-8'><em>Invesment Account</em></h1>
            </div>

            <div className='flex flex-col border border-gray-300 rounded-xl max-w-lg mx-auto p-6 bg-white'>
                <div className='border-2 border-gray-300 rounded-lg px-6 py-4 m-4 relative shadow-lg hover:shadow-2xl text-center'>
                    You need to complete the <strong>SPK Availability Test</strong> before creating the investment account.
                    <button
                        className="bg-sky-500 text-white px-3 py-1 rounded-md text-sm mt-4 end"
                        onClick={() => window.open("https://spk.gov.tr/kurumlar/yatirim-kuruluslari/araci-kurumlar/uygunluk-ve-yerindelik-testleri", "_blank")}
                    >
                        Take SPK Availability Test
                    </button>
                </div>

                <div className='my-4'>
                    <label htmlFor='accountName' className='block mb-2 font-medium text-gray-700'>Account Name</label>
                    <input
                        id='accountName'
                        type='text'
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'

                    />
                </div>
                <div className='my-4'>
                    <label htmlFor='currencyType' className='block mb-2 font-medium text-gray-700'>Currency Type</label>
                    <select
                        id='currencyType'
                        value={currencyType}
                        onChange={handleCurrencyChange}
                        className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
                    >
                        <option value='TRY'>₺ (Türk Lirası)</option>
                        <option value='USD'>$ (ABD Doları)</option>
                        <option value='EUR'>€ (Euro)</option>
                    </select>
                </div>


                <div className='my-4'>
                    <label htmlFor='accountNumber' className='block mb-2 font-medium text-gray-700'>LINKED ACCOUNT</label>
                    <input
                        id='linkedAccount'
                        type='text'
                        value={accountNumber}
                        disabled
                        className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
                        placeholder='Bank Swift Code'
                    />
                </div>

                <div className='my-1'>
                    <label className='block mb-2 font-medium text-gray-700'>
                        <input
                            type='checkbox'
                            className='mr-2'
                            onChange={(e) => setIsKVKKApproved(e.target.checked)}
                        />
                        KVKK Consent
                    </label>
                </div>

                <div className='my-1'>
                    <label className='block mb-2 font-medium text-gray-700'>
                        <input
                            type='checkbox'
                            className='mr-2'
                            onChange={(e) => setIsAgreementApproved(e.target.checked)}
                        />
                        Agreement Consent
                    </label>
                </div>


                <button
                    className="bg-sky-500 text-white px-3 py-1 rounded-md text-sm"
                    onClick={confirmTransfer}
                >
                    Create Account
                </button>

            </div>
        </div>
    )
}

export default CreateInvestmentAccountScreen
