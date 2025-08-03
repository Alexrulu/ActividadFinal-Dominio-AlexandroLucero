import express from 'express';

import requestLoanRoute from './routes/requestLoanRoute';
import approveLoanRoute from './routes/approveLoanRoute';
import returnLoanRoute from './routes/returnLoanRoute';
import approveReturnLoanRoute from './routes/approveReturnLoanRoute';
import listLoansRoute from './routes/listLoansRoute';

import registerUserRoute from './routes/registerUserRoute';
import authenticateUserRoute from './routes/authenticateUserRoute';
import changeUserRoleRoute from './routes/changeUserRoleRoute';

import manageBooksRoute from './routes/manageBooksRoute';
import listBooksRoute from './routes/listBooksRoute';

const app = express();
app.use(express.json());

app.use('/loans/request', requestLoanRoute);
app.use('/loans/approve', approveLoanRoute);
app.use('/loans/return', returnLoanRoute);
app.use('/loans/approvereturn', approveReturnLoanRoute);
app.use('/loans/list', listLoansRoute);

app.use('/users/register', registerUserRoute);
app.use('/users/authenticate', authenticateUserRoute);
app.use('/users/changeRole', changeUserRoleRoute)

app.use('/books/manage', manageBooksRoute);
app.use('/books/list', listBooksRoute);

app.get('/', (req, res) => {
  res.send('Funcionando');
});

app.listen(3000, () => {
  console.log('El servidor esta corriendo en el puerto 3000');
});