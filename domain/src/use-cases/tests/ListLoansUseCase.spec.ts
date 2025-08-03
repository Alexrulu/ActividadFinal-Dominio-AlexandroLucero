import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listLoansUseCase } from '../ListLoansUseCase'
import { createLoan } from '../../entities/Loan'

// Datos de prueba
const loan1 = createLoan({
  id: '1', 
  userId: 'user-1', 
  bookId: 'book-1', 
  from: new Date(), 
  to: new Date()
})
const loan2 = createLoan({
  id: '2', 
  userId: 'user-2', 
  bookId: 'book-2', 
  from: new Date(), 
  to: new Date()
})
const loan3 = createLoan({
  id: '3', 
  userId: 'user-3', 
  bookId: 'book-3', 
  from: new Date(), 
  to: new Date()
})

describe('ListLoansUseCase', () => {
  let loanRepositoryMock: any

  beforeEach(() => {
    loanRepositoryMock = {
      findActiveByUserAndBook: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    }
  })

  it('debería retornar todos los préstamos si el requester es admin', async () => {
    (loanRepositoryMock.findAll as any).mockResolvedValue([loan1, loan2, loan3])
    const result = await listLoansUseCase({
      requesterId: 'admin-id',
      requesterRole: 'admin',
    }, loanRepositoryMock)
    expect(result).toEqual([loan1, loan2, loan3])
    expect(loanRepositoryMock.findAll).toHaveBeenCalledOnce()
    expect(loanRepositoryMock.findByUserId).not.toHaveBeenCalled()
  })

  it('debería retornar solo los préstamos del usuario si el requester es user', async () => {
    (loanRepositoryMock.findByUserId as any).mockResolvedValue([loan1])
    const result = await listLoansUseCase({
      requesterId: 'user-1',
      requesterRole: 'user',
    }, loanRepositoryMock)
    expect(result).toEqual([loan1])
    expect(loanRepositoryMock.findByUserId).toHaveBeenCalledWith('user-1')
    expect(loanRepositoryMock.findAll).not.toHaveBeenCalled()
  })

  it('debería manejar el caso cuando no hay préstamos', async () => {
    (loanRepositoryMock.findAll as any).mockResolvedValue([])
    const result = await listLoansUseCase({
      requesterId: 'admin-id',
      requesterRole: 'admin',
    }, loanRepositoryMock)
    expect(result).toEqual([])
  })
})
