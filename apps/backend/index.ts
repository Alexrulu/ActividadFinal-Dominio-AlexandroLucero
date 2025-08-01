import express from 'express';
import approveLoanRoute from './routes/approveLoanRoute';
import approveReturnLoanRoute from './routes/approveReturnLoanRoute';
import returnLoanRoute from './routes/returnLoanRoute';
import requestLoanRoute from './routes/requestLoanRoute';
import registerUserRoute from './routes/registerUserRoute';

const app = express();
app.use(express.json());
app.use('/loans/approve', approveLoanRoute);
app.use('/loans/approvereturn', approveReturnLoanRoute);
app.use('/loans/return', returnLoanRoute);
app.use('/loans/request', requestLoanRoute);
app.use('/users/register', registerUserRoute);





app.get('/', (req, res) => {
  res.send('Funcionando');
});

app.listen(3000, () => {
  console.log('El servidor esta corriendo en el puerto 3000');
});