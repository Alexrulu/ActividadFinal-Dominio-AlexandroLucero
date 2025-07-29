import express from 'express';
import approveLoanRoute from './routes/approveLoanRoute';
import approveReturnLoanRoute from './routes/approveReturnLoanRoute';
import returnLoanRoute from './routes/returnLoanRoute';

const app = express();
app.use(express.json());
app.use('/loans/approve', approveLoanRoute);
app.use('/loans/approvereturn', approveReturnLoanRoute);
app.use('/loans/return', returnLoanRoute);




app.get('/', (req, res) => {
  res.send('Funcionando');
});

app.listen(3000, () => {
  console.log('El servidor esta corriendo en el puerto 3000');
});