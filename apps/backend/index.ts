import express from 'express';
import cors from 'cors';

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
app.use(cors());

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

app.use(cors({
  origin: "http://localhost:5173"
}));

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});