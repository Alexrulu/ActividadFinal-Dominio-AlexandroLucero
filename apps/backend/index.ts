import express from 'express';
import cors from 'cors';

import requestLoanRoute from './routes/requestLoanRoute';
import approveLoanRoute from './routes/approveLoanRoute';
import deleteLoanRoute from './routes/deleteLoanRoute';
import returnLoanRoute from './routes/returnLoanRoute';
import approveReturnLoanRoute from './routes/approveReturnLoanRoute';
import listLoansRoute from './routes/listLoansRoute';

import registerUserRoute from './routes/registerUserRoute';
import authenticateUserRoute from './routes/authenticateUserRoute';
import changeUserRoleRoute from './routes/changeUserRoleRoute';
import listUsersRoute from './routes/listUsersRoute';

import listBooksRoute from './routes/listBooksRoute';

import { loanRepo } from './controllers/repositories';

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/loans/request', requestLoanRoute);
app.use('/loans/approve', approveLoanRoute);
app.use('/loans/delete', deleteLoanRoute);
app.use('/loans/return', returnLoanRoute);
app.use('/loans/approvereturn', approveReturnLoanRoute);
app.use('/loans/list', listLoansRoute);

app.use('/users/register', registerUserRoute);
app.use('/users/authenticate', authenticateUserRoute);
app.use('/users/changeRole', changeUserRoleRoute);
app.use('/users/list', listUsersRoute);

app.use('/books/list', listBooksRoute);

app.get('/', (req, res) => {
  res.send('Funcionando');
});

// Cors para Vite
app.use(cors({
  origin: "http://localhost:5173"
}));

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

// Limpiar la memoria al cerrar el servidor
const cleanExit = () => {
  console.log('Limpiando memoria antes de cerrar...');
  loanRepo.clear();
  process.exit();
};

process.on('exit', cleanExit);
process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
