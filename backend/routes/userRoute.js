import express from 'express';
import { User } from '../models/userModel.js'
import { Account } from '../models/accountModel.js'
const router = express.Router();

const generatecustomerNumber = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

router.get('/', async (request, response) => {
  try {
    const users = await User.find({});

    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const user = await User.findById(id);

    return response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/no/:customerNumber', async (request, response) => {
  try {
    const { customerNumber  } = request.params
    const user = await User.findOne({customerNumber :customerNumber})
    if (!user) {
      return response.status(404).json({ message: 'Customer found' });
    }
    return response.status(200).json(user);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});




router.post('/', async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.surName ||
      !request.body.phoneNumber
    ) {
      return response.status(400).send({
        message: 'Send all required fields: name, surName',
      });
    }
    const randomcustomerNumber = generatecustomerNumber();

    const newUser = {
      name: request.body.name,
      surName: request.body.surName,
      phoneNumber: request.body.phoneNumber,
      customerNumber: randomcustomerNumber.toString(),
    };

    const newAccount = {
      customerNumber: randomcustomerNumber,
      accountNumber: `XXX - ${randomcustomerNumber} DES`,
      ibanNumber: `TRXX XXXX XXXX XXX ${randomcustomerNumber}`
    };
    const user = await User.create(newUser);
    const account = await Account.create(newAccount);

    return response.status(201).send(account);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;